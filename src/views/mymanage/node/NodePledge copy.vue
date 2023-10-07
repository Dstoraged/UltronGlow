<template>
  <div>
    <div class="container-fluid">
      <div class="card" style="margin-top: 40px">
        <div class="card-body">
          <h4 class="mt-0 header-title" style="width: 100%; text-align: left">
            {{ $t("node.nodetrustpledge") }}
          </h4>
          <el-form ref="formPledge" label-width="150px" style="max-width: 520px; margin: 0px auto; text-align: left"
            :rules="rules" :model="form">
            <el-form-item :label="$t('node.address')" prop="nodeaddress">
              {{ form.nodeaddress }}
              <!-- <el-input v-model="form.nodeaddress" style="width: 350px" readonly /> -->
            </el-form-item>

            <el-form-item :label="$t('node.pledgeaddress')" prop="pledgeaddress">
              {{ form.pledgeaddress }}
              <!--
              <el-input v-model="form.pledgeaddress" :placeholder="$t('node.pledgeaddress')" style="width: 350px"
                readonly />
              -->
            </el-form-item>

            <el-form-item :label="$t('node.pledgeAmount')" required prop="utg">
              <!-- {{ form.utg || 0 }}{{ " UTG" }}-->
              <el-input v-model.number="form.utg" style="float: left;width: 350px">
                <i slot="suffix" style="font-style: normal; margin-right: 10px">UTG</i>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="text" size="medium" @click="onSubmit" :disabled="
                form.utg <= 0 || !form.nodeaddress || !form.pledgeaddress
              " class="equal-width">{{ $t("node.pledge") }}</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import * as api from "@/api/api";
import utils from "@/utils/utils";
import * as helper from "@/utils/helper";
import webSdk from "@/utils/webSdk.js";
export default {
  name: "Nodepledge",
  components: {},
  data() {
    return {
      message: {
        pledgeAmount: 0,
      },
      utgamount: 0,
      form: {
        nodeaddress: "",
        pledgeaddress: "",
        utg: "1",
      },

      rules: {
        /*
        pledgeaddress: [
          { required: true, trigger: "change" },
          {
            validator: (rule, value, callback) => {
              try {
                if (webSdk.sdkUtils.getAddress(value)) {
                  callback();
                } else {
                  callback(new Error("Please enter the correct address"));
                }
              } catch (error) {
                callback(new Error("Please enter the correct address"));
              }
            },
            trigger: "change",
          },
        ],  
        */
        utg: [{ required: true, trigger: "change" }],
      },
      btnShow: false,
      exchRate: 0,
    };
  },

  created() {
    this.form.nodeaddress = this.$route.params.id;
    this.form.pledgeaddress = this.$store.getters.account;
    this.loadData();
  },
  activated() {
    this.loadData();
  },
  methods: {
    nodeaddressAddressOk(fun) {
      this.loading = true;
      let address = webSdk.sdkUtils.hashToNX(this.form.nodeaddress);
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
          console.log(address, this.form.nodeaddress)
          fun();
        })
        .catch((err) => {
          console.log(err);
          this.loading = false;
        });
    },

    onSubmit() {  
      this.$refs.formPledge.validate((valid) => {
        if (valid) {          
          this.plegdeAddressYesNoNodeOk(() => {
          this.plegdeAddressOk(() => {

            this.nodeaddressAddressOk(() => {
              let address = this.form.nodeaddress;
              let pledgeaddress = this.form.pledgeaddress;

              if (address.toLocaleLowerCase() == pledgeaddress.toLocaleLowerCase()) {
                this.$message.error(`${this.$t("messages.mineraddressnotplege")}`);
                return;
              }

             /*
              let valL = this.form.utg;              
              if (valL <= 0) {
                return;
              }
              */
              if (this.form.utg < 1) {
                return;
              }

              console.log(parseFloat(this.utgamount),parseFloat(this.form.utg))
              if (parseFloat(this.form.utg) > parseFloat(this.utgamount)) {
                this.$message.error(`${this.$t("messages.walletbalance")}`);
                return;
              }

              let sdk = this.$store.getters.getsdk || null;
              if (sdk) {
                let _this_ = this;
                let setData = {
                  title: `${this.$t("node.nodetrustpledge")}`,
                  context: `${this.$t("mymanageNode.node")} : ${address}`,
                  request: null,
                  closebtnshow: false,
                  success() {
                    if (_this_.$refs.ftable) {
                      //_this_.$refs.ftable.getTxRecord(1);
                      _this_.loadData();
                    }
                    _this_.$notify({
                      title: _this_.$t("loadingSubPan.finish"),
                      message: _this_.$t("messages.pledgok"),
                      type: "success",
                    });

                    //_this_.toNodes();
                  },
                  err() {
                    _this_.$message.error("failed");
                  },
                };
                let request = sdk.sendTransactionTo(
                  webSdk.typeJson.candentrust,
                  {
                    addr1: address,
                    amount: utils.toNumber(this.form.utg, 18)
                  },
                  setData
                );
                setData.request = request;

                this.$store.dispatch("setNotification", setData);
              }
            });
          });
        });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    toNodes() {
      helper.goUrl(this, "MymanageNode", "");
    },

    plegdeAddressOk(fun) {
      this.loading = true;
      var params = {
        current: 1,
        size: 20,
        pledge_address: this.form.pledgeaddress,
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
            this.$message.error(`${this.$t("messages.pledgeaddressused")}`);
            return;
          }
          fun();
        })
        .catch((err) => {
          console.log(err);
          this.loading = false;
        });
    },

    plegdeAddressYesNoNodeOk(fun) {
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
            data= re.records || []
            binTotal = response.result.total;
          }
          if (binTotal > 0 && data[0].node_type!=3) {
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

    getBalance(){
      let sdks = this.$store.getters.getsdk || null;
      if(sdks){
        sdks.getBalance().then((res) => {
          lBalance = res;
          alert("Balance="+lBalance)
          console.log("Balance", lBalance);
        });
      }
    },
    loadData() {     
      this.btnShow = false;
      api
        .postJson("/platform/node/getNodePledgeAmount")
        .then((response) => {
          let exchRate = (response.result.NODE_PLEDGE_AMOUNT || 0) + "";
          this.form.utg = 1;//utils.clearZero(exchRate);
          this.btnShow = this.form.utg > 0;
          this.message.pledgeAmount =
            Math.ceil(
              helper.getDataFormat(
                response.result.NODE_PLEDGE_AMOUNT,
                18,
                10000
              )
            ) + " UTG";
        })
        .catch((error) => {
          this.btnShow = false;
          console.error(error);
        });

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
    },
  },

  watch: {
    "$store.getters.account": function () {
      this.form.pledgeaddress = this.$store.getters.account;
      this.loadData();
    },
  },
};
</script>
<style lang="scss" scoped>
.cursor {
  cursor: pointer;
}
</style>
