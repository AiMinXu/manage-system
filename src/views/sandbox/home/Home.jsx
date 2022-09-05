import React, { useEffect, useRef, useState } from 'react';
import { Card, Col, Row, List, Avatar, Drawer } from 'antd'
import { EditOutlined, EllipsisOutlined, PieChartOutlined } from '@ant-design/icons';
import axios from 'axios'
import * as ECharts from 'echarts'
import _ from "lodash";

const { Meta } = Card;
const Home = () => {
  const [viewList, setViewList] = useState([])
  const [starList, setStarList] = useState([])
  const [visible, setVisible] = useState(false)
  const [pieInit, setPieInit] = useState(null)
  const [allList, setAllList] = useState(null)
  const barRef = useRef()
  const pieRef = useRef()


  const user = JSON.parse(localStorage.getItem("token"))
  useEffect(() => {
    axios.get(`news?publisState=2&_expand=category&_sort=view&order=desc&_limit=6`).then(res => {
      setViewList(res.data)
    })
  }, [])
  useEffect(() => {
    axios.get(`news?publisState=2&_expand=category&_sort=view&order=desc&_limit=6`).then(res => {
      setStarList(res.data)
    })
  }, [])
  useEffect(() => {
    axios.get(`/news?publishState=2&_expand=category`).then(res => {
      // console.log(_.groupBy(res.data, item => item.category.title))
      renderBar(_.groupBy(res.data, item => item.category.title))
      setAllList(res.data)
    })
    //组件销毁时将window.onresize设置成空，防止一直重复调用
    return () => {
      window.onresize = null
    }
  }, [])

  // ECharts初始化
  const renderBar = (data) => {
    let myChart = ECharts.init(barRef.current)//绑定dom节点
    let option = {
      title: {
        text: "新闻分类图示"
      },
      legend: {
        data: ["数量"]
      },
      xAxis: {
        data: Object.keys(data),
        axisLabel: {
          rotate: "45",
        },
      },
      yAxis: {
        minInterval: 1,
      },
      series: {
        name: "数量",
        type: "bar",
        data: Object.values(data).map(item => item.length),
      }
    };
    myChart.setOption(option);
    window.onresize = () => {
      // console.log(1);
      myChart.resize()
    }
  }
  const renderPie = (data) => {
    let currentList = allList.filter(item => item.author === user.username)
    let groupObj = _.groupBy(currentList, item => item.category.title)
    let list = [];
    for (let i in groupObj) {
      list.push({
        name: i,
        value: groupObj[i].length
      })
    }
    let myChart;
    if (!pieInit) {
      myChart = ECharts.init(pieRef.current);
      setPieInit(myChart);
    } else {
      myChart = pieInit;
    }
    let option = {
      title: {
        text: '当前用户发布',
        subtext: '个人数据',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: '发布数量',
          type: 'pie',
          radius: '50%',
          data: list,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };

    option && myChart.setOption(option);
  }

  return (
    <div>
      <Row gutter={16}>
        <Col span={8}>
          <Card title="用户最常浏览" bordered={true}>
            <List size='large' dataSource={viewList} renderItem={item => <List.Item> <a href={`#/news-manage/preview/${item.id}`}>{item.title}</a></List.Item>} />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="用户点赞最多" bordered={true}>
            <List size='large' dataSource={starList} renderItem={item => <List.Item> <a href={`#/news-manage/preview/${item.id}`}>{item.title}</a></List.Item>} />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            cover={
              <img
                alt="example"
                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
              />
            }
            actions={[
              <PieChartOutlined key="setting" onClick={() => {
                setVisible(true)
                setTimeout(() => {
                  renderPie()
                }, 0);
              }}
              />,
              <EditOutlined key="edit" />,
              <EllipsisOutlined key="ellipsis" />,
            ]}
          >
            <Meta
              avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
              title={user.username}
              description={
                <div>
                  <b style={{ marginRight: "1rem" }}>{user.region === "" ? "全球" : user.region}</b>
                  <span>{user.role.roleName}</span>
                </div>
              }
            />
          </Card>
        </Col>
      </Row>
      <Drawer title="个人新闻数据" placement="right" width="500px" onClose={() => setVisible(false)} visible={visible}>
        <div ref={pieRef} style={{ height: "600px", width: "100%", marginTop: "20px" }} />
      </Drawer>
      <div ref={barRef} style={{ height: "600px", width: "100%", marginTop: "20px" }} />
    </div>
  );
};

export default Home;
