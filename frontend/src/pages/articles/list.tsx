'use client';
import {EditOutlined, BookOutlined, PlusOutlined} from '@ant-design/icons';
import {ProLayout, ProList} from '@ant-design/pro-components';
import {Button, Tag, Card, Typography, Space} from 'antd';
import React, {useEffect, useState} from 'react';
import axios from "@/axios/axios";
import router from "next/router";

const { Title, Text } = Typography;

const IconText = ({ icon, text, onClick }: { icon: any; text: string, onClick: any}) => (
    <Button 
        onClick={onClick} 
        type="default"
        className="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 rounded-lg"
    >
        {React.createElement(icon, { style: { marginInlineEnd: 8 } })}
        {text}
    </Button>
);

interface ArticleItem {
    id: bigint
    title: string
    status: number
    abstract: string
}

const ArticleList = () => {
    const [data, setData] = useState<Array<ArticleItem>>([])
    const [loading, setLoading] = useState<boolean>()
    useEffect(() => {
        setLoading(true)
        axios.post('/articles/list', {
            "offset": 0,
            "limit": 100,
        }).then((res) => res.data)
            .then((data) => {
                setData(data.data)
                setLoading(false)
            })
    }, [])
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100">
            <ProLayout 
                title="创作中心"
                logo={<BookOutlined className="text-blue-600" />}
                navTheme="light"
                headerTheme="light"
                contentStyle={{
                    background: 'transparent',
                    padding: '24px'
                }}
            >
                <Card 
                    className="shadow-lg rounded-2xl"
                    style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)' }}
                >
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <Title level={2} className="mb-2 text-gray-800">
                                我的文章
                            </Title>
                            <Text type="secondary" className="text-base">
                                管理您的创作内容
                            </Text>
                        </div>
                        <Button 
                            type="primary" 
                            icon={<PlusOutlined />}
                            href="/articles/edit"
                            size="large"
                            className="bg-gradient-to-r from-blue-500 to-cyan-600 border-0 rounded-lg hover:from-blue-600 hover:to-cyan-700 shadow-lg h-12 px-8"
                        >
                            开始创作
                        </Button>
                    </div>

                    <ProList<ArticleItem>
                        itemLayout="vertical"
                        rowKey="id"
                        loading={loading}
                        dataSource={data}
                        grid={{ gutter: 16, column: 1 }}
                        renderItem={(item) => (
                            <Card
                                className="mb-4 hover:shadow-lg transition-all duration-300 rounded-xl border-0"
                                style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)' }}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <Title level={4} className="mb-3 text-gray-800 hover:text-blue-600 cursor-pointer">
                                            {item.title}
                                        </Title>
                                        
                                        <div className="mb-3">
                                            {item.status === 1 && (
                                                <Tag color="processing" className="rounded-full px-3 py-1">
                                                    未发表
                                                </Tag>
                                            )}
                                            {item.status === 2 && (
                                                <Tag color="success" className="rounded-full px-3 py-1">
                                                    已发表
                                                </Tag>
                                            )}
                                            {item.status === 3 && (
                                                <Tag color="warning" className="rounded-full px-3 py-1">
                                                    仅自己可见
                                                </Tag>
                                            )}
                                        </div>

                                        <div 
                                            className="text-gray-600 leading-relaxed mb-4"
                                            dangerouslySetInnerHTML={{__html: item.abstract}}
                                        />

                                        <Space>
                                            <IconText
                                                icon={EditOutlined}
                                                text="编辑"
                                                onClick={() => {
                                                    router.push("/articles/edit?id=" + item.id.toString())
                                                }}
                                            />
                                        </Space>
                                    </div>
                                </div>
                            </Card>
                        )}
                        locale={{
                            emptyText: (
                                <div className="text-center py-12">
                                    <BookOutlined className="text-6xl text-gray-300 mb-4" />
                                    <Title level={4} type="secondary">
                                        还没有文章
                                    </Title>
                                    <Text type="secondary">
                                        开始您的第一篇创作吧
                                    </Text>
                                </div>
                            )
                        }}
                    />
                </Card>
            </ProLayout>
        </div>
    );
};

export default ArticleList;
