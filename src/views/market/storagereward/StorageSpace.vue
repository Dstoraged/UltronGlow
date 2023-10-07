<template>
  <div>
    <h4 class="mt-0 header-title" style="width: 100%; text-align: left">
      <p class="sub-title" style="width: 100%; text-align: left">
        {{ $t("market.totalnumber", [total]) }}
      </p>
    </h4>
    <h-tbale
      ref="StorageSpaceHTable"
      :table-heard="tableHeard"
      :table-data="tableData"
      :show-right-tools="false"
      :tableId="'StorageSpacetableId'+revenueAddr"
      :showSubtitle="false"
      @inint-ok="tableInit"
      @load="loadTable"
      @colClick="colClick"
    >
      <template slot="table_cell_pledgeStatus" slot-scope="scope">
        <div v-html="pledgeStatusSpan(scope.data.pledgeStatus)"></div>

        
      <!--  <span v-if="scope.data.pledgeStatus == -1" style="color: #ff0000">
          {{ $t(types[scope.data.pledgeStatus]) }}
        </span>
        <span v-else-if="scope.data.pledgeStatus == 0" style="color: #00caca">
          {{ $t(types[scope.data.pledgeStatus]) }}
        </span>
        <span v-else-if="scope.data.pledgeStatus == 1" style="color: #adadad">
          {{ $t(types[scope.data.pledgeStatus]) }}
        </span>
        <span v-else-if="scope.data.pledgeStatus == 5" style="color: #ffff93">
          {{ $t(types[scope.data.pledgeStatus]) }}
        </span>
        <span v-else-if="scope.data.pledgeStatus == 6" style="color: #ffe153">
          {{ $t(types[scope.data.pledgeStatus]) }}
        </span>
        <span v-else style="color: #6c6c6c">
          {{ $t(types[scope.data.pledgeStatus]) }}
        </span>-->
      </template>
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
  name: "StorageSpace",
  components: { HTbale },
  props: {
    revenueAddr: {
      type: [String],
      default: "",
    },
    type: {
      type: Number,
      default: 0,
    },
    devflag: {
      type: Number,
      default: 0,
    },
    status: {
      type: Number,
      default: 0,
    },
  },
  data() {
    const types = {
      "-1": "market.status-1",
      0: "market.status0",
      1: "market.status1",
      5: "market.status5",
      6: "market.status6",
    };
    let _this_ = this;
    return {
      tableHeard: [
        {
          title: "market.deviceaddress",
          name: "deviceAddr",
          format: true,
          popover: true,
          isClick: true,
        },
        {
          title: "market.totalspace",
          name: "declareSpace",
          valMap(val) {
            return utils.bytesToSize(val || 0);
          },
        },
        {
          title: "market.availablespace",
          name: "freeSpace",
          valMap(val) {
            return utils.bytesToSize(val || 0);
          },
        },
        {
          title: "market.bandwidth",
          name: "bwSize",
          valMap(val) {
            return utils.isEmpty(val) ? "" : `${val}  Mbps`;
          },
          more: true,
        },
        {
          title: "market.pledgeamount",
          name: "pledgeAmount",
          valMap(val) {
            return helper.getDataFormat(val, 18, 10000).toFixed(4) + " UTG";
          },
          more: true,
        },
        {
          title: "market.pledgestatus",
          name: "pledgeStatus",
          more: true,
        },
        {
          title: "storagespace.collecttime",
          name: "instime",
          valMap(val) {
            return helper.formatTime(val, 1);
          },
          more: true,
        },
      ],
      tableData: [],
      total: 0,
      searchInput: null,
      types,
      selStatus: "",
    };
  },

  methods: {
    pledgeStatusSpan(val){
      return utils.getPledgeStatus(val).span
    },
    tableInit(query, pageNum) {
      this.loadTable(query, false, pageNum);
    },
    loadTable(query, toTop = true, pageNum) {
      if (!query && this.$refs.StorageSpaceHTable) {
        query = this.$refs.StorageSpaceHTable.tableQuery;
      }

      if (!query) return;
      query.pageNum = pageNum || query.pageNum;

      //  query.loadingShow();

      var param = {
        current: query.pageNum,
        size: query.pageSize,
        status: this.status,
        revenue_addr: this.revenueAddr,
      };

      query.loadingShow(param, pageNum);     

      api
        .postJson("/platform/getStorageSpaceList", param)
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
      switch (col.name) {
        case "deviceAddr":
          this.goToUrl("StorageDetail", row.deviceAddr);
          break;
      }
    },

    goToUrl(name, params) {
      helper.goPathUrl(this, name, params);
    },

    goToUrlDetail(name, data) {
      if (data.deviceAddr) {
        helper.goPathUrl(this, name, `${data.deviceAddr}_${data.storageid}`);
      }
    },

    goToUrlHire(contract) {
      console.log("params=" + contract);
      if (contract) {
        helper.goPathUrl(this, "mymanage/marketrental", contract);
      }
    },
  },
};
</script>
<style lang="scss" scoped></style>
