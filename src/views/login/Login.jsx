import React from 'react';
import { useHistory } from 'react-router-dom';
import Background from './Background/Background';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, message } from 'antd';
import axios from 'axios';
import './Login.css'

const Login = () => {
  const history = useHistory()
  const onFinish = (values) => {
    //将role一同收集过来,连表
    axios.get(`users?username=${values.username}&password=${values.password}&roleState=true&_expand=role`).then(res => {
      // console.log(res.data);
      //判断res.data是否有数据--res.data.length
      if (res.data.length === 0) {
        message.error({
          content: "您输入密码或用户名有错误!",
        })
      } else {
        // console.log(res.data);
        localStorage.setItem("token", JSON.stringify(res.data[0]))
        message.success({
          content: "正在登陆，请稍后"
        })
        history.push("/")
      }
    })
  };

  return (
    <div className="box">
      <Background />
      <div className='frombox'>
        <div className='title'>***管理系统</div>
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
                message: 'Please input your Username!',
              },
            ]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your Password!',
              },
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="123456"
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
