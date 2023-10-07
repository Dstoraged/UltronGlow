<template>
  <div>
    <div class="container-fluid">
      <div class="card" style="margin-top: 40px">
        <div class="card-body">
          <h4 class="mt-0 header-title" style="width: 100%; text-align: left">
            {{ $t("mymanageNode.pledgeNode") }}
          </h4>
          <el-form ref="form" :rules="rules" :model="form" label-width="150px"
            style="max-width: 520px; margin: 0px auto; text-align: left">
            <el-form-item :label="$t('mymanageNode.node')" prop="address" required>
              <el-input v-model="form.address" />
            </el-form-item>

            <el-form-item :label="$t('mymanageNode.pledgenum')" required prop="utg">{{ form.utg || 0 }}{{ " UTG" }}
            </el-form-item>
            <el-form-item>
              <el-button v-if="btnShow" type="primary" @click="onSubmit" :disabled="form.utg <= 0 || !form.address">{{
                  $t("mymanageNode.pledge")
              }}</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <PledgeNode :param="getParam" ref="ftable" />
  </div>
</template>
<script>
import PledgeNode from "./components/PledgeNode.vue";
import * as api from "@/api/api";
import utils from "@/utils/utils";
import webSdk from "@/utils/webSdk.js";
export default {
  name: "AddNode",
  components: {
    PledgeNode,
  },
  data() {
    let _this_ = this;
    return {
      btnShow: false,
      loading: false,
      utgamount: 0,
      form: {
        address: "",
        utg: "",
      },
      rules: {
        address: [
          { required: true, trigger: "change" },
          {
            validator: (rule, value, callback) => {
              if (utils.isEmpty(value)) {
                callback(new Error(_this_.$t("messages.pleaseaddress")));
                return;
              }

              let isAddress = webSdk.sdkUtils.verifyAddress(value);
              if (isAddress) {
                callback();
              } else {
                callback(new Error(_this_.$t("messages.pleaseaddress")));
              }
            },
            trigger: "change",
          },
        ],
        utg: [{ required: true, trigger: "change" }],
      },
      exchRate: 0,
    };
  },

  mounted() {
    this.form.address = this.$store.getters.account;
    this.loadData();




  },
  activated() {
    this.loadData();
  },
  methods: {
    revenueAddressOk(fun) {
      this.loading = true;
      let address = webSdk.sdkUtils.hashToNX(this.form.address);
      api
        .postJson("/platform/node/getNodeExistRealse", {
          address,
        })
        .then((response) => {
          this.loading = false;
          let binNumber = response.result;
          if (binNumber > 0) {
            this.$message.error(`${this.$t("messages.addresslocked")}`);
            return;
          }
          fun();
        })
        .catch((err) => {
          console.log(err);
          this.loading = false;
        });
    },

    plegdeAddressManageOk(fun) {
      this.loading = true;
      var paramm = {
        current: 1,
        size: 20,
        manage_address: this.form.address
      };
      api
        .postJson("/platform/node/getcadnodelist", paramm)
        .then((response) => {
          this.loading = false;
          let mTotal = 0;
          let rem = response.result || {};
          let datam = [];
          if (response.result != null) {
            datam = rem.records || []
            mTotal = response.result.total;
          }
          if (mTotal > 0 && datam[0].node_type != 3) {
            this.$message.error(`${this.$t("messages.mangeaddressPosnode")}`);
            return;
          }
          fun();
        })
        .catch((err) => {
          console.log(err);
          this.loading = false;
        });
    },


    manageAddressOk(fun) {
      this.loading = true;
      var paramm = {
        current: 1,
        size: 20,
        manage_address: this.$store.getters.account
      };
      api
        .postJson("/platform/node/getcadnodelist", paramm)
        .then((response) => {
          this.loading = false;
          let mTotal = 0;
          let rem = response.result || {};
          let datam = [];
          if (response.result != null) {
            datam = rem.records || []
            mTotal = response.result.total;
          }
          if (mTotal > 0 && datam[0].node_type != 3) {
            this.$message.error(`${this.$t("messages.mangeaddressnopledge")}`);
            return;
          }
          fun();
        })
        .catch((err) => {
          console.log(err);
          this.loading = false;
        });
    },

    delegateAddressPosOk(fun) {
      this.loading = true;
      var params = {
        current: 1,
        size: 20,
        pledge_address: this.form.address,
        pledge_status: 1
      };
      api
        .postJson("/platform/getNodePledgeList", params)
        .then((response) => {
          this.loading = false;
          let binNumber = 0;
          if (response.result != null) {
            binNumber = response.result.total;
          }
          if (binNumber > 0) {
            this.$message.error(`${this.$t("messages.delegateaddressused")}`);
            return;
          }
          fun();
        })
        .catch((err) => {
          console.log(err);
          this.loading = false;
        });
    },


    delegateAddressManageOk(fun) {
      this.loading = true;
      var params = {
        current: 1,
        size: 20,
        pledge_address: this.$store.getters.account,
        pledge_status: 1
      };
      api
        .postJson("/platform/getNodePledgeList", params)
        .then((response) => {
          this.loading = false;
          let binNumber = 0;
          if (response.result != null) {
            binNumber = response.result.total;
          }
          if (binNumber > 0) {
            this.$message.error(`${this.$t("messages.delegateaddressmanage")}`);
            return;
          }
          fun();
        })
        .catch((err) => {
          console.log(err);
          this.loading = false;
        });
    },


    plegdeAddressPosOk(fun) {
      this.loading = true;
      var params = {
        current: 1,
        size: 20,
        node_address: this.$store.getters.account
      };
      api
        .postJson("/platform/node/getcadnodelist", params)
        .then((response) => {
          this.loading = false;
          let binTotal = 0;
          let re = response.result || {};
          let data = [];
          if (response.result != null) {
            data = re.records || []
            binTotal = response.result.total;
          }
          if (binTotal > 0 && data[0].node_type != 3) {
            this.$message.error(`${this.$t("messages.posaddressnopledge")}`);
            return;
          }
          fun();
        })
        .catch((err) => {
          console.log(err);
          this.loading = false;
        });
    },

    onSubmit() {
      this.getBalance();
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.plegdeAddressPosOk(() => {
            this.plegdeAddressManageOk(() => {
              this.delegateAddressPosOk(() => {
                this.manageAddressOk(() => {
                  this.delegateAddressManageOk(() => {
                    this.revenueAddressOk(() => {
                      let address = this.form.address;
                      let acadr = this.$store.getters.account;

                      if (address.toLocaleLowerCase() == acadr.toLocaleLowerCase()) {
                        this.$message.error(`${this.$t("messages.pledgedadrnoaccout")}`);
                        return;
                      }
                      let valL = this.form.utg;
                      if (valL <= 0) {
                        return;
                      }
                      //console.log(parseFloat(this.utgamount), parseFloat(this.form.utg))
                      if (parseFloat(this.form.utg) > parseFloat(this.utgamount)) {
                        this.$message.error(`${this.$t("messages.walletbalance")}`);
                        return;
                      }
                      let sdk = this.$store.getters.getsdk || null;
                      if (sdk) {
                        let _this_ = this;
                        let setData = {
                          title: `${this.$t("mymanageNode.pledgeNode")}`,
                          context: `${this.$t("mymanageNode.node")} : ${address}`,
                          request: null,
                          closebtnshow: false,
                          success() {
                            if (_this_.$refs.ftable) {
                              _this_.$refs.ftable.tableInit(null, 1);
                            }
                            _this_.$notify({
                              title: _this_.$t("loadingSubPan.finish"),
                              message: _this_.$t("messages.pledgok"),
                              type: "success",
                            });
                          },
                          err() {
                            _this_.$message.error("failed");
                          },
                        };
                        //alert(address)
                        let request = sdk.sendTransactionTo(
                          webSdk.typeJson.candreq,
                          { addr1: address },
                          setData
                        );
                        setData.request = request;

                        this.$store.dispatch("setNotification", setData);
                      }
                    });
                  });
                });
              });
            });
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    getBalance() {
      let sdks = this.$store.getters.getsdk || null;
      if (sdks) {
        sdks.getBalance(this.$store.getters.account).then((res) => {
          this.utgamount = res;
          console.log("this.utgamount=" + this.utgamount);
        });
      }
    },

    loadData() {
      this.getBalance();
      this.btnShow = false;
      api
        .postJson("/platform/node/getNodePledgeAmount")
        .then((response) => {
          let exchRate = (response.result.NODE_PLEDGE_AMOUNT || 0) + "";
          this.form.utg = utils.clearZero(exchRate);
          this.btnShow = this.form.utg > 0;
        })
        .catch((error) => {
          this.btnShow = false;
          console.error(error);
        });

      /*
    let bcparam = {
      revenue_address: this.$store.getters.account,
    };
    api
      .postJson("/platform/my/outLine", bcparam)
      .then((response) => {
        let result = response.result || {};

        this.utgamount = utils.clearZero(result.balance || 0);
      })
      .catch((error) => {
        console.error(error);
      });
      */
    },
  },
  computed: {
    getParam() {
      let address = this.$store.getters.account;
      return { fromAddr: address, txType: "CandReq" };
    },
  },
  watch: {
    "$store.getters.account": function () {
      this.form.address = this.$store.getters.account;
      this.loadData();
      if (this.$refs.ftable && this.$refs.ftable.tableInit) {
        this.$refs.ftable.tableInit(null, 1);
      }
    },
    /*
    "form.address": {
      immediate: true,
      handler: function (newVal) {
        try {
          if (webSdk.sdkUtils.getAddress(newVal)) {
            //this.tableUrl = "/platform/getTxRecord";
            this.loadData();
          } else {
            this.btnShow = false;
            //   this.tableUrl = "";
          }
        } catch (error) {
          //  this.tableUrl = "";
          this.btnShow = false;
        }        
      },
      */
  },
};
</script>
<style lang="scss" scoped>
.cursor {
  cursor: pointer;
}
</style>
