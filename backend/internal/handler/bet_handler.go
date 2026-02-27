package handler

import (
	"fmt"
	"strconv"
	"time"

	"lottery-system/internal/model"
	"lottery-system/pkg/i18n"
	"lottery-system/pkg/response"

	"github.com/gin-gonic/gin"
)

// BetHandler 投注处理器
type BetHandler struct{}

// NewBetHandler 创建投注处理器
func NewBetHandler() *BetHandler {
	return &BetHandler{}
}

// NotCountItem 即时注单项
type NotCountItem struct {
	GameID    int     `json:"gameId"`
	Name      string  `json:"name"`
	Count     int     `json:"count"`
	Money     float64 `json:"money"`
}

// NotCountDetailItem 即时注单明细项
type NotCountDetailItem struct {
	ID          int     `json:"id"`
	UserID      int     `json:"userId"`
	UserName    string  `json:"userName"`
	PlayID      int     `json:"playId"`
	PlayCateID  int     `json:"playCateId"`
	PlayName    string  `json:"playName"`
	Odds        float64 `json:"odds"`
	Rebate      float64 `json:"rebate"`
	AddTime     string  `json:"addTime"`
	TurnNum     string  `json:"turnNum"`
	GameID      int     `json:"gameId"`
	Status      int     `json:"status"`      // 0未结 1已结
	Money       float64 `json:"money"`       // 下注金额
	ResultMoney float64 `json:"resultMoney"` // 可赢金额
	OrderNo     string  `json:"orderNo"`
	LotteryNo   string  `json:"lotteryNo"`
	OpenTime    string  `json:"openTime"`
	BetInfo     string  `json:"betInfo"`
	Content     string  `json:"content"`     // 投注内容（如：单、双等）
}

// SettledItem 今日已结项
type SettledItem struct {
	TurnNum     string  `json:"turnNum"`
	Detail      string  `json:"detail"`
	Content     string  `json:"content"`     // 投注内容（如：双、冠亚单等）
	Money       float64 `json:"money"`
	ResultMoney float64 `json:"resultMoney"`
	Rebate      float64 `json:"rebate"`
}

// WeekRecordItem 下注记录项
type WeekRecordItem struct {
	StatDate     string  `json:"statDate"`
	Week         string  `json:"week"`
	BetCount     int     `json:"betCount"`
	RewardRebate float64 `json:"rewardRebate"`
}

// DayRecordItem 日期记录项
type DayRecordItem struct {
	GameID int     `json:"gameId"`
	Name   string  `json:"name"`
	Count  int     `json:"count"`
	Money  float64 `json:"money"`
	Win    float64 `json:"win"`
}

// GetNotCount 获取即时注单统计
func (h *BetHandler) GetNotCount(c *gin.Context) {
	userID, _ := c.Get("userID")
	uid := userID.(int)

	// 获取游戏列表
	var gameTypes []struct {
		ID   int    `gorm:"column:id"`
		Name string `gorm:"column:title"`
	}
	model.DB.Table("ssc_type").Order("sort asc").Find(&gameTypes)

	var result []NotCountItem
	for _, game := range gameTypes {
		var count struct {
			TotalNums  int     `gorm:"column:totalNums"`
			TotalMoney float64 `gorm:"column:totalMoney"`
		}
		// 查询未结算注单 (lotteryNo为空)
		model.DB.Table("ssc_bets").
			Select("SUM(totalNums) as totalNums, SUM(money) as totalMoney").
			Where("isDelete = 0 AND lotteryNo = '' AND uid = ? AND type = ?", uid, game.ID).
			Scan(&count)

		if count.TotalNums > 0 {
			result = append(result, NotCountItem{
				GameID: game.ID,
				Name:   game.Name,
				Count:  count.TotalNums,
				Money:  count.TotalMoney,
			})
		}
	}

	response.Success(c, result)
}

// GetNotCountDetail 获取即时注单明细
func (h *BetHandler) GetNotCountDetail(c *gin.Context) {
	userID, _ := c.Get("userID")
	uid := userID.(int)

	gameID, _ := strconv.Atoi(c.Query("gameId"))

	var bets []struct {
		ID          int     `gorm:"column:id"`
		Uid         int     `gorm:"column:uid"`
		Username    string  `gorm:"column:username"`
		PlayedId    int     `gorm:"column:playedId"`
		PlayedGroup int     `gorm:"column:playedGroup"`
		Odds        float64 `gorm:"column:odds"`
		Rebate      float64 `gorm:"column:rebate"`
		ActionTime  int64   `gorm:"column:actionTime"`
		ActionNo    string  `gorm:"column:actionNo"`
		Type        int     `gorm:"column:type"`
		Money       float64 `gorm:"column:money"`
		TotalNums   int     `gorm:"column:totalNums"`
		WjorderId   string  `gorm:"column:wjorderId"`
		LotteryNo   string  `gorm:"column:lotteryNo"`
		KjTime      int64   `gorm:"column:kjTime"`
		BetInfo     string  `gorm:"column:betInfo"`
		ActionData  string  `gorm:"column:actionData"`
	}

	query := model.DB.Table("ssc_bets").
		Select("id, uid, username, playedId, playedGroup, odds, rebate, actionTime, actionNo, type, money, totalNums, wjorderId, lotteryNo, kjTime, betInfo, actionData").
		Where("isDelete = 0 AND lotteryNo = '' AND uid = ?", uid)
	if gameID > 0 {
		query = query.Where("type = ?", gameID)
	}
	query.Order("id desc").Limit(100).Find(&bets)

	var result []NotCountDetailItem
	var totalBetMoney, totalResultMoney float64
	for _, bet := range bets {
		// 直接使用 actionData 作为完整下注内容
		fullContent := bet.ActionData

		// 计算投注金额和结果金额
		betMoney := bet.Money
		resultMoney := bet.Money*bet.Odds - betMoney + betMoney*bet.Rebate

		result = append(result, NotCountDetailItem{
			ID:          bet.ID,
			UserID:      bet.Uid,
			UserName:    bet.Username,
			PlayID:      bet.PlayedId,
			PlayCateID:  bet.PlayedGroup,
			PlayName:    "",  // 不再需要
			Odds:        bet.Odds,
			Rebate:      bet.Rebate,
			AddTime:     time.Unix(bet.ActionTime, 0).Format("2006-01-02 15:04:05"),
			TurnNum:     bet.ActionNo,
			GameID:      bet.Type,
			Status:      0,
			Money:       betMoney,
			ResultMoney: resultMoney,
			OrderNo:     bet.WjorderId,
			LotteryNo:   bet.LotteryNo,
			OpenTime:    time.Unix(bet.KjTime, 0).Format("2006-01-02 15:04:05"),
			BetInfo:     bet.BetInfo,
			Content:     fullContent,
		})

		totalBetMoney += betMoney
		totalResultMoney += resultMoney
	}

	response.Success(c, gin.H{
		"data": result,
		"otherData": gin.H{
			"totalBetMoney": totalBetMoney,
			"totalResultMoney": totalResultMoney,
		},
	})
}

// GetBetBills 获取今日已结
func (h *BetHandler) GetBetBills(c *gin.Context) {
	userID, _ := c.Get("userID")
	uid := userID.(int)

	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	rows, _ := strconv.Atoi(c.DefaultQuery("rows", "30"))
	gameID, _ := strconv.Atoi(c.Query("gameId"))

	// 今天0点时间戳
	// 使用北京时间（Asia/Shanghai）
	loc, _ := time.LoadLocation("Asia/Shanghai")
	now := time.Now().In(loc)
	todayStart := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, loc)
	todayStartInt := todayStart.Unix()

	var bets []struct {
		ID          int
		Uid         int
		Username    string
		PlayedId    int
		PlayedGroup int
		Odds        float64
		Rebate      float64
		ActionTime  int64
		ActionNo    string
		Type        int
		Money       float64
		TotalNums   int
		WjorderId   string
		LotteryNo   string
		KjTime      int64
		Bonus       float64
		BetInfo     string
		Content     string
	}

	query := model.DB.Table("ssc_bets").
		Select("id, uid, username, playedId, playedGroup, odds, rebate, actionTime, actionNo, type, money, totalNums, wjorderId, lotteryNo, kjTime, bonus, betInfo, actionData as content").
		Where("isDelete = 0 AND lotteryNo != '' AND uid = ? AND actionTime >= ?", uid, todayStartInt)
	if gameID > 0 {
		query = query.Where("type = ?", gameID)
	}

	var totalCount int64
	query.Count(&totalCount)

	query.Order("id desc").Offset((page - 1) * rows).Limit(rows).Find(&bets)

	var result []SettledItem
	var totalBetMoney, totalResultMoney float64

	for _, bet := range bets {
		// 获取玩法名称
		var playName string
		model.DB.Table("ssc_played").Select("name").Where("id = ?", bet.PlayedId).Scan(&playName)

		// 获取游戏名称
		var gameName string
		model.DB.Table("ssc_type").Select("title").Where("id = ?", bet.Type).Scan(&gameName)

		// 获取玩法组名称（包含名次信息，如"冠军"、"亚军"等）
		var groupName string
		model.DB.Table("ssc_played_group").Select("name").Where("id = ?", bet.PlayedGroup).Scan(&groupName)

		var betMoney float64
		if bet.BetInfo != "" {
			betMoney = bet.Money
		} else {
			betMoney = bet.Money
		}

		resultMoney := bet.Bonus - betMoney + betMoney*bet.Rebate

		// 直接使用 actionData 作为完整下注内容
		fullContent := bet.Content

		result = append(result, SettledItem{
			TurnNum:     gameName + "<br>" + bet.ActionNo,
			Detail:      playName + "<br>@" + fmt.Sprintf("%.2f", bet.Odds) + "<br>#" + fmt.Sprintf("%.3f", bet.Rebate),
			Content:     fullContent,
			Money:       betMoney,
			ResultMoney: resultMoney,
			Rebate:      bet.Rebate,
		})

		totalBetMoney += betMoney
		totalResultMoney += resultMoney
	}

	response.Success(c, gin.H{
		"data":       result,
		"totalCount": totalCount,
		"otherData": gin.H{
			"totalBetMoney":    totalBetMoney,
			"totalResultMoney": totalResultMoney,
		},
	})
}

// GetStatBets 获取下注记录统计（最近7天）
func (h *BetHandler) GetStatBets(c *gin.Context) {
	userID, _ := c.Get("userID")
	uid := userID.(int)

	// 使用北京时间（Asia/Shanghai）
	loc, _ := time.LoadLocation("Asia/Shanghai")
	now := time.Now().In(loc)
	startDate := c.Query("startDate")
	endDate := c.Query("endDate")

	if startDate == "" || endDate == "" {
		// 默认最近7天
		endDate = now.Format("2006-01-02")
		startDate = now.AddDate(0, 0, -6).Format("2006-01-02")
	}

	fmt.Printf("[GetStatBets] uid=%d, startDate=%s, endDate=%s\n", uid, startDate, endDate)

	// 查询每天统计
	var stats []struct {
		StatDate     string
		BetCount     int
		BetMoney     float64
		RewardRebate float64
	}

	// 将日期字符串转为时间戳范围（使用北京时间）
	startTime, _ := time.ParseInLocation("2006-01-02", startDate, loc)
	endTime, _ := time.ParseInLocation("2006-01-02", endDate, loc)
	endTime = endTime.Add(24*time.Hour - 1*time.Second) // 到当天的最后一秒

	// 从 ssc_bets 表实时统计（不再依赖 report 表）
	// 使用 kjTime（开奖时间）来统计，而不是 actionTime（投注时间）
	model.DB.Table("ssc_bets").
		Select("DATE(FROM_UNIXTIME(kjTime, '+8')) as statDate, COUNT(*) as betCount, SUM(money) as betMoney, SUM(bonus - money + money * rebate) as rewardRebate").
		Where("isDelete = 0 AND uid = ? AND lotteryNo != '' AND kjTime >= ? AND kjTime <= ?", uid, startTime.Unix(), endTime.Unix()).
		Group("DATE(FROM_UNIXTIME(kjTime, '+8'))").
		Order("statDate DESC").
		Find(&stats)

	fmt.Printf("[GetStatBets] stats count=%d, stats=%+v\n", len(stats), stats)

	// 构建结果
	var result []WeekRecordItem

	// 填充最近7天数据
	for i := 0; i < 7; i++ {
		date := time.Now().AddDate(0, 0, -i).Format("2006-01-02")
		weekDay := i18n.T("week." + fmt.Sprintf("%d", int(time.Now().AddDate(0, 0, -i).Weekday())))

		found := false
		for _, stat := range stats {
			if stat.StatDate == date {
				result = append(result, WeekRecordItem{
					StatDate:     date,
					Week:         weekDay,
					BetCount:     stat.BetCount,
					RewardRebate: stat.RewardRebate,
				})
				found = true
				break
			}
		}
		if !found {
			result = append(result, WeekRecordItem{
				StatDate:     date,
				Week:         weekDay,
				BetCount:     0,
				RewardRebate: 0,
			})
		}
	}

	response.Success(c, gin.H{
		"data": result,
	})
}

// GetUserBets 获取某天某游戏的投注明细
func (h *BetHandler) GetUserBets(c *gin.Context) {
	userID, _ := c.Get("userID")
	uid := userID.(int)

	gameID, _ := strconv.Atoi(c.Query("gameId"))
	date := c.Query("date")

	if date == "" {
		date = time.Now().Format("2006-01-02")
	}

	// 转换日期为时间戳
	dateStart, _ := time.Parse("2006-01-02", date)
	dateEnd := dateStart.Add(24 * time.Hour)

	var bets []struct {
		ID          int
		PlayedId    int
		Odds        float64
		Rebate      float64
		ActionTime  int64
		ActionNo    string
		Type        int
		Money       float64
		TotalNums   int
		LotteryNo   string
		Bonus       float64
		BetInfo     string
		ActionData  string
	}

	query := model.DB.Table("ssc_bets").
		Select("id, playedId, odds, rebate, actionTime, actionNo, type, money, totalNums, lotteryNo, bonus, betInfo, actionData").
		Where("isDelete = 0 AND lotteryNo != '' AND uid = ? AND actionTime >= ? AND actionTime < ?", uid, dateStart.Unix(), dateEnd.Unix())
	if gameID > 0 {
		query = query.Where("type = ?", gameID)
	}
	query.Order("id desc").Limit(100).Find(&bets)

	var result []NotCountDetailItem
	var totalBetMoney, totalResultMoney float64

	for _, bet := range bets {
		betMoney := bet.Money
		resultMoney := bet.Bonus - betMoney + betMoney*bet.Rebate

		result = append(result, NotCountDetailItem{
			ID:          bet.ID,
			PlayID:      bet.PlayedId,
			PlayName:    "",
			Odds:        bet.Odds,
			Rebate:      bet.Rebate,
			AddTime:     time.Unix(bet.ActionTime, 0).Format("2006-01-02 15:04:05"),
			TurnNum:     bet.ActionNo,
			GameID:      bet.Type,
			Status:      1,
			Money:       betMoney,
			ResultMoney: resultMoney,
			LotteryNo:   bet.LotteryNo,
			BetInfo:     bet.BetInfo,
			Content:     bet.ActionData,
		})

		totalBetMoney += betMoney
		totalResultMoney += resultMoney
	}

	response.Success(c, gin.H{
		"data": result,
		"otherData": gin.H{
			"totalBetMoney":    totalBetMoney,
			"totalResultMoney": totalResultMoney,
		},
	})
}

// GetTotalStatBets 获取某天各游戏统计
func (h *BetHandler) GetTotalStatBets(c *gin.Context) {
	userID, _ := c.Get("userID")
	uid := userID.(int)

	date := c.Query("date")
	if date == "" {
		date = time.Now().Format("2006-01-02")
	}

	dateStart, _ := time.Parse("2006-01-02", date)
	dateEnd := dateStart.Add(24 * time.Hour)

	// 获取游戏列表
	var gameTypes []struct {
		ID    int    `gorm:"column:id"`
		Title string `gorm:"column:title"`
	}
	model.DB.Table("ssc_type").Order("sort asc").Find(&gameTypes)

	var result []DayRecordItem

	for _, game := range gameTypes {
		var stats struct {
			BetCount     int
			BetMoney     float64
			RewardRebate float64
		}

		model.DB.Table("ssc_bets").
			Select("COUNT(*) as betCount, SUM(money) as betMoney, SUM(bonus - money + money * rebate) as rewardRebate").
			Where("isDelete = 0 AND lotteryNo != '' AND uid = ? AND type = ? AND actionTime >= ? AND actionTime < ?", uid, game.ID, dateStart.Unix(), dateEnd.Unix()).
			Scan(&stats)

		result = append(result, DayRecordItem{
			GameID: game.ID,
			Name:   game.Title,
			Count:  stats.BetCount,
			Money:  stats.BetMoney,
			Win:    stats.RewardRebate,
		})
	}

	response.Success(c, gin.H{
		"data": result,
	})
}

// GetLotteryData 获取游戏数据（未结算金额、今日输赢）
func (h *BetHandler) GetLotteryData(c *gin.Context) {
	userID, _ := c.Get("userID")
	uid := userID.(int)

	gameID, _ := strconv.Atoi(c.Query("gameId"))

	// 今天0点
	// 使用北京时间（Asia/Shanghai）
	loc, _ := time.LoadLocation("Asia/Shanghai")
	now := time.Now().In(loc)
	todayStart := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, loc)
	todayStartInt := todayStart.Unix()

	// 未结算金额
	var unbalancedMoney float64
	query := model.DB.Table("ssc_bets").
		Select("COALESCE(SUM(money), 0)").
		Where("isDelete = 0 AND lotteryNo = '' AND uid = ?", uid)
	if gameID > 0 {
		query = query.Where("type = ?", gameID)
	}
	query.Scan(&unbalancedMoney)

	// 今日已结算金额和奖金（使用 kjTime 开奖时间）
	var settled struct {
		TotalBet   float64
		TotalBonus float64
		TotalRebate float64
	}
	query2 := model.DB.Table("ssc_bets").
		Select("SUM(money) as totalBet, SUM(bonus) as totalBonus, SUM(money * rebate) as totalRebate").
		Where("isDelete = 0 AND lotteryNo != '' AND uid = ? AND kjTime >= ? AND kjTime <= ?", uid, todayStartInt, time.Now().Unix())
	if gameID > 0 {
		query2 = query2.Where("type = ?", gameID)
	}
	query2.Scan(&settled)

	// 今日输赢 = 总奖金 - 已结算投注金额 + 退水
	totalTotalMoney := settled.TotalBonus - settled.TotalBet + settled.TotalRebate


	// 用户余额
	var balance float64
	model.DB.Table("ssc_members").Select("coin").Where("uid = ?", uid).Scan(&balance)

	response.Success(c, gin.H{
		"balance":         balance,
		"unbalancedMoney": unbalancedMoney,
		"totalTotalMoney": totalTotalMoney,
	})
}
