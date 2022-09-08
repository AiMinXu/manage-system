import React, { useEffect } from 'react';
import './NewsSandBox.css'
import { Layout } from 'antd';
import SideMenu from '../../components/side-menu/SideMenu';
import TopHeader from '../../components/top-header/TopHeader';
import NewsRouter from '../../components/news-router/NewsRouter';
import NProgress from 'nprogress'
const { Content } = Layout;

const NewsSandBox = () => {
  NProgress.start()

  useEffect(() => {
    NProgress.done()
  })

  return (
    <Layout>
      <SideMenu />
      <Layout className="site-layout">
        <TopHeader />
        <Content className="site-layout-background">
          <NewsRouter />
        </Content>
      </Layout>
    </Layout>
  );
};

export default NewsSandBox;
