<template>
  <div>
    <h4 class="mt-0 header-title" style="width: 100%; text-align: left">
      <p class="sub-title" style="width: 100%; text-align: left">
        {{ $t("storagerental.totalnumber", [totalRq]) }}
      </p>
    </h4>

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
      @colClick="colClick"
      :up-load-time="0"
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
import { number } from 'echarts/lib/export';
export default {
  name: "StorageRequest",
  components: { HTbale },
  props: {
    address: {
      type: String,
      default: "",
    },
    tableId: {
      type: String,
      default: "StorageRequest_my",
    },

    rent_decimal: {
      type:Number,
      default: 4,
    },
    rdecimal: {
      type: Number,
      default: 10000,
    },
  },

  data() {
    const types = {
      "-1": "storagerental.status7",
      0: "storagerental.status0",
      1: "storagerental.status1",
      2: "storagerental.status2",
      3: "storagerental.status3",
      4: "storagerental.status4",
      5: "storagerental.status5",
      6: "storagerental.status6",
    };

    const reqtypes = {
      stRent: "storagerental.reqtype1",
      stReNew: "storagerental.reqtype2",
      stRescind: "storagerental.reqtype3",
      stRentPg: "storagerental.reqtype4",
      stReNewPg: "storagerental.reqtype5",
      stReq: "storagerental.reqtype6",
    };
    const reqStatuses = {
      0: "storagerental.reqstatus0",
      1: "storagerental.reqstatus1",
      2: "storagerental.reqstatus2",
      3: "storagerental.reqstatus3",
    };
    let _this_ = this;
    return {
      tableHeard: [
        {
          title: "storagerental.renthash",
          name: "rentHash",
          format: true,
          popover: true,
          isClick: true,
          minWidth: "180px",
        },
        {
          title: "storagerental.reqtype",
          name: "reqType",
          minWidth: "120px",
          valMap(val) {
            return _this_.$t(_this_.reqtypes[val || ""] || "");
          },
        },

        {
          title: "storagerental.reqnumber",
          name: "reqNumber",
          minWidth: "110px",
          more: true,
        },

        {
          title: "storagerental.rentspace",
          name: "reqSpace",
          minWidth: "140px",
          valMap(val) {
            return utils.bytesToSize(val);
          },
          more: true,
        },
        {
          title: "storagerental.rentalprice",
          name: "rentPrice",
          minWidth: "120px",
          valMap(val, item) {
            return `${utils.CutZero(
              helper
                .getDataFormatDecimal(
                  item.rentPrice,
                  18,
                  _this_.rdecimal,
                  _this_.rent_decimal
                )
                .toFixed(_this_.rent_decimal)
            )} ${_this_.$t("storagerental.priceunit")}`;
          },
        },
        {
          title: "storagerental.rentalduration",
          name: "rentTime",
          minWidth: "100px",
          valMap(val) {
            return `${val} ${_this_.$t("storagerental.timeunit")}`;
          },
        },

        {
          title: "storagerental.totalrent",
          name: "rentAmount",
          minWidth: "130px",
          valMap(val, item) {
            return `${helper
              .getDataFormat(item.rentAmount, 18, 10000)
              .toFixed(4)} SRT`;
          },
          more: true,
        },
        {
          title: "storagerental.reqstatus",
          name: "reqStatus",
          minWidth: "160px",
          valMap(val) {
            return _this_.$t(_this_.reqStatuses[val || ""] || "");
          },
        },
      ],
      tableData: [],

      pageSizeRq: 10,
      pageRq: 1,
      totalRq: 0,
      totalPageRq: 0,
      requestList: [],
      loadText: this.$t("comm.clickLoad"),
      fblock: "",
      lblock: "",
      searchInput: null,
      types,
      reqtypes,
      reqStatuses,
      /*
      rent_decimal: 4,
      rdecimal: 10000,
      */
      loadDataOk: false,
    };
  },
  watch: {
    address: {
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
      /*
      if (!this.loadDataOk) {
        this.loadData();
        return;
      }
      */

      if (!query && this.$refs.htable) {
        query = this.$refs.htable.tableQuery;
      }
      if (!query) return;
      query.pageNum = pageNum || query.pageNum;

      var params = {
        current: query.pageNum,
        size: query.pageSize,
        device_addr: this.address,
        req_types: ["stRent", "stReNew", "stRescind"],
      };
      //query.loadingShow();
      query.loadingShow(params, pageNum);     
      api
        .postJson("/platform/getStorageRequestList", params)
        .then((response) => {
          query.loadingHide();

          if (response.statusCode !== 0) {
            Message.error(response.message);
          }
          let re = response.result || {};
          let tableData = re.records || [];

          this.tableData = tableData;
          setPageQuery(query, re);
          this.totalRq = re.total || 0;
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
        case "rentHash":
          this.goToUrl("mymanage/rentdetail", row.rentHash);
          break;
        case "blockNumber":
          this.goToUrl("BlockDetail", row.blockNumber);
          break;
        case "deviceAddr":
          this.goToUrl("storagedetail", row.deviceAddr);
          break;
      }
    },

    formatTime(time) {
      return helper.formatTimimg(time);
    },
    getAddrFormat(data, number) {
      return helper.getAddrFormat(data, number);
    },
    goToUrl(name, params) {
      console.log("params=" + params);
      helper.goPathUrl(this, name, params);
    },

    loadData() {
      api
        .postJson("/platform/getStorageBasicSet", {})
        .then((response) => {
          if (!this.loadDataOk) {
            let result = response.result;
            this.rent_decimal = Number(result["10"] || 4);
            this.switchDecimal(this.rent_decimal);
            this.loadDataOk = true;
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
  watch: {
    "$store.getters.account": function () {
      this.tableInit(null, 1);
    },
  },
};
</script>
<style lang="scss" scoped></style>
