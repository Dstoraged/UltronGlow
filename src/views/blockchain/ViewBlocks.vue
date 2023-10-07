<template>
  <div class="container-fluid">
    <div class="card" style="margin-top: 40px">
      <div class="card-body" style="padding: 10px">
        <div class="row" style="padding: 6px; text-align: left">
          <div class="col-md-4">
            <h4 class="mt-0 header-title" style="width: 100%; text-align: left">
              {{ $t("block.block") }}
            </h4>
            <p
              class="sub-title"
              style="
                width: 100%;
                text-align: left;
                font-family: Helvetica, Arial, sans-serif;
                font-size: 0.875rem;
                font-weight: 400;
              "
            >
              {{
                $t("block.TotaleblockNumber", {
                  fblock: fblock,
                  lblock: lblock,
                  count: total,
                })
              }}
            </p>
          </div>
          <div class="col-md-4">
            <div class="input-group" style="margin: 0 auto">
              <input
                type="text"
                class="form-control"
                :placeholder="$t('block.blockSearch')"
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
          ref="htable"
          :table-heard="tableHeard"
          :table-data="tableData"
          :show-right-tools="false"
          tableId="ViewBlocks"
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
import HTbale from "@/components/modules/HTbale.vue";
import { setPageQuery } from "@/utils/table.js";

export default {
  name: "ViewBlocks",
  components: { HTbale },
  props: {},
  data() {
    let _this_ = this;
    return {
      tableHeard: [
        {
          title: "block.block",
          name: "blockNumber",
          isClick: true,
        },
        {
          title: "block.Age",
          name: "timeStamp",
          valMap(val) {
            return `${helper.formatTimimg(val)}${_this_.$t("comm.before")}`;
          },
        },
        {
          title: "block.Txn",
          name: "blockTransactionCount",
        },
        {
          title: "block.Miner",
          name: "minerAddress",
          format: true,
          popover: true,
          isClick: true,
        },
        {
          title: "block.GasUsed",
          name: "gasUsed",
          valMap(val, item) {
            let gasUsedRate =
              Math.floor((item.gasUsed / item.gasLimit) * 10000) / 100;
            return `${val}(${gasUsedRate})%`;
          },
          more: true,
        },
        {
          title: "block.GasLimit",
          name: "gasLimit",
          more: true,
        },
        {
          title: "block.GasPrice",
          name: "avgGasPrice",
          valMap(val) {
            return `${helper.getDataFormat(val, 9)} Gwei`;
          },
          more: true,
        },
        {
          title: "block.reward",
          name: "reward",
          valMap(val,item) {
            if(item.blockNumber>=window.$url.burntFeesNumber)
              return helper.getDataFormat((val - item.gasUsed * item.avgGasPrice*0.5), 18, 10000).toFixed(4) + " UTG";
            else
              return helper.getDataFormat(val, 18, 10000).toFixed(4) + " UTG";
          },
          more: true,
        },
        {
          title: "block.BurntFees",
          name: "gasBurnt",
          valMap(val,item) {
            if(item.blockNumber>=window.$url.burntFeesNumber)
              return `${helper.getDataFormat(item.gasUsed * item.avgGasPrice*0.5, 18, 10000)} UTG`;
            else
              return `0 UTG`;
          },
          more: true,
        },
      ],
      tableData: [],
      searchInput: null,
      fblock: "",
      lblock: "",
      total: 0,
    };
  },

  methods: {
    tableInit(query, pageNum) {
      this.loadTable(query, false, pageNum);
    },
    loadTable(query, toTop = true, pageNum) {
      if (!query && this.$refs.htable) {
        query = this.$refs.htable.tableQuery;
      }
      if (!query) return;
      query.pageNum = pageNum || query.pageNum;

      //query.loadingShow();
      if (query.pageSize == 0) query.pageSize = 10;
      var param = {
        current: query.pageNum,
        size: query.pageSize,
      };

      if (this.searchInput !== "" && this.searchInput != null) {
        param.address = this.searchInput;
      }

      query.loadingShow(param, pageNum);
      this.searchInput = param.address;

      api
        .postJson("/platform/getBlockList", param)
        .then((response) => {
          query.table_loading = false;

          if (response.statusCode !== 0) {
            Message.error(response.message);
          }
          let re = response.result || {};
          this.tableData = re.records || [];
          if (response.result != null) this.total = response.result.total;
          this.tableData.forEach((item, index) => {
            if (index == 0) this.lblock = item.blockNumber;
            else this.fblock = item.blockNumber;
          });

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
        case "blockNumber":
          this.goToUrl("BlockDetail", row.blockNumber);
          break;
        case "minerAddress":
          this.goToUrl("AccountDetail", row.minerAddress);
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
