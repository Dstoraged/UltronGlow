<template>
  <div class="container-fluid">
    <div class="card" style="margin-top: 40px">
      <div class="card-body">
        <h4 class="mt-0 header-title" style="width: 100%; text-align: left">
          {{ $t("mymanage.producedBlock") }}
        </h4>
        <p class="sub-title" style="width: 100%; text-align: left">
          {{ $t("ftable.totalnumberproduced", [total]) }}
        </p>
        <h-tbale
          ref="htable"
          :table-heard="tableHeard"
          :table-data="tableData"
          :show-right-tools="false"
          :tableId="'ViewBlocks' + this.$store.getters.account"
          :showSubtitle="false"
          @inint-ok="tableInit"
          @load="loadTable"
          @colClick="colClick"
        >
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
  name: "ProducedBlock",
  components: { HTbale },
  props: {},
  data() {
    let _this_ = this;
    return {
      total: 0,
      fblock: "",
      lblock: "",
      searchInput: "",
      tableHeard: [
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
          more: false,
        },
      ],
      tableData: [],
    };
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

      // query.loadingShow();
      if (query.pageSize == 0) query.pageSize = 10;
      var param = {
        current: query.pageNum,
        size: query.pageSize,
        address: this.$store.getters.account,
      };

      /*
      if (this.searchInput !== "" && this.searchInput != null) {
        param.address = this.searchInput;
      }
*/
      query.loadingShow(param, pageNum);
      // this.searchInput=param.address;

      api.postJson("/platform/getBlockList", param).then((response) => {
        query.table_loading = false;

        if (response.statusCode !== 0) {
          Message.error(response.message);
        }
        let re = response.result || {};
        this.tableData = re.records || [];
        if (response.result != null) this.total = response.result.total;
        this.tableData.forEach((item, index) => {
          if (index == 0) this.lblock = item.blockNumber;
          else this.fblock = item.blockNumber;
        });

        setPageQuery(query, re);
        if (toTop && this.tableData.length > 0) {
          query.toTop();
        }
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

  watch: {
    "$store.getters.account": function () {
      this.total = 0;
      this.tableInit(null, 1);
    },
  },
};
</script>
<style lang="scss" scoped></style>
