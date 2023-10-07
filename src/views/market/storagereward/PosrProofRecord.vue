<template>
  <div>
    <h-tbale
      ref="htable"
      :show-subtitle="true"
      :table-id="'PosrProofRecord' + accAddr"
      :table-heard="tableHeard"
      :table-data="tableData"
      :show-right-tools="false"
      right-btn-col-width="100px"
      @inint-ok="tableInit"
      @load="loadTable"
      :up-load-time="0"
    >
    </h-tbale>
  </div>
</template>
<script>
import { Message } from "element-ui";
import * as api from "@/api/api";
import * as helper from "@/utils/helper";
import utils from "@/utils/utils";
import HTbale from "@/components/modules/HTbale.vue";
import { setPageQuery } from "@/utils/table.js";
export default {
  name: "PosrProofRecord",
  components: { HTbale },
  props: {
    accAddr: {
      type: String,
      default: "",
    },

    tableId: {
      type: String,
      default: "PosrProofRecord_l",
    },
  },

  data() {
    const types = Object.assign({} ,utils.Transactions);
    let _this_ = this;
    return {
      tableHeard: [
        {
          title: "Transactions.Hash",
          name: "hash",
          format: true,
          popover: true,
          minWidth: "180px",
        },
        {
          title: "market.deviceaddress",
          name: "fromAddr",
          format: true,
          popover: true,
          minWidth: "180px",
        },

        {
          title: "Transactions.Block",
          name: "blockNumber",
          minWidth: "110px",
          more: true,
        },

        {
          title: "market.vaildTime",
          name: "blockDays",
          minWidth: "140px",
          isHtml: true,
          valMap(val, item) {
            if (item.blockDays == 0) {
              return `<span style="color: #2ebac6">${_this_.$t(
                "market.curentday"
              )}</span>`;
            } else {
              return `<span style="color: #2ebac6">${
                item.blockDays
              } ${_this_.$t("market.days")}${_this_.$t("comm.before")}</span>`;
            }
          },
        },
        {
          title: "market.vaildStatus",
          name: "vaildStatus",
          minWidth: "120px",
          isHtml: true,
          valMap(val, item) {
            if (item.param1 == "succ") {
              return `<span style="color: #2ebac6">${_this_.$t(
                "comm.success"
              )}</span>`;
            } else {
              return `<span style="color: red; margin-right: 20px">${_this_.$t(
                "comm.fail"
              )}</span>`;
            }
          },
        },
      ],
      tableData: [],
      tranType: 0,
      types,
    };
  },
  watch: {
    accAddr: {
      immediate: true,
      handler(id) {
        console.log(id);
        this.tableInit(null, 1);
      },
    },
  },
  methods: {
    tableInit(query, pageNum) {
      this.loadTable(query, false, pageNum);
    },
    loadTable(query, toTop = true, pageNum) {
      if (!query && this.$refs.htable) {
        query = this.$refs.htable.tableQuery;
      }
      if (!query) return;
      query.pageNum = pageNum || query.pageNum;

      var params = {
        current: query.pageNum,
        size: query.pageSize,
        fromAddr: this.accAddr,
        type: this.tranType,
        ufooperator: "stProof",
      };
      //query.loadingShow();

      query.loadingShow(params, pageNum);      
      api
        .postJson("/platform/getTransactionList", params)
        .then((response) => {
          query.loadingHide();

          if (response.statusCode !== 0) {
            Message.error(response.message);
          }
          let re = response.result || {};
          let tableData = re.records || [];

          this.tableData = tableData;
          setPageQuery(query, re);
          this.totalRq = re.total || 0;
          if (toTop && this.tableData.length > 0) {
            query.toTop();
          }
        })
        .catch((error) => {
          query.loadingHide(JSON.stringify(error).includes("timeout") ? 1 : 2);
        });
    },

    formatTime(time) {
      return helper.formatTimimg(time);
    },

    formatTimes(time) {
      return helper.formatTime(time, 1);
    },

    getAddrFormat(data, number) {
      return helper.getAddrFormat(data, number);
    },

    goToUrl(name, params) {
      console.log("params=" + params);
      helper.goPathUrl(this, name, params);
    },
  },
  watch: {
    accAddr: function () {
      this.tableInit(null, 1);
    },
  },
};
</script>
<style lang="scss" scoped>
.cursor {
  cursor: pointer;
}
</style>
