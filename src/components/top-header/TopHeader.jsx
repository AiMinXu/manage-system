import React from 'react';
import { withRouter } from 'react-router-dom'
import { Layout, Menu, Dropdown, Avatar, Button } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined
} from '@ant-design/icons';
import { connect } from 'react-redux'


const { Header } = Layout;
const TopHeader = (props) => {
  // console.log(props);
  // const [collapsed, setCollapsed] = useState(false);

  const users = JSON.parse(localStorage.getItem("token"))
  // console.log(users);
  const logout = () => {
    // localStorage.removeItem("token")
    props.history.replace("/login")

  }
  const changeCollapsed = () => {
    // console.log(props);
    props.changeCollapsed();
    // console.log(props.changeCollapsed());
  }
  const menu = (
    <Menu
      items={[
        {
          label: (<Button type='link' block size='small'>{users.role.roleName}</Button>),
          key: '0',
        },
        {
          type: 'divider',
        },
        {
          label: (<Button type='link' block danger size='small' onClick={logout} >退出登录</Button>),
          key: 'logout',
          danger: true,
        },
      ]}
    />
  );

  return (
    <Header
      className="site-layout-background"
      style={{
        padding: '0 16px',
      }}
    >
      <div className='tiger'>
        {
          props.isCollapsed ? <MenuUnfoldOutlined onClick={changeCollapsed} /> :
            <MenuFoldOutlined onClick={changeCollapsed} />
        }
        <span>首页</span>
      </div>
      <div style={{ float: "right" }}>
        <span>欢迎 <span style={{ color: "#1890ff" }}>{users.username}</span> </span>
        <Dropdown overlay={menu}>
          <Avatar size="large" icon={<UserOutlined />} />
        </Dropdown>
      </div>
    </Header >
  );
};

const mapStateToProps = ({ CollapsedReducer: { isCollapsed } }) => ({
  isCollapsed
})

const mapDispatchToProps = {
  changeCollapsed() {
    return {
      type: "change_collapsed"
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(TopHeader));
