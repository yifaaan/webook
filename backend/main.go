package main

import (
	"strings"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/yifaaan/webook/internal/web"
)

func main() {
	server := gin.Default()

	server.Use(cors.New(cors.Config{
		// AllowOrigins: []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "OPTIONS", "DELETE"},
		AllowHeaders:     []string{"Content-Type", "Authorization"},
		AllowCredentials: true, // 是否允许携带cookie
		AllowOriginFunc: func(origin string) bool {
			return strings.Contains(origin, "localhost") || strings.Contains(origin, "127.0.0.1")
		},
		MaxAge: 12 * time.Hour,
	}))
	u := web.NewUserHandler()
	u.RegisterRoutes(server)

	// REST
	// server.PUT("/user/", func(ctx *gin.Context) {})
	server.Run(":8080")
}
