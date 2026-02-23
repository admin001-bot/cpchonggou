package config

import (
	"fmt"
	"os"

	"github.com/spf13/viper"
)

type Config struct {
	Server   ServerConfig   `mapstructure:"server"`
	Database DatabaseConfig `mapstructure:"database"`
	JWT      JWTConfig      `mapstructure:"jwt"`
}

type ServerConfig struct {
	Port int    `mapstructure:"port"`
	Mode string `mapstructure:"mode"`
}

type DatabaseConfig struct {
	Host     string `mapstructure:"host"`
	Port     int    `mapstructure:"port"`
	Database string `mapstructure:"database"`
	Username string `mapstructure:"username"`
	Password string `mapstructure:"password"`
	Charset  string `mapstructure:"charset"`
	Prefix   string `mapstructure:"prefix"`
}

type JWTConfig struct {
	Secret string `mapstructure:"secret"`
	Expire string `mapstructure:"expire"`
	Issuer string `mapstructure:"issuer"`
}

var GlobalConfig *Config

func Init(configPath string) error {
	// 先尝试从环境变量读取
	viper.AutomaticEnv()

	// 设置默认值
	viper.SetDefault("server.port", 8080)
	viper.SetDefault("server.mode", "debug")
	viper.SetDefault("database.host", "127.0.0.1")
	viper.SetDefault("database.port", 3306)
	viper.SetDefault("database.database", "pj")
	viper.SetDefault("database.username", "root")
	viper.SetDefault("database.password", "")
	viper.SetDefault("database.charset", "utf8mb4")
	viper.SetDefault("database.prefix", "ssc_")
	viper.SetDefault("jwt.secret", "lottery-secret-key")
	viper.SetDefault("jwt.expire", "24h")
	viper.SetDefault("jwt.issuer", "lottery-system")

	// 环境变量映射
	dbHost := os.Getenv("DB_HOST")
	if dbHost != "" {
		viper.Set("database.host", dbHost)
	}
	dbPort := os.Getenv("DB_PORT")
	if dbPort != "" {
		viper.Set("database.port", dbPort)
	}
	dbName := os.Getenv("DB_NAME")
	if dbName != "" {
		viper.Set("database.database", dbName)
	}
	dbUser := os.Getenv("DB_USER")
	if dbUser != "" {
		viper.Set("database.username", dbUser)
	}
	dbPass := os.Getenv("DB_PASS")
	if dbPass != "" {
		viper.Set("database.password", dbPass)
	}

	// 如果配置文件存在，读取配置文件
	if configPath != "" {
		viper.SetConfigFile(configPath)
		viper.SetConfigType("yaml")
		if err := viper.ReadInConfig(); err == nil {
			fmt.Println("使用配置文件:", configPath)
		}
	}

	GlobalConfig = &Config{}
	if err := viper.Unmarshal(GlobalConfig); err != nil {
		return fmt.Errorf("解析配置失败: %w", err)
	}

	return nil
}

func GetConfig() *Config {
	return GlobalConfig
}
