<template>
  <div class="container-fluid">
    <div class="card" style="margin-top: 40px">
      <div class="card-body">
        <h4 class="mt-0 header-title" style="width: 100%; text-align: left">
          {{ $t("market.posrprooftran") }}
        </h4>
        <p class="sub-title" style="width: 100%; text-align: left">
          {{ $t("market.totalnumber", [total]) }}
        </p>

        <h-tbale
          ref="PosrProofTransHTable"
          :table-heard="tableHeard"
          :table-data="tableData"
          :show-right-tools="false"
          :tableId="'PosrProofTranstableId'+accAddr"
          :showSubtitle="false"
          @inint-ok="tableInit"
          @load="loadTable"
          @colClick="colClick"
        >
          <template slot="table_cell_blockDays" slot-scope="scope">
            <span v-if="scope.data.blockDays == 0" style="color: #2ebac6">
              {{ $t("market.curentday") }}
            </span>
            <span v-else style="color: #2ebac6">
              {{ scope.data.blockDays }} {{ $t("market.days") }}
              {{ $t("comm.before") }}
            </span>
          </template>

          <template slot="table_cell_param1" slot-scope="scope">
            <span v-if="scope.data.param1 == 'succ'" style="color: #2ebac6">
              {{ $t("comm.success") }}
            </span>
            <span v-else style="color: red; margin-right: 20px">{{
              $t("comm.fail")
            }}</span>
          </template>
        </h-tbale>
      </div>
    </div>
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
  name: "PosrProofTrans",
  components: { HTbale },
  props: {},

  data() {
    const types = Object.assign({} ,utils.Transactions);
    let _this_ = this;
    return {
      total: 0,
      tranType: 0,
      types,
      accAddr: "",
      tableHeard: [
        {
          title: "Transactions.Hash",
          name: "hash",
          format: true,
          popover: true,
        },
        {
          title: "market.deviceaddress",
          name: "fromAddr",
          format: true,
          popover: true,
        },
        {
          title: "Transactions.Block",
          name: "blockNumber",
        },
        {
          title: "market.vaildTime",
          name: "blockDays",
        },
        {
          title: "market.vaildStatus",
          name: "param1",
        },
      ],
      tableData: [],
    };
  },

  created() {
    this.accAddr = this.$route.params.id;
  },

  methods: {
    tableInit(query, pageNum) {
      this.loadTable(query, false, pageNum);
    },
    loadTable(query, toTop = true, pageNum) {
      if (!query && this.$refs.contractHTable) {
        query = this.$refs.contractHTable.tableQuery;
      }

      if (!query) return;
      query.pageNum = pageNum || query.pageNum;

      //query.loadingShow();

      var param = {
        current: query.pageNum,
        size: query.pageSize,
        fromAddr: this.accAddr,
        type: this.tranType,
        ufooperator: "stProof",
      };

      query.loadingShow(param, pageNum);   

      api
        .postJson("/platform/getTransactionList", param)
        .then((response) => {
          query.table_loading = false;

          if (response.statusCode !== 0) {
            Message.error(response.message);
          }
          let re = response.result || {};
          this.tableData = re.records || [];
          if (response.result != null) this.total = response.result.total;
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
