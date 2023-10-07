<template>
  <div class="container-fluid">
    <div class="card" style="margin-top: 40px">
      <div class="card-body">
        <div class="row" style="padding: 6px; text-align: left">
          <div class="col-md-7">
            <h4 class="mt-0 header-title" style="width: 100%; text-align: left">
              {{ $t("menu.storagerewarddetails") }}
            </h4>
            <p class="sub-title" style="width: 100%; text-align: left">
            <div>
              {{ $t("lock.currentNumber", [total]) }}
              {{ $t("lock.curlock") }}
              <span style="color: #00c4cf; font-size: 12pt">{{
                statsTotal.lockAmount
              }}</span>
              {{ $t("lock.currelease") }}
              <span style="color: #1a9a8a; font-size: 12pt">{{
                statsTotal.releaseamount
              }}</span>
            </div>
            <div>
              {{ $t("lock.totalreward") }}
              <span style="color: #00A600; font-size: 12pt">{{
                statsTotal.totalAmount
              }}</span>
              {{ $t("lock.posrreward") }}
              <span style="color: #02C874; font-size: 12pt">{{
                statsTotal.storage_totalAmount
              }}</span>
              {{ $t("lock.rentalreward") }}
              <span style="color: #00c4cf; font-size: 12pt">{{
                statsTotal.rental_totalAmount
              }}</span>
            </div>
            <div>
              {{ $t("lock.totalBurnt") }}
              <span style="color: #2828FF; font-size: 12pt">{{
                statsTotal.burntamount
              }}</span>
              {{ $t("lock.posrBurnt") }}
              <span style="color: #6A6AFF; font-size: 12pt">{{
                statsTotal.posr_burntamount
              }}</span>
              {{ $t("lock.rentalBurnt") }}
              <span style="color: #00c7cf; font-size: 12pt">{{
                statsTotal.post_burntamount
              }}</span>
            </div>
            </p>
          </div>
          <div class="col-md-4">
            <div class="input-group" style="margin: 0 auto">
              <input type="text" class="form-control" :placeholder="$t('lock.addressSearch')" id="demo"
                v-model="searchInput" @keyup.enter="seachData(1)" style="border-right: 0px; width: 60%" />
              <div class="input-group-append">
                <button class="btn btn-block waves-effect waves-light" type="button" @click="seachData(1)"
                  style="background-color: #d4d4d4">
                  {{ $t("comm.search") }}
                </button>
              </div>

              <div class="btn-group" v-if="isMobile">
                <button class="btn btn-secondary btn-sm btn-block" style="
                    padding: 1px;
                    border-radius: 4px;
                    margin-left: 6px;
                    height: 35px;
                    width: 25px;
                  " @click="btnPopover">
                  <i class="mdi mdi-filter"></i>
                </button>
                <div id="lvMobile" style="
                    display: none;
                    position: absolute;
                    z-index: 999999;
                    right: 0;
                    top: 30px;
                    width: 300px;
                    background-color: #ffffff;
                    border: #ececec solid 1px;
                    padding: 15px;
                    border-radius: 4px;
                    -webkit-box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.1);
                    box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.1);
                    border-top: #23cbe0 solid 2px;
                  ">
                  <div>
                    <div class="form-group row">
                      <div class="col-sm-4">
                        {{ $t("lock.type") }}
                      </div>
                      <div class="col-sm-8">
                        <select class="form-control" v-model="selType">
                          <option value="all"></option>
                          <option value="5">{{ $t("storagereward.type5") }}</option>
                          <option value="9">{{ $t("storagereward.type9") }}</option>
                        </select>
                      </div>
                    </div>
                    <div class="popover-footer" style="text-align: center">
                      <button type="button" class="btn btn-primary btn-sm" @click="btnFilter">
                        <i class="fa fa-filter"></i>{{ $t("comm.filter") }}
                      </button>
                      <button type="button" class="btn btn-primary btn-sm" @click="btnClear">
                        <i class="fa fa-eraser"></i>{{ $t("comm.clear") }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        <h-tbale ref="htableBandWidth" :table-heard="tableHeard" :table-data="tableData" :show-right-tools="false"
          :showSubtitle="false" :up-load-time="30000" table-id="BandWidthTableId" @inint-ok="tableInit"
          @load="loadTable" @colClick="colClick">
          <div class="btn-group" slot="table_title_right_type" slot-scope="scope" v-if="scope.type == 'pc'">
            <button class="btn btn-secondary btn-sm btn-block" style="
                padding: 1px;
                border-radius: 4px;
                margin-left: 6px;
                height: 19px;
              " @click="btnTypePopover(scope.type)">
              <i class="mdi mdi-filter"></i>
            </button>
            <div :id="`lvType_${scope.type}`" style="
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
              ">
              <div>
                <div class="form-group row">
                  <div class="col-sm-12">
                    <select class="form-control" v-model="selType">
                      <option value="all"></option>
                      <option value="5">{{ $t("storagereward.type5") }}</option>
                      <option value="9">{{ $t("storagereward.type9") }}</option>
                    </select>
                  </div>
                </div>
                <div class="popover-footer" style="text-align: center">
                  <button type="button" class="btn btn-primary btn-sm" @click="bntTypeFilter(scope.type)">
                    <i class="fa fa-filter"></i>{{ $t("comm.filter") }}
                  </button>
                  <button type="button" class="btn btn-primary btn-sm" @click="bntTypeClear(scope.type)">
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
  name: "BandWidth",
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
      17: "storagereward.type17",
      18: "storagereward.type18",
    };
    return {
      tableHeard: [
        {
          title: "lock.minerAddress",
          name: "address",
          format: true,
          popover: true,
          isClick: true,
        },
        {
          title: "lock.profitaddress",
          name: "revenueaddress",
          format: true,
          popover: true,
          more: true,
        },
        {
          title: "lock.blockNumber",
          name: "blockNumber",
          more: true,
        },

        {
          title: "lock.type",
          name: "type",
          valMap(val) {
            return `${_this_.$t(_this_.types[val])}`;
          },
          more: true,
        },

        {
          title: "lock.rewardAmount",
          name: "totalAmount",
          valMap(val) {
            return `${utils.clearZero(val)} UTG`;
          },
          more: true,
        },

        {
          title: "lock.totalAmount",
          name: "lockAmount",
          valMap(val, item) {
            return `${utils.clearZero(
              (item.totalAmount || 0) - (item.releaseamount || 0)
            )} UTG`;
          },
        },
        {
          title: "lock.leftAmount",
          name: "releaseamount",
          valMap(val) {
            return `${utils.clearZero(val)} UTG`;
          },
        },

        {
          title: "lock.burningratio",
          name: "burntratio",
          minWidth: "100px",
          valMap(val) {
            return `${utils.weedZero((val || 0) * 100, 2)}%`;
          },
          more: true,
          hide: window.$url.burntRatioHide,
        },
        /*
          {
           title: "lock.burningamount",
           name: "burntamount",
           minWidth: "120px",
           valMap(val) {
             return `${utils.clearZero(val, 4)} UTG `;
           },
           more: true,
         },
         */

        {
          title: "lock.lockNumber",
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
        block_burnt: "0 UTG",
        storage_totalAmount: "0 UTG",
        storage_lockAmount: "0 UTG",
        storage_releaseamount: "0 UTG",
        rental_totalAmount: "0 UTG",
        rental_lockAmount: "0 UTG",
        rental_releaseamount: "0 UTG",

        burntamount: "0 UTG",
        posr_burntamount: "0 UTG",
        post_burntamount: "0 UTG",
      },

      types,
      isMobile: utils.isMobile(),
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

      if (!query && this.$refs.htableBandWidth) {
        query = this.$refs.htableBandWidth.tableQuery;
      }

      if (!query) return;
      query.pageNum = pageNum || query.pageNum;
      if (query.pageSize == 0) query.pageSize = 10;
      //query.loadingShow();

      var param = {
        current: query.pageNum,
        size: query.pageSize,
        //type: 9,
        types: [5, 9],
      };
      if (this.searchInput !== "" && this.searchInput != null) {
        param.addr = this.searchInput;
      }

      if (
        this.selType != "all" &&
        this.selType != null &&
        this.selType != "undefined"
      ) {
        param.types = [this.selType];
      }

      query.loadingShow(param, pageNum);
      this.searchInput = param.addr;
      await utils.getNowHeight();
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
          this.goToUrlDetail("StorageDetail", row);
          break;
      }
    },

    goToUrl(name, params) {
      helper.goPathUrl(this, name, params);
    },


    toStorageView(data) {
      if (data.address) {
        helper.goPathUrl(this, "StorageView", `${data.address}_${data.type}`);
      }
    },

    goToUrlDetail(name, data) {
      if (data.address) {
        helper.goPathUrl(this, name, `${data.address}`);
      }
    },

    toRelease(data) {
      if (data.address && data.type) {
        helper.goPathUrl(
          this,
          "releaseList",
          `${data.address}_${data.type + 1}_${data.blockNumber}_${data.revenue_address
          }`
        );
      }
    },

    seachData(val) {
      this.getStorageRewardStat();
      this.tableInit(null, 1);
    },

    getStorageRewardStat() {
      this.statsTotal.block_totalAmount = "0 UTG";
      this.statsTotal.block_lockAmount = "0 UTG";
      this.statsTotal.block_releaseamount = "0 UTG";
      this.statsTotal.block_burnt = "0 UTG";
      this.statsTotal.storage_totalAmount = "0 UTG";
      this.statsTotal.storage_lockAmount = "0 UTG";
      this.statsTotal.storage_releaseamount = "0 UTG";
      this.statsTotal.rental_totalAmount = "0 UTG";
      this.statsTotal.rental_lockAmount = "0 UTG";
      this.statsTotal.rental_releaseamount = "0 UTG";
      this.statsTotal.posr_burntamount = "0 UTG";
      this.statsTotal.post_burntamount = "0 UTG";
      this.statsTotal.burntamount = "0 UTG";
      var params = {
        //address: this.searchInput,
        addr: this.searchInput,
        //type: 9,
        types: [5, 9],
      };
      if (this.searchInput !== "" && this.searchInput != null) {
        params.addr = this.searchInput;
      }
      if (
        this.selType != "all" &&
        this.selType != null &&
        this.selType != "undefined"
      ) {
        params.types = [this.selType];
      }

      api
        .get("/platform/getIndexData", params)
        .then((response) => {
          let result = response.result || {};
          this.statsTotal.totalAmount = `${utils.clearZero(
            result.rent_amount + result.storage_amount
          )} UTG`;
          this.statsTotal.releaseamount = `${utils.clearZero(
            result.rent_release+ result.storage_release
          )} UTG`;
          this.statsTotal.lockAmount = `${utils.clearZero(
            (result.rent_amount + result.storage_amount) -(result.rent_release+ result.storage_release)
          )} UTG`;
          this.statsTotal.burntamount = `${utils.clearZero(
            result.storage_burnt + result.rent_burnt
          )} UTG`;

          this.statsTotal.block_totalAmount = `${utils.clearZero(
            result.block_amount
          )} UTG`;
          this.statsTotal.block_releaseamount = `${utils.clearZero(
            result.block_release
          )} UTG`;
          this.statsTotal.block_lockAmount = `${utils.clearZero(
            result.block_amount - result.block_release
          )} UTG`;
          this.statsTotal.block_burnt = `${utils.clearZero(
            result.block_burnt
          )} UTG`;

          this.statsTotal.rental_totalAmount = `${utils.clearZero(
            result.rent_amount
          )} UTG`;
          this.statsTotal.rental_releaseamount = `${utils.clearZero(
            result.rent_release
          )} UTG`;
          this.statsTotal.rental_lockAmount = `${utils.clearZero(
            result.rent_amount - result.rent_release
          )} UTG`;
          this.statsTotal.post_burntamount = `${utils.clearZero(
            result.rent_burnt
          )} UTG`;

          this.statsTotal.storage_totalAmount = `${utils.clearZero(
            result.storage_amount
          )} UTG`;
          this.statsTotal.storage_releaseamount = `${utils.clearZero(
            result.storage_release
          )} UTG`;
          this.statsTotal.storage_lockAmount = `${utils.clearZero(
            result.storage_amount - result.storage_release
          )} UTG`;
          this.statsTotal.posr_burntamount = `${utils.clearZero(
            result.storage_burnt
          )} UTG`;

        })
        .catch((error) => {
          console.error(error);
        });

      /*
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
            result.totalAmount - result.releaseamount
          )} UTG`;

          this.statsTotal.burntamount = `${utils.clearZero(
            result.burntamount
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
                  this.statsTotal.post_burntamount = `${utils.clearZero(
                    item.burntamount
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
                  this.statsTotal.posr_burntamount = `${utils.clearZero(
                    item.burntamount
                  )} UTG`;
                  break;
              }
            });
          }
        })
        .catch((error) => {
          console.error(error);
        });
        */
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

    btnPopover() {
      $("#lvMobile").toggle();
    },

    btnFilter() {
      $("#lvMobile").toggle();
      this.tableInit(null, 1);
    },

    btnClear() {
      $("#lvMobile").toggle();
      this.selType = "all";
      this.tableInit(null, 1);
    },
  },
};
</script>
<style lang="scss" scoped>

</style>
