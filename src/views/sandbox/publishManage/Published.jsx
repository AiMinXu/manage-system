import React from 'react';
import NewsPublish from '../../../components/news-publish/NewsPublish';
import usePublish from '../../../components/news-publish/usePublish';
import { Button } from 'antd';

const Published = (props) => {
  const { dataSource, sunsetHandle } = usePublish(2)
  return (
    <div>
      {/* 设置button属性，设置成函数形式，子组件中立即执行并传入item.id */}
      <NewsPublish dataSource={dataSource} button={item => <Button type='primary' danger onClick={() => sunsetHandle(item)}>下线</Button>} />
    </div>
  );
};

export default Published;
