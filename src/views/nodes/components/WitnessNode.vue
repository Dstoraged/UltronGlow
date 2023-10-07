<template>
  <div >
    <div class="row" style="padding: 6px; text-align: left">
      <div class="col-md-4">
        <p class="sub-title">
          {{ $t("node.currentWitnessNumber", [totalw]) }}
        </p>
      </div>
      <div class="col-md-4">
        <div class="input-group" style="margin: 0 auto">
          <input
            type="text"
            class="form-control"
            :placeholder="$t('node.nodeWitnessSearch')"
            id="demo"
            v-model="searchWitnessInput"
            @keyup.enter="tableInitwitnessNode(null, 1)"
            style="border-right: 0px; width: 60%"
          />
          <div class="input-group-append">
            <button
              class="btn btn-block waves-effect waves-light"
              type="button"
              @click="tableInitwitnessNode(null, 1)"
              style="background-color: #d4d4d4"
            >
              {{ $t("comm.search") }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <h-tbale
      ref="witnessNodeTable"
      :table-heard="witnessNodetableHeard"
      :table-data="witnessNodetableData"
      :show-right-tools="true"
      tableId=" witnessNodetableId"
      :showSubtitle="false"
      @inint-ok="tableInitwitnessNode"
      rightBtnColWidth="190px"
      @load="loadTablewitnessNode"
      @colClick="colClick"
    >
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
      
      <div class="btn-group" slot="table_title_right_rate" >
        <el-popover
          placement="top-start"          
          width="300"
          trigger="hover"
          :content="$t('node.ratedescribe')">          
          <el-button slot="reference" class="btn  btn-sm btn-block" style="
                padding: 1px;
                border-radius: 4px;
                margin-left: 0px;
                height: 19px;"><i class="mdi dripicons-information" ></i></el-button>
        </el-popover>
      </div>

      <template slot="rightCol" slot-scope="scope">
        <el-button
          type="text"
          size="mini"
          @click="goToUrlWitness(scope.data.node_address)"
          :disabled="scope.data.fractions <= 0"
          class="equal-width"
          >{{ $t("node.punishRepairPayment") }}</el-button
        >
        <el-button
          type="text"
          size="mini"
          @click="goToPledgeUrlWitness(scope.data.node_address)"
          class="equal-width"
          v-if="true"
          >{{ $t("node.trustpledge") }}</el-button
        >
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
  name: "WitnessNode",
  components: { HTbale },
  props: {},
  data() {
    let _this_ = this;
    return {
      witnessNodetableHeard: [
        {
          title: "node.nodeAddress",
          name: "node_address",
          format: true,
          popover: true,
          isClick: true,
          fnum: 10,
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
          fnum: 10,
        },
        {
          title: "node.activeheight",
          name: "blocknumber",
          more: true,
        },
        
        {
          title: "node.chargerate",
          name: "rate",
          valMap(val) {
            if (val)
              return val/100 + "%";
            else
              return "";
          },
          more: true,
        },

        {
          title: "node.nodetype",
          name: "node_type",
          more: true,         
        },
       
        {
          title: "node.pledgeAmount",
          name: "total_amount",
          valMap(val,item) {
            if(val)
              return helper.getDataFormat(val, 18, 10000).toFixed(4) + " UTG";
            else
              return helper.getDataFormat(item.pledge_amount, 18, 10000).toFixed(4) + " UTG";
          },
          isClick: true,
        },
        {
          title: "node.punishScore",
          name: "fractions",
        },
        /*
        {
          title: "node.pledgeTime",
          name: "join_time",
          more: true,
        },
        */
      ],
      witnessNodetableData: [],
      totalw: 0,
      searchWitnessInput: "",
      message: {},
    };
  },
  created() {
    this.message = this.$route.params;
  },
  methods: {
    tableInitwitnessNode(query, pageNum) {
      this.loadTablewitnessNode(query, false, pageNum);
    },
    loadTablewitnessNode(query, toTop = true, pageNum) {
      if (!query && this.$refs.witnessNodeTable) {
        query = this.$refs.witnessNodeTable.tableQuery;
      }

      if (!query) return;
      query.pageNum = pageNum || query.pageNum;
      if (query.pageSize == 0) query.pageSize = 10;
      //query.loadingShow();

      var param = {
        current: query.pageNum,
        size: query.pageSize,
        //node_address: this.searchWitnessInput,
        node_type: 2,
      };
      if (this.searchWitnessInput !== "" && this.searchWitnessInput != null) {
        param.node_address = this.searchWitnessInput;
      }

      query.loadingShow(param, pageNum);
      this.searchWitnessInput = param.node_address;

      api
        .postJson("/platform/node/getcadnodelist", param)
        .then((response) => {
          query.table_loading = false;

          if (response.statusCode !== 0) {
            Message.error(response.message);
          }
          if (response.result != null) {
            this.totalw = response.result.total;
          }

          let re = response.result || {};
          this.witnessNodetableData = re.records || [];

          setPageQuery(query, re);
          if (toTop && this.witnessNodetableData.length > 0) {
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
        case "total_amount":
          this.goPledgeUrl("PledgeRecord", row.node_address);
          break;
      }
    },

    goToUrl(name, data, type) {
      helper.goPathUrl(this, name, `${data.node_address}_${type + 1}`);
    },

    goPledgeUrl(name, params) {
      helper.goPathUrl(this, name, params);
    },

    goToUrlWitness(contract) {
      if (contract) {
        helper.goPathUrl(this, "mymanage/makegood", contract);
      }
    },

    goToPledgeUrlWitness(contract) {
      if (contract) {
        helper.goPathUrl(this, "mymanage/nodepledge", contract);
      }
    },
  },
};
</script>
