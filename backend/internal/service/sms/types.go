package sms

import "context"

type Service interface {
	Send(ctx context.Context, phoneNumbers []string, template string, args []string) error
}
