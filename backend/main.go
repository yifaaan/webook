package main

import (
	"github.com/gin-gonic/gin"
	"github.com/yifaaan/webook/internal/web"
)

func main() {
	server := gin.Default()

	u := &web.UserHandler{}
	u.RegisterRoutes(server)

	// REST
	// server.PUT("/user/", func(ctx *gin.Context) {})
	server.Run(":8080")
}
