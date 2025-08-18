package web

import (
	"net/http"
	"time"

	regexp "github.com/dlclark/regexp2"
	"github.com/gin-contrib/sessions"
	jwt "github.com/golang-jwt/jwt/v5"
	"github.com/yifaaan/webook/internal/domain"
	"github.com/yifaaan/webook/internal/service"

	"github.com/gin-gonic/gin"
)

// 定义和用户有关的路由
type UserHandler struct {
	svc         *service.UserService
	emailExp    *regexp.Regexp
	passwordExp *regexp.Regexp
}

func NewUserHandler(svc *service.UserService) *UserHandler {
	const (
		emailRegexExp    = `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`
		passwordRegexExp = `^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$`
	)
	emailExp := regexp.MustCompile(emailRegexExp, 0)
	passwordExp := regexp.MustCompile(passwordRegexExp, 0)
	return &UserHandler{svc: svc, emailExp: emailExp, passwordExp: passwordExp}

}

func (u *UserHandler) RegisterRoutes(server *gin.Engine) {
	ug := server.Group("/users")
	ug.POST("/signup", u.SignUp)
	// ug.POST("/login", u.Login)
	ug.POST("/login", u.LoginJWT)
	ug.POST("/edit", u.Edit)
	ug.GET("/profile", u.ProfileJWT)
}

func (u *UserHandler) SignUp(ctx *gin.Context) {
	type SignUpReq struct {
		Email           string `json:"email"`
		ConfirmPassword string `json:"confirmPassword"`
		Password        string `json:"password"`
	}
	var req SignUpReq
	// Bind根据Content-type解析数据到req
	// 解析错了就写回400错误
	if err := ctx.Bind(&req); err != nil {
		return
	}

	isMatch, err := u.emailExp.MatchString(req.Email)
	if err != nil {
		ctx.String(http.StatusOK, "系统错误")
		return
	}
	if !isMatch {
		ctx.String(http.StatusOK, "邮箱格式错误")
		return
	}

	if req.Password != req.ConfirmPassword {
		ctx.String(http.StatusOK, "两次输入的密码不一致")
		return
	}
	isMatch, err = u.passwordExp.MatchString(req.Password)
	if err != nil {
		ctx.String(http.StatusOK, "系统错误")
		return
	}
	if !isMatch {
		ctx.String(http.StatusOK, "密码必须包含数字和字母，且长度不小于8位")
		return
	}

	// 调用svc的方法
	err = u.svc.SignUp(ctx, domain.User{Email: req.Email, Password: req.Password})
	if err == service.ErrEmailDuplicate {
		ctx.String(http.StatusOK, "邮箱冲突")
		return
	}
	if err != nil {
		ctx.String(http.StatusOK, "系统错误")
		return
	}
	ctx.String(http.StatusOK, "注册成功")
}

func (u *UserHandler) Login(ctx *gin.Context) {
	type LoginReq struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	var req LoginReq
	if err := ctx.Bind(&req); err != nil {
		return
	}
	user, err := u.svc.Login(ctx, domain.User{Email: req.Email, Password: req.Password})
	if err == service.ErrInvalidUserOrPassword {
		ctx.String(http.StatusOK, "用户名或密码错误")
		return
	}
	if err != nil {
		ctx.String(http.StatusOK, "系统错误")
		return
	}
	// 登录成功
	// 设置session的内容
	sess := sessions.Default(ctx)
	sess.Options(sessions.Options{
		Path:   "/",
		MaxAge: 60,
	})
	sess.Set("userId", user.Id)
	sess.Save()
	ctx.String(http.StatusOK, "登录成功")
}

func (u *UserHandler) Logout(ctx *gin.Context) {
	sess := sessions.Default(ctx)
	sess.Options(sessions.Options{
		MaxAge: -1,
	})
	sess.Save()
	ctx.String(http.StatusOK, "退出登录成功")
}

type UserClaims struct {
	jwt.RegisteredClaims
	UserId int64
}

func (u *UserHandler) LoginJWT(ctx *gin.Context) {
	type LoginReq struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	var req LoginReq
	if err := ctx.Bind(&req); err != nil {
		return
	}
	user, err := u.svc.Login(ctx, domain.User{Email: req.Email, Password: req.Password})
	if err == service.ErrInvalidUserOrPassword {
		ctx.String(http.StatusOK, "用户名或密码错误")
		return
	}
	if err != nil {
		ctx.String(http.StatusOK, "系统错误")
		return
	}

	claims := UserClaims{
		RegisteredClaims: jwt.RegisteredClaims{
			// 过期时间
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Minute)),
		},
		UserId: user.Id,
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenStr, err := token.SignedString([]byte("MasdfjalskdasdflaASDFAadsflkjaADMasdfjalskdasdflaASDFAadsflkjaAD"))
	if err != nil {
		ctx.String(http.StatusInternalServerError, "系统错误")
		return
	}
	ctx.Header("x-jwt-token", tokenStr)
	ctx.JSON(http.StatusOK, gin.H{
		"code": 0,
		"msg":  "登录成功",
	})
}

func (u *UserHandler) Edit(ctx *gin.Context) {
	type EditReq struct {
		NickName string `json:"nickname"`
		Birthday string `json:"birthday"`
		AboutMe  string `json:"aboutme"`
	}
	var req EditReq
	if err := ctx.Bind(&req); err != nil {
		return
	}
	c, exists := ctx.Get("claims")
	if !exists {
		ctx.AbortWithStatus(http.StatusUnauthorized)
		return
	}
	claims, ok := c.(*UserClaims)
	if !ok {
		ctx.AbortWithStatus(http.StatusUnauthorized)
		return
	}
	err := u.svc.Edit(ctx, domain.User{
		Id:       claims.UserId,
		Nickname: req.NickName,
		Birthday: req.Birthday,
		AboutMe:  req.AboutMe,
	})
	if err != nil {
		ctx.String(http.StatusOK, "系统错误")
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"code": 0,
		"msg":  "编辑成功",
	})
}

func (u *UserHandler) Profile(ctx *gin.Context) {
	// sess := sessions.Default(ctx)
	// userId := sess.Get("userId")
	// if userId == nil {
	// 	ctx.AbortWithStatus(http.StatusUnauthorized)
	// 	return
	// }
	// userIdInt, ok := userId.(int64)
	// if !ok {
	// 	ctx.AbortWithStatus(http.StatusInternalServerError)
	// 	return
	// }
	// ctx.String(http.StatusOK, fmt.Sprintf("userId: %d", userIdInt))
	ctx.String(http.StatusOK, "profile")
}

func (u *UserHandler) ProfileJWT(ctx *gin.Context) {
	// 从JWT中间件设置的上下文中获取用户ID
	c, exists := ctx.Get("claims")
	if !exists {
		ctx.AbortWithStatus(http.StatusUnauthorized)
		return
	}

	claims, ok := c.(*UserClaims)
	if !ok {
		ctx.AbortWithStatus(http.StatusUnauthorized)
		return
	}

	// 这里应该调用service获取用户详细信息，目前先返回简单信息
	// userId 将来用于从数据库查询用户信息
	userId := claims.UserId
	user, err := u.svc.Profile(ctx, userId)
	if err != nil {
		ctx.String(http.StatusOK, "系统错误")
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"Email":    user.Email,
		"Phone":    "", // 暂时返回空字符串，后续可以添加phone字段
		"Nickname": user.Nickname,
		"Birthday": user.Birthday,
		"AboutMe":  user.AboutMe,
	})
}
