<template>
  <div class="container-fluid">
    <h-tbale
      ref="rewardTable"
      :table-heard="tableRewardHeard"
      :table-data="tableData"
      :show-right-tools="false"
      :tableId="'ExtractRecordstableId' + contract"
      :showSubtitle="false"
      @inint-ok="tableInit"
      @load="loadTable"
      @colClick="colClick"
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
  name: "ExtractRecords",
  components: { HTbale },
  props: {
    contract: {
      type: String,
      default: "",
    },
  },
  data() {
    let _this_ = this;
    return {
      tableRewardHeard: [
        {
          title: "Transactions.TxnHash",
          name: "txhash",
          format: true,
          popover: true,
        },
        {
          title: "contract.extractAccount",
          name: "address",
          format: true,
          popover: true,
        },
        {
          title: "contract.withdrawalAmount",
          name: "pickupamount",
          valMap(val) {
            return (
              utils.weedZero(helper.getDataFormat(val, 18, 10000), 8) + " UTG"
            );
          },
        },
        {
          title: "comm.time",
          name: "createtime",
          valMap(val) {
            return helper.formatTime(val, 1);
          },
        },
      ],
      tableData: [],
    };
  },

  watch: {
    contract: {
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
      if (!query && this.$refs.rewardTable) {
        query = this.$refs.rewardTable.tableQuery;
      }

      if (!query) return;
      query.pageNum = pageNum || query.pageNum;

      // query.loadingShow();

      var param = {
        current: query.pageNum,
        size: query.pageSize,
        contract: this.contract,
        type: 2,
      };

      query.loadingShow(param, pageNum);
     
      api
        .postJson("/platform/getContractLockupList", param)
        .then((response) => {
          query.table_loading = false;

          if (response.statusCode !== 0) {
            Message.error(response.message);
          }
          let re = response.result || {};
          this.tableData = re.records || [];

          setPageQuery(query, re);
          if (toTop && this.tableData.length > 0) {
            query.toTop();
          }
        }) .catch((error) => {
          query.loadingHide(JSON.stringify(error).includes("timeout") ? 1 : 2);
        });
    },
    colClick(data) {
      let col = data.col || {};
      let row = data.row || {};
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
