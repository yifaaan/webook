package service

import (
	"context"
	"errors"

	"github.com/yifaaan/webook/internal/domain"
	"github.com/yifaaan/webook/internal/repository"
	"golang.org/x/crypto/bcrypt"
)

var (
	ErrEmailDuplicate        = repository.ErrEmailDuplicate
	ErrInvalidUserOrPassword = errors.New("邮箱或密码错误")
)

type UserService struct {
	repo *repository.UserRepository
}

func NewUserService(repo *repository.UserRepository) *UserService {
	return &UserService{repo: repo}
}

func (us *UserService) SignUp(ctx context.Context, user domain.User) error {
	hash, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	user.Password = string(hash)
	return us.repo.Create(ctx, user)
}

func (us *UserService) Login(ctx context.Context, user domain.User) error {
	u, err := us.repo.FindByEmail(ctx, user.Email)
	if err == repository.ErrUserNotFound {
		return ErrInvalidUserOrPassword
	}
	if err != nil {
		return err
	}
	// 比较密码
	err = bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(user.Password))
	if err != nil {
		return ErrInvalidUserOrPassword
	}
	return nil
}
