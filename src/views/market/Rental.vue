<template>
  <div>
    <div class="container-fluid">
      <div class="card" style="margin-top: 40px">
        <div class="card-body">
          <h4 class="mt-0 header-title" style="width: 100%; text-align: left">
            {{ $t("storagerental.title") }}
          </h4>

          <el-form ref="rentalForm" :rules="rules" :model="form" label-width="auto"
            style="max-width: 520px; margin: 0px auto; text-align: left">
            <el-form-item :label="$t('market.pledgeaddress')" prop="device_address">
              <el-popover placement="bottom" trigger="click" :content="form.device_address">
                <span slot="reference">
                  {{ getAddrFormat(form.device_address) }}
                </span>
              </el-popover>
            </el-form-item>
            <el-form-item :label="$t('storagerental.rentaladdress')" prop="rent_address">
              <el-popover placement="bottom" trigger="click" :content="form.rent_address">
                <span slot="reference">
                  {{ getAddrFormat(form.rent_address) }}
                </span>
              </el-popover>
            </el-form-item>

            <el-form-item :label="$t('market.availablespace')" prop="availablespace">
              {{ form.availablespace }} GB
            </el-form-item>

            <el-form-item :label="$t('storagerental.rentspace')" prop="rent_space">              
              <!--
              <f-number :value="form.rent_space" style="float: left" :step="5" :min="minRentspace" :control="true"
                :max="maxRentspace" units="GB" :controlStep="5" />
              -->              
              <el-slider v-model="form.rent_space" :step="5" :min="minRentspace" :max="maxRentspace" 
                @change="onChangeData"      
                show-input                         
                class="phone_form_input" :format-tooltip="formatTooltipSpace" />

              <span style="color: #adadad">{{ $t("storagerental.leasedspace", [minRentspace]) }}</span>
            </el-form-item>


            <el-form-item :label="$t('storagerental.rentalduration')" prop="rent_time">
              <el-slider v-model="form.rent_time" :step="1" :min="minrenttimes" :max="maxrenttimes" show-input
                class="phone_form_input" :format-tooltip="formatTooltipTime">
              </el-slider>
              <span style="color: #adadad">{{ $t("storagerental.rltimeunits", [minrenttimes]) }}</span>
              <!--
              <el-input v-model.number="form.rent_time" style="float: left">
                <i slot="suffix" style="font-style: normal; margin-right: 10px">{{ $t("storagerental.timeunit") }}</i>
              </el-input>
              -->

            </el-form-item>

            <el-form-item :label="$t('storagerental.rentalprice')" prop="rent_price">
              {{ form.rent_price }} {{ $t('storagerental.priceunit') }}
            </el-form-item>

            <!--
            <el-form-item :label="$t('storagerental.rentalprice')" prop="rent_price" class="phone_form_input">
              <f-number style="float: left" :min="`${baseprice * 0.1}`" :value="form.rent_price" :step="steps"
                :units="`${$t('storagerental.priceunit')}`" :disabled="true">
              </f-number>
            </el-form-item>
          -->
            <el-form-item :label="$t('mymanage.estimate')">
              {{ estimate }} SRT
            </el-form-item>

            <el-form-item style="text-align: center" label-width="0px">
              <el-button type="primary" @click="onSubmit">{{
                  $t("market.hire")
              }}</el-button>
            </el-form-item>
          </el-form>
          <!-- :disabled="form.rent_time <= 0 || form.rent_space <= 0 || !form.rent_address|| this.form.utgamount <= 0" -->
        </div>
      </div>
    </div>
    <div class="container-fluid">
      <div class="card" style="margin-top: 40px">
        <div class="card-body">
          <h4 class="mt-0 header-title" style="width: 100%; text-align: left">
            <span>{{ $t("market.rentalrecord") }}</span>
          </h4>
          <RentalRecord :address="form.device_address" ref="RentalList" :rdecimal="rdecimal" :rent_decimal="form.rent_decimal"/>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import * as api from "@/api/api";
import * as helper from "@/utils/helper";
import { Decimal } from "decimal.js";
import utils from "@/utils/utils";
import webSdk from "@/utils/webSdk.js";
import FNumber from "@/components/modules/fNumberRe.vue";
import RentalRecord from "./components/RentalRecord.vue";
export default {
  name: "AddNode",
  components: {
    RentalRecord,
    FNumber,
  },
  data() {
    return {
      btnShow: false,
      loading: false,
      form: {
        rent_address: "",
        device_address: "",
        rent_space: Number(window.$url.minRentspace || 1025),
        rent_price: 0.0,
        rent_time: 1,
        utgamount: 0.0,
        availablespace: 0,
        srtbalance: 0.0,
        rent_decimal: 8,
        rentysprice: 0.0,
      },
      baseprice: 0.0,
      steps: "0.00000001",
      minrenttimes: 30,
      maxrenttimes: 360,
      rdecimal: 10000,
      rentprice: 0.0,
      rules: {
        rent_address: [
          { required: false, trigger: "change" },
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
        device_address: [
          {
            required: false,
            trigger: "change",
            message: this.$t("storagerental.ruleaddr"),
          },

        ],
        rent_space: [
          {
            required: false,
            trigger: "change",
            message: this.$t("storagerental.rulespace"),
          },
          { pattern: /^[1-9]\d*$/, message: this.$t("storagerental.inputeinfo"), trigger: 'blur' }
        ],
        rent_price: [
          {
            required: false,
            trigger: "change",
            message: this.$t("storagerental.ruleprice"),
          },
        ],
        rent_time: [
          {
            required: false,
            trigger: "change",
            message: this.$t("storagerental.ruletime"),
          },
          { pattern: /^[1-9]\d*$/, message: this.$t("storagerental.inputeinfo"), trigger: 'blur' }
        ],
      },
      exchRate: 0,
      minRentspace: Number(window.$url.minRentspace || 1025),
      maxRentspace: Number(window.$url.minRentspace || 1025),
      value2: Number(window.$url.minRentspace || 1025)
    };
  },

  created() {
    this.form.rent_address = this.$store.getters.account;
    this.form.device_address = this.$route.params.id;
    this.getStorageBasicSet();
    //this.loadData();
    localStorage.setItem("detail", true);
  },
  mounted() { },
  activated() {
    this.getStorageBasicSet();
    //this.loadData();
  },
  methods: {
    rentPriceCheck(fun) {
      api
        .postJson("/platform/getStorageBasicSet", {})
        .then((response) => {
          this.loading = false;
          let result = response.result;
          //let rentBasePirce = Number(result["2"] || 0);
          let utgtosrt = Number(result["3"] || 0);

          if (this.baseprice * 0.1 > this.form.rent_price) {
            this.$message.error(`${this.$t("messages.rentPrice")}`);
            return;
          }

          if (this.baseprice * 10 < this.form.rent_price) {
            this.$message.error(`${this.$t("messages.rentmPrice")}`);
            return;
          }

          let totalprice =
            this.form.rent_price * this.form.rent_space * this.form.rent_time;
          if (this.form.srtbalance <= 0 || this.form.srtbalance < totalprice) {
            this.$message.error(`${this.$t("messages.rentSRT")}`);
            return;
          }

          //  if (this.form.utgamount * utgtosrt < totalprice) {
          //this.$message.error(`${this.$t("messages.rentSRT")}`);
          //    return;
          //  }

          fun();
        })
        .catch((err) => {
          console.log(err);
          this.loading = false;
        });
    },

    rentSpaceCheck(fun) {
      this.loading = true;
      let deviceaddress = webSdk.sdkUtils.hashToNX(this.form.device_address);
      api
        .post("/platform/getStorageSpaceInfo ", {
          device_addr: deviceaddress,
        })
        .then((response) => {
          this.loading = false;
          let result = response.result || {};
          //let availablespace = utils.StorageSizeNoUnits(result.freeSpace);
          let availablespace = this.SizeNoUnits(result.freeSpace) - 5;

          
          if (this.form.rent_space < this.minRentspace) {
            this.$message.error(`${this.$t("messages.leasedspace")}`);
            return;
          }

         
          if (parseInt(this.form.rent_space) % 5 !== 0) {
            this.$message.error(`${this.$t("messages.rtspaceMultiple")}`);
            return;
          }

          if (availablespace < this.form.rent_space) {
            this.$message.error(`${this.$t("messages.rentSpace")}`);
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
      this.$refs.rentalForm.validate((valid) => {
        if (valid) {
          // this.rentPriceCheck(() => {
          this.rentSpaceCheck(() => {
            let address = this.form.rent_address;
            if (this.form.rent_time <= 0 || this.form.rent_space <= 0) {
              this.$message.error(`${this.$t("messages.rttimespace")}`);
              return;
            }
            let minPrice = this.baseprice * 0.1;
            if (minPrice > this.form.rent_price) {
              this.$message.error(`${this.$t("messages.rentPrice")}`);
              return;
            }
            let maxPrice = this.baseprice * 10;

            if (maxPrice < this.form.rent_price) {
              this.$message.error(`${this.$t("messages.rentmPrice")}`);
              return;
            }
            let totalprice = this.form.rent_price * this.form.rent_space * this.form.rent_time;
            console.log("srt_balance="+this.form.srtbalance,"totalprice="+totalprice)
            if (
              this.form.srtbalance <= 0 ||
              this.form.srtbalance < totalprice
            ) {
              this.$message.error(`${this.$t("messages.rentSRT")}`);
              return;
            }

            if (this.form.rent_time < this.minrenttimes) {
              this.$message.error(
                `${this.$t("messages.rentalperiod", [this.minrenttimes])}`
              );
              return;
            }

            if (this.form.rent_time > this.maxrenttimes) {
              this.$message.error(
                `${this.$t("messages.rentalmaxperiod", [this.maxrenttimes])}`
              );
              return;
            }

            let sdk = this.$store.getters.getsdk || null;
            if (sdk) {
              let _this_ = this;
              let setData = {
                title: `${this.$t("storagerental.title")}`,
                context: `${this.$t(
                  "storagerental.rentaladdress"
                )} : ${address}`,
                request: null,
                closebtnshow: false,
                success() {
                  if (_this_.$refs.RentalList) {
                    _this_.$refs.RentalList.getRentalList(1);
                  }
                  _this_.$notify({
                    title: _this_.$t("loadingSubPan.finish"),
                    message: _this_.$t("messages.rentgok"),
                    type: "success",
                  });
                  _this_.loadData();
                },
                err() {
                  _this_.$message.error("failed");
                },
              };
              
              console.log(
                "this.form.device_address=" + this.form.device_address
              );
              let request = sdk.sendTransactionTo(
                webSdk.typeJson.stRent,
                {
                  addr1: this.form.device_address,
                  spaces: this.form.rent_space * 1024 * 1024 * 1024,
                  time: this.form.rent_time,
                  price:this.form.rentysprice// utils.toNumber(this.form.rent_price, 18),
                },
                setData
              );
              setData.request = request;
              console.log("sendData:"+JSON.stringify(request));
              
              this.$store.dispatch("setNotification", setData);
            }
          });
          // });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    loadData() {
      this.btnShow = false;
      let param = {
        revenue_address: this.form.rent_address,
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
      let sparam = {
        device_addr: this.form.device_address,
      };
      api
        .post("/platform/getStorageSpaceInfo", sparam)
        .then((response) => {
          let result = response.result || {};
          // this.form.rent_price = utils.CutZero(helper.getDataFormat(result.rentPrice, 18, 10000))
          this.form.rentysprice = result.rentPrice;          
          this.form.rent_price = utils.CutZero(
            helper.getDataFormatDecimal(
              result.rentPrice,
              18,
              this.rdecimal,
              this.rent_decimal
            )
          );
          // this.baseprice = utils.CutZero(helper.getDataFormat(result.rentPrice, 18, 10000))
          this.baseprice = utils.CutZero(
            helper.getDataFormatDecimal(
              result.rentPrice,
              18,
              this.rdecimal,
              this.rent_decimal
            )
          );
          // this.form.rent_space = this.SizeNoUnits(result.freeSpace);
          this.form.availablespace = this.SizeNoUnits(result.freeSpace) -5;
          this.maxRentspace = parseInt(this.form.availablespace / 5) * 5;

          console.log("this.rent_decimal="+this.rent_decimal,"this.rdecimal="+this.rdecimal);
          console.log("this.form.rentysprice="+this.form.rentysprice+"---this.form.rent_price="+utils.toNumber(this.form.rent_price, 18),
          "this.form.rent_price="+this.form.rent_price+"---this.baseprice="+this.baseprice);
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

    getStorageBasicSet() {
      api
        .postJson("/platform/getStorageBasicSet", {})
        .then((response) => {
          let result = response.result;
          this.minrenttimes = Number(result["8"] || 30);
          this.rent_decimal = Number(result["10"] || 8);
          this.switchStep(this.rent_decimal);
          this.switchDecimal(this.rent_decimal);
          this.form.rent_time = this.minrenttimes;
          this.maxrenttimes = Number(result["11"] || 360);

          this.loadData();
        })

        .catch((error) => {
          console.error(error);
        });
    },
    SizeNoUnits(bytes) {
      return (bytes / (1024 * 1024 * 1024)).toFixed(0);
    },

    switchDecimal(val) {
      switch (val) {
        case 0:
          this.rdecimal = 1;
          break;
        case 1:
          this.rdecimal = 1;
          break;
        case 2:
          this.rdecimal = 100;
          break;
        case 3:
          this.rdecimal = 1000;
          break;
        case 4:
          this.rdecimal = 10000;
          break;
        case 5:
          this.rdecimal = 100000;
          break;
        case 6:
          this.rdecimal = 1000000;
          break;
        case 7:
          this.rdecimal = 10000000;
          break;
        case 8:
          this.rdecimal = 100000000;
          break;
        case 9:
          this.rdecimal = 1000000000;
          break;
        case 10:
          this.rdecimal = 10000000000;
          break;
        default:
          this.rdecimal = 10000;
      }
    },
    switchStep(val) {
      switch (val) {
        case 0:
          this.steps = "0";
          break;
        case 1:
          this.steps = "0.1";
          break;
        case 2:
          this.steps = "0.01";
          break;
        case 3:
          this.steps = "0.001";
          break;
        case 4:
          this.steps = "0.0001";
          break;
        case 5:
          this.steps = "0.00001";
          break;
        case 6:
          this.steps = "0.000001";
          break;
        case 7:
          this.steps = "0.0000001";
          break;
        case 8:
          this.steps = "0.00000001";
          break;
        case 9:
          this.steps = "0.000000001";
          break;
        case 10:
          this.steps = "0.0000000001";
          break;
        default:
          this.steps = "0.00000001";
      }
    },
    getAddrFormat(val, num = 8) {
      if (utils.isMobile()) {
        return helper.getAddrFormat(val, num);
      }
      return val;
    },

    changeInpuSpace() {
      var pattern = /^[1-9][0-9]*$/
      
      if (!pattern.test(this.form.rent_space)) {
        
        this.form.rent_space = ''
      }
    },
    
    onChangeData(val){      
      if (parseInt(val) % 5 !== 0) {
        let vals=parseInt(parseInt(val)/5)*5;
        if(vals<=this.minRentspace)
          this.form.rent_space=this.minRentspace;
        else
          this.form.rent_space=vals;
      }
    },
    formatTooltipSpace(val) {
      return val + ' GB';
    },
    formatTooltipTime(val) {
      return `${val} ${this.$t("storagerental.timeunit")}`;
    }
  },

  computed: {
    estimate() {
      let num = utils.CutZero(this.form.rent_space * this.form.rent_price * this.form.rent_time);
      let re = 0
      try {
        re = new Decimal(num || 0).toFixed();
        re = utils.weedZero(re, 10);
      } catch (error) { }
      return re;
    }
  },

  watch: {
    "$store.getters.account": function () {
      this.form.rent_address = this.$store.getters.account;
      this.loadData();
      if (this.$refs.RentalList && this.$refs.RentalList.getRentalList) {
        this.$refs.RentalList.getRentalList();
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.cursor {
  cursor: pointer;
}
</style>
