package web

import (
	"fmt"
	"net/http"
	"regexp"

	"github.com/gin-gonic/gin"
)

var (
	emailRegexExp = regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`)
)

// 定义和用户有关的路由
type UserHandler struct {
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

	if !emailRegexExp.MatchString(req.Email) {
		ctx.String(http.StatusOK, "邮箱格式错误")
		return
	}

	if req.Password != req.ConfirmPassword {
		ctx.String(http.StatusOK, "两次输入的密码不一致")
		return
	}

	hasLetter, _ := regexp.MatchString(`[A-Za-z]`, req.Password)
	hasDigit, _ := regexp.MatchString(`\d`, req.Password)

	if len(req.Password) < 8 || !hasLetter || !hasDigit {
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
