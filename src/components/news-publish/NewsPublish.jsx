import React from 'react';
import { Table } from 'antd';

const NewsPublish = (props) => {

  const columns = [
    {
      title: '新闻标题',
      dataIndex: 'title',
      render: (title, item) => <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
    },
    {
      title: '作者',
      dataIndex: 'author',
    },
    {
      title: '新闻分类',
      dataIndex: 'category',
      render: category => category.title
    },
    {
      title: '操作',
      key: 'opration',//设置为key，设置成dataIndex拿不到item
      render: item => {
        // 传递为立即执行 函数
        return <div>
          {props.button(item.id)}
        </div>
      }
    },
  ];

  return (
    <div>
      <Table dataSource={props.dataSource} columns={columns} pagination={{ pageSize: 5 }} rowKey={item => item.id} />
    </div>
  );
};

export default NewsPublish;
