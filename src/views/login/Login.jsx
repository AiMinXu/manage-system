import React from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, message } from 'antd';
import './Login.css'
import Background from './particles/Background';
import axios from 'axios';

const Login = (props) => {
  //点击登录（缺陷明显）
  const onFinish = (values) => {
    // console.log(values);
    axios.get(`users?username=${values.username}&password=${values.password}&roleState=true&_expand=role`).then(res => {
      // console.log(res.data);
      if (res.data.length === 0) {
        message.error({
          content: "用户名或密码错误",
        })
      } else {
        localStorage.setItem("token", JSON.stringify(res.data[0]))
        message.success({
          content: "登录成功！",
        })
        setTimeout(() => {
          props.history.push("/")
        }, 1000);
      }
    })//查数据此处用get请求代替,同时需要关联role(_expand)
  };
  return (
    <div className='login'>
      <Background />
      <div className='formBox'>
        <div className='title'>XXXX管理系统</div>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: '请输入您的用户名!',
              },
            ]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="用户名" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: '请输入您的密码!',
              },
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="密码"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
