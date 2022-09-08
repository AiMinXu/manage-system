import React, { useState } from 'react';
import { useHistory } from 'react-router-dom'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined
} from '@ant-design/icons';
import { Layout, Avatar, Button, Menu, Dropdown } from 'antd';
import './TopHeader.css'

const { Header } = Layout;

const TopHeader = () => {
  const [collapsed, setCollapsed] = useState(false);

  const logout = () => {
    history.replace("/login")
  }

  const history = useHistory()
  const user = JSON.parse(localStorage.getItem("token"))
  const menu = (
    <Menu
      items={[
        {
          key: 'roleName',
          label: (<Button type="link" block size='small'>{user.role.roleName}</Button>),
        },
        {
          key: 'logout',
          label: (<Button type="link" block danger size='small' onClick={logout}>退出登录</Button>),
          danger: true
        },
      ]}
    />
  );

  return (
    <Header
      className="site-layout-background"
      style={{ padding: " 0 16px" }}
    >
      {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
        className: 'trigger',
        onClick: () => setCollapsed(!collapsed),
      })}
      <div style={{ float: "right" }}>
        <span >欢迎<span style={{ color: "#1890ff" }}>{user.username}</span></span>
        <Dropdown overlay={menu}>
          <Avatar size="large" icon={<UserOutlined />} />
        </Dropdown>
      </div>
    </Header>
  );
};

export default TopHeader;
