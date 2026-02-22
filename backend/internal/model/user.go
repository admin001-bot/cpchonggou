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
	ZParentID      int       `gorm:"column:zparentId;default:0" json:"zparentId"`     // 总代理
	ParentID       int       `gorm:"column:parentId;default:0" json:"parentId"`       // 上级代理
	Admin          int8      `gorm:"column:admin;default:0" json:"admin"`
	Username       string    `gorm:"column:username;size:255" json:"username"`
	Password       string    `gorm:"column:password;size:32" json:"-"`
	CoinPassword   string    `gorm:"column:coinPassword;size:32;default:''" json:"-"`
	Type           int8      `gorm:"column:type;default:0" json:"type"`           // 0会员,1代理,2总代理,3股东
	PanID          int8      `gorm:"column:panid;default:2" json:"panId"`         // 1为A盘玩法,2为B盘玩法
	Nickname       string    `gorm:"column:nickname;size:255" json:"nickname"`
	Name           string    `gorm:"column:name;size:32;default:''" json:"name"`   // 用户真实姓名
	RegIP          string    `gorm:"column:regIP;size:255" json:"regIp"`
	RegTime        int64     `gorm:"column:regTime" json:"regTime"`
	UpdateTime     time.Time `gorm:"column:updateTime;autoUpdateTime" json:"updateTime"`
	Coin           float64   `gorm:"column:coin;default:0;precision:10;scale:2" json:"coin"`           // 个人财产
	FCoin          float64   `gorm:"column:fcoin;default:0;precision:10;scale:2" json:"fCoin"`         // 冻结资产
	FanDian        float32   `gorm:"column:fanDian;default:0;precision:3;scale:1" json:"fanDian"`      // 返点数
	Rebate         float64   `gorm:"column:rebate;default:0;precision:10;scale:3" json:"rebate"`       // 玩法退水
	MaxMoney       int       `gorm:"column:maxMoney;default:0" json:"maxMoney"`                        // 单注最高投注
	MaxTurnMoney   int       `gorm:"column:maxTurnMoney;default:0" json:"maxTurnMoney"`               // 单期最高投注
	Email          string    `gorm:"column:email;size:64" json:"email"`
	QQ             string    `gorm:"column:qq;size:16" json:"qq"`
	Phone          string    `gorm:"column:phone;size:255" json:"phone"`
	Src            string    `gorm:"column:src;size:32;default:''" json:"src"`                        // 账号来源
	TestFlag       int8      `gorm:"column:testFlag;default:0" json:"testFlag"`
	MLetterStatus  int8      `gorm:"column:mLetterStatus;default:1" json:"mLetterStatus"`            // 站内信开关
	ConCommStatus  int8      `gorm:"column:conCommStatus" json:"conCommStatus"`                       // 消费佣金发放状态
	LossCommStatus int8      `gorm:"column:lossCommStatus" json:"lossCommStatus"`                    // 亏损佣金发放状态
	Xuni           int8      `gorm:"column:xuni" json:"xuni"`                                          // 虚拟帐号
	Grade          int8      `gorm:"column:grade;default:1" json:"grade"`                             // 等级
	Care           string    `gorm:"column:care;size:16" json:"care"`
	Parents        string    `gorm:"column:parents" json:"parents"`
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
