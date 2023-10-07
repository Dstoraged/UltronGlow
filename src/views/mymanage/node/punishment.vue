<template>
  <div class="container-fluid">
    <div class="card" style="margin-top: 40px">
      <div class="card-body">
        <h4 class="mt-0 header-title" style="width: 100%; text-align: left">
          {{ $t("mymanageNode.penaltyscorelog") }}
        </h4>
        <h-tbale
          ref="punishmentTable"
          :table-heard="tableHeard"
          :table-data="tableData"
          :show-right-tools="false"
          tableId="punishmenttableId"
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
import utils from "@/utils/utils";
import * as api from "@/api/api";
import * as helper from "@/utils/helper";
import HTbale from "@/components/modules/HTbale.vue";
import { setPageQuery } from "@/utils/table.js";
export default {
  name: "punishment",
  components: { HTbale },
  props: {},
  data() {
    let _this_ = this;
    return {
      total: 0,
      searchInput: null,
      address: "",
      account: "",
      tableHeard: [
        {
          title: "mymanageNode.payaddress",
          name: "param1",
          format: true,
          popover: true,
          isClick: true,
        },
        {
          title: "mymanageNode.paynumber",
          name: "param3",
          valMap(val) {
            return utils.isEmpty(val) ? "" : `${val}`;
          },
        },
        {
          title: "mymanageNode.utgnumber",
          name: "param4",
          valMap(val) {
            return utils.clearZero(val, 4);
          },
        },
        {
          title: "mymanageNode.paytime",
          name: "timeStamp",
          valMap(val) {
            return helper.formatTime(val / 1000);
          },
          more: true,
        },
        {
          title: "mymanageNode.payheight",
          name: "blockNumber",
          more: true,
        },
      ],
      tableData: [],
    };
  },

  created() {
    this.address = this.$route.params.id;
    if (!this.address) {
      return;
    }

    this.account = this.$route.params.id;
    if (!this.account) {
      return;
    }
  },

  methods: {
    tableInit(query, pageNum) {
      this.loadTable(query, false, pageNum);
    },
    loadTable(query, toTop = true, pageNum) {
      if (!query && this.$refs.punishmentTable) {
        query = this.$refs.punishmentTable.tableQuery;
      }

      if (!query) return;
      query.pageNum = pageNum || query.pageNum;

      query.loadingShow();

      var param = {
        current: query.pageNum,
        size: query.pageSize,
        param1: this.account,
        txType: "CandPnsh",
      };
      api.postJson("/platform/getTxRecord", param).then((response) => {
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
      });
    },
    colClick(data) {
      let col = data.col || {};
      let row = data.row || {};
      switch (col.name) {
        case "param1":
          this.goToUrl("AccountDetail", row.param1);
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
