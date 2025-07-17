package web

import (
	"fmt"
	"net/http"

	regexp "github.com/dlclark/regexp2"

	"github.com/gin-gonic/gin"
)

// 定义和用户有关的路由
type UserHandler struct {
	emailExp    *regexp.Regexp
	passwordExp *regexp.Regexp
}

func NewUserHandler() *UserHandler {
	const (
		emailRegexExp    = `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`
		passwordRegexExp = `^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$`
	)
	emailExp := regexp.MustCompile(emailRegexExp, 0)
	passwordExp := regexp.MustCompile(passwordRegexExp, 0)
	return &UserHandler{emailExp: emailExp, passwordExp: passwordExp}

}

func (u *UserHandler) RegisterRoutes(server *gin.Engine) {
	ug := server.Group("/users")
	ug.POST("/signup", u.SignUp)
	ug.POST("/login", u.Login)
	ug.POST("/edit", u.Edit)
	ug.GET("/profile", u.Profile)
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

	ctx.String(http.StatusOK, "注册成功")
	fmt.Printf("%v", req)

	// 数据库操作
}

func (u *UserHandler) Login(ctx *gin.Context) {

}

func (u *UserHandler) Edit(ctx *gin.Context) {

}

func (u *UserHandler) Profile(ctx *gin.Context) {

}
