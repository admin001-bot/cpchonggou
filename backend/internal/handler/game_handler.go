package handler

import (
	"fmt"
		"math/rand"
	"strconv"
	"time"

	"lottery-system/internal/model"
	"lottery-system/pkg/response"

	"github.com/gin-gonic/gin"
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

// NextIssueData 下一期数据（与PHP格式一致）
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

// BetRequest 投注请求
type BetRequest struct {
	GameID     int         `json:"gameId" binding:"required"`
	Issue      string      `json:"issue" binding:"required"`
	BetData    interface{} `json:"betData" binding:"required"`
	TotalNum   int         `json:"totalNum" binding:"required"`
	TotalMoney float64     `json:"totalMoney" binding:"required"`
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

// GetNextIssue 获取下一期期号（与PHP格式一致）
func (h *GameHandler) GetNextIssue(c *gin.Context) {
	gameID := c.Query("gameId")
	if gameID == "" {
		gameID = "55"
	}
	gameIDInt, _ := strconv.Atoi(gameID)

	now := time.Now()

	// 游戏配置
	var periodSeconds int64 = 300 // 每期时长（秒）
	var ftime int64 = 30          // 封盘提前时间（秒）
	var periodsPerDay int = 288   // 每天期数

	// 根据游戏ID设置不同的配置
	switch gameID {
	case "55": // 幸运飞艇
		periodSeconds = 300
		ftime = 30
		periodsPerDay = 288
	case "52": // 极速飞艇
		periodSeconds = 300
		ftime = 10
		periodsPerDay = 288
	case "50": // 北京赛车
		periodSeconds = 1200 // 20分钟
		ftime = 60
		periodsPerDay = 44
	case "100": // 极速分分彩
		periodSeconds = 60
		ftime = 5
		periodsPerDay = 1440
	case "72": // 极速赛车
		periodSeconds = 75
		ftime = 5
		periodsPerDay = 1152
	case "66": // PC蛋蛋
		periodSeconds = 180 // 3分钟
		ftime = 20
		periodsPerDay = 480
	case "70", "113": // 六合彩
		periodSeconds = 86400 // 1天
		ftime = 1800
		periodsPerDay = 1
	}

	// 计算当前是当天的第几期
	secondsOfDay := int64(now.Hour()*3600 + now.Minute()*60 + now.Second())
	issueNum := int(secondsOfDay / periodSeconds) + 1

	// 计算该期的开奖时间
	periodStartSeconds := int64(issueNum-1) * periodSeconds
	startHour := int(periodStartSeconds / 3600)
	startMin := int((periodStartSeconds % 3600) / 60)
	startSec := int(periodStartSeconds % 60)

	lotteryTime := time.Date(now.Year(), now.Month(), now.Day(), startHour, startMin, startSec, 0, now.Location())

	// 如果当前时间已经过了开奖时间，跳到下一期
	nowUnix := now.Unix()
	for nowUnix >= lotteryTime.Unix() && issueNum <= periodsPerDay {
		issueNum++
		lotteryTime = lotteryTime.Add(time.Duration(periodSeconds) * time.Second)
	}

	// 如果超过当天最后一期，跳到明天第一期
	if issueNum > periodsPerDay {
		issueNum = 1
		tomorrow := now.Add(24 * time.Hour)
		lotteryTime = time.Date(tomorrow.Year(), tomorrow.Month(), tomorrow.Day(), 0, 0, int(periodSeconds), 0, now.Location())
	}

	// 封盘时间 = 开奖时间 - 封盘提前时间
	endTime := lotteryTime.Add(-time.Duration(ftime) * time.Second)

	// 生成期号字符串：YYYYMMDD + 3位期号（如20260223176）
	dateStr := now.Format("20060102")
	issue := fmt.Sprintf("%s%03d", dateStr, issueNum)

	// 上一期期号
	preIssue := ""
	if issueNum > 1 {
		preIssue = fmt.Sprintf("%s%03d", dateStr, issueNum-1)
	} else {
		yesterday := now.Add(-24 * time.Hour)
		preIssue = fmt.Sprintf("%s%03d", yesterday.Format("20060102"), periodsPerDay)
	}

	// 获取上期开奖号码
	preNum := ""
	var lastData struct {
		Data   string `gorm:"column:data"`
		Number string `gorm:"column:number"`
	}
	err := model.DB.Table("ssc_data").
		Select("data, number").
		Where("type = ?", gameIDInt).
		Order("time DESC").
		First(&lastData).Error
	if err == nil {
		preNum = lastData.Data
		preIssue = lastData.Number
	}

	// 返回与PHP一致的数据格式
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

// GetCurrentIssue 获取当前期号（兼容旧接口）
func (h *GameHandler) GetCurrentIssue(c *gin.Context) {
	h.GetNextIssue(c)
}

// PlaceBet 投注
func (h *GameHandler) PlaceBet(c *gin.Context) {
	token := c.GetHeader("Authorization")
	if token == "" {
		response.Error(c, "请先登录")
		return
	}

	var req BetRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, "参数错误")
		return
	}

	if req.TotalMoney <= 0 {
		response.Error(c, "投注金额必须大于0")
		return
	}

	if req.TotalNum <= 0 {
		response.Error(c, "请选择投注号码")
		return
	}

	response.Success(c, gin.H{
		"message":    "投注成功",
		"issue":      req.Issue,
		"totalMoney": req.TotalMoney,
	})
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
func (h *GameHandler) GetPlays(c *gin.Context) {
	gameID := c.DefaultQuery("gameId", "55")
	gameIDInt, _ := strconv.Atoi(gameID)

	plays := make(map[string]PlayInfo)

	rows, err := model.DB.Raw("SELECT id, name, alias, type, played_groupid, odds, rebate, minMoney, maxMoney, maxTurnMoney FROM ssc_played WHERE type = ?", gameIDInt).Rows()
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
