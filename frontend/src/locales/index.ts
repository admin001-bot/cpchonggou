// 多语言配置入口
// 默认语言：中文繁体 (zh-TW)

import type { Locale, LocaleMessages } from './types'

// 导入语言包
import zhTW from './lang/zh-TW'
import en from './lang/en'

// 语言包集合
export const messages: Record<Locale, LocaleMessages> = {
  'zh-TW': zhTW,
  'en': en,
}

// 可用语言列表
export const availableLocales: Locale[] = ['zh-TW', 'en']

// 检测浏览器语言
function detectBrowserLanguage(): Locale {
  const browserLang = navigator.language || (navigator as any).userLanguage

  // 简化语言代码
  const lang = browserLang.toLowerCase()

  // 根据浏览器语言返回对应的语言
  if (lang.startsWith('zh')) {
    // 繁体中文地区返回 zh-TW
    if (lang.includes('tw') || lang.includes('hk') || lang.includes('mo')) {
      return 'zh-TW'
    }
    return 'zh-TW' // 默认返回繁体中文
  }

  if (lang.startsWith('en')) {
    return 'en'
  }

  // 默认返回繁体中文
  return 'zh-TW'
}

// 获取当前语言
export function getCurrentLocale(): Locale {
  const stored = localStorage.getItem('locale')
  if (stored && (stored === 'zh-TW' || stored === 'en')) {
    return stored
  }
  // 如果没有存储语言，检测浏览器语言并自动设置
  const browserLang = detectBrowserLanguage()
  localStorage.setItem('locale', browserLang)
  return browserLang
}

// 设置语言
export function setLocale(locale: Locale): void {
  localStorage.setItem('locale', locale)
}

// 翻译函数
export function t(key: string): string {
  const locale = getCurrentLocale()
  return messages[locale][key] || key
}

// 导出语言包（供外部使用）
export { zhTW, en }

// 导出类型
export type { Locale, LocaleMessages }
