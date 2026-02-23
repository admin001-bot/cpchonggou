package main

import (
	"fmt"
	"log"

	"lottery-system/internal/config"
	"lottery-system/internal/handler"
	"lottery-system/internal/model"

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
			user.GET("/info", userHandler.GetUserInfo)
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
			game.POST("/bet", gameHandler.PlaceBet)
		}
	}

	// 启动服务器
	addr := fmt.Sprintf(":%d", cfg.Server.Port)
	log.Printf("服务器启动在 %s", addr)
	if err := r.Run(addr); err != nil {
		log.Fatalf("服务器启动失败: %v", err)
	}
}
