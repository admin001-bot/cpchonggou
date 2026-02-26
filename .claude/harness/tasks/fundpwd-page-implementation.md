# 资金密码页面重构实施文档

## 1. 任务概述

**目标**：完善资金密码（提款密码）页面，修复现有问题，对接真实后端API

**当前状态**：
- 页面已创建，但存在多处问题
- UI 已使用红白主题
- 功能未完全实现

**预计工作量**：0.5-1 个会话

---

## 2. 当前问题分析

### 2.1 已识别的问题

| 问题 | 位置 | 严重程度 | 说明 |
|------|------|----------|------|
| MD5 加密是模拟的 | FundPwd.vue:144-165, 219-240 | 高 | 使用随机数模拟，非真实 MD5 |
| API 未定义 | user.ts | 高 | 引用了 `userApi.setFundPwd` 但未定义 |
| 已设置时无法修改 | FundPwd.vue:15-25 | 中 | 已设置时只显示联系客服，应可修改 |
| 验证逻辑不完整 | FundPwd.vue | 中 | 缺少对后端返回错误的处理 |

### 2.2 PHP 原版逻辑（来自 Safe.class.php）

```php
public final function setCoinPwddo(){
    $opwd=$_POST['oldPwd'];        // 原提款密码（修改时需要）
    if(!$opwd) {
        echo '原提款密碼不能為空';
        exit;
    }
    if(strlen($opwd)<6) {
        echo '原提款密碼至少6位';
        exit;
    }
    if(!$npwd=$_POST['newPwd']) {
        echo '提款密碼不能為空';
        exit;
    }
    if(strlen($npwd)<6) {
        echo '提款密碼至少6位';
        exit;
    }

    $sql="select password, coinPassword from {$this->prename}members where uid=?";
    $pwd=$this->getRow($sql, $this->user['uid']);

    if(!$pwd['coinPassword']){
        // 首次设置：需要登录密码验证
        $npwd=md5($npwd);
        if($npwd==$pwd['password']) {
            echo '提款密碼與登入密碼不能一樣';
            exit;
        }
        $tishi='提款密碼設定成功';
    }else{
        // 修改：需要原提款密码验证
        if($opwd && md5($opwd)!=$pwd['coinPassword']) {
            echo '原提款密碼不正確';
            exit;
        }
        $npwd=md5($npwd);
        if($npwd==$pwd['password']) {
            echo '提款密碼與登入密碼不能一樣';
            exit;
        }
    }
    // 更新数据库
    $sql="update {$this->prename}members set coinPassword=? where uid={$this->user['uid']}";
    if($this->update($sql, $npwd)) {echo 'ok';exit;}
    echo '修改提款密碼失敗';
}
```

### 2.3 业务规则总结

| 场景 | 是否需要原密码 | 是否需要登录密码 | 密码不能与登录密码相同 |
|------|---------------|-----------------|---------------------|
| 首次设置 | ❌ | ✅ | ✅ |
| 修改密码 | ✅ | ❌ | ✅ |

---

## 3. 实施步骤

### 步骤 1：添加 API 定义

**文件**：`frontend/src/api/user.ts`

```typescript
// 在 userApi 对象中添加

/**
 * 设置/修改提款密码
 * @param oldPwd 原提款密码（修改时必填，首次设置时空字符串）
 * @param newPwd 新提款密码（6位数字）
 * @param loginPwd 登录密码（首次设置时必填）
 */
setCoinPwd(params: {
  oldPwd: string
  newPwd: string
  loginPwd?: string
}): Promise<{ code: number; message: string }> {
  return request.post('/safe/setCoinPwddo', params)
}
```

### 步骤 2：安装 crypto-js 库

```bash
cd frontend
npm install crypto-js
npm install -D @types/crypto-js
```

### 步骤 3：修改 FundPwd.vue

#### 3.1 添加 MD5 加密导入

```typescript
import MD5 from 'crypto-js/md5'
```

#### 3.2 添加修改密码状态

```vue
<!-- 修改密码模式 -->
<div class="form-card" v-else-if="isEditMode">
  <div class="form-icon">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0110 0v4"/>
    </svg>
  </div>
  <div class="form-title">{{ t('user.changeCoinPwd') }}</div>

  <div class="form-group">
    <!-- 原提款密码 -->
    <div class="input-item">
      <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
        <path d="M7 11V7a5 5 0 0110 0v4"/>
      </svg>
      <input
        type="password"
        v-model="form.oldPwd"
        :placeholder="t('user.enterOldCoinPwd')"
        class="form-input"
        maxlength="6"
        @input="onOldPwdInput"
      />
    </div>

    <!-- 新提款密码 -->
    <div class="input-item">
      <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
      </svg>
      <input
        type="password"
        v-model="form.coinPwd"
        :placeholder="t('user.enterNewCoinPwd')"
        class="form-input"
        maxlength="6"
        @input="onCoinPwdInput"
      />
    </div>

    <!-- 确认新密码 -->
    <div class="input-item">
      <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
      </svg>
      <input
        type="password"
        v-model="form.confirmPwd"
        :placeholder="t('user.confirmNewCoinPwd')"
        class="form-input"
        maxlength="6"
        @input="onConfirmPwdInput"
      />
    </div>
  </div>

  <button class="submit-btn" @click="submitEditForm" :disabled="loading">
    {{ loading ? t('common.loading') : t('common.confirm') }}
  </button>

  <button class="back-btn-text" @click="isEditMode = false">
    {{ t('user.backToSet') }}
  </button>
</div>
```

#### 3.3 修改 Script 逻辑

```typescript
// 响应式数据修改
const isEditMode = ref(false)  // 是否为修改模式
const hasFundPwd = ref(false)  // 是否已设置提款密码

// 表单数据修改
const form = reactive({
  loginPwd: '',      // 登录密码（首次设置时使用）
  oldPwd: '',       // 原提款密码（修改时使用）
  coinPwd: '',      // 新提款密码
  confirmPwd: '',   // 确认新密码
})

// 输入限制
const onOldPwdInput = () => {
  form.oldPwd = form.oldPwd.replace(/\D/g, '').slice(0, 6)
}

// 首次设置提交
const submitForm = async () => {
  // 验证
  if (!form.loginPwd) {
    ElMessage.warning(t('user.enterLoginPwd'))
    return
  }

  if (!form.coinPwd || form.coinPwd.length < 6) {
    ElMessage.warning(t('user.coinPwdLength'))
    return
  }

  if (form.coinPwd !== form.confirmPwd) {
    ElMessage.warning(t('user.pwdNotMatch'))
    return
  }

  // 验证密码不能与登录密码相同
  if (form.loginPwd === form.coinPwd) {
    ElMessage.warning(t('user.pwdSame'))
    return
  }

  loading.value = true
  try {
    const res = await userApi.setCoinPwd({
      oldPwd: '',  // 首次设置为空
      newPwd: MD5(form.coinPwd).toString(),
      loginPwd: MD5(form.loginPwd).toString(),
    })

    if (res.code === 0) {
      ElMessage.success(t('user.setSuccess'))
      await userStore.getUserInfo()
      setTimeout(() => {
        router.back()
      }, 1500)
    } else {
      ElMessage.error(res.message || t('user.setFailed'))
    }
  } catch (error: any) {
    ElMessage.error(error.response?.data?.message || t('user.setFailed'))
  } finally {
    loading.value = false
  }
}

// 修改密码提交
const submitEditForm = async () => {
  // 验证
  if (!form.oldPwd || form.oldPwd.length < 6) {
    ElMessage.warning(t('user.enterOldCoinPwd'))
    return
  }

  if (!form.coinPwd || form.coinPwd.length < 6) {
    ElMessage.warning(t('user.coinPwdLength'))
    return
  }

  if (form.coinPwd !== form.confirmPwd) {
    ElMessage.warning(t('user.pwdNotMatch'))
    return
  }

  // 验证新密码不能与登录密码相同（需要获取登录密码，这里简化处理）
  // 实际应该让用户输入登录密码验证

  loading.value = true
  try {
    const res = await userApi.setCoinPwd({
      oldPwd: MD5(form.oldPwd).toString(),
      newPwd: MD5(form.coinPwd).toString(),
    })

    if (res.code === 0) {
      ElMessage.success(t('user.changeSuccess'))
      isEditMode.value = false
      // 清空表单
      form.oldPwd = ''
      form.coinPwd = ''
      form.confirmPwd = ''
    } else {
      ElMessage.error(res.message || t('user.changeFailed'))
    }
  } catch (error: any) {
    ElMessage.error(error.response?.data?.message || t('user.changeFailed'))
  } finally {
    loading.value = false
  }
}

// 点击已设置状态时的处理
const handleSetClick = () => {
  isEditMode.value = true
}
```

#### 3.4 修改模板中的已设置状态

```vue
<!-- 已设置状态 - 改为可点击修改 -->
<div class="status-card" v-if="hasFundPwd && !isEditMode">
  <div class="status-icon success">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  </div>
  <div class="status-title">{{ t('user.fundPwdSetted') }}</div>
  <div class="status-desc">{{ t('user.fundPwdSettedTip') }}</div>

  <button class="change-btn" @click="handleSetClick">
    {{ t('user.changeCoinPwd') }}
  </button>
</div>
```

#### 3.5 添加新样式

```css
.status-icon.success {
  background: linear-gradient(135deg, #52c41a, #73d13d);
}

/* 修改按钮 */
.change-btn {
  background: transparent;
  color: #fb2351;
  border: 1px solid #fb2351;
  padding: 12px 40px;
  border-radius: 25px;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.2s;
}

.change-btn:hover,
.change-btn:active {
  background: #fb2351;
  color: #fff;
}

/* 返回按钮 */
.back-btn-text {
  display: block;
  width: 100%;
  margin-top: 15px;
  padding: 12px;
  background: transparent;
  border: none;
  color: #666;
  font-size: 14px;
  cursor: pointer;
  text-align: center;
}
```

### 步骤 4：添加多语言翻译

**文件**：`frontend/src/locales/index.ts`

```typescript
// zh-TW
'user': {
  // ... 现有翻译
  'fundPassword': '資金密碼',
  'fundPwdSetted': '已設置資金密碼',
  'fundPwdSettedTip': '您已設置資金密碼，如需修改可點擊下方按鈕',
  'setFundPwd': '設置資金密碼',
  'enterLoginPwd': '請輸入登錄密碼',
  'enterCoinPwd': '請輸入6位數字資金密碼',
  'confirmCoinPwd': '請確認資金密碼',
  'fundPwdTip1': '資金密碼用於提款、綁定銀行卡等操作',
  'fundPwdTip2': '資金密碼必須與登錄密碼不同',
  'contactService': '聯繫客服',
  'changeCoinPwd': '修改資金密碼',
  'enterOldCoinPwd': '請輸入原資金密碼',
  'enterNewCoinPwd': '請輸入新資金密碼',
  'confirmNewCoinPwd': '請確認新資金密碼',
  'backToSet': '返回',
  'setSuccess': '設置成功',
  'setFailed': '設置失敗',
  'changeSuccess': '修改成功',
  'changeFailed': '修改失敗',
  'pwdSame': '資金密碼不能與登錄密碼相同',
  'pwdNotMatch': '兩次密碼不一致',
  'coinPwdLength': '資金密碼需為6位數字',
  'oldPwdError': '原密碼錯誤',
  'loginPwdError': '登錄密碼錯誤',
}

// zh-CN
'user': {
  // ... 现有翻译
  'fundPassword': '资金密码',
  'fundPwdSetted': '已设置资金密码',
  'fundPwdSettedTip': '您已设置资金密码，如需修改可点击下方按钮',
  'setFundPwd': '设置资金密码',
  'enterLoginPwd': '请输入登录密码',
  'enterCoinPwd': '请输入6位数字资金密码',
  'confirmCoinPwd': '请确认资金密码',
  'fundPwdTip1': '资金密码用于提款、绑定银行卡等操作',
  'fundPwdTip2': '资金密码必须与登录密码不同',
  'contactService': '联系客服',
  'changeCoinPwd': '修改资金密码',
  'enterOldCoinPwd': '请输入原资金密码',
  'enterNewCoinPwd': '请输入新资金密码',
  'confirmNewCoinPwd': '请确认新资金密码',
  'backToSet': '返回',
  'setSuccess': '设置成功',
  'setFailed': '设置失败',
  'changeSuccess': '修改成功',
  'changeFailed': '修改失败',
  'pwdSame': '资金密码不能与登录密码相同',
  'pwdNotMatch': '两次密码不一致',
  'coinPwdLength': '资金密码需为6位数字',
  'oldPwdError': '原密码错误',
  'loginPwdError': '登录密码错误',
}

// en
'user': {
  // ... 现有翻译
  'fundPassword': 'Withdrawal Password',
  'fundPwdSetted': 'Withdrawal Password Set',
  'fundPwdSettedTip': 'You have set a withdrawal password. Click below to change it.',
  'setFundPwd': 'Set Withdrawal Password',
  'enterLoginPwd': 'Enter login password',
  'enterCoinPwd': 'Enter 6-digit withdrawal password',
  'confirmCoinPwd': 'Confirm withdrawal password',
  'fundPwdTip1': 'Withdrawal password is used for withdrawals, binding bank cards, etc.',
  'fundPwdTip2': 'Withdrawal password must be different from login password',
  'contactService': 'Contact Service',
  'changeCoinPwd': 'Change Withdrawal Password',
  'enterOldCoinPwd': 'Enter old withdrawal password',
  'enterNewCoinPwd': 'Enter new withdrawal password',
  'confirmNewCoinPwd': 'Confirm new withdrawal password',
  'backToSet': 'Back',
  'setSuccess': 'Set successfully',
  'setFailed': 'Set failed',
  'changeSuccess': 'Changed successfully',
  'changeFailed': 'Change failed',
  'pwdSame': 'Withdrawal password cannot be the same as login password',
  'pwdNotMatch': 'Passwords do not match',
  'coinPwdLength': 'Withdrawal password must be 6 digits',
  'oldPwdError': 'Old password error',
  'loginPwdError': 'Login password error',
}
```

---

## 4. 工作流程总结

```
┌─────────────────────────────────────────────────────────┐
│ 步骤 1: 添加 API 定义                                    │
│ - 在 user.ts 添加 setCoinPwd 方法                       │
│ - 定义正确的请求参数和返回类型                           │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ 步骤 2: 安装 crypto-js                                  │
│ - npm install crypto-js                                │
│ - npm install -D @types/crypto-js                      │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ 步骤 3: 修改 FundPwd.vue                               │
│ 3.1 导入 MD5                                            │
│ 3.2 添加修改密码状态和模板                               │
│ 3.3 修改 Script 逻辑                                     │
│   - 首次设置：需要登录密码验证                            │
│   - 修改密码：需要原提款密码验证                          │
│ 3.4 添加新样式                                           │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ 步骤 4: 添加多语言翻译                                   │
│ - zh-TW / zh-CN / en 三个语言版本                       │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ 步骤 5: 测试验证                                         │
│ - 首次设置流程                                           │
│ - 修改密码流程                                           │
│ - 错误处理                                               │
└─────────────────────────────────────────────────────────┘
```

---

## 5. 测试验证清单

| 测试项 | 预期结果 | 状态 |
|-------|---------|------|
| 首次设置 - 登录密码验证 | 未输入登录密码时提示 | ☐ |
| 首次设置 - 密码长度验证 | 不足6位时提示 | ☐ |
| 首次设置 - 密码确认验证 | 两次输入不一致时提示 | ☐ |
| 首次设置 - 密码相同验证 | 与登录密码相同时提示 | ☐ |
| 首次设置 - 成功提交 | 成功调用API并更新状态 | ☐ |
| 修改密码 - 原密码验证 | 原密码错误时显示后端错误 | ☐ |
| 修改密码 - 新密码验证 | 新密码不能与登录密码相同 | ☐ |
| 修改密码 - 成功提交 | 成功调用API并刷新状态 | ☐ |
| 返回按钮 | 从修改模式返回到已设置状态 | ☐ |
| 页面样式 | 红白主题正确显示 | ☐ |

---

## 6. 注意事项

1. **后端接口**：确保后端 `/safe/setCoinPwddo` 接口已实现并返回正确格式
2. **MD5 加密**：必须使用 crypto-js 库的 MD5，不能使用模拟实现
3. **安全问题**：前端不应明文存储密码，只用于即时加密后传输
4. **用户体验**：所有错误提示需要使用多语言

---

**文档创建日期**：2026-02-26
