import {
  getToken,
  setToken,
  removeToken,
  setValue,
  removeValue,
  getValue,
} from "@/utils/auth";
import * as api from "@/api/api";
import { Message } from "element-ui";
const state = {
  token: getToken(),
  name: "",
  avatar: "",
  introduction: "",
  roles: [],
  username: getValue(),
  permission_path: "",
  id: null,
  locale: "en",
};
const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction;
  },
  SET_NAME: (state, name) => {
    state.name = name;
  },
  SET_USERNAME: (state, username) => {
    state.username = username;
  },
  SET_ID: (state, id) => {
    state.id = id;
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar;
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles;
  },
  SET_PERMISSION_PATH: (state, permission_path) => {
    state.permission_path = permission_path;
  },
  SET_LOCALE: (state, locale) => {
    state.locale = locale;
  },
};
const actions = {
  // user login
  login({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      api
        .userPostJson("/common/login", userInfo)
        .then((response) => {
          if (response.code === "000000") {
            commit("SET_TOKEN", response.data);
            commit("SET_USERNAME", userInfo.userName);
            setToken(response.data);
            setValue("user", userInfo.userName);
            resolve();
          } else {
            Message.error(response.mesg);
          }
        })
        .catch((error) => {
          console.error(error);
          reject(error);
        });
    });
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token, state.username)
        .then((response) => {
          const { data } = response;

          if (!data) {
            reject("login failure！");
          }

          const { name, description, username, id } = data;

          // roles must be a non-empty array
          // if (!roleIds || roleIds.length <= 0) {
          //   reject('getInfo: roles must be a non-null array!')
          // }

          commit("SET_ROLES", ["admin"]);
          commit("SET_NAME", name);
          commit("SET_USERNAME", username);
          commit("SET_ID", id);
          commit(
            "SET_AVATAR",
            "https://avatars3.githubusercontent.com/u/3946731?s=460&v=4"
          );
          commit("SET_INTRODUCTION", description);
          data.roles = ["admin"];
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      commit("SET_TOKEN", "");
      commit("SET_USERNAME", "");
      removeToken();
      removeValue("user");
      resolve();

      /*
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_USERNAME', '')
        removeToken()
        removeUser()
        resolve()
        location.reload() 
      }).catch(error => {
        reject(error)
      })
      */
    });
  },
  // remove token
  resetToken({ commit }) {
    return new Promise((resolve) => {
      commit("SET_TOKEN", "");
      commit("SET_USERNAME", "");
      removeToken();
      removeValue("user");
      resolve();
      location.reload();
    });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
