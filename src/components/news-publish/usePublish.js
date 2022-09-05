import { useEffect, useState } from 'react';
import axios from 'axios';
import { notification } from 'antd'

function usePublish(type) {
  const [dataSource, setDataSource] = useState([])
  const { username } = JSON.parse(localStorage.getItem("token"))

  useEffect(() => {
    axios.get(`/news?author=${username}&publishState=${type}&_expand=category`).then(res => {
      // console.log(res.data);
      setDataSource(res.data)
    })
  }, [username, type])

  const publishHandle = (id) => {
    setDataSource(dataSource.filter(data => data.id !== id))
    axios.patch(`news/${id}`, {
      publishState: 2,
      publishTime: Date.now()
    }).then(res => {
      notification.success({
        message: "已发布",
        description: "请您到发布管理下的已发布查看"
      })
    })
  }
  const sunsetHandle = (id) => {
    setDataSource(dataSource.filter(data => data.id !== id))
    axios.patch(`news/${id}`, {
      publishState: 3
    }).then(res => {
      notification.success({
        message: "已下线",
        description: "请您到发布管理下的已下线查看"
      })
    })
  }
  const deleteHandle = (id) => {
    // console.log(item);
    setDataSource(dataSource.filter(data => data.id !== id))
    axios.delete(`news/${id}`, {
      publishState: 2
    }).then(res => {
      notification.success({
        message: "已删除",
        description: "已经成功删除"
      })
    })
  }
  return {
    dataSource,
    publishHandle,
    sunsetHandle,
    deleteHandle
  };
};

export default usePublish;
