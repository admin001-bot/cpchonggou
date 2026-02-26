package handler

import (
	"fmt"
	"io"
	"lottery-system/internal/model"
	"lottery-system/pkg/i18n"
	"lottery-system/pkg/response"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

// BankHandler 银行卡/提款处理器
type BankHandler struct{}

// BankInfoResponse 银行卡信息响应
type BankInfoResponse struct {
	Account   string `json:"account"`   // 提款地址
	CountName string `json:"countName"` // 钱包名称
	Username  string `json:"username"`  // 开户姓名
	RealName  string `json:"realName"`  // 真实姓名（来自用户表）
	BankName  string `json:"bankName"`  // 银行/币种名称
}

// WithdrawConfigResponse 提款配置响应
type WithdrawConfigResponse struct {
	MinMoney      float64 `json:"minMoney"`
	MaxMoney      float64 `json:"maxMoney"`
	CashFromTime  string  `json:"cashFromTime"`
	CashToTime    string  `json:"cashToTime"`
	CashMinAmount int     `json:"cashMinAmount"` // 消费比例要求
}

// WithdrawRequest 提款请求
type WithdrawRequest struct {
	Amount   float64 `json:"amount" binding:"required"`
	CoinPwd  string  `json:"coinPwd" binding:"required"`
}

// WithdrawResponse 提款响应
type WithdrawResponse struct {
	ID        uint    `json:"id"`
	Amount    float64 `json:"amount"`
	State     int8    `json:"state"`
	AddTime   int64   `json:"addTime"`
	Message   string  `json:"message"`
}

// NewBankHandler 创建银行卡处理器
func NewBankHandler() *BankHandler {
	return &BankHandler{}
}

// GetBankInfo 获取用户银行卡信息
func (h *BankHandler) GetBankInfo(c *gin.Context) {
	// 从 context 获取用户 ID
	userID, exists := c.Get("userID")
	if !exists {
		response.Error(c, i18n.T("common.unauthorized"))
		return
	}
	uid := uint(userID.(int))

	// 查询用户信息获取真实姓名
	var user model.User
	if err := model.DB.First(&user, uid).Error; err != nil {
		response.Error(c, i18n.T("bet.user_not_found"))
		return
	}

	// 查询用户银行卡信息
	var bank model.UserBank
	if err := model.DB.Where("uid = ?", uid).First(&bank).Error; err != nil {
		// 没有绑定银行卡
		response.Success(c, BankInfoResponse{
			RealName: user.Name,
		})
		return
	}

	// 获取银行/币种名称
	bankName := "USDT"
	var bankInfo model.BankList
	if err := model.DB.First(&bankInfo, bank.BankID).Error; err == nil {
		bankName = bankInfo.Name
	}

	response.Success(c, BankInfoResponse{
		Account:   bank.Account,
		CountName: bank.CountName,
		Username:  bank.Username,
		RealName:  user.Name,
		BankName:  bankName,
	})
}

// GetWithdrawConfig 获取提款配置
func (h *BankHandler) GetWithdrawConfig(c *gin.Context) {
	// 从数据库查询系统参数
	var params []model.Params
	if err := model.DB.Where("name IN ?", []string{
		"cashMinAmount",
		"cashFromTime",
		"cashToTime",
	}).Find(&params).Error; err != nil {
		// 如果数据库没有，使用默认值
		response.Success(c, WithdrawConfigResponse{
			MinMoney:      10,
			MaxMoney:      2000000,
			CashFromTime:  "09:00",
			CashToTime:    "23:00",
			CashMinAmount: 0,
		})
		return
	}

	config := WithdrawConfigResponse{
		MinMoney:      10,
		MaxMoney:      2000000,
		CashFromTime:  "09:00",
		CashToTime:    "23:00",
		CashMinAmount: 0,
	}

	for _, p := range params {
		switch p.Name {
		case "cashMinAmount":
			val, _ := strconv.Atoi(p.Value)
			config.CashMinAmount = val
		case "cashFromTime":
			config.CashFromTime = p.Value
		case "cashToTime":
			config.CashToTime = p.Value
		}
	}

	response.Success(c, config)
}

// checkWithdrawTime 检查是否在提现时间范围内
func checkWithdrawTime(fromTimeStr, toTimeStr string) (bool, string) {
	now := time.Now()

	fromTime := parseTime(now, fromTimeStr)
	toTime := parseTime(now, toTimeStr)

	if toTime.Before(fromTime) {
		toTime = toTime.Add(24 * time.Hour)
	}

	if now.Before(fromTime) || now.After(toTime) {
		return false, fmt.Sprintf(i18n.T("withdraw.time_range"), fromTimeStr, toTimeStr)
	}

	return true, ""
}

// parseTime 解析时间字符串为 time.Time
func parseTime(base time.Time, timeStr string) time.Time {
	parts := strings.Split(timeStr, ":")
	if len(parts) != 2 {
		return base
	}
	hour := 0
	min := 0
	fmt.Sscanf(parts[0], "%d", &hour)
	fmt.Sscanf(parts[1], "%d", &min)
	return time.Date(base.Year(), base.Month(), base.Day(), hour, min, 0, 0, base.Location())
}

// checkConsumption 检查消费是否满足要求
func checkConsumption(uid uint, cashMinAmount int) (bool, float64, float64) {
	if cashMinAmount == 0 {
		return true, 0, 0
	}

	// 计算 2 天前的时间戳
	rechargeTime := time.Now().AddDate(0, 0, -2)
	rechargeTime = time.Date(rechargeTime.Year(), rechargeTime.Month(), rechargeTime.Day(), 0, 0, 0, 0, rechargeTime.Location())

	// 查询充值总额
	var rechargeTotal float64
	model.DB.Table(model.TableMemberRecharge).
		Select("COALESCE(SUM(CASE WHEN rechargeAmount>0 THEN rechargeAmount ELSE amount END), 0)").
		Where("uid = ? AND state IN (1, 2, 9) AND isDelete = 0 AND addTime >= ?", uid, rechargeTime.Unix()).
		Scan(&rechargeTotal)

	if rechargeTotal == 0 {
		return true, 0, 0
	}

	// 计算要求的消费金额
	requiredAmount := rechargeTotal * float64(cashMinAmount) / 100.0

	// 查询实际消费总额
	var actualAmount float64
	model.DB.Table(model.TableBets).
		Select("COALESCE(SUM(mode * beiShu * actionNum), 0)").
		Where("uid = ? AND actionTime >= ? AND isDelete = 0", uid, rechargeTime.Unix()).
		Scan(&actualAmount)

	if actualAmount < requiredAmount {
		return false, actualAmount, requiredAmount
	}

	return true, actualAmount, requiredAmount
}

// Withdraw 提交提款申请
func (h *BankHandler) Withdraw(c *gin.Context) {
	fmt.Println("=== 提款请求开始 ===")
	fmt.Println("Request URL:", c.Request.URL)
	fmt.Println("Request Method:", c.Request.Method)
	fmt.Println("Content-Type:", c.GetHeader("Content-Type"))

	// 从 context 获取用户 ID
	userID, exists := c.Get("userID")
	if !exists {
		fmt.Println("错误：未授权，userID 不存在")
		response.Error(c, i18n.T("common.unauthorized"))
		return
	}
	fmt.Println("userID:", userID)
	uid := uint(userID.(int))

	var req WithdrawRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		fmt.Println("绑定 JSON 失败:", err)
		bodyBytes, _ := io.ReadAll(c.Request.Body)
		fmt.Println("原始 Body 数据:", string(bodyBytes))
		response.Error(c, i18n.T("bet.param_error")+": "+err.Error())
		return
	}

	fmt.Println("提款请求参数:", req)

	// 验证金额是否为正数
	if req.Amount <= 0 {
		response.Error(c, i18n.T("withdraw.invalid_amount"))
		return
	}
	amount := req.Amount

	// 查询用户信息
	var user model.User
	if err := model.DB.First(&user, uid).Error; err != nil {
		response.Error(c, i18n.T("bet.user_not_found"))
		return
	}

	// 检查余额
	if user.Coin <= 0 {
		response.Error(c, i18n.T("withdraw.insufficient"))
		return
	}

	if user.Coin < amount {
		response.Error(c, i18n.T("withdraw.insufficient"))
		return
	}

	// 查询用户银行卡信息
	var bank model.UserBank
	if err := model.DB.Where("uid = ?", uid).First(&bank).Error; err != nil {
		response.Error(c, i18n.T("withdraw.bank_required"))
		return
	}

	// 验证资金密码
	hashedPwd := md5Hash(req.CoinPwd)
	if user.CoinPassword != "" && user.CoinPassword != hashedPwd {
		response.Error(c, i18n.T("withdraw.password_error"))
		return
	}

	// 检查提现时间
	cashFromTime := "09:00"
	cashToTime := "23:00"
	var params []model.Params
	if err := model.DB.Where("name IN ?", []string{"cashFromTime", "cashToTime"}).Find(&params).Error; err == nil {
		for _, p := range params {
			if p.Name == "cashFromTime" {
				cashFromTime = p.Value
			} else if p.Name == "cashToTime" {
				cashToTime = p.Value
			}
		}
	}

	if valid, msg := checkWithdrawTime(cashFromTime, cashToTime); !valid {
		response.Error(c, msg)
		return
	}

	// 检查消费要求
	var cashMinAmount int
	if err := model.DB.Where("name = ?", "cashMinAmount").First(&model.Params{}).Error; err == nil {
		var p model.Params
		model.DB.Where("name = ?", "cashMinAmount").First(&p)
		val, _ := strconv.Atoi(p.Value)
		cashMinAmount = val
	}

	if cashMinAmount > 0 {
		if valid, actual, required := checkConsumption(uid, cashMinAmount); !valid {
			response.Error(c, fmt.Sprintf(i18n.T("withdraw.consumption_detail"), cashMinAmount, actual, required))
			return
		}
	}

	// 开始事务
	tx := model.DB.Begin()

	// 插入提现请求
	cash := model.MemberCash{
		UID:        uid,
		Amount:     amount,
		BankID:     uint(bank.BankID), // 使用 bankId 字段（银行列表的 ID），而不是 member_bank 的自增 ID
		Account:    bank.Account,
		Username:   bank.Username,
		State:      0, // 待审核
		Info:       i18n.T("withdraw.apply"),
		IsDelete:   0,
		ActionTime: time.Now().Unix(),
	}

	if err := tx.Create(&cash).Error; err != nil {
		tx.Rollback()
		response.Error(c, i18n.T("withdraw.failed"))
		return
	}

	// 冻结资金：coin 减少，fcoin 增加
	updates := map[string]interface{}{
		"coin":  user.Coin - amount,
		"fcoin": user.FCoin + amount,
	}
	if err := tx.Model(&user).Updates(updates).Error; err != nil {
		tx.Rollback()
		response.Error(c, i18n.T("common.error"))
		return
	}

	// 记录资金日志（参考 PHP addCoin 函数逻辑）
	coinLog := model.CoinLog{
		UID:        uid,
		Type:       0,
		LiqType:    106, // 提现冻结类型
		Info:       fmt.Sprintf(i18n.T("withdraw.freeze_info"), cash.ID),
		Coin:       -amount,
		FCoin:      amount,
		UserCoin:   user.Coin - amount,
		ActionTime: time.Now().Unix(),
		ActionUID:  0,
		ActionIP:   0,
		PlayedID:   0,
		ExtField0:  int64(cash.ID), // 对应 PHP 的 extfield0
		ExtField1:  "",
		ExtField2:  "",
	}
	if err := tx.Create(&coinLog).Error; err != nil {
		tx.Rollback()
		response.Error(c, i18n.T("common.error"))
		return
	}

	tx.Commit()

	response.Success(c, WithdrawResponse{
		ID:      cash.ID,
		Amount:  amount,
		State:   0,
		AddTime: cash.ActionTime,
		Message: i18n.T("withdraw.success_message"),
	})
}

// WithdrawRecordResponse 提款记录响应
type WithdrawRecordResponse struct {
	ID           uint    `json:"id"`
	UID          uint    `json:"userId"`
	ApplyMoney   float64 `json:"applyMoney"`
	OrderNo      string  `json:"orderNo"`
	ApplyTime    string  `json:"applyTime"`
	Reason       string  `json:"reason"`
	CheckStatus  int8    `json:"checkStatus"`
	BankName     string  `json:"bankName"`
	BankCard     string  `json:"bankCard"`
	BankAccount  string  `json:"bankAccount"`
}

// RecordsResponse 记录列表响应
type RecordsResponse struct {
	Data       interface{} `json:"data"`
	TotalCount int         `json:"totalCount"`
	OtherData  interface{} `json:"otherData"`
}

// GetWithdrawRecords 获取提款记录列表（完全匹配 PHP getWithDrawList.php 逻辑）
func (h *BankHandler) GetWithdrawRecords(c *gin.Context) {
	// 从 context 获取用户 ID
	userID, exists := c.Get("userID")
	if !exists {
		response.Error(c, i18n.T("common.unauthorized"))
		return
	}
	uid := uint(userID.(int))

	// 获取分页参数
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("rows", "20"))
	if page < 1 {
		page = 1
	}
	if pageSize < 1 {
		pageSize = 20
	}

	// 获取筛选参数
	startDate := c.Query("startDate")
	endDate := c.Query("endDate")
	statusStr := c.Query("status")

	// 构建查询条件
	conditions := "c.isDelete=0 AND c.uid=?"
	args := []interface{}{uid}

	// 日期筛选
	if startDate != "" {
		startTimestamp, err := strconv.ParseInt(startDate, 10, 64)
		if err == nil {
			conditions += " AND c.actionTime >= ?"
			args = append(args, startTimestamp)
		}
	}
	if endDate != "" {
		endTimestamp, err := strconv.ParseInt(endDate, 10, 64)
		if err == nil {
			conditions += " AND c.actionTime <= ?"
			args = append(args, endTimestamp)
		}
	}

	// 状态筛选（PHP 逻辑：0 或 3->待处理/失败，1->已确认，2 或 4->已完成，其他/空->全部）
	var stateCondition string
	if statusStr == "" {
		stateCondition = " AND c.state < 5 "
	} else {
		status, _ := strconv.Atoi(statusStr)
		switch status {
		case 0, 3:
			stateCondition = " AND c.state IN(0,3) "
		case 1:
			stateCondition = " AND c.state=1 "
		case 2, 4:
			stateCondition = " AND c.state IN(2,4) "
		default:
			stateCondition = " AND c.state < 5 "
		}
	}
	conditions += stateCondition

	// 查询总数
	var total int64
	model.DB.Table(model.TableMemberCash+" c").
		Joins("JOIN "+model.TableBankList+" b ON c.bankId=b.id").
		Where(conditions, args...).
		Count(&total)

	// 分页查询
	offset := (page - 1) * pageSize
	type Record struct {
		ID         uint    `gorm:"column:id"`
		UID        uint    `gorm:"column:uid"`
		Amount     float64 `gorm:"column:amount"`
		ActionTime int64   `gorm:"column:actionTime"`
		State      int8    `gorm:"column:state"`
		BankName   string  `gorm:"column:bankName"`
		Account    string  `gorm:"column:account"`
		Username   string  `gorm:"column:username"`
		CountName  string  `gorm:"column:countname"`
	}
	var records []Record

	model.DB.Table(model.TableMemberCash + " c").
		Select("b.name as bankName, c.id, c.uid, c.amount, c.actionTime, c.state, c.account, d.countname, u.username").
		Joins("JOIN "+model.TableBankList+" b ON b.isDelete=0 AND c.bankId=b.id").
		Joins("JOIN "+model.TableMembers+" u ON c.uid=u.uid").
		Joins("JOIN "+model.TableMemberBank+" d ON c.uid=d.uid").
		Where(conditions, args...).
		Order("c.id DESC").
		Offset(offset).
		Limit(pageSize).
		Scan(&records)

	// 格式化返回数据
	var dataList []WithdrawRecordResponse
	for _, r := range records {
		// 如果 actionTime 为 0，使用当前时间作为备用
		actionTime := r.ActionTime
		if actionTime == 0 {
			actionTime = time.Now().Unix()
		}
		dataList = append(dataList, WithdrawRecordResponse{
			ID:          r.ID,
			UID:         r.UID,
			ApplyMoney:  r.Amount,
			OrderNo:     time.Unix(actionTime, 0).Format("20060102150405") + fmt.Sprintf("%d", r.UID),
			ApplyTime:   time.Unix(actionTime, 0).Format("2006-01-02 15:04:05"),
			Reason:      r.BankName + i18n.T("bank.last4") + getCardLast4(r.Account),
			CheckStatus: r.State,
			BankName:    r.BankName,
			BankCard:    r.Account,
			BankAccount: r.Username,
		})
	}

	response.Success(c, RecordsResponse{
		Data:       dataList,
		TotalCount: int(total),
		OtherData:  nil,
	})
}

// getCardLast4 获取银行卡号后 4 位
func getCardLast4(cardNo string) string {
	if len(cardNo) <= 4 {
		return cardNo
	}
	return cardNo[len(cardNo)-4:]
}

// DepositRecordResponse 存款记录响应
type DepositRecordResponse struct {
	ID          uint    `json:"id"`
	UID         uint    `json:"userId"`
	UserName    string  `json:"userName"`
	AccountMoney float64 `json:"accountMoney"`
	RechMoney   float64 `json:"rechMoney"`
	OrderNo     string  `json:"orderNo"`
	AddTime     string  `json:"addTime"`
	Status      int8    `json:"status"`
	RechTime    string  `json:"rechTime"`
	Remark      string  `json:"remark"`
	RechName    string  `json:"rechName"`
	RechType    string  `json:"rechType"`
}

// GetDepositRecords 获取存款记录列表（完全匹配 PHP getRechList.php 逻辑）
func (h *BankHandler) GetDepositRecords(c *gin.Context) {
	// 从 context 获取用户 ID
	userID, exists := c.Get("userID")
	if !exists {
		response.Error(c, i18n.T("common.unauthorized"))
		return
	}
	uid := uint(userID.(int))

	// 获取分页参数
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("rows", "20"))
	if page < 1 {
		page = 1
	}
	if pageSize < 1 {
		pageSize = 20
	}

	// 获取筛选参数
	startDate := c.Query("startDate")
	endDate := c.Query("endDate")
	statusStr := c.Query("status")

	// 构建查询条件
	conditions := "isDelete=0 AND amount>0 AND uid=?"
	args := []interface{}{uid}

	// 日期筛选
	if startDate != "" {
		startTimestamp, err := strconv.ParseInt(startDate, 10, 64)
		if err == nil {
			conditions += " AND actionTime >= ?"
			args = append(args, startTimestamp)
		}
	}
	if endDate != "" {
		endTimestamp, err := strconv.ParseInt(endDate, 10, 64)
		if err == nil {
			conditions += " AND actionTime <= ?"
			args = append(args, endTimestamp)
		}
	}

	// 状态筛选（PHP 逻辑：0=申请，1=手动到账/自动到账/管理员充值，3=充值失败）
	if statusStr != "" {
		status, _ := strconv.Atoi(statusStr)
		switch status {
		case 0:
			conditions += " AND state=0 "
		case 1:
			conditions += " AND state IN(1,2,9) "
		case 3:
			conditions += " AND state=3 "
		}
	}

	// 查询总数
	var total int64
	model.DB.Table(model.TableMemberRecharge).
		Where(conditions, args...).
		Count(&total)

	// 分页查询
	offset := (page - 1) * pageSize
	var records []model.MemberRecharge
	model.DB.Table(model.TableMemberRecharge).
		Where(conditions, args...).
		Order("id DESC").
		Offset(offset).
		Limit(pageSize).
		Find(&records)

	// 格式化返回数据
	var dataList []DepositRecordResponse
	for _, r := range records {
		rechType := "onlinePayment"
		if r.Info == i18n.T("deposit.system") {
			rechType = "adminAddMoney"
		}
		// 根据 info 判断充值方式
		orderNo := r.RechargeID
		if orderNo == "" {
			orderNo = i18n.T("deposit.admin")
		}
		dataList = append(dataList, DepositRecordResponse{
			ID:           r.ID,
			UID:          r.UID,
			UserName:     "", // 可选
			AccountMoney: 0,
			RechMoney:    r.Amount,
			OrderNo:      orderNo,
			AddTime:      time.Unix(r.ActionTime, 0).Format("2006-01-02 15:04:05"),
			Status:       r.State,
			RechTime:     time.Unix(r.ActionTime, 0).Format("2006-01-02 15:04:05"),
			Remark:       r.Info,
			RechName:     r.Info,
			RechType:     rechType,
		})
	}

	response.Success(c, RecordsResponse{
		Data:       dataList,
		TotalCount: int(total),
		OtherData:  nil,
	})
}

// BindAddressRequest 绑定地址请求
type BindAddressRequest struct {
	BankID     uint   `json:"bankId" binding:"required"`
	CardNo     string `json:"cardNo" binding:"required"`   // 钱包名称
	SubAddress string `json:"subAddress" binding:"required"` // 提款地址
}

// BindAddress 绑定提款地址
func (h *BankHandler) BindAddress(c *gin.Context) {
	// 从 context 获取用户 ID
	userID, exists := c.Get("userID")
	if !exists {
		response.Error(c, i18n.T("common.unauthorized"))
		return
	}
	uid := uint(userID.(int))

	var req BindAddressRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, i18n.T("bet.param_error")+": "+err.Error())
		return
	}

	// 检查是否已绑定
	var existingBank model.UserBank
	if err := model.DB.Where("uid = ?", uid).First(&existingBank).Error; err == nil {
		response.Error(c, i18n.T("bank.bindTip"))
		return
	}

	// 获取用户信息
	var user model.User
	if err := model.DB.First(&user, uid).Error; err != nil {
		response.Error(c, i18n.T("bet.user_not_found"))
		return
	}

	// 获取银行名称
	var bankInfo model.BankList
	bankName := "USDT"
	if err := model.DB.First(&bankInfo, req.BankID).Error; err == nil {
		bankName = bankInfo.Name
	}

	// 创建绑定记录
	userBank := model.UserBank{
		UID:       uid,
		Username:  user.Name,
		BankID:    int(req.BankID),
		Account:   req.SubAddress,  // 提款地址
		CountName: req.CardNo,      // 钱包名称
	}

	if err := model.DB.Create(&userBank).Error; err != nil {
		response.Error(c, i18n.T("bank.bindFailed"))
		return
	}

	response.Success(c, gin.H{
		"message":   i18n.T("bank.bindSuccess"),
		"bankName":  bankName,
		"countName": req.CardNo,
		"account":   req.SubAddress,
	})
}
