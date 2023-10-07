<template>
  <div>
    <div class="row" style="padding: 6px; text-align: left">
      <div class="col-md-4 i-ma-sm">
        <p class="sub-title" style="width: 100%; text-align: left">
          {{ $t("ftable.totalnumber", [totalr]) }}
        </p>
      </div>
    </div>
    <h-tbale
      ref="htable"
      :show-subtitle="false"
      :table-id="tableId + address"
      :table-heard="tableHeard"
      :table-data="tableData"
      :show-right-tools="false"
      right-btn-col-width="100px"
      @inint-ok="tableInit"
      @load="loadTable"
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
  components: { HTbale },
  props: {
    address: {
      type: String,
      default: "",
    },
    pledge_address: {
      type: String,
      default: "",
    },
    tableId: {
      type: String,
      default: "storagePoolPledgeRewards_auto",
    },
    toParams: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    let _this_ = this;
    return {
      tableHeard: [
        {
          title: "node.pledgeahash",
          name: "pledge_hash",
          format: true,
          popover: true,
          fnum: 6,
        },
       
        {
          title: "node.pledgeaddress",
          name: "pledge_address",
          format: true,
          popover: true,
          fnum: 6,
        },
        {
          title: "node.pledgeamounte",
          name: "pledge_amount",
          valMap(val) {
            return helper.getDataFormat(val, 18, 10000).toFixed(4) + " UTG";
          },
        },
        
        {
          title: "node.pledgeNumber",
          name: "pledge_number",
          more: true,
        },
       
       
     
        {
          title: "node.pledgetime",
          name: "pledge_time",
          valMap(val) {
            return helper.formatTime(val, 1);
          },
          more: true,
        },
      ],
      tableData: [],
      totalr: 0,
      searchInput: null,
      statsTotalr: {
        totalAmountr: "--",
        releaseamountr: "--",
      },
    };
  },

  watch: {
    address() {
      this.tableInit(null, 1);
    },
    pledge_address: {
      immediate: true,
      handler() {
        this.tableInit(null, 1);
      },
    },
  },
  methods: {
    tableInit(query, pageNum) {
      this.loadTable(query, false, pageNum);
    },
    async loadTable(query, toTop = true, pageNum) {
      if (!query && this.$refs.htable) {
        query = this.$refs.htable.tableQuery;
      }
      if (!query) return;
      query.pageNum = pageNum || query.pageNum;

      var params = {
        current: query.pageNum,
        size: query.pageSize,
        // type: 23,
        isEt: 1,
        node_address: this.address,
        pledge_address: this.pledge_address,
      };

      query.loadingShow(); // { searchs: this.searchs.data });

      api
        .postJson("/platform/getNodePledgeList", params)
        .then((response) => {
          query.loadingHide();

          if (response.statusCode !== 0) {
            Message.error(response.message);
          }
          let re = response.result || {};
          let tableData = re.records || [];

          this.tableData = tableData;
          setPageQuery(query, re);
          this.totalr = re.total || 0;
          if (toTop && this.tableData.length > 0) {
            query.toTop();
          }
        })
        .catch((error) => {
          query.loadingHide(JSON.stringify(error).includes("timeout") ? 1 : 2);
        });
    },

    formatTime(time) {
      return helper.formatTimimg(time);
    },
    getAddrFormat(data, number) {
      return helper.getAddrFormat(data, number);
    },
    goToUrl(name, params) {
      helper.goPathUrl(this, name, params);
    },

    toMinerView(data) {
      if (data.address) {
        helper.goPathUrl(this, "MinerView", `${data.address}_${data.type}`);
      }
    },
    toRelease(data) {
      if (data.address && data.type) {
        helper.goPathUrl(
          this,
          "releaseList",
          `${data.address}_${data.type + 1}_${data.blockNumber}_${
            data.revenue_address
          }`
        );
      }
    },

    seachData() {
      this.tableInit(null, 1);
    },
  },
};
</script>
<style lang="scss" scoped></style>
