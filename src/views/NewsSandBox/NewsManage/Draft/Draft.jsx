import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, notification, } from 'antd';
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined, TransactionOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
const { confirm } = Modal;

const Draft = (porps) => {
  const [dataSource, setDataSource] = useState([])
  const history = useHistory()
  const { username } = JSON.parse(localStorage.getItem("token"))

  useEffect(() => {
    axios.get(`news?author=${username}&auditState=0&_expand=category`).then(res => {
      const list = res.data
      console.log(res.data);
      setDataSource(list)
    })
  }, [username])

  const confirmHandle = (item) => {
    confirm({
      title: '确认删除该项吗?',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        deleteHandle(item)
      },
      onCancel() {
      },
    });
  }
  const deleteHandle = (item) => {
    setDataSource(dataSource.filter(data => item.id !== data.id))
    axios.delete(`news/${item.id}`)
  }

  const editHandle = (item) => {
    porps.history.push(`/news-manage/update/${item.id}`)
  }
  const commitHandle = (item) => {
    axios.patch(`news/${item.id}`, {
      auditState: 1,
    }).then(res => {
      notification.info({
        message: "通知",
        description: "内容已提交正在跳转"
      })
      history.push("/audit-manage/list")
    })

  }
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => <b>{id}</b>,
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
      render: category => category.title
    },
    {
      title: '操作',
      key: 'opration',
      render: (item) => (
        <div>
          <Button shape="circle" type='primary' danger onClick={() => confirmHandle(item)} icon={<DeleteOutlined />} style={{ marginRight: "10px" }} />
          <Button shape="circle" onClick={() => editHandle(item)} icon={<EditOutlined />} style={{ marginRight: "10px" }} />
          <Button shape="circle" type='primary' danger onClick={() => commitHandle(item)} icon={<TransactionOutlined />} style={{ marginRight: "10px" }} />
        </div >
      )
    },
  ];
  return (
    <div>
      <Table columns={columns} dataSource={dataSource} pagination={{ pageSize: 5 }} rowKey={item => item.id} />
    </div>
  );
};

export default Draft;
