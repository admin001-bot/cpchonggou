package handler

import (
	"fmt"
	"strconv"
	"time"

	"lottery-system/internal/model"
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
}

// SettledItem 今日已结项
type SettledItem struct {
	TurnNum     string  `json:"turnNum"`
	Detail      string  `json:"detail"`
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
			Select("SUM(totalNums) as totalNums, SUM(money * totalNums) as totalMoney").
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
	}

	query := model.DB.Table("ssc_bets").
		Where("isDelete = 0 AND lotteryNo = '' AND uid = ?", uid)
	if gameID > 0 {
		query = query.Where("type = ?", gameID)
	}
	query.Order("id desc").Limit(100).Find(&bets)

	var result []NotCountDetailItem
	var totalBetMoney, totalResultMoney float64
	for _, bet := range bets {
		// 获取玩法名称
		var playName string
		model.DB.Table("ssc_played").Select("name").Where("id = ?", bet.PlayedId).Scan(&playName)

		betMoney := bet.Money * float64(bet.TotalNums)
		resultMoney := bet.Money*bet.Odds - betMoney + betMoney*bet.Rebate

		result = append(result, NotCountDetailItem{
			ID:          bet.ID,
			UserID:      bet.Uid,
			UserName:    bet.Username,
			PlayID:      bet.PlayedId,
			PlayCateID:  bet.PlayedGroup,
			PlayName:    playName,
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
	todayStart := time.Now().Format("2006-01-02") + " 00:00:00"
	todayStartUnix, _ := time.Parse("2006-01-02 15:04:05", todayStart)
	todayStartInt := todayStartUnix.Unix()

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
	}

	query := model.DB.Table("ssc_bets").
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

		var betMoney float64
		if bet.BetInfo != "" {
			betMoney = bet.Money * float64(bet.TotalNums)
		} else {
			betMoney = bet.Money
		}

		resultMoney := bet.Bonus - betMoney + betMoney*bet.Rebate

		result = append(result, SettledItem{
			TurnNum:     gameName + "<br>" + bet.ActionNo,
			Detail:      playName + "<br>@" + fmt.Sprintf("%.2f", bet.Odds) + "<br>#" + fmt.Sprintf("%.3f", bet.Rebate),
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

	startDate := c.Query("startDate")
	endDate := c.Query("endDate")

	if startDate == "" || endDate == "" {
		// 默认最近7天
		endDate = time.Now().Format("2006-01-02")
		startDate = time.Now().AddDate(0, 0, -6).Format("2006-01-02")
	}

	// 查询每天统计
	var stats []struct {
		StatDate     string
		BetCount     int
		BetMoney     float64
		RewardRebate float64
	}

	model.DB.Table("ssc_bets").
		Select("DATE(FROM_UNIXTIME(actionTime)) as statDate, COUNT(*) as betCount, SUM(money * totalNums) as betMoney, SUM(bonus - money * totalNums + money * totalNums * rebate) as rewardRebate").
		Where("isDelete = 0 AND lotteryNo != '' AND uid = ? AND DATE(FROM_UNIXTIME(actionTime)) >= ? AND DATE(FROM_UNIXTIME(actionTime)) <= ?", uid, startDate, endDate).
		Group("statDate").
		Order("statDate DESC").
		Find(&stats)

	// 构建结果
	var result []WeekRecordItem
	weekDays := []string{"星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"}

	// 填充最近7天数据
	for i := 0; i < 7; i++ {
		date := time.Now().AddDate(0, 0, -i).Format("2006-01-02")
		weekDay := weekDays[time.Now().AddDate(0, 0, -i).Weekday()]

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
	}

	query := model.DB.Table("ssc_bets").
		Where("isDelete = 0 AND lotteryNo != '' AND uid = ? AND actionTime >= ? AND actionTime < ?", uid, dateStart.Unix(), dateEnd.Unix())
	if gameID > 0 {
		query = query.Where("type = ?", gameID)
	}
	query.Order("id desc").Limit(100).Find(&bets)

	var result []NotCountDetailItem
	var totalBetMoney, totalResultMoney float64

	for _, bet := range bets {
		var playName string
		model.DB.Table("ssc_played").Select("name").Where("id = ?", bet.PlayedId).Scan(&playName)

		betMoney := bet.Money * float64(bet.TotalNums)
		resultMoney := bet.Bonus - betMoney + betMoney*bet.Rebate

		result = append(result, NotCountDetailItem{
			ID:          bet.ID,
			PlayID:      bet.PlayedId,
			PlayName:    playName,
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
			Select("COUNT(*) as betCount, SUM(money * totalNums) as betMoney, SUM(bonus - money * totalNums + money * totalNums * rebate) as rewardRebate").
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
	todayStart := time.Now().Format("2006-01-02") + " 00:00:00"
	todayStartUnix, _ := time.Parse("2006-01-02 15:04:05", todayStart)
	todayStartInt := todayStartUnix.Unix()

	// 未结算金额
	var unbalancedMoney float64
	query := model.DB.Table("ssc_bets").
		Select("SUM(money * totalNums)").
		Where("isDelete = 0 AND lotteryNo = '' AND uid = ?", uid)
	if gameID > 0 {
		query = query.Where("type = ?", gameID)
	}
	query.Scan(&unbalancedMoney)

	// 今日已结算金额和奖金
	var settled struct {
		TotalBet   float64
		TotalBonus float64
		TotalRebate float64
	}
	query2 := model.DB.Table("ssc_bets").
		Select("SUM(money * totalNums) as totalBet, SUM(bonus) as totalBonus, SUM(money * totalNums * rebate) as totalRebate").
		Where("isDelete = 0 AND lotteryNo != '' AND uid = ? AND actionTime >= ?", uid, todayStartInt)
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
