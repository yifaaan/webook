import React from 'react';
import { Button, Form, Input, Card, Typography, Space, message } from 'antd';
import { LockOutlined, MailOutlined, SafetyOutlined } from '@ant-design/icons';
import axios from "@/axios/axios";
import Link from "next/link";
import router from "next/router";

const { Title, Text } = Typography;

const handleSignup = async (values: any) => {
    try {
        const response = await axios.post("/users/signup", values);
        
        if (response.status !== 200) {
            message.error(response.statusText);
            return;
        }
        
        if (typeof response.data === 'string') {
            message.error(response.data);
        } else {
            const { code, msg } = response.data;
            const displayMessage = msg || JSON.stringify(response.data);
            
            if (code === 0) {
                message.success('注册成功！即将跳转到登录页面');
                setTimeout(() => router.push('/users/login'), 1500);
            } else {
                message.error(displayMessage);
            }
        }
    } catch (error: any) {
        if (error.response) {
            const errorMessage = error.response.data?.msg || error.response.data || "注册失败";
            message.error(errorMessage);
        } else if (error.request) {
            message.error("网络错误，请稍后再试");
        } else {
            message.error(error.message || "注册失败");
        }
        console.error('Signup error:', error);
    }
};

const handleSignupFailed = () => {
    message.warning('请检查输入信息');
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
                name="signupForm"
                onFinish={handleSignup}
                onFinishFailed={handleSignupFailed}
                autoComplete="off"
                layout="vertical"
                size="large"
                className="space-y-1"
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
                        className="rounded-lg h-12"
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
                        className="rounded-lg h-12"
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
                        className="rounded-lg h-12"
                    />
                </Form.Item>

                <Form.Item className="mb-6">
                    <Button 
                        type="primary" 
                        htmlType="submit" 
                        className="w-full h-12 sm:h-14 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 border-0 hover:from-green-600 hover:to-emerald-700 shadow-lg text-base sm:text-lg font-medium"
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