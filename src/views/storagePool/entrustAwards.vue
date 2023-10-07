<template>
  <div class="container-fluid">
    <div class="card" style="margin-top: 40px">
      <div class="card-body">
        <div class="row" style="padding: 6px; text-align: left">
          <div class="col-md-6 i-ma-sm">
            <h4 class="mt-0 header-title" style="width: 100%; text-align: left">
              {{ $t("storagePool.entrustReward") }}
            </h4>
            <p class="sub-title" style="width: 100%; text-align: left">
              {{
                $t("lock.currentTotal", [
                  totalr,
                  statsTotalr.totalAmountr,
                  statsTotalr.releaseamountr,
                ])
              }}
            </p>
          </div>
          <div class="col-md-4 i-ma-sm">
            <div class="input-group" style="margin: 0 auto">
              <input
                type="text"
                class="form-control"
                :placeholder="$t('storagePool.searchMsg3')"
                v-model="searchs.data.addr"
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
          ref="htable"
          :show-subtitle="false"
          :table-id="tableId"
          :table-heard="tableHeard"
          :table-data="tableData"
          :show-right-tools="false"
          right-btn-col-width="100px"
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
  components: { HTbale },
  props: {
    spAddr: {
      type: String,
      default: "",
    },

    tableId: {
      type: String,
      default: "storagePoolRntrustAwards_index",
    },
  },
  data() {
    let _this_ = this;
    return {
      searchs: {
        data: { addr: "" },
        win: {},
      },
      tableHeard: [
        {
          title: "storagePool.storagePoolAddress",
          name: "pledgeAddress",
          format: true,
          popover: true,
          isClick: true,
          minWidth: "180px",
        },
        {
          title: "lock.trustpledge",
          name: "revenueaddress",
          format: true,
          popover: true,
          isClick: true,
          minWidth: "180px",
        },
        {
          title: "lock.blockNumber",
          name: "blockNumber",

          minWidth: "90px",
        },

        {
          title: "storagereward.reward",
          name: "totalAmount",
          minWidth: "90px",

          valMap(val) {
            return `${utils.clearZero(val, 8)} UTG`;
          },
        },

        {
          title: "storagereward.totalAmount",
          name: "LockAmount",
          valMap(val, item) {
            return `${utils.clearZero(
              (item.totalAmount || 0) - (item.releaseamount || 0),
              8
            )} UTG`;
          },
          minWidth: "110px",
        },
        {
          title: "lock.leftAmount",
          name: "",
          minWidth: "140px",
          valMap(val) {
            return `${utils.clearZero(val, 8)} UTG`;
          },
        },

        {
          title: "lock.lockNumber",
          name: "lockingTime",

          minWidth: "120px",
          valMap(val, item) {
            let re = utils.lockingTime(
              item.startTime,
              item.avgBlockTime,
              item.unLockNumber,
              item.releaseHeigth
            );
            return `${re || 0}${_this_.$t("lock.day")}`;
          },
        },
        {
          title: "lock.state",
          name: "state",
          isHtml: true,
          valMap(val, item) {
            if (item.totalAmount == item.releaseamount) {
              return `<span style='color:#2ebac6'>${_this_.$t("lock.Released")}</span>`;
            } else {
              return _this_.$t("storagePool.locked");
            }
          },
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
  mounted() {
    this.getStorageRentalRewardStat();
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
    colClick(data) {
      let col = data.col || {};
      let row = data.row || {};
      switch (col.name) {
        case "pledgeAddress":
          this.goToUrl("storagePoolDetail", row.pledgeAddress);
          break;
        case "revenueaddress":
          this.goToUrl("accountdetail", row.revenueaddress);
          break;
      }
    },
    tableInit(query, pageNum) {
      this.loadTable(query, false, pageNum);
    },
    loadTable(query, toTop = true, pageNum) {
      this.getStorageRentalRewardStat();
      if (!query && this.$refs.htable) {
        query = this.$refs.htable.tableQuery;
      }
      if (!query) return;
      query.pageNum = pageNum || query.pageNum;

      var params = {
        current: query.pageNum,
        size: query.pageSize,

        types: [23],
      };

      //query.loadingShow();
      query.loadingShow(params, pageNum, {
        searchs: this.searchs.data,
      });

      utils.getNowHeight().then(() => {
        api
          .postJson("/platform/getStorageRewardList", params)
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
            query.loadingHide(
              JSON.stringify(error).includes("timeout") ? 1 : 2
            );
          });
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
      this.getStorageRentalRewardStat();
    },

    getStorageRentalRewardStat() {
      var params = {
        address: this.spAddr,
        type: 23,
      };
      api
        .postJson("/platform/getStorageRewardStat", params)
        .then((response) => {
          let result = response.result || {};
          this.statsTotalr.totalAmountr = `${utils.clearZero(
            result.totalAmount
          )} UTG`;
          this.statsTotalr.releaseamountr = `${utils.clearZero(
            result.releaseamount
          )} UTG`;
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
  watch: {
    spAddr: function () {
      this.seachData();
    },
    address: function () {
      this.seachData();
    },
  },
};
</script>
<style lang="scss" scoped></style>
