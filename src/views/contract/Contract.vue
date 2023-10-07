<template>
  <div class="container-fluid">
    <div class="card" style="margin-top: 40px">
      <div class="card-body">
        <div class="row" style="padding: 6px; text-align: left">
          <div class="col-md-4">
            <h4 class="mt-0 header-title" style="width: 100%; text-align: left">
              {{ $t("contracts.contract") }}
            </h4>
            <p class="sub-title" style="width: 100%; text-align: left">
              {{ $t("contracts.currentTokenNumber", [total]) }}
            </p>
          </div>
          <div class="col-md-4">
            <div class="input-group" style="margin: 0 auto">
              <input
                type="text"
                class="form-control"
                :placeholder="$t('contracts.addrSearch')"
                id="demo"
                v-model="searchInput"
                @keyup.enter="tableInit(null, 1)"
                style="border-right: 0px; width: 60%"
              />
              <div class="input-group-append">
                <button
                  class="btn btn-block waves-effect waves-light"
                  type="button"
                  @click="tableInit(null, 1)"
                  style="background-color: #d4d4d4"
                >
                  {{ $t("comm.search") }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <h-tbale
          ref="contractHTable"
          :table-heard="tableHeard"
          :table-data="tableData"
          :show-right-tools="false"
          tableId="ContracttableId"
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
import utils from "@/utils/utils";
import HTbale from "@/components/modules/HTbale.vue";
import { setPageQuery } from "@/utils/table.js";
export default {
  name: "Contract",
  components: { HTbale },
  props: {},
  data() {
    let _this_ = this;
    return {
      tableHeard: [
        {
          title: "contracts.tokenAddress",
          name: "contract",
          format: true,
          popover: true,
          isClick: true,
        },
        {
          title: "Transactions.Block",
          name: "blocknumber",
          more: true,
          isClick: true,
        },
        /*
        {
          title: "Transactions.Age",
          name: "createtime",
          valMap(val) {
            return `${helper.formatTimimg(val)}${_this_.$t("comm.before")}`;
          },
          more: true,
        },
        */
        {
          title: "contracts.contractname",
          name: "contractname",
          valMap(val, item) {
            return val === null || typeof val == "undefined" ? item.name : val;
          },
        },
        /*
         {
          title: "contracts.Abbreviation",
          name: "symbol",                
        },
        */
        {
          title: "contracts.compiler",
          name: "compiler",
          valMap(val) {
            return "Solidity";
          },
          more: true,
        },
        {
          title: "contracts.version",
          name: "version",
          more: true,
        },
        {
          title: "contracts.balance",
          name: "balance",
          valMap(val) {
            return helper.getDataFormat(val, 18, 10000).toFixed(4) + " UTG";
          },
        },
        {
          title: "contracts.txns",
          name: "txcount",
        },
        {
          title: "contracts.verified",
          name: "verifydate",
          valMap(val) {
            return val === null || typeof val == "undefined"
              ? ""
              : helper.formatTime(val, 1);
          },
          more: true,
        },
        {
          title: "contracts.contractCreator1",
          name: "author",
          popover: true,
          format: true,
          more: true,
        },

        /*
         {
           title: "contracts.deploymenttime",
           name: "createtime",
           valMap(val) {
             return (val === null || typeof (val) == 'undefined') ? '' : helper.formatTime(val, 1);
           },
           more: true,
         },
        */

        /*
        {
          title: "contracts.owner",
          name: "admin1",
           more: true,
        },
        */
      ],
      tableData: [],
      total: 0,
      searchInput: null,
      ownerflag: false,
    };
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
      if (query.pageSize == 0) query.pageSize = 10;
      var param = {
        current: query.pageNum,
        size: query.pageSize,
      };
      if (this.searchInput !== "" && this.searchInput != null) {
        param.contract = this.searchInput;
      }

      query.loadingShow(param, pageNum);
      this.searchInput = param.contract;

      api
        .postJson("/platform/getContractList", param)
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
        case "contract":
          this.goToUrl("ContractInfo", row);
          break;
        case "blocknumber":
          this.goToBlockUrl("BlockDetail", row.blocknumber);
          break;
      }
    },

    goToBlockUrl(name, params) {
      helper.goPathUrl(this, name, params);
    },

    goToUrl(name, data) {
      helper.goPathUrl(this, name, `${data.contract}_${data.contractname}`);      
    },
  },
};
</script>
<style lang="scss" scoped>
.cursor {
  pointer-events: auto;
  cursor: pointer;
}
</style>
