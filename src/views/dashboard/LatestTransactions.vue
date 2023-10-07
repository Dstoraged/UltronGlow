<template>
  <div class="col-xl-6">
    <div class="card">
      <div class="card-body">
        <div class="mt-0 header-title mb-2" style="text-align: left">
          <span style="font-size: 12pt; font-weight: bold">{{
            $t("home.latesttransactions")
          }}</span>
          <span
            style="
              text-align: right;
              margin-left: 30px;
              font-size: 10pt;
              color: #9f9f9f;
            "
            >{{ $t("home.TotaletransactionsNumber", [tranListTotal]) }}</span
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
            src="@/assets/images/icon_lbs.png"
            height="36"
            width="36"
            alt
            class="thumb-md rounded-circle mr-2"
          />
          <template slot="table_cell_hash" slot-scope="scope">
            <span
              style="color: #2ebac6"
              class="cursor"
              @click="goToUrl('TxnsInfo', scope.data.hash)"
              >{{ getAddrFormat(scope.data.hash, 6) }}</span
            >
            <br v-if="scope.type == 'pc'" />
            <span class="margin-x"
              >{{ formatTime(scope.data.timeStamp)
              }}{{ $t("comm.before") }}</span
            >
          </template>
          <template slot="table_cell_from_to" slot-scope="scope">
            <span>{{ $t("home.from") }}</span>
            <span
              style="color: #2ebac6; margin-left: 5px"
              class="cursor margin-x"
              @click="goToUrl('AccountDetail', scope.data.fromAddr)"
            >
              {{ getAddrFormat(scope.data.fromAddr, 6) }}</span
            ><br />
            <span>{{ $t("home.to") }}</span
            ><span
              style="color: #2ebac6; margin-left: 5px"
              class="cursor margin-x"
              @click="goToUrl('AccountDetail', scope.data.toAddr)"
              >{{ getAddrFormat(scope.data.toAddr, 6) }}</span
            >
          </template>
          <template slot="table_cell_handFee" slot-scope="scope">
            <span>{{ $t("home.fee") }}</span>
            <br v-if="scope.type == 'pc'" />
            <span
              class="margin-x"
              style="background-color: #f1f2f4; padding: 0 2px"
              >{{ getDataFormat(scope.data.gasUsed * scope.data.gasPrice)
              }}{{ " UTG" }}</span
            >
          </template>
        </h-tbale>
        <div style="padding: 10px">
          <button
            class="btn btn-primary btn-block waves-effect waves-light"
            type="button"
            @click="goToUrl('ViewTxns', '')"
          >
            {{ $t("home.ViewallTransactions") }}
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
  name: "LatestTransactions",
  components: { HTbale },
  data() {
    return {
      tableHeard: [
        { name: "firstImg" },
        {
          name: "hash",
        },

        {
          name: "from_to",
        },
        {
          name: "handFee",
        },
      ],
      tableData: [],
      tranListTotal: 0,
      timer: null,
      timer2: null,
      intervalTran: null,
    };
  },
  mounted() {},

  beforeDestroy() {
    if (this.intervalTran) {
      clearInterval(this.intervalTran);
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
        .postJson("/platform/getIndexTransaction", param, 60000) //getTransactionList->getIndexTransaction
        .then((response) => {
          query.loadingHide();

          if (response.statusCode !== 0) {
            Message.error(response.message);
          }
          let re = response.result || {};
          this.tableData = re.records || [];
          this.tranListTotal = re.total;
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
