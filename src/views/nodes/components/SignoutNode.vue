<template>
  <div>
    <div class="row" style="padding: 6px; text-align: left">
      <div class="col-md-4">
        <p class="sub-title">
          {{ $t("node.currentSignoutNumber", [stotal]) }}
        </p>
      </div>
      <div class="col-md-4">
        <div class="input-group" style="margin: 0 auto">
          <input type="text" class="form-control" :placeholder="$t('node.nodeSignoutSearch')" id="demo"
            v-model="searchSignoutInput" @keyup.enter="tableInitsignoutNode(null, 1)"
            style="border-right: 0px; width: 60%" />
          <div class="input-group-append">
            <button class="btn btn-block waves-effect waves-light" type="button" @click="tableInitsignoutNode(null, 1)"
              style="background-color: #d4d4d4">
              {{ $t("comm.search") }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <h-tbale ref="signoutNodeTable" :table-heard="signoutNodetableHeard" :table-data="signoutNodetableData"
      :show-right-tools="false" tableId="SignoutNodetableId" :showSubtitle="false" @inint-ok="tableInitsignoutNode"
      @load="loadTablesignoutNode" @colClick="colClick">
      <template slot="table_cell_node_type" slot-scope="scope">
        <span v-if="scope.data.node_type == 1">
          {{ $t("node.candidateNode") }}
        </span>
        <span v-else-if="scope.data.node_type == 2">
          {{ $t("node.witnessNode") }}
        </span>
        <span v-else-if="scope.data.node_type == 3">
          {{ $t("node.signoutNode") }}
        </span>
      </template>

      

      <template slot="table_cell_exit_type" slot-scope="scope">
        <span v-if="scope.data.exit_type == 1">
          {{ $t("node.exitpledgetype1") }}
        </span>
        <span v-else-if="scope.data.exit_type == null">
        </span>
        <span v-else>
          {{ $t("node.exitpledgetype0") }}
        </span>
      </template>
    </h-tbale>
  </div>
</template>
<script>
import { Message } from "element-ui";
import * as api from "@/api/api";
import * as helper from "@/utils/helper";
import HTbale from "@/components/modules/HTbale.vue";
import { setPageQuery } from "@/utils/table.js";
export default {
  name: "SignoutNode",
  components: { HTbale },
  props: {},
  data() {
    let _this_ = this;
    return {
      signoutNodetableHeard: [
        {
          title: "node.nodeAddress",
          name: "node_address",
          format: true,
          popover: true,
          isClick: true,
        },
        {
          title: "node.revenuesaddress",
          name: "revenue_address",
          format: true,
          popover: true,
          //isClick: true,
          more: true,
          fnum: 10,
        },
        {
          title: "node.manageaddress",
          name: "manage_address",
          format: true,
          popover: true,
          more: true,
        },
        {
          title: "node.activeheight",
          name: "blocknumber",
          more: true,
        },
        {
          title: "node.nodetype",
          name: "node_type",
          more: true,
        },
        {
          title: "node.unlockAmount",
          name: "leftamount",
          valMap(val) {
            return helper.getDataFormat(val, 18, 10000).toFixed(4) + " UTG";
          },
        },
        {
          title: "node.punishScore",
          name: "fractions",
        },
        {
          title: "node.pledgeTime",
          name: "join_time",
          more: true,
        },

        {
          title: "node.exit_type",
          name: "exit_type",
          more: true,
        },
      ],
      signoutNodetableData: [],
      stotal: 0,
      searchSignoutInput: "",
      message: {},
    };
  },
  created() {
    this.message = this.$route.params;
  },

  methods: {
    tableInitsignoutNode(query, pageNum) {
      this.loadTablesignoutNode(query, false, pageNum);
    },
    loadTablesignoutNode(query, toTop = true, pageNum) {
      if (!query && this.$refs.signoutNodeTable) {
        query = this.$refs.signoutNodeTable.tableQuery;
      }

      if (!query) return;
      query.pageNum = pageNum || query.pageNum;
      if (query.pageSize == 0) query.pageSize = 10;
      // query.loadingShow();

      var param = {
        current: query.pageNum,
        size: query.pageSize,
        //node_address: this.searchSignoutInput,
        node_type: 3,
      };

      if (this.searchSignoutInput !== "" && this.searchSignoutInput != null) {
        param.node_address = this.searchSignoutInput;
      }
      query.loadingShow(param, pageNum);
      this.searchSignoutInput = param.node_address;

      api
        .postJson("/platform/node/getcadnodelist", param)
        .then((response) => {
          query.table_loading = false;

          if (response.statusCode !== 0) {
            Message.error(response.message);
          }
          let re = response.result || {};
          this.signoutNodetableData = re.records || [];
          if (response.result != null) {
            this.stotal = response.result.total;
          }

          setPageQuery(query, re);
          if (toTop && this.signoutNodetableData.length > 0) {
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
          this.goToUrl("NodeView", row, 1);
          break;
      }
    },

    goToUrl(name, data, type) {
      helper.goPathUrl(this, name, `${data.node_address}_${type + 1}`);
    },
  },
};
</script>
