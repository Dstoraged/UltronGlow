<template>
  <div class="container-fluid">
    <div class="card" style="margin-top: 40px">
      <div class="card-body">
        <div class="row" style="padding: 6px; text-align: left">
          <div class="col-md-8">
            <h4 class="mt-0 header-title" style="width: 100%; text-align: left">
              {{ $t("wnetpledge.title") }}
            </h4>
            <p class="sub-title" style="width: 100%; text-align: left">
              {{
                $t("wnetpledge.currentTotal", [
                  total,
                  statsTotal.pledgeamount,
                  statsTotal.nodepledge,
                  statsTotal.storagepledge,
                ])
              }}
            </p>
          </div>
          <div class="col-md-4">
            <div class="input-group" style="margin: 0 auto">
              <input
                type="text"
                class="form-control"
                :placeholder="$t('wnetpledge.nodeSearchAddress')"
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
          ref="WholeNetPledgeHTable"
          :table-heard="tableHeard"
          :table-data="tableData"
          :show-right-tools="false"
          tableId="WholeNetPledgetableId"
          :showSubtitle="false"
          @inint-ok="tableInit"
          @load="loadTable"
          @colClick="colClick"
        >
          <template slot="table_cell_type" slot-scope="scope">
            <span v-if="scope.data.type == 1">
              {{ $t("wnetpledge.type1") }}
            </span>
            <span v-else-if="scope.data.type == 2">
              {{ $t("wnetpledge.type2") }}
            </span>
          </template>
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
  name: "WholeNetPledge",
  components: { HTbale },
  props: {},
  data() {
    let _this_ = this;
    return {
      tableHeard: [
        {
          title: "wnetpledge.nodeAddress",
          name: "address",
          format: true,
          popover: true,
          isClick: true,
        },
        {
          title: "wnetpledge.type",
          name: "type",
          more: true,
        },
        {
          title: "wnetpledge.pledgeAmount",
          name: "pledge_amount",
          valMap(val) {
            return helper.getDataFormat(val, 18, 10000).toFixed(4) + " UTG";
          },
          // isClick: true,
        },
        {
          title: "wnetpledge.pledgeTime",
          name: "join_time",
          valMap(val) {
            return helper.formatTime(val, 1);
          },
        },
      ],
      tableData: [],
      total: 0,
      searchInput: null,
      statsTotal: {
        pledgeamount: "--",
        nodepledge: "--",
        storagepledge: "--",
      },
    };
  },

  mounted() {
    this.getPledgeNodeStat();
  },
  methods: {
    tableInit(query, pageNum) {
      this.loadTable(query, false, pageNum);
    },
    async loadTable(query, toTop = true, pageNum) {
     
      if (!query && this.$refs.WholeNetPledgeHTable) {
        query = this.$refs.WholeNetPledgeHTable.tableQuery;
      }

      if (!query) return;
      query.pageNum = pageNum || query.pageNum;
      if (query.pageSize == 0) query.pageSize = 10;
      //query.loadingShow();

      var param = {
        current: query.pageNum,
        size: query.pageSize,
      };
      if (this.searchInput !== "" && this.searchInput != null) {
        param.address = this.searchInput;
      }

      query.loadingShow(param, pageNum);
      this.searchInput = param.address;

      await utils.getNowHeight();
      
      api
        .postJson("/platform/getPledgeNodeList", param)
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
        case "pledge_amount":
          this.goPledgeUrl("PledgeRecord", row);
          break;
      }
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
        if (data.type == 2) {
          helper.goPathUrl(this, "StorageDetail", `${data.address}`);
        }
      }
    },

    goToUrl(name, params) {
      helper.goPathUrl(this, name, params);
    },

    goPledgeUrl(name, data) {
      if (data.type == 1) {
        helper.goPathUrl(this, name, data.address);
      }
    },

    seachData() {
      this.tableInit(null, 1);
      this.getPledgeNodeStat();
    },

    getPledgeNodeStat() {
      this.statsTotal.pledgeamount = "0 UTG";
      this.statsTotal.storagepledge = "0 UTG";
      this.statsTotal.nodepledge = "0 UTG";
      var params = {
        address: this.searchInput,
      };
      api
        .postJson("/platform/getPledgeNodeStat", params)
        .then((response) => {
          let result = response.result || {};
          this.statsTotal.pledgeamount = `${utils.clearZero(
            result.pledgeamount
          )} UTG`;
          this.statsTotal.storagepledge = `${utils.clearZero(
            result.storagepledge
          )} UTG`;
          this.statsTotal.nodepledge = `${utils.clearZero(
            result.nodepledge
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
