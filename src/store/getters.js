const getters = {
  avatar: (state) => state.user.avatar,
  statusStyle: (state) => state.app.statusStyle,
  sidebar: (state) => state.app.sidebar,
  size: (state) => state.app.size,
  device: (state) => state.app.device,
  visitedViews: (state) => state.tagsView.visitedViews,
  cachedViews: (state) => state.tagsView.cachedViews,
  token: (state) => state.user.token,
  name: (state) => state.user.name,
  username: (state) => state.user.username,
  id: (state) => state.user.id,
  introduction: (state) => state.user.introduction,
  roles: (state) => state.user.roles,
  permission_routes: (state) => state.permission.routes,
  errorLogs: (state) => state.errorLog.logs,
  nacosServer: (state) => state.api.nacosServer,
  sentinelDashboard: (state) => state.api.sentinelDashboard,
  mossServer: (state) => state.api.mossServer,
  swaggerApi: (state) => state.api.swaggerApi,
  buttons: (state) => state.permission.buttons,
  permission_path: (state) => state.user.permission_path,
  locale: (state) => state.user.locale,
  language: (state) => state.user.language,
  cartCount: (state) => state.user.cartCount,
  email: (state) => state.user.email,
  isSupplementComplete: (state) => state.user.isSupplementComplete,
  account: (state) => state.wallet.account,
  accounty: (state) => state.wallet.accounty,
  getsdk: (state) => state.wallet.sdk,
  publicWin: (state) => state.wallet.win,
  publicItem: (state) => state.wallet.item,
  typesColor: (state) => state.wallet.typesColor,
  typesText: (state) => state.wallet.typesText,
};
export default getters;
