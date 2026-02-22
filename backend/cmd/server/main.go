package main

import (
	"fmt"
	"log"

	"lottery-system/internal/config"
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

	// 健康检查
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status":  "ok",
			"message": "Lottery System API is running",
		})
	})

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
			user.POST("/login", func(c *gin.Context) {
				// TODO: 实现登录逻辑
				c.JSON(200, gin.H{"code": 0, "message": "login"})
			})
			user.POST("/register", func(c *gin.Context) {
				// TODO: 实现注册逻辑
				c.JSON(200, gin.H{"code": 0, "message": "register"})
			})
		}

		// 游戏相关路由
		game := api.Group("/game")
		{
			game.GET("/list", func(c *gin.Context) {
				// TODO: 实现游戏列表
				c.JSON(200, gin.H{"code": 0, "data": []string{}})
			})
			game.GET("/lottery/:type", func(c *gin.Context) {
				// TODO: 实现开奖数据
				c.JSON(200, gin.H{"code": 0, "data": nil})
			})
		}
	}

	// 启动服务器
	addr := fmt.Sprintf(":%d", cfg.Server.Port)
	log.Printf("服务器启动在 %s", addr)
	if err := r.Run(addr); err != nil {
		log.Fatalf("服务器启动失败: %v", err)
	}
}
