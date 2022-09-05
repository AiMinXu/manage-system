import axios from "axios";
import { store } from '../redux/store'

axios.defaults.baseURL = "http://localhost:5050/"

//拦截器
axios.interceptors.request.use(config => {
  store.dispatch({
    type: "change_loading",
    payload: true
  });
  return config;
}, error => {
  store.dispatch({
    type: "change_loading",
    payload: false
  });
  return Promise.reject(error)
});

axios.interceptors.response.use(response => {
  store.dispatch({
    type: "change_loading",
    payload: false
  });
  return response;
}, error => {
  store.dispatch({
    type: "change_loading",
    payload: false
  });
  return Promise.reject(error);
});
