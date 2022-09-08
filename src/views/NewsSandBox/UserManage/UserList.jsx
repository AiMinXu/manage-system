import React, { useEffect, useRef, useState } from 'react';
import UserForm from '../../../components/user-form/UserForm';
import { Switch, Table, Button, Modal } from 'antd';
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
const { confirm } = Modal;
const UserList = () => {

  const [dataSource, setDataSource] = useState([])
  const [addVisible, setAddVisible] = useState(false)//添加用户Modal显示状态
  const [editVisible, setEditVisible] = useState(false)//编辑用户Modal显示状态
  const [roleList, setRoleList] = useState([])//记录roleList
  const [regionList, setRegionList] = useState([])//记录regionList
  const addRef = useRef(null)//新增用户ref
  const editRef = useRef(null)//编辑用户ref
  const [isEditDisabled, setIsEditDisabled] = useState(false)//是否可编辑状态
  const [current, setCurrent] = useState(null)//记录当前操作的对象是哪个

  const { username, roleId, region } = JSON.parse(localStorage.getItem("token"))
  useEffect(() => {
    axios.get("users?_expand=role").then(res => {
      const data = res.data
      //过滤显示数据
      setDataSource(
        roleId === 1 ? data : [
          ...data.filter(item => item.username === username),//当前用户的
          ...data.filter(item => item.region === region && item.roleId === 3)//同一区域内的且包含编辑
        ]
      )
    })
  }, [username, roleId, region])
  useEffect(() => {
    axios.get("roles").then(res => {
      setRoleList(res.data)
    })
  }, [])
  useEffect(() => {
    axios.get("regions").then(res => {
      setRegionList(res.data)
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
        console.log('Cancel');
      },
    });
  }
  const deleteHandle = (item) => {
    // console.log(item);
    setDataSource(dataSource.filter(data => data.id !== item.id))
    axios.delete(`users/${item.id}`)
  }
  const editHandle = (item) => {
    setTimeout(() => {
      editRef.current.setFieldsValue(item)//设置填充
      if (item.roleId === 1) {
        setIsEditDisabled(true)
      } else {
        setIsEditDisabled(false)
      }
    }, 0);
    setEditVisible(true)
    setCurrent(item)
  }
  const changeHandle = (item) => {
    // console.log(item);
    item.roleState = !item.roleState
    setDataSource([...dataSource])
    axios.patch(`users/${item.id}`, {
      roleState: item.roleState
    })
  }

  const addOkHandle = () => {
    addRef.current.validateFields().then(value => {
      // console.log(value);
      // console.log(roleList.filter(item => item.id === value.roleId));
      axios.post("users", {
        ...value,
        "roleState": true,
        "default": false,
      }).then(res => {
        // console.log(res);
        setDataSource([...dataSource, {
          ...res.data,
          role: roleList.filter(item => item.id === value.roleId)[0]
        }
        ])
      })
      setAddVisible(false)
    }
    )
  }
  const editOkHandle = () => {
    editRef.current.validateFields().then(res => {
      // console.log(res);
      setIsEditDisabled(false)//将可编辑设为false，下次点开再进入判断
      setEditVisible(false)
      setDataSource(dataSource.map(item => {
        if (item.id === current.id) {
          return {
            ...item,
            ...res,//合并对象属性
            role: roleList.filter(item => item.id === res.roleId)[0]
          }
        }
        return item//返回其他不变
      }))
      axios.patch(`users/${current.id}`, res)
    })
  }
  const columns = [
    {
      title: '区域',
      dataIndex: 'region',
      render: (region) => <b>{region === "" ? "全球" : region}</b>,
    },
    {
      title: '角色名称',
      dataIndex: 'role',
      render: role => role.roleName
    },
    {
      title: '用户名',
      dataIndex: 'username',
    },
    {
      title: '用户状态',
      dataIndex: 'roleState',
      render: (roleState, item) => (//item为剩余参数，不可用item.roleState
        <Switch checked={roleState} disabled={item.default} onChange={() => changeHandle(item)} />
      ),
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
      <Button type='primary' onClick={() => setAddVisible(true)}>添加用户</Button>
      <Table columns={columns} dataSource={dataSource} pagination={{ pageSize: 5 }} rowKey={item => item.id} />;
      {/* 添加用户 */}
      <Modal title="添加用户" okText="确认" cancelText="取消" visible={addVisible} onOk={addOkHandle} onCancel={() => setAddVisible(false)}>
        <UserForm roleList={roleList} regionList={regionList} ref={addRef} />
      </Modal>
      {/* 编辑用户 */}
      <Modal title="修改用户" okText="确认" cancelText="取消" visible={editVisible} onOk={editOkHandle} onCancel={() => { setEditVisible(false); setIsEditDisabled(!isEditDisabled) }}>
        <UserForm roleList={roleList} regionList={regionList} ref={editRef} isEditDisabled={isEditDisabled} isEidt={true} />
      </Modal>
    </div>
  );
};

export default UserList;
