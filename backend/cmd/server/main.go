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
			"status": "ok",
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
	}

	// 启动服务器
	addr := fmt.Sprintf(":%d", cfg.Server.Port)
	log.Printf("服务器启动在 %s", addr)
	if err := r.Run(addr); err != nil {
		log.Fatalf("服务器启动失败: %v", err)
	}
}
