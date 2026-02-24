package handler

import (
	"fmt"
	"math/rand"
	"net/http"
	"strconv"
	"time"

	"lottery-system/internal/model"
	"lottery-system/pkg/response"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// GameHandler 游戏处理器
type GameHandler struct{}

// NewGameHandler 创建游戏处理器
func NewGameHandler() *GameHandler {
	return &GameHandler{}
}

// GameInfo 游戏信息
type GameInfo struct {
	ID      int    `json:"id"`
	Name   string `json:"name"`
	Title  string `json:"title"`
	Enable int    `json:"enable"`
}

// NextIssueData 下一期数据（与PHP格式一致)
type NextIssueData struct {
	Issue         string `json:"issue"`         // 当前期号
	Endtime       string `json:"endtime"`       // 封盘时间 "2006-01-02 15:04:05"
	LotteryTime   string `json:"lotteryTime"`   // 开奖时间
	PreIssue      string `json:"preIssue"`      // 上期期号
	PreNum        string `json:"preNum"`        // 上期开奖号码
	ServerTime    string `json:"serverTime"`    // 服务器时间
	GameID        int    `json:"gameId"`
}

// CurIssueData 当前开奖数据
type CurIssueData struct {
	Issue    string `json:"issue"`    // 期号
	Nums     string `json:"nums"`     // 开奖号码
}

// PlayInfo 玩法信息
type PlayInfo struct {
	ID           int     `json:"id"`
	GameID       int     `json:"gameId"`
	PlayCateID   int     `json:"playCateId"`
	Name         string  `json:"name"`
	Alias        string  `json:"alias"`
	Odds         float64 `json:"odds"`
	Rebate       float64 `json:"rebate"`
	MinMoney     float64 `json:"minMoney"`
	MaxMoney     float64 `json:"maxMoney"`
	MaxTurnMoney float64 `json:"maxTurnMoney"`
}

// BetRequest 投注请求(与PHP格式一致)
type BetRequest struct {
	GameID     int     `json:"gameId"`
	TurnNum    string `json:"turnNum"`
	FTime      int64  `json:"ftime"`
	TotalNums  int     `json:"totalNums"`
	TotalMoney float64 `json:"totalMoney"`
	BetBean    []struct {
		PlayID  int     `json:"playId"`
		Money   float64 `json:"money"`
		BetInfo string  `json:"betInfo"`
	} `json:"betBean"`
}
// BetResponse 投注响应
type BetResponse struct {
	Success bool        `json:"success"`
	Msg     string      `json:"msg"`
	MsgKey  string      `json:"msgKey"`  // 消息key，用于前端翻译
	MsgArgs []string    `json:"msgArgs"` // 消息参数
	Code    int         `json:"code"`
}
// BetPlayInfo 投注玩法信息
type BetPlayInfo struct {
	ID            int
	Name          string
	PlayedGroupID int
	Odds          float64
	Rebate        float64
	Enable        int8
	MinMoney      int
	MaxMoney      int
	MaxTurnMoney  int
}

// GetGameList 获取游戏列表
func (h *GameHandler) GetGameList(c *gin.Context) {
	games := []GameInfo{
		{ID: 55, Name: "幸运飞艇", Title: "幸运飞艇", Enable: 1},
		{ID: 50, Name: "北京赛车", Title: "北京赛车", Enable: 1},
		{ID: 122, Name: "五分时时彩", Title: "五分时时彩", Enable: 1},
		{ID: 52, Name: "极速飞艇", Title: "极速飞艇", Enable: 1},
		{ID: 66, Name: "PC蛋蛋", Title: "PC蛋蛋", Enable: 1},
		{ID: 100, Name: "极速分分彩", Title: "极速分分彩", Enable: 1},
		{ID: 72, Name: "极速赛车", Title: "极速赛车", Enable: 1},
		{ID: 113, Name: "极速六合", Title: "极速六合", Enable: 1},
	}
	response.Success(c, games)
}

// GetNextIssue 获取下一期期号(与PHP格式一致)
func (h *GameHandler) GetNextIssue(c *gin.Context) {
	gameID := c.Query("gameId")
	if gameID == "" {
		gameID = "55"
	}
	gameIDInt, _ := strconv.Atoi(gameID)

	now := time.Now()
	_, offset := now.Zone()
	if offset < 8*3600 {
		now = now.Add(time.Duration(8*3600-offset) * time.Second)
	}
	var periodSeconds int64 = 300
	var ftime int64 = 30
	var periodsPerDay int = 288
	switch gameID {
	case "55":
		periodSeconds = 300
		ftime = 30
		periodsPerDay = 288
	case "52":
		periodSeconds = 300
		ftime = 10
		periodsPerDay = 288
	case "50":
		periodSeconds = 1200
		ftime = 60
		periodsPerDay = 44
	case "100":
		periodSeconds = 60
		ftime = 5
		periodsPerDay = 1440
	case "72":
		periodSeconds = 75
		ftime = 5
		periodsPerDay = 1152
	case "66":
		periodSeconds = 180
		ftime = 20
		periodsPerDay = 480
	case "70", "113":
		periodSeconds = 86400
		ftime = 1800
		periodsPerDay = 1
	}
	secondsOfDay := int64(now.Hour()*3600 + now.Minute()*60 + now.Second())
	issueNum := int(secondsOfDay/periodSeconds) + 1
	periodStartSeconds := int64(issueNum-1) * periodSeconds
	startHour := int(periodStartSeconds / 3600)
	startMin := int((periodStartSeconds % 3600) / 60)
	startSec := int(periodStartSeconds % 60)
	lotteryTime := time.Date(now.Year(), now.Month(), now.Day(), startHour, startMin, startSec, 0, now.Location())
	nowUnix := now.Unix()
	for nowUnix >= lotteryTime.Unix() && issueNum <= periodsPerDay {
		issueNum++
		lotteryTime = lotteryTime.Add(time.Duration(periodSeconds) * time.Second)
	}
	if issueNum > periodsPerDay {
		issueNum = 1
		tomorrow := now.Add(24 * time.Hour)
		lotteryTime = time.Date(tomorrow.Year(), tomorrow.Month(), tomorrow.Day(), 0, 0, int(periodSeconds), 0, now.Location())
	}
	endTime := lotteryTime.Add(-time.Duration(ftime) * time.Second)
	dateStr := now.Format("20060102")
	issue := fmt.Sprintf("%s%03d", dateStr, issueNum)
	preIssue := ""
	if issueNum > 1 {
		preIssue = fmt.Sprintf("%s%03d", dateStr, issueNum-1)
	} else {
		yesterday := now.Add(-24 * time.Hour)
		preIssue = fmt.Sprintf("%s%03d", yesterday.Format("20060102"), periodsPerDay)
	}
	preNum := ""
	var lastData struct {
		Data   string `gorm:"column:data"`
		Number string `gorm:"column:number"`
	}
	err := model.DB.Table("ssc_data").
		Select("data, number").
		Where("type = ?", gameIDInt).
		Order("number DESC").
		First(&lastData).Error
	if err == nil {
		preNum = lastData.Data
		preIssue = lastData.Number
	}
	response.Success(c, NextIssueData{
		Issue:       issue,
		Endtime:     endTime.Format("2006-01-02 15:04:05"),
		LotteryTime: lotteryTime.Format("2006-01-02 15:04:05"),
		PreIssue:    preIssue,
		PreNum:      preNum,
		ServerTime:  now.Format("2006-01-02 15:04:05"),
		GameID:      gameIDInt,
	})
}

// GetCurrentIssue 获取当前期号(兼容旧接口)
func (h *GameHandler) GetCurrentIssue(c *gin.Context) {
	h.GetNextIssue(c)
}

// PlaceBet 投注(参照PHP Data.class.php postcodea 方法)
func (h *GameHandler) PlaceBet(c *gin.Context) {
    userID, exists := c.Get("userID")
    if !exists {
        c.JSON(http.StatusOK, BetResponse{
            Success: false,
            Msg:     "请先登录",
            MsgKey:  "bet.login_required",
            Code:    401,
        })
        return
    }
    uid := userID.(int)

    var req BetRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusOK, BetResponse{
            Success: false,
            Msg:     "参数错误",
            MsgKey:  "bet.param_error",
            Code:    400,
        })
        return
    }

    betInfo := BetResponse{
        Success: false,
        Msg:     "",
        Code:    0,
    }

    // 获取用户信息
    var user model.User
    if err := model.DB.First(&user, uid).Error; err != nil {
        betInfo.MsgKey = "bet.user_not_found"
        c.JSON(http.StatusOK, betInfo)
        return
    }

    // 判断是否为测试用户
    isTestUser := user.TestFlag == 1
    userPanID := user.PanID

    // 获取系统设置
    settings := getSystemSettings()

    // 检查系统设置
    if settings["switchBuy"] == "0" {
        betInfo.MsgKey = "bet.platform_stopped"
        c.JSON(http.StatusOK, betInfo)
        return
    }
    if settings["switchDLBuy"] == "0" && user.Type == 1 {
        betInfo.MsgKey = "bet.agent_disabled"
        c.JSON(http.StatusOK, betInfo)
        return
    }
    if settings["switchZDLBuy"] == "0" && user.Type == 2 {
        betInfo.MsgKey = "bet.zdl_disabled"
        c.JSON(http.StatusOK, betInfo)
        return
    }
    if settings["switchGDBuy"] == "0" && user.Type == 3 {
        betInfo.MsgKey = "bet.gd_disabled"
        c.JSON(http.StatusOK, betInfo)
        return
    }
    if len(req.BetBean) == 0 {
        betInfo.MsgKey = "bet.select_first"
        c.JSON(http.StatusOK, betInfo)
        return
    }

    gameID := req.GameID
    turnNum := req.TurnNum
    totalNums := req.TotalNums
    totalMoney := req.TotalMoney

    // 获取当前时间
    currentTime := time.Now().Unix()

    // 获取游戏配置(封单时间、当期时间、当期期号)
    ftime, actionTime, actionNo := getGameActionInfo(gameID)

    // 检查封单时间
    if currentTime > (actionTime - ftime) {
        betInfo.MsgKey = "bet.expired"
        betInfo.MsgArgs = []string{turnNum}
        c.JSON(http.StatusOK, betInfo)
        return
    }

    // 检查期号是否正确
    if actionNo != turnNum {
        betInfo.MsgKey = "bet.expired"
        betInfo.MsgArgs = []string{turnNum}
        c.JSON(http.StatusOK, betInfo)
        return
    }

    // 检查游戏是否启用
    var gameEnable int8
    model.DB.Table("ssc_type").Select("enable").Where("id = ?", gameID).Scan(&gameEnable)
    if gameEnable != 1 {
        betInfo.MsgKey = "bet.game_disabled"
        c.JSON(http.StatusOK, betInfo)
        return
    }

    // 检查用户余额
    userAmount := user.Coin
    if userAmount < float64(totalMoney) {
        betInfo.MsgKey = "bet.insufficient"
        c.JSON(http.StatusOK, betInfo)
        return
    }

    // 检查注数
    if totalNums < 1 {
        betInfo.MsgKey = "bet.min_nums"
        c.JSON(http.StatusOK, betInfo)
        return
    }
    if totalNums > 1000 {
        betInfo.MsgKey = "bet.max_nums"
        c.JSON(http.StatusOK, betInfo)
        return
    }
    if totalMoney < 1 {
        betInfo.MsgKey = "bet.min_money"
        c.JSON(http.StatusOK, betInfo)
        return
    }

    // 查询当前期数已投注总额
    var actionNoMoney float64
    betsTable := "ssc_bets"
    if isTestUser {
        betsTable = "ssc_guestbets"
    }
    model.DB.Table(betsTable).
        Select("COALESCE(SUM(money * totalNums), 0)").
        Where("uid = ? AND type = ? AND actionNo = ?", uid, gameID, actionNo).
        Scan(&actionNoMoney)

    // 查询用户单期投注总额限制
    userMaxTurnMoney := user.MaxTurnMoney
    if userMaxTurnMoney > 0 && int(actionNoMoney+float64(totalMoney)) > userMaxTurnMoney {
        betInfo.MsgKey = "bet.period_limit"
        betInfo.MsgArgs = []string{fmt.Sprintf("%d", userMaxTurnMoney), fmt.Sprintf("%.0f", actionNoMoney)}
        c.JSON(http.StatusOK, betInfo)
        return
    }

    // 获取玩法信息
    playedTable := "ssc_played"
    if userPanID == 2 {
        playedTable = "ssc_played2"
    }

    // 验证每注
    for _, code := range req.BetBean {
        playID := code.PlayID
        money := code.Money

        // 获取玩法信息
        var played BetPlayInfo
        err := model.DB.Table(playedTable).
            Select("id, name, played_groupid, odds, rebate, enable, minMoney, maxMoney, maxTurnMoney").
            Where("id = ?", playID).
            First(&played).Error
        if err != nil {
            betInfo.MsgKey = "bet.play_not_found"
            c.JSON(http.StatusOK, betInfo)
            return
        }

        // 检查玩法是否启用
        if played.Enable != 1 {
            betInfo.MsgKey = "bet.play_disabled"
            c.JSON(http.StatusOK, betInfo)
            return
        }

        // 检查玩法ID是否正确
        if played.ID != playID {
            betInfo.MsgKey = "bet.param_error"
            c.JSON(http.StatusOK, betInfo)
            return
        }

        // 查询当前期数每个玩法已投注总额
        var playMoney float64
        model.DB.Table(betsTable).
            Select("COALESCE(SUM(money * totalNums), 0)").
            Where("uid = ? AND type = ? AND actionNo = ? AND playedId = ?", uid, gameID, actionNo, playID).
            Scan(&playMoney)

        // 检查每个玩法的投注总额限制
        maxTurnMoney := played.MaxTurnMoney
        if maxTurnMoney > 0 && int(playMoney)+int(money) > maxTurnMoney {
            var groupName string
            model.DB.Table("ssc_played_group").Select("name").Where("id = ?", played.PlayedGroupID).Scan(&groupName)
            betInfo.MsgKey = "bet.play_limit"
            betInfo.MsgArgs = []string{groupName, played.Name, fmt.Sprintf("%d", maxTurnMoney), fmt.Sprintf("%.0f", playMoney)}
            c.JSON(http.StatusOK, betInfo)
            return
        }

        // 检查用户单注投注金额限制
        userMaxMoney := user.MaxMoney
        if userMaxMoney > 0 && int(money) > userMaxMoney {
            betInfo.MsgKey = "bet.single_limit"
            betInfo.MsgArgs = []string{fmt.Sprintf("%d", userMaxMoney)}
            c.JSON(http.StatusOK, betInfo)
            return
        }

        // 检查单注最低金额
        if int(money) < played.MinMoney {
            betInfo.MsgKey = "bet.min_single"
            betInfo.MsgArgs = []string{fmt.Sprintf("%d", played.MinMoney)}
            c.JSON(http.StatusOK, betInfo)
            return
        }

        // 检查单注最高金额
        if played.MaxMoney > 0 && int(money) > played.MaxMoney {
            betInfo.MsgKey = "bet.max_single"
            betInfo.MsgArgs = []string{fmt.Sprintf("%d", played.MaxMoney)}
            c.JSON(http.StatusOK, betInfo)
            return
        }
    }

    // 开始事务处理
    err := model.DB.Transaction(func(tx *gorm.DB) error {
        randOrderID := rand.Intn(90000) + 10000

        for _, code := range req.BetBean {
            playID := code.PlayID
            money := code.Money
            betInfoStr := code.BetInfo

            var played BetPlayInfo
            tx.Table(playedTable).
                Select("id, name, played_groupid, odds, rebate, enable, minMoney, maxMoney, maxTurnMoney").
                Where("id = ?", playID).
                First(&played)

            var groupName string
            tx.Table("ssc_played_group").Select("name").Where("id = ?", played.PlayedGroupID).Scan(&groupName)

            userRebate := played.Rebate
            if user.Rebate > 0 {
                userRebate = user.Rebate
            }

            wjOrderID := fmt.Sprintf("%s%s", time.Now().Format("20060102150405"), randomString(10))
            orderID := fmt.Sprintf("%s%d", time.Now().Format("20060102150405"), randOrderID)
            serializeID := fmt.Sprintf("%d%d", time.Now().UnixNano(), rand.Intn(10000))

            amount := money
            totalMoneyForBet := float64(totalMoney)
            totalNumsForBet := totalNums

            if betInfoStr != "" {
                totalNumsForBet = totalNums
                totalMoneyForBet = float64(totalMoney)
                amount = float64(totalMoney)
            }

            clientIP := c.ClientIP()

            insertData := map[string]interface{}{
                "wjorderId":   wjOrderID,
                "orderId":     orderID,
                "serializeId": serializeID,
                "uid":         uid,
                "username":    user.Username,
                "nickname":    user.Nickname,
                "type":        gameID,
                "playedGroup": played.PlayedGroupID,
                "playedId":    playID,
                "Groupname":   groupName,
                "odds":        played.Odds,
                "actionNo":    actionNo,
                "actionTime":  currentTime,
                "actionIP":    clientIP,
                "actionData":  played.Name,
                "rebate":      userRebate,
                "money":       money,
                "totalNums":   totalNumsForBet,
                "totalMoney":  totalMoneyForBet,
                "kjTime":      actionTime,
            }
            if betInfoStr != "" {
                insertData["betInfo"] = betInfoStr
            }

            if err := tx.Table(betsTable).Create(&insertData).Error; err != nil {
                return err
            }

            var lastInsertID int64
            tx.Raw("SELECT LAST_INSERT_ID()").Scan(&lastInsertID)

            if isTestUser {
                if err := tx.Table("ssc_guestmembers").
                    Where("uid = ?", uid).
                    Update("coin", gorm.Expr("coin - ?", amount)).Error; err != nil {
                    return err
                }
            } else {
                if err := tx.Table("ssc_members").
                    Where("uid = ?", uid).
                    Update("coin", gorm.Expr("coin - ?", amount)).Error; err != nil {
                    return err
                }
            }

            coinLog := map[string]interface{}{
                "uid":        uid,
                "liqType":    101,
                "info":       "投注",
                "coin":       -amount,
                "fcoin":      0,
                "type":       gameID,
                "extfield0":  lastInsertID,
                "extfield1":  serializeID,
                "actionTime": currentTime,
                "actionIP":   clientIP,
            }

            var currentUserCoin float64
            if isTestUser {
                tx.Table("ssc_guestmembers").Select("coin").Where("uid = ?", uid).Scan(&currentUserCoin)
            } else {
                tx.Table("ssc_members").Select("coin").Where("uid = ?", uid).Scan(&currentUserCoin)
            }
            coinLog["userCoin"] = currentUserCoin

            if err := tx.Table("ssc_coin_log").Create(&coinLog).Error; err != nil {
                return err
            }
        }
        return nil
    })

    if err != nil {
        betInfo.MsgKey = "bet.system_error"
        betInfo.MsgArgs = []string{err.Error()}
        c.JSON(http.StatusOK, betInfo)
        return
    }

    betInfo.Success = true
    betInfo.MsgKey = "bet.success"
    c.JSON(http.StatusOK, betInfo)
}
// getSystemSettings 获取系统设置
func getSystemSettings() map[string]string {
    settings := make(map[string]string)
    var params []model.Params
    model.DB.Find(&params)
    for _, p := range params {
        settings[p.Name] = p.Value
    }
    return settings
}
// getGameActionInfo 获取游戏的封单时间、当期时间、当期期号
func getGameActionInfo(gameID int) (ftime int64, actionTime int64, actionNo string) {
    now := time.Now()
    _, offset := now.Zone()
    if offset < 8*3600 {
        now = now.Add(time.Duration(8*3600-offset) * time.Second)
    }
    // 获取游戏配置
    var gameType model.GameType
    if err := model.DB.First(&gameType, gameID).Error; err == nil {
        ftime = int64(gameType.DataFTime)
    }
    // 根据游戏ID设置不同的配置
    var periodSeconds int64 = 300
    var periodsPerDay int = 288
    switch gameID {
    case 55, 52: // 幸运飞艇、极速飞艇
        periodSeconds = 300
        ftime = 30
        periodsPerDay = 288
    case 50: // 北京赛车
        periodSeconds = 1200
        ftime = 60
        periodsPerDay = 44
    case 100: // 极速分分彩
        periodSeconds = 60
        ftime = 5
        periodsPerDay = 1440
    case 72: // 极速赛车
        periodSeconds = 75
        ftime = 5
        periodsPerDay = 1152
    case 66: // PC蛋蛋
        periodSeconds = 180
        ftime = 20
        periodsPerDay = 480
    case 70, 113: // 六合彩
        periodSeconds = 86400
        ftime = 1800
        periodsPerDay = 1
    case 122: // 五分时时彩
        periodSeconds = 300
        ftime = 30
        periodsPerDay = 288
    }
    // 计算当前是当天的第几期
    secondsOfDay := int64(now.Hour()*3600 + now.Minute()*60 + now.Second())
    issueNum := int(secondsOfDay/periodSeconds) + 1
    periodStartSeconds := int64(issueNum-1) * periodSeconds
    startHour := int(periodStartSeconds / 3600)
    startMin := int((periodStartSeconds % 3600) / 60)
    startSec := int(periodStartSeconds % 60)
    lotteryTime := time.Date(now.Year(), now.Month(), now.Day(), startHour, startMin, startSec, 0, now.Location())
    nowUnix := now.Unix()
    for nowUnix >= lotteryTime.Unix() && issueNum <= periodsPerDay {
        issueNum++
        lotteryTime = lotteryTime.Add(time.Duration(periodSeconds) * time.Second)
    }
    if issueNum > periodsPerDay {
        issueNum = 1
        tomorrow := now.Add(24 * time.Hour)
        lotteryTime = time.Date(tomorrow.Year(), tomorrow.Month(), tomorrow.Day(), 0, 0, int(periodSeconds), 0, now.Location())
    }
    dateStr := now.Format("20060102")
    actionNo = fmt.Sprintf("%s%03d", dateStr, issueNum)
    actionTime = lotteryTime.Unix()
    return ftime, actionTime, actionNo
}
// randomString 生成随机字符串
func randomString(length int) string {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    b := make([]byte, length)
    for i := range b {
        b[i] = charset[rand.Intn(len(charset))]
    }
    return string(b)
}
// GetHistory 开奖历史
func (h *GameHandler) GetHistory(c *gin.Context) {
    gameID := c.DefaultQuery("gameId", "55")
    history := []gin.H{}
    now := time.Now()
    minutes := now.Hour()*60 + now.Minute()
    currentIssueNum := minutes/5 + 1
    rand.Seed(now.Unix())
    for i := 0; i < 10; i++ {
        issueNum := currentIssueNum - i - 1
        if issueNum < 1 {
            break
        }
        var issue string
        var numbers []int
        switch gameID {
        case "55", "52", "50", "72":
            issue = fmt.Sprintf("%s%03d", now.Format("20060102"), issueNum)
            numbers = generatePK10Numbers()
        case "66":
            issue = fmt.Sprintf("24%04d", issueNum)
            n1 := rand.Intn(10)
            n2 := rand.Intn(10)
            n3 := rand.Intn(10)
            numbers = []int{n1 + n2 + n3, n1, n2, n3}
        default:
            issue = fmt.Sprintf("%s%03d", now.Format("20060102"), issueNum)
            numbers = []int{rand.Intn(10), rand.Intn(10), rand.Intn(10), rand.Intn(10), rand.Intn(10)}
        }
        history = append(history, gin.H{
            "issue":   issue,
            "numbers": numbers,
            "time":    now.Unix() - int64(i*300),
        })
    }
    response.Success(c, history)
}
// generatePK10Numbers 生成PK10开奖号码
func generatePK10Numbers() []int {
    numbers := make([]int, 10)
    for i := 0; i < 10; i++ {
        numbers[i] = i + 1
    }
    rand.Seed(time.Now().UnixNano())
    for i := len(numbers) - 1; i > 0; i-- {
        j := rand.Intn(i + 1)
        numbers[i], numbers[j] = numbers[j], numbers[i]
    }
    return numbers
}
// GetPlays 获取玩法赔率
// 根据panId参数选择不同的盘口表：1=ssc_played, 2=ssc_played2
func (h *GameHandler) GetPlays(c *gin.Context) {
    gameID := c.DefaultQuery("gameId", "55")
    panID := c.DefaultQuery("panId", "2")
    gameIDInt, _ := strconv.Atoi(gameID)
    plays := make(map[string]PlayInfo)
    tableName := "ssc_played"
    if panID == "2" {
        tableName = "ssc_played2"
    }
    rows, err := model.DB.Raw(fmt.Sprintf("SELECT id, name, alias, type, played_groupid, odds, rebate, minMoney, maxMoney, maxTurnMoney FROM %s WHERE type = ?", tableName), gameIDInt).Rows()
    if err != nil {
        response.Error(c, "获取玩法数据失败")
        return
    }
    defer rows.Close()
    for rows.Next() {
        var id, playType, playedGroupID int
        var name, alias string
        var odds, rebate float64
        var minMoney, maxMoney, maxTurnMoney int
        if err := rows.Scan(&id, &name, &alias, &playType, &playedGroupID, &odds, &rebate, &minMoney, &maxMoney, &maxTurnMoney); err != nil {
            continue
        }
        plays[fmt.Sprintf("%d", id)] = PlayInfo{
            ID:           id,
            GameID:       playType,
            PlayCateID:   playedGroupID,
            Name:         name,
            Alias:        alias,
            Odds:         odds,
            Rebate:       rebate,
            MinMoney:     float64(minMoney),
            MaxMoney:     float64(maxMoney),
            MaxTurnMoney: float64(maxTurnMoney),
        }
    }
    response.Success(c, plays)
}
// GetCurIssue 获取当前开奖号码
func (h *GameHandler) GetCurIssue(c *gin.Context) {
    gameID := c.DefaultQuery("gameId", "55")
    gameIDInt, _ := strconv.Atoi(gameID)
    var data struct {
        Number string `gorm:"column:number"`
        Data   string `gorm:"column:data"`
    }
    err := model.DB.Table("ssc_data").
        Select("number, data").
        Where("type = ?", gameIDInt).
        Order("time DESC").
        First(&data).Error
    if err != nil {
        response.Success(c, CurIssueData{
            Issue: "",
            Nums:  "",
        })
        return
    }
    response.Success(c, CurIssueData{
        Issue: data.Number,
        Nums:  data.Data,
    })
}
// GetBankList 获取银行列表(提款方式)
func (h *GameHandler) GetBankList(c *gin.Context) {
    var banks []model.BankList
    if err := model.DB.Where("enable = 1").Order("sort ASC").Find(&banks).Error; err != nil {
        response.Success(c, []model.BankList{})
        return
    }
    response.Success(c, banks)
}
