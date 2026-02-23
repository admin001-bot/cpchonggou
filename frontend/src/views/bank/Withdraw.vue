<template>
  <div class="withdraw-page">
    <!-- Step 1: 未完善个人信息 -->
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
        />
        <p class="form-tip">
          {{ t('bank.minLimit') }}<span class="red">10</span>，
          {{ t('bank.maxLimit') }}<span class="red">2,000,000</span>
        </p>
      </div>

      <div class="form-group bank-info">
        <div class="bank-card-info">
          {{ bankInfo.bankName }} {{ bankInfo.cardNo }} {{ bankInfo.realName }}
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
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { t } from '@/locales'

const router = useRouter()
const userStore = useUserStore()

// 步骤：1=未完善信息，2=未绑定银行卡，3=可以提款
const step = ref(3)
const loading = ref(false)

const form = reactive({
  amount: '',
  password: '',
})

const bankInfo = reactive({
  bankName: '中国银行',
  cardNo: '**** **** **** 1234',
  realName: '**',
})

const goCompleteProfile = () => {
  // TODO: 跳转到完善信息页面
  alert('完善個人資訊功能開發中')
}

const goBindBank = () => {
  // TODO: 跳转到绑定银行卡页面
  alert('綁定銀行卡功能開發中')
}

const submitWithdraw = async () => {
  if (!form.amount || parseFloat(form.amount) < 10) {
    alert(t('bank.amountMinLimit'))
    return
  }
  if (!form.password) {
    alert(t('bank.enterPassword'))
    return
  }

  loading.value = true
  try {
    // TODO: 调用提款API
    await new Promise((resolve) => setTimeout(resolve, 1000))
    alert(t('bank.withdrawSuccess'))
    form.amount = ''
    form.password = ''
  } catch (error) {
    alert(t('bank.withdrawFailed'))
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  // TODO: 检查用户状态，设置step
  // 1. 检查是否完善个人信息
  // 2. 检查是否绑定银行卡
})
</script>

<style scoped>
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
