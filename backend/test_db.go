package main

import (
	"database/sql"
	"fmt"
	_ "github.com/go-sql-driver/mysql"
)

func main() {
	db, err := sql.Open("mysql", "root:root@tcp(127.0.0.1:3306)/lottery_system?charset=utf8mb4")
	if err != nil {
		fmt fmt.Println("连接失败:", err)
		return
	}
	defer db.Close()

	fmt.Println("=== 查询游戏55的最新10条记录（按ID DESC）===")
	rows, err := db.Query("SELECT id, number, data, time FROM ssc_data WHERE type = 55 ORDER BY id DESC LIMIT 10")
	if err != nil {
		fmt.Println("查询失败:", err)
		return
	}
	defer rows.Close()

	for rows.Next() {
		var id int64
		var number string
		var data string
		var time int64
		rows.Scan(&id, &number, &data, &time)
		fmt.Printf("id=%d, number=%s, data=%s, time=%d\n", id, number, data, time)
	}

	// 查询总数
	var count int
	db.QueryRow("SELECT COUNT(*) FROM ssc_data WHERE type = 55").Scan(&count)
	fmt.Printf("\n游戏55总记录数: %d\n", count)

	// 查询第一条
	fmt.Println("\n=== 查询游戏55的第一条（按ID DESC LIMIT 1）===")
	var firstID int64
	var firstNumber string
	var firstData string
	err = db.QueryRow("SELECT id, number, data FROM ssc_data WHERE type = 55 ORDER BY id DESC LIMIT 1").Scan(&firstID, &firstNumber, &firstData)
	if err != nil {
		fmt.Println("查询失败:", err)
	} else {
		fmt.Printf("第一条: id=%d, number=%s, data=%s\n", firstID, firstNumber, firstData)
	}
}
