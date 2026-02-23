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

// IssueInfo 期号信息
type IssueInfo struct {
	Issue       string `json:"issue"`
	PreIssue    string `json:"preIssue"`
	StartTime   int64  `json:"startTime"`
	EndTime     int64  `json:"endTime"`
	LotteryTime int64  `json:"lotteryTime"`
	ServerTime  int64  `json:"serverTime"`
	EndDiff     int64  `json:"endDiff"`     // 封盘倒计时(秒)
	LotteryDiff int64  `json:"lotteryDiff"` // 开奖倒计时(秒)
	Status      int    `json:"status"`      // -1:未开盘 0:已封盘 1:销售中
}

// CurrentIssueInfo 当前期号完整信息（包含开奖号码）
type CurrentIssueInfo struct {
	IssueInfo
	LastIssue string `json:"lastIssue"` // 上期期号
	LastNums  string `json:"lastNums"`  // 上期开奖号码
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
	GameID   int         `json:"gameId" binding:"required"`
	Issue    string      `json:"issue" binding:"required"`
	BetData  interface{} `json:"betData" binding:"required"`
	TotalNum int         `json:"totalNum" binding:"required"`
	TotalMoney float64  `json:"totalMoney" binding:"required"`
}

// GetGameList 获取游戏列表
func (h *GameHandler) GetGameList(c *gin.Context) {
	// 模拟游戏列表数据（实际应从数据库读取）
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

// GetCurrentIssue 获取当前期号
func (h *GameHandler) GetCurrentIssue(c *gin.Context) {
	gameID := c.Query("gameId")
	if gameID == "" {
		gameID = "55"
	}

	now := time.Now()

	// 根据游戏类型生成期号
	var issue string
	var issueNum int

	switch gameID {
	case "55", "52": // 飞艇系列 - 每天180期
		minutes := now.Hour()*60 + now.Minute()
		issueNum = minutes/5 + 1
		if issueNum > 180 {
			issueNum = 180
		}
		issue = fmt.Sprintf("%s%04d", now.Format("20060102"), issueNum)
	case "50", "72": // 赛车系列
		minutes := now.Hour()*60 + now.Minute()
		issueNum = minutes/5 + 1
		if issueNum > 180 {
			issueNum = 180
		}
		issue = fmt.Sprintf("%s%04d", now.Format("20060102"), issueNum)
	case "66": // PC蛋蛋
		minutes := now.Hour()*60 + now.Minute()
		issueNum = minutes/3 + 1
		issue = fmt.Sprintf("24%04d", issueNum)
	default:
		minutes := now.Hour()*60 + now.Minute()
		issueNum = minutes/5 + 1
		issue = fmt.Sprintf("%s%04d", now.Format("20060102"), issueNum)
	}

	// 计算该期的开始和结束时间
	minutes := now.Hour()*60 + now.Minute()
	periodStart := (minutes / 5) * 5
	startTime := time.Date(now.Year(), now.Month(), now.Day(), periodStart/60, periodStart%60, 0, 0, now.Location())
	endTime := startTime.Add(4 * time.Minute)
	lotteryTime := startTime.Add(5 * time.Minute)

	// 判断状态
	status := 1
	endSeconds := endTime.Unix() - now.Unix()
	if endSeconds <= 0 {
		status = 0 // 封盘
	}

	preIssue := fmt.Sprintf("%s%04d", now.Format("20060102"), issueNum-1)

	response.Success(c, IssueInfo{
		Issue:       issue,
		PreIssue:    preIssue,
		StartTime:   startTime.Unix(),
		EndTime:     endTime.Unix(),
		LotteryTime: lotteryTime.Unix(),
		ServerTime:  now.Unix(),
		Status:      status,
	})
}

// GetNextIssue 获取下一期期号
func (h *GameHandler) GetNextIssue(c *gin.Context) {
	gameID := c.Query("gameId")
	if gameID == "" {
		gameID = "55"
	}

	now := time.Now()
	gameIDInt, _ := strconv.Atoi(gameID)

	// 游戏配置：每期时长（秒）、封盘提前时间（秒）
	var periodSeconds int64 = 300  // 默认5分钟
	var ftime int64 = 60           // 封盘提前时间（开奖前1分钟封盘）

	// 根据游戏ID设置不同的周期
	switch gameID {
	case "55", "52", "50", "72": // 飞艇/赛车系列
		periodSeconds = 300 // 5分钟
		ftime = 60
	case "100": // 极速分分彩
		periodSeconds = 60 // 1分钟
		ftime = 10
	case "66": // PC蛋蛋
		periodSeconds = 180 // 3分钟
		ftime = 30
	case "70", "113": // 六合彩
		periodSeconds = 86400 // 1天
		ftime = 1800 // 30分钟
	}

	// 计算当前是第几期
	var issue string
	var issueNum int
	var startTime time.Time

	if gameID == "70" || gameID == "113" {
		// 六合彩特殊处理
		issue = now.Format("2006001") // 简化处理
		issueNum = now.YearDay()
		startTime = time.Date(now.Year(), now.Month(), now.Day(), 21, 30, 0, 0, now.Location())
	} else {
		// 普通彩种：根据时间计算期号
		secondsOfDay := int64(now.Hour()*3600 + now.Minute()*60 + now.Second())
		periodNum := secondsOfDay / periodSeconds
		issueNum = int(periodNum) + 1

		// 计算该期的开始时间
		periodStartSeconds := periodNum * periodSeconds
		startHour := int(periodStartSeconds / 3600)
		startMin := int((periodStartSeconds % 3600) / 60)
		startSec := int(periodStartSeconds % 60)
		startTime = time.Date(now.Year(), now.Month(), now.Day(), startHour, startMin, startSec, 0, now.Location())

		issue = fmt.Sprintf("%s%04d", now.Format("20060102"), issueNum)
	}

	endTime := startTime.Add(time.Duration(periodSeconds-ftime) * time.Second)
	lotteryTime := startTime.Add(time.Duration(periodSeconds) * time.Second)

	// 如果当前时间已经过了封盘时间，计算下一期
	nowUnix := now.Unix()
	if nowUnix >= endTime.Unix() {
		startTime = startTime.Add(time.Duration(periodSeconds) * time.Second)
		endTime = endTime.Add(time.Duration(periodSeconds) * time.Second)
		lotteryTime = lotteryTime.Add(time.Duration(periodSeconds) * time.Second)
		issueNum++
		issue = fmt.Sprintf("%s%04d", now.Format("20060102"), issueNum)
	}

	// 计算倒计时
	endDiff := endTime.Unix() - nowUnix
	lotteryDiff := lotteryTime.Unix() - nowUnix

	// 判断状态（参考PHP逻辑）
	var status int
	if endDiff < -30*60 {
		// 封盘时间差小于-30分钟，未开盘
		status = -1
	} else if endDiff > 20*60 && gameIDInt != 70 {
		// 距离封盘时间超过20分钟，暂不开放（非六合彩）
		status = 0
	} else if endDiff <= 0 {
		// 已封盘
		status = 0
	} else {
		// 正常投注
		status = 1
	}

	// 上一期期号
	preIssue := ""
	if issueNum > 1 {
		preIssue = fmt.Sprintf("%s%04d", now.Format("20060102"), issueNum-1)
	}

	response.Success(c, IssueInfo{
		Issue:       issue,
		PreIssue:    preIssue,
		StartTime:   startTime.Unix(),
		EndTime:     endTime.Unix(),
		LotteryTime: lotteryTime.Unix(),
		ServerTime:  nowUnix,
		EndDiff:     endDiff,
		LotteryDiff: lotteryDiff,
		Status:      status,
	})
}

// PlaceBet 投注
func (h *GameHandler) PlaceBet(c *gin.Context) {
	// 检查登录
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

	// 验证投注金额
	if req.TotalMoney <= 0 {
		response.Error(c, "投注金额必须大于0")
		return
	}

	// 验证注数
	if req.TotalNum <= 0 {
		response.Error(c, "请选择投注号码")
		return
	}

	// TODO: 实际应该扣减用户余额并保存投注记录
	// 这里模拟成功
	response.Success(c, gin.H{
		"message":   "投注成功",
		"issue":    req.Issue,
		"totalMoney": req.TotalMoney,
	})
}

// GetHistory 开奖历史
func (h *GameHandler) GetHistory(c *gin.Context) {
	gameID := c.DefaultQuery("gameId", "55")

	// 模拟历史开奖数据
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
		case "55", "52", "50", "72": // PK10系列
			issue = fmt.Sprintf("%s%04d", now.Format("20060102"), issueNum)
			// 生成1-10的不重复随机排列
			numbers = generatePK10Numbers()
		case "66": // PC蛋蛋
			issue = fmt.Sprintf("24%04d", issueNum)
			// PC蛋蛋: 三个数相加
			n1 := rand.Intn(10)
			n2 := rand.Intn(10)
			n3 := rand.Intn(10)
			numbers = []int{n1 + n2 + n3, n1, n2, n3}
		default:
			issue = fmt.Sprintf("%s%04d", now.Format("20060102"), issueNum)
			// 普通时时彩: 5个0-9的数字
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

// generatePK10Numbers 生成PK10开奖号码 (1-10的不重复排列)
func generatePK10Numbers() []int {
	numbers := make([]int, 10)
	for i := 0; i < 10; i++ {
		numbers[i] = i + 1
	}
	// Fisher-Yates 洗牌算法
	rand.Seed(time.Now().UnixNano())
	for i := len(numbers) - 1; i > 0; i-- {
		j := rand.Intn(i + 1)
		numbers[i], numbers[j] = numbers[j], numbers[i]
	}
	return numbers
}

// GetPlays 获取玩法赔率 - 从数据库读取
func (h *GameHandler) GetPlays(c *gin.Context) {
	gameID := c.DefaultQuery("gameId", "55")
	gameIDInt, _ := strconv.Atoi(gameID)

	plays := make(map[string]PlayInfo)

	// 从数据库读取玩法数据
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

	// 从数据库查询最新开奖数据
	var data struct {
		Type     int    `gorm:"column:type"`
		ActionNo string `gorm:"column:actionNo"`
		Data     string `gorm:"column:data"`
	}

	// 查询最新一期开奖数据
	err := model.DB.Table("ssc_data").
		Select("type, actionNo, data").
		Where("type = ?", gameIDInt).
		Order("time DESC").
		First(&data).Error

	if err != nil {
		// 如果没有数据，返回模拟数据
		response.Success(c, gin.H{
			"issue":   "",
			"nums":    generatePK10Numbers(),
			"hasData": false,
		})
		return
	}

	response.Success(c, gin.H{
		"issue":   data.ActionNo,
		"nums":    data.Data,
		"hasData": true,
	})
}
