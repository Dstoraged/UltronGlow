<template>
  <div class="container-fluid">
    <div class="card" style="margin-top: 40px">
      <div class="card-body">
        <h4 class="mt-0 header-title" style="width: 100%; text-align: left">
          <span>{{ $t("node.pledgerecord") }}</span>
        </h4>
        <h-tbale
          ref="htableNodePledgeList"
          :table-heard="nodePledgeListTableHeard"
          :table-data="nodePledgeListtableData"
          :show-right-tools="false"
          :tableId="'nodePledgeListtableId' + pledgeaddress"
          :showSubtitle="false"
          @inint-ok="tableInitnodePledgeList"
          @load="loadTablenodePledgeList"
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
  name: "NodePledgeList",
  components: { HTbale },
  props: {
    pledgeaddress: String,
  },

  data() {
    let _this_ = this;
    return {
      nodePledgeListTableHeard: [
        {
          title: "node.address",
          name: "param1",
          format: true,
          popover: true,
        },
        {
          title: "node.pledgeAmount",
          name: "value",
          valMap(val) {
            return helper.getDataFormat(val, 18, 10000).toFixed(4) + " UTG";
          },
        },
        {
          title: "node.blockNumber",
          name: "blocknumber",
          more: true,
        },
        {
          title: "node.pledgetime",
          name: "timeStamp",
          valMap(val) {
            return helper.formatTime(val, 1);
          },
          more: true,
        },
      ],
      nodePledgeListtableData: [],
      total: 0,
    };
  },
  watch: {
    pledgeaddress: {
      immediate: true,
      handler(id) {
        console.log(id);
       // this.tableInitnodePledgeList(null, 1);
      },
    },
  },

  methods: {
    tableInitnodePledgeList(query, pageNum) {
      this.loadTablenodePledgeList(query, false, pageNum);
    },
    async loadTablenodePledgeList(query, toTop = true, pageNum) {     

      if (!query && this.$refs.htableNodePledgeList) {
        query = this.$refs.htableNodePledgeList.tableQuery;
      }
      if (!query) return;
      query.pageNum = pageNum || query.pageNum;

      //query.loadingShow();

      var param = {
        current: query.pageNum,
        size: query.pageSize,
        param1: this.pledgeaddress,
        txType: "CandReq",
      };

      query.loadingShow(param, pageNum);
     
      await utils.getNowHeight();

      api
        .postJson("/platform/getTxRecord", param)
        .then((response) => {
          query.table_loading = false;

          if (response.statusCode !== 0) {
            Message.error(response.message);
          }
          let re = response.result || {};
          this.nodePledgeListtableData = re.records || [];
          if (response.result != null) this.total = response.result.total;

          setPageQuery(query, re);
          if (toTop && this.nodePledgeListtableData.length > 0) {
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
    },

    goToUrl(name, params) {
      helper.goPathUrl(this, name, params);
    },
  },
};
</script>
<style lang="scss" scoped></style>
