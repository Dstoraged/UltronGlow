<template>
  <div class="container-fluid" v-show="tableData.length > 0">
    <div class="card" style="margin-top: 40px">
      <div class="card-body">
        <h4 class="mt-0 header-title" style="width: 100%; text-align: left">
          <span>{{ $t("home.transactions") }}</span>
        </h4>
        <h-tbale
          ref="rewardTable"
          :table-heard="tableRewardHeard"
          :table-data="tableData"
          :show-right-tools="false"
          :tableId="'BlockReward' + blocknum"
          :showSubtitle="false"
          @inint-ok="tableInit"
          @load="loadTable"
          @colClick="colClick"
        >
          <template slot="table_cell_status" slot-scope="scope">
            <span v-if="scope.data.status == 1" style="color: #2ebac6">{{
              $t("comm.success")
            }}</span>
            <span v-else style="color: red; margin-right: 20px"
              >{{ $t("comm.fail") }}
            </span>
          </template>
          <img
            slot="table_cell_img"
            src="@/assets/images/icon_to.png"
            class="thumb-xs ml-2"
            height="21"
            width="21"
          />
        </h-tbale>
      </div>
    </div>
  </div>
</template>
<script>
import { Message } from "element-ui";
import * as api from "@/api/api";
import * as helper from "@/utils/helper";
import HTbale from "@/components/modules/HTbale.vue";
import { setPageQuery } from "@/utils/table.js";
export default {
  name: "BlockReward",
  components: { HTbale },
  props: {
    blocknum: {
      type: String,
      default: "0",
    },
  },

  data() {
    let _this_ = this;
    return {
      tableRewardHeard: [
        {
          title: "Transactions.TxnHash",
          name: "hash",
          format: true,
          popover: true,
          isClick: true,
        },
        {
          title: "Transactions.Block",
          name: "blockNumber",
          more: true,
        },
        {
          title: "Transactions.Age",
          name: "timeStamp",
          valMap(val) {
            return `${helper.formatTimimg(val)}${_this_.$t("comm.before")}`;
          },
          more: true,
        },
        {
          title: "Transactions.From",
          name: "fromAddr",
          format: true,
          popover: true,
          isClick: true,
        },
        {
          title: "",
          titleNotT: true,
          name: "img",
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
        },
        {
          title: "Transactions.Value",
          name: "value",
          valMap(val) {
            return helper.getDataFormat(val, 18, 10000).toFixed(4) + " UTG";
          },
          more: true,
        },
        {
          title: "Transactions.TxnFee",
          name: "gasUsed",
          valMap(val, item) {
            return (
              helper.getDataFormat(val * item.gasPrice, 18, 10000).toFixed(4) +
              " UTG"
            );
          },
          more: false,
        },
        {
          title: "Transactions.status",
          name: "status",
        },
      ],
      tableData: [],
    };
  },

  watch: {
    blocknum: {
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

      //query.loadingShow();

      var param = {
        current: query.pageNum,
        size: query.pageSize,
        blockNumber: this.blocknum,
      };

      query.loadingShow(param, pageNum);    

      api
        .postJson("/platform/getTransactionByBlockNumber", param)
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
<style lang="scss" scoped></style>
