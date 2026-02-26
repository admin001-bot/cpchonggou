# 安全审计报告

## 1. 概述
- **测试日期**: 2026-02-26
- **测试范围**: 前端 (Vue.js) + 后端 (Go/Gin)
- **测试工具**: 代码审查、静态分析

---

## 2. 发现的问题

### 2.1 高危 (Critical)

| ID | 问题 | 位置 | 影响 | 修复建议 |
|---|---|---|---|---|
| C-01 | 配置文件提交到Git | `backend/config/config.yaml` | 数据库密码、JWT密钥泄露 | 将配置文件加入 .gitignore，使用环境变量 |
| C-02 | 数据库密码明文存储 | `config.yaml:12` | 数据库被未授权访问 | 使用环境变量或密钥管理服务 |
| C-03 | JWT Secret 弱且可预测 | `config.yaml:18` | Token可被伪造 | 使用256位以上强随机密钥 |
| C-04 | 密码使用MD5哈希 | `user_handler.go:188-193` | 彩虹表攻击、碰撞攻击 | 改用 bcrypt 或 Argon2 |
| C-05 | Token机制不安全 | `user_handler.go:25-60` | Token可预测、不支持多实例 | 使用标准JWT，存储到Redis |
| C-06 | 无登录失败延迟 | `user_handler.go:233-287` | 暴力破解攻击 | 添加登录失败延迟和账户锁定 |

### 2.2 中危 (High)

| ID | 问题 | 位置 | 影响 | 修复建议 |
|---|---|---|---|---|
| H-01 | CORS配置为 `*` | `main.go:35` | CSRF攻击风险 | 限制允许的域名列表 |
| H-02 | 调试接口暴露 | `main.go:124` | 敏感数据泄露 | 生产环境禁用调试接口 |
| H-03 | 无速率限制 | `main.go` 全局 | DDoS、暴力破解 | 添加速率限制中间件 |
| H-04 | 修改密码后旧Token有效 | `user_handler.go:386-453` | 会话劫持 | 密码修改后使旧Token失效 |
| H-05 | 服务器模式为debug | `config.yaml:5` | 敏感信息泄露 | 生产环境设为 `release` |
| H-06 | 无登录日志记录 | `user_handler.go` | 无法追溯安全事件 | 记录IP、时间、设备等信息 |

### 2.3 低危 (Medium/Low)

| ID | 问题 | 位置 | 影响 | 修复建议 |
|---|---|---|---|---|
| M-01 | v-html 使用 | `Help.vue:31` | 潜在XSS风险 | 数据来自静态翻译，风险较低，建议添加XSS过滤 |
| M-02 | 无HTTPS强制 | `main.go` | 中间人攻击 | 强制使用HTTPS，配置HSTS |
| M-03 | Cookie未设置安全属性 | 全局 | 会话劫持 | 设置 Secure, HttpOnly, SameSite |
| M-04 | 前端Source Map未禁用 | `vite.config.ts` | 源码泄露 | 生产环境禁用 Source Map |
| M-05 | 无Token刷新机制 | `user_handler.go` | 用户体验和安全平衡 | 实现 Refresh Token 机制 |
| M-06 | 硬编码表名拼接SQL | `game_handler.go:768` | 潜在SQL注入风险 | 虽然表名硬编码，但不推荐此模式 |

---

## 3. 详细分析

### 3.1 密码哈希问题 (C-04)

当前实现使用 MD5 哈希密码：

```go
func md5Hash(s string) string {
    h := md5.New()
    h.Write([]byte(s))
    return hex.EncodeToString(h.Sum(nil))
}
```

**问题：**
- MD5 是已被破解的哈希算法
- 没有使用盐值
- 容易受到彩虹表攻击

**修复建议：**
```go
import "golang.org/x/crypto/bcrypt"

func hashPassword(password string) (string, error) {
    bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
    return string(bytes), err
}

func checkPassword(password, hash string) bool {
    err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
    return err == nil
}
```

### 3.2 Token机制问题 (C-05)

当前实现：

```go
var tokenStore = make(map[string]TokenData)  // 内存存储

func saveToken(token string, uid int) {
    tokenStore[token] = TokenData{...}
}
```

**问题：**
- 使用内存 map 存储，服务器重启后所有用户需重新登录
- 不支持多实例部署
- Token 生成使用可预测的输入

**修复建议：**
使用标准 JWT 库（如 `github.com/golang-jwt/jwt/v5`）并将 Token 存储到 Redis。

### 3.3 CORS配置问题 (H-01)

当前配置：
```go
c.Header("Access-Control-Allow-Origin", "*")
```

**修复建议：**
```go
allowedOrigins := []string{
    "https://your-domain.com",
    "https://admin.your-domain.com",
}
origin := c.GetHeader("Origin")
for _, allowed := range allowedOrigins {
    if origin == allowed {
        c.Header("Access-Control-Allow-Origin", origin)
        break
    }
}
```

---

## 4. 安全检查清单完成情况

### 第一阶段：架构安全审查
- [x] 敏感文件检查 - **发现问题**: config.yaml 已提交
- [x] .gitignore 检查 - 基本完善
- [x] 临时目录检查 - 未被跟踪

### 第二阶段：认证与授权安全
- [x] JWT 安全审查 - **发现问题**: Secret弱、使用内存存储
- [x] 会话管理安全 - **发现问题**: 无延迟、无日志、无失效机制

### 第三阶段：输入验证与注入防护
- [x] SQL注入防护 - 大部分使用参数化查询，有一处拼接表名
- [x] XSS防护 - 发现一处 v-html 使用
- [x] 命令注入 - 未发现

### 第四阶段：业务逻辑安全
- [x] 投注业务安全 - 有基本验证
- [x] 资金业务安全 - 有事务处理
- [x] 用户数据安全 - **发现问题**: MD5哈希

### 第五阶段：配置与部署安全
- [x] 配置文件安全 - **发现问题**: 明文密码
- [x] HTTPS与传输安全 - **发现问题**: CORS为*
- [x] 日志与监控 - 缺少安全日志

---

## 5. 优先修复建议

### 立即修复 (Critical)
1. 将 `config.yaml` 加入 `.gitignore`，从 Git 历史中删除
2. 使用环境变量存储敏感配置
3. 更换密码哈希算法为 bcrypt
4. 实现标准的 JWT Token 机制
5. 添加登录失败延迟机制

### 短期修复 (High)
1. 限制 CORS 允许的域名
2. 移除或保护调试接口
3. 添加速率限制
4. 实现密码修改后 Token 失效
5. 添加登录日志记录

### 长期改进 (Medium/Low)
1. 强制 HTTPS
2. 禁用生产环境 Source Map
3. 实现 Refresh Token 机制
4. 添加 CSP 头

---

## 6. 附录

### 依赖安全状态
- **前端**: npm audit 无法从镜像源运行
- **后端**: Go 环境未安装，无法运行 gosec

### 建议的安全工具
| 工具 | 用途 |
|---|---|
| gosec | Go 安全扫描 |
| npm audit | 前端依赖漏洞检查 |
| OWASP ZAP | 动态安全测试 |
| SonarQube | 代码质量和安全分析 |

---

## 7. 动态渗透测试结果

### 7.1 SQL注入测试

| 测试点 | Payload | 结果 |
|---|---|---|
| 登录接口 | `' OR '1'='1' --` | **安全** - 参数化查询阻止注入 |
| 登录接口 | `' UNION SELECT *` | **安全** - 参数化查询阻止注入 |
| 登录接口 | `' AND SLEEP(3) --` | **安全** - 无时间延迟 |
| 注册接口 | `' OR '1'='1` | **安全** - 数据被存储但不执行 |

**结论：** 后端使用GORM参数化查询，SQL注入防护有效。

### 7.2 XSS测试

| 测试点 | Payload | 结果 |
|---|---|---|
| 注册name字段 | `<script>alert(1)</script>` | **风险** - payload被存储到数据库 |
| 注册name字段 | `<img src=x onerror=alert(1)>` | **风险** - payload被存储到数据库 |
| 注册name字段 | `javascript:alert(1)` | **风险** - payload被存储到数据库 |

**结论：** 存在**存储型XSS风险**。后端未过滤恶意输入，依赖前端转义。如果前端有XSS漏洞（如Help.vue的v-html），可能导致攻击。

### 7.3 认证授权测试

| 测试点 | 结果 |
|---|---|
| 无Token访问受保护接口 | **安全** - 返回401 |
| 无效Token访问 | **安全** - 返回401 |
| 伪造JSON Token | **安全** - Token验证失败 |
| 提款接口未授权访问 | **安全** - 返回401 |

**结论：** 认证机制工作正常。

### 7.4 其他漏洞测试

| 测试点 | 结果 |
|---|---|
| 目录遍历 `/api/../config/config.yaml` | **安全** - 返回404 |
| 配置文件直接访问 `/config/config.yaml` | **安全** - 返回404 |
| 调试接口 `/api/game/debug/data` | **风险** - 无需认证，泄露数据 |
| 健康检查 `/health` | **低风险** - 暴露API运行状态 |
| CORS响应头 | **风险** - 确认为 `*` |

### 7.5 动态测试发现的新问题

| ID | 问题 | 严重程度 | 描述 |
|---|---|---|---|
| D-01 | 调试接口无认证 | 高危 | `/api/game/debug/data` 无需登录即可访问 |
| D-02 | 存储型XSS风险 | 中危 | 用户输入未过滤，恶意payload被存储 |

---

## 8. 修复验证清单

### 高危问题
- [ ] C-01: 配置文件从Git移除
- [ ] C-02: 数据库密码使用环境变量
- [ ] C-03: 更换JWT Secret
- [ ] C-04: 更换密码哈希算法
- [ ] C-05: 实现标准JWT机制
- [ ] C-06: 添加登录失败延迟
- [ ] D-01: 移除或保护调试接口

### 中危问题
- [ ] H-01: 限制CORS域名
- [ ] H-02: 移除调试接口
- [ ] H-03: 添加速率限制
- [ ] H-04: 密码修改后Token失效
- [ ] H-05: 生产环境设为release
- [ ] H-06: 添加登录日志
- [ ] D-02: 输入过滤和输出转义

---

**报告生成时间**: 2026-02-26
**动态测试时间**: 2026-02-26
**审计人员**: Security Auditor Agent
