<template>
  <div class="help-center">
    <!-- 顶部导航 -->
    <header class="header">
      <span class="back-btn" @click="$router.back()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
      </span>
      <h1 class="title">{{ t('user.helpCenter') }}</h1>
      <span class="header-right"></span>
    </header>

    <!-- 帮助列表 -->
    <div class="help-list">
      <div
        v-for="(item, index) in helpItems"
        :key="index"
        class="help-item"
        :class="{ expanded: expandedIndex === index }"
        @click="toggleItem(index)"
      >
        <div class="help-question">
          <span class="question-icon">#</span>
          <span class="question-text">{{ item.question }}</span>
          <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>
        <div class="help-answer" v-show="expandedIndex === index">
          <p v-html="item.answer"></p>
        </div>
      </div>
    </div>

    <!-- 底部联系提示 -->
    <div class="contact-tip">
      <p>{{ t('user.helpTip') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { t } from '@/locales'

const expandedIndex = ref<number | null>(0)

// 帮助中心数据
const helpItems = ref([
  {
    question: t('help.q1') || '遇到登录不成功怎么办?',
    answer: t('help.a1') || '检查用户名和密码是否正确, 注意区别大小写; 检查用户名是否有空格, 如果有, 请删除空格'
  },
  {
    question: t('help.q2') || '登录成功跳转首页显示没登录?',
    answer: t('help.a2') || '检查浏览器是否开启了"无痕浏览器模式", 如果是, 请关闭; 检查浏览器是否"阻止所有Cookie", 如果是, 请取消; 如果还是无法登录, 请更换其他浏览器试试'
  },
  {
    question: t('help.q3') || '安卓手机推什么浏览器?',
    answer: t('help.a3') || 'X浏览器: 不足1M, 加速便<br>X浏览器-X5内核版: 少于1M<br>Edge: 微软新版浏览器, 强大'
  },
  {
    question: t('help.q4') || '苹果手机推什么浏览器?',
    answer: t('help.a4') || 'Safari浏览器: 内核浏览器<br>Edge: 微软新版浏览器, 强大'
  },
  {
    question: t('help.q5') || '如何充值?',
    answer: t('help.a5') || '登录后进入"资金管理"，点击"存款"，选择支付方式进行充值'
  },
  {
    question: t('help.q6') || '如何提现?',
    answer: t('help.a6') || '登录后进入"资金管理"，点击"提款"，输入金额和资金密码进行提现'
  },
  {
    question: t('help.q7') || '忘记密码怎么办?',
    answer: t('help.a7') || '联系在线客服，协助您重置密码'
  }
])

const toggleItem = (index: number) => {
  if (expandedIndex.value === index) {
    expandedIndex.value = null
  } else {
    expandedIndex.value = index
  }
}
</script>

<style scoped>
.help-center {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 20px;
  overflow-y: auto;
}

/* 顶部导航 */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 45px;
  padding: 0 12px;
  background: linear-gradient(45deg, #fb2351, #ff4b3e);
  position: sticky;
  top: 0;
  z-index: 100;
}

.back-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  cursor: pointer;
}

.back-btn:active {
  background: rgba(255, 255, 255, 0.35);
  transform: scale(0.92);
}

.back-btn svg {
  width: 20px;
  height: 20px;
  color: #fff;
}

.title {
  flex: 1;
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  margin: 0;
}

.header-right {
  width: 36px;
}

/* 帮助列表 */
.help-list {
  padding: 15px 10px;
}

.help-item {
  background: #fff;
  border-radius: 12px;
  margin-bottom: 10px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.help-question {
  display: flex;
  align-items: center;
  padding: 16px 15px;
  cursor: pointer;
  transition: background 0.2s;
}

.help-item.expanded .help-question {
  background: linear-gradient(90deg, rgba(251, 35, 81, 0.05) 0%, rgba(255, 75, 62, 0.05) 100%);
}

.help-question:active {
  background: #f9f9f9;
}

.question-icon {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(45deg, #fb2351, #ff4b3e);
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  border-radius: 6px;
  margin-right: 12px;
}

.question-text {
  flex: 1;
  font-size: 14px;
  color: #333;
  font-weight: 500;
  line-height: 1.4;
}

.arrow-icon {
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  color: #ccc;
  transition: transform 0.3s;
}

.help-item.expanded .arrow-icon {
  transform: rotate(180deg);
}

.help-answer {
  padding: 0 15px 16px;
  padding-left: 51px;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.help-answer p {
  margin: 0;
  font-size: 13px;
  color: #666;
  line-height: 1.6;
}

/* 联系提示 */
.contact-tip {
  padding: 20px 15px;
  text-align: center;
}

.contact-tip p {
  margin: 0;
  font-size: 12px;
  color: #999;
}
</style>
