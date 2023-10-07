<template>
  <div class="container-fluid" style="padding: 0px; margin: 0px">
    <h-tbale
      ref="htable"
      :table-id="'TransactionsList' + accAddr"
      :table-heard="tableHeard"
      :table-data="tableData"
      @inint-ok="tableInit"
      @load="loadTable"
      @colClick="colClick"
    >
      <img
        slot="table_cell_toImg"
        src="@/assets/images/icon_to.png"
        class="thumb-xs ml-2"
        height="21"
        width="21"
      />
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
  name: "TransactionsList",
  components: { HTbale },
  props: {
    accAddr: {
      type: String,
      default: "",
    },
    tableId: {
      type: String,
      default: "TransactionsList",
    },
  },

  data() {
    const types =Object.assign({} ,utils.Transactions);
    let _this_ = this;
    return {
      tableHeard: [
        {
          title: "Transactions.TxnHash",
          name: "hash",
          format: true,
          popover: true,
          isClick: true,
          // minWidth: "220px",
          more: true,
        },
        {
          title: "Transactions.Block",
          name: "blockNumber",
          isClick: true,
          // minWidth: "82px",
          more: true,
        },
        {
          title: "Transactions.Age",
          name: "timeStamp",
          type: "timimg",
          //minWidth: "90px",
          more: true,
        },
        {
          title: "Transactions.From",
          name: "fromAddr",
          format: true,
          popover: true,
          isClick: true,
          // minWidth: "220px",
        },
        {
          title: "",
          titleNotT: true,
          name: "toImg",
          width: "21px",
          minWidth: "21px",
          more: true,
        },
        {
          title: "Transactions.To",
          name: "toAddr",
          format: true,
          popover: true,
          isClick: true,
          // minWidth: "220px",
        },
        {
          title: "Transactions.Value",
          name: "value",
          valMap(val) {
            return `${utils.weedZero(
              helper.getDataFormat(val, 18, 10000),
              8
            )} UTG`;
          },
          // minWidth: "120px",
        },
        {
          title: "Transactions.TxnFee",
          name: "gasUsed",
          //  minWidth: "120px",
          valMap(val, item) {
            return ` ${utils.weedZero(
              helper.getDataFormat(val * item.gasPrice, 18, 10000),
              8
            )} UTG`;
          },
          more: true,
        },
        {
          title: "Transactions.type",
          name: "ufooperator",
          valMap(val) {
            return _this_.$t(types[val || "common"]);
          },
          // minWidth: "160px",
          more: true,
        },
        {
          title: "Transactions.status",
          name: "status",
          isHtml: true,
          valMap(val) {
            if (val) {
              return `<span  style="color: #2ebac6">${_this_.$t(
                "comm.success"
              )}</span>`;
            } else {
              return `<span  style="color: red">${_this_.$t(
                "comm.fail"
              )}</span>`;
            }
          },
          // minWidth: "150px",
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
      console.log("pageNum=" + pageNum);
      this.loadTable(query, false, pageNum);
    },
    loadTable(query, toTop = true, pageNum) {
      if (!this.accAddr) return;
      if (!query && this.$refs.htable) {
        query = this.$refs.htable.tableQuery;
      }
      if (!query) return;
      query.pageNum = pageNum || query.pageNum;

      var params = {
        current: query.pageNum,
        size: query.pageSize,
        addressHash: this.accAddr,
        type: this.tranType,
      };
      query.loadingShow(params, pageNum); 
      api
        .postJson("/platform/getTransactionByAddressHash", params)
        .then((response) => {
          query.loadingHide();

          if (response.statusCode !== 0) {
            Message.error(response.message);
          }
          let re = response.result || {};
          this.tableData = re.records || [];

          setPageQuery(query, re);
          if (toTop && this.tableData.length > 0) {
            query.toTop();
          }
        })
        .catch((error) => {
          query.loadingHide(JSON.stringify(error).includes("timeout") ? 1 : 2);
        });
    },

    colClick(data) {
      let col = data.col || {};
      let row = data.row || {};
      switch (col.name) {
        case "hash":
          this.goToUrl("TxnsInfo", row.hash);
          break;
        case "blockNumber":
          this.goToUrl("BlockDetail", row.blockNumber);
          break;
        case "fromAddr":
          this.goToUrl("AccountDetail", row.fromAddr);
          break;
        case "toAddr":
          this.goToUrl("AccountDetail", row.toAddr);
          break;
      }
    },
    goToUrl(name, params) {
      helper.goPathUrl(this, name, params);
    },
  },
};
</script>
<style lang="scss" scoped>
.cursor {
  cursor: pointer;
}
</style>
