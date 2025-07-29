package middleware

import (
	"net/http"
	"time"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
)

type LoginMiddlewareBuilder struct {
	paths []string
}

func NewLoginMiddlewareBuilder() *LoginMiddlewareBuilder {
	return &LoginMiddlewareBuilder{}
}

func (l *LoginMiddlewareBuilder) IgnorePaths(paths ...string) *LoginMiddlewareBuilder {
	l.paths = append(l.paths, paths...)
	return l
}

func (l *LoginMiddlewareBuilder) Build() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		for _, path := range l.paths {
			if ctx.Request.URL.Path == path {
				return
			}
		}
		sess := sessions.Default(ctx)
		sess.Options(sessions.Options{
			Path:   "/",
			MaxAge: 60,
		})
		userId := sess.Get("userId")
		if userId == nil {
			ctx.AbortWithStatus(http.StatusUnauthorized)
			return
		}

		// 登录的刷新时间
		updataTime := sess.Get("update_time")
		now := time.Now().UnixMilli()
		// 第一次登录后的第一个请求，还没刷新过
		if updataTime == nil {
			sess.Set("update_time", now)
			sess.Save()
			return
		}
		updateTime, ok := updataTime.(int64)
		if !ok {
			ctx.AbortWithStatus(http.StatusInternalServerError)
			return
		}
		// 每30秒刷新一次
		if now-updateTime > 1000*30 {
			sess.Set("update_time", now)
			sess.Save()
		}
	}
}
