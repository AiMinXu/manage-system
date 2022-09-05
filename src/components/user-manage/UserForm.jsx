import React, { forwardRef, useEffect, useState } from 'react';
import { Form, Input, Select } from 'antd';

const { Option } = Select;

//用forwardRef包裹
const UserForm = forwardRef((props, ref) => {
  //
  const [isDisabled, setIsDisabled] = useState(false)

  //使用useEffect钩子设置副作用
  useEffect(() => {
    setIsDisabled(props.isUpdateDisabled)
  }, [props.isUpdateDisabled])//依赖项为传入的状态

  const changeHandle = (value) => {
    // console.log(value);
    if (value === 1) {
      setIsDisabled(true)
      //ref.setFieldsValue将region值设置成空，清空区域选择
      ref.current.setFieldsValue({
        region: ""
      })
    } else {
      setIsDisabled(false)
    }
  }
  const { roleId, region } = JSON.parse(localStorage.getItem("token"))//获取数据
  const roleObj = {
    "1": "superAdmin",
    "2": "admin",
    "3": "editor"
  }
  //区域选择按钮禁用逻辑
  const checkRegionDisable = (item) => {
    //是否更新
    if (props.isUpdate) {
      if (roleObj[roleId] === "superAdmin") {
        return false
      } else {
        return true
      }
    } else {
      if (roleObj[roleId] === "superAdmin") {
        return false
      } else {
        //添加时禁用与自己不相等的区域
        return item.value !== region
      }
    }
  }
  //角色选择按钮禁用逻辑
  const checkRoleDisable = (item) => {
    if (props.isUpdate) {
      if (roleObj[roleId] === "superAdmin") {
        return false
      } else {
        return true
      }
    } else {
      if (roleObj[roleId] === "superAdmin") {
        return false
      } else {
        //将除了id为3的属性不禁用外其余禁用
        return roleObj[item.id] !== "editor"
      }
    }
  }
  return (
    <div>
      <Form
        ref={ref}
        layout="vertical"//垂直布局
      >
        <Form.Item
          name="username"
          label="用户名"//标题
          rules={[
            {
              required: true,
              message: 'Please input the title of collection!',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="password"
          label="密码"//标题
          rules={[
            {
              required: true,
              message: 'Please input the title of collection!',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="region"
          label="区域"//标题
          rules={isDisabled ? [] : [
            {
              required: true,
              message: 'Please input the title of collection!',
            },
          ]}
        >
          {/* 设置disabled属性当角色选择超级管理员时变成disabled,且清空区域选项 */}
          <Select disabled={isDisabled}>
            {
              props.regionList.map(item => <Option value={item.value} key={item.id} disabled={checkRegionDisable(item)}>{item.title}</Option>)
            }
          </Select>
        </Form.Item>
        <Form.Item
          name="roleId"
          label="角色"//标题
          rules={[
            {
              required: true,
              message: 'Please input the title of collection!',
            },
          ]}
        >
          {/* 设置onChange属性 */}
          <Select onChange={changeHandle}>
            {
              props.roleList.map(item => <Option value={item.id} key={item.id} disabled={checkRoleDisable(item)}>{item.roleName}</Option>)
            }
          </Select>
        </Form.Item>
      </Form>
    </div>
  );
});

export default UserForm;
