package repository

import (
	"context"

	"github.com/yifaaan/webook/internal/domain"
	"github.com/yifaaan/webook/internal/repository/dao"
)

var (
	ErrEmailDuplicate = dao.ErrEmailDuplicate
	ErrUserNotFound   = dao.ErrUserNotFound
)

type UserRepository struct {
	dao *dao.UserDAO
}

func NewUserRepository(dao *dao.UserDAO) *UserRepository {
	return &UserRepository{dao: dao}
}

func (up *UserRepository) Create(ctx context.Context, user domain.User) error {
	return up.dao.Insert(ctx, dao.User{
		Email:    user.Email,
		Password: user.Password,
	})
}

func (up *UserRepository) FindByEmail(ctx context.Context, email string) (domain.User, error) {
	user, err := up.dao.FindByEmail(ctx, email)
	if err != nil {
		return domain.User{}, err
	}

	return domain.User{Email: user.Email, Password: user.Password}, nil
}

func (up *UserRepository) FindById(int64) {
	// cache
	// dao
}
