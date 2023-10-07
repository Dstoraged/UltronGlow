import Vue from "vue";
export function newTableData() {
  return {
    query: {
      sortBy: "", 
      descending: false, 
      pageNum: 1, 
      totalPages: 0,
      total: 0, 
      pageSize: 10, 
      table_loading: false,
    },
    data: [],
  };
}

/**
 * 
 * @param {*} query
 * @param {*} pagination
 */
export function setPageQuery(query, pagination) {
  if (query && pagination) {
    let names = ["pageNum", "totalPages", "total", "pageSize"];
    let keys = {
      pageSize: "size",
      pageNum: "current",
      totalPages: "pages",
    };

    names.forEach((key) => {
      let keyL = keys[key] || key;
      let val = Number(pagination[keyL] || 0);

      Vue.set(query, key, val);
    });
  }
}

export default {
  newTableData,
  setPageQuery,
};
