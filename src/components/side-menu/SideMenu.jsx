import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom'
import {
  AuditOutlined,
  BarChartOutlined,
  ForkOutlined,
  HolderOutlined,
  InfoCircleOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Menu, Layout } from 'antd';
import './SideMenu.css'
import axios from 'axios';
const { Sider } = Layout;


const SideMenu = () => {
  const [menu, setMenu] = useState([])//侧边栏数据


  useEffect(() => {
    const iconList = {
      "/home": <ForkOutlined />,
      "/user-manage": <UserOutlined />,
      "/right-manage": <BarChartOutlined />,
      "/news-manage": <HolderOutlined />,
      "/audit-manage": <AuditOutlined />,
      "/publish-manage": <InfoCircleOutlined />,
    }
    const { role: { rights } } = JSON.parse(localStorage.getItem("token"))
    const checkpermission = (item) => {
      return item.pagepermission && rights.includes(item.key)//判断当前用户是否有权限
    }
    axios.get(`rights?_embed=children`).then(res => {
      let data = res.data
      let newdata = JSON.stringify(data).replace(/"title"/g, '"label"').replace(/"rightId"/g, '"rightid"')//替换label和rightid
      data = JSON.parse(newdata)
      data.forEach(item => {
        item.icon = iconList[item.key]//设置icon
        if (item.children.length === 0) {
          delete item["children"]//清除children为空的用户
        }
        if (item.children !== undefined) {//再次清除，不符合要求的children（无pagepermission，pagepermission===0，用户自身不含有该权限）
          for (let i = 0; i < item.children.length; i++) {
            if (item.children[i].pagepermission === undefined || item.children[i].pagepermission === 0 || checkpermission(item) === false) {
              delete item.children[i]
            }
          }
        }
      })
      // console.log(data);
      setMenu(data)
    })
  }, [])

  const history = useHistory()
  const location = useLocation()
  const clickHandle = (event) => {
    history.push(event.key)//跳转到对应的页面
  }
  return (
    <Sider trigger={null} collapsible className="sideContainer">
      <div className="logo">
        <span>***管理系统</span>
      </div>
      <div className='menu'>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={location.pathname}//默认选择项
          items={menu}
          onClick={clickHandle}
          defaultOpenKeys={["/" + location.pathname.split("/")[1]]}
        />
      </div>
    </Sider>
  );
};

export default SideMenu;
