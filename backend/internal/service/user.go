package service

import (
	"context"

	"github.com/yifaaan/webook/internal/domain"
	"github.com/yifaaan/webook/internal/repository"
)

type UserService struct {
	repo *repository.UserRepository
}

func NewUserService(repo *repository.UserRepository) *UserService {
	return &UserService{repo: repo}
}

func (us *UserService) SignUp(ctx context.Context, user domain.User) error {
	return us.repo.Create(ctx, user)
}
