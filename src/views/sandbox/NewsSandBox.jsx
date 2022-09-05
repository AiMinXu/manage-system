import React, { useEffect } from 'react';
import SideMenu from '../../components/side-menu/SideMenu'
import TopHeader from '../../components/top-header/TopHeader'
import NewsRouter from '../../components/news-router/NewsRouter';
import { Layout } from 'antd';
import NProgress from 'nprogress'
import "nprogress/nprogress.css";
import './NewsSandBox.css'

const { Content } = Layout;

const NewsSandBox = () => {
  NProgress.start()
  useEffect(() => {
    NProgress.done()
  })
  return (
    <Layout>
      <SideMenu></SideMenu>
      <Layout className="site-layout">
        <TopHeader></TopHeader>
        <Content className="site-layout-background">
          <NewsRouter />
        </Content>
      </Layout>
    </Layout>
  );
};

export default NewsSandBox;
