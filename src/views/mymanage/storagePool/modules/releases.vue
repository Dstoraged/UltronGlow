<template>
  <div>
  <div class="row" style="padding: 6px; text-align: left">
      <div class="col-md-4 i-ma-sm">
        <p class="sub-title" style="width: 100%; text-align: left">
          {{ $t("ftable.totalnumber", [totalrl]) }}
          
        </p>
      </div>
  </div>
    <h-tbale
      ref="htable"
      :show-subtitle="false"
      :table-id="tableId + address"
      :table-heard="tableHeard"
      :table-data="tableData"
      :show-right-tools="false"
      right-btn-col-width="100px"
      @inint-ok="tableInit"
      @load="loadTable"
    >
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
  components: { HTbale },
  props: {
    address: {
      type: String,
      default: "",
    },
    tableId: {
      type: String,
      default: "storagePoolRelease_auto",
    },
  },
  data() {
    let _this_ = this;
    return {
 
      tableHeard: [
        {
          title: "lock.revenuesaddress",
          name: "revenueaddress",
          format: true,
          popover: true,
          minWidth: "180px",
        },
        {
          title: "lock.blockNumber",
          name: "blockNumber",
          minWidth: "90px",
        },

        {
          title: "storagemining.releasedquantity",
          name: "releaseamount",
          minWidth: "140px",
          valMap(val) {
            return `${utils.clearZero(val, 8)} UTG`;
          },
        },

        {
          title: "lock.burningamount",
          name: "burntamount",
          minWidth: "120px",
          valMap(val) {
            return `${utils.clearZero(val, 8)} UTG `;
          },
          more: true,
        },

        {
          title: "lock.freedTime",
          name: "curtime",
          type: "time",
          minWidth: "120px",
        },
      ],
      tableData: [],

      pageSizerl: 10,
      pagerl: 1,
      totalrl: 0,
      totalPagerl: 0,
      rewardReleaseList: [],
      loadText: this.$t("comm.clickLoad"),
      searchInput: null,
      isMobile: utils.isMobile(),
      selType: "all",
    };
  },
  watch: {
    address: {
      immediate: true,
      handler(id) {
        console.log(id);
        this.tableInit(null, 1);
      },
    },
  },
  methods: {
    tableInit(query, pageNum) {
      this.loadTable(query, false, pageNum);
    },
    async loadTable(query, toTop = true, pageNum) {
      if (!query && this.$refs.htable) {
        query = this.$refs.htable.tableQuery;
      }
      if (!query) return;
      query.pageNum = pageNum || query.pageNum;

      var params = {
        current: query.pageNum,
        size: query.pageSize,
        address: this.address,
        //type: this.node_type,
        types: [22],
      };

      //query.loadingShow();
      query.loadingShow(params, pageNum);

      await utils.getNowHeight();
      api
        .postJson("/platform/getStorageRewardList", params)
        .then((response) => {
          query.loadingHide();

          if (response.statusCode !== 0) {
            Message.error(response.message);
          }
          let re = response.result || {};
          let tableData = re.records || [];

          this.tableData = tableData;
          setPageQuery(query, re);
          this.totalrl = re.total || 0;
          if (toTop && this.tableData.length > 0) {
            query.toTop();
          }
        })
        .catch((error) => {
          query.loadingHide(JSON.stringify(error).includes("timeout") ? 1 : 2);
        });
    },

    seachData(val) {
      this.tableInit(null, 1);
    },

    goToUrl(name, params) {
      helper.goPathUrl(this, name, params);
    },
  },
  watch: {
    address: function () {
      this.tableInit(null, 1);
    },
  },
};
</script>
<style lang="scss" scoped>
</style>
