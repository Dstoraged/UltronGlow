<template>
  <div>
    
    <h-tbale
      ref="locktable"
      :table-heard="tableHeard"
      :table-data="tableData"
      :show-right-tools="false"
      :showSubtitle="true"
      :up-load-time="30000"
      :table-id="tableId + address"
      @inint-ok="locktableInit"
      @load="loadlockTable"
      @colClick="colClick"
    >
      <template slot="table_cell_pledge_status" slot-scope="scope">
        <span v-if="scope.data.pledge_status == 1" style="color: #2ebac6">
          {{ $t(plestauts[scope.data.pledge_status]) }}
        </span>
        <span v-else style="color: #b6b6b4">
          {{ $t(plestauts[scope.data.pledge_status]) }}
        </span>
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
  name: "stwtpgList",
  components: { HTbale },
  props: {
    address: {
      type: String,
      default: "",
    },
    tableId: {
      type: String,
      default: "stwtpgList_auto",
    },
  },
  data() {
    let _this_ = this;
    const plestauts = {
      0: "node.plestatus0",
      1: "node.plestatus1",
    };

    return {
      plestauts,
      tableHeard: [
        {
          title: "node.pledgeahash",
          name: "pledge_hash",
          format: true,
          popover: true,
          isClick: true,
          fnum: 12,
        },
        /*{
          title: "node.pledgeaddress",
          name: "pledge_address",
          format: true,
          popover: true,
          fnum: 15,
        },*/
        {
          title: "node.address",
          name: "node_address",
          format: true,
          popover: true,
          isClick: true,
          fnum: 12,
        },
        {
          title: "market.pledgetime",
          name: "time",
        },
        {
          title: "node.pledgeNumber",
          name: "pledge_number",
          more: true,
        },

        {
          title: "node.pledgeamounte",
          name: "pledge_amount",

          more: true,
        },
        {
          title: "node.pledgestatus",
          name: "pledge_status",

          more: true,
        }
      ],
      tableData: [],
      total: 0,
      statsTotal: {
        burntAmount: "--",
      },
      isMobile: utils.isMobile(),
      selType: "all",
    };
  },

  methods: {
    locktableInit(query, pageNum = 1) {
      this.loadlockTable(query, false, pageNum);
    },
    loadlockTable(query, toTop = true, pageNum) {
      if (!this.address || !this.$store.getters.account) return;

      if (!query && this.$refs.locktable) {
        query = this.$refs.locktable.tableQuery;
      }
      if (!query) return;
      query.pageNum = pageNum || query.pageNum;
      if (query.pageSize == 0) query.pageSize = 10;

      var param = {
        current: query.pageNum,
        size: query.pageSize,
        etType: "SN",
        node_address: this.address,
        pledge_address: this.$store.getters.account,
      };

      if (
        this.selType != "all" &&
        this.selType != null &&
        this.selType != "undefined"
      ) {
        param.types = [this.selType];
      }

      query.loadingShow(param, pageNum);

      api
        .postJson("/platform/getNodePledgeList", param)
        .then((response) => {
          
         query.loadingHide();

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
        case "address":
          break;
      }
    },
  },
  watch: {
    "$store.getters.account": {
      immediate: true,
      handler() {
        this.locktableInit(null, 1);
      },
    },
  },
};
</script>
<style lang="scss" scoped>
.cursor {
  cursor: pointer;
}
</style>
