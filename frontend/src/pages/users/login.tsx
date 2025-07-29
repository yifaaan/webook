import React from 'react';
import { Button, Form, Input, Card, Typography, Space, Divider, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, MobileOutlined, WechatOutlined } from '@ant-design/icons';
import axios from "@/axios/axios";
import Link from "next/link";
import router from "next/router";

const { Title, Text } = Typography;

const handleLogin = async (values: any) => {
    try {
        const response = await axios.post("/users/login", values);
        
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
                message.success('登录成功！');
                router.push('/articles/list');
            } else {
                message.error(displayMessage);
            }
        }
    } catch (error) {
        message.error('登录失败，请稍后重试');
        console.error('Login error:', error);
    }
};

const handleLoginFailed = () => {
    message.warning('请检查输入信息');
};

const LoginForm: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <Card 
                className="w-full max-w-md sm:max-w-lg shadow-xl rounded-2xl"
                style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)' }}
            >
                <div className="text-center mb-6 sm:mb-8">
                    <Title level={2} className="text-gray-800 mb-2 text-xl sm:text-2xl">
                        欢迎回来
                    </Title>
                    <Text type="secondary" className="text-sm sm:text-base">登录您的账号继续使用</Text>
                </div>

                <Form
                    name="loginForm"
                    onFinish={handleLogin}
                    onFinishFailed={handleLoginFailed}
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
                        rules={[{ required: true, message: '请输入密码' }]}
                    >
                        <Input.Password 
                            prefix={<LockOutlined className="text-gray-400" />}
                            placeholder="请输入您的密码"
                            className="rounded-lg h-12"
                        />
                    </Form.Item>

                    <Form.Item className="mb-6">
                        <Button 
                            type="primary" 
                            htmlType="submit" 
                            className="w-full h-12 sm:h-14 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 border-0 hover:from-blue-600 hover:to-indigo-700 shadow-lg text-base sm:text-lg font-medium"
                        >
                            登录
                        </Button>
                    </Form.Item>

                    <Divider className="my-6">或</Divider>

                    <Space direction="vertical" className="w-full" size="middle">
                        <Link href="/users/login_sms" className="block">
                            <Button 
                                icon={<MobileOutlined />} 
                                className="w-full h-10 sm:h-12 rounded-lg border-2 hover:border-blue-400 hover:text-blue-500 text-sm sm:text-base interactive-element"
                            >
                                手机号登录
                            </Button>
                        </Link>
                        
                        <Link href="/users/login_wechat" className="block">
                            <Button 
                                icon={<WechatOutlined />} 
                                className="w-full h-10 sm:h-12 rounded-lg border-2 hover:border-green-400 hover:text-green-500 text-sm sm:text-base interactive-element"
                            >
                                微信扫码登录
                            </Button>
                        </Link>
                    </Space>

                    <div className="text-center mt-6 sm:mt-8">
                        <Text type="secondary" className="text-sm sm:text-base">还没有账号？</Text>
                        <Link href="/users/signup" className="ml-2 text-blue-500 hover:text-blue-600 font-medium text-sm sm:text-base">
                            立即注册
                        </Link>
                    </div>
                </Form>
            </Card>
        </div>
    )
};

export default LoginForm;