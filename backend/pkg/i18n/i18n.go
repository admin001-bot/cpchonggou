package i18n

import (
	"fmt"
	"sync"
)

// Language 语言类型
type Language string

const (
	ZhTW Language = "zh-TW" // 繁体中文
	ZhCN Language = "zh-CN" // 简体中文
	En   Language = "en"    // 英文
)

// 当前语言
var currentLang Language = ZhTW
var langMutex sync.RWMutex

// 消息字典
var messages = map[Language]map[string]string{
	ZhTW: {
		// 系统消息
		"bet.success":           "投注成功",
		"bet.param_error":       "參數錯誤",
		"bet.login_required":    "請先登錄",
		"bet.user_not_found":    "用戶不存在",
		"bet.platform_stopped":  "本平台已停止購買！",
		"bet.agent_disabled":    "代理不能投注！",
		"bet.zdl_disabled":      "總代理不能投注！",
		"bet.gd_disabled":       "股東不能投注！",
		"bet.select_first":      "請先選擇號碼再提交投注",
		"bet.expired":           "投注失敗：你投注第%s已過購買時間",
		"bet.game_disabled":     "遊戲已停用,請刷新再投",
		"bet.insufficient":      "您的可用資金不足，請先儲值",
		"bet.min_nums":          "注數不能小於1，請重新投注",
		"bet.max_nums":          "注數不能大於1000，請重新投注",
		"bet.min_money":         "投注總金額不能小於1，請重新投注",
		"bet.period_limit":      "您的單期投注金額只能小於%d,現已投注%.0f",
		"bet.play_not_found":    "遊戲玩法不存在,請刷新再投",
		"bet.play_disabled":     "遊戲玩法已停用,請刷新再投 %d",
		"bet.play_limit":        "遊戲玩法（%s-%s）每期金額只能小於%d,現已投注%.0f",
		"bet.single_limit":      "您的單注金額只能小於%d",
		"bet.min_single":        "單注金額只能大於%d正整數",
		"bet.max_single":        "單注金額只能為小於%d正整數",
		"bet.system_error":      "異常錯誤:%s請聯絡管理員",
		"bet.submit_error":      "提交資料出錯，請重新投注",

		// 提现消息
		"withdraw.success":         "提現申請已提交",
		"withdraw.login_required":  "請先登錄",
		"withdraw.info_required":   "請先完善個人信息",
		"withdraw.bank_required":   "請先綁定銀行卡",
		"withdraw.invalid_amount":  "請輸入有效的提現金額",
		"withdraw.insufficient":    "餘額不足",
		"withdraw.password_error":  "資金密碼錯誤",
		"withdraw.time_error":     "當前不在提現時間內",
		"withdraw.consumption":     "消費比例不足，需要達到%d%%",

		// 通用消息
		"common.error": "系統錯誤",
	},
	ZhCN: {
		// 系统消息
		"bet.success":           "投注成功",
		"bet.param_error":       "参数错误",
		"bet.login_required":    "请先登录",
		"bet.user_not_found":    "用户不存在",
		"bet.platform_stopped":  "本平台已停止购买！",
		"bet.agent_disabled":    "代理不能投注！",
		"bet.zdl_disabled":      "总代理不能投注！",
		"bet.gd_disabled":       "股东不能投注！",
		"bet.select_first":      "请先选择号码再提交投注",
		"bet.expired":           "投注失败：你投注第%s已过购买时间",
		"bet.game_disabled":     "游戏已停用,请刷新再投",
		"bet.insufficient":      "您的可用资金不足，请先充值",
		"bet.min_nums":          "注数不能小于1，请重新投注",
		"bet.max_nums":          "注数不能大于1000，请重新投注",
		"bet.min_money":         "投注总金额不能小于1，请重新投注",
		"bet.period_limit":      "您的单期投注金额只能小于%d,现已投注%.0f",
		"bet.play_not_found":    "游戏玩法不存在,请刷新再投",
		"bet.play_disabled":     "游戏玩法已停用,请刷新再投 %d",
		"bet.play_limit":        "游戏玩法（%s-%s）每期金额只能小于%d,现已投注%.0f",
		"bet.single_limit":      "您的单注金额只能小于%d",
		"bet.min_single":        "单注金额只能大于%d正整数",
		"bet.max_single":        "单注金额只能为小于%d正整数",
		"bet.system_error":      "异常错误:%s请联系管理员",
		"bet.submit_error":      "提交数据出错，请重新投注",

		// 提现消息
		"withdraw.success":         "提现申请已提交",
		"withdraw.login_required":  "请先登录",
		"withdraw.info_required":   "请先完善个人信息",
		"withdraw.bank_required":   "请先绑定银行卡",
		"withdraw.invalid_amount":  "请输入有效的提现金额",
		"withdraw.insufficient":    "余额不足",
		"withdraw.password_error":  "资金密码错误",
		"withdraw.time_error":     "当前不在提现时间内",
		"withdraw.consumption":     "消费比例不足，需要达到%d%%",

		// 通用消息
		"common.error": "系统错误",
	},
	En: {
		// System messages
		"bet.success":           "Bet successful",
		"bet.param_error":       "Invalid parameters",
		"bet.login_required":    "Please login first",
		"bet.user_not_found":    "User not found",
		"bet.platform_stopped":  "Platform has stopped betting!",
		"bet.agent_disabled":    "Agents cannot bet!",
		"bet.zdl_disabled":      "General agents cannot bet!",
		"bet.gd_disabled":       "Shareholders cannot bet!",
		"bet.select_first":      "Please select numbers first",
		"bet.expired":           "Bet failed: Issue %s has expired",
		"bet.game_disabled":     "Game is disabled, please refresh",
		"bet.insufficient":      "Insufficient balance, please deposit",
		"bet.min_nums":          "Number of bets must be at least 1",
		"bet.max_nums":          "Number of bets cannot exceed 1000",
		"bet.min_money":         "Total amount must be at least 1",
		"bet.period_limit":      "Period limit is %d, current: %.0f",
		"bet.play_not_found":    "Play not found, please refresh",
		"bet.play_disabled":     "Play is disabled %d",
		"bet.play_limit":        "Play (%s-%s) period limit is %d, current: %.0f",
		"bet.single_limit":      "Single bet limit is %d",
		"bet.min_single":        "Single bet must be greater than %d",
		"bet.max_single":        "Single bet must be less than %d",
		"bet.system_error":      "System error: %s, please contact admin",
		"bet.submit_error":      "Submit error, please try again",

		// Withdraw messages
		"withdraw.success":         "Withdrawal request submitted",
		"withdraw.login_required":  "Please login first",
		"withdraw.info_required":   "Please complete your profile first",
		"withdraw.bank_required":   "Please bind bank card first",
		"withdraw.invalid_amount":  "Please enter valid amount",
		"withdraw.insufficient":    "Insufficient balance",
		"withdraw.password_error":  "Invalid fund password",
		"withdraw.time_error":     "Not within withdrawal hours",
		"withdraw.consumption":     "Consumption ratio insufficient, need %d%%",

		// Common messages
		"common.error": "System error",
	},
}

// SetLanguage 设置当前语言
func SetLanguage(lang Language) {
	langMutex.Lock()
	defer langMutex.Unlock()
	currentLang = lang
}

// GetLanguage 获取当前语言
func GetLanguage() Language {
	langMutex.RLock()
	defer langMutex.RUnlock()
	return currentLang
}

// T 翻译消息
func T(key string) string {
	lang := GetLanguage()
	if msgs, ok := messages[lang]; ok {
		if msg, ok := msgs[key]; ok {
			return msg
		}
	}
	// 默认返回繁体中文
	if msgs, ok := messages[ZhTW]; ok {
		if msg, ok := msgs[key]; ok {
			return msg
		}
	}
	return key
}

// Tf 格式化翻译消息
func Tf(key string, args ...interface{}) string {
	msg := T(key)
	if len(args) > 0 {
		return fmt.Sprintf(msg, args...)
	}
	return msg
}

// GetLanguageFromHeader 从请求头获取语言
func GetLanguageFromHeader(acceptLanguage string) Language {
	if acceptLanguage == "" {
		return ZhTW
	}
	// 简单解析 Accept-Language 头
	if len(acceptLanguage) >= 2 {
		lang := acceptLanguage[:2]
		switch lang {
		case "zh":
			if len(acceptLanguage) >= 5 && acceptLanguage[3:5] == "CN" {
				return ZhCN
			}
			return ZhTW
		case "en":
			return En
		}
	}
	return ZhTW
}
