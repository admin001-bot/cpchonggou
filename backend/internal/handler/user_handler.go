package handler

import (
	"crypto/md5"
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"regexp"
	"strings"
	"time"

	"lottery-system/internal/model"
	"lottery-system/pkg/i18n"
	"lottery-system/pkg/response"

	"github.com/gin-gonic/gin"
)

// TokenData token数据结构
type TokenData struct {
	UID      int   `json:"uid"`
	IsGuest  bool  `json:"isGuest"`
	ExpireAt int64 `json:"expireAt"`
}

// token存储 (实际项目应使用Redis)
var tokenStore = make(map[string]TokenData)

// ParseToken 解析token获取用户ID
func ParseToken(token string) (int, error) {
	// 处理Bearer前缀
	if strings.HasPrefix(token, "Bearer ") {
		token = strings.TrimPrefix(token, "Bearer ")
	}

	// 从内存中查找token
	if data, ok := tokenStore[token]; ok {
		if data.ExpireAt > time.Now().Unix() {
			return data.UID, nil
		}
		delete(tokenStore, token)
	}

	// 尝试解析JSON格式的token
	var td TokenData
	if err := json.Unmarshal([]byte(token), &td); err == nil {
		if td.ExpireAt > time.Now().Unix() {
			return td.UID, nil
		}
	}

	return 0, fmt.Errorf(i18n.T("login.token_invalid"))
}

// ParseTokenFull 解析token获取完整信息
func ParseTokenFull(token string) (*TokenData, error) {
	// 处理Bearer前缀
	if strings.HasPrefix(token, "Bearer ") {
		token = strings.TrimPrefix(token, "Bearer ")
	}

	// 从内存中查找token
	if data, ok := tokenStore[token]; ok {
		if data.ExpireAt > time.Now().Unix() {
			return &data, nil
		}
		delete(tokenStore, token)
	}

	return nil, fmt.Errorf(i18n.T("login.token_invalid"))
}

// saveToken 保存token
func saveToken(token string, uid int, isGuest bool) {
	tokenStore[token] = TokenData{
		UID:      uid,
		IsGuest:  isGuest,
		ExpireAt: time.Now().Add(24 * time.Hour).Unix(),
	}
}

// UserHandler 用户处理器
type UserHandler struct{}

// RegisterRequest 注册请求
type RegisterRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
	Phone    string `json:"phone" binding:"required"`
	Name     string `json:"name"`
	ParentID int    `json:"parentId"`
}

// RegisterResponse 注册响应
type RegisterResponse struct {
	UID      uint   `json:"uid"`
	Username string `json:"username"`
}

// NewUserHandler 创建用户处理器
func NewUserHandler() *UserHandler {
	return &UserHandler{}
}

// Register 用户注册
func (h *UserHandler) Register(c *gin.Context) {
	var req RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, i18n.T("register.enterCompleteInfo"))
		return
	}

	// 数据清洗
	username := strings.TrimSpace(req.Username)
	password := req.Password
	phone := strings.TrimSpace(req.Phone)
	name := strings.TrimSpace(req.Name)

	// 用户名验证
	if len(username) < 3 || len(username) > 20 {
		response.Error(c, i18n.T("register.usernameLength"))
		return
	}

	// 用户名只能是字母和数字
	matched, _ := regexp.MatchString("^[a-zA-Z0-9]+$", username)
	if !matched {
		response.Error(c, i18n.T("register.invalid_username"))
		return
	}

	// 密码验证
	if len(password) < 6 || len(password) > 20 {
		response.Error(c, i18n.T("register.password_too_short"))
		return
	}

	// 手机号验证
	if phone == "" {
		response.Error(c, i18n.T("register.enterPhone"))
		return
	}

	// 检查用户名是否已存在
	var existUser model.User
	if err := model.DB.Where("username = ?", username).First(&existUser).Error; err == nil {
		response.Error(c, i18n.T("register.username_exists"))
		return
	}

	// 密码MD5加密
	hashedPassword := md5Hash(password)

	// 获取客户端IP
	clientIP := c.ClientIP()

	// 创建用户
	user := model.User{
		Username:   username,
		Password:   hashedPassword,
		Phone:      phone,
		Name:       name,
		Nickname:   username,
		RegIP:      clientIP,
		RegTime:    time.Now().Unix(),
		UpdateTime: time.Now(),
		Enable:     1,
		Type:       0, // 普通会员
		ParentID:   req.ParentID,
		Coin:       0,
		Grade:      1,
	}

	// 如果有推荐人，设置上级关系
	if req.ParentID > 0 {
		var parent model.User
		if err := model.DB.First(&parent, req.ParentID).Error; err == nil {
			user.ParentID = int(parent.UID)
			user.ZParentID = parent.ZParentID
			user.GudongID = parent.GudongID

			// 根据上级类型设置关系
			if parent.Type == 1 {
				user.ParentID = int(parent.UID)
				user.ZParentID = parent.ZParentID
				user.GudongID = parent.GudongID
			} else if parent.Type == 2 {
				user.ZParentID = int(parent.UID)
				user.GudongID = parent.GudongID
			} else if parent.Type == 3 {
				user.GudongID = int(parent.UID)
			}
		}
	}

	// 保存用户
	if err := model.DB.Create(&user).Error; err != nil {
		response.Error(c, i18n.T("register.failed"))
		return
	}

	response.Success(c, RegisterResponse{
		UID:      user.UID,
		Username: user.Username,
	})
}

// md5Hash 计算MD5哈希值
func md5Hash(s string) string {
	h := md5.New()
	h.Write([]byte(s))
	return hex.EncodeToString(h.Sum(nil))
}

// LoginRequest 登录请求
type LoginRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

// LoginResponse 登录响应 - 与PHP一致
type LoginResponse struct {
	Token     string `json:"token"`
	UID       uint   `json:"uid"`
	Username  string `json:"username"`
	Nickname  string `json:"nickname"`
	Coin      string `json:"coin"`
	Email     string `json:"email"`
	Name      string `json:"name"`
	Phone     string `json:"phone"`
	TestFlag  int    `json:"testFlag"`
	HasFundPwd bool  `json:"hasFundPwd"`
	FanDian   float32 `json:"fanDian"`
}

// InitResponse 初始化响应
type InitResponse struct {
	Token     string `json:"token"`
	UID       uint   `json:"uid"`
	Username  string `json:"username"`
	Nickname  string `json:"nickname"`
	Coin      string `json:"coin"`
	Email     string `json:"email"`
	Name      string `json:"name"`
	Phone     string `json:"phone"`
	TestFlag  int    `json:"testFlag"`
	HasFundPwd bool  `json:"hasFundPwd"`
	FanDian   float32 `json:"fanDian"`
	ServerTime int64 `json:"serverTime"`
}

// Login 用户登录
func (h *UserHandler) Login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, i18n.T("login.enterUsernamePassword"))
		return
	}

	username := strings.TrimSpace(req.Username)
	password := req.Password

	// 查找用户
	var user model.User
	if err := model.DB.Where("username = ?", username).First(&user).Error; err != nil {
		response.Error(c, i18n.T("login.invalid_credentials"))
		return
	}

	// 验证密码
	hashedPassword := md5Hash(password)
	if user.Password != hashedPassword {
		response.Error(c, i18n.T("login.invalid_credentials"))
		return
	}

	// 检查用户状态
	if user.Enable != 1 {
		response.Error(c, i18n.T("login.account_disabled"))
		return
	}

	// 生成简单token (实际项目应使用JWT)
	token := md5Hash(username + password + time.Now().String())

	// 保存token到内存
	saveToken(token, int(user.UID), false)

	// 更新登录时间
	model.DB.Model(&user).Updates(map[string]interface{}{
		"updateTime": time.Now(),
	})

	response.Success(c, LoginResponse{
		Token:     token,
		UID:       user.UID,
		Username:  user.Username,
		Nickname:  user.Nickname,
		Coin:      fmt.Sprintf("%.2f", user.Coin),
		Email:     user.Email,
		Name:      user.Name,
		Phone:     user.Phone,
		TestFlag:  0,
		HasFundPwd: user.CoinPassword != "",
		FanDian:   user.FanDian,
	})
}

// GetUserInfo 获取用户信息
func (h *UserHandler) GetUserInfo(c *gin.Context) {
	// 从Header获取Token
	token := c.GetHeader("Authorization")
	if token == "" {
		response.Error(c, i18n.T("common.unauthorized"))
		return
	}

	// 解析token获取用户ID和是否为游客
	tokenData, err := ParseTokenFull(token)
	if err != nil {
		response.Error(c, i18n.T("login.token_invalid"))
		return
	}

	uid := tokenData.UID
	isGuest := tokenData.IsGuest

	// 根据是否为游客查询不同的表
	if isGuest {
		// 游客用户从guestmembers表查询
		var guestUser model.GuestMembers
		if err := model.DB.First(&guestUser, uid).Error; err != nil {
			response.Error(c, i18n.T("bet.user_not_found"))
			return
		}
		response.Success(c, gin.H{
			"uid":        guestUser.UID,
			"username":   guestUser.Username,
			"nickname":   guestUser.Nickname,
			"name":       guestUser.Name,
			"phone":      "",
			"email":      "",
			"coin":       fmt.Sprintf("%.2f", guestUser.Coin),
			"type":       0,
			"grade":      1,
			"testFlag":   1,
			"hasFundPwd": false,
			"fanDian":    float32(0),
		})
		return
	}

	// 普通用户从members表查询
	var user model.User
	if err := model.DB.First(&user, uid).Error; err != nil {
		response.Error(c, i18n.T("bet.user_not_found"))
		return
	}

	response.Success(c, gin.H{
		"uid":        user.UID,
		"username":   user.Username,
		"nickname":   user.Nickname,
		"name":       user.Name,
		"phone":      user.Phone,
		"email":      user.Email,
		"coin":       fmt.Sprintf("%.2f", user.Coin),
		"type":       user.Type,
		"grade":      user.Grade,
		"testFlag":   0,
		"hasFundPwd": user.CoinPassword != "",
		"fanDian":    user.FanDian,
	})
}

// Init 初始化接口 - 类似PHP的/api/init
func (h *UserHandler) Init(c *gin.Context) {
	// 从Header获取Token
	token := c.GetHeader("Authorization")
	if token == "" {
		// 没有token，返回未登录状态
		c.JSON(200, gin.H{
			"code":    401,
			"message": i18n.T("common.unauthorized"),
			"data":    nil,
		})
		return
	}

	// 解析token获取用户ID和是否为游客
	tokenData, err := ParseTokenFull(token)
	if err != nil {
		c.JSON(200, gin.H{
			"code":    401,
			"message": i18n.T("login.token_invalid"),
			"data":    nil,
		})
		return
	}

	uid := tokenData.UID
	isGuest := tokenData.IsGuest

	// 根据是否为游客查询不同的表
	if isGuest {
		// 游客用户从guestmembers表查询
		var guestUser model.GuestMembers
		if err := model.DB.First(&guestUser, uid).Error; err != nil {
			c.JSON(200, gin.H{
				"code":    401,
				"message": i18n.T("bet.user_not_found"),
				"data":    nil,
			})
			return
		}
		response.Success(c, InitResponse{
			Token:      token,
			UID:        guestUser.UID,
			Username:   guestUser.Username,
			Nickname:   guestUser.Nickname,
			Coin:       fmt.Sprintf("%.2f", guestUser.Coin),
			Email:      "",
			Name:       guestUser.Name,
			Phone:      "",
			TestFlag:   1,
			HasFundPwd: false,
			FanDian:    0,
			ServerTime: time.Now().Unix(),
		})
		return
	}

	// 普通用户从members表查询
	var user model.User
	if err := model.DB.First(&user, uid).Error; err != nil {
		c.JSON(200, gin.H{
			"code":    401,
			"message": i18n.T("bet.user_not_found"),
			"data":    nil,
		})
		return
	}

	response.Success(c, InitResponse{
		Token:      token,
		UID:        user.UID,
		Username:   user.Username,
		Nickname:   user.Nickname,
		Coin:       fmt.Sprintf("%.2f", user.Coin),
		Email:      user.Email,
		Name:       user.Name,
		Phone:      user.Phone,
		TestFlag:   0,
		HasFundPwd: user.CoinPassword != "",
		FanDian:    user.FanDian,
		ServerTime: time.Now().Unix(),
	})
}

// SetPasswordRequest 修改密码请求
type SetPasswordRequest struct {
	OldPwd string `json:"oldPwd" binding:"required"`
	NewPwd string `json:"newPwd" binding:"required"`
}

// SetPassword 修改登录密码 - 参考 PHP Safe.class.php setPasswddo
func (h *UserHandler) SetPassword(c *gin.Context) {
	// 从 Header 获取 Token
	token := c.GetHeader("Authorization")
	if token == "" {
		response.Error(c, i18n.T("login.login_required"))
		return
	}

	// 解析 token 获取用户 ID
	uid, err := ParseToken(token)
	if err != nil {
		response.Error(c, i18n.T("login.token_invalid"))
		return
	}

	var req SetPasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, i18n.T("user.enterOldPwd"))
		return
	}

	opwd := req.OldPwd
	npwd := req.NewPwd

	// 验证旧密码
	if opwd == "" {
		response.Error(c, i18n.T("user.oldPwdEmpty"))
		return
	}
	if len(opwd) < 6 {
		response.Error(c, i18n.T("user.oldPwdMinLength"))
		return
	}

	// 验证新密码
	if npwd == "" {
		response.Error(c, i18n.T("user.newPwdEmpty"))
		return
	}
	if len(npwd) < 6 {
		response.Error(c, i18n.T("user.pwdMinLength"))
		return
	}

	// 查询用户密码
	var user model.User
	if err := model.DB.Select("uid, password").First(&user, uid).Error; err != nil {
		response.Error(c, i18n.T("bet.user_not_found"))
		return
	}

	// 验证旧密码是否正确
	oldPwdHash := md5Hash(opwd)
	if oldPwdHash != user.Password {
		response.Error(c, i18n.T("user.oldPwdIncorrect"))
		return
	}

	// 更新密码
	newPwdHash := md5Hash(npwd)
	if err := model.DB.Model(&model.User{}).Where("uid = ?", uid).Update("password", newPwdHash).Error; err != nil {
		response.Error(c, i18n.T("user.changePwdFailed"))
		return
	}

	response.Success(c, gin.H{})
}

// SetCoinPasswordRequest 设置资金密码请求
type SetCoinPasswordRequest struct {
	OldPwd   string `json:"oldPwd"`
	NewPwd   string `json:"newPwd" binding:"required"`
	LoginPwd string `json:"loginPwd"`
}

// SetCoinPassword 设置/修改资金密码 - 参考 PHP Safe.class.php setCoinPwddo
func (h *UserHandler) SetCoinPassword(c *gin.Context) {
	// 从 Header 获取 Token
	token := c.GetHeader("Authorization")
	if token == "" {
		response.Error(c, i18n.T("login.login_required"))
		return
	}

	// 解析 token 获取用户 ID
	uid, err := ParseToken(token)
	if err != nil {
		response.Error(c, i18n.T("login.token_invalid"))
		return
	}

	var req SetCoinPasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, i18n.T("user.fillAllFields"))
		return
	}

	opwd := req.OldPwd
	npwd := req.NewPwd
	loginPwd := req.LoginPwd

	// 验证新密码
	if npwd == "" {
		response.Error(c, i18n.T("user.newCoinPwdEmpty"))
		return
	}
	if len(npwd) < 6 {
		response.Error(c, i18n.T("user.pwdMinLength"))
		return
	}

	// 查询用户信息
	var user model.User
	if err := model.DB.First(&user, uid).Error; err != nil {
		response.Error(c, i18n.T("bet.user_not_found"))
		return
	}

	// 根据是否已设置资金密码决定验证方式
	var tishi string
	if user.CoinPassword == "" {
		// 首次设置 - 验证登录密码
		if loginPwd == "" {
			response.Error(c, i18n.T("user.enterLoginPwd"))
			return
		}
		// 验证登录密码
		loginPwdHash := md5Hash(loginPwd)
		if loginPwdHash != user.Password {
			response.Error(c, i18n.T("user.oldPwdIncorrect"))
			return
		}
		tishi = i18n.T("user.setFundPwdSuccess")
	} else {
		// 修改资金密码 - 验证原资金密码
		if opwd == "" {
			response.Error(c, i18n.T("user.oldCoinPwdEmpty"))
			return
		}
		// 验证旧资金密码
		oldCoinPwdHash := md5Hash(opwd)
		if oldCoinPwdHash != user.CoinPassword {
			response.Error(c, i18n.T("user.oldPwdIncorrect"))
			return
		}
		tishi = i18n.T("user.changeCoinPwdSuccess")
	}

	// 计算新密码哈希
	newPwdHash := md5Hash(npwd)

	// 检查资金密码是否与登录密码相同
	if newPwdHash == user.Password {
		response.Error(c, i18n.T("user.pwdSame"))
		return
	}

	// 更新资金密码
	if err := model.DB.Model(&model.User{}).Where("uid = ?", uid).Update("coinPassword", newPwdHash).Error; err != nil {
		response.Error(c, i18n.T("user.changeCoinPwdFailed"))
		return
	}

	response.Success(c, gin.H{
		"message": tishi,
	})
}

// GuestLoginResponse 游客登录响应
type GuestLoginResponse struct {
	Token     string `json:"token"`
	UID       uint   `json:"uid"`
	Username  string `json:"username"`
	Nickname  string `json:"nickname"`
	Coin      string `json:"coin"`
	TestFlag  int    `json:"testFlag"`
	FanDian   float32 `json:"fanDian"`
}

// GuestLogin 游客登录 - 根据 PHP Api::guestlogindo 逻辑实现
func (h *UserHandler) GuestLogin(c *gin.Context) {
	username := strings.TrimSpace(c.PostForm("username"))
	password := strings.TrimSpace(c.PostForm("password"))

	// 验证用户名密码必须是 !guest!
	if username != "!guest!" || password != "!guest!" {
		response.Error(c, i18n.T("login.invalid_credentials"))
		return
	}

	// 生成游客用户名：guest_ + 时间戳
	currentTime := time.Now().Unix()
	guestUsername := fmt.Sprintf("guest_%d", currentTime)

	// 密码 MD5 加密
	hashedPassword := md5Hash(password)

	// 获取客户端 IP 并转换为整数（类似 PHP 的 ip2long）
	clientIP := c.ClientIP()
	regIPInt := ip2long(clientIP)

	// 使用原生 SQL 插入，避免 GORM 类型转换问题
	insertSQL := `INSERT INTO ssc_guestmembers
		(username, nickname, name, password, coin, fcoin, regIP, regTime, updateTime, testFlag, isDelete, admin, enable, email, qq, phone, conCommStatus, lossCommStatus, care)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), 1, 0, 0, 1, '', '', '', 0, 0, '')`

	if err := model.DB.Exec(insertSQL, guestUsername, guestUsername, guestUsername, hashedPassword, 2000, 0, regIPInt, currentTime).Error; err != nil {
		response.Error(c, i18n.T("register.failed"))
		return
	}

	// 获取刚插入的用户ID
	var guestUID int
	model.DB.Raw("SELECT LAST_INSERT_ID()").Scan(&guestUID)

	// 生成随机 session ID (40字符以内)
	sessionBytes := make([]byte, 16)
	rand.Read(sessionBytes)
	sessionKey := hex.EncodeToString(sessionBytes) // 32字符

	// 创建会话 - loginIP 是 varchar，直接存储字符串
	sessionSQL := `INSERT INTO ssc_member_session (uid, username, session_key, loginTime, accessTime, loginIP, os, browser, isOnLine)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`

	if err := model.DB.Exec(sessionSQL, guestUID, guestUsername, sessionKey, currentTime, currentTime, clientIP, c.GetHeader("sec-ch-ua-platform"), c.GetHeader("sec-ch-ua")).Error; err != nil {
		response.Error(c, i18n.T("login.failed"))
		return
	}

	// 生成 token
	token := md5Hash(guestUsername + password + time.Now().String())

	// 保存 token 到内存
	saveToken(token, guestUID, true)

	// 获取最大返点
	var fanDian float32
	model.DB.Table("ssc_params").Where("name = ?", "fanDianMax").Select("value").Scan(&fanDian)

	response.Success(c, GuestLoginResponse{
		Token:     token,
		UID:       uint(guestUID),
		Username:  guestUsername,
		Nickname:  guestUsername,
		Coin:      "2000.00",
		TestFlag:  1,
		FanDian:   fanDian,
	})
}

// ip2long 将 IP 地址转换为整数（类似 PHP 的 ip2long 函数，返回有符号整数）
func ip2long(ip string) int {
	parts := strings.Split(ip, ".")
	if len(parts) != 4 {
		return 0
	}
	var result uint32
	for i := 0; i < 4; i++ {
		var part uint32
		fmt.Sscanf(parts[i], "%d", &part)
		result = (result << 8) | (part & 0xFF)
	}
	// 转换为有符号整数（与 PHP ip2long 行为一致）
	return int(int32(result))
}
