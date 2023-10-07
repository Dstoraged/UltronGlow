<template>
  <div class="container-fluid">
    <div class="card">
      <div class="card-body">
        <div class="manage_table">
          <ie-table
            ref="re_ieTable"
            title=""
            :headers="headers"
            :datas="tableDatas"
            :showRight="isSecondOwner"
            @load="loadTable"
            @onclickCell="clickCell"
          >
            <div slot="table_top" style="margin-bottom: 5px">
              <div style="float: left">
                {{ $t("contract.withdrawableAmount") }}：{{ calRelease }}
                <el-button
                  v-show="calRelease > 0"
                  size="mini"
                  style="float: right; margin-left: 5px"
                  type="success"
                  @click="withdrawalReleaseFund"
                  icon="el-icon-s-cooperation"
                >
                  {{ $t("contract.withdrawMoney") }}</el-button
                >
              </div>

              <template v-if="isSecondOwner">
                <el-button
                  style="float: right"
                  size="mini"
                  type="primary"
                  @click="grantProfit"
                  icon="el-icon-thumb"
                  >{{ $t("contract.provide") }}
                </el-button>
              </template>
              <div style="clear: both"></div>
            </div>
            <template slot="rightBtns" slot-scope="scope">
              <template v-if="isSecondOwner">
                <el-button
                  size="mini"
                  type="warning"
                  icon="el-icon-switch-button"
                  :disabled="deCancel(scope.data)"
                  @click="lockupCancel(scope.data)"
                  >{{ $t("contract.takeBack") }}</el-button
                >
              </template>
            </template>
          </ie-table>
          <el-dialog
            :title="$t(win.edit.title)"
            :visible.sync="win.show"
            width="450px"
          >
            <el-form
              v-if="win.show"
              :model="win.edit.data"
              :rules="win.edit.rules"
              ref="win_form"
              label-width="auto"
              style="text-align: left"
              size="mini"
            >
              <el-form-item label-width="0px">
                <div style="text-align: center; font-weight: 600">
                  {{ $t(`accounts.balance`) }}：{{ maxGrantProfit }}
                </div>
              </el-form-item>

              <el-form-item
                :label="$t(`contract.amountIssued`)"
                prop="grantProfit"
              >
                <f-number-re
                  :min="'0'"
                  :max="maxGrantProfit"
                  :step="'0.00000000001'"
                  v-model="win.edit.data.grantProfit"
                />
              </el-form-item>
              <el-form-item
                :label="$t(`contract.receivingAddress`)"
                prop="address"
              >
                <el-input v-model="win.edit.data.address" />
              </el-form-item>

              <div
                style="
                  text-align: center;
                  border-top: solid 1px #eee;
                  padding: 5px;
                "
              >
                <el-button type="primary" @click="onWinSub">{{
                  $t("loadingSubPan.ok")
                }}</el-button>
              </div>
            </el-form>
          </el-dialog>
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

import webSdk from "@/utils/webSdk";
import utils from "@/utils/utils";
import { Decimal } from "decimal.js";
import { ethers } from "ethers";
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
    let _this_ = this;
    let addrOk = function (rule, value, callback) {
      if (utils.isEmpty(value)) {
        callback(new Error(_this_.$t("messages.pleaseaddress")));
        return;
      }
      value = value.trim();
      let valL = "";
      try {
        value = webSdk.sdkUtils.splitAddress(value, false);
        valL = ethers.utils.getAddress(value);
      } catch (error) {}
      if (valL) {
        callback();
      } else {
        callback(new Error(_this_.$t("messages.pleaseaddress")));
      }
    };
    return {
      setTime: null,
      calRelease: "0.0",
      headers: [
        {
          label: "contract.userAddress",
          name: "address",
          click: true,
        },
        {
          label: "contract.amountIssued",
          name: "lockupamount",
          valMap(val) {
            return `${val} UTG`;
          },
        },
        {
          label: "contract.lockHeight",
          name: "lockupnumber",
          click: true,
        },

        {
          label: "contract.RetractedHeight",
          name: "cancelnumber",
        },
        {
          label: "contract.retractedAmount",
          name: "cancelamount",
          valMap(val) {
            return val > 0 ? `${val} UTG` : "";
          },
        },
        {
          label: "lock.lockNumber",
          name: "lockingTime",
          valMap(val) {
            return `${val} ${_this_.$t("lock.day")}`;
          },
        },
      ],
      tableDatas: [],
      win: {
        show: false,
        edit: {
          title: "contract.amountIssued",
          data: {
            address: "",
            grantProfit: "0",
          },
          rules: {
            address: [{ validator: addrOk, trigger: "change" }],
            grantProfit: [
              {
                validator: function (rule, value, callback) {
                  let valD = new Decimal(value || 0);
                  if (valD.isZero()) {
                    callback(new Error(_this_.$t("contract.valgtl", [0])));
                    return;
                  }
                  callback();
                },
                trigger: "blur",
              },
            ],
          },
        },
      },
    };
  },

  mounted() {
    this.calReleaseFund();
    this.setTime = setInterval(() => {
      this.calReleaseFund();
    }, 10000);
  },
  beforeDestroy() {
    this.setTime && clearInterval(this.setTime);
  },

  methods: {
    formatTime(time) {
      return helper.formatTimimg(time);
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
      param.type = 1;
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
    grantProfit() {
      this.win.edit.data = {
        address: "",
        grantProfit: "0",
      };
      this.win.show = true;
    },
    onWinSub() {
      this.$refs.win_form.validate((valid) => {
        if (valid) {
          let _this_ = this;
          let sdk = this.$store.getters.getsdk || null;
          if (!sdk) return;
          let setData = {
            title: this.win.edit.title,
            context: "",
            request: null,
            closebtnshow: true,
            success() {
              _this_.$emit("upDatas");
            },
          };
          console.log(this.win.edit);
          let request = sdk.grantProfit(
            this.contractAddr,
            this.win.edit.data.address.trim(),
            this.win.edit.data.grantProfit,
            setData
          );

          setData.request = request;
          this.win.show = false;
          this.$store.dispatch("setNotification", setData);
        }
      });
    },
    calReleaseFund() {
      if (!this.$store.getters.account || !this.contractAddr) {
        this.calRelease = "0.0";
        return;
      }
      this.$store.getters.getsdk
        .calReleaseFund(this.contractAddr, this.$store.getters.account)
        .then((re) => {
          this.calRelease = re;
        })
        .catch(() => {
          this.calRelease = "";
        });
    },
    withdrawalReleaseFund() {
      let sdk = this.$store.getters.getsdk || null;
      let _this_ = this;
      if (!sdk) return;
      let setData = {
        title: this.$t("contract.withdrawMoney"),
        context: "",
        request: null,
        //closebtnshow: true,
        success() {
          if (_this_) {
            _this_.$emit("upDatas");
            _this_.calReleaseFund();
            _this_.loadTable();
          }
        },
      };

      let request = sdk.withdrawalReleaseFund(this.contractAddr, setData);

      setData.request = request;
      this.win.show = false;
      this.$store.dispatch("setNotification", setData);
    },
    lockupCancel(item) {
      let sdk = this.$store.getters.getsdk || null;
      let _this_ = this;
      if (!sdk) return;
      let setData = {
        title: this.$t("contract.takeBack"),
        context: "",
        request: null,
        //  closebtnshow: true,
        success() {
          if (_this_) {
            _this_.$emit("upDatas");
            _this_.calReleaseFund();
            _this_.loadTable();
          }
        },
      };

      let request = sdk.lockupCancel(
        this.contractAddr,
        item.address,
        item.lockupnumber,
        setData
      );

      setData.request = request;
      this.win.show = false;
      this.$store.dispatch("setNotification", setData);
    },
    deCancel(item) {
      // remainamount.isZero() || !let remainamount = new Decimal(item.remainamount || 0);

      return !!(item.cancelnumber || item.lockingTime < 2);
    },
    clickCell(item, data) {
      switch (item.name) {
        case "lockupnumber":
          helper.goPathUrl(
            this,
            "mymanage/extractList",
            `${data.address}_${this.contractAddr}_${data.lockupnumber}`
          );
          break;
        case "address":
          helper.goPathUrl(this, "accountdetail", `${data.address}`);
          break;
      }
    },
  },
  computed: {
    isMainOwner() {
      let account = this.$store.getters.account || "";
      if (!account) {
        return false;
      }
      account = account.toLocaleLowerCase();
      return account == this.datas.mainOwner;
    },
    isSecondOwner() {
      let account = this.$store.getters.account || "";
      if (!account) {
        return false;
      }
      account = account.toLocaleLowerCase();
      return account == this.datas.secondOwner;
    },
    maxGrantProfit() {
      let reNum = new Decimal(this.datas.approveAmount || 0).sub(
        this.datas.grantAmount || 0
      );
      return reNum.gt(0) ? reNum.toFixed() : "0";
    },
  },
  watch: {
    "$store.getters.account": {
      immediate: true,
      handler() {
        this.loadTable();
        this.calReleaseFund();
      },
    },
    "$store.getters.getsdk": function () {
      this.loadTable();
      this.calReleaseFund();
    },
    contractAddr: function () {
      this.loadTable();
      this.calReleaseFund();
    },
  },
};
</script>
<style>
.manage_table .el-dialog__body {
  padding: 10px 20px;
}
</style>
