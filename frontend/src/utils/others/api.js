import axios from "axios";

const instance = axios.create({
  baseURL: `http://35.234.13.143:80/`,
});

export default instance;
