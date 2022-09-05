import React, { useEffect, useState } from 'react';
import { Table, Tag, Button, notification, } from 'antd';
import axios from 'axios'

const AuditList = (props) => {

  const [dataSource, setDataSource] = useState([])

  const { username } = JSON.parse(localStorage.getItem("token"))
  //_ne不等于，lte小于,gte大于
  useEffect(() => {
    axios.get(`/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`).then(res => {
      // console.log(res.data);
      setDataSource(res.data)
    })
  }, [username])


  const rervertHandle = (item) => {
    setDataSource(dataSource.filter(data => item.id !== data.id))
    axios.patch(`/news/${item.id}`, {
      auditState: 0
    }).then(res => {
      notification.info({
        message: "通知",
        description: "已撤销，请在草稿箱中查看"
      })
    })
  }
  const publisgHandle = (item) => {
    setDataSource(dataSource.filter(data => item.id !== data.id))
    axios.patch(`/news/${item.id}`, {
      publishState: 2,
      publishTime: Date.now()
    }).then(res => {
      props.history.push(`/publish-manage/published`)
      notification.info({
        message: "通知",
        description: "已发布，请在发布管理中查看"
      })
    })
  }
  const updateHandle = (item) => {
    props.history.push(`/news-manage/update/${item.id}`)
  }

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
      title: '审核状态',
      dataIndex: 'auditState',
      render: (auditState) => {
        const colorList = ["", "orange", "green", "red"]
        const auditList = ["未审核", "审核中", "已通过", "未通过"]
        return <Tag color={colorList[auditState]}>{auditList[auditState]}</Tag>
      }
    },
    {
      title: '操作',
      key: 'opration',//设置为key，设置成dataIndex拿不到item
      render: item => {
        return <div>
          {
            item.auditState === 1 && <Button onClick={() => rervertHandle(item)}>撤销</Button>
          }
          {
            item.auditState === 2 && <Button danger onClick={() => publisgHandle(item)}>发布</Button>
          }
          {
            item.auditState === 3 && <Button type="primary" onClick={() => updateHandle(item)}>更新</Button>
          }
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

export default AuditList;
