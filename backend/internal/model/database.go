package model

import (
	"fmt"

	"lottery-system/internal/config"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

// Init 初始化数据库连接
func Init(cfg *config.DatabaseConfig) error {
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%d)/%s?charset=%s&parseTime=True&loc=Local",
		cfg.Username,
		cfg.Password,
		cfg.Host,
		cfg.Port,
		cfg.Database,
		cfg.Charset,
	)

	var err error
	DB, err = gorm.Open(mysql.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		return fmt.Errorf("连接数据库失败: %w", err)
	}

	sqlDB, err := DB.DB()
	if err != nil {
		return err
	}

	// 设置连接池
	sqlDB.SetMaxIdleConns(10)
	sqlDB.SetMaxOpenConns(100)

	return nil
}

// GetDB 获取数据库实例
func GetDB() *gorm.DB {
	return DB
}

// AutoMigrate 自动迁移表结构 (仅用于开发环境)
func AutoMigrate() error {
	return DB.AutoMigrate(
		&User{},
		&UserBank{},
		&UserSession{},
		&GameType{},
		&Played{},
		&PlayedGroup{},
		&Bet{},
		&LotteryData{},
		&DataTime{},
		&MemberCash{},
		&MemberRecharge{},
		&BonusLog{},
		&Letter{},
		&Link{},
		&Params{},
		&BankList{},
	)
}

// GetTablePrefix 获取表前缀
func GetTablePrefix() string {
	return config.GetConfig().Database.Prefix
}
