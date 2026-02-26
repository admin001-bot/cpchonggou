<template>
  <div class="bind-address">
    <!-- 已绑定地址卡片 -->
    <div v-if="boundAddress" class="bound-card">
      <div class="card-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
      </div>
      <h3 class="card-title">{{ t('bank.alreadyBound') }}</h3>
      <div class="card-info">
        <div class="info-row">
          <span class="label">{{ t('bank.protocol') }}</span>
          <span class="value">{{ boundAddress.bankName }}</span>
        </div>
        <div class="info-row">
          <span class="label">{{ t('bank.walletName') }}</span>
          <span class="value">{{ boundAddress.countName }}</span>
        </div>
        <div class="info-row">
          <span class="label">{{ t('bank.withdrawAddress') }}</span>
          <span class="value address">{{ formatAddress(boundAddress.account) }}</span>
        </div>
      </div>
      <p class="card-tip">{{ t('bank.bindTip') }}</p>
    </div>

    <!-- 绑定表单 -->
    <div v-else class="form-card">
      <h3 class="form-title">{{ t('bank.addAddress') }}</h3>

      <!-- 选择协议 -->
      <div class="form-item" @click="showProtocolPicker = true">
        <div class="item-label">{{ t('bank.protocol') }}</div>
        <div class="item-value">
          <span :class="{ placeholder: !selectedProtocol }">
            {{ selectedProtocol?.name || t('bank.pleaseSelect') }}
          </span>
          <svg class="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>
      </div>

      <!-- 钱包名称 -->
      <div class="form-item">
        <div class="item-label">{{ t('bank.walletName') }}</div>
        <div class="item-input">
          <input
            type="text"
            v-model="formData.walletName"
            :placeholder="t('bank.enterWalletName')"
          />
        </div>
      </div>

      <!-- 提款地址 -->
      <div class="form-item">
        <div class="item-label">{{ t('bank.withdrawAddress') }}</div>
        <div class="item-input">
          <textarea
            v-model="formData.address"
            :placeholder="t('bank.enterAddress')"
            rows="3"
          ></textarea>
        </div>
      </div>

      <!-- 提交按钮 -->
      <button
        class="submit-btn"
        :class="{ loading: submitting }"
        :disabled="submitting || !canSubmit"
        @click="handleSubmit"
      >
        {{ submitting ? t('bank.binding') : t('bank.confirmBind') }}
      </button>
    </div>

    <!-- 协议选择弹窗 -->
    <div v-if="showProtocolPicker" class="picker-mask" @click="showProtocolPicker = false">
      <div class="picker-box" @click.stop>
        <div class="picker-title">
          <span>{{ t('bank.selectProtocol') }}</span>
          <svg class="close-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" @click="showProtocolPicker = false">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </div>
        <div class="picker-list">
          <div
            v-for="protocol in protocols"
            :key="protocol.id"
            class="picker-option"
            :class="{ active: selectedProtocol?.id === protocol.id }"
            @click="selectProtocol(protocol)"
          >
            <span>{{ protocol.name }}</span>
            <svg v-if="selectedProtocol?.id === protocol.id" class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- 提示消息 -->
    <div v-if="message" class="toast" :class="messageType">
      {{ message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { t } from '@/locales'
import { bankApi, type BankInfo } from '@/api/bank'
import { useToastStore } from '@/stores/toast'
import { useToastStore } from '@/stores/toast'

// 协议列表
const protocols = ref([
  { id: 1, name: 'USDT - TRC20' },
  { id: 2, name: 'USDT - ERC20' },
  { id: 3, name: 'BTC' },
  { id: 4, name: 'ETH' }
])

const selectedProtocol = ref<{ id: number; name: string } | null>(null)
const showProtocolPicker = ref(false)
const submitting = ref(false)
const message = ref('')
const messageType = ref<'success' | 'error'>('success')

const formData = ref({
  walletName: '',
  address: ''
})

const boundAddress = ref<BankInfo | null>(null)
const toastStore = useToastStore()

const canSubmit = computed(() => {
  return selectedProtocol.value && formData.value.walletName && formData.value.address
})

const selectProtocol = (protocol: { id: number; name: string }) => {
  selectedProtocol.value = protocol
  showProtocolPicker.value = false
}

const formatAddress = (address: string) => {
  if (!address) return ''
  if (address.length <= 12) return address
  return address.slice(0, 8) + '...' + address.slice(-8)
}

const showMessage = (msg: string, type: 'success' | 'error' = 'success') => {
  toastStore.show({
    type,
    title: type === 'success' ? '成功' : '错误',
    message: msg
  })
}

const fetchBankInfo = async () => {
  try {
    const res = await bankApi.getBankInfo()
    if (res.code === 0 && res.data && res.data.account) {
      boundAddress.value = res.data
    }
  } catch (error) {
    console.error('获取地址信息失败', error)
  }
}

const handleSubmit = async () => {
  if (!canSubmit.value || submitting.value) return

  submitting.value = true
  try {
    await bankApi.bindAddress({
      bankId: selectedProtocol.value?.id!,
      cardNo: formData.value.walletName,
      subAddress: formData.value.address
    })

    showMessage(t('bank.bindSuccess'), 'success')

    // 刷新显示已绑定
    await fetchBankInfo()
  } catch (error: any) {
    showMessage(error.message || t('bank.bindFailed'), 'error')
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  fetchBankInfo()
})
</script>

<style scoped>
.bind-address {
  padding: 0;
}

/* 已绑定卡片 */
.bound-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 15px;
  text-align: center;
}

.card-icon {
  width: 56px;
  height: 56px;
  margin: 0 auto 12px;
  background: linear-gradient(45deg, #fb2351, #ff4b3e);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-icon svg {
  width: 28px;
  height: 28px;
  color: #fff;
}

.card-title {
  margin: 0 0 16px;
  font-size: 16px;
  color: #333;
  font-weight: 600;
}

.card-info {
  text-align: left;
  margin-bottom: 12px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}

.info-row:last-child {
  border-bottom: none;
}

.info-row .label {
  color: #666;
  font-size: 13px;
}

.info-row .value {
  color: #333;
  font-size: 13px;
  font-weight: 500;
}

.info-row .value.address {
  color: #fb2351;
  font-family: monospace;
  font-size: 12px;
}

.card-tip {
  margin: 0;
  color: #999;
  font-size: 12px;
}

/* 绑定表单卡片 */
.form-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
}

.form-title {
  margin: 0 0 16px;
  font-size: 16px;
  color: #333;
  font-weight: 600;
  text-align: center;
}

.form-item {
  margin-bottom: 16px;
}

.item-label {
  font-size: 13px;
  color: #666;
  margin-bottom: 8px;
}

.item-value {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 14px;
  background: #f8f8f8;
  border-radius: 8px;
}

.item-value .placeholder {
  color: #999;
}

.item-value .arrow {
  width: 16px;
  height: 16px;
  color: #999;
}

.item-input input,
.item-input textarea {
  width: 100%;
  padding: 12px 14px;
  background: #f8f8f8;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  color: #333;
  outline: none;
  box-sizing: border-box;
}

.item-input input::placeholder,
.item-input textarea::placeholder {
  color: #999;
}

.item-input textarea {
  resize: none;
  font-family: monospace;
}

/* 提交按钮 */
.submit-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(45deg, #fb2351, #ff4b3e);
  border: none;
  border-radius: 25px;
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 8px;
}

.submit-btn:active:not(:disabled) {
  transform: scale(0.98);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.submit-btn.loading {
  background: #ccc;
}

/* 协议选择弹窗 */
.picker-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 1000;
}

.picker-box {
  width: 100%;
  max-width: 640px;
  background: #fff;
  border-radius: 16px 16px 0 0;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

.picker-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #eee;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.close-icon {
  width: 20px;
  height: 20px;
  color: #999;
  cursor: pointer;
}

.picker-list {
  max-height: 300px;
  overflow-y: auto;
  padding: 8px 0;
}

.picker-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 20px;
  font-size: 15px;
  color: #333;
}

.picker-option:active {
  background: #f9f9f9;
}

.picker-option.active {
  background: #fff5f5;
}

.check-icon {
  width: 20px;
  height: 20px;
  color: #fb2351;
}

/* 提示消息 */
.toast {
  position: fixed;
  top: 60px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 14px;
  z-index: 2000;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateX(-50%) translateY(-10px); }
  to { opacity: 1; transform: translateX(-50%) translateY(0); }
}

.toast.success {
  background: #4caf50;
  color: #fff;
}

.toast.error {
  background: #f44336;
  color: #fff;
}
</style>
