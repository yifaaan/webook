package repository

import (
	"context"

	"github.com/yifaaan/webook/internal/domain"
	"github.com/yifaaan/webook/internal/repository/cache"
	"github.com/yifaaan/webook/internal/repository/dao"
)

var (
	ErrEmailDuplicate = dao.ErrEmailDuplicate
	ErrUserNotFound   = dao.ErrUserNotFound
)

type UserRepository struct {
	dao   *dao.UserDAO
	cache *cache.UserCache
}

func NewUserRepository(dao *dao.UserDAO, cache *cache.UserCache) *UserRepository {
	return &UserRepository{dao: dao, cache: cache}
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

	return domain.User{Id: user.Id, Email: user.Email, Password: user.Password}, nil
}

func (up *UserRepository) FindById(ctx context.Context, id int64) (domain.User, error) {
	// cache
	u, err := up.cache.Get(ctx, id)
	if err == nil {
		return u, nil
	}
	if err == cache.ErrKeyNotFound {
		// dao
		user, err := up.dao.FindByID(ctx, id)
		if err != nil {
			return domain.User{}, err
		}
		val := domain.User{
			Id:       user.Id,
			Email:    user.Email,
			Nickname: user.Nickname,
			Birthday: user.Birthday,
			AboutMe:  user.AboutMe,
		}
		err = up.cache.Set(ctx, val)
		if err != nil {
			return domain.User{}, err
		}
		return val, nil
	}
	return domain.User{}, err
}

func (up *UserRepository) Update(ctx context.Context, user domain.User) error {
	return up.dao.Update(ctx, dao.User{
		Id:       user.Id,
		Nickname: user.Nickname,
		Birthday: user.Birthday,
		AboutMe:  user.AboutMe,
	})
}
