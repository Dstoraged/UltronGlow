<template>
  <div class="container-fluid">
    <div class="card" style="margin-top: 40px">
      <div class="card-body" style="text-align: left">
        <h4 class="mt-0 header-title">{{ $t("storagerental.datailtitle") }}</h4>
        <p style="font-size: 12pt; color: #2ebac6; padding: 0px; margin: 6px 0">
          {{ rentHash }}
        </p>

        <div class="table-responsive">
          <table class="table table-hover mb-0">
            <tbody>
              <tr>
                <td style="min-width: 100px">
                  {{ $t("storagerental.deviceaddress") }}
                </td>
                <td>
                  <span
                    class="cursor"
                    style="color: #2ebac6"
                    @click="goToUrl('MarketDetail', rentInfo.deviceAddr)"
                    >{{ rentInfo.deviceAddr }}</span>
                </td>
              </tr>
              <tr>
                <td style="min-width: 100px">
                  {{ $t("storagerental.rentaladdress") }}
                </td>
                <td>
                  <span style="color: #2ebac6">{{ rentInfo.rentAddr }}</span>
                </td>
              </tr>
              <tr>
                <td style="min-width: 100px">
                  {{ $t("storagerental.rentspace") }}
                </td>
                <td>{{ rentInfo.rentSpace }}</td>
              </tr>
              <tr>
                <td style="min-width: 100px">
                  {{ $t("storagerental.rentalprice") }}
                </td>
                <td>{{ rentInfo.rentPrice }}</td>
              </tr>
              <tr>
                <td style="min-width: 100px">
                  {{ $t("storagerental.rentalduration") }}
                </td>
                <td>{{ rentInfo.rentTime }}</td>
              </tr>
              <tr>
                <td style="min-width: 100px">
                  {{ $t("storagerental.totalrent") }}
                </td>
                <td>{{ rentInfo.rentAmount }}</td>
              </tr>

              <tr>
                <td style="min-width: 100px">
                  {{ $t("storagerental.blockheight") }}
                </td>
                <td>{{ rentInfo.rentNumber }}</td>
              </tr>
              <tr>
                <td style="min-width: 100px">
                  {{ $t("storagerental.leasestatus") }}
                </td>
                <td>{{ $t(rentInfo.rentStatus) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import * as api from "@/api/api";
import * as helper from "@/utils/helper";
import utils from "@/utils/utils";

export default {
  name: "RentDetail",
  components: {},
  props: {},
  data() {
    const types = {
      "-1": "storagerental.status7",
      0: "storagerental.status0",
      1: "storagerental.status1",
      2: "storagerental.status2",
      3: "storagerental.status3",
      4: "storagerental.status4",
      5: "storagerental.status5",
      6: "storagerental.status6",
    };
    return {
      rentHash: "",
      rentInfo: {},
      types,
    };
  },
  created() {
    this.rentHash = this.$route.params.id;
    this.getRentInfo();
    localStorage.setItem("detail", true);
  },
  methods: {
    goToUrl(name, params) {
      console.log("params=" + params);
      helper.goPathUrl(this, name, params);
    },

    getRentInfo() {
      var param = {
        rent_hash: this.rentHash,
      };
      api
        .post("/platform/getStorageRentInfo", param)
        .then((response) => {
          let item = response.result;
          this.rentInfo = {
            rentHash: item.rentHash,
            deviceAddr: item.deviceAddr,
            rentAddr: item.rentAddr,
            rentSpace: utils.bytesToSize(item.rentSpace),
            rentPrice:
              helper.getDataFormat(item.rentPrice, 18, 10000).toFixed(4) +
              " " +
              this.$t("storagerental.priceunit"),
            rentTime: item.rentTime + " " + this.$t("storagerental.timeunit"),
            rentNumber: item.rentNumber,
            rentAmount:
              helper.getDataFormat(item.rentAmount, 18, 10000).toFixed(4) +
              " SRT",
            rentStatus: this.types[item.rentStatus || "-1"],
            recevAmount:
              helper.getDataFormat(item.recevAmount, 18, 10000).toFixed(4) +
              " UTG",
            validNumber: item.validNumber,
            succNumber: item.succNumber,
            failCount: item.failCount,
          };
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.cursor {
  cursor: pointer;
}
</style>
