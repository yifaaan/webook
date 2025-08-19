package repository

import (
	"context"
	"log"

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
	// 优先读缓存
	u, err := up.cache.Get(ctx, id)
	if err == nil {
		log.Println("缓存命中", u)
		return u, nil
	}
	// 缓存未命中或崩了，继续读数据库
	if err != cache.ErrKeyNotFound {
		// 缓存崩了，记录日志，降级走DB
		log.Println("缓存读取失败", err)
	}

	user, err := up.dao.FindByID(ctx, id)
	log.Println("数据库命中", user)
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
	// 尝试回填缓存，失败不影响主流程
	if setErr := up.cache.Set(ctx, val); setErr != nil {
		log.Println("缓存设置失败", setErr)
	}
	return val, nil
}

func (up *UserRepository) Update(ctx context.Context, user domain.User) error {
	return up.dao.Update(ctx, dao.User{
		Id:       user.Id,
		Nickname: user.Nickname,
		Birthday: user.Birthday,
		AboutMe:  user.AboutMe,
	})
}
