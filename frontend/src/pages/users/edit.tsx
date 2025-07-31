import React, {useEffect, useState} from 'react';
import {Button, DatePicker, Form, Input} from 'antd';
import axios from "@/axios/axios";
import moment from 'moment';
import router from "next/router";

// 导入Profile类型
type Profile = {
    Email: string
    Phone: string
    Nickname: string
    Birthday: string
    AboutMe: string
}

const { TextArea } = Input;

// 辅助函数：安全地转换生日字符串为moment对象
const getBirthdayMoment = (birthday: string) => {
    if (!birthday || birthday === "") {
        return null;
    }
    const momentObj = moment(birthday, 'YYYY-MM-DD');
    return momentObj.isValid() ? momentObj : null;
};

const onFinish = (values: any) => {
    if (values.birthday) {
        values.birthday = moment(values.birthday).format("YYYY-MM-DD")
    } else {
        values.birthday = ""
    }
    axios.post("/users/edit", values)
        .then((res) => {
            if(res.status != 200) {
                alert(res.statusText);
                return
            }
            if (res.data?.code == 0) {
                router.push('/users/profile')
                return
            }
            alert(res.data?.msg || "系统错误");
        }).catch((err) => {
        alert(err);
    })
};

const onFinishFailed = (errorInfo: any) => {
    alert("输入有误")
};

function EditForm() {
    const [form] = Form.useForm(); // 使用Form实例
    const p: Profile = {} as Profile
    const [data, setData] = useState<Profile>(p)
    const [isLoading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        axios.get('/users/profile')
            .then((res) => {
                return res.data;
            })
            .then((data) => {
                setData(data)
                // 当数据加载完成后，设置表单字段值
                form.setFieldsValue({
                    nickname: data.Nickname,
                    aboutMe: data.AboutMe,
                    birthday: getBirthdayMoment(data.Birthday)
                });
                setLoading(false)
            })
            .catch((error) => {
                console.error('Error fetching profile:', error);
                setLoading(false)
            })
    }, [form])

    if (isLoading) return <div>Loading...</div>
    if (!data) return <div>No profile data</div>
    
    return <Form
        form={form}
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
    >
        <Form.Item
            label="昵称"
            name="nickname"
        >
            <Input />
        </Form.Item>

        <Form.Item
            label="生日"
            name="birthday"
        >
            <DatePicker format={"YYYY-MM-DD"}
                        placeholder={""}/>
        </Form.Item>

        <Form.Item
            label="关于我"
            name="aboutMe"
        >
            <TextArea rows={4}/>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
                提交
            </Button>
        </Form.Item>
    </Form>
}

export default EditForm;