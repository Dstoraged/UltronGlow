<template>
  <div>
    <div class="container-fluid">
      <div class="card" style="margin-top: 40px">
        <div class="card-body">
          <h4 class="mt-0 header-title" style="width: 100%; text-align: left">
            {{ $t("storagerental.renewaltitle") }}
          </h4>

          <el-form ref="form" :rules="rules" :model="form" label-width="130px"
            style="max-width: 520px; margin: 0px auto; text-align: left">
            <el-form-item :label="$t('storagerental.renthash')" prop="rent_hash">{{ form.rent_hash }}</el-form-item>

            <el-form-item :label="$t('storagerental.deviceaddress')" prop="device_address">{{ form.device_address }}
            </el-form-item>

            <el-form-item :label="$t('storagerental.rentaladdress')" prop="rent_address">{{ form.rent_address }}
            </el-form-item>

            <el-form-item :label="$t('storagerental.rentspace')" prop="rent_space">
              <span style="float: left">{{ form.rent_space }}</span>
            </el-form-item>

            <el-form-item :label="$t('storagerental.rentalduration')" prop="rent_time">
              <span style="float: left">{{ form.rent_time }}</span>
              <span style="float:left; width:50px text-align:left;">{{
                  $t("storagerental.timeunit")
              }}</span>
            </el-form-item>

            <el-form-item :label="$t('storagerental.rentalprice')" prop="rent_price">
              <span style="float: left">{{ form.rent_price }}</span>
            </el-form-item>

            <el-form-item :label="$t('storagerental.renewaltime')" prop="renewal_time">
              <el-slider v-model="form.renewal_time" :step="1" :min="minrenttimes" :max="maxrenttimes" show-input
                class="phone_form_input" :format-tooltip="formatTooltipTime">
              </el-slider>
              <span style="color: #adadad">{{ $t("storagerental.rltimeunits",[minrenttimes]) }}</span>
              <!--
              <el-input v-model.number="form.renewal_time" style="float: left">
                <i
                  slot="suffix"
                  style="font-style: normal; margin-right: 10px"
                  >{{ $t("storagerental.timeunit") }}</i
                >
              </el-input>
              -->
            </el-form-item>

             <el-form-item :label="$t('mymanage.estimate')">
              {{ estimate }} SRT
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="onSubmit" :disabled="form.renewal_time < 1 || !form.renewal_address">{{
                  $t("storagerental.renewal")
              }}</el-button>
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
import { Decimal } from "decimal.js";
import * as helper from "@/utils/helper";
import webSdk from "@/utils/webSdk.js";
export default {
  name: "AddNode",
  components: {},
  data() {
    return {
      btnShow: false,
      loading: false,
      form: {
        rent_hash: "",
        rent_address: "",
        device_address: "",
        rent_space: 0,
        rent_price: 0.0,
        rent_time: 1,
        renewal_address: "",
        renewal_time: 1,
        utgamount: 0.0,
        rentspace: 0,
        rentprice: 0.0,
        srtbalance: 0.0,
      },
      minrenttimes: 30,
      maxrenttimes: 360,

      rules: {
        /*
        rent_address: [
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
       device_address: [{ required: true, trigger: "change",message:this.$t("storagerental.ruleaddr") }],
        rent_space: [{ required: true, trigger: "change" ,message:this.$t("storagerental.rulespace")}],
        rent_price: [{ required: true, trigger: "change" ,message:this.$t("storagerental.ruleprice")}],
        */
        renewal_time: [
          {
            required: false,
            trigger: "change",
            message: this.$t("storagerental.rulerenewaltime"),
          },
          { pattern: /^[1-9]\d*$/, message: this.$t("storagerental.inputeinfo"), trigger: 'blur' }
        ],
      },
      exchRate: 0,
    };
  },

  created() {
    this.form.renewal_address = this.$store.getters.account;
    this.form.rent_hash = this.$route.params.id;
    this.loadData();
  },
  mounted() { },
  activated() {
    this.loadData();
  },
  methods: {
    rentPriceCheck(fun) {
      this.loading = true;
      api
        .postJson("/platform/getStorageBasicSet", {})
        .then((response) => {
          this.loading = false;
          let result = response.result;
          let utgtosrt = Number(result["3"] || 0);

          let totalprice =
            this.form.rentprice * this.form.rentspace * this.form.rent_time;
          if (this.form.srtbalance <= 0 || this.form.srtbalance < totalprice) {
            this.$message.error(`${this.$t("messages.rentSRT")}`);
            return;
          }
          /*
          if (this.form.utgamount * utgtosrt < totalprice) {
            this.$message.error(`${this.$t("messages.rentSRT")}`);
            return;
          }
          */
          fun();
        })
        .catch((err) => {
          this.loading = false;
        });
    },

    async rentTimeCheck(fun) {
      this.loading = true;
      await utils.getNowHeight();
      let rentaddress = this.form.rent_address.toLowerCase();
      let renewaladdress = this.form.renewal_address.toLowerCase();
      api
        .post("/platform/getStorageRentInfo ", {
          rent_hash: this.form.rent_hash,
        })
        .then((response) => {
          this.loading = false;
          let result = response.result || {};
          //let availablestime = utils.remainingTime(result.rentNumber,result.rentTime);
          let rentaltime = utils.rentalTime(
            result.rentNumber,
            result.rentTime,
            result.renewTime,
            result.renewNumber
          );
          //if (availablestime > this.form.rent_time * 0.5) {
          if (rentaltime == 0) {
            this.$message.error(`${this.$t("messages.rentTime", [50])}`);
            return;
          }
          /* 
          if(parseInt(this.form.renewal_time) % parseInt(result.rentTime)!== 0){
             this.$message.error(`${this.$t("messages.timeMultiple")}`);
            return;
          }
        */
          if (this.form.renewal_time < this.minrenttimes) {
            this.$message.error(
              `${this.$t("messages.renewalperiod", [this.minrenttimes])}`
            );
            return;
          }

          if (this.form.rent_time > this.maxrenttimes) {
            this.$message.error(
              `${this.$t("messages.rentalmaxperiod", [this.maxrenttimes])}`
            );
            return;
          }

          if (rentaddress !== renewaladdress) {
            this.$message.error(`${this.$t("messages.rentAddr")}`);
            return;
          }
          fun();
        })
        .catch((err) => {
          this.loading = false;
        });
    },

    onSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.rentPriceCheck(() => {
            this.rentTimeCheck(() => {
              let address = this.form.renewal_address;
              if (this.form.renewal_time < this.renttimes) {
                this.$message.error(`${this.$t("messages.renewalperiod")}`);
                return;
              }
              let sdk = this.$store.getters.getsdk || null;
              if (sdk) {
                let _this_ = this;
                let setData = {
                  title: `${this.$t("storagerental.renewaltitle")}`,
                  context: `${this.$t(
                    "storagerental.rentaladdress"
                  )} : ${address}`,
                  request: null,
                  closebtnshow: false,
                  success() {
                    /*
                    if (_this_.$refs.RentalList) {
                      _this_.$refs.RentalList.getRentalList(1);
                    }
                    */
                    _this_.loadData();

                    _this_.$notify({
                      title: _this_.$t("loadingSubPan.finish"),
                      message: _this_.$t("messages.rentgok"),
                      type: "success",
                    });
                  },
                  err() {
                    _this_.$message.error("failed");
                  },
                };
                let request = sdk.sendTransactionTo(
                  webSdk.typeJson.stReNew,
                  {
                    addr1: this.form.device_address,
                    renthash: this.form.rent_hash,
                    time: this.form.renewal_time,
                  },
                  setData
                );
                setData.request = request;

                this.$store.dispatch("setNotification", setData);
              }
            });
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    loadData() {
      this.btnShow = false;
      let param = {
        revenue_address: this.form.renewal_address,
      };
      api
        .postJson("/platform/my/outLine", param)
        .then((response) => {
          let result = response.result || {};
          this.form.utgamount = utils.clearZero(result.balance || 0);
          this.form.srtbalance = utils.clearZero(result.srt_balance || 0);
          this.btnShow = this.form.utgamount > 0;
        })
        .catch((error) => {
          this.btnShow = false;
          console.error(error);
        });

      api
        .post("/platform/getStorageRentInfo", {
          rent_hash: this.form.rent_hash,
        })
        .then((response) => {
          let result = response.result || {};
          this.form.rent_address = result.rentAddr;
          this.form.device_address = result.deviceAddr;
          this.form.rent_space = this.SizeNoUnits(result.rentSpace) + " GB";
          this.form.rent_price =
            helper.getDataFormat(result.rentPrice, 18, 10000).toFixed(4) +
            " " +
            this.$t("storagerental.priceunit");
          this.form.rent_time = result.rentTime;
          this.form.rentspace = this.SizeNoUnits(result.rentSpace);
          this.form.rentprice = helper
            .getDataFormat(result.rentPrice, 18, 10000)
            .toFixed(4);
        })
        .catch((error) => {
          console.error(error);
        });

      api
        .postJson("/platform/getStorageBasicSet", {})
        .then((response) => {
          let result = response.result;
          this.minrenttimes = Number(result["8"] || 30);
          this.form.rent_time = this.minrenttimes;
          this.maxrenttimes = Number(result["11"] || 360);
        })
        .catch((error) => {
          console.error(error);
        });

      api
        .postJson("/platform/srt/getExchRate", { txType: "ExchRate" })
        .then((response) => {
          let exchRate = response.result || 0;
          this.exchRate = exchRate > 0 ? exchRate / 10000 : 0;
        })
        .catch((error) => {
          this.exchRate = 1.5;
          console.error(error);
        });
    },

    SizeNoUnits(bytes) {
      return (bytes / (1024 * 1024 * 1024)).toFixed(0);
    },

    formatTooltipTime(val) {
      return `${val} ${this.$t("storagerental.timeunit")}`;
    }
  },

  computed: {
    estimate() {
      let num = utils.CutZero(this.form.rentspace * this.form.rentprice * this.form.renewal_time);    
      let re = 0
      try {
        re = new Decimal(num || 0).toFixed();
        re = utils.weedZero(re, 8);
      } catch (error) { }
      return re;
    }
  },
};
</script>
<style lang="scss" scoped>
.cursor {
  cursor: pointer;
}
</style>
