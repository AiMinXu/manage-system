import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, notification } from 'antd';
import { DeleteOutlined, EditOutlined, CheckOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import axios from 'axios';

const { confirm } = Modal

const Draft = (props) => {
  const [dataSource, setDataSource] = useState([])

  const { username } = JSON.parse(localStorage.getItem("token"))

  useEffect(() => {
    axios.get(`news?author=${username}&auditState=0&_expand=category`).then(res => {
      const list = res.data
      // console.log(list);
      setDataSource(list)
    })
  }, [username])

  const confirmHandle = (item) => {
    confirm({
      title: '您确认删除该条数据吗?',
      icon: <ExclamationCircleOutlined />,
      content: '',
      onOk() {
        // console.log(item);
        deleteHandle(item)
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }
  //删除操作 前端页面删除+后端数据删除（一二级菜单筛选通过grade）
  const deleteHandle = (item) => {
    setDataSource(dataSource.filter(data => data.id !== item.id))//前端页面删除重新渲染
    axios.delete(`news/${item.id}`)//url: string, config后端数据删除
  }

  const updateHandle = (item) => {
    props.history.push(`/news-manage/update/${item.id}`)
  }

  const submitHandle = (id) => {
    axios.patch(`/news/${id}`, {
      auditState: 1
    }).then(res => {
      // console.log(res);
      notification.info({
        message: "通知",
        description: `内容已提交，您可以在审核管理中查看，正在跳转`
      })
      props.history.push("/audit-manage/list")
    })
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => <b>{id}</b>
    },
    {
      title: '新闻标题',
      dataIndex: 'title',
      render: (title, item) => <a color="#089ffd" href={`#/news-manage/preview/${item.id}`}>{title}</a>
    },
    {
      title: '作者',
      dataIndex: 'author',
    },
    {
      title: '新闻分类',
      dataIndex: 'category',
      render: (category) => {
        return category.title
      }
    },
    {
      title: '操作',
      key: 'operation',//设置为key，设置成dataIndex拿不到item
      render: item => {
        return <div>
          <Button shape={"circle"} danger icon={<DeleteOutlined />} style={{ marginRight: "10px" }} onClick={() => confirmHandle(item)} />
          <Button shape="circle" icon={<EditOutlined />} style={{ marginRight: "10px" }} onClick={() => updateHandle(item)} />
          <Button type="primary" shape="circle" icon={<CheckOutlined />} onClick={() => submitHandle(item.id)} />
        </div>
      }
    },
  ];
  return (
    <div>
      <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} rowKey={item => item.id} />
    </div>
  );
};

export default Draft;
