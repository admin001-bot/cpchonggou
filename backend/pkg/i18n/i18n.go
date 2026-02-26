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
		"withdraw.failed":          "提現申請失敗",
		"withdraw.time_range":      "提現時間：從%s到%s",
		"withdraw.success_message": "申請提現成功，請等待客服人員審核",
		"bank.last4":               "尾號",
		"deposit.system":           "系統儲值",
		"deposit.admin":            "管理員儲值",

		// 通用消息
		"common.error": "系統錯誤",
		"common.unauthorized": "未授權",

		// 登錄
		"login.success": "登錄成功",
		"login.failed": "登錄失敗",
		"login.invalid_credentials": "用戶名或密碼錯誤",
		"login.account_disabled": "賬號已被禁用",
		"login.guest_disabled": "試玩功能已關閉",
		"login.token_invalid": "token無效或已過期",

		// 註冊
		"register.success": "註冊成功",
		"register.failed": "註冊失敗",
		"register.username_exists": "用戶名已存在",
		"register.invalid_username": "用戶名格式錯誤",
		"register.invalid_password": "密碼格式錯誤",
		"register.password_too_short": "密碼長度不足",
		"register.enterCompleteInfo": "請填寫完整的註冊信息",
		"register.usernameLength": "用戶名長度必須在3-20個字符之間",
		"register.enterPhone": "手機號碼不能為空",

		// 星期
		"week.0": "星期日",
		"week.1": "星期一",
		"week.2": "星期二",
		"week.3": "星期三",
		"week.4": "星期四",
		"week.5": "星期五",
		"week.6": "星期六",
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
		"withdraw.failed":          "提现申请失败",
		"withdraw.time_range":      "提现时间：从%s到%s",
		"withdraw.success_message": "申请提现成功，请等待客服人员审核",
		"bank.last4":               "尾号",
		"deposit.system":           "系统充值",
		"deposit.admin":            "管理员充值",

		// 通用消息
		"common.error": "系统错误",
		"common.unauthorized": "未授权",

		// 登录
		"login.success": "登录成功",
		"login.failed": "登录失败",
		"login.invalid_credentials": "用户名或密码错误",
		"login.account_disabled": "账号已被禁用",
		"login.guest_disabled": "试玩功能已关闭",
		"login.token_invalid": "token无效或已过期",

		// 注册
		"register.success": "注册成功",
		"register.failed": "注册失败",
		"register.username_exists": "用户名已存在",
		"register.invalid_username": "用户名格式错误",
		"register.invalid_password": "密码格式错误",
		"register.password_too_short": "密码长度不足",
		"register.enterCompleteInfo": "请填写完整的注册信息",
		"register.usernameLength": "用户名长度必须在3-20个字符之间",
		"register.enterPhone": "手机号码不能为空",

		// 星期
		"week.0": "星期日",
		"week.1": "星期一",
		"week.2": "星期二",
		"week.3": "星期三",
		"week.4": "星期四",
		"week.5": "星期五",
		"week.6": "星期六",
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
		"withdraw.failed":          "Withdrawal request failed",
		"withdraw.time_range":      "Withdrawal time: from %s to %s",
		"withdraw.success_message": "Withdrawal request submitted, please wait for staff review",
		"bank.last4":               "Last 4 digits",
		"deposit.system":           "System Deposit",
		"deposit.admin":            "Admin Deposit",

		// Common messages
		"common.error": "System error",
		"common.unauthorized": "Unauthorized",

		// Login
		"login.success": "Login successful",
		"login.failed": "Login failed",
		"login.invalid_credentials": "Invalid username or password",
		"login.account_disabled": "Account has been disabled",
		"login.guest_disabled": "Demo feature is disabled",
		"login.token_invalid": "Token invalid or expired",

		// Register
		"register.success": "Registration successful",
		"register.failed": "Registration failed",
		"register.username_exists": "Username already exists",
		"register.invalid_username": "Invalid username format",
		"register.invalid_password": "Invalid password format",
		"register.password_too_short": "Password too short",
		"register.enterCompleteInfo": "Please fill in complete registration info",
		"register.usernameLength": "Username must be 3-20 characters",
		"register.enterPhone": "Phone number cannot be empty",

		// Week days
		"week.0": "Sunday",
		"week.1": "Monday",
		"week.2": "Tuesday",
		"week.3": "Wednesday",
		"week.4": "Thursday",
		"week.5": "Friday",
		"week.6": "Saturday",
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
