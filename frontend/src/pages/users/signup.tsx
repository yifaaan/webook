import React from 'react';
import { Button, Form, Input } from 'antd';
import axios from "@/axios/axios";
import Link from "next/link";
import router from "next/router";

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
    <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
    >
        <Form.Item
            label="邮箱"
            name="email"
            rules={[{ required: true, message: '请输入邮箱' }]}
        >
            <Input />
        </Form.Item>

        <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
        >
            <Input.Password />
        </Form.Item>

        <Form.Item
            label="确认密码"
            name="confirmPassword"
            rules={[{ required: true, message: '请确认密码' }]}
        >
            <Input.Password />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
                注册
            </Button>
            <Link href={"/users/login"}>&nbsp;登录</Link>
        </Form.Item>
    </Form>
);

export default SignupForm;