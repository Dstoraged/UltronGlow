<template>
  <div class="card">
    <div class="card-body">
      <div class="manage_table">
        <ie-table
          ref="re_ieTable"
          title="contract.extractRecord"
          :headers="headers"
          :datas="tableDatas"
          :showRight="false"
          @load="loadTable"
          @onclickCell="clickCell"
        >
        </ie-table>
      </div>
    </div>
  </div>
</template>
<script>
import { Message } from "element-ui";
import * as api from "@/api/api";
import * as helper from "@/utils/helper";
import { showLoading, hideLoading } from "@/utils/loading";
import IeTable from "@/components/modules/IeTable.vue";
import { setTable } from "@/utils/tableUtil.js";
import utils from "@/utils/utils";
import fNumberRe from "@/components/modules/fNumberRe.vue";
export default {
  components: { IeTable, fNumberRe },
  props: {
    datas: {
      type: Object,
      default() {
        return {};
      },
    },
    contractAddr: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      headers: [
        {
          label: "contract.extractAccount",
          name: "address",
          click: true,
        },

        {
          label: "contract.withdrawalAmount",
          name: "pickupamount",
          valMap(val) {
            return `${val} UTG`;
          },
        },

        {
          label: "market.time",
          name: "createtime",
        },
      ],
      tableDatas: [],
    };
  },

  mounted() {},
  beforeDestroy() {},

  methods: {
    formatTime(time) {
      return helper.formatTime(time);
    },
    getAddrFormat(data, number) {
      return helper.getAddrFormat(data, number);
    },
    goToUrl(name, params) {
      console.log("params=" + params);
      helper.goPathUrl(this, name, params);
    },

    async loadTable(query, current) {
      if (
        !this.$store.getters.account ||
        !this.$refs.re_ieTable ||
        !this.contractAddr
      ) {
        if (!query) {
          return;
        }
      }
      await utils.getNowHeight();
      query = query || this.$refs.re_ieTable.page;
      let param = Object.assign({}, query);
      param.current = current || param.page;
      param.authAddress = this.$store.getters.account;
      param.contract = this.contractAddr;
      param.type = 2;
      showLoading();

      api
        .postJson("/platform/getContractLockupList", param)
        .then((response) => {
          if (response.statusCode !== 0) {
            Message.error(response.message);
            hideLoading();
          } else {
            let result = response.result || {};
            setTable(result, query);

            var data = result.records || [];
            const rand = (query.page - 1) * query.pageSize;
            const newData = [];

            data.forEach((item, index) => {
              item.ieIndex = index + 1 + parseInt(rand || 0);

              let unLockNumber =
                (item.lockupnumber || 0) + (item.lockupperiod || 0);

              let releaseHeigth = item.releaseperiod || 0;
              item.lockingTime = utils.lockingTime(
                item.startTime,
                item.avgBlockTime,
                unLockNumber,
                releaseHeigth
              );
              item.cancelamount = `${
                item.cancelnumber
                  ? utils.clearZero(
                      (item.lockupamount || 0) - (item.cancelamount || 0)
                    )
                  : ""
              }`;
              item.pickupamount = `${utils.clearZero(item.pickupamount)}`;
              item.lockupamount = `${utils.clearZero(item.lockupamount)}`;
              item.remainamount = `${utils.clearZero(item.remainamount)}`;
              item.createtime =
                item.createtime > 1000
                  ? this.formatTime(item.createtime / 1000)
                  : "";
              newData.push(item);
            });
            this.tableDatas = newData;
            hideLoading();
          }
        })
        .catch((error) => {
          console.error(error);
          Message.error(error.ErrMsg);
          hideLoading();
        });
    },

    clickCell(item, data) {
      switch (item.name) {
        case "address":
          helper.goPathUrl(this, "accountdetail", `${data.address}`);
          break;
      }
    },
  },

  watch: {
    "$store.getters.account": {
      immediate: true,
      handler() {
        this.loadTable();
      },
    },
    "$store.getters.getsdk": function () {
      this.loadTable();
    },
    contractAddr: function () {
      this.loadTable();
    },
  },
};
</script>
<style>
.manage_table .el-dialog__body {
  padding: 10px 20px;
}
</style>
