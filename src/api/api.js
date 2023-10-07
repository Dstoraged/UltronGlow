import ajax from "@/utils/ajax";

const witUrl = window.$url.BASE_URL;
const userUrl = window.$url.USER_URL;
const miningUrl = window.$url.MINING_URL;

export function post(uri, params, timeouts = 300000, type = 0) {
  return ajax.post(witUrl + uri, params, timeouts);
}

export function postJson(uri, params, timeouts = 300000, type = 0) {
  return ajax.postJson(witUrl + uri, params, timeouts);
}

export function postForm(uri, params, timeouts = 300000, type = 0) {
  return ajax.postForm(witUrl + uri, params, timeouts);
}

export function get(uri, params, timeouts = 300000, type = 0) {
  return ajax.get(witUrl + uri, params, timeouts);
}

export function userPost(uri, params, timeouts = 300000, type = 0) {
  return ajax.post(userUrl + uri, params, timeouts);
}

export function userPostJson(uri, params, timeouts = 300000, type = 0) {
  return ajax.postJson(userUrl + uri, params, timeouts);
}

export function userGet(uri, params, timeouts = 300000, type = 0) {
  return ajax.get(userUrl + uri, params, timeouts);
}

export function miningPost(uri, params, timeouts = 300000, type = 0) {
  return ajax.post(miningUrl + uri, params, timeouts);
}

export function miningPostJson(uri, params, timeouts = 300000, type = 0) {
  return ajax.postJson(miningUrl + uri, params, timeouts);
}

export function miningGet(uri, params, timeouts = 300000, type = 0) {
  return ajax.get(miningUrl + uri, params, timeouts);
}
