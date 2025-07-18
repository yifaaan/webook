package main

import (
	"strings"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/yifaaan/webook/internal/repository"
	"github.com/yifaaan/webook/internal/repository/dao"
	"github.com/yifaaan/webook/internal/service"
	"github.com/yifaaan/webook/internal/web"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

func main() {
	db, err := gorm.Open(mysql.Open("root:123456@tcp(localhost:3306)/webook"))
	if err != nil {
		panic(err)
	}
	d := dao.NewUserDAO(db)
	repo := repository.NewUserRepository(d)
	svc := service.NewUserService(repo)

	server := gin.Default()
	// 跨域middleware
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

	u := web.NewUserHandler(svc)
	u.RegisterRoutes(server)

	// REST
	// server.PUT("/user/", func(ctx *gin.Context) {})
	server.Run(":8080")
}
