# 安全审计方案

## 概述

本方案用于指导安全代理（Security Auditor）对重构后的彩票系统进行全面安全审计。

---

## 第一阶段：架构安全审查

### 1.1 项目结构审查

**检查清单：**
- [ ] 确认敏感文件未提交到 Git（如 .env、密钥文件）
- [ ] 检查是否有调试日志文件残留
- [ ] 验证 node_modules/.cache 等临时目录不在版本控制中
- [ ] 检查前端 build/dist 目录是否被正确忽略

**文件路径检查：**
```bash
# 检查 Git 仓库中的敏感文件
backend/config/config.yaml
backend/config/*.pem
frontend/.env.production
frontend/.env.local
*.log
*.key
*.pem
```

### 1.2 依赖安全检查

**前端依赖（frontend/package.json）：**
- [ ] 运行 `npm audit` 检查已知漏洞
- [ ] 检查是否存在已弃用的依赖包
- [ ] 验证 crypto-js 版本（应使用最新版）
- [ ] 检查 axios 版本（确保支持最新安全特性）

**后端依赖（go.mod）：**
- [ ] 运行 `go list -json -m all | nancy sleuth` 检查 Go 依赖漏洞
- [ ] 验证 gin 框架版本
- [ ] 检查 gorm 版本
- [ ] 验证 JWT 库版本

---

## 第二阶段：认证与授权安全

### 2.1 JWT 安全审查

**文件路径：**
- `backend/internal/middleware/jwt.go`
- `backend/internal/handler/user_handler.go`

**检查清单：**
- [ ] JWT Secret Key 长度是否 >= 256 位
- [ ] JWT Token 过期时间是否合理（建议 2-24 小时）
- [ ] 是否实现了 Refresh Token 机制
- [ ] Token 是否包含敏感信息
- [ ] 是否实现了 Token 黑名单/吊销机制

**测试用例：**
```bash
# 1. 使用过期 Token 访问受保护资源
curl -H "Authorization: Bearer <expired_token>" /api/user/info

# 2. 使用无效签名 Token
curl -H "Authorization: Bearer <invalid_signature_token>" /api/user/info

# 3. 尝试 Token 伪造
```

### 2.2 会话管理安全

**检查清单：**
- [ ] 登录失败后是否有延迟机制（防暴力破解）
- [ ] 是否记录了登录日志（IP、时间、设备）
- [ ] 是否实现了异地登录提醒
- [ ] 用户修改密码后是否使其他会话失效
- [ ] 是否限制同时在线设备数

---

## 第三阶段：输入验证与注入防护

### 3.1 SQL 注入防护

**文件路径：**
- `backend/internal/model/*.go`
- `backend/internal/handler/*.go`

**检查清单：**
- [ ] 所有数据库查询是否使用参数化查询（Prepared Statements）
- [ ] GORM 的 `Raw()` 和 `Exec()` 使用是否安全
- [ ] 是否禁止了字符串拼接 SQL
- [ ] 动态排序字段是否进行了白名单验证

**测试用例：**
```sql
# 测试登录 SQL 注入
username: admin' OR '1'='1' --
password: anything

# 测试 UNION 注入
username: admin' UNION SELECT * FROM ssc_members --

# 测试盲注
username: admin' AND SLEEP(5) --
```

### 3.2 XSS 防护

**检查清单：**
- [ ] 前端输出是否进行了 HTML 转义
- [ ] Vue.js 的 `v-html` 使用是否安全
- [ ] 是否实现了 Content Security Policy (CSP)
- [ ] 用户输入的内容是否进行了过滤
- [ ] 是否对富文本编辑器进行了 XSS 过滤

**测试用例：**
```html
# 存储型 XSS
<script>alert('xss')</script>
<img src=x onerror=alert('xss')>
<svg onload=alert('xss')>

# DOM 型 XSS
javascript:alert('xss')
```

### 3.3 其他注入防护

**命令注入：**
- [ ] 是否使用了 `exec`、`system` 等危险函数
- [ ] 用户输入是否被用于构建系统命令

**LDAP 注入：**
- [ ] 如有 LDAP 认证，是否进行了特殊字符过滤

**XML 注入：**
- [ ] XML 解析器是否禁用了外部实体（XXE）

---

## 第四阶段：业务逻辑安全

### 4.1 投注业务安全

**检查清单：**
- [ ] 投注时是否验证期号有效性
- [ ] 是否防止重复投注
- [ ] 投注金额是否有上下限限制
- [ ] 封盘时间后是否禁止投注
- [ ] 是否验证用户余额充足
- [ ] 是否防止负金额投注
- [ ] 赔率是否从后端获取（防止前端篡改）

### 4.2 资金业务安全

**充值安全：**
- [ ] 是否验证充值金额合理性
- [ ] 是否防止重复提交充值订单
- [ ] 第三方支付回调是否验证签名
- [ ] 是否记录充值流水

**提现安全：**
- [ ] 是否验证资金密码
- [ ] 是否限制每日提现次数和金额
- [ ] 是否验证银行卡归属
- [ ] 是否防止提现金额大于余额
- [ ] 是否实现了提现审核流程

### 4.3 用户数据安全

**检查清单：**
- [ ] 用户密码是否使用强哈希算法（bcrypt/Argon2，不是MD5/SHA1）
- [ ] 敏感字段（身份证、银行卡）是否加密存储
- [ ] 用户密码找回流程是否安全
- [ ] 是否实现了敏感操作二次验证（手机验证码/邮箱验证）

---

## 第五阶段：配置与部署安全

### 5.1 配置文件安全

**后端配置（config.yaml）：**
- [ ] 数据库密码是否从环境变量读取
- [ ] JWT Secret 是否为强随机字符串
- [ ] 是否区分开发和生产配置
- [ ] 生产环境是否关闭调试模式

**前端配置：**
- [ ] API 地址是否可配置
- [ ] 是否删除 Vue 开发工具配置
- [ ] 是否禁用了 Source Map（生产环境）

### 5.2 HTTPS 与传输安全

**检查清单：**
- [ ] 是否强制使用 HTTPS
- [ ] 是否配置了 HSTS (HTTP Strict Transport Security)
- [ ] Cookie 是否设置了 Secure 和 HttpOnly 标志
- [ ] 是否配置了合适的 CORS 策略（不要设为 *）

### 5.3 日志与监控

**检查清单：**
- [ ] 是否记录安全相关日志（登录、密码修改、敏感操作）
- [ ] 日志中是否不包含敏感信息（密码、Token）
- [ ] 是否实现了异常监控和告警
- [ ] 是否实现了日志轮转和归档

---

## 第六阶段：自动化安全测试

### 6.1 静态代码分析

**前端（Vue/TypeScript）：**
```bash
cd frontend

# 安装依赖
npm install --save-dev eslint-plugin-security

# 运行 ESLint
npm run lint

# 检查已知漏洞
npm audit --audit-level=high
```

**后端（Go）：**
```bash
cd backend

# 使用 gosec 进行安全检查
go install github.com/securego/gosec/v2/cmd/gosec@latest
gosec -fmt=json -out=security-report.json ./...

# 检查依赖漏洞
# 安装 nancy: https://github.com/sonatype-nexus-community/nancy
go list -json -m all | nancy sleuth
```

### 6.2 动态安全测试

**使用 OWASP ZAP：**
```bash
# 安装 ZAP: https://www.zaproxy.org/download/

# 启动 ZAP 并运行主动扫描
zap.sh -daemon -host 0.0.0.0 -port 8080

# 使用 API 进行扫描
curl "http://localhost:8080/JSON/spider/action/scan/?url=http://your-app.com"
curl "http://localhost:8080/JSON/ascan/action/scan/?url=http://your-app.com"
```

**手动测试清单：**
```bash
# 1. 测试 SQL 注入
curl -X POST "http://localhost:8080/api/user/login" \
  -d "username=admin' OR '1'='1&password=test"

# 2. 测试 XSS
curl -X POST "http://localhost:8080/api/user/register" \
  -d "nickname=<script>alert('xss')</script>"

# 3. 测试 CSRF
# 创建一个恶意 HTML 页面尝试提交表单

# 4. 测试目录遍历
curl "http://localhost:8080/api/../config/config.yaml"

# 5. 测试未授权访问
curl "http://localhost:8080/api/admin/users" \
  -H "Authorization: Bearer invalid_token"
```

### 6.3 渗透测试报告模板

```markdown
# 渗透测试报告

## 1. 概述
- 测试日期: YYYY-MM-DD
- 测试范围: 前端 + 后端 API
- 测试工具: OWASP ZAP, Burp Suite, curl

## 2. 发现的问题

### 2.1 高危 (Critical)
| ID | 问题 | 位置 | 影响 | 修复建议 |
|---|---|---|---|---|
| 1 | SQL注入 | /api/login | 数据库泄露 | 使用参数化查询 |

### 2.2 中危 (High)
| ID | 问题 | 位置 | 影响 | 修复建议 |
|---|---|---|---|---|
| 2 | XSS | /api/register | 会话劫持 | 输出转义 |

### 2.3 低危 (Medium/Low)
...

## 3. 修复验证
- [ ] 问题 1 已修复并验证
- [ ] 问题 2 已修复并验证

## 4. 附录
- 测试原始日志
- 截图证据
```

---

## 执行计划

### 第一阶段：静态分析（1-2天）
1. 运行 ESLint 和 gosec
2. 检查依赖漏洞
3. 审查配置文件

### 第二阶段：动态测试（2-3天）
1. 使用 OWASP ZAP 自动扫描
2. 手动测试常见漏洞
3. 测试业务逻辑漏洞

### 第三阶段：报告与修复（2-3天）
1. 整理测试报告
2. 提供修复建议
3. 验证修复结果

---

## 工具清单

| 工具 | 用途 | 安装方式 |
|---|---|---|
| ESLint | 前端代码检查 | npm install -g eslint |
| gosec | Go 安全扫描 | go install github.com/securego/gosec/v2/cmd/gosec@latest |
| nancy | Go 依赖漏洞检查 | 见官网 |
| OWASP ZAP | Web 漏洞扫描 | 官网下载 |
| Burp Suite | 渗透测试 | 官网下载 |
| SQLMap | SQL 注入测试 | pip install sqlmap |

---

**注意：** 执行渗透测试前，确保获得适当的授权，并在测试环境中进行。
