<template>
  <div class="container-fluid">
    <div class="card" style="margin-top: 40px">
      <div class="card-body">
        <div></div>
        <div class="row" style="padding: 6px; text-align: left">
          <div class="col-md-4">
            <h4 class="mt-0 header-title" style="width: 100%; text-align: left">
              {{ $t("storagereward.title") }}
            </h4>
            <p class="sub-title" style="width: 100%; text-align: left">
              {{ $t("storagereward.totalnumber", [total]) }}
            </p>
          </div>
          <div class="col-md-5">
            <div class="input-group" style="margin: 0 auto">
              <input
                type="text"
                class="form-control"
                :placeholder="$t('storagereward.addressSearch')"
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
          ref="htableStorageReward"
          :table-heard="tableHeard"
          :table-data="tableData"
          :show-right-tools="false"
          :showSubtitle="false"
          :up-load-time="30000"
          table-id="StorageRewardTableId"
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
  name: "StorageReward",
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
      10: "storagereward.type10",
      11: "storagereward.type11",
      12: "storagereward.type12",
      13: "storagereward.type13",
      14: "storagereward.type14",
      15: "storagereward.type15",
    };
    return {
      tableHeard: [
        {
          title: "storagereward.revenuesaddress",
          name: "revenueAddr",
          format: true,
          popover: true,
          isClick: true,
        },
        {
          title: "storagereward.totalspace",
          name: "declareSpace",
          valMap(val) {
            return utils.bytesToSize(val);
          },
        },
        {
          title: "storagereward.storagefactor",
          name: "ratio",
          more: true,
        },
        {
          title: "storagereward.reward",
          name: "totalamount",
          valMap(val) {
            return `${utils.clearZero(val || 0)} UTG`;
          },
        },
        {
          title: "storagereward.totalAmount",
          name: "lockamount",
          valMap(val, item) {
            return `${utils.clearZero(
              (item.totalamount || 0) - (item.releaseamount || 0)
            )} UTG`;
          },
          more: true,
        },
        {
          title: "storagereward.leftAmount",
          name: "releaseamount",
          valMap(val) {
            return `${utils.clearZero(val || 0)} UTG`;
          },
          more: true,
        },
      ],
      tableData: [],
      total: 0,
      searchInput: null,
      types,
    };
  },

  methods: {
    tableInit(query, pageNum) {
      this.loadTable(query, false, pageNum);
    },
    async loadTable(query, toTop = true, pageNum) {      
      if (!query && this.$refs.htableStorageReward) {
        query = this.$refs.htableStorageReward.tableQuery;
      }

      if (!query) return;
      query.pageNum = pageNum || query.pageNum;
      if (query.pageSize == 0) query.pageSize = 10;
      //query.loadingShow();

      var param = {
        current: query.pageNum,
        size: query.pageSize,
        //type: "9",
        types:[5, 9]
      };
      if (this.searchInput !== "" && this.searchInput != null) {
        param.revenue_addr = this.searchInput;
      }

      query.loadingShow(param, pageNum);
      this.searchInput = param.revenue_addr;

      await utils.getNowHeight();

      api
        .postJson("/platform/getStorageRevenueList", param) //getStorageRevenueList 
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
        case "revenueAddr":
          this.goToUrl("RewardDetail", row.revenueAddr);
          break;
      }
    },

    goToUrl(name, params) {
      helper.goPathUrl(this, name, params);
    },

    seachData(val) {
      this.tableInit(null, 1);
    },
  },
};
</script>
<style lang="scss" scoped></style>
