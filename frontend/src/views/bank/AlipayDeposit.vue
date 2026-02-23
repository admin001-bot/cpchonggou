<template>
  <div class="alipay-deposit">
    <!-- 第一步：选择支付账号 -->
    <div v-if="step === 1" class="step-content">
      <div class="tip-box">
        <span class="tip-icon">!</span>
        {{ t('bank.transferFirst') }}
      </div>

      <div class="form-group">
        <select v-model="form.selectedAccount" class="form-select">
          <option value="">{{ t('bank.selectAccount') }}</option>
          <option v-for="account in accounts" :key="account.id" :value="account.id">
            {{ account.name }}
          </option>
        </select>
      </div>

      <div v-if="selectedAccount" class="account-info">
        <p><span class="label">{{ t('bank.name') }}：</span>{{ selectedAccount.payeeName }}</p>
        <p>
          <span class="label">{{ t('bank.account') }}：</span>
          <span class="account-no">{{ selectedAccount.payee }}</span>
        </p>
        <p>
          <span class="label">{{ t('bank.qrcode') }}：</span>
        </p>
        <img v-if="selectedAccount.qrCode" :src="selectedAccount.qrCode" class="qr-img" />
      </div>

      <button class="next-btn" @click="goStep2" :disabled="!form.selectedAccount">
        {{ t('bank.nextStep') }}
      </button>
    </div>

    <!-- 第二步：填写存款信息 -->
    <div v-else-if="step === 2" class="step-content">
      <div class="form-group">
        <input
          type="number"
          v-model="form.amount"
          class="form-input"
          :placeholder="t('bank.enterDepositAmount')"
        />
        <p class="form-tip">
          {{ t('bank.minLimit') }}<span class="red">10</span>，
          {{ t('bank.maxLimit') }}<span class="red">9,999,999</span>
        </p>
      </div>

      <div class="form-group">
        <input
          type="text"
          v-model="form.nickname"
          class="form-input"
          :placeholder="t('bank.enterAlipayNickname')"
        />
      </div>

      <div class="form-group">
        <input
          type="datetime-local"
          v-model="form.depositTime"
          class="form-input"
        />
      </div>

      <button class="next-btn" @click="goStep3" :disabled="!canGoStep3">
        {{ t('bank.nextStep') }}
      </button>
    </div>

    <!-- 第三步：确认提交 -->
    <div v-else-if="step === 3" class="step-content">
      <div class="confirm-box">
        <div class="confirm-title">
          <span class="tip-icon">!</span>
          {{ t('bank.transferBeforeSubmit') }}
        </div>

        <div class="confirm-section">
          <div class="section-title">{{ t('bank.depositInfo') }}</div>
          <div class="section-content">
            <p>{{ t('bank.depositAmount') }}：{{ form.amount }}</p>
            <p>{{ t('bank.userNickname') }}：{{ form.nickname }}</p>
            <p>{{ t('bank.depositTime') }}：{{ formatDateTime(form.depositTime) }}</p>
            <p>{{ t('bank.depositMethod') }}：{{ t('bank.alipayTransfer') }}</p>
          </div>
        </div>

        <div class="confirm-section">
          <div class="section-title">{{ t('bank.alipayAccount') }}</div>
          <div class="section-content">
            <p>{{ t('bank.name') }}：{{ selectedAccount?.payeeName }}</p>
            <p>{{ t('bank.account') }}：{{ selectedAccount?.payee }}</p>
          </div>
        </div>
      </div>

      <button class="submit-btn" @click="submitDeposit" :disabled="loading">
        {{ loading ? t('common.loading') : t('bank.submitApply') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { t } from '@/locales'

interface Account {
  id: string
  name: string
  payeeName: string
  payee: string
  qrCode: string
}

const step = ref(1)
const loading = ref(false)

const form = ref({
  selectedAccount: '',
  amount: '',
  nickname: '',
  depositTime: '',
})

const accounts = ref<Account[]>([
  {
    id: '1',
    name: '支付宝账户1',
    payeeName: '**明',
    payee: '138****8888',
    qrCode: '/images/qrcode-demo.png',
  },
])

const selectedAccount = computed(() => {
  return accounts.value.find((a) => a.id === form.value.selectedAccount)
})

const canGoStep3 = computed(() => {
  return form.value.amount && form.value.nickname && form.value.depositTime
})

const formatDateTime = (dateStr: string) => {
  if (!dateStr) return ''
  return dateStr.replace('T', ' ')
}

const goStep2 = () => {
  step.value = 2
}

const goStep3 = () => {
  step.value = 3
}

const submitDeposit = async () => {
  loading.value = true
  try {
    // TODO: 调用API
    await new Promise((resolve) => setTimeout(resolve, 1000))
    alert(t('bank.submitSuccess'))
    // 返回存款页
    step.value = 1
    form.value = {
      selectedAccount: '',
      amount: '',
      nickname: '',
      depositTime: '',
    }
  } catch (error) {
    alert(t('bank.submitFailed'))
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  // 设置默认时间
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  form.value.depositTime = `${year}-${month}-${day}T${hours}:${minutes}`
})
</script>

<style scoped>
.alipay-deposit {
  background: #fff;
  min-height: 300px;
}

.step-content {
  padding: 15px;
}

.tip-box {
  background: #fffbe6;
  border: 1px solid #ffe58f;
  border-radius: 5px;
  padding: 10px 15px;
  margin-bottom: 15px;
  font-size: 13px;
  color: #d48806;
  display: flex;
  align-items: center;
}

.tip-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  background: #faad14;
  color: #fff;
  border-radius: 50%;
  font-size: 12px;
  font-weight: bold;
  margin-right: 8px;
}

.form-group {
  margin-bottom: 15px;
}

.form-input,
.form-select {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  box-sizing: border-box;
  background: #fff;
}

.form-tip {
  margin: 8px 0 0 0;
  font-size: 12px;
  color: #999;
}

.form-tip .red {
  color: #fb2351;
}

.account-info {
  background: #f9f9f9;
  border-radius: 5px;
  padding: 15px;
  margin-bottom: 15px;
}

.account-info p {
  margin: 0 0 10px 0;
  font-size: 14px;
  color: #333;
}

.account-info .label {
  color: #666;
}

.account-info .account-no {
  color: #333;
}

.qr-img {
  width: 150px;
  height: 150px;
  margin-top: 10px;
}

.next-btn,
.submit-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(45deg, #fb2351, #ff4b3e);
  color: #fff;
  border: none;
  border-radius: 25px;
  font-size: 16px;
  cursor: pointer;
}

.next-btn:disabled,
.submit-btn:disabled {
  opacity: 0.6;
}

.confirm-box {
  background: #f9f9f9;
  border-radius: 10px;
  margin-bottom: 20px;
  overflow: hidden;
}

.confirm-title {
  background: #fffbe6;
  padding: 12px 15px;
  font-size: 13px;
  color: #d48806;
  display: flex;
  align-items: center;
}

.confirm-section {
  padding: 15px;
  border-bottom: 1px solid #eee;
}

.confirm-section:last-child {
  border-bottom: none;
}

.section-title {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 10px;
}

.section-content p {
  margin: 0 0 8px 0;
  font-size: 13px;
  color: #666;
}
</style>
