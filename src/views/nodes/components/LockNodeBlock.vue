<template>
  <div>
    <h4 class="mt-0 header-title" style="width: 100%; text-align: left">
      <p class="sub-title" style="width: 100%; text-align: left">
        {{ $t("home.currentBlockNumber", [totalb]) }}
      </p>
    </h4>
    <h-tbale
      ref="LockNodeBockhtable"
      :table-heard="lockNodeBockTableHeard"
      :table-data="lockNodeBocktableData"
      :show-right-tools="false"
      :tableId="'LockNodeBocktableId' + node_addr"
      :showSubtitle="false"
      @inint-ok="tableInitlockNodeBock"
      @load="loadTableLockNodeBock"
      @colClick="colClick"
    >
    </h-tbale>
  </div>
</template>
<script>
import { Message } from "element-ui";
import * as api from "@/api/api";
import * as helper from "@/utils/helper";
import HTbale from "@/components/modules/HTbale.vue";
import { setPageQuery } from "@/utils/table.js";
export default {
  name: "LockNodeBock",
  components: { HTbale },
  props: {
    node_addr: {
      type: String,
      default: "",
    },
  },
  data() {
    let _this_ = this;
    return {
      lockNodeBockTableHeard: [
        {
          title: "block.block",
          name: "blockNumber",
          isClick: true,
        },
        {
          title: "block.Age",
          name: "timeStamp",
          valMap(val) {
            return `${helper.formatTimimg(val)}${_this_.$t("comm.before")}`;
          },
        },
        {
          title: "block.Txn",
          name: "blockTransactionCount",
        },
        /*
        {
          title: "block.Miner",
          name: "minerAddress",
          format: true,
          popover: true,
          isClick: true,
        },
        */
        {
          title: "block.GasUsed",
          name: "gasUsed",
          valMap(val, item) {
            let gasUsedRate =
              Math.floor((item.gasUsed / item.gasLimit) * 10000) / 100;
            return `${val}(${gasUsedRate})%`;
          },
          more: true,
        },
        {
          title: "block.GasLimit",
          name: "gasLimit",
          more: true,
        },
        {
          title: "block.GasPrice",
          name: "avgGasPrice",
          valMap(val) {
            return `${helper.getDataFormat(val, 9)} Gwei`;
          },
          more: true,
        },
        {
          title: "block.reward",
          name: "reward",
          valMap(val) {
            return helper.getDataFormat(val, 18, 10000).toFixed(4) + " UTG";
          },
          more: true,
        },
      ],
      lockNodeBocktableData: [],
      totalb: 0,
      searchInput: null,
    };
  },
  watch: {
    node_addr: {
      immediate: true,
      handler(id) {
        console.log(id);
       // this.tableInitlockNodeBock(null, 1);
      },
    },
  },
  methods: {
    tableInitlockNodeBock(query, pageNum) {
      this.loadTableLockNodeBock(query, false, pageNum);
    },
    loadTableLockNodeBock(query, toTop = true, pageNum) {
      if (!query && this.$refs.LockNodeBockhtable) {
        query = this.$refs.LockNodeBockhtable.tableQuery;
      }
      if (!query) return;
      query.pageNum = pageNum || query.pageNum;

      if (query.pageSize == 0) query.pageSize = 10;
      //query.loadingShow();

      var param = {
        current: query.pageNum,
        size: query.pageSize,
        //address: this.node_addr,
        mineraddress: this.node_addr,
      };
      /*
      if (this.searchInput !== "" && this.searchInput != null) {
        param.address = this.searchInput;
      }
    */
      query.loadingShow(param, pageNum);
    

      api
        .postJson("/platform/getBlockList", param)
        .then((response) => {
          query.table_loading = false;

          if (response.statusCode !== 0) {
            Message.error(response.message);
          }
          let re = response.result || {};
          this.lockNodeBocktableData = re.records || [];
          if (response.result != null) this.totalb = response.result.total;

          setPageQuery(query, re);
          if (toTop && this.lockNodeBocktableData.length > 0) {
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
        case "blockNumber":
          this.goToUrl("BlockDetail", row.blockNumber);
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
