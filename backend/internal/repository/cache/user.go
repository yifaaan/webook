package cache

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/redis/go-redis/v9"
	"github.com/yifaaan/webook/internal/domain"
)

var ErrKeyNotFound = redis.Nil

type UserCache struct {
	client redis.Cmdable
	expire time.Duration
}

func NewUserCache(client redis.Cmdable) *UserCache {
	return &UserCache{client: client, expire: time.Minute * 10}
}

func (uc *UserCache) Get(ctx context.Context, id int64) (domain.User, error) {
	var u domain.User
	val, err := uc.client.Get(ctx, uc.Key(id)).Result()
	if err != nil {
		if err == redis.Nil {
			return domain.User{}, ErrKeyNotFound
		}
		return domain.User{}, err
	}
	err = json.Unmarshal([]byte(val), &u)
	if err != nil {
		return domain.User{}, err
	}
	return u, nil
}

func (uc *UserCache) Set(ctx context.Context, u domain.User) error {
	bs, err := json.Marshal(u)
	if err != nil {
		return err
	}

	return uc.client.Set(ctx, uc.Key(u.Id), bs, uc.expire).Err()
}

func (uc *UserCache) Key(id int64) string {
	const prefix = "user:info:%d"
	return fmt.Sprintf(prefix, id)
}
