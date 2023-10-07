<template>
  <div>
    <div class="container-fluid">
      <div class="card" style="margin-top: 40px">
        <div class="card-body">
          <h4 class="mt-0 header-title" style="text-align: left">
            {{ $t("mymanageNode.makegood") }}
          </h4>
          <div style="text-align: center">
            <el-form ref="form" label-width="120px" style="max-width: 550px; margin: 0px auto; text-align: left">
              <el-form-item :label="$t('mymanageNode.node')">
                {{ nodeinfo.node }}
              </el-form-item>
              <el-form-item :label="$t('mymanageNode.punilshamount')">
                {{ nodeinfo.makegood }}
              </el-form-item>
              <el-form-item :label="$t('mymanageNode.estimate')">
                {{ nodeinfo.estimate }}
              </el-form-item>
            </el-form>

            <div style="padding-bottom: 20px; padding-top: 20px">
              <el-button @click="onSubmit" v-if="!btnLoading && btnShow" type="primary">{{ $t("mymanageNode.pay") }}
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <PayRecord :param="getParam" />
  </div>
</template>
<script>
import PayRecord from "./components/PayRecord.vue";
import utils from "@/utils/utils";
import webSdk from "@/utils/webSdk.js";
import * as api from "@/api/api";
import * as helper from "@/utils/helper";

export default {
  name: "NodeDetail",
  components: {
    PayRecord,
  },
  data() {
    return {
      btnShow: true,
      btnLoading: true,
      nodeinfo: {},
      account: "",
      form: {
        utg: 0,
        fractions: 0,
      },
      exchRate: 0,
      utgamount: 0,
    };
  },
  created() {
    this.account = this.$route.params.id;
   
    if (!this.account) {
      return;
    }
    this.loadData();
  },
  activated() {
    this.account = this.$route.params.id;
    if (!this.account) {
      return;
    }
    this.loadData();
  },

  methods: {

    onSubmit() {
      this.getBalance();
      let sdk = this.$store.getters.getsdk || null;
      let utg = this.form.utg;
      if (sdk && utg > 0) {
        let _this_ = this;    
       
       // console.log(parseFloat(this.form.utg),parseFloat(this.utgamount))
        if (parseFloat(this.form.utg) > parseFloat(this.utgamount)) {
          this.$message.error(`${this.$t("messages.walletbalance")}`);
          return;
        }

        let setData = {
          title: `${this.$t("mymanageNode.makegood")}`,
          context: `${this.$t("mymanageNode.makegood")}：${this.form.fractions
            }<br/>${this.$t("mymanageNode.estimate")}：${this.form.utg} UTG`,
          request: null,
          success() {
            _this_.btnShow = false;
          },
          closewin(type) {
            if (type == 2 && _this_.$route.name == "makeGood") {
              //helper.goUrl(this, "MymanageAddNode", "");
              helper.goPathUrl(this, "mymanage/addNode", "");
            }
          },
          err() { },
        };
        let request = sdk.sendTransactionTo(
          webSdk.typeJson.candpnsh,
          {
            addr1: this.account,
          },
          setData
        );
        setData.request = request;
        this.$store.dispatch("setNotification", setData);
      }
    },

    getBalance(){
      let sdks = this.$store.getters.getsdk || null;
      if(sdks){
        sdks.getBalance(this.$store.getters.account).then((res) => {
          this.utgamount = res;    
          console.log("this.utgamount="+this.utgamount );
        });
      }
    },

    loadData() {
      this.getBalance();   
      this.btnLoading = true;
      let rowDatas = {
        node: this.account,
        makegood: "",
        estimate: "",
      };
      let param = {
        node_address: this.account,
      };
      api
        .postJson("/platform/node/getcadnode", param)
        .then((response) => {
          let result = response.result || {};
          rowDatas.node = utils.isMobile()
            ? this.getAddrFormat(result.node_address, 10)
            : result.node_address;

          rowDatas.makegood = result.fractions;
          if (!result.fractions) {
            return;
          }

          this.form.fractions = result.fractions;
          api
            .postJson("/platform/node/getNodePledgeAmount", {})
            .then((responset) => {
              let rjson = responset.result || {};

              let numA = rjson.NODE_PLEDGE_AMOUNT || 0;
              let numB = rjson.TOTALMBPOINT || 0;
              let utgA = utils.clearZero(numA);
              if (utgA > 0 && numB > 0) {
                let utgNum = result.fractions * (utgA / numB);
                this.form.utg = utgNum;
                rowDatas.estimate = `${utils.weedZero(utgNum, 8)} UTG`;
                this.nodeinfo = rowDatas;
                this.btnLoading = utgNum <= 0;
              }
            })
            .catch((error) => {
              this.form.utg = 0;
              this.nodeinfo = rowDatas;
              console.log(error);
            });
        })
        .catch((error) => {
          this.form.utg = 0;
          this.nodeinfo = rowDatas;
          console.log(error);
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
      return { param1: this.account, txType: "CandPnsh" };
    },
  },
  watch: {
    "$store.getters.account": function () {     
      this.loadData();    
    },
  }
};
</script>
<style lang="scss" scoped>
.cursor {
  cursor: pointer;
}
</style>
