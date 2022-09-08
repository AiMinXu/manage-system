import React, { useEffect, useState } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom'
import axios from 'axios'

import Home from '../../views/NewsSandBox/Home/Home'
import UserList from '../../views/NewsSandBox/UserManage/UserList'
import RoleList from '../../views/NewsSandBox/RightManage/Role/RoleList';
import RightList from '../../views/NewsSandBox/RightManage/Right/RightList';
import Published from '../../views/NewsSandBox/PublishManage/Published/Published'
import Sunset from '../../views/NewsSandBox/PublishManage/Sunset/Sunset';
import Unpublished from '../../views/NewsSandBox/PublishManage/UnPublished/UnPublished';
import NoPermission from '../../views/NewsSandBox/NoPermission/NoPermission';
import Audit from '../../views/NewsSandBox/AuditManage/Audit/Audit';
import AuditList from '../../views/NewsSandBox/AuditManage/AuditList/AuditList';
import Add from '../../views/NewsSandBox/NewsManage/Add/Add';
import Update from '../../views/NewsSandBox/NewsManage/Update/Update';
import Perview from '../../views/NewsSandBox/NewsManage/Preview/Perview';
import Draft from '../../views/NewsSandBox/NewsManage/Draft/Draft';
import Category from '../../views/NewsSandBox/NewsManage/Category/Category';

//本地路由映射表
const localRouteMap = {
  "/home": Home,
  "/user-manage/list": UserList,
  "/right-manage/role/list": RoleList,
  "/right-manage/right/list": RightList,
  "/publish-manage/published": Published,
  "/publish-manage/sunset": Sunset,
  "/publish-manage/unpublished": Unpublished,
  "/nopermission": NoPermission,
  "/audit-manage/audit": Audit,
  "/audit-manage/list": AuditList,
  "/news-manage/add": Add,
  "/news-manage/draft": Draft,
  "/news-manage/preview": Perview,
  "/news-manage/update": Update,
  "/news-manage/category": Category,
}

const NewsRouter = () => {
  const [routeList, setRouteList] = useState([])//设置路由列表

  useEffect(() => {
    //promiss.all传入数组
    Promise.all([
      axios.get("rights"),
      axios.get("children")
    ]).then(res => {
      // console.log(res);
      setRouteList([...res[0].data, ...res[1].data])
    })
  }, [])
  //判断有无路由权限
  const routeRights = (item) => {
    return localRouteMap[item.key] && (item.pagepermission || item.routepermission)
  }
  const { role: { rights } } = JSON.parse(localStorage.getItem("token"))
  const checkPermisson = (item) => {
    return rights.includes(item.key)//判断是否包含权限
  }
  return (
    <Switch>
      {
        routeList.map(item => {
          if (checkPermisson(item) && routeRights(item)) {
            return <Route path={item.key} component={localRouteMap[item.key]} key={item.key} exact />//路由渲染 严格匹配
          } else {
            return null
          }
        })
      }
      {/* 重定向到home中 */}
      <Redirect from="/" to="/home" exact />
      {
        // 其他路径
        routeList.length > 0 && <Route path="*" component={NoPermission} />
      }
    </Switch>
  );
};

export default NewsRouter;
