<template>
  <div class="container-fluid ieHome">
    <div class="card" style="margin-top: 40px">
      <div class="card-body" style="background-color: #f5f7fa">
        <el-steps :active="active" :space="200" simple finish-status="success">
          <el-step
            :title="$t('binding.upkey')"
            icon="el-icon-upload2"
          ></el-step>
          <el-step
            :title="$t('binding.bindaddr')"
            icon="el-icon-connection"
          ></el-step>
          <el-step
            :title="$t('pledge.pledge')"
            icon="el-icon-finished"
          ></el-step>
        </el-steps>
      </div>
    </div>
    <div class="card" style="margin-top: 40px">
      <div class="card-body">
        <div v-if="active === 0" class="action_context">
          <div class="action_body">
            <el-form
              :model="form.data1"
              :rules="rules.rules1"
              ref="ruleForm1"
              label-width="180px"
              class="demo-ruleForm"
            >
              <el-form-item
                v-if="false"
                :label="$t('binding.minerurl')"
                prop="url"
              >
                <template slot="label">
                  {{ $t("binding.minerurl") }}
                  <el-tooltip
                    class="item"
                    :content="$t('messages.bindminer')"
                    placement="top-start"
                  >
                    <i class="el-icon-warning" style="color: orange"> </i>
                  </el-tooltip>
                </template>
                <el-input v-model="form.data1.url"> </el-input>
              </el-form-item>
              <el-form-item :label="$t('binding.privatekey')" prop="key">
                <template slot="label">
                  {{ $t("binding.privatekey") }}
                  <el-tooltip
                    class="item"
                    :content="$t('messages.minerprivatekey')"
                    placement="top-start"
                  >
                    <i class="el-icon-warning" style="color: orange"> </i>
                  </el-tooltip>
                </template>
                <el-input
                  v-model="form.data1.key"
                  :rows="3"
                  style="width: calc(100% - 70px)"
                  type="textarea"
                >
                </el-input>
                <el-button
                  type="text"
                  style="vertical-align: top"
                  @click="createWallet"
                  >{{ $t("coins.create") }}</el-button
                >
                <div style="font-size: 12px; color: orange">
                  {{ $t("messages.pleasesupload") }}
                </div>
              </el-form-item>
            </el-form>
            <div class="action_sub_div">
              <el-button
                type="primary"
                @click="step_one"
                v-loading="stepLoding.step1"
                element-loading-spinner="el-icon-loading"
                >{{ $t("coins.next") }}</el-button
              >
            </div>

            <div>
              <div class="help_title">{{ $t("messages.copykey") }}</div>
              <div class="helpDiv">
                <el-image
                  src="static/images/help/help1.png"
                  class="helpImg"
                  :preview-src-list="['static/images/help/help1.png']"
                ></el-image>
              </div>
              <div class="helpDiv">
                <el-image
                  src="static/images/help/help2.png"
                  class="helpImg"
                  :preview-src-list="['static/images/help/help2.png']"
                ></el-image>
              </div>
            </div>
          </div>
        </div>

        <div v-if="active === 1" class="action_context">
          <div class="action_body">
            <el-form
              :model="form.data2"
              :rules="rules.rules2"
              ref="ruleForm2"
              label-width="180px"
              class="demo-ruleForm"
            >
              <el-form-item :label="$t('mymanageMining.revenuesaddress')">
                <template slot="label">
                  {{ $t("mymanageMining.revenuesaddress") }}
                  <el-tooltip
                    class="item"
                    :content="$t('messages.upwallet')"
                    placement="top-start"
                  >
                    <i class="el-icon-warning" style="color: orange"> </i>
                  </el-tooltip>
                </template>

                {{ $store.getters.accounty }}
                <!-- <el-input v-model="form.data2.earnings"> </el-input>-->
              </el-form-item>
              <el-form-item :label="$t('mymanageMining.mineraddr')">
                <div>{{ form.data2.address }}</div>
              </el-form-item>
            </el-form>
            <div class="action_sub_div">
              <el-button
                type="primary"
                @click="step_two"
                v-loading="stepLoding.step2"
                element-loading-spinner="el-icon-loading"
                >{{ $t("messages.binding") }}</el-button
              >
            </div>
          </div>
        </div>

        <div v-if="active === 2" class="action_context">
          <div class="action_body">
            <pledge
              :showjump="true"
              @jump="jump"
              :address="form.data2.address"
              @sendTransactionTo="sendTransactionTo"
            />
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      :title="$t('messages.newwallet')"
      @opened="openWin"
      :visible.sync="dialogVisible"
      width="600px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div v-loading="winLoading">
        <div class="mnemonic_title">{{ $t("messages.wallet") }}</div>
        <el-input v-model="winData.address" disabled>
          <template slot="append">
            <span
              v-clipboard:copy="winData.address"
              v-clipboard:success="onCopy"
              v-clipboard:error="onError"
              class="cursor"
              >{{ $t("messages.copy") }}</span
            >
          </template>
        </el-input>
        <div class="mnemonic_title">{{ $t("messages.privatekey") }}</div>
        <el-input v-model="winData.key" disabled>
          <template slot="append">
            <span
              v-clipboard:copy="winData.key"
              v-clipboard:success="onCopy"
              v-clipboard:error="onError"
              class="cursor"
              >{{ $t("messages.copy") }}</span
            >
          </template>
        </el-input>

        <div class="mnemonic_title">{{ $t("messages.mnemonic") }}</div>
        <el-row :gutter="20">
          <el-col :span="6" v-for="(item, cd) in winData.mnemonic" :key="cd">
            <div class="grid-content bg-purple">
              {{ item }}
            </div>
          </el-col>
        </el-row>
        <div style="margin-top: 10px; font-size: 11pt; color: red">
          {{ $t("messages.bearinmind") }} <br /><br />
          1、{{ $t("messages.clickcopy") }} <br /><br />
          2、{{ $t("messages.notnetwokin") }} <br /><br />
          3、{{ $t("messages.notnetworkinkey") }}<br /><br />
          4、{{ $t("messages.closewindowbefore") }}
        </div>
        <div style="text-align: center; margin-top: 20px">
          <el-button type="text" @click="dialogVisible = false">{{
            $t("loadingSubPan.close")
          }}</el-button>
        </div>
      </div>
    </el-dialog>
    <el-dialog
      custom-class="ie_dialog"
      :title="subWin.title"
      :close-on-press-escape="false"
      :show-close="false"
      :visible.sync="subWin.show"
      width="300px"
      :close-on-click-modal="false"
    >
      <div style="text-align: center; line-height: 50px">
        <i class="el-icon-loading"></i>{{ $t("loadingSubPan.loading") }}……
      </div>
    </el-dialog>
  </div>
</template>
<script>
import fNumber from "@/components/modules/fNumber.vue";
import { Decimal } from "decimal.js";
import pledge from "@/views/mymanage/pledge/index.vue";
import { ethers, BigNumber } from "ethers";
import webSdk from "@/utils/webSdk.js";
import * as helper from "@/utils/helper";
import * as api from "@/api/api";
//static/images/help/help1.png
export default {
  components: { fNumber, pledge },
  data() {
    return {
      active: 0,
      dialogVisible: false,
      winLoading: false,
      subWin: {
        show: false,
        title: "",
      },
      winData: {
        address: "",
        key: "",
        mnemonic: [],
      },
      form: {
        data1: {
          url: "",
          key: "",
        },
        data2: {
          earnings: "",
          address: "",
        },
      },

      stepLoding: {
        step1: false,
        step2: false,
      },
      rules: {
        rules1: {
          // url: [{ required: true, trigger: "input,blur" }],
          key: [{ required: true, trigger: "input,blur" }],
        },
        /*rules2: {
          earnings: [{ required: true, trigger: "input,blur" }],
        },*/
      },
    };
  },
  created() {},
  methods: {
    step_one() {
      this.$refs.ruleForm1.validate((valid) => {
        if (valid) {
          this.stepLoding.step1 = true;
          let wallet = null;
          try {
            wallet = new ethers.Wallet(this.form.data1.key.trim());
          } catch (error) {}
          if (!wallet) {
            this.$message.error(`${this.$t("messages.notkey")}`);
            this.stepLoding.step1 = false;
            return;
          }
          this.form.data2.address = webSdk.sdkUtils.hashToNX(wallet.address);

          this.stepLoding.step1 = false;
          this.active = 1;
          this.loadgetminerdetail();
        }
      });
    },

    loadgetminerdetail() {
      this.stepLoding.step2 = true;
      let miner_addr = this.form.data2.address;
      api
        .postJson("/platform/my/getminerdetail", { miner_addr })
        .then((response) => {
          this.stepLoding.step2 = false;
          let item = response.result || {};
          let revenue_address = item.revenue_address;
          if (revenue_address) {
            this.$alert(miner_addr, this.$t("loadingSubPan.Hasbeenused"), {
              confirmButtonText: this.$t("loadingSubPan.ok"),
              showClose: false,
              callback: () => {
                this.active = 0;
                this.form.data1.key = "";
              },
            });
          }
        })
        .catch(() => {
          this.stepLoding.step2 = false;
        });
    },

    step_two() {
      this.$refs.ruleForm2.validate((valid) => {
        if (valid) {
          let addressy = this.$store.getters.accounty;
          let address = this.form.data2.address;

          /*this.subWin = {
            show: true,
            title: `${this.$t("binding.bindaddr")}`,
          };*/

          let sdk = this.$store.getters.getsdk || null;

          if (sdk) {
            let _this_ = this;
            let setData = {
              title: `${this.$t("binding.bindaddr")}`,
              context: `${this.$t(
                "mymanageMining.revenuesaddress"
              )}: ${helper.getAddrFormat(addressy, 10)}<br/>
           ${this.$t("mymanageMining.mineraddr")}: ${helper.getAddrFormat(
                address,
                10
              )}`,
              closebtnshow: false,
              request: null,
              closewin(type) {
                if (type == 2) {
                  _this_.active = 2;
                  _this_.subWin.show = false;
                  _this_.stepLoding.step2 = false;
                }
              },
              err(err) {},
            };

            let request = sdk.sendTransactionTo(
              webSdk.typeJson.Bind,
              {
                addr1: address,
                type: 1,
                contractAddr: "ux0000000000000000000000000000000000000000",
                signaddr: "ux0000000000000000000000000000000000000000",
              },
              setData
            );
            setData.request = request;
            this.$store.dispatch("setNotification", setData);
          }
        }
      });
    },
    sendTransactionTo(type, jsonL) {
      let sdk = this.$store.getters.getsdk || null;

      if (sdk) {
        let _this_ = this;
        let setData = {
          title: `${this.$t("pledge.bandwidthpledge")}`,
          context: `${this.$t(
            "mymanageMining.mineraddr"
          )}：${helper.getAddrFormat(jsonL.addr1, 10)}<br/>MB：${jsonL.mbps} `,
          request: null,
          closebtnshow: false,
          closewin(type) {
            if (type == 2) {
              _this_.exit();
            }
          },
          err() {},
        };
        let request = sdk.sendTransactionTo(type, jsonL, setData);
        setData.request = request;
        this.$store.dispatch("setNotification", setData);
      }
    },

    onCopy() {
      this.$message(`${this.$t("utilsmsg.copyok")}`);
    },
    onError() {},
    openWin() {
      let randomWallet = ethers.Wallet.createRandom();
      let mnemonic = randomWallet.mnemonic.phrase.split(" ");
      this.form.data1.key = webSdk.sdkUtils.hashToNX(
        randomWallet.privateKey,
        true
      );

      this.winData = {
        key: this.form.data1.key,
        mnemonic: mnemonic,
        address: webSdk.sdkUtils.hashToNX(randomWallet.address),
      };
      this.winLoading = false;
    },
    jump() {
      this.$confirm(
        `${this.$t("messages.jumppledgetext")}`,
        `${this.$t("messages.jump")}`,
        {
          confirmButtonText: `${this.$t("messages.confirm")}`,
          cancelButtonText: `${this.$t("messages.cancel")}`,
          type: "warning",
        }
      )
        .then(() => {
          this.exit();
        })
        .catch(() => {});
    },
    exit() {
      helper.goUrl(this, "MymanageMining", "");
    },
    createWallet() {
      this.dialogVisible = true;
      this.winLoading = true;
    },
  },
};
</script>
<style scoped>
.action_context {
  text-align: center;
  padding: 20px;
}
.action_context .action_body {
  margin: 0px auto;
  max-width: 600px;
  text-align: left;
}
.ieHome .content-container {
  margin-bottom: 20px !important;
  margin-top: 20px !important;
}
.action_sub_div {
  padding-bottom: 20px;
  text-align: center;
}
.grid-content {
  font-weight: 600;
  padding: 5px;
  margin-top: 5px;
  margin-bottom: 3px;
  text-align: center;
}
.bg-purple {
  background-color: #d7d7d7;
}
.mnemonic_title {
  padding: 5px;
  border-bottom: solid 1px #eee;
  font-weight: 600;
}
.helpDiv {
  padding: 30px 0;
  text-align: center;
  display: inline-block;
  box-sizing: border-box;
  vertical-align: top;
  margin-right: 20px;
}
.helpDiv .demonstration {
  display: block;
  color: #8492a6;
  font-size: 14px;
  margin-bottom: 20px;
}
.helpImg {
  width: 180px;
  height: 200px;
}
.help_title {
  font-weight: 500;
  text-align: left;
  margin-top: 10px;
  padding-top: 5px;
  border-top: solid 1px #eee;
}
</style>
<style>
.ie_dialog .el-dialog__body {
  padding: 10px !important;
}
</style>
