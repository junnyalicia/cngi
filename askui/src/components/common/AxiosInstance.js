import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://cngi.mta.nwafu.edu.cn/api/v2'
});
export default axiosInstance;
