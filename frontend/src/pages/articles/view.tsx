import React, {useState, useEffect} from 'react';
import axios, {Result} from "@/axios/axios";
import {Button, Modal, QRCode, Typography, Card, Space, Divider, Avatar, Spin, Empty} from "antd";
import {ProLayout} from "@ant-design/pro-components";
import {EyeOutlined, LikeOutlined, MoneyCollectOutlined, StarOutlined, BookOutlined, UserOutlined} from "@ant-design/icons";
import {useSearchParams} from "next/navigation";

const { Title, Text, Paragraph } = Typography;

export const dynamic = 'force-dynamic'

interface CodeURL {
    codeURL: string
    rid: number
}


function Page(){
    const [data, setData] = useState<Article>()
    const [openQRCode, setOpenQRCode] = useState(false)
    const [codeURL, setCodeURL] = useState('')
    const [isLoading, setLoading] = useState(false)
    const params = useSearchParams()
    // const router = useRouter()
    // const artID = router.query.id
    const artID = params?.get('id') || '1'
    useEffect(() => {
        setLoading(true)
        axios.get('/articles/pub/'+artID)
            .then((res) => res.data)
            .then((data) => {
                setData(data.data)
                setLoading(false)
            })
    }, [artID])

    if (isLoading) return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 flex items-center justify-center">
            <Card className="text-center p-8 shadow-xl rounded-2xl">
                <Spin size="large" />
                <div className="mt-4">
                    <Text className="text-lg">加载中...</Text>
                </div>
            </Card>
        </div>
    )
    
    if (!data) return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 flex items-center justify-center">
            <Card className="text-center p-8 shadow-xl rounded-2xl">
                <Empty description="文章不存在或已被删除" />
            </Card>
        </div>
    )

    const like = () => {
        axios.post('/articles/pub/like', {
            id: parseInt(artID),
            like: !data.liked
        })
            .then((res) => res.data)
            .then((res) => {
                if(res.code == 0) {
                    if (data.liked) {
                        data.likeCnt --
                    } else {
                        data.likeCnt ++
                    }
                    data.liked = !data.liked
                    setData(Object.assign({}, data))
                }
            })
    }

    const collect = () => {
        if (data.collected) {
            return
        }
        axios.post('/articles/pub/collect', {
            id: parseInt(artID),
            // 你可以加上增删改查收藏夹的功能，在这里传入收藏夹 ID
            cid: 0,
        })
            .then((res) => res.data)
            .then((res) => {
                if(res.code == 0) {
                    data.collectCnt ++
                    data.collected = !data.collected
                    setData(Object.assign({}, data))
                }
            })
    }
    let rid = 0
    const reward = function () {
        axios.post<Result<CodeURL>>('/articles/pub/reward', {
            id: parseInt(artID),
            // 固定一分钱
            amt: 1,
        })
            .then((res) => res.data)
            .then((res) => {
                setCodeURL(res.data.codeURL)
                rid = res.data.rid
                setOpenQRCode(true)
            })
    }

    const closeModal = () => {
        setOpenQRCode(false)
        if(rid > 0) {
            axios.post<Result<string>>('/reward/detail', {
                rid: rid,
            }).then((res) => res.data)
                .then((res) => {
                    // 成功了
                    if(res.data == 'RewardStatusPayed') {
                        alert("打赏成功")
                    } else {
                        console.log(res.data)
                    }
                })
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100">
            <ProLayout 
                pure={true}
                logo={<BookOutlined className="text-orange-600" />}
                contentStyle={{
                    background: 'transparent',
                    padding: '16px sm:24px'
                }}
            >
                <div className="max-w-4xl mx-auto px-4 sm:px-0">
                    <Card 
                        className="shadow-xl rounded-2xl overflow-hidden mb-4 sm:mb-6"
                        style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)' }}
                    >
                        {/* 文章头部 */}
                        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 sm:p-8 -m-4 sm:-m-6 mb-6 sm:mb-8">
                            <Title level={1} className="text-white mb-3 sm:mb-4 leading-tight text-xl sm:text-2xl lg:text-3xl">
                                {data.title}
                            </Title>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                                <Space size="large" className="flex-wrap">
                                    <div className="flex items-center">
                                        <Avatar 
                                            size={40} 
                                            icon={<UserOutlined />} 
                                            className="bg-white/20 border-2 border-white/30 mr-3"
                                        />
                                        <div>
                                            <Text className="text-white font-medium block text-sm sm:text-base">作者</Text>
                                            <div className="text-white/80 text-xs sm:text-sm">发布时间</div>
                                        </div>
                                    </div>
                                </Space>
                                <Space>
                                    <div className="flex items-center text-white/80">
                                        <EyeOutlined className="mr-1" />
                                        <span className="text-sm sm:text-base">{data.readCnt}</span>
                                    </div>
                                </Space>
                            </div>
                        </div>

                        {/* 文章内容 */}
                        <div className="prose prose-sm sm:prose-lg max-w-none px-2 sm:px-0">
                            <div 
                                className="text-gray-700 leading-relaxed text-sm sm:text-base"
                                dangerouslySetInnerHTML={{__html: data.content}}
                            />
                        </div>
                    </Card>

                    {/* 互动按钮 */}
                    <Card 
                        className="shadow-lg rounded-2xl"
                        style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)' }}
                    >
                        <div className="text-center">
                            <Text type="secondary" className="block mb-4 text-sm sm:text-base">
                                喜欢这篇文章吗？支持一下作者吧
                            </Text>
                            <div className="flex flex-col sm:flex-row sm:justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                                <Button 
                                    onClick={like} 
                                    icon={<LikeOutlined style={data.liked ? {color: "#ff4d4f"} : {}} />}
                                    className={`h-10 sm:h-12 px-4 sm:px-6 rounded-lg border-2 hover:shadow-lg transition-all text-sm sm:text-base ${
                                        data.liked 
                                            ? 'border-red-300 text-red-600 bg-red-50' 
                                            : 'border-gray-300 hover:border-red-300 hover:text-red-600'
                                    }`}
                                >
                                    <span className="ml-1 sm:ml-2 font-medium">{data.likeCnt}</span>
                                </Button>

                                <Button 
                                    onClick={collect} 
                                    icon={<StarOutlined style={data.collected ? {color: "#faad14"} : {}} />}
                                    className={`h-10 sm:h-12 px-4 sm:px-6 rounded-lg border-2 hover:shadow-lg transition-all text-sm sm:text-base ${
                                        data.collected 
                                            ? 'border-yellow-300 text-yellow-600 bg-yellow-50' 
                                            : 'border-gray-300 hover:border-yellow-300 hover:text-yellow-600'
                                    }`}
                                    disabled={data.collected}
                                >
                                    <span className="ml-1 sm:ml-2 font-medium">{data.collectCnt}</span>
                                </Button>

                                <Button 
                                    onClick={reward} 
                                    icon={<MoneyCollectOutlined />}
                                    className="h-10 sm:h-12 px-4 sm:px-6 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 border-0 text-white hover:from-orange-600 hover:to-red-600 shadow-lg text-sm sm:text-base"
                                >
                                    打赏作者
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* 二维码弹窗 */}
                <Modal 
                    title={
                        <div className="text-center">
                            <MoneyCollectOutlined className="text-orange-500 mr-2" />
                            <span>扫描二维码打赏</span>
                        </div>
                    } 
                    open={openQRCode} 
                    onCancel={closeModal} 
                    onOk={closeModal}
                    footer={null}
                    centered
                    className="text-center"
                    width="90%"
                    style={{ maxWidth: '400px' }}
                >
                    <div className="py-4">
                        <QRCode value={codeURL} size={window.innerWidth < 640 ? 150 : 200} className="mx-auto" />
                        <Text type="secondary" className="block mt-4 text-sm sm:text-base">
                            感谢您的支持
                        </Text>
                    </div>
                </Modal>
            </ProLayout>
        </div>
    )
}

export default Page