<template>
  <div class="container-fluid">
    <div class="card" style="margin-top: 40px">
      <div class="card-body">
        <h-tbale
          ref="htable"
          title="mymanage.payrecord"
          :table-id="'PayRecordTableId' + this.$store.getters.account"
          :table-heard="tableHeard"
          :table-data="tableData"
          :up-load-time="upLoadTime"
          @inint-ok="tableInit"
          @load="loadTable"
          @colClick="colClick"
        ></h-tbale>
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
  name: "BlockReward",
  components: { HTbale },
  props: {
    param: {
      type: Object,
      default() {
        return {};
      },
    },
    upLoadTime: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      tableHeard: [
        {
          title: "mymanage.trans_hash",
          name: "hash",
          format: true,
          popover: true,
          isClick: true,
        },
        {
          title: "mymanage.address",
          name: "fromAddr",
          format: true,
          popover: true,
          isClick: true,
        },
        { title: "mymanage.blockheight", name: "blockNumber" },
        {
          title: "mymanage.payfulnum",
          name: "param4",
          valMap(val) {
            return utils.isEmpty(val) ? "" : `${utils.clearZero(val)} SRT`;
          },
        },
        {
          title: "mymanage.utgnumber",
          name: "param3",
          valMap(val) {
            return utils.isEmpty(val) ? "" : `${utils.clearZero(val)} UTG`;
          },
        },
        {
          title: "mymanage.TxnFee",
          name: "handFee",
          valMap(val, item) {
            let gasUsed = item.gasUsed || 0;
            let gasPrice = item.gasPrice || 0;
            return `${utils.weedZero(
              helper.getDataFormat(gasUsed * gasPrice, 18, 10000),
              8
            )}  UTG`;
          },
        },
        { title: "mymanage.payTime", name: "timeStamp", type: "time" },
      ],
      tableData: [],
    };
  },
  mounted() {},
  methods: {
    tableInit(query, pageNum) {
      this.loadTable(query, false, pageNum);
    },
    loadTable(query, toTop = true, pageNum) {
      if (!this.$store.getters.account) return;
      if (!query && this.$refs.htable) {
        query = this.$refs.htable.tableQuery;
      }
      if (!query) return;
      query.pageNum = pageNum || query.pageNum;
      var params = {
        current: query.pageNum,
        size: query.pageSize,
        fromAddr: this.$store.getters.account,
        txType: "CandReq",// CandPnsh
      };
      // query.loadingShow();

      Object.assign(params, this.param);

      query.loadingShow(params, pageNum);

      api
        .postJson("/platform/getTxRecord", params)
        .then((response) => {
          query.loadingHide();

          if (response.statusCode !== 0) {
            Message.error(response.message);
          }
          let re = response.result || {};
          this.tableData = re.records || [];

          setPageQuery(query, re);
          if (toTop && this.tableData.length > 0) {
            query.toTop();
          }
        })
        .catch(() => {
          query.loadingHide();
        });
    },
    colClick(data) {
      let col = data.col || {};
      let row = data.row || {};
      switch (col.name) {
        case "hash":
          this.goToUrl("TxnsInfo", row.hash);
          break;
        case "fromAddr":
          this.goToUrl("AccountDetail", row.fromAddr);

          break;
      }
    },
    goToUrl(name, params) {
      helper.goPathUrl(this, name, params);
    },
  },
  watch: {
    "$store.getters.account": function () {
      this.tableInit(null, 1);
    },
  },
};
</script>
<style lang="scss" scoped></style>
