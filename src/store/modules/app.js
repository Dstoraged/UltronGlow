const app = {
  state: {
    device: "desktop",
    statusStyle: 0,
  },

  mutations: {
    TOGGLE_DEVICE: (state, device) => {
      state.device = device;
    },

    SET_STATUS_STYLE: (state, style) => {
      state.statusStyle = style;
    },
  },
  actions: {
    ToggleDevice({ commit }, device) {
      commit("TOGGLE_DEVICE", device);
    },

    SetStatusStyle({ commit }, style) {
      commit("SET_STATUS_STYLE", style);
    },
  },
};

export default app;
