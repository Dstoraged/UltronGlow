<template>
  <div class="container-fluid">
    <div class="card" style="margin-top: 40px">
      <div class="card-body">
        <div class="row" style="padding: 6px; text-align: left">
          <div class="col-md-6">
            <h4 class="mt-0 header-title" style="width: 100%; text-align: left">
              {{ $t("menu.entrustpledgeexitlock") }}
            </h4>
            <p class="sub-title" style="width: 100%; text-align: left">
              {{
                $t("lock.currentTotal", [
                  total,
                  statsTotal.totalAmount,
                  statsTotal.releaseamount,
                ])
              }}
            </p>
          </div>
          <div class="col-md-4">
            <div class="input-group" style="margin: 0 auto">
              <input
                type="text"
                class="form-control"
                :placeholder="$t('lock.SearchAddress')"
                id="demo"
                v-model="searchInput"
                @keyup.enter="seachData(1)"
                style="border-right: 0px; width: 60%"
              />
              <div class="input-group-append">
                <button
                  class="btn btn-block waves-effect waves-light"
                  type="button"
                  @click="seachData(1)"
                  style="background-color: #d4d4d4"
                >
                  {{ $t("comm.search") }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <h-tbale
          ref="htableEntrustedPledgeLock"
          :table-heard="tableHeard"
          :table-data="tableData"
          :show-right-tools="false"
          :showSubtitle="false"
          :up-load-time="30000"
          table-id="EntrustedPledgeLockTableId"
          @inint-ok="EntrustedPledgeLocktableInit"
          @load="loadTableEntrustedPledgeLock"
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
  name: "EntrustedPledgeLock",
  components: { HTbale },
  props: {},
  data() {
    let _this_ = this;
    return {
      tableHeard: [
        {
          title: "lock.nodeAddress",
          name: "pledgeAddress",
          format: true,
          popover: true,
          //isClick: true,
        },
        {
          title: "lock.trustpledge",
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
          title: "lock.totalPledgeAmount",
          name: "totalAmount",
          valMap(val) {
            return helper.getDataFormat(val, 18, 10000).toFixed(4) + " UTG";
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
          valMap(val) {
            return `${ utils.weedZero((val || 0) * 100,2) }%`;
          },
          more: true,
          hide: window.$url.burntRatioHide,
        },
       /*
         {
          title: "lock.burningamount",
          name: "burntamount",         
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
        {
          title: "lock.state",
          name: "state",
          valMap(val) {
            return `${_this_.$t("lock.state13")}`;
          },
          more: true,
        },
      ],
      tableData: [],

      total: 0,
      searchInput: null,
      statsTotal: {
        totalAmount: "--",
        releaseamount: "--",
      },
    };
  },
  mounted() {
    this.getStorageRewardStat();
  },

  methods: {
    EntrustedPledgeLocktableInit(query, pageNum) {
      this.loadTableEntrustedPledgeLock(query, false, pageNum);
    },
    async loadTableEntrustedPledgeLock(query, toTop = true, pageNum) {
      
      if (!query && this.$refs.htableEntrustedPledgeLock) {
        query = this.$refs.htableEntrustedPledgeLock.tableQuery;
      }

      if (!query) return;
      query.pageNum = pageNum || query.pageNum;
      if (query.pageSize == 0) query.pageSize = 10;
      // query.loadingShow();

      var param = {
        current: query.pageNum,
        size: query.pageSize,
        type: 19,        
      };
      if (this.searchInput !== "" && this.searchInput != null) {
        param.addr = this.searchInput;
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
        case "pledge_address":
          this.toMinerView(row);
          break;
      }
    },

    goToUrl(name, params) {
      helper.goPathUrl(this, name, params);
    },

    toMinerView(data) {
      if (data.address) {
        helper.goPathUrl(this, "NodeView", `${data.pledge_address}_${data.type + 1}`);
        /*
                if(data.type==3){
                  helper.goPathUrl(this, "NodeView", `${data.address}_${data.type + 1}`);
                }
                if(data.type==17){
                  helper.goPathUrl(this, "MinerView", `${data.address}_${data.type}`);
                }
                */
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

    seachData(val) {
      this.getStorageRewardStat();
      this.EntrustedPledgeLocktableInit(null, 1);
    },

    getStorageRewardStat() {
      var params = {
        //address: this.searchInput,
        addr: this.searchInput,
        type: 19,      
        //types: [3,17]
      };
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
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
};
</script>
<style lang="scss" scoped></style>
