import React, { useEffect, useRef, useState } from 'react';
import { Button, PageHeader, Steps, Form, Input, Select, message, notification } from 'antd';
import { useHistory } from "react-router-dom";
import axios from 'axios';
import NewsEditor from '../../../../components/news-editor/NewsEditor';
import './Add.css'
const { Step } = Steps;
const { Option } = Select;
const Add = () => {
  const [current, setCurrent] = useState(0)//记录当前到哪一步
  const [formInfo, setFormInfo] = useState({})//暂存表单状态state
  const [options, setOptions] = useState([])//选项
  const [content, setContent] = useState('')//富文本内容
  const firstFromRef = useRef(null)//表单ref
  const history = useHistory()
  const user = JSON.parse(localStorage.getItem("token"))

  useEffect(() => {
    axios.get("categories").then(res => {
      setOptions(res.data)
    })
  })

  const prevHandle = () => {
    setCurrent(current - 1)
  }
  const nextHandle = () => {
    if (current === 0) {
      firstFromRef.current.validateFields().then(res => {//验证表单是否为空
        setFormInfo(res)//暂存表单数据
        setCurrent(current + 1)
      })
    } else if (current === 1) {
      if (content === '' || content.trim() === "<p></p>") {//判断富文本的内容是否为空
        message.error({
          content: "请确认您的输入"
        })
        return
      }
      setCurrent(current + 1)
    }
  }

  const saveOrCommitHandle = (auditState) => {
    axios.post(`news`, {
      ...formInfo,
      "content": content,
      "region": user.region ? user.region : "全球",
      "author": user.username,//author
      "roleId": user.roleId,
      "auditState": auditState,
      "publishState": 0,
      "star": 0,
      "view": 0,
      "createTime": Date.now(),
      "publishTime": 0
    }).then(res => {
      notification.info({
        message: "通知",
        description: `请在${auditState === 0 ? "草稿箱" : "审核管理"}中查看`
      })
      history.push(auditState === 0 ? "/news-manage/draft" : "/audit-manage/list")
    })
  }
  return (
    <div>
      {/* 页头 */}
      <PageHeader
        className="site-page-header"
        title="撰写新闻"
      />
      {/* 进度条 */}
      <Steps current={current} style={{ marginTop: "1rem", padding: "0 1rem" }}>
        <Step title="基本信息" description="新闻标题，新闻分类" />
        <Step title="新闻内容" description="新闻主体内容" />
        <Step title="提问提交" description="提问提交" />
      </Steps>
      {/* 编辑组 */}
      <div className='fromGroup'>
        <div className={current === 0 ? "" : "hidden"}>
          <Form
            name="basic"
            labelCol={{ span: 2 }}
            wrapperCol={{ span: 22 }}
            ref={firstFromRef}
          >
            <Form.Item
              label="新闻标题"
              name="title"
              rules={[{ required: true, message: '新闻标题不能为空!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="新闻分类"
              name="categoryId"
              rules={[{ required: true, message: '请选择新闻分类!' }]}
            >
              {/* <Select options={options} /> */}
              <Select>
                {
                  options.map(item => <Option value={item.id} key={item.id}> {item.title} </Option>)
                }
              </Select>
            </Form.Item>
          </Form>
        </div>
        <div className={current === 1 ? "" : "hidden"}>
          <NewsEditor getContent={(content) => setContent(content)} />
        </div>
        <div className={current === 2 ? "" : "hidden"}>
          <span style={{ fontSize: "24px", fontWeight: "bolder" }}>请您确认下一步操作！</span>
        </div>
      </div>
      {/* 按钮组 */}
      <div className='btnGroup'>
        {
          current > 0 && <Button onClick={prevHandle} className='btn'>上一步</Button>
        }
        {
          current < 2 && <Button onClick={nextHandle} className='btn'>下一步</Button>
        }
        {
          current === 2 && <span>
            <Button onClick={() => saveOrCommitHandle(0)} className='btn'>保存草稿</Button>
            <Button onClick={() => saveOrCommitHandle(1)} className='btn'>提交审核</Button>
          </span>
        }
      </div>
    </div>
  );
};

export default Add;
