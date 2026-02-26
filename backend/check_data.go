package main

import (
	"fmt"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

type SscData struct {
	ID     int64  `gorm:"column:id"`
	Number string `gorm:"column:number"`
	Type   int    `gorm:"column:type"`
	Data   string `gorm:"column:data"`
	Time   int64  `gorm:"column:time"`
}

func main() {
	dsn := "root:root@tcp(127.0.0.1:3306)/lotter y_system?charset=utf8mb4&parseTime=True&loc=Local"
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		fmt.Println("连接失败:", err)
		return
	}

	fmt.Println("=== 数据库中ssc_data表游戏55的所有记录（按ID DESC）===")
	var records []SscData
	db.Raw("SELECT id, number, type, data, time FROM ssc_data WHERE type = 55 ORDER BY id DESC LIMIT 10").Scan(&records)
	for i, r := range records {
		fmt.Printf("%d. id=%d, number=%s, data=%s, time=%d\n", i+1, r.ID, r.Number, r.Data, r.Time)
	}

	fmt.Println("\n=== 统计 ===")
	db.Raw("SELECT COUNT(*) FROM ssc_data WHERE type = 55").Scan(new(int64))
	var count int64
	db.Raw("SELECT COUNT(*) FROM ssc_data WHERE type = 55").Scan(&count)
	fmt.Printf("游戏55总记录数: %d\n", count)

	// 查询最大ID
	var maxID int64
	db.Raw("SELECT MAX(id) FROM ssc_data WHERE type = 55").Scan(&maxID)
	fmt.Printf("游戏55最大ID: %d\n", maxID)

	// 查询最大number
	var maxNumber string
	db.Raw("SELECT MAX(number) FROM ssc_data WHERE type = 55").Scan(&maxNumber)
	fmt.Printf("游戏55最大期号: %s\n", maxNumber)
}
