import React, { useEffect, useState } from 'react';
import { Tree, Table, Button, Modal } from 'antd';
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
const { confirm } = Modal;

const RoleList = () => {

  const [dataSource, setDataSource] = useState([])
  const [editVisible, setEditVisible] = useState(false)//编辑用户Modal显示状态
  const [treeData, setTreeData] = useState([])//树形控件的数据
  const [currentId, setCurrentId] = useState(0)//当前选中的ID
  const [currentRight, setCurrentRight] = useState(null)//当前的勾选的rights
  useEffect(() => {
    axios.get("roles").then(res => {
      setDataSource(res.data)
    })
  }, [])
  useEffect(() => {
    axios.get("rights?_embed=children").then(res => {
      setTreeData(res.data)
    })
  }, [])

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
    // console.log(item);
    setDataSource(dataSource.filter(data => data.id !== item.id))
    axios.delete(`roles/${item.id}`)
  }

  const editHandle = (item) => {
    setEditVisible(true)
    setCurrentRight(item.rights)//点击那个设置那个item的rights
    setCurrentId(item.id)//当前选中item的状态的id值
  }
  const editOkHandle = () => {
    setDataSource(dataSource.map(item => {
      if (item.id === currentId) {
        return {
          ...item,
          rights: currentRight
        }
      }
      return item
    }))
    axios.patch(`roles/${currentId}`, {
      rights: currentRight
    })
    setEditVisible(false)
  }
  const onCheck = (checkedKeys) => {
    setCurrentRight(checkedKeys.checked)//设置成勾选状态
  };
  const columns = [
    {
      title: 'id',
      dataIndex: 'roleType',
      render: (roleType) => <b>{roleType}</b>,
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
    },
    {
      title: '操作',
      key: 'opration',
      render: (item) => (
        <div>
          <Button shape="circle" type='primary' disabled={item.default} danger onClick={() => confirmHandle(item)} icon={<DeleteOutlined />} style={{ marginRight: "10px" }} />
          <Button shape="circle" type='primary' disabled={item.default} onClick={() => editHandle(item)} icon={<EditOutlined />} />
        </div>
      )
    },
  ];
  return (
    <div>

      <Table columns={columns} dataSource={dataSource} pagination={{ pageSize: 5 }} rowKey={item => item.id} />;
      {/* 添加用户 */}
      <Modal title="修改用户权限" okText="确认" cancelText="取消" visible={editVisible} onOk={editOkHandle} onCancel={() => setEditVisible(false)}>
        <Tree
          checkable
          checkedKeys={currentRight}
          onCheck={onCheck}
          treeData={treeData}
          checkStrictly
        />
      </Modal>
    </div>
  );
};

export default RoleList;
