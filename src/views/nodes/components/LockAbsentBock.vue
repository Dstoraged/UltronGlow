<template>
  <div>
    <h4 class="mt-0 header-title" style="width: 100%; text-align: left">
      <p class="sub-title" style="width: 100%; text-align: left">
        {{ $t("absent.currentAbsentNumber", [totala]) }}
      </p>
    </h4>

    <h-tbale
      ref="LockAbsentBockTable"
      :table-heard="lockAbsentBocktableHeard"
      :table-data="lockAbsentBocktableData"
      :show-right-tools="false"
      :tableId="'lockAbsentBocktableId' + node_addr"
      :showSubtitle="false"
      @inint-ok="tableInitlockAbsentBock"
      @load="loadTablelockAbsentBock"
      @colClick="colClick"
    >
      <template slot="table_cell_type" slot-scope="scope">
        <span v-if="scope.data.type == 1">{{ $t("absent.absentType1") }}</span>
        <span v-else-if="scope.data.type == 2">{{
          $t("absent.absentType2")
        }}</span>
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
  name: "LockAbsentBock",
  components: { HTbale },
  props: {
    node_addr: {
      type: String,
      default: "",
    },
    node_type: {
      type: Number,
      default: 0,
    },
  },
  data() {
    let _this_ = this;
    return {
      lockAbsentBocktableHeard: [
        {
          title: "absent.address",
          name: "address",
          format: true,
          popover: true,
        },
        {
          title: "absent.blockNumber",
          name: "blockNumber",
        },
        {
          title: "absent.punishScore",
          name: "fractions",
        },
        {
          title: "absent.punishCause",
          name: "type",
          more: true,
        },
        {
          title: "absent.punishTime",
          name: "timeStamp",
          more: true,
        },
      ],
      lockAbsentBocktableData: [],
      totala: 0,
      searchInput: null,
    };
  },
  watch: {
    node_addr: {
      immediate: true,
      handler(id) {
        console.log(id);
       // this.tableInitlockAbsentBock(null, 1);
      },
    },
  },
  methods: {
    tableInitlockAbsentBock(query, pageNum) {
      this.loadTablelockAbsentBock(query, false, pageNum);
    },
    loadTablelockAbsentBock(query, toTop = true, pageNum) {
      if (!query && this.$refs.LockAbsentBockTable) {
        query = this.$refs.LockAbsentBockTable.tableQuery;
      }

      if (!query) return;
      query.pageNum = pageNum || query.pageNum;

      //query.loadingShow();

      var param = {
        current: query.pageNum,
        size: query.pageSize,
        address: this.node_addr,
      };

      query.loadingShow(param, pageNum);
      

      api
        .postJson("/platform/utg/getPunished", param)
        .then((response) => {
          query.table_loading = false;

          if (response.statusCode !== 0) {
            Message.error(response.message);
          }

          if (response.result != null) {
            this.totala = response.result.total;
          }
          let re = response.result || {};
          this.lockAbsentBocktableData = re.records || [];

          setPageQuery(query, re);
          if (toTop && this.lockAbsentBocktableData.length > 0) {
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
<style lang="scss" scoped></style>
