<template>
  <div class="container-fluid">
    <div class="card" style="margin-top: 40px">
      <div class="card-body">
        <h4 class="mt-0 header-title" style="width: 100%; text-align: left">
          <span>{{ $t("mymanageNode.payrecord") }} </span>
        </h4>
        <p class="sub-title" style="width: 100%; text-align: left">
          {{ $t("ftable.totalnumber", [total]) }}
        </p>
        <h-tbale ref="PayRecordTable" :table-heard="tableHeard" :table-data="tableData" :show-right-tools="false"
          :tableId="'PayRecordtableId' + this.$store.getters.account+this.param.param1" :showSubtitle="false" @inint-ok="tableInit"
          @load="loadTable" @colClick="colClick">
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
  name: "PayRecord",
  components: { HTbale },
  props: {
    param: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    let _this_ = this;
    return {
      total: 0,
      searchInput: null,
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

  methods: {
    tableInit(query, pageNum) {
      this.loadTable(query, false, pageNum);
    },
    loadTable(query, toTop = true, pageNum) {
      if (!query && this.$refs.PayRecordTable) {
        query = this.$refs.PayRecordTable.tableQuery;
      }

      if (!query) return;
      query.pageNum = pageNum || query.pageNum;

      // query.loadingShow();

      var params = {
        current: query.pageNum,
        size: query.pageSize,
        fromAddr: this.$store.getters.account,
        txType: "CandReq",
      };
      
      Object.assign(params, this.param);

      query.loadingShow(params, pageNum);

      api.postJson("/platform/getTxRecord", params).then((response) => {
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
<style lang="scss" scoped>

</style>
