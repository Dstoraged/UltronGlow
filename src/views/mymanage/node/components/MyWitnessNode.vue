<template>
  <div class="container-fluid">
    <div class="row" style="padding: 6px; text-align: left">
      <div class="col-md-4">
        <p class="sub-title">
          {{ $t("node.currentCandidateNumber", [wtotal]) }}
        </p>
      </div>
      <div class="col-md-4" v-if="false">
        <div class="input-group" style="margin: 0 auto">
          <input type="text" class="form-control" :placeholder="$t('node.nodeSearch')" id="demo"
            v-model="searchCandidateInput" @keyup.enter="seachCandidateData(1)" style="border-right: 0px; width: 60%" />
          <div class="input-group-append">
            <button class="btn btn-block waves-effect waves-light" type="button" @click="seachCandidateData(1)"
              style="background-color: #d4d4d4">
              {{ $t("comm.search") }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <h-tbale ref="MyWitnessNodeTable" :table-heard="myWitnessNodetableHeard" :table-data="myWitnessNodetableData"
      :show-right-tools="true" :tableId="'MyWitnessNodetableId' + this.$store.getters.account" :showSubtitle="false"
      @inint-ok="tableInitmyWitnessNode" @load="loadTablemyWitnessNode" @colClick="colClick">
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

      <template slot="rightCol" slot-scope="scope">
        <el-dropdown trigger="click">
          <el-button size="mini" type="default" icon="el-icon-menu">
            <i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-if="scope.data.table_btn_binding">
              <el-button style="width: 100%" type="default" size="mini" @click="binding(scope.data)">{{
              $t("binding.bindaddr") }}</el-button>
            </el-dropdown-item>
            <el-dropdown-item v-if="scope.data.table_btn_upbinding">
              <el-button style="width: 100%" type="default" size="mini" @click="upBinding(scope.data)">{{
              $t("mymanageMining.transferaddress") }}</el-button>
            </el-dropdown-item>
            <el-dropdown-item v-if="scope.data.table_btn_bindinglift">
              <el-button style="width: 100%" type="default" size="mini" @click="bindinglift(scope.data)">{{
                  $t("messages.bindinglift")}}</el-button>
            </el-dropdown-item>
            <el-dropdown-item v-if="scope.data.table_btn_in">
              <el-button style="width: 100%" type="default" size="mini" @click="makeGood(scope.data)">{{
              $t("mymanageNode.makegood") }}</el-button>
            </el-dropdown-item>
            <el-dropdown-item v-if="scope.data.table_btn_quit">
              <el-button style="width: 100%" type="default" size="mini" @click="quitNode(scope.data)">{{
                  $t("mymanageNode.quit")}}</el-button>
            </el-dropdown-item>

            <el-dropdown-item v-if="scope.data.table_btn_setfeerate"> 
              <el-button style="width: 100%" type="default" size="mini" @click="SetFeerate(scope.data)">{{
                  $t("mymanageNode.SetFeerate")}}</el-button>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </template>
    </h-tbale>
  </div>
</template>
<script>
import { Message } from "element-ui";
import utils from "@/utils/utils";
import webSdk from "@/utils/webSdk.js";
import * as api from "@/api/api";
import * as helper from "@/utils/helper";
import HTbale from "@/components/modules/HTbale.vue";
import { setPageQuery } from "@/utils/table.js";
export default {
  name: "MyWitnessNode",
  components: { HTbale },
  data() {
    let _this_ = this;
    return {
      searchCandidateInput: "",
      message: {},
      wtotal: 0,
      loadText: "",
      myWitnessNodetableHeard: [
        {
          title: "mymanageNode.candidateNode",
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
          isClick: true,
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
          title: "mymanageNode.nodeType",
          name: "node_type",
          more: true,
        },
        {
          title: "mymanageNode.pledgenum",
          name: "total_amount",
          valMap(val, item) {
            if (val)
              return helper.getDataFormat(val, 18, 10000).toFixed(4) + " UTG";
            else
              return helper.getDataFormat(item.pledge_amount, 18, 10000).toFixed(4) + " UTG";
          },
          isClick: true,
        },
        {
          title: "mymanageNode.punilshamount",
          name: "fractions",
          isClick: true,
        },
      ],
      myWitnessNodetableData: [],
      loadDataOk: false,
      promiseperiod: 547,
      plegdetimeOut: 30,
      plegdetimeWithin: 30
    };
  },

  created() {
    this.message = this.$route.params;
  },

  methods: {
    tableInitmyWitnessNode(query, pageNum) {
      this.loadTablemyWitnessNode(query, false, pageNum);
    },
    loadTablemyWitnessNode(query, toTop = true, pageNum) {
      if (!this.loadDataOk) {
        this.loadData();
        return;
      }

      if (!query && this.$refs.MyWitnessNodeTable) {
        query = this.$refs.MyWitnessNodeTable.tableQuery;
      }

      if (!query) return;
      query.pageNum = pageNum || query.pageNum;
      if (query.pageSize == 0) query.pageSize = 10;
      // query.loadingShow();

      var param = {
        current: query.pageNum,
        size: query.pageSize,
        address: this.$store.getters.account,
        node_type: 2,
      };

      query.loadingShow(param, pageNum);
      api.postJson("/platform/node/getcadnodelist", param).then((response) => {
        query.table_loading = false;

        if (response.statusCode !== 0) {
          Message.error(response.message);
        }
        let re = response.result || {};
        const newData = [];

        if (response.result != null) {
          var data = response.result.records || [];
          let accountaddr = this.$store.getters.account;

          data.forEach((item, index) => {
            let manageaddress = item.manage_address||'';
            item.promiseperiods = utils.plegdeTime(item.blocknumber, this.promiseperiod);
            item.table_more = false;
            item.table_btn_in = item.fractions > 0;
            item.table_btn_quit = item.promiseperiods == 1 && manageaddress.toLocaleLowerCase() == accountaddr.toLocaleLowerCase();           
            item.table_btn_binding = utils.isEmpty(item.revenue_address) && manageaddress.toLocaleLowerCase() == accountaddr.toLocaleLowerCase();
            item.table_btn_upbinding = !utils.isEmpty(item.revenue_address) && manageaddress.toLocaleLowerCase() == accountaddr.toLocaleLowerCase();;
            item.table_btn_bindinglift = !utils.isEmpty(item.revenue_address) && manageaddress.toLocaleLowerCase() == accountaddr.toLocaleLowerCase();;
            item.table_btn_setfeerate = manageaddress.toLocaleLowerCase() == accountaddr.toLocaleLowerCase();
            newData.push(item);
          });
        }
        this.myWitnessNodetableData = newData;
        // this.myWitnessNodetableData = re.records || [];
        if (response.result != null) {
          this.wtotal = response.result.total;
        }

        setPageQuery(query, re);
        if (toTop && this.myWitnessNodetableData.length > 0) {
          query.toTop();
        }
      });
    },
    colClick(data) {
      let col = data.col || {};
      let row = data.row || {};
      switch (col.name) {
        case "node_address":
          this.toMinerView(row);
          break;
        case "revenue_address":
          this.goToUrl(row.revenue_address);
          break;
        case "total_amount":
          this.pledge(row);
          break;
        case "fractions":
          this.punishment(row);
          break;
      }
    },

    toMinerView(data) {
      if (data.node_address) {
        helper.goPathUrl(
          this,
          "NodeView",
          `${data.node_address}_${data.type + 1}`
        );
      }
    },
    goToUrl(contract, path = "AccountDetail") {
      helper.goPathUrl(this, path, contract);
    },

    pledge(data) {
      if (data.node_address) {
        helper.goPathUrl(this, "PledgeRecord", data.node_address);
        //helper.goPathUrl(this, "mymanage/pledgelist", data.node_address);
      }
    },
    punishment(data) {
      if (data.node_address) {
        helper.goPathUrl(this, "mymanage/punishment", data.node_address);
      }
    },
    bindinglift(data) {
      if (data.node_address) {
        helper.goPathUrl(this, "mymanage/nodeBindingLift", `${data.node_address}_${data.manage_address}`);
        //helper.goPathUrl(this, "mymanage/nodeBindingLift", data.node_address);
      }
    },

    quitNode(data) {
      let sdk = this.$store.getters.getsdk || null;
      if (!data.node_address) {
        return;
      }
      let revenue_address = data.revenue_address;
      let manage_address = data.manage_address;
      let waddress = "";

      //if (revenue_address) {
      if (manage_address) {
        try {
          /*
            revenue_address = ethers.utils.getAddress(revenue_address);
            waddress = ethers.utils.getAddress(this.$store.getters.account);  
            */
          //revenue_address = webSdk.sdkUtils.getAddress(revenue_address);
          manage_address = webSdk.sdkUtils.getAddress(manage_address);
          waddress = webSdk.sdkUtils.getAddress(this.$store.getters.account);
        } catch (error) {
          console.log(error);
        }

        // if (revenue_address != waddress) {
        if (manage_address != waddress) {
          this.$message.error(`${this.$t("mymanageMining.pleasetoymangeaddr")}`);
          //this.$message.error(`${this.$t("mymanageMining.pleasetoyaddr")}`);
          return;
        }
      }

      if (sdk) {
        let _this_ = this;

        data.table_btn_quit = false;
        let setData = {
          title: `${this.$t("node.signoutNode")}`,
          context: `${this.$t("mymanageNode.node")}：${helper.getAddrFormat(
            data.node_address,
            10
          )}`,
          closebtnshow: true,
          request,
          success() {
            this.$notify({
              title: "success",
              message: `${_this_.$t("node.signoutNode")} OK : ${data.node_address
                }`,
              type: "success",
            });

            data.table_btn_quit = false;
          },
          err() {
            data.table_btn_quit = true;
            // _this_.$message.error("failed");
          },
        };
        let request = sdk.sendTransactionTo(
          webSdk.typeJson.candexit,
          {
            addr1: data.node_address,
          },
          setData
        );
        setData.request = request;
        this.$store.dispatch("setNotification", setData);
      }
    },

    makeGood(data) {
      if (data.node_address) {
        helper.goPathUrl(this, "mymanage/makegood", data.node_address);
      }
    },
    binding(data) {
      if (data.node_address) {
        helper.goPathUrl(this, "mymanage/NodeBinding", `${data.node_address}_${data.manage_address}`);
        //helper.goPathUrl(this, "mymanage/NodeBinding", data.node_address);
      }
    },
    upBinding(data) {
      if (data.node_address) {
        helper.goPathUrl(this, "mymanage/NodeUpBinding", `${data.node_address}_${data.manage_address}`);
        //  helper.goPathUrl(this, "mymanage/NodeUpBinding", data.node_address);
      }
    },

    SetFeerate(data) {
      if (data.node_address) {
        helper.goPathUrl(this, "mymanage/NodeChargerate", `${data.node_address}_${data.manage_address}`);     
      }
    },

    getAddrFormat(val, num = 15) {
      return helper.getAddrFormat(val, num);
    },

    seachCandidateData(val) {
      this.tableInitmyWitnessNode(query, 1);
    },

    loadData() {
      api
        .postJson("/platform/getStorageBasicSet", {})
        .then((response) => {
          if (!this.loadDataOk) {
            let result = response.result;
            this.promiseperiod = Number(result["12"] || 547);
            this.plegdetimeOut = Number(result["13"] || 30);
            this.plegdetimeWithin = Number(result["14"] || 30);
            this.loadDataOk = true;
            this.tableInitmyWitnessNode(null, 1);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },

  },

  watch: {
    "$store.getters.account": function () {
      this.wtotal = 0;
      this.tableInitmyWitnessNode(null, 1);
    },
  },
};
</script>
