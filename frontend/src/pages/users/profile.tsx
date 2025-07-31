import { ProDescriptions } from '@ant-design/pro-components';
import React, { useState, useEffect } from 'react';
import { Button, Card, Typography, Avatar, Space, Spin, Empty } from 'antd';
import { UserOutlined, EditOutlined, MailOutlined, PhoneOutlined, CalendarOutlined, InfoCircleOutlined } from '@ant-design/icons';
import axios from "@/axios/axios";

const { Title, Text } = Typography;

function Page() {
    let p: Profile = {Email: "", Phone: "", Nickname: "", Birthday:"", AboutMe: ""}
    const [data, setData] = useState<Profile>(p)
    const [isLoading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        axios.get('/users/profile')
            .then((res) => res.data)
            .then((data) => {
                setData(data)
                setLoading(false)
            })
    }, [])

    if (isLoading) return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center">
            <Card className="text-center p-8 shadow-xl rounded-2xl">
                <Spin size="large" />
                <div className="mt-4">
                    <Text className="text-lg">加载中...</Text>
                </div>
            </Card>
        </div>
    )
    
    if (!data) return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center">
            <Card className="text-center p-8 shadow-xl rounded-2xl">
                <Empty description="暂无个人资料数据" />
            </Card>
        </div>
    )

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-6">
            <div className="max-w-4xl mx-auto">
                <Card 
                    className="shadow-xl rounded-2xl overflow-hidden"
                    style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)' }}
                >
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-8 -m-6 mb-8">
                        <div className="flex items-center space-x-6">
                            <Avatar 
                                size={80} 
                                icon={<UserOutlined />} 
                                className="bg-white/20 border-4 border-white/30"
                            />
                            <div>
                                <Title level={2} className="text-white mb-2">
                                    {data.Nickname || '未设置昵称'}
                                </Title>
                                <Text className="text-white/80 text-lg">
                                    {data.Email}
                                </Text>
                            </div>
                        </div>
                    </div>

                    <ProDescriptions
                        column={1}
                        title={
                            <Space>
                                <InfoCircleOutlined className="text-purple-500" />
                                <span>个人信息</span>
                            </Space>
                        }
                        extra={
                            <Button 
                                type="primary" 
                                icon={<EditOutlined />}
                                href="/users/edit"
                                className="bg-gradient-to-r from-purple-500 to-pink-500 border-0 rounded-lg hover:from-purple-600 hover:to-pink-600"
                            >
                                编辑资料
                            </Button>
                        }
                        className="mt-6"
                    >
                        <ProDescriptions.Item 
                            label={
                                <Space>
                                    <UserOutlined className="text-gray-500" />
                                    <span>昵称</span>
                                </Space>
                            } 
                            valueType="text"
                        >
                            <Text strong className="text-lg">
                                {data.Nickname || <Text type="secondary">未设置</Text>}
                            </Text>
                        </ProDescriptions.Item>

                        <ProDescriptions.Item
                            label={
                                <Space>
                                    <MailOutlined className="text-gray-500" />
                                    <span>邮箱</span>
                                </Space>
                            }
                            valueType="text"
                        >
                            <Text strong className="text-lg">
                                {data.Email || <Text type="secondary">未设置</Text>}
                            </Text>
                        </ProDescriptions.Item>

                        <ProDescriptions.Item
                            label={
                                <Space>
                                    <PhoneOutlined className="text-gray-500" />
                                    <span>手机</span>
                                </Space>
                            }
                            valueType="text"
                        >
                            <Text strong className="text-lg">
                                {data.Phone || <Text type="secondary">未设置</Text>}
                            </Text>
                        </ProDescriptions.Item>

                        <ProDescriptions.Item 
                            label={
                                <Space>
                                    <CalendarOutlined className="text-gray-500" />
                                    <span>生日</span>
                                </Space>
                            } 
                            valueType="text"
                        >
                            <Text strong className="text-lg">
                                {data.Birthday || <Text type="secondary">未设置</Text>}
                            </Text>
                        </ProDescriptions.Item>

                        <ProDescriptions.Item
                            label={
                                <Space>
                                    <InfoCircleOutlined className="text-gray-500" />
                                    <span>关于我</span>
                                </Space>
                            }
                            valueType="text"
                        >
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <Text className="text-base leading-relaxed">
                                    {data.AboutMe || <Text type="secondary">这个人很懒，什么都没有留下</Text>}
                                </Text>
                            </div>
                        </ProDescriptions.Item>
                    </ProDescriptions>
                </Card>
            </div>
        </div>
    )
}

export default Page