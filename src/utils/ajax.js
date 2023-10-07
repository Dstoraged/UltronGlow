import axios from "axios";
import qs from "qs";
import store from "../store";
import { getToken, getLanguage } from "@/utils/auth";


axios.interceptors.request.use(
  (config) => {
    // if (store.getters.token) {
    //   config.headers['token'] = getToken()
    // }

    config.headers["token"] = getToken();
    config.headers["Accept-Language"] = getLanguage("locale");
    return config;
  },
  (error) => {
    console.log(error);
    Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    return response && response.data ? response.data : response;
  },

  (error) => {
    return Promise.reject(error);
  }
);

const request = (method, url, data, timeouts) => {
  console.log("timeouts=" + timeouts);
  const configData = {
    baseURL: process.env.BASE_API,
    withCredentials: true,
    url,
    timeout: timeouts, //60000
  };
  if (method === "GET") {
    configData.method = "get";
    configData.params = data;
  } else if (method === "POST") {    
    configData.method = "post";
    configData.headers = {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    };
    configData.data = qs.stringify(data);
  } else if (method === "POST_JSON") {  
    configData.method = "post";
    configData.headers = { "Content-Type": "application/json" };
    configData.data = data;
  } else if (method === "POST_FORM") {
    configData.method = "post";
    configData.headers = { "Content-Type": "multipart/form-data" };
    configData.data = data;
  }

  return axios(configData);
};

class Ajax {
  get = (url, data = {}, timeouts) => {
    return request("GET", url, data, timeouts);
  };

  post = (url, data = {}, timeouts) => {
    return request("POST", url, data, timeouts);
  };

  postJson = (url, data = {}, timeouts) => {
    return request("POST_JSON", url, data, timeouts);
  };

  postForm = (url, data = {}, timeouts) => {
    return request("POST_FORM", url, data, timeouts);
  };
}

export default new Ajax();
