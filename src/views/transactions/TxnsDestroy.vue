<template>
  <div class="container-fluid">
    <div class="card" style="margin-top: 40px">
      <div class="card-body">
        <h4 class="mt-0 header-title" style="width: 100%; text-align: left">
          {{ $t("home.destroy") }}
        </h4>
        <p class="sub-title" style="width: 100%; text-align: left" id="subtitlep">
          <span>
            {{ $t("Transactions.balanceTranNumber") }}
            <span style="color: #634790; font-size: 13pt">{{
              statsTotal.balance
            }}</span>
            {{ $t("Transactions.txinTranNumber") }}
            <span style="color: #00c4cf; font-size: 13pt">{{
              statsTotal.txin
            }}</span>

            {{ $t("Transactions.lockTranNumber") }}
            <span style="color: #00c4e8; font-size: 13pt">{{
              statsTotal.lockin
            }}</span>

            {{ $t("Transactions.gasTranNumber") }}
            <span style="color: #00c7a5; font-size: 13pt">{{
              statsTotal.blockBurn
            }}</span>

            {{ $t("Transactions.pledgeTranNumber") }}
            <span style="color: #00b6a5; font-size: 13pt">{{
              statsTotal.pledgeBurn
            }}</span>

            {{ $t("Transactions.nontxTranNumber") }}
            <span style="color: #1a9a8a; font-size: 13pt">{{
              statsTotal.nontx
            }}</span>
            <img src="@/assets/images/help.png" style="margin-top: -3px; margin-left: 5px" width="14" height="14"
              :title="$t('Transactions.otherBurnt')" />          
          </span>
        </p>
        <div class="col-md-12 ie-tab-div" style="margin: 0px; padding: 0px" >
          <ul class="nav nav-pills nav-justified phone_nav_overflow-x" role="tablist" style="
                font-size: 11pt;
                font-weight: bold;
                margin: 0px;
                padding: 0px;
              ">
            <li class="nav-item waves-effect waves-light">
              <a class="nav-link active" data-toggle="tab" href="#destroy-tran" role="tab" aria-selected="true"
                @click="handleNavLink($event)">
                <span class="d-none d-md-block">{{
                  $t("Transactions.trandestroy")
                }}</span>
                <span class="d-block d-md-none">{{
                  $t("Transactions.trandestroy")
                }}</span>
              </a>
            </li>
            <li class="nav-item waves-effect waves-light">
              <a class="nav-link" data-toggle="tab" href="#destroy-lock" role="tab" @click="handleNavLink($event)">
                <span class="d-none d-md-block">
                  {{ $t("Transactions.lockdestroy") }}
                </span>
                <span class="d-block d-md-none">
                  {{ $t("Transactions.lockdestroy") }}
                </span>
              </a>
            </li>

            <li class="nav-item waves-effect waves-light">
              <a class="nav-link" data-toggle="tab" href="#destroy-gas" role="tab" @click="handleNavLink($event)">
                <span class="d-none d-md-block">
                  {{ $t("Transactions.gasdestroy") }}
                </span>
                <span class="d-block d-md-none">
                  {{ $t("Transactions.gasdestroy") }}
                </span>
              </a>
            </li>

            <li class="nav-item waves-effect waves-light">
              <a class="nav-link" data-toggle="tab" href="#destroy-pledge" role="tab" @click="handleNavLink($event)">
                <span class="d-none d-md-block">
                  {{ $t("Transactions.pledgedestroy") }}
                </span>
                <span class="d-block d-md-none">
                  {{ $t("Transactions.pledgedestroy") }}
                </span>
              </a>
            </li>
          </ul>
        </div>
        <!-- Tab panes -->
        <div class="tab-content" style="border-top: solid 1px #f0f0f0; margin-top: 20px">
          <div class="tab-pane active" id="destroy-tran" role="tabpanel">
            <TranDestroy />
          </div>
          <div class="tab-pane" id="destroy-lock" role="tabpanel">
            <lockDestroy />
          </div>
          <div class="tab-pane" id="destroy-gas" role="tabpanel">
            <gasDestroy />
          </div>
          <div class="tab-pane" id="destroy-pledge" role="tabpanel">
            <PledgeDestroy />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Message } from "element-ui";
import * as api from "@/api/api";
import * as helper from "@/utils/helper";
import utils from "@/utils/utils";

import TranDestroy from "./components/TranDestroy.vue";
import lockDestroy from "./components/lockDestroy.vue";
import gasDestroy from "./components/gasDestroy.vue";
import PledgeDestroy from "./components/PledgeDestroy.vue";
import { setPageQuery } from "@/utils/table.js";
export default {
  name: "TxnsDestroy",
  components: { TranDestroy, lockDestroy, gasDestroy, PledgeDestroy },
  props: {},
  data() {
    return {
      statsTotal: {
        balance: "0 UTG",
        txin: "0 UTG",
        lockin: "0 UTG",
        nontx: "0 UTG",
        blockBurn: "0 UTG",
        pledgeBurn: "0 UTG",
      },     
    };
  },
  mounted() {
    this.getAddr0Data();
  },

  methods: {
    handleNavLink(event) {
      $(".nav-link").removeClass("active");
      console.log(event.target.tagName);
      event.currentTarget.className = "nav-link active";
    },

    getAddr0Data() {
      const loading = this.$loading({
        lock: true,
        text: '',
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.2)",
        fullscreen: false,
        target: document.querySelector('#subtitlep')
      });

    

      var params = {
        toAddr: "ux0000000000000000000000000000000000000000",
        blockNumber: window.$url.burntFeesNumber
      };
      api
        .postJson("/platform/getAddr0Data", params)
        .then((response) => {
          let result = response.result || {};
          this.statsTotal.balance = `${utils.clearZero(result.balance)} UTG`;
          this.statsTotal.txin = `${utils.clearZero(result.txin)} UTG`;
          this.statsTotal.nontx = `${utils.clearZero(result.nontx)} UTG`;
          this.statsTotal.lockin = `${utils.clearZero(result.burned)} UTG`;
          this.statsTotal.blockBurn = `${utils.clearZero(result.blockBurn)} UTG`;
          this.statsTotal.pledgeBurn = `${utils.clearZero(result.pledgeBurn)} UTG`;
          loading.close();
        })
        .catch((error) => {
          console.error(JSON.stringify(error));          
          this.$message.error("Network Error");
          loading.close();
        });
    },

    tableInit(query, pageNum) {
      this.loadTable(query, false, pageNum);
    },
    loadTable(query, toTop = true, pageNum) {
      if (!query && this.$refs.txnshtable) {
        query = this.$refs.txnshtable.tableQuery;
      }

      if (!query) return;
      query.pageNum = pageNum || query.pageNum;
      if (query.pageSize == 0) query.pageSize = 10;
      //query.loadingShow();

      var param = {
        current: query.pageNum,
        size: query.pageSize,
        toAddr: "ux0000000000000000000000000000000000000000",
      };

      /*
      if (this.searchInput !== "" && this.searchInput != null) {
        param.address = this.searchInput;
      }
      if (this.selType != "all" && this.selType != null && this.selType != 'undefined') {
        param.ufooperator = this.selType;
      }
      if (this.selStatus != "all" && this.selStatus != null && this.selStatus != 'undefined') {
        param.status = this.selStatus;
      }
    */
      query.loadingShow(param, pageNum);

      api
        .postJson("/platform/getTransactionList", param)
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
        case "hash":
          this.goToUrl("TxnsInfo", row.hash);
          break;
        case "blockNumber":
          this.goToUrl("BlockDetail", row.blockNumber);
          break;
        case "fromAddr":
          this.goToUrl("AccountDetail", row.fromAddr);
          break;
        case "toAddr":
          this.goToUrl("AccountDetail", row.toAddr);
          break;
      }
    },

    goToUrl(name, params) {
      helper.goPathUrl(this, name, params);
    },
  },
};
</script>
<style lang="scss" scoped>
.ie-tab-div{
 max-width: 800px;
}
.cursor {
  cursor: pointer;
}

.phone_nav_overflow-x {
  width: 100%;
  overflow-x: auto;
  display: grid;
  grid-template-columns: repeat(4, minmax(155px, auto));
  text-align: center;
}
</style>
