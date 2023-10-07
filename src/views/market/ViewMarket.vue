<template>
  <div class="container-fluid">
    <div class="card" style="margin-top: 40px">
      <div class="card-body">
        <div class="row" style="padding: 6px; text-align: left">
          <div class="col-md-4">
            <h4 class="mt-0 header-title" style="width: 100%; text-align: left">
              {{ $t("market.title") }}
            </h4>
          </div>
          <div class="col-md-4">
            <div class="input-group" style="margin: 0 auto">
              <input type="text" class="form-control" :placeholder="$t('market.SearchAddress')" id="demo"
                v-model="searchInput" @keyup.enter="tableInit()" style="border-right: 0px; width: 60%" />
              <div class="input-group-append">
                <button class="btn btn-block waves-effect waves-light" type="button" @click="tableInit(null, 1)"
                  style="background-color: #d4d4d4">
                  {{ $t("comm.search") }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <h-tbale ref="htable" :table-heard="tableHeard" :table-data="tableData" :show-right-tools="true"
          :up-load-time="30000" table-id="ViewMarketTableId" @inint-ok="tableInit" @load="loadTable"
          @colClick="colClick">
          <el-button slot="rightCol" slot-scope="scope" type="text" size="mini"
            :disabled="scope.data.pledgeStatus !== 0 " @click="goToUrlHire(scope.data.deviceAddr)" class="equal-width">{{
                $t("market.hire")
            }}</el-button>
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
  name: "ViewMarket",
  components: { HTbale },
  props: {},
  data() {
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
          title: "market.revenuesaddress",
          name: "revenueAddr",
          format: true,
          popover: true,
          isClick: true,
          more: true,
        },
        {
          title: "market.totalspace",
          name: "declareSpace",

          valMap(val) {
            return utils.bytesToSize(val || 0);
          },
          more: true,
        },
        {
          title: "market.rentedspace",
          name: "rentedspace",
          valMap(val, item) {
            return utils.bytesToSize(item.declareSpace - item.freeSpace);
          },
          more: true,
        },
        {
          title: "market.availablespace",
          name: "freeSpace",
          valMap(val) {
            if (val >= (1024 * 1024 * 1024 * 5))
              return utils.bytesToSize((val-(1024 * 1024 * 1024 * 5)) || 0);
            else
              return utils.bytesToSize(0);  
          },
        },
        {
          title: "market.bandwidth",
          name: "bwSize",
          valMap(val) {
            return utils.isEmpty(val) ? "" : `${val} Mbps`;
          },
          more: true,
        },

        {
          title: "market.rentalprice",
          name: "rentPrice",
          valMap(val) {
            let valL = utils.CutZero(
              helper
                .getDataFormatDecimal(
                  val,
                  18,
                  _this_.rdecimal,
                  _this_.rent_decimal
                )
                .toFixed(_this_.rent_decimal || 4)
            );

            return `${valL} ${_this_.$t("storagerental.priceunit")}`;
          },
        },
      ],
      tableData: [],
      searchInput: null,
      rent_decimal: 4,
      rdecimal: 10000,
      loadSetOk: false,
    };
  },

  methods: {
    tableInit(query, pageNum) {
      this.loadTable(query, false, pageNum);
    },
    loadTable(query, toTop = true, pageNum) {
      if (!this.loadSetOk) {
        this.loadData();
        return;
      }

      if (!query && this.$refs.htable) {
        query = this.$refs.htable.tableQuery;
      }
      if (!query) return;
      query.pageNum = pageNum || query.pageNum;
      //sessionStorage.setItem("currentPage", query.pageNum);

      var param = {
        current: query.pageNum,
        size: query.pageSize,
        status: 0,
      };

      if (this.searchInput !== "" && this.searchInput != null) {
        //param.device_addr=this.searchInput;
        param.addr = this.searchInput;
      }
      //query.loadingShow();

      query.loadingShow(param, pageNum);
      this.searchInput = param.addr;

      api
        .postJson("/platform/getStorageSpaceList", param)
        .then((response) => {
          query.loadingHide();

          if (response.statusCode !== 0) {
            Message.error(response.message);
          }
          let re = response.result || {};
          this.tableData = re.records || [];

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
        case "revenueAddr":
          this.goToUrl("RewardDetail", row.revenueAddr);
          break;
      }
    },

    SizeNoUnits(bytes) {
      return (bytes / (1024 * 1024 * 1024)).toFixed(0);
    },

    goToUrl(name, params) {
      helper.goPathUrl(this, name, params);
    },
    goToUrlHire(contract) {
      if (contract) {
        helper.goPathUrl(this, "mymanage/marketrental", contract);
      }
    },
    loadData() {
      api
        .postJson("/platform/getStorageBasicSet", {})
        .then((response) => {
          let result = response.result;
          this.rent_decimal = Number(result["10"] || 4);
          this.switchDecimal(this.rent_decimal);
          if (!this.loadSetOk) {
            this.loadSetOk = true;
            this.tableInit();
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
    switchDecimal(val) {
      switch (val) {
        case 0:
          this.rdecimal = 1;
          break;
        case 1:
          this.rdecimal = 1;
          break;
        case 2:
          this.rdecimal = 100;
          break;
        case 3:
          this.rdecimal = 1000;
          break;
        case 4:
          this.rdecimal = 10000;
          break;
        case 5:
          this.rdecimal = 100000;
          break;
        case 6:
          this.rdecimal = 1000000;
          break;
        case 7:
          this.rdecimal = 10000000;
          break;
        case 8:
          this.rdecimal = 100000000;
          break;
        case 9:
          this.rdecimal = 1000000000;
          break;
        case 10:
          this.rdecimal = 10000000000;
          break;
        default:
          this.rdecimal = 10000;
      }
    },
  },
};
</script>
<style lang="scss" scoped>

</style>
