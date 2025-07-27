import React from 'react';
import { Button, Form, Input, Card, Typography, Space } from 'antd';
import { LockOutlined, MailOutlined, SafetyOutlined } from '@ant-design/icons';
import axios from "@/axios/axios";
import Link from "next/link";
import router from "next/router";

const { Title, Text } = Typography;

const onFinish = (values: any) => {
    axios.post("/users/signup", values)
        .then((res) => {
            if(res.status != 200) {
                alert(res.statusText);
                return
            }
            if(typeof res.data == 'string') {
                alert(res.data);
            } else {
                const msg = res.data?.msg || JSON.stringify(res.data)
                alert(msg);
                if(res.data.code == 0) {
                    router.push('/users/login')
                }
            }

        }).catch((err) => {
            if (err.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                const msg = err.response.data?.msg || err.response.data || "未知错误";
                alert(msg);
            } else if (err.request) {
                // The request was made but no response was received
                alert("网络错误，请稍后再试");
            } else {
                // Something happened in setting up the request that triggered an Error
                alert(err.message);
            }
    })
};

const onFinishFailed = (errorInfo: any) => {
    alert("输入有误")
};

const SignupForm: React.FC = () => (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <Card 
            className="w-full max-w-md shadow-xl rounded-2xl"
            style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)' }}
        >
            <div className="text-center mb-8">
                <Title level={2} className="text-gray-800 mb-2">
                    创建账号
                </Title>
                <Text type="secondary">加入我们，开始您的阅读之旅</Text>
            </div>

            <Form
                name="basic"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                layout="vertical"
                size="large"
            >
                <Form.Item
                    label="邮箱"
                    name="email"
                    rules={[
                        { required: true, message: '请输入邮箱' },
                        { type: 'email', message: '请输入有效的邮箱地址' }
                    ]}
                >
                    <Input 
                        prefix={<MailOutlined className="text-gray-400" />}
                        placeholder="请输入您的邮箱"
                        className="rounded-lg"
                    />
                </Form.Item>

                <Form.Item
                    label="密码"
                    name="password"
                    rules={[
                        { required: true, message: '请输入密码' },
                        { min: 6, message: '密码至少6位字符' }
                    ]}
                >
                    <Input.Password 
                        prefix={<LockOutlined className="text-gray-400" />}
                        placeholder="请输入密码（至少6位）"
                        className="rounded-lg"
                    />
                </Form.Item>

                <Form.Item
                    label="确认密码"
                    name="confirmPassword"
                    dependencies={['password']}
                    rules={[
                        { required: true, message: '请确认密码' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('两次输入的密码不一致'));
                            },
                        }),
                    ]}
                >
                    <Input.Password 
                        prefix={<SafetyOutlined className="text-gray-400" />}
                        placeholder="请再次输入密码"
                        className="rounded-lg"
                    />
                </Form.Item>

                <Form.Item className="mb-6">
                    <Button 
                        type="primary" 
                        htmlType="submit" 
                        className="w-full h-12 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 border-0 hover:from-green-600 hover:to-emerald-700 shadow-lg"
                    >
                        注册
                    </Button>
                </Form.Item>

                <div className="text-center">
                    <Text type="secondary">已有账号？</Text>
                    <Link href="/users/login" className="ml-2 text-green-500 hover:text-green-600 font-medium">
                        立即登录
                    </Link>
                </div>
            </Form>
        </Card>
    </div>
);

export default SignupForm;