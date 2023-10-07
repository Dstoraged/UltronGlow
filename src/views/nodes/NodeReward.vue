<template>
  <div class="container-fluid">
    <div class="card" style="margin-top: 40px">
      <div class="card-body">
        <div></div>
        <div class="row" style="padding: 6px; text-align: left">
          <div class="col-md-4">
            <h4 class="mt-0 header-title" style="width: 100%; text-align: left">
              {{ $t("ultronnodereward.title") }}
            </h4>
            <p class="sub-title" style="width: 100%; text-align: left">
              {{ $t("ultronnodereward.totalnumber", [total]) }}
            </p>
          </div>
          <div class="col-md-5">
            <div class="input-group" style="margin: 0 auto">
              <input
                type="text"
                class="form-control"
                :placeholder="$t('ultronnodereward.nodeaddressSearch')"
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
          ref="NodeRewardHTable"
          :table-heard="tableHeard"
          :table-data="tableData"
          :show-right-tools="false"
          tableId="NodeRewardtableId"
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
  name: "NodeReward",
  components: { HTbale },
  props: {},
  data() {
    const types = {
      0: "node.unknownType",
      1: "node.candidateNode",
      2: "node.witnessNode",
      3: "node.signoutNode",
    };
    let _this_ = this;
    return {
      tableHeard: [
        {
          title: "ultronnodereward.nodeaddress",
          name: "node_address",
          format: true,
          popover: true,
          isClick: true,
        },
        {
          title: "ultronnodereward.nodetype",
          name: "node_type",
          valMap(val) {
            return `${_this_.$t(_this_.types[val])}`;
          },
        },
        {
          title: "ultronnodereward.pledgeAmount",
          //name: "pledge_amount",
          name: "total_amount",
          valMap(val) {
            return `${utils.clearZero(val || 0)} UTG`;
          },
          more: true,
        },
        {
          title: "ultronnodereward.reward",
          name: "totalamount",
          valMap(val) {
            return `${utils.clearZero(val || 0)} UTG`;
          },
        },
        {
          title: "ultronnodereward.lockAmount",
          name: "lockamount",
          valMap(val, item) {
            return `${utils.clearZero(
              (item.totalamount || 0) - (item.releaseamount || 0)
            )} UTG`;
          },
          more: true,
        },
        {
          title: "ultronnodereward.releaseamount",
          name: "releaseamount",
          valMap(val) {
            return `${utils.clearZero(val || 0)} UTG`;
          },
          more: true,
        },
      ],
      tableData: [],
      total: 0,
      searchInput: "",
      types,
    };
  },

  methods: {
    tableInit(query, pageNum) {
      this.loadTable(query, false, pageNum);
    },
    loadTable(query, toTop = true, pageNum) {
      if (!query && this.$refs.NodeRewardHTable) {
        query = this.$refs.NodeRewardHTable.tableQuery;
      }

      if (!query) return;
      query.pageNum = pageNum || query.pageNum;
      if (query.pageSize == 0) query.pageSize = 10;
      //query.loadingShow();

      var param = {
        current: query.pageNum,
        size: query.pageSize,
        //node_address: this.searchInput,
        //type:'9',
      };
      if (this.searchInput !== "" && this.searchInput != null) {
        param.node_address = this.searchInput;
      }

      query.loadingShow(param, pageNum);
      this.searchInput = param.node_address;

      api
        .postJson("/platform/getNodeRewardList", param)
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
        case "node_address":
          this.toMinerView(row, 1);
          break;
      }
    },

    goToUrl(name, params) {
      helper.goPathUrl(this, name, params);
    },

    toMinerView(data, type) {
      if (data.node_address) {
        helper.goPathUrl(this, "NodeView", `${data.node_address}_${type + 1}`);
      }
    },
  },
};
</script>
<style lang="scss" scoped></style>
