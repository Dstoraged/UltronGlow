<template>
  <div class="container-fluid">
    <div class="card" style="margin-top: 40px">
      <div class="card-body">
        <div class="row" style="padding: 6px; text-align: left">
          <div class="col-md-4">
            <h4 class="mt-0 header-title" style="width: 100%; text-align: left">
              {{ $t("token.title20") }}
            </h4>
            <p class="sub-title" style="width: 100%; text-align: left">
              {{ $t("token.current20Number", [total]) }}
            </p>
          </div>
          <div class="col-md-4">
            <div class="input-group" style="margin: 0 auto">
              <input type="text" class="form-control" :placeholder="$t('token.addressSearch')" id="demo"
                v-model="searchInput" @keyup.enter="tableInit(null, 1)" style="border-right: 0px; width: 60%" />
              <div class="input-group-append">
                <button class="btn btn-block waves-effect waves-light" type="button" @click="tableInit(null, 1)"
                  style="background-color: #d4d4d4">
                  {{ $t("comm.search") }}
                </button>
              </div>
            </div>
          </div>
        </div>
        <h-tbale ref="htableViewToken" :table-heard="tableHeard" :table-data="tableData" :show-right-tools="false"
          tableId="ViewTokentableId" :showSubtitle="false" @inint-ok="tableInit" @load="loadTable" @colClick="colClick">
        </h-tbale>
      </div>
    </div>
  </div>
</template>
<script>
import { Message } from "element-ui";
import { setValue } from "@/utils/auth";
import * as api from "@/api/api";
import * as helper from "@/utils/helper";
import HTbale from "@/components/modules/HTbale.vue";
import { setPageQuery } from "@/utils/table.js";
export default {
  name: "ViewToken",
  components: { HTbale },
  props: {},
  data() {
    let _this_ = this;
    return {
      tableHeard: [
        {
          title: "token.contract",
          name: "contract",
          format: true,
          popover: true,
          isClick: true,
        },
        {
          title: "token.token",
          name: "name",
        },
        {
          title: "token.Abbreviation",
          name: "symbol",
        },
        {
          title: "token.decimals",
          name: "decimals",
          more: true,
        },
        {
          title: "token.totalNumber",
          name: "totalSupply",
          valMap(val, item) {
            return helper.getDataFormat(val || 0, item.decimals, 10000).toFixed(0);           
          },
        },
        {
          title: "token.addressNumber",
          name: "accountTotal",
          more: true,
        },
        /*
        {
          title: "contracts.balance",
          name: "balance",
          valMap(val) {
            return helper.getDataFormat(val, 18, 10000).toFixed(4) + " UTG";
          },
          more: true,
        },
        */

/*
        {
          title: "contracts.txns",
          name: "txcount",
          more: true,
        },

*/
        
        {
           title: "token.transfers",
           name: "txcount",
           more: true,
         },
        

      ],
      tableData: [],
      total: 0,

      message: {},
      searchInput: "",
    };
  },
  created() {
    this.message = this.$route.params;
    setValue("accAddr", "");
    setValue("accInfo", "");
  },

  methods: {
    tableInit(query, pageNum) {
      this.loadTable(query, false, pageNum);
    },
    loadTable(query, toTop = true, pageNum) {
      if (!query && this.$refs.htableViewToken) {
        query = this.$refs.htableViewToken.tableQuery;
      }
      if (!query) return;
      query.pageNum = pageNum || query.pageNum;
      if (query.pageSize == 0) query.pageSize = 10;
      //query.loadingShow();

      var param = {
        current: query.pageNum,
        size: query.pageSize,
        type: 0, //0:mrc20,1:721
      };

      if (this.searchInput !== "" && this.searchInput != null) {
        param.search = this.searchInput;
      }

      query.loadingShow(param, pageNum);
      this.searchInput = param.search;

      api
        .postJson("/platform/getTokensInfo", param)
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
          this.goToUrl("token", row.contract + "_" + row.type);
          break;
      }
    },

    goToUrl(name, params) {
      setValue("accAddr", JSON.stringify(params));
      setValue("accInfo", JSON.stringify(params));
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
