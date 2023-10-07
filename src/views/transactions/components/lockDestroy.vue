<template>
  <div>
    <h-tbale
      ref="lockDestroyhtable"
      :table-heard="tableHeard"
      :table-data="tableData"
      :show-right-tools="false"
      :showSubtitle="true"
      :up-load-time="30000"
      table-id="lockDestroyTableid"
      @inint-ok="lockDestroytableInit"
      @load="loadlockDestroyTable"
      @colClick="colClick"
    >
      <span slot="top_subtitle" class="phone_font_12">
        {{ $t("lockdestroy.currentTotal", [total]) }}
      </span>
    </h-tbale>
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
  name: "lockDestroy",
  components: { HTbale },
  props: {},
  data() {
    let _this_ = this;
     const types = {
      1: "storagereward.type1",
      2: "storagereward.type2",
      3: "storagereward.type3",
      4: "storagereward.type4",
      5: "storagereward.type5",
      6: "storagereward.type6",
      7: "storagereward.type7",
      8: "storagereward.type8",
      9: "storagereward.type9",
      10: "storagereward.typ10",
      11: "storagereward.typ11",
      17: "storagereward.type17",
      18: "storagereward.type18",
      21: "storagereward.type21",
      23: "storagereward.type23",
    };
    return {
      tableHeard: [
        {
          title: "lockdestroy.minerAddress",
          name: "address",
          format: true,
          popover: true,
          isClick: true,
        },
        {
          title: "lockdestroy.type",
          name: "type",
          valMap(val) {
            return `${_this_.$t(_this_.types[val])}`;
          },
          more: false,
        },
        {
          title: "lockdestroy.blockNumber",
          name: "blockNumber",
          more: false,
        },

        {
          title: "lockdestroy.burningamount",
          name: "burntamount",
          minWidth: "120px",
          valMap(val) {
            return `${utils.clearZero(val, 4)} UTG `;
          },
          more: false,
        },
      ],
      tableData: [],
      total: 0,
      types,
      statsTotal: {
        burntAmount: "--",
      },
    };
  },

  methods: {
    lockDestroytableInit(query, pageNum) {
      this.loadlockDestroyTable(query, false, pageNum);
    },
    loadlockDestroyTable(query, toTop = true, pageNum) {
      if (!query && this.$refs.lockDestroyhtable) {
        query = this.$refs.lockDestroyhtable.tableQuery;
      }

      if (!query) return;
      query.pageNum = pageNum || query.pageNum;
      if (query.pageSize == 0) query.pageSize = 10;

      var param = {
        current: query.pageNum,
        size: query.pageSize,
        types: [1, 3, 5, 7, 9, 17, 11, 21, 23],
        burned: true,
      };
      query.loadingShow(param, pageNum);

      api
        .postJson("/platform/getStorageRewardList", param)
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
        case "address":
          this.toMinerView(row);
          break;
      }
    },

    toMinerView(data) {
      if (data.address) {
        if (data.type == 1) {
          helper.goPathUrl(
            this,
            "NodeView",
            `${data.address}_${data.type + 1}`
          );
        }
        if (data.type == 9 || data.type == 5) {
          helper.goPathUrl(this, "StorageDetail", data.address);
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.cursor {
  cursor: pointer;
}
</style>
