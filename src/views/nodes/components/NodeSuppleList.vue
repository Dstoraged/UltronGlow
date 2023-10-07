<template>
  <div class="container-fluid">
    <div class="card" style="margin-top: 40px">
      <div class="card-body">
        <h4 class="mt-0 header-title" style="width: 100%; text-align: left">
          <span>{{ $t("node.rechargeRecord") }}</span>
        </h4>

        <h-tbale
          ref="htableNodeSuppleList"
          :table-heard="nodeSuppleListTableHeard"
          :table-data="nodeSuppleListtableData"
          :show-right-tools="false"
          :tableId="'NodeSuppleListtableId' + pledgeaddress"
          :showSubtitle="false"
          @inint-ok="tableInitnodeSuppleList"
          @load="loadTablenodeSuppleList"
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
  name: "NodeSuppleList",
  components: { HTbale },
  props: {
    pledgeaddress: String,
  },

  data() {
    let _this_ = this;
    return {
      nodeSuppleListTableHeard: [
        {
          title: "node.rechargeAddress",
          name: "fromAddr",
          format: true,
          popover: true,
        },
        {
          title: "node.nodeAddress",
          name: "param1",
          format: true,
          popover: true,
        },
        {
          title: "node.valueUTG",
          name: "value",
          valMap(val) {
            return helper.getDataFormat(val, 18, 10000).toFixed(4) + " UTG";
          },
        },
        {
          title: "node.rechargeTime",
          name: "timestamp",
          valMap(val) {
            return helper.formatTime(val, 1);
          },
          more: true,
        },
        {
          title: "node.rechargeHeight",
          name: "blocknumber",
          more: true,
        },
      ],
      nodeSuppleListtableData: [],
      total: 0,
    };
  },

  watch: {
    pledgeaddress: {
      immediate: true,
      handler(id) {
        console.log(id);
       // this.tableInitnodeSuppleList(null, 1);
      },
    },
  },
  methods: {
    tableInitnodeSuppleList(query, pageNum) {
      this.loadTablenodeSuppleList(query, false, pageNum);
    },
    async loadTablenodeSuppleList(query, toTop = true, pageNum) {      

      if (!query && this.$refs.htableNodeSuppleList) {
        query = this.$refs.htableNodeSuppleList.tableQuery;
      }
      if (!query) return;
      query.pageNum = pageNum || query.pageNum;

      //query.loadingShow();

      var param = {
        current: query.pageNum,
        size: query.pageSize,
        param1: this.pledgeaddress,
        txType: "CandPnsh",
        address: "",
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
          this.nodeSuppleListtableData = re.records || [];
          if (response.result != null) this.total = response.result.total;

          setPageQuery(query, re);
          if (toTop && this.nodeSuppleListtableData.length > 0) {
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
