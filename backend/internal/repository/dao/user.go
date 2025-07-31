package dao

import (
	"context"
	"errors"
	"time"

	"github.com/go-sql-driver/mysql"
	"gorm.io/gorm"
)

var (
	ErrEmailDuplicate = errors.New("邮箱冲突")
	ErrUserNotFound   = gorm.ErrRecordNotFound
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
	err := dao.db.WithContext(ctx).Create(&user).Error
	if mysqlErr, ok := err.(*mysql.MySQLError); ok {
		const uniqueConflictsErrNo uint16 = 1062
		if mysqlErr.Number == uniqueConflictsErrNo {
			return ErrEmailDuplicate
		}
	}
	return err
}

func (dao *UserDAO) FindByEmail(ctx context.Context, email string) (User, error) {
	var user User
	err := dao.db.WithContext(ctx).Where("email = ?", email).First(&user).Error
	return user, err
}

func (dao *UserDAO) FindByID(ctx context.Context, userId int64) (User, error) {
	var user User
	err := dao.db.WithContext(ctx).Where("id = ?", userId).First(&user).Error
	return user, err
}

func (dao *UserDAO) Update(ctx context.Context, user User) error {
	return dao.db.WithContext(ctx).Model(&User{}).Where("id = ?", user.Id).Updates(user).Error
}

// 对应db表user
type User struct {
	Id       int64  `gorm:"primaryKey,autoIncrement"`
	Email    string `gorm:"unique"`
	Password string
	// 创建时间 ms
	CTime int64
	// 更新时间 ms
	UTime    int64
	Nickname string
	Birthday string `gorm:"type:varchar(10)"`
	AboutMe  string
}
