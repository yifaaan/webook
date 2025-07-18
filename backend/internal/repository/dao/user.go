package dao

import (
	"context"
	"time"

	"gorm.io/gorm"
)

// Data access object
type UserDAO struct {
	db *gorm.DB
}

func NewUserDAO(db *gorm.DB) *UserDAO {
	return &UserDAO{db: db}
}

func (dao *UserDAO) Insert(ctx context.Context, user User) error {
	now := time.Now().UnixMilli()
	user.CTime = now
	user.UTime = now
	return dao.db.WithContext(ctx).Create(&user).Error
}

// 对应db表user
type User struct {
	Id       int64  `gorm:"primaryKey,autoIncrement"`
	Email    string `gorm:"unique"`
	Password string
	// 创建时间 ms
	CTime int64
	// 更新时间 ms
	UTime int64
}
