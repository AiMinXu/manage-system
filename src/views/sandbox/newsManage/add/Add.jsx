import React, { useEffect, useRef, useState } from 'react';
import NewsEditor from '../../../../components/news-editor/NewsEditor';
import { PageHeader, Steps, Button, Form, Input, Select, message, notification } from 'antd';
import axios from 'axios'
import './Add.css'

const { Step } = Steps;
const { Option } = Select;

const Add = (props) => {
  const [current, setCurrent] = useState(0)
  const [options, setOptions] = useState([])
  const firstFromRef = useRef(null)//设置表单校验ref
  const [formInfo, setFormInfo] = useState({})//表单的状态
  const [content, setContent] = useState("")//富文本内容

  const user = JSON.parse(localStorage.getItem("token"));
  useEffect(() => {
    axios.get("categories").then(res => {
      // console.log(res);
      setOptions(res.data)
    })
  }, [])

  //下一步
  const nextHandle = () => {
    if (current === 0) {
      //ref的当前的validateFields()方法返回Promise
      firstFromRef.current.validateFields().then(res => {
        // console.log(res);
        setFormInfo(res)
        setCurrent(current + 1)
      }).catch(err => { console.log(err); })
    } else if (current === 1) {
      // console.log(formInfo, content);
      //内容为空不允许放行
      if (content === "" || content.trim() === "<p></p>") {
        message.error("输入内容不能为空请确认输入！")
        return
      }
      setCurrent(current + 1)
    }
  }
  //上一步
  const prevHandle = () => {
    setCurrent(current - 1)
  }

  //保存或提交审核
  const saveOrSubHandle = (auditState) => {
    axios.post("/news", {
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
      // console.log(res);
      notification.info({
        message: "通知",
        description: `内容已提交，您可以在${auditState === 0 ? '草稿箱' : "审核管理"}中查看，正在跳转`
      })
      props.history.push(auditState === 0 ? "/news-manage/draft" : "/audit-manage/list")
    })
  }

  return (
    <div>
      {/* PageHeader */}
      <PageHeader
        className="site-page-header"
        title="撰写新闻"
        subTitle=""
      />
      {/* 进度条  */}
      <Steps current={current} className="steps" style={{ marginTop: "1rem" }}>
        <Step title="基本信息" description="新闻标题，新闻分类" />
        <Step title="新闻内容" description="新闻主体内容" />
        <Step title="提问提交" description="保存草稿或者提交审核" />
      </Steps>
      {/* 内容区 */}
      <div className="formGroup">
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
          <span style={{ fontSize: "24px", fontWeight: "bolder" }}>请确认您的下一步操作</span>
        </div>
      </div>
      {/* 按钮区 */}
      <div className="btnGroup">
        {
          current > 0 && <Button onClick={prevHandle} className="btn">上一步</Button>
        }
        {
          current < 2 && <Button type='primary' onClick={nextHandle} className="btn">下一步</Button>
        }
        {
          current === 2 && <span>
            <Button type='primary' onClick={() => saveOrSubHandle(0)} className="btn" >保存草稿</Button>
            <Button type='primary' danger onClick={() => saveOrSubHandle(1)} className="btn">提交审核</Button>
          </span>
        }
      </div>
    </div>
  );
};

export default Add;
