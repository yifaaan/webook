package web

import "github.com/gin-gonic/gin"

// 定义和用户有关的路由
type UserHandler struct {
}

func (u *UserHandler) RegisterRoutes(server *gin.Engine) {
	ug := server.Group("/users")
	ug.POST("/sigup", u.Sigup)
	ug.POST("/login", u.Login)
	ug.POST("/edit", u.Edit)
	ug.GET("/profile", u.Profile)
}

func (u *UserHandler) Sigup(ctx *gin.Context) {

}

func (u *UserHandler) Login(ctx *gin.Context) {

}

func (u *UserHandler) Edit(ctx *gin.Context) {

}

func (u *UserHandler) Profile(ctx *gin.Context) {

}
