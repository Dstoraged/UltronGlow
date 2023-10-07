<template>
  <div class="row">
    <div class="col-md-6">
      <div class="card" style="margin-top: 5px">
        <div class="card-body" style="text-align: left">
          <h4 class="mt-0 header-title">{{ $t("contract.permissions") }}</h4>
          <div class="table-responsive">
            <table class="table table-hover mb-0">
              <tbody>
                <tr>
                  <td>
                    {{ $t("contract.myPermissions") }}
                  </td>
                  <td>{{ $t(myOwner) }}</td>
                </tr>
                <tr v-for="(item, cd) in headers_manamge" :key="cd">
                  <td>{{ $t(item.label) }}</td>
                  <td>
                    {{ datas[item.name] }}{{ item.suffix ? item.suffix : "" }}
                    <template v-if="isMainOwner && showBtn(item)">
                      <el-button
                        size="mini"
                        type="primary"
                        :icon="btnIcon(item)"
                        @click="onEdit(item)"
                      ></el-button>
                    </template>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <div class="col-md-3">
      <div class="card" style="margin-top: 5px">
        <div class="card-body" style="text-align: left">
          <h4 class="mt-0 header-title">{{ $t("menu.Lockrelease") }}</h4>
          <div class="table-responsive">
            <table class="table table-hover mb-0">
              <tbody>
                <tr v-for="(item, cd) in headers_time" :key="cd">
                  <td style="min-width: 100px">{{ $t(item.label) }}</td>
                  <td>
                    {{ datas[item.name] }}{{ item.suffix ? item.suffix : "" }}
                    <template v-if="isMainOwner && showBtn(item)">
                      <el-button
                        size="mini"
                        type="primary"
                        :icon="btnIcon(item)"
                        @click="onEdit(item)"
                      ></el-button>
                    </template>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <div class="col-md-3">
      <div class="card" style="margin-top: 5px">
        <div class="card-body" style="text-align: left">
          <h4 class="mt-0 header-title">{{ $t("accounts.balance") }}</h4>
          <div class="table-responsive">
            <table class="table table-hover mb-0">
              <tbody>
                <tr>
                  <td style="min-width: 100px">
                    {{ $t("contract.contractBalance") }}
                  </td>
                  <td>{{ `${contractBlance} UTG` }}</td>
                </tr>

                <tr v-for="(item, cd) in headers_number" :key="cd">
                  <td style="min-width: 100px">{{ $t(item.label) }}</td>
                  <td>
                    {{ datas[item.name] }}{{ item.suffix ? item.suffix : "" }}
                    <template v-if="isMainOwner && showBtn(item)">
                      <div v-if="item.name == 'approveAmount'">
                        <el-button-group>
                          <el-button
                            size="mini"
                            type="primary"
                            icon="el-icon-plus"
                            @click="onEdit(item)"
                          ></el-button>
                          <el-button
                            size="mini"
                            type="warning"
                            icon="el-icon-switch-button"
                            @click="
                              onEdit(item, {
                                name: 'approveAmount_move',
                                title: 'contract.withdrawalAuthorization',
                              })
                            "
                          ></el-button>
                        </el-button-group>
                      </div>
                      <el-button
                        v-else
                        size="mini"
                        type="primary"
                        :icon="btnIcon(item)"
                        @click="onEdit(item)"
                      ></el-button>
                    </template>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      :title="$t(win.edit.title)"
      :visible.sync="win.show"
      width="500px"
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
        <el-form-item
          v-if="win.edit.action == 'mainOwner'"
          prop="mainOwner"
          :label="$t(`contract.transferAddress`)"
        >
          <el-input v-model="win.edit.data.mainOwner" />
        </el-form-item>
        <el-form-item
          prop="secondOwner"
          v-else-if="win.edit.action == 'secondOwner'"
          :label="$t(`contract.transferAddress`)"
        >
          <el-input v-model="win.edit.data.secondOwner" />
        </el-form-item>

        <template v-else-if="win.edit.action == 'approveAmount'">
          <el-form-item label-width="0px">
            <div style="text-align: center">
              {{ $t(`contract.authorizedAmount`) }}:{{ datas.approveAmount }}
            </div>
          </el-form-item>

          <el-form-item
            :label="$t(`contract.addAuthorized`)"
            prop="approveAmount"
          >
            <f-number-re
              :min="'0'"
              :max="'10000000000000000000'"
              :step="'0.00000000001'"
              v-model="win.edit.data.approveAmount"
            />
          </el-form-item>
          <el-form-item label-width="0px">
            <div style="text-align: right">
              {{ $t(`contract.estimate`) }}:{{ approveAmountAdd }}
            </div>
          </el-form-item>
        </template>
        <div
          style="text-align: center; border-top: solid 1px #eee; padding: 5px"
        >
          <el-button type="primary" @click="onWinSub">{{
            $t("loadingSubPan.ok")
          }}</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import webSdk from "@/utils/webSdk";
import utils from "@/utils/utils";
import { Decimal } from "decimal.js";
import { ethers } from "ethers";
import fNumberRe from "@/components/modules/fNumberRe.vue";
export default {
  components: { fNumberRe },
  props: {
    contractAddr: {
      type: String,
      default: "",
    },
    datas: {
      type: Object,
      default() {
        return {};
      },
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

    let headers = webSdk.ownerConfig || [];
    let headers_manamge_ = ["mainOwner", "secondOwner"];
    let headers_number_ = ["approveAmount", "grantAmount", "withdrawAmount"];
    let headers_time_ = ["_lockupperiod", "_releaseperiod", "_releaseinterval"];
    let headers_manamge = [];
    let headers_number = [];
    let headers_time = [];
    headers.forEach((item) => {
      if (headers_manamge_.includes(item.name)) {
        headers_manamge.push(item);
      }
      if (headers_number_.includes(item.name)) {
        headers_number.push(item);
      }
      if (headers_time_.includes(item.name)) {
        headers_time.push(item);
      }
    });

    return {
      setTime: null,
      headers,
      headers_manamge,
      headers_number,
      headers_time,
      btnNames: {
        mainOwner: "el-icon-edit-outline",
        secondOwner: "el-icon-edit-outline",
        approveAmount: "el-icon-plus",
      },
      contractBlance: "0.0",
      win: {
        show: false,
        edit: {
          title: "",
          action: "",
          data: {
            mainOwner: "",
            secondOwner: "",
            approveAmount: "1",
          },
          rules: {},
        },
      },
      forms: {
        mainOwner: {
          title: "contract.Transferadministrator",
          default: "",
          rules: { mainOwner: [{ validator: addrOk, trigger: "blur" }] },
        },
        secondOwner: {
          title: "contract.Transfersecondary",
          default: "",
          rules: { secondOwner: [{ validator: addrOk, trigger: "blur" }] },
        },
        approveAmount: {
          title: "contract.addAuthorized",
          default: 1,
          rules: {
            approveAmount: [
              {
                validator: function (rule, value, callback) {
                  let valD = new Decimal(value || 0);
                  if (valD.isZero()) {
                    callback(new Error(_this_.$t("contract.valgtl", [0])));
                    return;
                  }
                  callback();
                },
                trigger: "change",
              },
            ],
          },
        },
      },
    };
  },
  mounted() {
    this.getContractBlance();
    this.setTime = setInterval(() => {
      this.getContractBlance();
    }, 10000);
  },
  beforeDestroy() {
    this.setTime && clearInterval(this.setTime);
  },
  methods: {
    showBtn(item) {
      return !!this.btnNames[item.name];
    },
    btnIcon(item) {
      return this.btnNames[item.name] || "";
    },

    onEdit(item, autoJson) {
      if (!this.isMainOwner) {
        return;
      }
      if (autoJson) {
        this.btnTrans(autoJson.title, autoJson.name);
        return;
      }

      let formConfig = this.forms[item.name];
      if (!formConfig) return;

      this.win = {
        show: false,
        edit: {
          title: formConfig.title,
          action: item.name,
          data: {
            mainOwner: "",
            secondOwner: "",
            approveAmount: "1",
          },
          rules: formConfig.rules,
        },
      };
      this.win.show = true;
    },
    onWinSub() {
      this.$refs.win_form.validate((valid) => {
        if (valid) {
          this.btnTrans(this.win.edit.title, this.win.edit.action);
        }
      });
    },
    btnTrans(title, type) {
      let _this_ = this;
      let sdk = this.$store.getters.getsdk || null;
      if (!sdk) return;
      let setData = {
        title: this.$t(title),
        context: "",
        request: null,
        closebtnshow: true,
        success() {
          _this_.$emit("upDatas");
        },
      };
      let request = null;
      switch (type) {
        case "mainOwner":
          request = sdk.transferOwner(
            this.contractAddr,
            this.win.edit.data.mainOwner.trim(),
            setData
          );
          break;

        case "secondOwner":
          request = sdk.transferSecondOwner(
            this.contractAddr,
            this.win.edit.data.secondOwner.trim(),
            setData
          );
          break;
        case "approveAmount":
          let approveAmount = new Decimal(
            this.win.edit.data.approveAmount || 0
          );
          approveAmount = approveAmount.add(
            new Decimal(this.datas.approveAmount || 0)
          );
          let approveAmountBig = utils.toNumber(approveAmount.toFixed(), 18);
          request = sdk.ownerApprove(
            this.contractAddr,
            approveAmountBig,
            setData
          );
          break;
        case "approveAmount_move":
          let grantAmount = new Decimal(this.datas.grantAmount || 0);

          let moveBig = utils.toNumber(grantAmount.toFixed(), 18);
          request = sdk.ownerApprove(this.contractAddr, moveBig, setData);
          break;
      }
      if (request) {
        setData.request = request;
        this.win.show = false;
        this.$store.dispatch("setNotification", setData);
      }
    },

    transferOwner() {
      let sdk = this.$store.getters.getsdk || null;
      if (sdk) {
        console.log("this.form.device_address=" + this.form.device_address);
        let request = sdk.sendTransactionTo(
          webSdk.typeJson.stRent,
          {
            addr1: this.form.device_address,
            spaces: this.form.rent_space * 1024 * 1024 * 1024,
            time: this.form.rent_time,
            price: utils.toNumber(this.form.rent_price, 18),
          },
          setData
        );
        setData.request = request;

        this.$store.dispatch("setNotification", setData);
      }
    },
    getContractBlance() {
      if (!this.$store.getters.getsdk || !this.contractAddr) {
        this.contractBlance = "0.0";

        return;
      }

      this.$store.getters.getsdk
        .getBalance(this.contractAddr)
        .then((re) => {
          this.contractBlance = re;
        })
        .catch((err) => {
          this.contractBlance = "0.0";
        });
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
    myOwner() {
      if (this.isMainOwner) {
        return "contract.firstadministrator";
      }
      if (this.isSecondOwner) {
        return "contract.Secondaryadministrator";
      }
      return "--";
    },
    approveAmountAdd() {
      let reNum = new Decimal(this.datas.approveAmount || 0).add(
        this.win.edit.data.approveAmount || 0
      );
      return reNum.toFixed();
    },
  },
  watch: {
    contractAddr: function () {
      this.getContractBlance();
    },
    "$store.getters.account": function () {
      this.getContractBlance();
    },
    "$store.getters.getsdk": function () {
      this.getContractBlance();
    },
  },
};
</script>
