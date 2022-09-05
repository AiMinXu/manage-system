import React, { useEffect, useRef, useState } from 'react';
import UserForm from '../../../components/user-manage/UserForm';
import { Table, Button, Modal, Switch } from 'antd';
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import axios from 'axios';

const { confirm } = Modal

const UserList = () => {

  const [dataSource, setDataSource] = useState([])
  const [isAddVisible, setIsAddVisible] = useState(false)
  const [roleList, setRoleList] = useState([])
  const [regionList, setRegionList] = useState([])
  const addFormRef = useRef(null)//通过ref透传
  const [isUpdateVisible, setIsUpdateVisible] = useState(false)
  const updateFormRef = useRef(null)
  const [isUpdateDisabled, setIsUpdateDisabled] = useState(false)//设置更新的form初始值状态   子父传值
  const [current, setCurrent] = useState(null)//记录当前的选中

  const { roleId, region, uesrname } = JSON.parse(localStorage.getItem("token"))
  useEffect(() => {
    const roleObj = {
      "1": "superAdmin",
      "2": "admin",
      "3": "editor"
    }
    //?_expand=role拼接上role字段显示用于显示角色名称
    axios.get("users?_expand=role").then(res => {
      const data = res.data
      //进行判断，若roleId等于1则渲染全部数据，若不等于则渲染等于自己username和有相同区域region的且roleId为editor的
      setDataSource(roleObj[roleId] === "superAdmin" ? data : [
        ...data.filter(item => item.username === uesrname),
        ...data.filter(item => item.region === region && roleObj[item.roleId] === "editor"),

      ])
    })
  }, [roleId, region, uesrname])
  useEffect(() => {
    axios.get("regions").then(res => {
      const data = res.data
      setRegionList(data)
    })
  }, [])
  useEffect(() => {
    axios.get("roles").then(res => {
      const data = res.data
      setRoleList(data)
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
    setDataSource(dataSource.filter(data => item.id !== data.id))
    axios.delete(`users/${item.id}`)
  }
  const updateHandle = (item) => {
    //操作xu要放在异步操作中，让两者都生效，react中dom更行不一定是同步的
    //setFieldsValue设置表单的值
    setTimeout(() => {
      if (item.roleId === 1) {
        setIsUpdateDisabled(true)
      } else {
        setIsUpdateDisabled(false)
      }
      updateFormRef.current.setFieldsValue(item)
    }, 0);
    setIsUpdateVisible(true)
    setCurrent(item)//保存此时的item
  }
  //switch更新操作
  const changeHandle = (item) => {
    // console.log(item);
    item.roleState = !item.roleState
    setDataSource([...dataSource])
    axios.patch(`users/${item.id}`, {
      roleState: item.roleState
    })
  }
  const addFormOk = () => {
    //异步操作方法validateFields()触发表单验证
    addFormRef.current.validateFields().then(
      value => {
        // console.log(value)
        //设置dataSource前需要post到后端生成id，方便后面删除和更新
        axios.post(`users`, {
          ...value,
          "roleState": true,
          "default": false,
        }).then(res => {
          setDataSource([...dataSource, {
            ...res.data,
            role: roleList.filter(item => item.id === value.roleId)[0]//得手动添加role数据
          }])
        })
        addFormRef.current.resetFields()//重置清空form窗口数据
        setIsAddVisible(false)//关闭modal窗口
      }
    ).catch(err => console.log(err))
  }
  //编辑更新操作
  const updateFormOk = () => {
    //异步操作方法validateFields()触发表单验证
    updateFormRef.current.validateFields().then(
      value => {
        // console.log(value)//修改完之后的值
        setIsUpdateVisible(false)//关闭modal窗口
        setIsUpdateDisabled(!isUpdateDisabled)//取反操作
        // console.log(current);//当前修改对象的初始值
        setDataSource(dataSource.map(item => {
          // console.log(item);
          if (item.id === current.id) {
            return {
              ...item,
              ...value,
              role: roleList.filter(item => item.id === value.roleId)[0]//得手动添加role数据
            }//此处为对象的展开合并后面的属性会覆盖前面的属性形成新的对象
          }
          return item //其他对象不改变
        }))

        axios.patch(`users/${current.id}`, value)//当前编辑更新对象的id不是item.id，发送patch补丁请求
      }
    ).catch(err => console.log(err))
  }
  const columns = [
    {
      title: '区域',
      dataIndex: 'region',
      //筛选项对象形式，map返回后为数组记得展开，
      filters: [...regionList.map(item => ({
        text: item.title,
        value: item.value
      })), {
        text: "全球",
        value: ""
      }],
      //onFilter筛选函数item的region字段
      onFilter: (value, item) => item.region === value,
      key: 'region',
      render: (region) => <b>{region ? region : "全球 "}</b>
    },
    {
      title: '角色名称',
      dataIndex: 'role',
      key: 'role',
      render: role => role.roleName//
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '用户状态',
      dataIndex: 'roleState',
      key: 'default',
      render: (roleState, item) => <Switch disabled={item.default} checked={roleState} onChange={() => changeHandle(item)}></Switch>//可传第二个参数，即item整体
    },
    {
      title: '操作',
      key: 'operation',//设置为key，设置成dataIndex拿不到item
      render: item => {
        return <div>
          <Button shape={"circle"} danger icon={<DeleteOutlined />} style={{ marginRight: "10px" }} disabled={item.default}
            onClick={() => confirmHandle(item)} />
          <Button type="primary" shape="circle" icon={<EditOutlined />} disabled={item.default} onClick={() => updateHandle(item)} />
        </div>
      }
    },
  ];

  return (
    <div>
      <Button type='primary' onClick={() => { setIsAddVisible(true) }}>添加用户</Button>
      <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} rowKey={item => item.id} />
      {/* //添加用户Modal */}
      <Modal
        visible={isAddVisible}
        title="添加用户"
        okText="确认添加"
        cancelText="取消"
        onCancel={() => { setIsAddVisible(false) }}
        onOk={addFormOk}
      >
        <UserForm roleList={roleList} regionList={regionList} ref={addFormRef} />
      </Modal>
      {/* 更新编辑Modal */}
      <Modal
        visible={isUpdateVisible}
        title="更新用户状态"
        okText="确认修改"
        cancelText="取消修改"
        onCancel={() => {
          setIsUpdateVisible(false)
          setIsUpdateDisabled(!isUpdateDisabled)//取消之后重新将状态设置成false，下次再点击编辑按钮时会再次进行roleId对比判断
        }}
        onOk={updateFormOk}
      >
        <UserForm roleList={roleList} regionList={regionList} ref={updateFormRef} isUpdateDisabled={isUpdateDisabled} isUpdate={true} />
      </Modal>

    </div>
  );
}
export default UserList;
