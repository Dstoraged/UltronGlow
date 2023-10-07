<template>
  <h-tbale
    ref="htable"
    :show-subtitle="true"
    :up-load-time="30000"
    :table-heard="tableHeard"
    :table-data="tableData"
    :show-right-tools="false"
    right-btn-col-width="100px"
    @inint-ok="tableInit"
    @load="loadTable"
  >
  </h-tbale>
</template>
<script>
import { Message } from "element-ui";
import * as api from "@/api/api";
import * as helper from "@/utils/helper";
import utils from "@/utils/utils";
import HTbale from "@/components/modules/HTbale.vue";
import { setPageQuery } from "@/utils/table.js";
export default {
  components: { HTbale },
  props: {
    txType: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    tableId: {
      type: String,
      default: "storagePooltxnsRecords_auto",
    },
    label:{
      type: String,
      default:""
    }
  },
  data() {
    let _this_ = this;
    return {
      tableHeard: [
        {
          title: "storagePool.txHash",
          name: "hash",
          format: true,
          popover: true,
          minWidth: "180px",
        },

        {
          title: "storagePool.settingTime",
          name: "timeStamp",
          minWidth: "90px",

          valMap(val) {
            return helper.formatTime(val || 0, 1);
          },
        },

        {
          title: "storagePool.settingHeight",
          name: "blockNumber",

          minWidth: "110px",
        },
        {
          title: this.label,
          name: "param2",
          valMap(val){
            return `${val||0} %` 
          },
          minWidth: "110px",
        },
        {
          title: "Transactions.TxnFee",
          name: "handFee",
          valMap(val, item) {
            let gasUsed = item.gasUsed || 0;
            let gasPrice = item.gasPrice || 0;
            return `${utils.weedZero(
              helper.getDataFormat(gasUsed * gasPrice, 18, 10000),
              8
            )}  UTG`;
          },
        },

        {
          title: "storagePool.activeStatus",
          name: "status",
          isHtml: true,
          valMap(val) {
            return `${val}` == "1"
              ? `<span  style="color: #2ebac6">${_this_.$t(
                  "comm.success"
                )}</span>`
              : `<span  style="color: red">${_this_.$t("comm.fail")}</span>`;
          },
          more: true,
        },
      ],
      tableData: [],
      totalr: 0,
    };
  },
  mounted() {
    this.getStorageRentalRewardStat();
  },
  watch: {
    txType() {
      this.tableInit(null, 1);
    },
    address() {
      this.tableInit(null, 1);
    },
  },
  methods: {
    tableInit(query, pageNum) {
      this.loadTable(query, false, pageNum);
    },
    async loadTable(query, toTop = true, pageNum) {
      if (!query && this.$refs.htable) {
        query = this.$refs.htable.tableQuery;
      }
      if (!query) return;
      query.pageNum = pageNum || query.pageNum;

      var params = {
        current: query.pageNum,
        size: query.pageSize,
        txType: this.txType,
        fromAddr: this.address,
        //  param1:this.address
      };

      //query.loadingShow();
      query.loadingShow(params, pageNum);

      // await utils.getNowHeight();
      api
        .postJson("/platform/getTxRecord", params)
        .then((response) => {
          query.loadingHide();

          if (response.statusCode !== 0) {
            Message.error(response.message);
          }
          let re = response.result || {};
          let tableData = re.records || [];

          this.tableData = tableData;
          setPageQuery(query, re);
          this.totalr = re.total || 0;
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
    getAddrFormat(data, number) {
      return helper.getAddrFormat(data, number);
    },
    goToUrl(name, params) {
      helper.goPathUrl(this, name, params);
    },

    seachData() {
      this.tableInit(null, 1);
    },
  },
};
</script>
<style lang="scss" scoped></style>
