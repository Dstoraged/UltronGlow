<template>
  <div class="container-fluid">
    <div class="card" style="margin-top: 40px">
      <div class="card-body">
        <h4 class="mt-0 header-title" style="width: 100%; text-align: left">
          {{ $t("tokentransfers.title721", ['URC-721']) }}
        </h4>
        <p class="sub-title" style="width: 100%; text-align: left">
          {{ $t("tokentransfers.currentTranNumber", [total]) }}
        </p>
        <h-tbale ref="htableTokenTransfersERC721" :table-heard="tableHeard" :table-data="tableData"
          :show-right-tools="false" tableId="TokenTransfersERC721tableId" :showSubtitle="false" @inint-ok="tableInit"
          @load="loadTable" @colClick="colClick">
          <img slot="table_cell_img" src="@/assets/images/icon_to.png" class="thumb-xs ml-2" height="21" width="21" />
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
  name: "TokenTransfersERC721",
  components: { HTbale },
  props: {},
  data() {
    let _this_ = this;
    return {
      tableHeard: [
         {
          title: "tokentransfers.txnHash",
          name: "transHash",
          format: true,
          popover: true,
          isClick: true,
        },
         {
          title: "tokentransfers.block",
          name: "blockNumber",
          more: true,
          isClick: true,
        },
        {
          title: "tokentransfers.age",
          name: "timeStamp",
          valMap(val) {
            return `${helper.formatTimimg(val)}${_this_.$t("comm.before")}`;
          },
          more: true,
        },
        {
          title: "tokentransfers.from",
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
          title: "tokentransfers.to",
          name: "toAddr",
          format: true,
          popover: true,
          isClick: true,
        },     
        {
          title: "tokentransfers.tokenid",
          name: "tokenId",
          more: true,
          isClick: true,
        },
        {
          title: "tokentransfers.token",
          name: "tokenname",
           valMap(val,item) {
            if(item.symbol)
              return val+" ("+item.symbol+")";
            else
               return val;
          },
          more: true,
          isClick: true,
        },       
      ],
      tableData: [],
      total: 0,

      message: {},
      searchInput: "",
    };
  },


  methods: {
    tableInit(query, pageNum) {
      this.loadTable(query, false, pageNum);
    },
    loadTable(query, toTop = true, pageNum) {
      if (!query && this.$refs.htableTokenTransfersERC721) {
        query = this.$refs.htableTokenTransfersERC721.tableQuery;
      }

      if (!query) return;
      query.pageNum = pageNum || query.pageNum;
      if (query.pageSize == 0) query.pageSize = 10;
      //query.loadingShow();

     var param = {
        current: query.pageNum,
        size: query.pageSize,
        type: 1,
      };

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
        case "transHash":
          this.goToUrl("TxnsInfo", row.transHash);
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
        case "tokenname":
          this.goToUrl("token", row.contract+"_"+row.coinType);
          break;
        case "tokenId":
          this.goToUrl("tokenid", row.contract+"_"+row.coinType+"_"+row.tokenId); 
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
