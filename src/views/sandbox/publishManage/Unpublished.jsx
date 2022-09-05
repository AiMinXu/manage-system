import React from 'react';
import NewsPublish from '../../../components/news-publish/NewsPublish';
import usePublish from '../../../components/news-publish/usePublish';
import { Button } from 'antd';

const Unpublished = (props) => {
  const { dataSource, publishHandle } = usePublish(1)//解构
  return (
    <div>
      <NewsPublish dataSource={dataSource} button={item => <Button type='primary' onClick={() => publishHandle(item)}>发布</Button>} />
    </div>
  );
};

export default Unpublished;
