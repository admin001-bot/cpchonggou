package main

import (
	"fmt"
	"gorm.io/driver/mysql"
	"database/sql"
	"gorm.io/gorm"
)

func main() {
	dsn := "root:root@tcp(127.0.0.1:3306)/lottery_system?charset=utf8mb4&parseTime=True&loc=Local"
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		fmt.Println("连接失败:", err)
		return
	}

	// 使用原生SQL直接查询
	var records []struct {
		ID     int64  `gorm:"column:id"`
		Number string `gorm:"column:number"`
		Data   string `gorm:"column:data"`
		Time   int64  `gorm:"column:time"`
	}

	fmt.Println("=== 使用原生SQL查询 ===")
	err = db.Raw("SELECT id, number, data, time FROM ssc_data WHERE type = 55 ORDER BY id DESC LIMIT 5").Scan(&records).Error
	if err != nil {
		fmt.Println("查询失败:", err)
	} else {
		fmt.Printf("查询到 %d 条记录:\n", len(records))
		for i, r := range records {
			fmt.Printf("%d. id=%d, number=%s, data=%s, time=%d\n", i+1, r.ID, r.Number, r.Data, r.Time)
		}
	}

	// 使用原生db直接查询
	fmt.Println("\n=== 使用sql.DB原生查询 ===")
	sqlDB, _ := db.DB()
	rows, err := sqlDB.Query("SELECT id, number, data, time FROM ssc_data WHERE type = 55 ORDER BY id DESC LIMIT 5")
	if err != nil {
		fmt.Println("查询失败:", err)
		return
	}
	defer rows.Close()

	fmt.Println("列:")
	cols, _ := rows.Columns()
	for _, col := range cols {
		fmt.Printf("  %s", col)
	}

	fmt.Println("\n数据:")
	for rows.Next() {
		var id int64
		var num string
		var data string
		var time int64
		if err := rows.Scan(&id, &num, &data, &time); err == nil {
			fmt.Printf("  id=%d, number=%s, data=%s, time=%d\n", id, num, data, time)
		}
	}
}
