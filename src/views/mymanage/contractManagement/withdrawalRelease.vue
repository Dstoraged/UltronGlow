<template>
  <div class="container-fluid">
    <div class="card" style="margin-top: 40px">
      <div class="card-body" v-loading="contract.loading">
        <div class="manage_table">
          <ie-table
            ref="re_ieTable"
            title="contract.extractRecord"
            :headers="headers"
            :datas="tableDatas"
            :showRight="false"
            @load="loadTable"
          >
            <div slot="table_top" style="margin-bottom: 5px; text-align: left">
              <el-form label-width="auto" style="text-align: left" size="mini">
                <el-form-item :label="$t(`contract.userAddress`)">
                  {{ address }}
                </el-form-item>
                <el-form-item :label="$t(`contract.contractAddress`)">
                  {{ contract }}
                </el-form-item>
                <el-form-item :label="$t(`contract.lockHeight`)">
                  {{ lockupnumber }}
                </el-form-item>
              </el-form>
            </div>
          </ie-table>
        </div>
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
    id: {
      type: String,
      default: "",
    },
  },
  data() {
    let _this_ = this;

    return {
      address: "",
      contract: "",
      lockupnumber: "",
      headers: [
        {
          label: "contract.amountIssued",
          name: "lockupamount",
          valMap(val) {
            return `${val} UTG`;
          },
        },

        {
          label: "contract.withdrawalAmount",
          name: "pickupamount",
          valMap(val) {
            return `${val} UTG`;
          },
        },

        /*{
          label: "lock.lockNumber",
          name: "lockingTime",
          valMap(val) {
            return `${val} ${_this_.$t("lock.day")}`;
          },
        },*/
        {
          label: "market.time",
          name: "createtime",
        },
      ],
      tableDatas: [],
    };
  },

  created() {
    let id = this.$route.params.id;
    if (!id) {
      return;
    }
    let ids = id.split("_");
    if (ids.length >= 3) {
      this.address = ids[0];
      this.contract = ids[1];
      this.lockupnumber = ids[2];

      this.loadTable(null, 1);
    }
  },

  methods: {
    formatTime(time) {
      return helper.formatTime(time);
    },
    getAddrFormat(data, number) {
      return helper.getAddrFormat(data, number);
    },
    goToUrl(name, params) {
      helper.goPathUrl(this, name, params);
    },

    async loadTable(query, current) {
      if (
        !this.address ||
        !this.contract ||
        !this.lockupnumber ||
        !this.$refs.re_ieTable
      ) {
        return;
      }
      await utils.getNowHeight();
      query = query || this.$refs.re_ieTable.page;
      let param = Object.assign({}, query);
      param.current = current || param.page;
      param.authAddress = this.$store.getters.account;
      param.address = this.address;
      param.contract = this.contract;
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
              item.pickupamount = `${utils.clearZero(item.pickupamount)}`;
              item.lockupamount = `${utils.clearZero(item.lockupamount)}`;
              item.remainamount = `${utils.clearZero(item.remainamount)}`;
              item.cancelamount = `${utils.clearZero(item.cancelamount)}`;
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
  },
  watch: {
    "$store.getters.account": function () {
      this.loadTable(null, 1);
    },
  },
};
</script>
<style>
.manage_table .el-dialog__body {
  padding: 10px 20px;
}
</style>
