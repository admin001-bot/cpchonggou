<template>
  <div class="withdraw-page">
    <!-- Step 1: 未完善个人信息 (没有真实姓名) -->
    <div v-if="step === 1" class="withdraw-step">
      <div class="step-icon">
        <img src="/images/responsive-mess.png" alt="" />
      </div>
      <div class="step-text">{{ t('bank.noProfile') }}</div>
      <button class="step-btn" @click="goCompleteProfile">
        {{ t('bank.completeProfile') }}
      </button>
    </div>

    <!-- Step 2: 未绑定银行卡 -->
    <div v-else-if="step === 2" class="withdraw-step">
      <div class="step-icon">
        <img src="/images/responsive-recard.png" alt="" />
      </div>
      <div class="step-text">{{ t('bank.noBankCard') }}</div>
      <button class="step-btn" @click="goBindBank">
        {{ t('bank.bindBankCard') }}
      </button>
    </div>

    <!-- Step 3: 提款表单 -->
    <div v-else-if="step === 3" class="withdraw-form">
      <div class="form-group">
        <input
          type="number"
          v-model="form.amount"
          :placeholder="t('bank.enterAmount')"
          class="form-input"
          @input="onAmountInput"
        />
        <p class="form-tip">
          {{ t('bank.minLimit') }}<span class="red">{{ withdrawConfig.minMoney }}</span>，
          {{ t('bank.maxLimit') }}<span class="red">{{ formatMoney(withdrawConfig.maxMoney) }}</span>
        </p>
        <p v-if="timeWarning" class="form-tip time-warning">
          {{ timeWarning }}
        </p>
      </div>

      <div class="form-group bank-info">
        <div class="bank-card-info">
          <span class="info-label">{{ t('bank.walletName') }}：</span>
          <span class="info-value">{{ bankInfo.countName }}</span>
        </div>
        <div class="bank-card-info">
          <span class="info-label">{{ t('bank.withdrawAddress') }}：</span>
          <span class="info-value">{{ bankInfo.account }}</span>
        </div>
        <div class="bank-card-info">
          <span class="info-label">{{ t('bank.accountName') }}：</span>
          <span class="info-value">{{ bankInfo.realName }}</span>
        </div>
      </div>

      <div class="form-group">
        <input
          type="password"
          v-model="form.password"
          maxlength="20"
          :placeholder="t('bank.withdrawPassword')"
          class="form-input"
        />
      </div>

      <button class="submit-btn" @click="submitWithdraw" :disabled="loading">
        {{ loading ? t('common.loading') : t('bank.confirmSubmit') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useToastStore } from '@/stores/toast'
import { t } from '@/locales'
import { getBankInfo, getWithdrawConfig, withdraw, type BankInfo, type WithdrawConfig } from '@/api/bank'

const router = useRouter()
const userStore = useUserStore()
const toastStore = useToastStore()

// 步骤：1=未完善信息，2=未绑定银行卡，3=可以提款
const step = ref(3)
const loading = ref(false)
const timeWarning = ref('')

const form = reactive({
  amount: '',
  password: '',
})

// 提款配置
const withdrawConfig = reactive<WithdrawConfig>({
  minMoney: 10,
  maxMoney: 2000000,
  cashFromTime: '09:00',
  cashToTime: '23:00',
  cashMinAmount: 0,
})

// 银行卡信息
const bankInfo = reactive<BankInfo>({
  bankId: 0,
  account: '',
  countName: '',
  username: '',
  realName: '',
})

const formatMoney = (n: number) => {
  return n.toLocaleString()
}

// 金额输入处理
const onAmountInput = () => {
  // 只允许输入数字
  if (form.amount) {
    form.amount = String(form.amount).replace(/[^0-9.]/g, '')
  }
}

const goCompleteProfile = () => {
  // TODO: 跳转到完善信息页面
  toastStore.show({
    type: 'info',
    message: t('bank.completeProfile')
  })
}

const goBindBank = () => {
  // TODO: 跳转到绑定银行卡页面
  toastStore.show({
    type: 'info',
    message: t('bank.bindBankCard')
  })
}

// 检查提现时间
const checkWithdrawTime = () => {
  const now = new Date()
  const currentTime = now.getHours() * 60 + now.getMinutes()

  const [fromHour, fromMin] = withdrawConfig.cashFromTime.split(':').map(Number)
  const [toHour, toMin] = withdrawConfig.cashToTime.split(':').map(Number)

  const fromTime = fromHour * 60 + fromMin
  let toTime = toHour * 60 + toMin

  // 如果结束时间小于开始时间，说明跨天
  if (toTime < fromTime) {
    toTime += 24 * 60
  }

  let currentMinutes = currentTime
  if (currentTime < fromTime && toTime > 24 * 60) {
    currentMinutes += 24 * 60
  }

  if (currentMinutes < fromTime || currentMinutes > toTime) {
    timeWarning.value = `${t('bank.withdrawTime')}: ${withdrawConfig.cashFromTime} - ${withdrawConfig.cashToTime}`
    return false
  }

  timeWarning.value = ''
  return true
}

const fetchBankInfo = async () => {
  try {
    const res = await getBankInfo()
    if (res.code === 0 && res.data) {
      // 检查是否完善个人信息 (realName)
      if (!res.data.realName || res.data.realName === '') {
        step.value = 1
        return
      }

      // 检查是否绑定银行卡 (cardNo/account)
      if (!res.data.account || res.data.account === '') {
        step.value = 2
        return
      }

      // 可以提款
      step.value = 3
      Object.assign(bankInfo, res.data)
    }
  } catch (error) {
    console.error('获取银行卡信息失败', error)
  }
}

// 获取提款配置
const fetchWithdrawConfig = async () => {
  try {
    const res = await getWithdrawConfig()
    if (res.code === 0 && res.data) {
      Object.assign(withdrawConfig, res.data)
      // 检查提现时间
      checkWithdrawTime()
    }
  } catch (error) {
    console.error('获取提款配置失败', error)
  }
}

const submitWithdraw = async () => {
  // 检查金额
  const amount = parseFloat(form.amount)
  if (!form.amount || isNaN(amount) || amount < withdrawConfig.minMoney) {
    toastStore.show({
      type: 'warning',
      title: '金额过低',
      message: t('bank.amountMinLimit')
    })
    return
  }

  if (amount > withdrawConfig.maxMoney) {
    toastStore.show({
      type: 'warning',
      title: '金额过高',
      message: t('bank.amountMaxLimit')
    })
    return
  }

  // 检查密码
  if (!form.password) {
    toastStore.show({
      type: 'warning',
      title: '需要密码',
      message: t('bank.enterPassword')
    })
    return
  }

  // 检查提现时间
  if (!checkWithdrawTime()) {
    toastStore.show({
      type: 'warning',
      title: '非提现时间',
      message: timeWarning.value
    })
    return
  }

  loading.value = true
  try {
    const requestData = {
      amount: parseFloat(form.amount) || 0,
      coinPwd: form.password
    }
    const res = await withdraw(requestData)

    // 调试日志：查看后端返回的完整数据结构
    console.log('提款响应:', res)

    if (res.code === 0) {
      toastStore.show({
        type: 'success',
        title: '提款成功',
        message: res.data?.message || t('bank.withdrawSuccess'),
        duration: 3000
      })
      form.amount = ''
      form.password = ''
      // 刷新余额
      emit('balance-updated')
    } else {
      // 优先显示后端返回的具体错误信息
      // 可能的字段：res.message, res.data?.message, res.msg, res.error
      const errorMessage = res.message
        || res.data?.message
        || res.msg
        || res.error
        || t('bank.withdrawFailed')

      console.log('错误信息:', errorMessage, '原始响应:', res)

      toastStore.show({
        type: 'error',
        title: '提款失败',
        message: errorMessage
      })
    }
  } catch (error: any) {
    // 网络错误或其他异常
    const errorMsg = error.response?.data?.message
      || error.response?.data?.msg
      || error.message
      || t('bank.withdrawFailed')

    console.log('异常错误:', error, errorMsg)

    toastStore.show({
      type: 'error',
      title: '提款失败',
      message: errorMsg
    })
  } finally {
    loading.value = false
  }
}

const emit = defineEmits(['balance-updated'])

onMounted(() => {
  fetchBankInfo()
  fetchWithdrawConfig()
})
</script>

<style scoped>
/* 移除了 Element Plus 消息提示样式，使用自定义 Toast */

.withdraw-page {
  background: #fff;
  min-height: 300px;
}

/* 步骤提示 */
.withdraw-step {
  padding: 40px 20px;
  text-align: center;
}

.step-icon {
  margin-bottom: 20px;
}

.step-icon img {
  width: 80px;
  height: 80px;
}

.step-text {
  font-size: 16px;
  color: #333;
  margin-bottom: 25px;
}

.step-btn {
  background: linear-gradient(45deg, #fb2351, #ff4b3e);
  color: #fff;
  border: none;
  padding: 12px 40px;
  border-radius: 25px;
  font-size: 15px;
  cursor: pointer;
}

/* 提款表单 */
.withdraw-form {
  padding: 15px;
}

.form-group {
  margin-bottom: 15px;
}

.form-input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  box-sizing: border-box;
}

.form-input:focus {
  border-color: #fb2351;
  outline: none;
}

.form-tip {
  margin: 8px 0 0 0;
  font-size: 12px;
  color: #999;
}

.form-tip .red {
  color: #fb2351;
}

.form-tip.time-warning {
  color: #ff9800;
  font-weight: 500;
}

.bank-info {
  background: #f9f9f9;
  border-radius: 5px;
  padding: 12px 15px;
}

.bank-card-info {
  font-size: 14px;
  color: #333;
  line-height: 34px;
}

.bank-card-info .info-label {
  color: #666;
}

.bank-card-info .info-value {
  font-weight: 500;
}

.submit-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(45deg, #fb2351, #ff4b3e);
  color: #fff;
  border: none;
  border-radius: 25px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 20px;
}

.submit-btn:disabled {
  opacity: 0.6;
}
</style>
