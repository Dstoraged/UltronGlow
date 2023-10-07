<template>
  <div class="col-xl-6">
    <div class="card">
      <div class="card-body">
        <div class="mt-0 header-title mb-2" style="text-align: left">
          <span style="font-size: 12pt; font-weight: bold">
            {{ $t("home.latestblocks") }}
          </span>
          <span
            style="
              text-align: right;
              margin-left: 30px;
              font-size: 10pt;
              color: #9f9f9f;
            "
            >{{ $t("home.TotaleblocksNumber", [blockListTotal]) }}</span
          >
        </div>
        <h-tbale
          ref="htable"
          :heard-all-hid="true"
          :show-order="false"
          :show-titles="false"
          :phone-line="false"
          :show-page-tools="false"
          phone-lable-width="0px"
          :table-heard="tableHeard"
          :table-data="tableData"
          :up-load-time="20000"
          @inint-ok="tableInit"
          @load="loadTable"
        >
          <img
            slot="table_cell_firstImg"
            src="@/assets/images/icon_lb.png"
            height="36"
            width="36"
            alt
            class="thumb-md rounded-circle mr-2"
          />
          <template slot="table_cell_block" slot-scope="scope">
            <span
              style="color: #2ebac6"
              class="cursor margin-x"
              @click="goToUrl('BlockDetail', scope.data.blockNumber)"
              >{{ scope.data.blockNumber }}</span
            >
            <br v-if="scope.type == 'pc'" />
            <span class="margin-x"
              >{{ formatTime(scope.data.timeStamp)
              }}{{ $t("comm.before") }}</span
            >
          </template>
          <template slot="table_cell_validationAddress" slot-scope="scope">
            <span class="margin-x">{{ $t("home.ultronnode") }}</span>
            <span
              style="color: #2ebac6"
              class="cursor margin-x"
              @click="goToUrl('AccountDetail', scope.data.minerAddress)"
              >{{ getAddrFormat(scope.data.minerAddress, 6) }}
            </span>
            <br v-if="scope.type == 'pc'" />
            <span class="margin-x">{{
              $t("home.tranNumber", [scope.data.blockTransactionCount])
            }}</span>
          </template>
          <div slot="table_cell_award" slot-scope="scope">
            <span>{{ getDataFormat(scope.data.reward) }} {{ " UTG" }}</span>
          </div>
        </h-tbale>

        <div style="padding: 10px">
          <button
            class="btn btn-primary btn-block waves-effect waves-light"
            type="button"
            @click="goToUrl('ViewBlocks', '')"
          >
            {{ $t("home.Viewallblocks") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import * as api from "@/api/api";
import * as helper from "@/utils/helper";
import HTbale from "@/components/modules/HTbale.vue";
import { setPageQuery } from "@/utils/table.js";
export default {
  name: "LatestBlocks",
  components: { HTbale },
  data() {
    return {
      tableHeard: [
        { name: "firstImg" },
        {
          name: "block",
        },

        {
          name: "validationAddress",
        },
        {
          name: "award",
          style: `width: 160px;
              background: url(/static/images/icon_tbg.png) right center
                no-repeat;
              text-align: right;
              padding-right: 10px;
              display: table-cell;
              vertical-align: middle;`,
        },
      ],
      tableData: [],

      blockListTotal: 0,
      blockList: [],
      timer: {},
      timer2: {},
      intervalBlock: null,
    };
  },
  mounted() {
    /*this.intervalBlock = setInterval(() => {
      this.tableInit();
    }, 20000);*/
  },

  beforeDestroy() {
    if (this.intervalBlock) {
      clearInterval(this.intervalBlock);
    }
    if (this.timer) {
      clearInterval(this.timer);
    }
    if (this.timer2) {
      clearInterval(this.timer2);
    }
  },
  methods: {
    tableInit(query) {
      this.loadTable(query, false);
    },
    loadTable(query, toTop = true) {
      if (!query && this.$refs.htable) {
        query = this.$refs.htable.tableQuery;
      }
      if (!query) return;

      var param = {
        current: 1,
        size: 5,
      };
      query.loadingShow();

      api
        .postJson("/platform/getIndexBlock", param, 60000)  //getBlockList->getIndexBlock
        .then((response) => {
          query.loadingHide();

          if (response.statusCode !== 0) {
            Message.error(response.message);
          }
          let re = response.result || {};
          this.tableData = re.records || [];
          this.blockListTotal = re.total;
          this.timer2 && clearInterval(this.timer2) && (this.timer2 = null);
          this.timer2 = setInterval(() => {
            this.tableData.forEach((item) => {
              item.timeStamp++;
            });
          }, 1000);

          setPageQuery(query, re);
          if (toTop && this.tableData.length > 0) {
            query.toTop();
          }
        })
        .catch((error) => {
          query.loadingHide(JSON.stringify(error).includes("timeout") ? 1 : 2);
        });      
    },

    formatTime(time) {
      return helper.formatTimimg(time);
    },

    goToUrl(name, params) {
      helper.goPathUrl(this, name, params);
    },

    getAddrFormat(data, number) {
      return helper.getAddrFormat(data, number);
    },

    getDataFormat(val) {
      return helper.getDataFormat(val, 18, 10000).toFixed(4);
    },
  },
};
</script>
<style lang="scss" scoped>
.cursor {
  cursor: pointer;
}
.margin-x {
  margin: 0px 3px;
}
</style>
