package main

import (
	"strings"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/redis"
	"github.com/gin-gonic/gin"
	"github.com/yifaaan/webook/internal/repository"
	"github.com/yifaaan/webook/internal/repository/dao"
	"github.com/yifaaan/webook/internal/service"
	"github.com/yifaaan/webook/internal/web"
	"github.com/yifaaan/webook/internal/web/middleware"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

func main() {
	db := initDB()
	server := initWebServer()
	u := initUser(db)
	u.RegisterRoutes(server)
	server.Run(":8080")
}

func initDB() *gorm.DB {
	// docker
	// db, err := gorm.Open(mysql.Open("root:123456@tcp(localhost:3306)/webook"))
	db, err := gorm.Open(mysql.Open("webook:1119@tcp(47.120.52.37:3306)/webook?charset=utf8mb4&parseTime=True&loc=Local"))
	if err != nil {
		panic(err)
	}
	err = dao.InitTable(db)
	if err != nil {
		panic(err)
	}
	return db
}

func initUser(db *gorm.DB) *web.UserHandler {
	d := dao.NewUserDAO(db)
	repo := repository.NewUserRepository(d)
	svc := service.NewUserService(repo)
	u := web.NewUserHandler(svc)
	return u
}

func initWebServer() *gin.Engine {
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
		ExposeHeaders: []string{"x-jwt-token"},
		MaxAge:        12 * time.Hour,
	}))

	// store := cookie.NewStore([]byte("secret"))
	store, err := redis.NewStore(16, "tcp", "47.120.52.37:6379", "", "1119", []byte("adf"))
	if err != nil {
		panic(err)
	}
	server.Use(sessions.Sessions("ssid", store))

	// 登录校验middleware
	// server.Use(middleware.NewLoginMiddlewareBuilder().IgnorePaths("/users/login", "/users/signup").Build())
	server.Use(middleware.NewLoginJWTMiddlewareBuilder().IgnorePaths("/users/login", "/users/signup").Build())
	return server
}
