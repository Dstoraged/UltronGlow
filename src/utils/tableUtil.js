export const createTable = function () {
  return {
    pageSize: 10,
    current: 1,
    total: 0,
    totalPages: 0,
  };
};

export const setTable = function (re = { total: 0, current: 1 }, query) {
  query.total = re.total || 0;
  query.totalPages = re.pages || 0;
};
