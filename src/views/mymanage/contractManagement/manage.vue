<template>
  <div class="row">
    <div class="col-md-5">
      <div class="card" style="margin-top: 5px">
        <div class="card-body" style="text-align: left">
          <h4 class="mt-0 header-title">{{ $t("contract.permissions") }}</h4>
          <div class="table-responsive">
            <table class="table table-hover mb-0">
              <tbody>
                <tr v-for="(item, cd) in headers_manamge" :key="cd">
                  <td style="min-width: 100px">{{ $t(item.label) }}</td>
                  <td class="ie_table_text">
                    {{ datas[item.name] }}{{ item.suffix ? item.suffix : "" }}
                    <template v-if="isMainOwner && showBtn(item, datas)">
                      <el-button
                        size="mini"
                        type="primary"
                        :icon="btnIcon(item)"
                        @click="
                          onEdit(
                            item,
                            item.name == 'calReleaseFund'
                              ? {
                                  name: item.name,
                                  title: 'contract.withdrawMoney',
                                }
                              : null
                          )
                        "
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
                  <td class="ie_table_text">
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
    <div class="col-md-4">
      <div class="card" style="margin-top: 5px">
        <div class="card-body" style="text-align: left">
          <h4 class="mt-0 header-title">{{ $t("contract.contract") }}</h4>
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
                  <td class="ie_table_text">
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
          v-if="win.edit.action == 'owner'"
          prop="owner"
          :label="$t(`contract.transferAddress`)"
        >
          <el-input v-model="win.edit.data.owner" />
        </el-form-item>

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
    let headers_manamge_ = ["owner", "calReleaseFund"];
    let headers_time_ = ["_lockupstart", "_releaseperiod", "_releaseinterval"];
    let headers_number_ = ["withdrawAmount", "_releasetimes"];
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
        owner: "el-icon-edit-outline",
        calReleaseFund: "el-icon-s-cooperation",
      },
      contractBlance: "0.0",
      win: {
        show: false,
        edit: {
          title: "",
          action: "",
          data: {
            owner: "",
          },
          rules: {},
        },
      },
      forms: {
        owner: {
          title: "contract.Transferadministrator",
          default: "",
          rules: { owner: [{ validator: addrOk, trigger: "blur" }] },
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
    showBtn(item, datas) {
      let isOk = !!this.btnNames[item.name];
      if (item.name == "calReleaseFund") {
        isOk = datas.calReleaseFund > 0;
      }
      return isOk;
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
            owner: "",
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
        case "owner":
          request = sdk.transferOwner(
            this.contractAddr,
            this.win.edit.data.owner.trim(),
            setData
          );
          break;
        case "calReleaseFund":
          request = sdk.withdrawalReleaseFund(this.contractAddr, setData);
          break;
      }
      if (request) {
        setData.request = request;
        this.win.show = false;
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
      return account == this.datas.owner;
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
<style scoped>
.ie_table_text {
  white-space: normal;
  word-break: break-all;
  word-wrap: break-word;
}
</style>
