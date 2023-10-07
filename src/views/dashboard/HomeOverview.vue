<template>
  <div class="container-fluid">
    <div class="card" style="margin-top: 40px">
      <div class="card-body">
        <div class="row">
          <div class="col-md-4" style="border-right: 1px solid #e7e7e7">
            <div
              class="media"
              style="
                display: -webkit-flex;
                display: flex;
                -webkit-align-items: center;
                align-items: center;
                -webkit-justify-content: center;
                justify-content: center;
                border-bottom: 1px solid #e7e7e7;
                padding: 0 0 20px 0;
              "
            >
              <img
                class="d-flex mr-3 thumb-sm"
                src="@/assets/images/UTG-logo.png"
              />
              <div
                class="media-body align-self-center"
                style="text-align: left"
              >
                <h4 class="font-14 m-1">{{ $t("home.utgprice") }}</h4>
                <h4 class="font-16 m-1">
                  <span style="font-size: 13pt">$3,1133.99</span
                  ><span style="font-size: 12pt; color: #848484; margin: 0 6px"
                    >@0.07 {{ $t("home.btc") }}</span
                  ><span style="color: #ff0004; margin: 0 0px; font-size: 12px"
                    >(-1.56%)</span
                  >
                </h4>
              </div>
            </div>
            <div
              class="media"
              style="
                display: -webkit-flex;
                display: flex;
                -webkit-align-items: center;
                align-items: center;
                -webkit-justify-content: center;
                justify-content: center;
                padding: 20px 0 0px 0;
              "
            >
              <img
                class="d-flex mr-3 thumb-sm"
                src="@/assets/images/icon_sssj.png"
              />
              <div
                class="media-body align-self-center"
                style="text-align: left"
              >
                <h4 class="font-14 m-1">{{ $t("home.marketcap") }}</h4>
                <h4 class="font-16 m-1">
                  <span style="font-size: 13pt">$367,672,781,071,000</span>
                </h4>
              </div>
            </div>
          </div>
          <div class="col-md-4" style="border-right: 1px solid #e7e7e7">
            <div
              class="media"
              style="
                display: -webkit-flex;
                display: flex;
                -webkit-align-items: center;
                align-items: center;
                -webkit-justify-content: center;
                justify-content: center;
                border-bottom: 1px solid #e7e7e7;
                padding: 0 0 20px 0;
              "
            >
              <img
                class="d-flex mr-3 thumb-sm"
                src="@/assets/images/icon_dm.png"
              />
              <div
                class="media-body align-self-center"
                style="text-align: left"
              >
                <h4 class="font-14 m-1">{{ $t("home.transactions") }}</h4>
                <h4 class="font-16 m-1">
                  <span style="font-size: 13pt">149,139</span>
                </h4>
              </div>
              <div
                class="media-body align-self-right"
                style="text-align: right"
              >
                <h4 class="font-14 m-1">{{ $t("home.gasprice") }}</h4>
                <h4 class="font-16 m-1">
                  <span style="font-size: 13pt">176 Gwei</span>
                </h4>
              </div>
            </div>
            <div
              class="media"
              style="
                display: -webkit-flex;
                display: flex;
                -webkit-align-items: center;
                align-items: center;
                -webkit-justify-content: center;
                justify-content: center;
                padding: 20px 0 0 0;
              "
            >
              <img
                class="d-flex mr-3 thumb-sm"
                src="@/assets/images/icon_mk.png"
              />
              <div
                class="media-body align-self-center"
                style="text-align: left"
              >
                <h4 class="font-14 m-1">{{ $t("home.blockheights") }}</h4>
                <h4 class="font-16 m-1">
                  <span style="font-size: 13pt">10867</span>
                </h4>
              </div>
              <div
                class="media-body align-self-right"
                style="text-align: right"
              >
                <h4 class="font-14 m-1">{{ $t("home.nextelectionblock") }}</h4>
                <h4 class="font-16 m-1">
                  <span style="font-size: 13pt">10,710</span>
                </h4>
              </div>
            </div>
          </div>
          <div class="col-md-4" style="">
            <div
              class="media"
              style="
                display: -webkit-flex;
                display: flex;
                -webkit-align-items: center;
                align-items: center;
                -webkit-justify-content: center;
                justify-content: center;
                padding: 0 0 00px 0;
              "
            >
              <img
                class="d-flex mr-3 thumb-sm"
                src="@/assets/images/icon_gp.png"
                style="width: 20px; height: 20px"
              />
              <div
                class="media-body align-self-center"
                style="text-align: left"
              >
                <h4 class="font-12 m-1">
                  {{ $t("home.ultronglowtransaction") }}
                </h4>
              </div>
            </div>
            <UltronGlowTxnEcharts style="height: 120px; margin: 0px auto" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import UltronGlowTxnEcharts from "@/components/echarts/UltronGlowTxnEcharts.vue";
export default {
  name: "HomeOverview",
  components: {
    UltronGlowTxnEcharts,
  },
};
</script>
<style lang="scss" scoped></style>
