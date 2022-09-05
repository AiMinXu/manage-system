import React, { useEffect, useState } from 'react';
import { Table, Modal, Button, Tree } from 'antd'
import { DeleteOutlined, ExclamationCircleOutlined, EditOutlined } from '@ant-design/icons'
import axios from 'axios';


const { confirm } = Modal
const RoleList = () => {
  //react
  const [dataSource, setDataSource] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false);//模态框显示状态
  const [treeData, setTreeData] = useState([]);//模态框内树形列表状态
  const [currentData, setCurrentData] = useState([]);//当前点击对应勾选的状态的rights
  const [currentId, setCurrentId] = useState(0);//当前点击对应勾选的状态

  //副作用
  useEffect(() => {
    axios.get("roles").then(res => {
      // console.log(res.data);
      setDataSource(res.data)
    })
  }, [])
  useEffect(() => {
    axios.get("rights?_embed=children").then(res => {
      // console.log(res.data);
      setTreeData(res.data)
    })
  }, [])

  //业务逻辑
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
        // console.log('Cancel');
      },
    });
  }
  const deleteHandle = (item) => {
    console.log(item);
    setDataSource(dataSource.filter(data => data.id !== item.id))
    axios.delete(`roles/${item.id}`)
  }
  const onCheck = (checkedKeys) => {
    // console.log(checkedKeys);
    setCurrentData(checkedKeys.checked)//将页面状态设置成勾选属性的选项
  }
  const handleOk = () => {
    console.log(currentData);
    //同步dataSource
    setDataSource(dataSource.map(item => {
      //map遍历判断当前数组的id是否与item.id相等
      if (item.id === currentId) {
        return {
          ...item,//为啥要展开呢？
          rights: currentData//将当前勾选的赋值给rights
        }
      }
      return item
    }))
    //同步到后端数据
    axios.patch(`roles/${currentId}`, {
      rights: currentData//将当前勾选的赋值给后端rights
    })
    //关闭Modal
    setIsModalVisible(false)
  }
  const handleCancel = () => {
    setIsModalVisible(false)
  }
  //其他
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: (id) => <b>{id}</b>
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
      key: 'roleName',
    },
    {
      title: '操作',
      key: "operation",//key.!!!!!..
      render: (item) => {
        return <div>
          <Button shape={"circle"} danger icon={<DeleteOutlined />} onClick={() => confirmHandle(item)} style={{ marginRight: "10px" }} />
          <Button type="primary" shape="circle" icon={<EditOutlined />} onClick={() => {
            setIsModalVisible(true);
            setCurrentData(item.rights)//点击那个设置那个的rights
            setCurrentId(item.id)//当前选中的状态的id值
          }} />
        </div>
      }
    },
  ]


  return (
    <div>
      <Table columns={columns} dataSource={dataSource} rowKey={item => item.id} />
      <Modal itle="权限分配" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Tree
          checkable
          checkedKeys={currentData}
          onCheck={onCheck}
          treeData={treeData}
          checkStrictly
        />
      </Modal>
    </div>
  );
};

export default RoleList;
