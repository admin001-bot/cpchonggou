package i18n

import (
	"fmt"
	"sync"

	"lottery-system/pkg/i18n/lang"
)

// Language 语言类型
type Language string

const (
	ZhTW Language = "zh-TW" // 繁体中文
	En   Language = "en"    // 英文
)

// 当前语言
var currentLang Language = ZhTW
var langMutex sync.RWMutex

// 消息字典
var messages = map[Language]map[string]string{
	ZhTW: lang.ZhTW,
	En:   lang.En,
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
			return ZhTW
		case "en":
			return En
		}
	}
	return ZhTW
}
