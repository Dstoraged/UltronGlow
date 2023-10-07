<template>
  <div class="container-fluid">
    <div class="card" style="margin-top: 40px">
      <div class="card-body" style="width: 100%">
        <h4 class="mt-0 header-title" style="width: 100%; text-align: left">
          {{ $t("rewardscalculator.title") }}
        </h4>
        <div class="row" style="
            display: flex;
            justify-content: left;
            align-items: left;
            width: 100%;
            height: 100%;
            text-align: left;
            margin-top: 40px;
          ">
          <div class="col-md-12">
            <span style="font-size: 12pt;text-align: left">{{ $t('rewardscalculator.titlemsg') }}</span>
          </div>
          
        </div>
        <div class="row" style="
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100%;
            text-align: center;
            margin-top: 40px;
          ">
          <div class="col-md-7" style="border-right: 1px solid #e7e7e7">

            <el-form ref="rentalForm" label-width="auto" style="max-width: 700px; margin: 0px auto; text-align: left">
              <el-form-item :label="$t('rewardscalculator.curpotsradio')" prop="curpotsradio" class="phone_form_input">
                {{ form.curpotsradio }}
              </el-form-item>

              <el-form-item :label="$t('rewardscalculator.utgprice')" prop="utgprice" class="phone_form_input">
                <f-number style="float: left" :min="0" v-model="form.utgprice" :step="steps">
                </f-number>
              </el-form-item>

              <el-form-item :label="$t('rewardscalculator.rentedspace')" prop="rentedspace" class="phone_form_input">
                <f-number style="float: left" :min="minRentspace" v-model="form.rentedspace" step="1" units="GB">
                </f-number>
                <span style="color: #adadad">{{ $t("rewardscalculator.rentedspacemsg",[minRentspace]) }}</span>
              </el-form-item>

              <el-form-item :label="$t('rewardscalculator.rentaltime')" prop="rentaltime" class="phone_form_input">
                <f-number style="float: left" :min="minrenttimes" v-model="form.rentaltime" step="1"
                  :units="`${$t('storagerental.timeunit')}`">
                </f-number>
                <span style="color: #adadad">{{ $t("rewardscalculator.rentaltimemsg",[minrenttimes]) }}</span>
              </el-form-item>

              <el-form-item :label="$t('rewardscalculator.rentalprice')" prop="rentalprice" class="phone_form_input">
                <f-number style="float: left" :min="minPrice" :max="maxPrice" v-model="form.rentalprice" :step="steps"
                  :units="`${$t('storagerental.priceunit')}`">
                </f-number>
              </el-form-item>

              <el-form-item :label="$t('rewardscalculator.bandwidthrewardRatio')" prop="bandwidthrewardRatio"
                class="phone_form_input">
                <f-number style="float: left" :min="bandwidthmin" :max="bandwidthmax" v-model="form.bandwidthrewardRatio"
                  step="0.000001">
                </f-number>
                <span style="color: #adadad">{{ $t("rewardscalculator.bandwidthrewardmsg",[bandwidthmin,bandwidthmax]) }}</span>
              </el-form-item>

              <el-form-item :label="$t('rewardscalculator.storagerewardRatio')" prop="storagerewardRatio"
                class="phone_form_input">
                <f-number style="float: left" :min="storagemin" :max="storagemax" v-model="form.storagerewardRatio" step="0.00000001">
                </f-number>
                <span style="color: #adadad">{{ $t("rewardscalculator.storagerewardmsg",[storagemin,storagemax]) }}</span>
              </el-form-item>

              <el-form-item style="text-align: center" label-width="0px">
                <el-button type="primary" @click="btnCalculator">{{ $t("rewardscalculator.calculator") }}
                </el-button>
                <el-button type="default" @click="btnReset">{{ $t("rewardscalculator.reset") }}
                </el-button>
              </el-form-item>
            </el-form>
          </div>

          <div class="col-md-5">
            <div class="media" style="
                display: -webkit-flex;
                display: flex;
                -webkit-align-items: center;
                align-items: center;
                -webkit-justify-content: center;
                justify-content: center;
                border-bottom: 1px solid #e7e7e7;
                padding: 20px 0;
                font-family: Helvetica, Arial, sans-serif;
              ">
              <div class="media-body align-self-center" style="text-align: center">
                <div class="row">
                  <div class="col-md-4">
                    <h4 class="font-14 m-1">
                      {{ $t("rewardscalculator.paysrt") }}
                    </h4>
                    <span class="font-10 m-1">
                      <span style="font-size: 18pt;font-weight: 600;">{{ paysrt }} </span> SRT
                    </span>
                  </div>
                  <div class="col-md-4">
                    <h4 class="font-14 m-1">
                      {{ $t("rewardscalculator.converted") }}
                    </h4>
                    <span class="font-10 m-1">
                       <img                        
                        src="@/assets/images/icon_jt.png"
                        class="thumb-xs ml-2"
                        height="29"
                        width="50"
                      />
                    </span>
                  </div>

                  <div class="col-md-4">
                    <h4 class="font-14 m-1">
                      {{ $t("rewardscalculator.destroyedutg") }}
                    </h4>
                    <span class="font-10 m-1">
                      <span style="font-size: 18pt;font-weight: 600;color:bisque">{{ destroyedutg }} </span> UTG
                    </span>
                  </div>
                </div>

              </div>
            </div>
            <div class="media" style="
                display: -webkit-flex;
                display: flex;
                -webkit-align-items: center;
                align-items: center;
                -webkit-justify-content: center;
                justify-content: center;
                border-bottom: 1px solid #e7e7e7;
                padding: 20px 0;
                font-family: Helvetica, Arial, sans-serif;
              " v-if="false">
              <div class="media-body align-self-center" style="text-align: center">
                <h4 class="font-14 m-1">
                  {{ $t("rewardscalculator.destroyedutg") }}
                </h4>
                <span class="font-10 m-1">
                  <span style="font-size: 18pt;font-weight: 600;color:bisque">{{ destroyedutg }} </span> UTG
                </span>
              </div>
            </div>

            <div class="media" style="
                display: -webkit-flex;
                display: flex;
                -webkit-align-items: center;
                align-items: center;
                -webkit-justify-content: center;
                justify-content: center;
                border-bottom: 1px solid #e7e7e7;
                padding: 20px 0;
                font-family: Helvetica, Arial, sans-serif;
              ">
              <div class="media-body align-self-center" style="text-align: center">
                <h4 class="font-14 m-1">
                  {{ $t("rewardscalculator.contractualpledgeutg") }}
                </h4>
                <span class="font-10 m-1">
                  <span style="font-size: 18pt;font-weight: 600;color:darkgreen">{{ contractualpledgeutg }} </span> UTG
                </span>
              </div>
            </div>

            <div class="media" style="
                display: -webkit-flex;
                display: flex;
                -webkit-align-items: center;
                align-items: center;
                -webkit-justify-content: center;
                justify-content: center;
                border-bottom: 1px solid #e7e7e7;
                padding: 20px 0;
                font-family: Helvetica, Arial, sans-serif;
              ">
              <div class="media-body align-self-center" style="text-align: center">
                <h4 class="font-14 m-1">
                  {{ $t("rewardscalculator.potsrewards") }}
                </h4>
                <span class="font-10 m-1">
                  <span style="font-size: 18pt;font-weight: 600;color:blue">{{ potsrewards }} </span> UTG
                </span>
              </div>
            </div>

            <div class="media" style="
                display: -webkit-flex;
                display: flex;
                -webkit-align-items: center;
                align-items: center;
                -webkit-justify-content: center;
                justify-content: center;
                border-bottom: 1px solid #e7e7e7;
                padding: 20px 0;
                font-family: Helvetica, Arial, sans-serif;
              " v-if="false">
              <div class="media-body align-self-center" style="text-align: center">
                <h4 class="font-14 m-1">
                  {{ $t("rewardscalculator.returnroi") }}
                </h4>
                <h4 class="font-16 m-1">
                  <span style="font-size: 13pt">{{ returnroi }} %</span>
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import FNumber from "@/components/modules/fNumberRe.vue";
import { Decimal } from "decimal.js";
import utils from "@/utils/utils";
import * as api from "@/api/api";
import * as helper from "@/utils/helper";
export default {
  name: "Contract",
  components: { FNumber },
  props: {},
  data() {
    return {
      form: {
        rentedspace: window.$url.minRentspace || 1025,
        rentalprice: 0,
        rentaltime: 30,
        curpotsradio: 0.0,
        utgprice: 0,
        bandwidthrewardRatio: window.$url.bandwidthRewardRatiomin || 0.403,
        storagerewardRatio: window.$url.storageRewardRatiomin || 0.2,
      },
      paysrt: 0,
      destroyedutg: 0,
      contractualpledgeutg: 0,
      potsrewards: 0,
      returnroi: 0,

      steps: "0.00000001",
      exchRate: 0,
      bandwidthmin: window.$url.bandwidthRewardRatiomin || 0.403,
      bandwidthmax: window.$url.bandwidthrewardRatiomax || 1.326,
      storagemin: window.$url.storageRewardRatiomin || 0.2,
      storagemax: window.$url.storageRewardRatiomax || 1.83818182,
      minRentspace: window.$url.minRentspace || 1025,
      minrenttimes: 30,
      maxrenttimes: 360,
      baseprice: 0.0,
      minPrice:0.0,
      maxPrice:0.0,
      rdecimal: 10000,
    };
  },
  created() {
    this.loadData();
  },

  methods: {
    formatTime(time) {
      return helper.formatTimimg(time);
    },
    getAddrFormat(data, number) {
      return helper.getAddrFormat(data, number);
    },

    btnCalculator() {
      var params = {
        rentCapacity: this.form.rentedspace,
        rentPrice: this.form.rentalprice,//utils.toNumber(this.form.rentalprice, 18),
        rentDays: this.form.rentaltime,
        bandwidthIndex: this.form.bandwidthrewardRatio,
        storageIndex: this.form.storagerewardRatio,
      };

      api
        .postJson("/platform/calStorageLeaseReward", params)
        .then((response) => {
          let result = response.result;
          
          this.form.curpotsradio =result.gbUtgRate.toFixed(4);//utils.weedZero(result.gbUtgRate/1000000000000000000,8);
          //this.potsrewards = helper.getDataFormat(result.leaseReward).toFixed(4);          
          this.potsrewards = utils.weedZero(result.leaseReward,8);

          this.paysrt = (this.form.rentedspace * this.form.rentaltime * this.form.rentalprice).toFixed(4);
          if (this.form.utgprice > 0) {
            this.destroyedutg = ((this.form.rentedspace * this.form.rentaltime * this.form.rentalprice) / this.form.utgprice).toFixed(4);
            this.contractualpledgeutg = ((this.form.rentedspace * this.form.rentaltime * this.form.rentalprice) / this.form.utgprice).toFixed(4);
          } else {
            this.destroyedutg = 0;
            this.contractualpledgeutg = 0;
          }

          if (this.destroyedutg > 0)
            this.returnroi = (((this.potsrewards - this.destroyedutg) / this.destroyedutg) * 100).toFixed(2);
          else
            this.returnroi = 0;
        })
        .catch((error) => {
          this.exchRate = 1.5;
          console.error(error);
        });

    },

    btnReset() {
      this.form.rentedspace = 1025;
      this.form.rentalprice = 0;
      this.form.rentaltime = 30;
      this.form.curpotsradio = 0.0;
      this.form.utgprice = 0;
      this.form.bandwidthrewardRatio = 0.497;
      this.form.storagerewardRatio = 0.1;

      this.paysrt = 0;
      this.destroyedutg = 0;
      this.contractualpledgeutg = 0;
      this.potsrewards = 0;
      this.returnroi = 0;

      this.loadData();
    }
    ,
    loadData() {
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

      api
        .postJson("/platform/getStorageBasicSet", {})
        .then((response) => {
          let result = response.result;
          this.minrenttimes = Number(result["8"] || 30);
          this.maxrenttimes = Number(result["11"] || 360);
          this.form.rentaltime = this.minrenttimes;
          this.rent_decimal = Number(result["10"] || 8);
          this.switchStep(this.rent_decimal);
          this.switchDecimal(this.rent_decimal);

          this.baseprice = utils.CutZero(
            helper.getDataFormatDecimal(Number(result["4"] || 0), 18,
              this.rdecimal,
              this.rent_decimal
            ))
          this.form.rentalprice = this.baseprice
          this.minPrice = this.baseprice * 0.1;
          this.maxPrice = this.baseprice * 10;
        })

        .catch((error) => {
          console.error(error);
        });
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
  },
};
</script>
<style lang="scss" scoped>
.cursor {
  cursor: pointer;
}
</style>
