# 个人资料页面重构实施文档

## 1. 任务概述

**目标**：重构个人资料页面，按照红白主题设计，完整实现PHP原版逻辑

**优先级**：High

**预计工作量**：1-2 个会话

---

## 2. PHP 原版逻辑分析

### 2.1 后端 API 接口

根据 PHP 代码分析，个人资料涉及以下后端接口：

| 接口 | 文件 | 功能 | 状态 |
|------|------|------|------|
| `setFullNamedo` | User.class.php | 设置真实姓名（只能设置一次） | 待实现 |
| `bindBankdo` | User.class.php | 绑定银行卡 | 待实现 |
| `setFundPwddo` | User.class.php | 设置/修改提款密码 | 待实现 |
| `setPasswddo` | Safe.class.php | 修改登录密码 | 待实现 |
| `setCoinPwddo` | Safe.class.php | 修改提款密码 | 待实现 |

### 2.2 数据库字段（ssc_members 表）

| 字段 | 说明 | 可修改 | 备注 |
|------|------|--------|------|
| username | 用户名 | ❌ | 不可修改 |
| password | 登录密码 | ✅ | 需要原密码验证 |
| coinPassword | 提款密码 | ✅ | 可单独设置 |
| name | 真实姓名 | ⚠️ | 只能设置一次 |
| nickname | 昵称 | ✅ | 可多次修改 |
| phone | 手机号 | ✅ | 需要验证 |
| email | 邮箱 | ✅ | 需要验证格式 |
| qq | QQ号 | ✅ | 可多次修改 |
| uid | 用户ID | ❌ | 只读 |
| type | 用户类型 | ❌ | 0=会员,1=总代,2=股东,3=管理员 |
| grade | VIP等级 | ❌ | 系统生成 |
| fanDian | 返点 | ❌ | 系统设置 |
| coin | 余额 | ⚠️ | 只能通过充值/提现改变 |
| regTime | 注册时间 | ❌ | 只读 |

### 2.3 PHP 原版业务规则

#### 2.3.1 真实姓名规则
```php
// 只能设置一次，之后不可修改
if (!$this->getValue("select `name` from {$this->prename}members where uid=?", $this->user['uid'])) {
    // 可以设置
} else {
    echo '您已新增真實姓名,如需修改請聯絡客服';
}
```

#### 2.3.2 银行卡绑定规则
```php
// 只能绑定一次，之后不可修改
if ($this->getValue("select uid from {$this->prename}member_bank where uid=?", $this->user['uid'])) {
    echo '您已綁定,如需修改請聯絡客服';
}
```

#### 2.3.3 提款密码规则
```php
// 提款密码不能与登录密码相同
if ($loginpwd == $coinpwd) {
    echo '登陸密碼和提領密碼不能相同';
}
// 提款密码需要登录密码验证
if ($loginpwd != $this->user['password']) {
    echo '登陸密碼輸入錯誤';
}
```

#### 2.3.4 修改密码规则
```php
// 需要原密码验证
if (md5($opwd) != $pwd) {
    echo '原密碼不正確';
}
// 密码长度至少6位
if (strlen($npwd) < 6) {
    echo '密碼至少6位';
}
```

---

## 3. 当前 Vue 实现分析

### 3.1 已存在的功能

| 功能 | 状态 | 说明 |
|------|------|------|
| 用户信息卡片 | ✅ 已实现 | 显示头像、用户名、VIP等级、返点 |
| 账户信息显示 | ✅ 已实现 | 显示用户ID、注册时间、余额 |
| 昵称修改 | ⚠️ UI实现 | 保存功能为TODO |
| 手机号修改 | ⚠️ UI实现 | 保存功能为TODO |
| 邮箱修改 | ⚠️ UI实现 | 保存功能为TODO |
| QQ号修改 | ⚠️ UI实现 | 保存功能为TODO |
| 真实姓名 | ⚠️ UI实现 | 不可修改提示已有，但无API |
| 登录密码修改 | ❌ 未实现 | 页面不存在 |
| 提款密码修改 | ❌ 未实现 | 页面不存在 |
| 银行卡绑定 | ❌ 未实现 | 页面不存在 |

### 3.2 当前代码结构

```
frontend/src/views/user/
├── Profile.vue       # 个人资料页面（当前仅部分功能）
├── FundPwd.vue       # 资金密码页面（存在但功能未知）
├── center.vue        # 个人中心
├── login.vue         # 登录
└── register.vue      # 注册
```

---

## 4. UI 设计（红白主题）

### 4.1 设计规范

**主色调**：
- 主色：#fb2351（玫红）
- 辅色：#ff4b3e（橙红）
- 背景：#f5f5f5（浅灰）
- 卡片背景：#ffffff（白色）
- 文字主色：#333333
- 文字辅色：#666666

**渐变**：
- 头部背景：linear-gradient(45deg, #fb2351, #ff4b3e)
- 按钮背景：linear-gradient(45deg, #fb2351, #ff4b3e)

### 4.2 页面布局设计

```
┌─────────────────────────────────────┐
│ 个人资料                      ←返回 │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │        [头像] VIP1             │ │
│ │         用户名                  │ │
│ │       会员  返点:0%            │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ 账户信息                            │
│ ┌─────────────────────────────────┐ │
│ │ 用户ID          123456789      │ │
│ │ 注册时间        2024-01-01     │ │
│ │ 账户余额        1,000.00       │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ 个人资料                            │
│ ┌─────────────────────────────────┐ │
│ │ 真实姓名    张三 (不可修改)    →│ │
│ ├─────────────────────────────────┤ │
│ │ 昵称        未设置           →│ │
│ ├─────────────────────────────────┤ │
│ │ 手机号      138****8888       →│ │
│ ├─────────────────────────────────┤ │
│ │ 邮箱       未绑定             →│ │
│ ├─────────────────────────────────┤ │
│ │ QQ号       未绑定             →│ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ 账户安全                            │
│ ┌─────────────────────────────────┐ │
│ │ 登录密码      已设置           →│ │
│ ├─────────────────────────────────┤ │
│ │ 提款密码      未设置           →│ │
│ ├─────────────────────────────────┤ │
│ │ 银行卡        未绑定           →│ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### 4.3 修改密码弹窗设计

```
┌─────────────────────────────────────┐
│ ×                                   │
│                                     │
│   修改登录密码                      │
│                                     │
│   ┌─────────────────────────────┐   │
│   │ 请输入原密码                 │   │
│   └─────────────────────────────┘   │
│                                     │
│   ┌─────────────────────────────┐   │
│   │ 请输入新密码                 │   │
│   └─────────────────────────────┘   │
│                                     │
│   ┌─────────────────────────────┐   │
│   │ 请确认新密码                 │   │
│   └─────────────────────────────┘   │
│                                     │
│   ┌───────────┐ ┌───────────┐     │
│   │   取消    │ │   确认    │     │
│   └───────────┘ └───────────┘     │
│                                     │
└─────────────────────────────────────┘
```

### 4.4 银行卡绑定弹窗设计

```
┌─────────────────────────────────────┐
│ ×                                   │
│                                     │
│   绑定银行卡                        │
│                                     │
│   ┌─────────────────────────────┐   │
│   │ 持卡人姓名                   │   │
│   └─────────────────────────────┘   │
│                                     │
│   ┌─────────────────────────────┐   │
│   │ 选择银行                     │   │
│   └─────────────────────────────┘   │
│                                     │
│   ┌─────────────────────────────┐   │
│   │ 银行卡号                     │   │
│   └─────────────────────────────┘   │
│                                     │
│   ┌─────────────────────────────┐   │
│   │ 开户行地址                   │   │
│   └─────────────────────────────┘   │
│                                     │
│   ┌───────────┐ ┌───────────┐     │
│   │   取消    │ │   确认    │     │
│   └───────────┘ └───────────┘     │
│                                     │
└─────────────────────────────────────┘
```

---

## 5. 实施步骤

### 步骤 1：创建/完善 API 接口

**文件**：`frontend/src/api/user.ts`

添加以下接口：

```typescript
/**
 * 获取用户信息
 */
export function getUserInfo() {
  return request.get('/user/info')
}

/**
 * 设置真实姓名（只能设置一次）
 */
export function setFullName(name: string) {
  return request.post('/user/setFullNamedo', { fullName: name })
}

/**
 * 修改登录密码
 */
export function changePassword(oldPwd: string, newPwd: string) {
  return request.post('/safe/setPasswddo', {
    oldPwd: md5(oldPwd),
    newPwd: md5(newPwd)
  })
}

/**
 * 设置/修改提款密码
 */
export function setCoinPwd(oldPwd: string, newPwd: string) {
  return request.post('/safe/setCoinPwddo', {
    oldPwd: oldPwd ? md5(oldPwd) : '',
    newPwd: md5(newPwd)
  })
}

/**
 * 绑定银行卡
 */
export function bindBank(data: {
  username: string
  bankId: number
  cardNo: string
  subAddress: string
}) {
  return request.post('/user/bindBankdo', data)
}

/**
 * 获取用户银行信息
 */
export function getUserBank() {
  return request.get('/user/getBankInfo')
}

/**
 * 更新用户资料
 */
export function updateProfile(data: {
  nickname?: string
  phone?: string
  email?: string
  qq?: string
}) {
  return request.post('/user/updateProfile', data)
}
```

### 步骤 2：重构 Profile.vue

**文件**：`frontend/src/views/user/Profile.vue`

#### 2.1 添加新的页面区块

```vue
<!-- 账户安全区块 -->
<div class="form-section">
  <div class="section-title">{{ t('user.accountSecurity') }}</div>

  <!-- 登录密码 -->
  <div class="form-item" @click="showChangePwdModal = true">
    <div class="form-label">
      <svg class="label-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
        <path d="M7 11V7a5 5 0 0110 0v4"/>
      </svg>
      {{ t('user.loginPassword') }}
    </div>
    <div class="form-value">
      <span>{{ t('user.passwordSet') }}</span>
      <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M9 18l6-6-6-6"/>
      </svg>
    </div>
  </div>

  <!-- 提款密码 -->
  <div class="form-item" @click="showCoinPwdModal = true">
    <div class="form-label">
      <svg class="label-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
        <line x1="1" y1="10" x2="23" y2="10"/>
      </svg>
      {{ t('user.coinPassword') }}
    </div>
    <div class="form-value">
      <span :class="{ placeholder: !hasCoinPwd }">
        {{ hasCoinPwd ? t('user.passwordSet') : t('user.passwordNotSet') }}
      </span>
      <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M9 18l6-6-6-6"/>
      </svg>
    </div>
  </div>

  <!-- 银行卡 -->
  <div class="form-item" @click="handleBankClick">
    <div class="form-label">
      <svg class="label-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
        <line x1="1" y1="10" x2="23" y2="10"/>
      </svg>
      {{ t('user.bankCard') }}
    </div>
    <div class="form-value">
      <span :class="{ placeholder: !bankData.cardNo }">
        {{ bankData.cardNo ? maskCardNo(bankData.cardNo) : t('user.bindBankCard') }}
      </span>
      <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M9 18l6-6-6-6"/>
      </svg>
    </div>
  </div>
</div>
```

#### 2.2 添加修改密码弹窗组件

```vue
<!-- 修改登录密码弹窗 -->
<div class="edit-modal" v-if="showChangePwdModal">
  <div class="modal-mask" @click="showChangePwdModal = false"></div>
  <div class="modal-content">
    <div class="modal-header">
      <h3>{{ t('user.changePassword') }}</h3>
      <span class="modal-close" @click="showChangePwdModal = false">×</span>
    </div>
    <div class="modal-body">
      <input type="password" v-model="pwdForm.oldPwd" :placeholder="t('user.inputOldPwd')" class="modal-input" />
      <input type="password" v-model="pwdForm.newPwd" :placeholder="t('user.inputNewPwd')" class="modal-input" />
      <input type="password" v-model="pwdForm.confirmPwd" :placeholder="t('user.confirmNewPwd')" class="modal-input" />
    </div>
    <div class="modal-footer">
      <button class="btn-cancel" @click="showChangePwdModal = false">{{ t('common.cancel') }}</button>
      <button class="btn-confirm" @click="handleChangePassword">{{ t('common.confirm') }}</button>
    </div>
  </div>
</div>

<!-- 设置提款密码弹窗 -->
<div class="edit-modal" v-if="showCoinPwdModal">
  <div class="modal-mask" @click="showCoinPwdModal = false"></div>
  <div class="modal-content">
    <div class="modal-header">
      <h3>{{ hasCoinPwd ? t('user.changeCoinPwd') : t('user.setCoinPwd') }}</h3>
      <span class="modal-close" @click="showCoinPwdModal = false">×</span>
    </div>
    <div class="modal-body">
      <input v-if="hasCoinPwd" type="password" v-model="coinPwdForm.oldPwd" :placeholder="t('user.inputOldCoinPwd')" class="modal-input" />
      <input type="password" v-model="coinPwdForm.newPwd" :placeholder="t('user.inputNewCoinPwd')" class="modal-input" />
      <input type="password" v-model="coinPwdForm.confirmPwd" :placeholder="t('user.confirmNewCoinPwd')" class="modal-input" />
      <input type="password" v-model="coinPwdForm.loginPwd" :placeholder="t('user.inputLoginPwd')" class="modal-input" />
    </div>
    <div class="modal-footer">
      <button class="btn-cancel" @click="showCoinPwdModal = false">{{ t('common.cancel') }}</button>
      <button class="btn-confirm" @click="handleSetCoinPwd">{{ t('common.confirm') }}</button>
    </div>
  </div>
</div>

<!-- 绑定银行卡弹窗 -->
<div class="edit-modal" v-if="showBankModal">
  <div class="modal-mask" @click="showBankModal = false"></div>
  <div class="modal-content">
    <div class="modal-header">
      <h3>{{ t('user.bindBankCard') }}</h3>
      <span class="modal-close" @click="showBankModal = false">×</span>
    </div>
    <div class="modal-body">
      <input type="text" v-model="bankForm.username" :placeholder="t('user.cardHolderName')" class="modal-input" />
      <select v-model="bankForm.bankId" class="modal-input">
        <option value="">{{ t('user.selectBank') }}</option>
        <option v-for="bank in bankList" :key="bank.id" :value="bank.id">{{ bank.name }}</option>
      </select>
      <input type="text" v-model="bankForm.cardNo" :placeholder="t('user.bankCardNo')" class="modal-input" />
      <input type="text" v-model="bankForm.subAddress" :placeholder="t('user.bankAddress')" class="modal-input" />
    </div>
    <div class="modal-footer">
      <button class="btn-cancel" @click="showBankModal = false">{{ t('common.cancel') }}</button>
      <button class="btn-confirm" @click="handleBindBank">{{ t('common.confirm') }}</button>
    </div>
  </div>
</div>
```

#### 2.3 添加 Script 逻辑

```typescript
// 弹窗显示状态
const showChangePwdModal = ref(false)
const showCoinPwdModal = ref(false)
const showBankModal = ref(false)

// 是否有提款密码
const hasCoinPwd = ref(false)

// 密码表单
const pwdForm = reactive({
  oldPwd: '',
  newPwd: '',
  confirmPwd: ''
})

// 提款密码表单
const coinPwdForm = reactive({
  oldPwd: '',
  newPwd: '',
  confirmPwd: '',
  loginPwd: ''
})

// 银行卡数据
const bankData = reactive({
  username: '',
  bankName: '',
  cardNo: '',
  subAddress: ''
})

// 银行卡表单
const bankForm = reactive({
  username: '',
  bankId: '',
  cardNo: '',
  subAddress: ''
})

// 银行列表
const bankList = ref([
  { id: 1, name: '中国工商银行' },
  { id: 2, name: '中国农业银行' },
  { id: 3, name: '中国建设银行' },
  { id: 4, name: '中国银行' },
  { id: 5, name: '交通银行' },
  { id: 6, name: '招商银行' },
  { id: 7, name: '中国民生银行' },
  { id: 8, name: '中国光大银行' },
  { id: 9, name: '中国浦发银行' },
  { id: 10, name: '北京银行' },
  { id: 11, name: '上海银行' },
  { id: 12, name: '平安银行' },
  { id: 13, name: '华夏银行' },
  { id: 14, name: '农村信用合作社' },
  { id: 15, name: '其他银行' }
])

// 修改登录密码
const handleChangePassword = async () => {
  if (!pwdForm.oldPwd || !pwdForm.newPwd || !pwdForm.confirmPwd) {
    ElMessage.warning(t('user.fillAllFields'))
    return
  }
  if (pwdForm.newPwd.length < 6) {
    ElMessage.warning(t('user.pwdMinLength'))
    return
  }
  if (pwdForm.newPwd !== pwdForm.confirmPwd) {
    ElMessage.warning(t('user.pwdNotMatch'))
    return
  }

  try {
    await changePassword(pwdForm.oldPwd, pwdForm.newPwd)
    ElMessage.success(t('user.changePwdSuccess'))
    showChangePwdModal.value = false
    pwdForm.oldPwd = ''
    pwdForm.newPwd = ''
    pwdForm.confirmPwd = ''
  } catch (error: any) {
    ElMessage.error(error.message || t('user.changePwdFailed'))
  }
}

// 设置/修改提款密码
const handleSetCoinPwd = async () => {
  if (hasCoinPwd.value && !coinPwdForm.oldPwd) {
    ElMessage.warning(t('user.inputOldCoinPwd'))
    return
  }
  if (!coinPwdForm.newPwd || !coinPwdForm.confirmPwd || !coinPwdForm.loginPwd) {
    ElMessage.warning(t('user.fillAllFields'))
    return
  }
  if (coinPwdForm.newPwd.length < 6) {
    ElMessage.warning(t('user.pwdMinLength'))
    return
  }
  if (coinPwdForm.newPwd !== coinPwdForm.confirmPwd) {
    ElMessage.warning(t('user.pwdNotMatch'))
    return
  }
  if (coinPwdForm.newPwd === coinPwdForm.loginPwd) {
    ElMessage.warning(t('user.pwdCannotSame'))
    return
  }

  try {
    await setCoinPwd(coinPwdForm.oldPwd, coinPwdForm.newPwd)
    ElMessage.success(t('user.setCoinPwdSuccess'))
    showCoinPwdModal.value = false
    hasCoinPwd.value = true
    coinPwdForm.oldPwd = ''
    coinPwdForm.newPwd = ''
    coinPwdForm.confirmPwd = ''
    coinPwdForm.loginPwd = ''
  } catch (error: any) {
    ElMessage.error(error.message || t('user.setCoinPwdFailed'))
  }
}

// 银行卡点击处理
const handleBankClick = () => {
  if (bankData.cardNo) {
    ElMessage.info(t('user.bankAlreadyBound'))
    return
  }
  showBankModal.value = true
}

// 绑定银行卡
const handleBindBank = async () => {
  if (!bankForm.username || !bankForm.bankId || !bankForm.cardNo || !bankForm.subAddress) {
    ElMessage.warning(t('user.fillAllFields'))
    return
  }

  try {
    await bindBank(bankForm)
    ElMessage.success(t('user.bindBankSuccess'))
    showBankModal.value = false
    bankData.username = bankForm.username
    bankData.cardNo = bankForm.cardNo
    // 刷新银行信息
    loadBankInfo()
  } catch (error: any) {
    ElMessage.error(error.message || t('user.bindBankFailed'))
  }
}

// 银行卡号脱敏
const maskCardNo = (cardNo: string) => {
  if (!cardNo) return ''
  return cardNo.substring(0, 4) + '****' + cardNo.substring(cardNo.length - 4)
}

// 加载银行卡信息
const loadBankInfo = async () => {
  try {
    const res = await getUserBank()
    if (res.data) {
      bankData.username = res.data.username || ''
      bankData.bankName = res.data.bankName || ''
      bankData.cardNo = res.data.account || ''
      bankData.subAddress = res.data.countname || ''
    }
  } catch (error) {
    console.error('加载银行卡信息失败', error)
  }
}

// 加载用户信息
const loadUserInfo = async () => {
  const info = userStore.userInfo
  if (info) {
    // ... 现有逻辑
    hasCoinPwd.value = !!info.coinPassword
  }
  loadBankInfo()
}
```

### 步骤 3：添加多语言翻译

**文件**：`frontend/src/locales/index.ts`

```typescript
export const translations = {
  'zh-TW': {
    'user': {
      // ... 现有翻译
      'accountSecurity': '賬戶安全',
      'loginPassword': '登錄密碼',
      'passwordSet': '已設置',
      'passwordNotSet': '未設置',
      'coinPassword': '提款密碼',
      'bankCard': '銀行卡',
      'changePassword': '修改登錄密碼',
      'inputOldPwd': '請輸入原密碼',
      'inputNewPwd': '請輸入新密碼',
      'confirmNewPwd': '請確認新密碼',
      'changeCoinPwd': '修改提款密碼',
      'setCoinPwd': '設置提款密碼',
      'inputOldCoinPwd': '請輸入原提款密碼',
      'inputNewCoinPwd': '請輸入新提款密碼',
      'confirmNewCoinPwd': '請確認新提款密碼',
      'inputLoginPwd': '請輸入登錄密碼',
      'bindBankCard': '綁定銀行卡',
      'cardHolderName': '持卡人姓名',
      'selectBank': '選擇銀行',
      'bankCardNo': '銀行卡號',
      'bankAddress': '開戶行地址',
      'fillAllFields': '請填寫完整',
      'pwdMinLength': '密碼至少6位',
      'pwdNotMatch': '兩次密碼不一致',
      'pwdCannotSame': '登錄密碼和提款密碼不能相同',
      'changePwdSuccess': '密碼修改成功',
      'changePwdFailed': '密碼修改失敗',
      'setCoinPwdSuccess': '提款密碼設置成功',
      'setCoinPwdFailed': '提款密碼設置失敗',
      'bindBankSuccess': '銀行卡綁定成功',
      'bindBankFailed': '銀行卡綁定失敗',
      'bankAlreadyBound': '您已綁定銀行卡，如需修改請聯繫客服'
    }
  },
  'zh-CN': {
    'user': {
      // ... 现有翻译
      'accountSecurity': '账户安全',
      'loginPassword': '登录密码',
      'passwordSet': '已设置',
      'passwordNotSet': '未设置',
      'coinPassword': '提款密码',
      'bankCard': '银行卡',
      'changePassword': '修改登录密码',
      'inputOldPwd': '请输入原密码',
      'inputNewPwd': '请输入新密码',
      'confirmNewPwd': '请确认新密码',
      'changeCoinPwd': '修改提款密码',
      'setCoinPwd': '设置提款密码',
      'inputOldCoinPwd': '请输入原提款密码',
      'inputNewCoinPwd': '请输入新提款密码',
      'confirmNewCoinPwd': '请确认新提款密码',
      'inputLoginPwd': '请输入登录密码',
      'bindBankCard': '绑定银行卡',
      'cardHolderName': '持卡人姓名',
      'selectBank': '选择银行',
      'bankCardNo': '银行卡号',
      'bankAddress': '开户行地址',
      'fillAllFields': '请填写完整',
      'pwdMinLength': '密码至少6位',
      'pwdNotMatch': '两次密码不一致',
      'pwdCannotSame': '登录密码和提款密码不能相同',
      'changePwdSuccess': '密码修改成功',
      'changePwdFailed': '密码修改失败',
      'setCoinPwdSuccess': '提款密码设置成功',
      'setCoinPwdFailed': '提款密码设置失败',
      'bindBankSuccess': '银行卡绑定成功',
      'bindBankFailed': '银行卡绑定失败',
      'bankAlreadyBound': '您已绑定银行卡，如需修改请联系客服'
    }
  },
  'en': {
    'user': {
      // ... 现有翻译
      'accountSecurity': 'Account Security',
      'loginPassword': 'Login Password',
      'passwordSet': 'Set',
      'passwordNotSet': 'Not Set',
      'coinPassword': 'Withdrawal Password',
      'bankCard': 'Bank Card',
      'changePassword': 'Change Password',
      'inputOldPwd': 'Enter old password',
      'inputNewPwd': 'Enter new password',
      'confirmNewPwd': 'Confirm new password',
      'changeCoinPwd': 'Change Withdrawal Password',
      'setCoinPwd': 'Set Withdrawal Password',
      'inputOldCoinPwd': 'Enter old withdrawal password',
      'inputNewCoinPwd': 'Enter new withdrawal password',
      'confirmNewCoinPwd': 'Confirm new withdrawal password',
      'inputLoginPwd': 'Enter login password',
      'bindBankCard': 'Bind Bank Card',
      'cardHolderName': 'Card Holder Name',
      'selectBank': 'Select Bank',
      'bankCardNo': 'Bank Card Number',
      'bankAddress': 'Bank Address',
      'fillAllFields': 'Please fill all fields',
      'pwdMinLength': 'Password must be at least 6 characters',
      'pwdNotMatch': 'Passwords do not match',
      'pwdCannotSame': 'Login password and withdrawal password cannot be the same',
      'changePwdSuccess': 'Password changed successfully',
      'changePwdFailed': 'Password change failed',
      'setCoinPwdSuccess': 'Withdrawal password set successfully',
      'setCoinPwdFailed': 'Withdrawal password set failed',
      'bindBankSuccess': 'Bank card bound successfully',
      'bindBankFailed': 'Bank card bind failed',
      'bankAlreadyBound': 'Bank card already bound, please contact customer service to modify'
    }
  }
}
```

---

## 6. 后端 API 需求

需要后端提供以下接口（如果尚未实现）：

### 6.1 获取用户信息
```
GET /user/info
Response: { uid, username, nickname, name, phone, email, qq, type, grade, fanDian, coin, regTime, coinPassword }
```

### 6.2 更新用户资料
```
POST /user/updateProfile
Params: { nickname?, phone?, email?, qq? }
Response: { success: true }
```

### 6.3 获取用户银行卡信息
```
GET /user/getBankInfo
Response: { username, bankName, account, countname }
```

### 6.4 设置真实姓名
```
POST /user/setFullNamedo
Params: { fullName }
Response: { success: true } or { error: '您已新增真實姓名,如需修改請聯絡客服' }
```

---

## 7. 测试验证

### 7.1 功能测试清单

| 测试项 | 预期结果 | 状态 |
|-------|---------|------|
| 页面显示用户信息 | 正确显示用户名、VIP等级、返点 | ☐ |
| 显示账户信息 | 正确显示用户ID、注册时间、余额 | ☐ |
| 修改昵称 | 能成功保存并更新显示 | ☐ |
| 修改手机号 | 能成功保存并更新显示 | ☐ |
| 修改邮箱 | 能成功保存并更新显示 | ☐ |
| 修改QQ号 | 能成功保存并更新显示 | ☐ |
| 真实姓名提示 | 已设置显示"不可修改" | ☐ |
| 修改登录密码 | 验证原密码后成功修改 | ☐ |
| 设置提款密码 | 验证登录密码后成功设置 | ☐ |
| 修改提款密码 | 验证原提款密码后成功修改 | ☐ |
| 绑定银行卡 | 成功绑定并显示脱敏卡号 | ☐ |
| 已绑定银行卡提示 | 提示联系客服 | ☐ |
| 表单验证 | 密码长度、确认密码等验证 | ☐ |
| 错误提示 | 后端返回的错误信息正确显示 | ☐ |

---

## 8. 交付要求

1. **代码要求**：
   - 所有新增代码必须使用 TypeScript
   - CSS 必须使用 scoped
   - 遵循现有代码规范

2. **Git 提交规范**：
   ```
   feat: 完成个人资料页面重构

   - 添加账户安全区块（登录密码、提款密码、银行卡）
   - 实现密码修改功能
   - 实现提款密码设置/修改功能
   - 实现银行卡绑定功能
   - 添加完整的多语言支持
   - 完善后端API对接

   Co-Authored-By: Claude <noreply@anthropic.com>
   ```

---

**文档创建日期**：2026-02-26
