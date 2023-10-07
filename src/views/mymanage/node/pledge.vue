<template>
  <div class="container-fluid">
    <div class="card" style="margin-top: 40px">
      <div class="card-body">
        <h4 class="mt-0 header-title" style="width: 100%; text-align: left">
          {{ $t("mymanageNode.pledgelog") }}
        </h4>
        <h-tbale
          ref="plegeTable"
          :table-heard="tableHeard"
          :table-data="tableData"
          :show-right-tools="false"
          tableId="plegetableId"
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
  name: "plege",
  components: { HTbale },
  props: {},
  data() {
    let _this_ = this;
    return {
      total: 0,
      gasUsedRate: 20,
      searchInput: null,
      address: "",
      tableHeard: [
        {
          title: "mymanageNode.node",
          name: "param1",
          format: true,
          popover: true,
          isClick: true,
        },
        {
          title: "mymanageNode.pledgenum",
          name: "param4",
          valMap(val) {
            return helper.getDataFormat(val, 18, 10000).toFixed(4) + " UTG";
          },
        },
        {
          title: "mymanageNode.pledgeheight",
          name: "blockNumber",
        },
        {
          title: "mymanageNode.pledgetime",
          name: "timeStamp",
          valMap(val) {
            return helper.formatTime(val / 1000);
          },
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
  },

  methods: {
    tableInit(query, pageNum) {
      this.loadTable(query, false, pageNum);
    },
    loadTable(query, toTop = true, pageNum) {
      if (!query && this.$refs.plegeTable) {
        query = this.$refs.plegeTable.tableQuery;
      }

      if (!query) return;
      query.pageNum = pageNum || query.pageNum;

      query.loadingShow();

      var param = {
        current: query.pageNum,
        size: query.pageSize,
        param1: this.address,
        txType: "CandReq",
      };
      api.postJson("/platform/getTxRecord", param).then((response) => {
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
