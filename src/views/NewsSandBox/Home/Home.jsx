import React, { useEffect, useRef, useState } from 'react';
import { Row, Col, Card, Avatar, List, Drawer } from 'antd'
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import axios from 'axios'
import _ from 'lodash'
import * as echarts from 'echarts';

const { Meta } = Card;
const Home = () => {
  const [starList, setStarList] = useState([])
  const [viewList, setViewList] = useState([])
  const [allList, setAllList] = useState([])
  const [open, setOpen] = useState(false);
  const [pieInit, setPieInit] = useState(null)//初始化pie状态
  const barRef = useRef()
  const pieRef = useRef()
  const user = JSON.parse(localStorage.getItem("token"))
  useEffect(() => {
    //1.已发布2.向上连表category3.view排序4.降序5.限制6条
    axios.get(`news?&publishState=2&_expand=category&_sort=view&order=desc&_limit=6`).then(res => {
      // console.log(res.data);
      setViewList(res.data)
    })
  }, [])
  useEffect(() => {
    //1.已发布2.向上连表category3.view排序4.降序5.限制6条
    axios.get(`news?&publishState=2&_expand=category&_sort=star&order=desc&_limit=6`).then(res => {
      // console.log(res.data);
      setStarList(res.data)
    })
  }, [])
  useEffect(() => {
    axios.get('news?publishState=2&_expand=category').then(res => {
      // console.log(res.data);
      renderBar(_.groupBy(res.data, item => item.category.title))//使用Lodash对其进行分组排序
      setAllList(res.data)//全部已发布文章
    })
    //组件销毁时将window.onresize设置成空，防止一直重复调用
    return () => {
      window.onresize = null
    }
  }, [])

  const onClose = () => {
    setOpen(false);
  };
  const renderBar = (item) => {
    let myChart = echarts.init(barRef.current);
    let option;
    option = {
      title: {
        text: "新闻分类图示"
      },
      legend: {
        data: ["数量"]
      },
      xAxis: {
        data: Object.keys(item),
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
        data: Object.values(item).map(item => item.length),
      }
    };

    option && myChart.setOption(option);
    window.onresize = () => {
      myChart.resize()
    }
  }
  const renderPie = () => {
    // console.log(allList);
    const list = allList.filter(item => item.author === user.username)
    const groupObj = _.groupBy(list, item => item.category.title)
    // console.log(groupObj);
    let currentList = []
    for (let k in groupObj) {
      currentList.push({
        value: groupObj[k].length,
        name: k,
      })
    }
    // console.log(currentList);
    let myChart
    if (!pieInit) {
      myChart = echarts.init(pieRef.current);
      setPieInit(myChart);
    } else {
      myChart = pieInit;
    }
    let option;
    option = {
      title: {
        text: '当前用户发布数据',
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
          data: currentList,//currentList
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
            <List
              dataSource={viewList}
              renderItem={(item) => (
                <List.Item>
                  <a href={`#/news-manage/preview/${item.id}`}>{item.title}</a>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="用户点赞最多" bordered={true}>
            <List
              dataSource={starList}
              renderItem={(item) => (
                <List.Item>
                  <a href={`#/news-manage/preview/${item.id}`}>{item.title}</a>
                </List.Item>
              )}
            />
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
              <SettingOutlined key="setting" onClick={() => {
                setOpen(true)
                setTimeout(() => {
                  renderPie()//需要放到异步操作中
                }, 0);
              }} />,
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
      <Drawer title="个人数据" placement="right" onClose={onClose} visible={open}>
        <div ref={pieRef} style={{ height: "600px", width: "100%", marginTop: "20px" }} />
      </Drawer>
      <div ref={barRef} style={{ height: "600px", width: "100%", marginTop: "20px" }}></div>
    </div>
  );
};

export default Home;
