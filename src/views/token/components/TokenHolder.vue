<template>
  <div class="container-fluid">
    <h-tbale ref="TokenHolderHTable" :table-heard="tableHeard" :table-data="tableData" :show-right-tools="false"
      :tableId="'TokenHoldertableId' + contract" :showSubtitle="true" @inint-ok="tableInit" @load="loadTable"
      @colClick="colClick">
      <span slot="top_subtitle" class="phone_font_12">
        {{ $t("token.currentHoldersNumber", [total]) }}
      </span>

      <template slot="table_cell_percentage" slot-scope="scope">
        <div>
          <span>{{scope.data.percentages}}%</span>
          <el-progress :percentage="scope.data.percentages" :show-text="false"></el-progress>          
        </div>       
      </template>
    </h-tbale>
  </div>
</template>
<script>
import { Message } from "element-ui";
import { setValue } from "@/utils/auth";
import utils from "@/utils/utils";
import * as api from "@/api/api";
import * as helper from "@/utils/helper";
import HTbale from "@/components/modules/HTbale.vue";
import { setPageQuery } from "@/utils/table.js";
export default {
  name: "TokenHolder",
  components: { HTbale },
  props: {
    contract: {
      type: String,
      default: "",
    },
    decimals: {
      type: Number,
      default: 18,
    },

    totalsupply: {
      type: Number,
      default: 0,
    },
     type: {
      type: Number,
      default: 0,
    },
  },
  data() {
    let _this_ = this;
    return {
      tableHeard: [
        {
          title: "accounts.addr",
          name: "address",
          format: true,
          popover: true,
        },
        {
          title: "token.quantity",
          name: "balance",
          valMap(val) {
            return helper.getDataFormat(val, _this_.decimals, 10000).toFixed(4);
          },

          hide: this.type == 2  ,
        },

         {
          title: "token.quantity",
          name: "quantity", 
          hide: (this.type == 0 || this.type == 1),
        },

        {
          title: "token.percentage",
          name: "percentage",
          /*
          valMap(val, item) {
            return `${utils.weedZero(((item.balance || 0) / _this_.totalsupply) * 100, 4)}%`;
          },
          */
        }
      ],
      tableData: [],
      total: 0,
    };
  },

  watch: {
    contract: {
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
      if (!query && this.$refs.NodeRewardHTable) {
        query = this.$refs.NodeRewardHTable.tableQuery;
      }

      if (!query) return;
      query.pageNum = pageNum || query.pageNum;
      if (query.pageSize == 0) query.pageSize = 10;
      //query.loadingShow();

      var param = {
        current: query.pageNum,
        size: query.pageSize,
        address: this.contract,
      };

      query.loadingShow(param, pageNum);

      if(this.type == 2){
         api
        .postJson("/platform/getTokenHolderList", param)
        .then((response) => {
          query.table_loading = false;

          if (response.statusCode !== 0) {
            Message.error(response.message);
          }
          let re = response.result || {};
          this.tableData = re.records || [];
          let tableData = re.records || [];
          tableData.forEach((item) => {            
            item.percentages =this.totalsupply>0 ? Number(utils.weedZero(((item.quantity || 0) / this.totalsupply) * 100, 4)):0;                 
          });
          this.tableData = tableData;
          if (response.result != null) this.total = response.result.total;
          setPageQuery(query, re);
          if (toTop && this.tableData.length > 0) {
            query.toTop();
          }
        })
        .catch((error) => {
          query.loadingHide(JSON.stringify(error).includes("timeout") ? 1 : 2);
        });
      }
      else{
      api
        .postJson("/platform/getAddressInfoList", param)
        .then((response) => {
          query.table_loading = false;

          if (response.statusCode !== 0) {
            Message.error(response.message);
          }
          let re = response.result || {};
          this.tableData = re.records || [];
          let tableData = re.records || [];
          tableData.forEach((item) => {            
            item.percentages =this.totalsupply>0 ? Number(utils.weedZero(((item.balance || 0) / this.totalsupply) * 100, 4)):0;                 
          });
          this.tableData = tableData;
          if (response.result != null) this.total = response.result.total;
          setPageQuery(query, re);
          if (toTop && this.tableData.length > 0) {
            query.toTop();
          }
        })
        .catch((error) => {
          query.loadingHide(JSON.stringify(error).includes("timeout") ? 1 : 2);
        });
      }
    },
    colClick(data) {
      let col = data.col || {};
      let row = data.row || {};
      switch (col.name) {
        case "node_address":
          this.toMinerView(row, 1);
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
