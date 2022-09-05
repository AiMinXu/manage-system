import React, { useEffect, useState } from 'react';
import { Table, Button, notification } from 'antd';
import axios from 'axios';

const Audit = (props) => {
  const [dataSource, setDataSource] = useState([])

  const { roleId, region, uesrname } = JSON.parse(localStorage.getItem("token"))
  useEffect(() => {
    const roleObj = {
      "1": "superAdmin",
      "2": "admin",
      "3": "editor"
    }
    axios.get(`/news?auditState=1&_expand=category`).then(res => {
      const data = res.data
      //进行判断，若roleId等于1则渲染全部数据，若不等于则渲染等于自己username和有相同区域region的且roleId为editor的
      setDataSource(roleObj[roleId] === "superAdmin" ? data : [
        ...data.filter(item => item.author === uesrname),
        ...data.filter(item => item.region === region && roleObj[item.roleId] === "editor"),
      ])
    })
  }, [roleId, region, uesrname])

  const acceptOrRejectHandle = (item, auditState, publishState) => {
    setDataSource(dataSource.filter(data => item.id !== data.id))
    axios.patch(`/news/${item.id}`, {
      auditState,
      publishState
    }).then(res => {
      notification.info({
        message: "通知",
        description: "请在审核管理、审核列表中查看"
      })
    })
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
      title: '操作',
      key: 'operation',//设置为key，设置成dataIndex拿不到item
      render: item => {
        return <div>
          <Button type="primary" style={{ marginRight: "10px" }} onClick={() => acceptOrRejectHandle(item, 2, 1)}>通过</Button>
          <Button type="primary" danger onClick={() => acceptOrRejectHandle(item, 3, 0)}>拒绝</Button>
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

export default Audit;
