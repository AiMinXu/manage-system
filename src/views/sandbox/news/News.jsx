import React, { useEffect, useState } from 'react';
import axios from "axios";
import { Card, Col, List, PageHeader, Row } from "antd";
import _ from "lodash";

function News(props) {
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    axios.get("/news?publishState=2&_expand=category").then(res => {
      // console.log(Object.entries(_.groupBy(res.data, item => item.category.title)))
      setDataSource(Object.entries(_.groupBy(res.data, item => item.category.title)));//将对象结构使Objec转换成二维数组---(4) [Array(2), Array(2), Array(2), Array(2)]
    })
  }, [])

  return (
    <div>
      <PageHeader title="全球大新闻" subTitle="查看新闻" />
      <Row gutter="16">
        {
          dataSource.map(item =>
            <Col span="8" key={item[0]}>
              <Card title={item[0]} bordered={true} hoverable={true}>
                <List size="small" dataSource={item[1]} pagination={{
                  pageSize: 3
                }} renderItem={data =>
                  <List.Item><a href={`#/detail/${data.id}`}>{data.title}</a></List.Item>
                } key={item[0]} />
              </Card>
            </Col>)
        }
      </Row>
    </div>
  );
}

export default News;
