package tencent

import (
	"context"
	"fmt"

	"github.com/tencentcloud/tencentcloud-sdk-go/tencentcloud/common"
	"github.com/tencentcloud/tencentcloud-sdk-go/tencentcloud/common/errors"
	sms "github.com/tencentcloud/tencentcloud-sdk-go/tencentcloud/sms/v20210111"
)

type Service struct {
	appId     string
	signature string
	client    *sms.Client
}

func NewService(client *sms.Client, appId string, signature string) *Service {
	return &Service{
		appId:     appId,
		signature: signature,
		client:    client,
	}
}

func (s *Service) Send(ctx context.Context, phoneNumbers []string, template string, args []string) error {
	request := sms.NewSendSmsRequest()
	request.SmsSdkAppId = common.StringPtr(s.appId)
	request.SignName = common.StringPtr(s.signature)
	request.TemplateId = common.StringPtr(template)
	if len(phoneNumbers) > 0 {
		request.PhoneNumberSet = common.StringPtrs(phoneNumbers)
	}
	if len(args) > 0 {
		request.TemplateParamSet = common.StringPtrs(args)
	}
	response, err := s.client.SendSmsWithContext(ctx, request)
	// 处理异常
	if _, ok := err.(*errors.TencentCloudSDKError); ok {
		fmt.Printf("An API error has returned: %s", err)
		return err
	}
	// 非SDK异常，直接失败。实际代码中可以加入其他的处理。
	if err != nil {
		return err
	}
	for _, status := range response.Response.SendStatusSet {
		if status.Code == nil || *status.Code != "Ok" {
			return fmt.Errorf("发送短信失败 %s, %s", *status.Code, *status.Message)
		}
	}
	return nil
}
