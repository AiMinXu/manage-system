import React, { forwardRef, useEffect, useState } from "react";
import { Form, Input, Select } from 'antd';
const { Option } = Select
const UserForm = forwardRef((props, ref) => {
  const [disabled, setDisabled] = useState(false)//设置禁用状态

  useEffect(() => {
    setDisabled(props.isEditDisabled)
  }, [props.isEditDisabled])
  const changeHandle = (value) => {
    if (value === 1) {
      setDisabled(true)
      ref.current.setFieldsValue({
        region: ""
      })
    } else {
      setDisabled(false)
    }
  }
  const { roleId, region } = JSON.parse(localStorage.getItem("token"))
  const checkRoleDisabled = (item) => {
    if (props.isEidt) {
      if (roleId === 1) {
        return false
      } else {
        return true
      }
    } else {
      if (roleId === 1) {
        return false
      } else {
        return item.id !== 3
      }
    }
  }
  const checkRegionDisabled = (item) => {
    if (props.isEdit) {
      if (roleId === 1) {
        return false
      } else {
        return true
      }
    } else {
      if (roleId === 1) {
        return false
      } else {
        return item.value !== region
      }
    }
  }
  return (
    <div>
      <Form
        ref={ref}
        layout='vertical'
      >
        <Form.Item
          label="用户名"
          name="username"
          rules={[
            {
              required: true,
              message: 'Please input your username!',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="密码"
          name="password"
          rules={[
            {
              required: true,
              message: '请输入您的密码!',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="区域"
          name="region"
          rules={disabled ? [] : [{
            required: true,
            message: '请选择!',
          }]}
        >
          <Select disabled={disabled}>
            {
              props.regionList.map(item => <Option value={item.value} key={item.id} disabled={checkRegionDisabled(item)}>{item.title}</Option>)
            }
          </Select>
        </Form.Item>
        <Form.Item
          label="角色"
          name="roleId"
          rules={[
            {
              required: true,
              message: '请选择!',
            },
          ]}
        >
          <Select onChange={changeHandle}>
            {
              props.roleList.map(item => <Option value={item.id} key={item.id} disabled={checkRoleDisabled(item)}>{item.roleName}</Option>)
            }
          </Select>
        </Form.Item>
      </Form>
    </div >
  );
});

export default UserForm;
