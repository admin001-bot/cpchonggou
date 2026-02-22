package model

// 数据库表名常量
const (
	TableMembers        = "ssc_members"
	TableMemberSession  = "ssc_member_session"
	TableMemberBank     = "ssc_member_bank"
	TableMemberCash     = "ssc_member_cash"
	TableMemberRecharge = "ssc_member_recharge"
	TableGuestMembers   = "ssc_guestmembers"
	TableGuestBets      = "ssc_guestbets"
	TableBets           = "ssc_bets"
	TableType           = "ssc_type"
	TablePlayed         = "ssc_played"
	TablePlayedGroup    = "ssc_played_group"
	TableData           = "ssc_data"
	TableDataTime       = "ssc_data_time"
	TableParams         = "ssc_params"
	TableContent        = "ssc_content"
	TableLetter         = "ssc_letter"
	TableBonusLog       = "ssc_bonus_log"
	TableLinks          = "ssc_links"
	TableCoinLog        = "ssc_coin_log"
	TableBankList       = "ssc_bank_list"
)

// GameType 游戏类型 (对应 ssc_type 表)
type GameType struct {
	ID              uint   `gorm:"primaryKey;autoIncrement;column:id" json:"id"`
	Type            int    `gorm:"column:type" json:"type"`                                     // 1时时彩,2十一选五,3D/P3,4快乐十分,5广西快乐十分
	Enable          int8   `gorm:"column:enable;default:0" json:"enable"`                       // 1为开启0为关闭
	IsDelete        int8   `gorm:"column:isDelete;default:0" json:"isDelete"`
	Sort            int8   `gorm:"column:sort;default:0" json:"sort"`
	Name            string `gorm:"column:name;size:32" json:"name"`
	CodeList        string `gorm:"column:codeList;size:125;default:'0,1,2,3,4,5,6,7,8,9'" json:"codeList"` // 可选号码列表
	Title           string `gorm:"column:title;size:64" json:"title"`
	ShortName       string `gorm:"column:shortName;size:8;default:''" json:"shortName"`
	Info            string `gorm:"column:info;size:255" json:"info"`
	OnGetNoed       string `gorm:"column:onGetNoed;size:64;default:''" json:"onGetNoed"`       // 请求当前期号时后置事件函数
	DataFTime       int    `gorm:"column:data_ftime;default:30" json:"dataFtime"`              // 开奖前停止下注时间
	DefaultViewGroup int   `gorm:"column:defaultViewGroup;default:0" json:"defaultViewGroup"`  // 默认显示哪个玩法组
	Android         int8   `gorm:"column:android;default:0" json:"android"`
	Num             int    `gorm:"column:num" json:"num"`                                       // 彩种期数
	PlayedInfo      string `gorm:"column:playedinfo;size:225" json:"playedInfo"`
}

func (GameType) TableName() string {
	return TableType
}

// Played 玩法 (对应 ssc_played 表)
type Played struct {
	ID            uint    `gorm:"primaryKey;autoIncrement;column:id" json:"id"`
	Name          string  `gorm:"column:name;size:50" json:"name"`
	Type          int     `gorm:"column:type" json:"type"`
	PlayedGroupID int     `gorm:"column:played_groupid" json:"playedGroupId"`
	Enable        int8    `gorm:"column:enable;default:1" json:"enable"`
	Sort          int     `gorm:"column:sort;default:0" json:"sort"`
	FanDian       float64 `gorm:"column:fanDian;default:0" json:"fanDian"`
	BonusProp     float64 `gorm:"column:bonusProp;default:0" json:"bonusProp"`
	MinMoney      int     `gorm:"column:minMoney;default:1" json:"minMoney"`
	MaxMoney      int     `gorm:"column:maxMoney;default:0" json:"maxMoney"`
	MaxTurnMoney  int     `gorm:"column:maxTurnMoney;default:0" json:"maxTurnMoney"`
}

func (Played) TableName() string {
	return TablePlayed
}

// PlayedGroup 玩法分组 (对应 ssc_played_group 表)
type PlayedGroup struct {
	ID     uint   `gorm:"primaryKey;autoIncrement;column:id" json:"id"`
	Name   string `gorm:"column:name;size:50" json:"name"`
	Type   int    `gorm:"column:type" json:"type"`
	Enable int8   `gorm:"column:enable;default:1" json:"enable"`
	Sort   int    `gorm:"column:sort;default:0" json:"sort"`
}

func (PlayedGroup) TableName() string {
	return TablePlayedGroup
}

// Bet 投注记录 (对应 ssc_bets 表)
type Bet struct {
	ID            uint    `gorm:"primaryKey;autoIncrement;column:id" json:"id"`
	WJOrderID     string  `gorm:"column:wjorderId;size:35" json:"wjOrderId"`            // 随机订单号
	SerializeID   string  `gorm:"column:serializeId;size:35" json:"serializeId"`        // 投注号
	UID           int     `gorm:"column:uid;index" json:"uid"`
	Username      string  `gorm:"column:username;size:32;default:''" json:"username"`
	Nickname      string  `gorm:"column:nickname;size:32" json:"nickname"`
	Type          int8    `gorm:"column:type" json:"type"`                               // 投注种类
	PlayedGroup   int     `gorm:"column:playedGroup" json:"playedGroup"`                 // 玩法组ID
	PlayedID      int     `gorm:"column:playedId" json:"playedId"`                       // 玩法ID
	GroupName     string  `gorm:"column:Groupname;size:32" json:"groupName"`
	ActionNo      string  `gorm:"column:actionNo;size:32;index" json:"actionNo"`         // 投注期号
	ActionData    string  `gorm:"column:actionData;type:longtext" json:"actionData"`     // 投注号码
	ActionTime    int64   `gorm:"column:actionTime;index" json:"actionTime"`             // 投注时间
	ActionIP      string  `gorm:"column:actionIP;size:255" json:"actionIp"`              // 投注IP
	Odds          float64 `gorm:"column:odds;precision:10;scale:3" json:"odds"`
	Rebate        float64 `gorm:"column:rebate;default:0;precision:10;scale:5" json:"rebate"`        // 退水比例
	RebateMoney   float64 `gorm:"column:rebateMoney;default:0;precision:10;scale:2" json:"rebateMoney"` // 退水金额
	FanDian       float64 `gorm:"column:fanDian;default:0;precision:10;scale:2" json:"fanDian"`        // 返点
	FanDianAmount float64 `gorm:"column:fanDianAmount;default:0;precision:10;scale:2" json:"fanDianAmount"` // 支付的所有返点
	Bonus         float64 `gorm:"column:bonus;default:0;precision:10;scale:2" json:"bonus"`             // 中奖金额
	Money         int     `gorm:"column:money;default:0" json:"money"`                  // 倍数
	LotteryNo     string  `gorm:"column:lotteryNo;size:32;default:''" json:"lotteryNo"` // 开奖号码
	KJTime        int64   `gorm:"column:kjTime;default:0;index" json:"kjTime"`          // 官方开奖时间
	ZJCount       int     `gorm:"column:zjCount;default:0" json:"zjCount"`              // 中奖注数
	Flag          int8    `gorm:"column:flag;default:0" json:"flag"`                    // 识别盈亏0为亏1为赢
	IsDelete      int8    `gorm:"column:isDelete;default:0" json:"isDelete"`            // 是否已取消
	OrderID       int64   `gorm:"column:orderId" json:"orderId"`                        // 订单号
	TotalNums     int     `gorm:"column:totalNums;default:1" json:"totalNums"`          // 投注组数
	TotalMoney    float64 `gorm:"column:totalMoney;default:0;precision:10;scale:2" json:"totalMoney"` // 投注总金额
	BetInfo       string  `gorm:"column:betInfo;size:32;default:''" json:"betInfo"`
}

func (Bet) TableName() string {
	return TableBets
}

// LotteryData 开奖数据 (对应 ssc_data 表)
type LotteryData struct {
	ID     uint   `gorm:"primaryKey;autoIncrement;column:id" json:"id"`
	Type   uint8  `gorm:"column:type;uniqueIndex:idx_type_number" json:"type"`  // 时时彩种类
	Time   int64  `gorm:"column:time;index" json:"time"`                        // 开奖时间
	Number string `gorm:"column:number;size:32;uniqueIndex:idx_type_number" json:"number"` // 期号
	Data   string `gorm:"column:data;size:80" json:"data"`                       // 开奖号码
}

func (LotteryData) TableName() string {
	return TableData
}

// DataTime 开奖时间 (对应 ssc_data_time 表)
type DataTime struct {
	ID         uint   `gorm:"primaryKey;autoIncrement;column:id" json:"id"`
	Type       uint8  `gorm:"column:type" json:"type"`
	ActionNo   string `gorm:"column:actionNo;size:32" json:"actionNo"`
	ActionTime int64  `gorm:"column:actionTime" json:"actionTime"`
}

func (DataTime) TableName() string {
	return TableDataTime
}

// MemberCash 提现记录 (对应 ssc_member_cash 表)
type MemberCash struct {
	ID        uint    `gorm:"primaryKey;autoIncrement;column:id" json:"id"`
	UID       uint    `gorm:"column:uid;index" json:"uid"`
	Amount    float64 `gorm:"column:amount;precision:10;scale:2" json:"amount"`
	BankID    int     `gorm:"column:bankId" json:"bankId"`
	Account   string  `gorm:"column:account;size:50" json:"account"`
	CountName string  `gorm:"column:countname;size:100" json:"countName"`
	State     int8    `gorm:"column:state;default:0" json:"state"`
	Info      string  `gorm:"column:info;size:255" json:"info"`
	IsDelete  int8    `gorm:"column:isDelete;default:0" json:"isDelete"`
	AddTime   int64   `gorm:"column:addTime" json:"addTime"`
	ActionUID uint    `gorm:"column:actionUid" json:"actionUid"`
	ActionIP  string  `gorm:"column:actionIP;size:50" json:"actionIp"`
}

func (MemberCash) TableName() string {
	return TableMemberCash
}

// MemberRecharge 充值记录 (对应 ssc_member_recharge 表)
type MemberRecharge struct {
	ID             uint    `gorm:"primaryKey;autoIncrement;column:id" json:"id"`
	UID            uint    `gorm:"column:uid;index" json:"uid"`
	RechargeAmount float64 `gorm:"column:rechargeAmount;precision:10;scale:2" json:"rechargeAmount"`
	Amount         float64 `gorm:"column:amount;precision:10;scale:2" json:"amount"`
	State          int8    `gorm:"column:state;default:0" json:"state"`
	Info           string  `gorm:"column:info;size:255" json:"info"`
	IsDelete       int8    `gorm:"column:isDelete;default:0" json:"isDelete"`
	AddTime        int64   `gorm:"column:addTime" json:"addTime"`
	ActionUID      uint    `gorm:"column:actionUid" json:"actionUid"`
	ActionIP       string  `gorm:"column:actionIP;size:50" json:"actionIp"`
}

func (MemberRecharge) TableName() string {
	return TableMemberRecharge
}

// CoinLog 资金日志 (对应 ssc_coin_log 表)
type CoinLog struct {
	ID        uint    `gorm:"primaryKey;autoIncrement;column:id" json:"id"`
	UID       uint    `gorm:"column:uid;index" json:"uid"`
	Type      int     `gorm:"column:liqType" json:"type"`
	Info      string  `gorm:"column:info;size:255" json:"info"`
	Coin      float64 `gorm:"column:coin;precision:10;scale:2" json:"coin"`
	FCoin     float64 `gorm:"column:fcoin;precision:10;scale:2" json:"fCoin"`
	UserCoin  float64 `gorm:"column:userCoin;precision:10;scale:2" json:"userCoin"`
	ActionUID uint    `gorm:"column:actionUid" json:"actionUid"`
	ActionIP  string  `gorm:"column:actionIP;size:50" json:"actionIp"`
	ActionTime int64  `gorm:"column:actionTime" json:"actionTime"`
}

func (CoinLog) TableName() string {
	return TableCoinLog
}

// BonusLog 佣金日志 (对应 ssc_bonus_log 表)
type BonusLog struct {
	ID          uint    `gorm:"primaryKey;autoIncrement;column:id" json:"id"`
	UID         uint    `gorm:"column:uid;index" json:"uid"`
	Amount      float64 `gorm:"column:amount;precision:10;scale:2" json:"amount"`
	BonusType   int     `gorm:"column:bonusType" json:"bonusType"`
	BonusStatus int8    `gorm:"column:bonusStatus;default:0" json:"bonusStatus"`
	Info        string  `gorm:"column:info;size:255" json:"info"`
	AddTime     int64   `gorm:"column:addTime" json:"addTime"`
}

func (BonusLog) TableName() string {
	return TableBonusLog
}

// Letter 站内信 (对应 ssc_letter 表)
type Letter struct {
	ID      uint   `gorm:"primaryKey;autoIncrement;column:id" json:"id"`
	ToUID   uint   `gorm:"column:aId;index" json:"toUid"`
	FromUID uint   `gorm:"column:fromId" json:"fromUid"`
	Title   string `gorm:"column:title;size:100" json:"title"`
	Content string `gorm:"column:content;type:text" json:"content"`
	IsRead  int8   `gorm:"column:IsRead;default:0" json:"isRead"`
	Flag    int8   `gorm:"column:flag;default:0" json:"flag"`
	AddTime int64  `gorm:"column:addTime" json:"addTime"`
}

func (Letter) TableName() string {
	return TableLetter
}

// Link 推广链接 (对应 ssc_links 表)
type Link struct {
	ID      uint   `gorm:"primaryKey;column:lid" json:"id"`
	UID     uint   `gorm:"column:uid;index" json:"uid"`
	FanDian int    `gorm:"column:fanDian" json:"fanDian"`
	Type    int    `gorm:"column:type;default:0" json:"type"`
	AddTime int64  `gorm:"column:addTime" json:"addTime"`
}

func (Link) TableName() string {
	return TableLinks
}

// Params 系统参数 (对应 ssc_params 表)
type Params struct {
	ID    uint   `gorm:"primaryKey;autoIncrement;column:id" json:"id"`
	Name  string `gorm:"column:name;size:50;uniqueIndex" json:"name"`
	Value string `gorm:"column:value;type:text" json:"value"`
}

func (Params) TableName() string {
	return TableParams
}

// BankList 银行列表 (对应 ssc_bank_list 表)
type BankList struct {
	ID     uint   `gorm:"primaryKey;autoIncrement;column:id" json:"id"`
	Name   string `gorm:"column:name;size:50" json:"name"`
	Enable int8   `gorm:"column:enable;default:1" json:"enable"`
	Sort   int    `gorm:"column:sort;default:0" json:"sort"`
}

func (BankList) TableName() string {
	return TableBankList
}
