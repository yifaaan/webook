package repository

import (
	"context"

	"github.com/yifaaan/webook/internal/domain"
	"github.com/yifaaan/webook/internal/repository/dao"
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

func (up *UserRepository) FindById(int64) {
	// cache
	// dao
}
