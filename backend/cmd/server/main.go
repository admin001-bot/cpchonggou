package main

import (
	"fmt"
	"log"

	"lottery-system/internal/config"
	"lottery-system/internal/handler"
	"lottery-system/internal/model"
	"lottery-system/pkg/i18n"

	"github.com/gin-gonic/gin"
)

func main() {
	// 初始化配置
	if err := config.Init("./config/config.yaml"); err != nil {
		log.Fatalf("配置初始化失败: %v", err)
	}
	cfg := config.GetConfig()

	// 初始化数据库
	if err := model.Init(&cfg.Database); err != nil {
		log.Fatalf("数据库初始化失败: %v", err)
	}

	// 设置运行模式
	gin.SetMode(cfg.Server.Mode)

	// 创建路由
	r := gin.Default()

	// CORS中间件
	r.Use(func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	// 语言设置中间件
	r.Use(func(c *gin.Context) {
		lang := i18n.GetLanguageFromHeader(c.GetHeader("Accept-Language"))
		i18n.SetLanguage(lang)
		c.Next()
	})

	// 健康检查
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status":  "ok",
			"message": "Lottery System API is running",
		})
	})

	// 初始化handler
	userHandler := handler.NewUserHandler()
	gameHandler := handler.NewGameHandler()
	betHandler := handler.NewBetHandler()
	bankHandler := handler.NewBankHandler()

	// JWT认证中间件
	authMiddleware := func(c *gin.Context) {
		token := c.GetHeader("Authorization")
		if token == "" {
			c.JSON(401, gin.H{"code": 401, "message": "请先登录"})
			c.Abort()
			return
		}
		// 这里简化处理，实际应验证JWT token
		// 从token中解析用户ID
		uid, err := handler.ParseToken(token)
		if err != nil {
			c.JSON(401, gin.H{"code": 401, "message": "登录已过期"})
			c.Abort()
			return
		}
		c.Set("userID", uid)
		c.Next()
	}

	// API路由组
	api := r.Group("/api")
	{
		api.GET("/ping", func(c *gin.Context) {
			c.JSON(200, gin.H{
				"message": "pong",
			})
		})

		// 用户相关路由
		user := api.Group("/user")
		{
			user.POST("/register", userHandler.Register)
			user.POST("/login", userHandler.Login)
			user.POST("/guestLogin", userHandler.GuestLogin)
			user.GET("/info", userHandler.GetUserInfo)
		}

		// 安全相关路由（需要登录）- 与前端路径保持一致 /api/safe
		safe := api.Group("/safe")
		safe.Use(authMiddleware)
		{
			safe.POST("/setPasswddo", userHandler.SetPassword)
			safe.POST("/setCoinPwddo", userHandler.SetCoinPassword)
		}

		// 初始化接口 - 类似PHP的/api/init
		api.GET("/init", userHandler.Init)

		// 游戏相关路由
		game := api.Group("/game")
		{
			game.GET("/list", gameHandler.GetGameList)
			game.GET("/issue", gameHandler.GetCurrentIssue)
			game.GET("/nextIssue", gameHandler.GetNextIssue)
			game.GET("/curIssue", gameHandler.GetCurIssue)
			game.GET("/history", gameHandler.GetHistory)
			game.GET("/plays", gameHandler.GetPlays)
			game.POST("/bet", authMiddleware, gameHandler.PlaceBet)
			game.GET("/debug/data", gameHandler.DebugGetSscData) // 调试接口
			game.GET("/debug/playedGroup", gameHandler.DebugPlayedGroup) // 调试接口：查询玩法组
		}

		// 注单相关路由（需要登录）
		bet := api.Group("/bet")
		bet.Use(authMiddleware)
		{
			bet.GET("/notCount", betHandler.GetNotCount)
			bet.GET("/notCountDetail", betHandler.GetNotCountDetail)
			bet.GET("/bills", betHandler.GetBetBills)
			bet.GET("/statBets", betHandler.GetStatBets)
			bet.GET("/userBets", betHandler.GetUserBets)
			bet.GET("/totalStatBets", betHandler.GetTotalStatBets)
			bet.GET("/lotteryData", betHandler.GetLotteryData)
		}

		// 银行/提款相关路由（需要登录）
		bank := api.Group("/bank")
		bank.Use(authMiddleware)
		{
			bank.GET("/info", bankHandler.GetBankInfo)
			bank.GET("/withdrawConfig", bankHandler.GetWithdrawConfig)
			bank.POST("/withdraw", bankHandler.Withdraw)
			bank.GET("/records", bankHandler.GetWithdrawRecords)
			bank.GET("/depositRecords", bankHandler.GetDepositRecords)
			bank.POST("/bindAddress", bankHandler.BindAddress)
		}
	}

	// 启动服务器
	addr := fmt.Sprintf(":%d", cfg.Server.Port)
	log.Printf("服务器启动在 %s", addr)
	if err := r.Run(addr); err != nil {
		log.Fatalf("服务器启动失败: %v", err)
	}
}
