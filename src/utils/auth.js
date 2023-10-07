import Cookies from "js-cookie";

const TokenKey = "ADMIN-TOKEN";

export function getToken() {
  return Cookies.get(TokenKey);
}

export function setToken(token) {
  return Cookies.set(TokenKey, token);
}

export function removeToken() {
  return Cookies.remove(TokenKey);
}

export function getCookie(value) {
  return Cookies.get(value);
}

export function setCookie(key, value) {
  return Cookies.set(key, value);
}

export function getLanguage(value) {
  //return Cookies.get(value);
  return window.localStorage.getItem(value)
}

export function setLanguage(key, value) {
  //return Cookies.set(key, value);
  return window.localStorage.setItem(key, value)
}

export function getUser(value) {
  return Cookies.get(value);
}

export function setUser(key, value) {
  return Cookies.set(key, value);
}

export function removeUser(value) {
  return Cookies.remove(value);
}

export function getUserName(UserName) {
  return Cookies.get(UserName);
}

export function setUserName(UserName, name) {
  return Cookies.set(UserName, name);
}
export function removeUserName(UserName) {
  return Cookies.remove(UserName);
}

export function getValue(value) {
  return Cookies.get(value);
}

export function setValue(key, value) {
  return Cookies.set(key, value);
}

export function removeValue(value) {
  return Cookies.remove(value);
}
