import React, { useEffect, useState } from 'react';
import { Descriptions, PageHeader } from 'antd';
import axios from 'axios';
import moment from "moment"

const Preview = (props) => {
  const [newsInfo, setNewsInfo] = useState(null)
  console.log(1111);
  // const { username } = JSON.parse(localStorage.getItem("token"))

  useEffect(() => {
    axios.get(`/news/${props.match.params.id}?_expand=category&_expand=role`).then(res => {
      // console.log(res.data);
      setNewsInfo(res.data);
    });
    // console.log(props.match.params.id);//动态路由
  }, [props.match.params.id])

  const auditState = ["未审核", "审核中", "已通过", "未通过"];
  const publishState = ["未发布", "待发布", "已上线", "已下线"];
  const colorList = ["", "orange", "green", "red"];

  return (
    <div>
      {
        newsInfo &&
        <div>
          <PageHeader
            ghost={false}
            onBack={() => window.history.back()}
            title={newsInfo.title}
            subTitle={newsInfo.category.title}
          >
            <Descriptions size="small" column={3}>
              <Descriptions.Item label="创建者">{newsInfo.author}</Descriptions.Item>
              <Descriptions.Item label="创建时间">{moment(newsInfo.createTime).format("YYYY/MM/DD HH:mm:ss")}</Descriptions.Item>
              <Descriptions.Item label="发布时间">{newsInfo.publishTime ? moment(newsInfo.publishTime).format("YYYY/MM/DD HH:mm:ss") : "-"}</Descriptions.Item>
              <Descriptions.Item label="区域">{newsInfo.region}</Descriptions.Item>
              <Descriptions.Item label="审核状态">
                <span style={{ color: colorList[newsInfo.auditState] }}>
                  {auditState[newsInfo.auditState]}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="发布状态">
                <span style={{ color: colorList[newsInfo.publishState] }}>
                  {publishState[newsInfo.publishState]}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="访问数量">{newsInfo.view}</Descriptions.Item>
              <Descriptions.Item label="点赞数量">{newsInfo.star}</Descriptions.Item>
              <Descriptions.Item label="评论数量">0</Descriptions.Item>
            </Descriptions>
          </PageHeader>
          <hr />
          {/* 将其转为html显示 */}
          <div dangerouslySetInnerHTML={{ __html: newsInfo.content }} />
        </div>
      }
    </div>
  );
};

export default Preview;
