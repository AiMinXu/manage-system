import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from "react-redux";
import axios from 'axios';
import { Layout, Menu } from 'antd';
import {
  AuditOutlined,
  BarChartOutlined,
  ForkOutlined,
  HolderOutlined,
  InfoCircleOutlined,
  UserOutlined,
} from '@ant-design/icons';

import './SideMenu.css'
const { Sider } = Layout;


// const items = [
//   {
//     key: '/home',
//     icon: <UserOutlined />,
//     label: '首页',
//     children: [{
//       key: '/home',
//       icon: <UserOutlined />,
//       label: '主页',
//     }]
//   },
//   {
//     key: '/user-manage',
//     icon: <VideoCameraOutlined />,
//     label: '用户管理',
//     children: [{
//       key: '/user-manage/list',
//       icon: <UserOutlined />,
//       label: '用户列表',
//     }, {
//       key: '/right-manager/right/list',
//       icon: <UserOutlined />,
//       label: '角色列表',
//     }]
//   },
//   {
//     key: '/right-manager/role/list',
//     icon: <UploadOutlined />,
//     label: '权限管理',
//   },
// ]
const SideMenu = (props) => {

  // const [collapsed] = useState(false);
  const [menu, setMenu] = useState([])
  //创建iconList图标数据
  const [iconList] = useState({
    "/home": <HolderOutlined />,
    "/user-manage": <UserOutlined />,
    "/right-manage": <ForkOutlined />,
    "/news-manage": <InfoCircleOutlined />,
    "/audit-manage": <AuditOutlined />,
    "/publish-manage": <BarChartOutlined />,
  })
  const { role: { rights } } = JSON.parse(localStorage.getItem("token"))
  const checkPagePermission = (item) => {
    return item.pagepermission && rights.includes(item.key)
  }
  // useCallback(checkPagePermission, [rights])
  useEffect(() => {
    axios.get("rights?_embed=children").then(res => {
      // console.log(res.data);
      let data = res.data
      //将json数据按antd进行修改
      //title转换成"lable"  rightId转换成rightid
      let new_data = JSON.stringify(data).replace(/"title"/g, '"label"').replace(/"rightId"/g, '"rightid"')
      // console.log(new_data);
      data = JSON.parse(new_data)
      // console.log(data);
      data.forEach(item => {
        // 将图标数据添加到item中
        item.icon = iconList[item.key]
        //移除空children节点
        if (item.children.length === 0) delete item["children"]
        //删除无pagepermission的权限节点
        if (item.children !== undefined) {
          for (let i = 0; i < item.children.length; i++) {
            if (item.children[i].pagepermission === undefined || item.children[i].pagepermission === 0 || checkPagePermission(item.children[i]) === false) {
              delete item.children[i]
            }
          }
        }
      })
      //设置data
      setMenu(data)
    })
  }, [iconList])

  const clickHandle = (e) => {
    // console.log(props);
    //拿到点击事件对象的key值
    props.history.push(e.key)
  }
  const checkKeys = props.location.pathname

  return (
    <Sider trigger={null} collapsible collapsed={props.isCollapsed} className='container'>
      <div className="logo">
        <span>|||系统</span>
      </div>
      <div className='menubox'>
        <Menu
          onClick={clickHandle}
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[checkKeys]}
          items={menu}
          defaultOpenKeys={['/' + checkKeys.split('/')[1]]}
        />
      </div>
    </Sider>
  );
};

const mapStateToProps = ({ CollapsedReducer: { isCollapsed } }) => ({
  isCollapsed
})

export default connect(mapStateToProps)(withRouter(SideMenu));
