package model

import (
	"time"

	"gorm.io/gorm"
)

// User 用户模型 (对应 ssc_members 表)
type User struct {
	UID          uint           `gorm:"primaryKey;column:uid" json:"uid"`
	Username     string         `gorm:"column:username;size:20;uniqueIndex" json:"username"`
	Password     string         `gorm:"column:password;size:32" json:"-"`
	CoinPassword string         `gorm:"column:coinPassword;size:32" json:"-"`
	Name         string         `gorm:"column:name;size:50" json:"name"`
	Balance      float64        `gorm:"column:coin;default:0" json:"balance"`
	Phone        string         `gorm:"column:phone;size:20" json:"phone"`
	Email        string         `gorm:"column:email;size:50" json:"email"`
	QQ           string         `gorm:"column:qq;size:20" json:"qq"`
	WeChat       string         `gorm:"column:wechat;size:50" json:"wechat"`
	ParentID     uint           `gorm:"column:parentId;default:0" json:"parentId"`
	Parents      string         `gorm:"column:parents" json:"parents"`
	UserType     int            `gorm:"column:type;default:0" json:"userType"` // 0=普通用户, 1=代理
	Status       int            `gorm:"column:status;default:0" json:"status"`
	Enable       int            `gorm:"column:enable;default:1" json:"enable"`
	RegIP        string         `gorm:"column:regIP;size:50" json:"regIP"`
	RegTime      time.Time      `gorm:"column:regTime" json:"regTime"`
	LoginIP      string         `gorm:"column:loginIP;size:50" json:"loginIP"`
	LoginTime    time.Time      `gorm:"column:loginTime" json:"loginTime"`
	UpdateTime   time.Time      `gorm:"column:updateTime" json:"updateTime"`
	CreatedAt    time.Time      `gorm:"column:createdAt" json:"createdAt"`
	DeletedAt    gorm.DeletedAt `gorm:"column:deletedAt" json:"-"`
}

func (User) TableName() string {
	return "ssc_members"
}

// UserBank 用户银行卡
type UserBank struct {
	ID        uint      `gorm:"primaryKey;column:id" json:"id"`
	UID       uint      `gorm:"column:uid" json:"uid"`
	Username  string    `gorm:"column:username;size:50" json:"username"`
	BankID    int       `gorm:"column:bankId" json:"bankId"`
	BankName  string    `gorm:"column:bankName;size:50" json:"bankName"`
	Account   string    `gorm:"column:account;size:50" json:"account"`
	CountName string    `gorm:"column:countname;size:100" json:"countName"`
	CreatedAt time.Time `gorm:"column:createdAt" json:"createdAt"`
}

func (UserBank) TableName() string {
	return "ssc_member_bank"
}

// UserSession 用户会话
type UserSession struct {
	ID          uint      `gorm:"primaryKey;column:id" json:"id"`
	UID         uint      `gorm:"column:uid" json:"uid"`
	SessionKey  string    `gorm:"column:session_key;size:100" json:"sessionKey"`
	LoginIP     string    `gorm:"column:loginIP;size:50" json:"loginIP"`
	LoginTime   time.Time `gorm:"column:loginTime" json:"loginTime"`
	IsOnLine    int       `gorm:"column:isOnLine;default:1" json:"isOnLine"`
	LastActive  time.Time `gorm:"column:lastActive" json:"lastActive"`
}

func (UserSession) TableName() string {
	return "ssc_member_session"
}
