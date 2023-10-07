<template>
  <div class="container-fluid">
    <h-tbale
      ref="TokenTranHTable"
      :table-heard="tableHeard"
      :table-data="tableData"
      :show-right-tools="false"
      :tableId="'TokenTrantableId' + contract + tokenid"
      :showSubtitle="true"
      @inint-ok="tableInit"
      @load="loadTable"
      @colClick="colClick"
    >
      <div slot="top_title" class="row" style="padding: 6px; text-align: left">
        <div class="col-md-4">
          <span slot="top_subtitle" class="phone_font_12 sub-title">
            {{ $t("Transactions.currentTranNumber", [total]) }}
          </span>
        </div>
        <div class="col-md-4">
          <div class="input-group" style="margin: 0 auto">
            <input
              type="text"
              class="form-control"
              :placeholder="$t('Transactions.filterAddressTxn')"
              id="demo"
              v-model="searchInput"
              clearable
              style="border-right: 0px"
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

      <img
        slot="table_cell_img"
        src="@/assets/images/icon_to.png"
        class="thumb-xs ml-2"
        height="21"
        width="21"
      />
      <template slot="table_cell_status" slot-scope="scope">
        <span v-if="scope.data.status == 1" style="color: #2ebac6">
          {{ $t("comm.success") }}
        </span>
        <span v-else style="color: red; margin-right: 20px">{{
          $t("comm.fail")
        }}</span>
      </template>
    </h-tbale>
  </div>
</template>
<script>
import { Message } from "element-ui";
import { setValue } from "@/utils/auth";
import * as api from "@/api/api";
import * as helper from "@/utils/helper";
import utils from "@/utils/utils";
import HTbale from "@/components/modules/HTbale.vue";
import { setPageQuery } from "@/utils/table.js";
export default {
  name: "TokenTran",
  components: { HTbale },
  props: {
    contract: {
      type: String,
      default: "",
    },
    tokenid: {
      type: Number,
      default: null,
    },
    /*
    decimals: {
      type: Number,
      default: 18,
    },
    */
    type: {
      type: Number,
      default: 0,
    },
  },
  data() {
    let _this_ = this;
    return {
      searchInput: "",
      searchTime: null,
      tableHeard: [
        {
          title: "Transactions.TxnHash",
          name: "transHash",
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
        /*
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
          more: false,
        },
        */
        {
          title: "token.quantity",
          name: "amount",
          valMap(val, item) {
            if (val)
              return utils.weedZero(
                helper.getDataFormat(val, item.decimals, 10000),
                4
              );
            //return helper.getDataFormat(val, _this_.decimals, 10000).toFixed(4);
            else return "";
          },
          more: true,
          hide: this.type == 1 || this.type == 2,
        },

        {
          title: "token.quantity",
          name: "value",
          /*
          valMap(val,item) {
            if(val)
              return utils.weedZero(helper.getDataFormat(val, item.decimals, 10000), 4)
              //return helper.getDataFormat(val, _this_.decimals, 10000).toFixed(4);
            else
              return ''
          },
          */
          more: true,
          hide: this.type == 1 || this.type == 0,
        },

        {
          title: "tokentransfers.tokenid",
          name: "tokenId",
          hide: this.type == 0,
          isClick: true,
        },
        /*
        {
          title: "Transactions.TxnFee",
          name: "gasUsed",
          valMap(val, item) {
            return (
              helper.getDataFormat(val * item.gasPrice, 18, 10000).toFixed(4) +
              " UTG"
            );
          },
          more: true,
        },
        {
          title: "Transactions.status",
          name: "status",
        },
        */
      ],
      tableData: [],
      total: 0,
      accInfo: {},
    };
  },
  watch: {
    contract: {
      immediate: true,
      handler(id) {
        console.log(id);
        this.tableInit(null, 1);
      },
    },
    searchInput: function (newVal) {
      if (this.searchTime) {
        window.clearTimeout(this.searchTime);
        this.searchTime = null;
      }
      this.searchTime = setTimeout(() => {
        this.tableInit(null, 1);
      }, 800);
    },
  },
  destroyed() {
    if (this.searchTime) {
      window.clearTimeout(this.searchTime);
      this.searchTime = null;
    }
  },
  methods: {
    tableInit(query, pageNum) {
      this.loadTable(query, false, pageNum);
    },
    loadTable(query, toTop = true, pageNum) {
      if (!query && this.$refs.TokenTranHTable) {
        query = this.$refs.TokenTranHTable.tableQuery;
      }

      if (!query) return;
      query.pageNum = pageNum || query.pageNum;
      if (query.pageSize == 0) query.pageSize = 10;
      //query.loadingShow();

      let param = {
        current: query.pageNum,
        size: query.pageSize,
        address: this.contract,
        search:this.searchInput
      };
      if (this.tokenid) param.tokenid = this.tokenid;

      query.loadingShow(param, pageNum);

      api
        .postJson("/platform/getTransTokenListForContract", param)
        .then((response) => {
          query.table_loading = false;

          if (response.statusCode !== 0) {
            Message.error(response.message);
          }
          
          let re = response.result || {};
          this.tableData = re.records || [];
          if (response.result != null) {
            this.total = response.result.total;
            this.$parent.setTransfers(this.total);
          }
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
        case "transHash":
          this.goToUrl("TxnsInfo", row.transHash);
          //this.goTheUrl(row);
          break;
        case "blockNumber":
          this.goToUrl("BlockDetail", row.blockNumber);
          break;
        case "fromAddr":
          this.goToUrl("AccountDetail", `${row.fromAddr}_${this.type}`);
          break;
        case "toAddr":
          this.goToUrl("AccountDetail", `${row.toAddr}_${this.type}`);
          break;
        case "tokenId":
          this.goToUrl(
            "tokenid",
            row.contract + "_" + row.coinType + "_" + row.tokenId
          );
          break;
      }
    },

    goTheUrl(params) {
      setValue("tran", JSON.stringify(params));

      helper.goTheUrl(this, "Tokendetail", params);
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
