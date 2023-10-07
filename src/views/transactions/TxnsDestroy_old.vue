<template>
  <div class="container-fluid">
    <div class="card" style="margin-top: 40px">
      <div class="card-body">
        <h4 class="mt-0 header-title" style="width: 100%; text-align: left">
          {{ $t("home.destroy") }}
        </h4>
        <p class="sub-title" style="width: 100%; text-align: left">
          {{ $t("Transactions.currentTranNumber", [total]) }}
          <span>
            {{ $t("Transactions.balanceTranNumber") }}
            <span style="color: #634790; font-size: 13pt">{{
                statsTotal.balance
            }}</span>
            {{ $t("Transactions.txinTranNumber") }}
            <span style="color: #00c4cf; font-size: 13pt">{{
                statsTotal.txin
            }}</span>
            {{ $t("Transactions.nontxTranNumber") }}
            <span style="color: #1a9a8a; font-size: 13pt">{{
                statsTotal.nontx
            }}</span>
            <img src="@/assets/images/help.png" style="margin-top: -3px; margin-left: 5px" width="14" height="14"
              :title="$t('Transactions.otherBurnt')" />
          </span>
        </p>
        <h-tbale ref="txnshtable" :table-heard="tableHeard" :table-data="tableData" :show-right-tools="false"
          :showSubtitle="false" :up-load-time="30000" table-id="TxnsDestroy" @inint-ok="tableInit" @load="loadTable"
          @colClick="colClick">
          <img slot="table_cell_img" src="@/assets/images/icon_to.png" class="thumb-xs ml-2" height="21" width="21" />
          <template slot="table_cell_status" slot-scope="scope">
            <span v-if="scope.data.status == 1" style="color: #2ebac6">{{
                $t("comm.success")
            }}</span>
            <span v-else style="color: red; margin-right: 20px">{{ $t("comm.fail") }}
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
  name: "TxnsDestroy",
  components: { HTbale},
  props: {},
  data() {
    let _this_ = this;
    const types = Object.assign({} ,utils.Transactions);
    return {
      tableHeard: [
        {
          title: "Transactions.TxnHash",
          name: "hash",
          format: true,
          popover: true,
          isClick: true,
        },
        {
          title: "Transactions.Block",
          name: "blockNumber",
          more: true,
          isClick: true,
        },
        {
          title: "Transactions.Age",
          name: "timeStamp",
          valMap(val) {
            return `${helper.formatTimimg(val)}${_this_.$t("comm.before")}`;
          },
          more: true,
        },
        {
          title: "Transactions.From",
          name: "fromAddr",
          format: true,
          popover: true,
          isClick: true,
        },
        {
          title: "",
          titleNotT: true,
          name: "img",
          width: "21px",
          minWidth: "21px",
          more: true,
        },
        {
          title: "Transactions.To",
          name: "toAddr",
          format: true,
          popover: true,
          isClick: true,
        },
        {
          title: "Transactions.Value",
          name: "value",
          valMap(val) {
            return (
              utils.weedZero(helper.getDataFormat(val, 18, 10000), 8) + " UTG"
            );
          },
          more: false,
        },
        {
          title: "Transactions.TxnFee",
          name: "gasUsed",
          valMap(val, item) {
            return (
              utils.weedZero(
                helper.getDataFormat(val * item.gasPrice, 18, 10000),
                8
              ) + " UTG"
            );
          },
          more: true,
        },
        {
          title: "Transactions.type",
          name: "ufooperator",
          valMap(val) {
            return `${_this_.$t(_this_.types[val || "common"])}`;
          },
          more: true,
        },
        {
          title: "Transactions.status",
          name: "status",
        },
      ],
      tableData: [],
      total: 0,
      types,
      statsTotal: {
        balance: "0 UTG",
        txin: "0 UTG",
        nontx: "0 UTG",
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
      var params = {
        toAddr: "ux0000000000000000000000000000000000000000",
      };
      api
        .postJson("/platform/getAddr0Data", params)
        .then((response) => {
          let result = response.result || {};
          this.statsTotal.balance = `${utils.clearZero(result.balance)} UTG`;
          this.statsTotal.txin = `${utils.clearZero(result.txin)} UTG`;
          this.statsTotal.nontx = `${utils.clearZero(result.nontx)} UTG`;
        })
        .catch((error) => {
          console.error(error);
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
.cursor {
  cursor: pointer;
}
</style>
