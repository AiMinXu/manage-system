import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Tag, Switch, Popover } from 'antd';
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
const { confirm } = Modal;

const RightList = () => {

  const [dataSource, setDataSource] = useState([])

  useEffect(() => {
    axios.get("rights?_embed=children").then(res => {
      let data = res.data
      data.forEach(item => {
        if (item.children.length === 0) {
          delete item["children"]
        }
        return item
      })
      setDataSource(data)
    })
  }, [])

  const switchHandle = (item) => {
    item.pagepermission = item.pagepermission === 1 ? 0 : 1
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
  }

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
    if (item.grade === 1) {
      setDataSource(dataSource.filter(data => data.id !== item.id))
      axios.delete(`rights/${item.id}`)
    } else {
      let list = dataSource.filter(data => item.rightId === data.id)
      list[0].children = list[0].children.filter(data => data.id !== item.id)//重新赋值覆盖
      setDataSource([...dataSource])
      axios.delete(`chlidren/${item.id}`)
    }
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => <b>{id}</b>,
    },
    {
      title: '权限名称',
      dataIndex: 'title',
    },
    {
      title: '权路径',
      dataIndex: 'key',
      render: (key) => <Tag color='orange'>{key}</Tag>
    },
    {
      title: '操作',
      key: 'opration',
      render: (item) => (
        <div>
          <Button shape="circle" type='primary' disabled={item.default} danger onClick={() => confirmHandle(item)} icon={<DeleteOutlined />} style={{ marginRight: "10px" }} />
          <Popover
            title="可选项开关"
            content={<Switch checkedChildren="开启" unCheckedChildren="关闭" checked={item.pagepermission} onChange={() => switchHandle(item)} />}
            trigger={(item.pagepermission === undefined || item.title === "首页") ? "" : "click"}
          >
            <Button shape="circle" type='primary' disabled={item.pagepermission === undefined || item.title === "首页"} icon={<EditOutlined />} />
          </Popover>
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

export default RightList;
