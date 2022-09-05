import React from 'react';
import NewsPublish from '../../../components/news-publish/NewsPublish';
import usePublish from '../../../components/news-publish/usePublish';
import { Button } from 'antd';

const Sunset = (props) => {
  const { dataSource, deleteHandle } = usePublish(3)//解构出
  return (
    <div>
      <NewsPublish dataSource={dataSource} button={item => <Button type='primary' danger onClick={() => deleteHandle(item)}>删除</Button>} />
    </div>
  );
};

export default Sunset;
