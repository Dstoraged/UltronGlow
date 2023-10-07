<template>
  <div class="container-fluid">
    <div class="card" style="margin-top: 40px">
      <div class="card-body">
        <div class="row" style="text-align: left; margin: 0px; padding: 0px">
          <div class="col-md-2" style="padding: 0px; margin: 0px">
            <h4 class="mt-0 header-title" style="width: 100%; text-align: left">
              {{ $t("home.lastoutput") }}
            </h4>
          </div>
          <div class="col-md-10" style="padding: 0px; margin: 0px">
            <p
              class="sub-title"
              style="width: 100%; text-align: left; margin-bottom: 8px"
            >
              {{ $t("wnetlock.currentNumber", [total]) }}
              <span>
                {{ $t("wnetlock.totalreward") }}
                <span style="color: #634790; font-size: 12pt">{{
                  statsTotal.totalAmount
                }}</span>

                {{ $t("wnetlock.amongblockreward") }}
                <span style="color: #005ab5; font-size: 12pt">{{
                  statsTotal.block_totalAmount
                }}</span>
                {{ $t("wnetlock.posrreward") }}
                <span style="color: #003d79; font-size: 12pt">{{
                  statsTotal.storage_totalAmount
                }}</span>

                {{ $t("wnetlock.rentalreward") }}
                <span style="color: #00c4cf; font-size: 12pt">{{
                  statsTotal.rental_totalAmount
                }}</span>

                <!--
              {{ $t("wnetlock.curlock") }}
              <span style="color:#00c4cf; font-size: 12pt;">{{ statsTotal.lockAmount }}</span>
              {{ $t("wnetlock.currelease") }}            
              <span style="color:#1a9a8a; font-size: 12pt;">{{ statsTotal.releaseamount }}</span>    
              -->
              </span>
            </p>
          </div>
        </div>

        <h-tbale
          ref="htableLast24thOutput"
          :table-heard="tableHeard"
          :table-data="tableData"
          :show-right-tools="false"
          :showSubtitle="false"
          :up-load-time="30000"
          table-id="Last24thOutputTableId"
          @inint-ok="tableInit"
          @load="loadTable"
          @colClick="colClick"
        >
          <div
            class="btn-group"
            slot="table_title_right_address"
            slot-scope="scope"
            v-if="scope.type == 'pc'"
          >
            <button
              class="btn btn-secondary btn-sm btn-block"
              style="
                padding: 1px;
                border-radius: 4px;
                margin-left: 6px;
                height: 19px;
              "
              @click="btnNodeAddressPopover(scope.type)"
            >
              <i class="mdi mdi-filter"></i>
            </button>
            <div
              :id="`lvbNodeAddress_${scope.type}`"
              style="
                display: none;
                position: absolute;
                z-index: 999999;
                left: 0;
                top: 30px;
                width: 320px;
                background-color: #ffffff;
                border: #ececec solid 1px;
                padding: 15px;
                border-radius: 4px;
                -webkit-box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.1);
                box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.1);
                border-top: #23cbe0 solid 2px;
              "
            >
              <div>
                <div class="form-group row">
                  <div class="col-sm-12">
                    <input
                      type="text"
                      class="form-control"
                      id="demo"
                      v-model="searchInput"
                      style="width: 100%"
                    />
                  </div>
                </div>
                <div class="popover-footer" style="text-align: center">
                  <button
                    type="button"
                    class="btn btn-primary btn-sm"
                    @click="bntNodeAddressFilter(scope.type)"
                  >
                    <i class="fa fa-filter"></i>{{ $t("comm.filter") }}
                  </button>
                  <button
                    type="button"
                    class="btn btn-primary btn-sm"
                    @click="bntNodeAddressClear(scope.type)"
                  >
                    <i class="fa fa-eraser"></i>{{ $t("comm.clear") }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div
            class="btn-group"
            slot="table_title_right_type"
            slot-scope="scope"
            v-if="scope.type == 'pc'"
          >
            <button
              class="btn btn-secondary btn-sm btn-block"
              style="
                padding: 1px;
                border-radius: 4px;
                margin-left: 6px;
                height: 19px;
              "
              @click="btnTypePopover(scope.type)"
            >
              <i class="mdi mdi-filter"></i>
            </button>
            <div
              :id="`lvType_${scope.type}`"
              style="
                display: none;
                position: absolute;
                z-index: 999999;
                right: 0;
                top: 30px;
                width: 250px;
                background-color: #ffffff;
                border: #ececec solid 1px;
                padding: 15px;
                border-radius: 4px;
                -webkit-box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.1);
                box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.1);
                border-top: #23cbe0 solid 2px;
              "
            >
              <div>
                <div class="form-group row">
                  <div class="col-sm-12">
                    <select class="form-control" v-model="selType">
                      <option value="all"></option>
                      <option value="1">{{ $t("storagereward.type1") }}</option>
                      <!--
                      <option value="3">{{ $t("storagereward.type3") }}</option>
                      -->
                      <option value="5">{{ $t("storagereward.type5") }}</option>
                      <!--                 
                                        <option value="7">{{$t("storagereward.type7")}}</option>
                                         -->
                      <option value="9">{{ $t("storagereward.type9") }}</option>
                      <!--
                      <option value="17">{{ $t("storagereward.type17") }}</option>
                       -->
                    </select>
                  </div>
                </div>
                <div class="popover-footer" style="text-align: center">
                  <button
                    type="button"
                    class="btn btn-primary btn-sm"
                    @click="bntTypeFilter(scope.type)"
                  >
                    <i class="fa fa-filter"></i>{{ $t("comm.filter") }}
                  </button>
                  <button
                    type="button"
                    class="btn btn-primary btn-sm"
                    @click="bntTypeClear(scope.type)"
                  >
                    <i class="fa fa-eraser"></i>{{ $t("comm.clear") }}
                  </button>
                </div>
              </div>
            </div>
          </div>
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
  name: "Last24thOutput",
  components: { HTbale },
  props: {},
  data() {
    let _this_ = this;
      const types = {
      1: "storagereward.type1",
      2: "storagereward.type2",
      3: "storagereward.type3",
      4: "storagereward.type4",
      5: "storagereward.type5",
      6: "storagereward.type6",
      7: "storagereward.type7",
      8: "storagereward.type8",
      9: "storagereward.type9",
      10: "storagereward.typ10",
      11: "storagereward.typ11",
      17: "storagereward.type17",
      18: "storagereward.type18",
      21: "storagereward.type21",
      23: "storagereward.type23",
    };
    return {
      tableHeard: [
        {
          title: "wnetlock.nodeAddress",
          name: "address",
          format: true,
          popover: true,
          isClick: true,
        },
        {
          title: "wnetlock.revenuesaddress",
          name: "revenueaddress",
          format: true,
          popover: true,
          more: true,
        },
        {
          title: "wnetlock.type",
          name: "type",
          valMap(val) {
            return `${_this_.$t(_this_.types[val])}`;
          },
          more: true,
        },
        {
          title: "wnetlock.blockNumber",
          name: "blockNumber",
          more: true,
        },
        {
          title: "wnetlock.reward",
          name: "totalAmount",
          valMap(val) {
            return `${utils.clearZero(val)} UTG`;
          },
        },
        /*
        {
          title: "wnetlock.lockAmount",
          name: "lockAmount",
          valMap(val, item) {
            return `${utils.clearZero((item.totalAmount || 0) - (item.releaseamount || 0))} UTG`;
          },
        },
        {
          title: "wnetlock.leftAmount",
          name: "releaseamount",
          valMap(val) {
            return `${utils.clearZero(val)} UTG`;
          },
        },
        */

        {
          title: "lock.burningratio",
          name: "burntratio",
          minWidth: "100px",
          valMap(val) {
            return `${ utils.weedZero((val || 0) * 100,2) }%`;
          },
          more: true,
          hide: window.$url.burntRatioHide,
        },
        
        {
          title: "wnetlock.unlocktime",
          name: "releaseHeigth",
          valMap(val, item) {
            return `${utils.lockingTime(
              item.startTime,
              item.avgBlockTime,
              item.unLockNumber,
              item.releaseHeigth
            )} ${_this_.$t("lock.day")}`;
          },
          more: true,
        },
      ],
      tableData: [],
      total: 0,
      searchInput: null,
      statsTotal: {
        totalAmount: "0 UTG",
        lockAmount: "0 UTG",
        releaseamount: "0 UTG",
        block_totalAmount: "0 UTG",
        block_lockAmount: "0 UTG",
        block_releaseamount: "0 UTG",
        storage_totalAmount: "4844.606 UTG",
        storage_lockAmount: "0 UTG",
        storage_releaseamount: "0 UTG",
        rental_totalAmount: "0 UTG",
        rental_lockAmount: "0 UTG",
        rental_releaseamount: "0 UTG",
      },
      types,
      selType: "all",
    };
  },

  mounted() {
    this.getStorageRewardStat();
  },
  methods: {
    tableInit(query, pageNum) {
      this.loadTable(query, false, pageNum);
    },
    async loadTable(query, toTop = true, pageNum) {
      if (!query && this.$refs.htableLast24thOutput) {
        query = this.$refs.htableLast24thOutput.tableQuery;
      }

      if (!query) return;    
    
      query.pageNum = pageNum || query.pageNum;
      if (query.pageSize == 0) query.pageSize = 10;
      
      var param = {
        current: query.pageNum,
        size: query.pageSize,
        types: [1, 5, 9],
        last24: true,
      };
      if (this.searchInput !== "" && this.searchInput != null) {
        param.address = this.searchInput;
      }
      if (
        this.selType != "all" &&
        this.selType != null &&
        this.selType != "undefined"
      ) {
        param.types = [this.selType];
      }
      query.loadingShow(param, pageNum);

      await utils.getNowHeight();

      this.searchInput = param.address;
      //this.selType = param.types;

      api
        .postJson("/platform/getStorageRewardList", param)
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
        case "address":
          this.toMinerView(row);
          break;
      }
    },

    goToUrl(name, params) {
      helper.goPathUrl(this, name, params);
    },

    toMinerView(data) {
      if (data.address) {
        if (data.type == 1) {
          helper.goPathUrl(
            this,
            "NodeView",
            `${data.address}_${data.type + 1}`
          );
        }
        if (data.type == 9 || data.type == 5) {
          helper.goPathUrl(this,"StorageDetail", data.address);
        }
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

    btnNodeAddressPopover(type) {
      var dv = "lvbNodeAddress_" + type;
      $("#" + dv).toggle();
    },

    bntNodeAddressFilter(type) {
      var dv = "lvbNodeAddress_" + type;
      $("#" + dv).toggle();
      this.seachData();
    },

    bntNodeAddressClear(type) {
      var dv = "lvbNodeAddress_" + type;
      $("#" + dv).toggle();
      this.searchInput = null;
      this.seachData();
    },

    btnTypePopover(type) {
      var dv = "lvType_" + type;
      $("#" + dv).toggle();
    },

    bntTypeFilter(type) {
      var dv = "lvType_" + type;
      $("#" + dv).toggle();
      this.seachData();
    },

    bntTypeClear(type) {
      var dv = "lvType_" + type;
      $("#" + dv).toggle();
      this.selType = "all";
      this.seachData();
    },

    seachData() {
      this.getStorageRewardStat();
      this.tableInit(null, 1);
    },

    getStorageRewardStat() {
      this.statsTotal.block_totalAmount = "0 UTG";
      this.statsTotal.block_lockAmount = "0 UTG";
      this.statsTotal.block_releaseamount = "0 UTG";
      this.statsTotal.storage_totalAmount = "0 UTG";//"4844.606 UTG";
      this.statsTotal.storage_lockAmount = "0 UTG";
      this.statsTotal.storage_releaseamount = "0 UTG";
      this.statsTotal.rental_totalAmount = "0 UTG";
      this.statsTotal.rental_lockAmount = "0 UTG";
      this.statsTotal.rental_releaseamount = "0 UTG";
      var params = {
        address: this.searchInput,
        //types: [1,3,5,7,9,17],
        types: [1, 5, 9],
        last24: true,
      };
      if (
        this.selType != "all" &&
        this.selType != null &&
        this.selType != "undefined"
      ) {
        params.types = [this.selType];
      }

      api
        .postJson("/platform/getStorageRewardStat", params)
        .then((response) => {
          let result = response.result || {};
          this.statsTotal.totalAmount = `${utils.clearZero(
            result.totalAmount
          )} UTG`;
          this.statsTotal.releaseamount = `${utils.clearZero(
            result.releaseamount
          )} UTG`;
          this.statsTotal.lockAmount = `${utils.clearZero(
            result.totalAmount || 0 - result.releaseamount || 0
          )} UTG`;
          let typelist = result.typelist;
          if (typelist != null) {
            typelist.forEach((item, index) => {
              switch (item.type) {
                case 1:
                  this.statsTotal.block_totalAmount = `${utils.clearZero(
                    item.totalAmount
                  )} UTG`;
                  this.statsTotal.block_releaseamount = `${utils.clearZero(
                    item.releaseamount
                  )} UTG`;
                  this.statsTotal.block_lockAmount = `${utils.clearZero(
                    item.totalAmount - item.releaseamount
                  )} UTG`;
                  break;
                case 5:
                  this.statsTotal.rental_totalAmount = `${utils.clearZero(
                    item.totalAmount
                  )} UTG`;
                  this.statsTotal.rental_releaseamount = `${utils.clearZero(
                    item.releaseamount
                  )} UTG`;
                  this.statsTotal.rental_lockAmount = `${utils.clearZero(
                    item.totalAmount - item.releaseamount
                  )} UTG`;
                  break;
                case 9:                 
                  this.statsTotal.storage_totalAmount = `${utils.clearZero(
                    item.totalAmount
                  )} UTG`;                 
                  this.statsTotal.storage_releaseamount = `${utils.clearZero(
                    item.releaseamount
                  )} UTG`;
                  this.statsTotal.storage_lockAmount = `${utils.clearZero(
                    item.totalAmount - item.releaseamount
                  )} UTG`;
                  break;
              }
            });
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
};
</script>
<style lang="scss" scoped></style>
