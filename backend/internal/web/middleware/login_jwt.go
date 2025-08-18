package middleware

import (
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	jwt "github.com/golang-jwt/jwt/v5"
	"github.com/yifaaan/webook/internal/web"
)

type LoginJWTMiddlewareBuilder struct {
	paths []string
}

func NewLoginJWTMiddlewareBuilder() *LoginJWTMiddlewareBuilder {
	return &LoginJWTMiddlewareBuilder{}
}

func (l *LoginJWTMiddlewareBuilder) IgnorePaths(paths ...string) *LoginJWTMiddlewareBuilder {
	l.paths = append(l.paths, paths...)
	return l
}

func (l *LoginJWTMiddlewareBuilder) Build() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		for _, path := range l.paths {
			if ctx.Request.URL.Path == path {
				return
			}
		}

		// 从 Header 中提取 JWT
		authHeader := ctx.GetHeader("Authorization")
		if authHeader == "" {
			ctx.AbortWithStatus(http.StatusUnauthorized)
			return
		}

		// JWT 通常以 "Bearer <token>" 的形式提供
		parts := strings.Split(authHeader, " ")
		if !(len(parts) == 2 && parts[0] == "Bearer") {
			ctx.AbortWithStatus(http.StatusUnauthorized)
			return
		}
		tokenStr := parts[1]
		// 解析和校验 JWT
		claims := &web.UserClaims{}
		token, err := jwt.ParseWithClaims(tokenStr, claims, func(t *jwt.Token) (any, error) {
			return []byte("MasdfjalskdasdflaASDFAadsflkjaADMasdfjalskdasdflaASDFAadsflkjaAD"), nil
		})
		if err != nil || !token.Valid || claims.UserId == 0 {
			ctx.AbortWithStatus(http.StatusUnauthorized)
			return
		}
		// 每10秒刷新一次jwt
		if time.Until(claims.ExpiresAt.Time) < time.Second*50 {
			claims.ExpiresAt = jwt.NewNumericDate(time.Now().Add(time.Minute))
			tokenStr, err = token.SignedString([]byte("MasdfjalskdasdflaASDFAadsflkjaADMasdfjalskdasdflaASDFAadsflkjaAD"))
			if err != nil {
				// log
				log.Println("jwt 重新签名失败", err)
			}
			ctx.Header("x-jwt-token", tokenStr)
		}
		// 将用户信息存储到上下文中
		ctx.Set("claims", claims)
	}
}
