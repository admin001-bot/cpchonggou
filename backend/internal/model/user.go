package model

import (
	"time"
)

// User 用户模型 (对应 ssc_members 表)
type User struct {
	UID            uint      `gorm:"primaryKey;autoIncrement;column:uid" json:"uid"`
	IsDelete       int8      `gorm:"column:isDelete;default:0" json:"isDelete"`
	Enable         int8      `gorm:"column:enable;default:1" json:"enable"`
	GudongID       int       `gorm:"column:gudongId;default:0" json:"gudongId"`
	ZParentID      int       `gorm:"column:zparentId;default:0" json:"zparentId"`
	ParentID       int       `gorm:"column:parentId;default:0" json:"parentId"`
	Admin          int8      `gorm:"column:admin;default:0" json:"admin"`
	Username       string    `gorm:"column:username;size:255" json:"username"`
	Password       string    `gorm:"column:password;size:32" json:"-"`
	CoinPassword   string    `gorm:"column:coinPassword;size:32;default:''" json:"-"`
	Type           int8      `gorm:"column:type;default:0" json:"type"`
	PanID          int8      `gorm:"column:panid;default:2" json:"panId"`
	Nickname       string    `gorm:"column:nickname;size:255" json:"nickname"`
	Name           string    `gorm:"column:name;size:32;default:''" json:"name"`
	RegIP          string    `gorm:"column:regIP;size:255" json:"regIp"`
	RegTime        int64     `gorm:"column:regTime" json:"regTime"`
	UpdateTime     time.Time `gorm:"column:updateTime" json:"updateTime"`
	Coin           float64   `gorm:"column:coin;default:0" json:"coin"`
	FCoin          float64   `gorm:"column:fcoin;default:0" json:"fCoin"`
	FanDian        float32   `gorm:"column:fanDian;default:0" json:"fanDian"`
	Rebate         float64   `gorm:"column:rebate;default:0" json:"rebate"`
	MaxMoney       int       `gorm:"column:maxMoney;default:0" json:"maxMoney"`
	MaxTurnMoney   int       `gorm:"column:maxTurnMoney;default:0" json:"maxTurnMoney"`
	Email          string    `gorm:"column:email;size:64" json:"email"`
	QQ             string    `gorm:"column:qq;size:16" json:"qq"`
	Phone          string    `gorm:"column:phone;size:255" json:"phone"`
	Src            string    `gorm:"column:src;size:32;default:''" json:"src"`
	TestFlag       int8      `gorm:"column:testFlag;default:0" json:"testFlag"`
	MLetterStatus  int8      `gorm:"column:mLetterStatus;default:1" json:"mLetterStatus"`
	ConCommStatus  int8      `gorm:"column:conCommStatus" json:"conCommStatus"`
	LossCommStatus int8      `gorm:"column:lossCommStatus" json:"lossCommStatus"`
	Xuni           int8      `gorm:"column:xuni" json:"xuni"`
	Grade          int8      `gorm:"column:grade;default:1" json:"grade"`
	Care           string    `gorm:"column:care;size:16" json:"care"`
	Score          int       `gorm:"column:score;default:0" json:"score"`
	ScoreTotal     int       `gorm:"column:scoreTotal;default:0" json:"scoreTotal"`
	FanDianBdw     float32   `gorm:"column:fanDianBdw;default:0" json:"fanDianBdw"`
	Deposit        float64   `gorm:"column:deposit;default:0" json:"deposit"`
	DepositStatus  int8      `gorm:"column:depositStatus;default:0" json:"depositStatus"`
	UpdatePw       int8      `gorm:"column:updatePw;default:0" json:"updatePw"`
	Bbin           float64   `gorm:"column:bbin" json:"bbin"`
	Ison           int       `gorm:"column:ison;default:0" json:"ison"`
	Ag             float64   `gorm:"column:ag" json:"ag"`
	VipID          int       `gorm:"column:vipid" json:"vipid"`
}

func (User) TableName() string {
	return TableMembers
}

// UserBank 用户银行卡 (对应 ssc_member_bank 表)
type UserBank struct {
	ID        uint      `gorm:"primaryKey;autoIncrement;column:id" json:"id"`
	UID       uint      `gorm:"column:uid" json:"uid"`
	Username  string    `gorm:"column:username;size:50" json:"username"`
	BankID    int       `gorm:"column:bankId" json:"bankId"`
	Account   string    `gorm:"column:account;size:50" json:"account"`
	CountName string    `gorm:"column:countname;size:100" json:"countName"`
	AddTime   int64     `gorm:"column:addTime" json:"addTime"`
}

func (UserBank) TableName() string {
	return TableMemberBank
}

// UserSession 用户会话 (对应 ssc_member_session 表)
type UserSession struct {
	ID          uint   `gorm:"primaryKey;autoIncrement;column:id" json:"id"`
	UID         uint   `gorm:"column:uid" json:"uid"`
	SessionKey  string `gorm:"column:session_key;size:100" json:"sessionKey"`
	LoginIP     string `gorm:"column:loginIP;size:50" json:"loginIp"`
	AccessTime  int64  `gorm:"column:accessTime" json:"accessTime"`
	IsOnLine    int8   `gorm:"column:isOnLine;default:1" json:"isOnLine"`
}

func (UserSession) TableName() string {
	return TableMemberSession
}
