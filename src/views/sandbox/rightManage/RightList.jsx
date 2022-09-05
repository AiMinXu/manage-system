import React, { useEffect, useState } from 'react';
import { Table, Tag, Button, Modal, Popover, Switch } from 'antd';
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import axios from 'axios';

const { confirm } = Modal
const RightList = () => {
  const [dataSource, setDataSource] = useState([])

  useEffect(() => {
    axios.get("rights?_embed=children").then(res => {
      let data = res.data.map(item => {
        if (item.children.length === 0) {
          delete item["children"]
        }
        return item
      })
      setDataSource(data)
    })
  }, [])

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
    if (item.grade === 1) {
      setDataSource(dataSource.filter(data => data.id !== item.id))//前端页面删除重新渲染
      axios.delete(`rights/${item.id}`).then(() => { })//url: string, config后端数据删除
    } else {
      // console.log(item);
      let list = dataSource.filter(data => data.id === item.rightId)//只筛选一层
      // console.log(list);
      list[0].children = list[0].children.filter(data => data.id !== item.id)//children被重新覆盖了，导致DataSource改变
      // console.log(dataSource);
      setDataSource([...dataSource])//dataSource一级没有影响，需要展开后再重新设置触发更新
      axios.delete(`children/${item.id}`)
    }
  }
  const editHandle = (item) => {
    // console.log(item);
    item.pagepermission = item.pagepermission === 1 ? 0 : 1
    // console.log(item.pagepermission);
    setDataSource([...dataSource])
    if (item.grade === 1) {
      axios.patch(`rights/${item.id}`, {
        pagepermission: item.pagepermission
      })
    } else {
      axios.patch(`children/${item.id}`, {
        pagepermission: item.pagepermission
      })
    }
    // window.location.reload()
  }
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: (id) => <b>{id}</b>
    },
    {
      title: '权限名称',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '权限路径',
      dataIndex: 'key',
      key: 'key',
      render: (key) => <Tag color="#f50">{key}</Tag>
    },
    {
      title: '操作',
      key: 'operation',//设置为key，设置成dataIndex拿不到item
      render: item => {
        return <div>
          <Button shape={"circle"} danger icon={<DeleteOutlined />} style={{ marginRight: "10px" }}
            onClick={() => confirmHandle(item)} />
          <Popover
            content={<Switch checked={item.pagepermission} onChange={() => editHandle(item)} checkedChildren="开启" unCheckedChildren="关闭"></Switch>}
            title="可配置选项开关"
            trigger={item.pagepermission === undefined || item.title === "首页" ? "" : "click"}
            style={{ textAlign: 'center' }}
          >
            <Button type="primary" shape="circle" icon={<EditOutlined />} disabled={item.pagepermission === undefined || item.title === "首页"} />
          </Popover>
        </div>
      }
    },
  ];
  return (
    <div>
      <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} />
    </div>
  );
};

export default RightList;
