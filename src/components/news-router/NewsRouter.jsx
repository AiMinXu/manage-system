import React, { useEffect, useState } from 'react';
// import 'lodash'
import { Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux'
import { Spin } from 'antd';
import axios from 'axios';

import Home from '../../views/sandbox/home/Home'
import UserList from '../../views/sandbox/userManage/UserList'
import RoleList from '../../views/sandbox/rightManage/RoleList'
import RightList from '../../views/sandbox/rightManage/RightList'
import NoPermission from '../../views/sandbox/noPermission/NoPermission'
import Add from '../../views/sandbox/newsManage/add/Add'
import Draft from '../../views/sandbox/newsManage/draft/Draft'
import Category from '../../views/sandbox/newsManage/category/Category'
import Preview from '../../views/sandbox/newsManage/preview/Preview'
import Update from '../../views/sandbox/newsManage/update/Uptate'
import Audit from '../../views/sandbox/auditManage/Audit'
import AuditList from '../../views/sandbox/auditManage/AuditList'
import Published from '../../views/sandbox/publishManage/Published'
import Unpublished from '../../views/sandbox/publishManage/Unpublished'
import Sunset from '../../views/sandbox/publishManage/Sunset'


//创建本地路由映射表
const LocalRouterMap = {
  // 首页
  "/home": Home,
  // 用户管理
  "/user-manage/list": UserList,
  // 权限管理
  "/right-manage/role/list": RoleList,
  "/right-manage/right/list": RightList,
  // 新闻管理
  "/news-manage/add": Add,
  "/news-manage/draft": Draft,
  "/news-manage/category": Category,
  "/news-manage/preview/:id": Preview,
  "/news-manage/update/:id": Update,
  // 审核管理
  "/audit-manage/audit": Audit,
  "/audit-manage/list": AuditList,
  // 发布管理
  "/publish-manage/unpublished": Unpublished,
  "/publish-manage/published": Published,
  "/publish-manage/sunset": Sunset,
}

const NewsRouter = (props) => {
  const [backRouteList, setBackRouteList] = useState([])

  useEffect(() => {
    //Promise.all等待两个请求数据都rejected时再进行处理
    Promise.all([
      axios.get("rights"),
      axios.get("children")
    ]).then(res => {
      // console.log(res);
      setBackRouteList([...res[0].data, ...res[1].data])
      // console.log([...res[0].data, ...res[1].data]);
    })
  }, [])

  //判断有无路由权限逻辑
  const checkRoute = (item) => {
    return LocalRouterMap[item.key] && (item.pagepermission || item.routepermisson)
  }
  //判断该用户有哪一些权限再创建哪一部分
  const { role: { rights } } = JSON.parse(localStorage.getItem("token"))
  const checkUserPermission = (item) => {
    return rights.includes(item.key)
  }
  return (
    <div>
      <Spin size='large' spinning={props.isLoading}>
        <Switch>
          {
            backRouteList.map(item => {
              if (checkRoute(item) && checkUserPermission(item)) {
                return <Route path={item.key} key={item.key} component={LocalRouterMap[item.key]} exact />
              } else {
                return null
              }
            })
          }
          <Redirect from="/" to="./home" exact />
          {
            // backRouteList的长度大于零时再渲染403页面
            backRouteList.length > 0 && <Route path="*" component={NoPermission} />
          }
        </Switch>
      </Spin>
    </div>
  );
};

const mapToStateProps = ({ LoadingReducer: { isLoading } }) => ({
  isLoading
})

export default connect(mapToStateProps)(NewsRouter);
