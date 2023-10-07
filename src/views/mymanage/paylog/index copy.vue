<template>
  <div>
    <div class="container-fluid">
      <div class="card" style="margin-top: 40px">
        <div class="card-body">
          <h4 class="mt-0 header-title" style="text-align: left">
            {{ $t("mymanage.rechargerecord") }}
          </h4>
          <div class="row">
            <div class="col-md-6">
              <div class="card" style="margin-top: 5px">
                <div class="card-body" style="text-align: left">
                  <h4 class="mt-0 header-title"></h4>
                  <div class="table-responsive">
                    <table class="table table-hover mb-0">
                      <tbody>
                        <tr>
                          <td style="min-width: 150px">
                            {{ $t("mymanageMining.revenuesaddress") }}
                          </td>
                          <td>
                            <span style="color: #2ebac6">{{
                              nodeinfo.revenuesaddress
                            }}</span>
                          </td>
                        </tr>
                        <tr>
                          <td style="min-width: 120px">
                            {{ $t("mymanage.balance") }}
                          </td>
                          <td>{{ nodeinfo.utgbalance }}</td>
                        </tr>
                        <tr>
                          <td style="min-width: 120px">
                            {{ $t("mininglog.theremaining") }}
                          </td>
                          <td style="min-width: 100px">
                            {{ $t(nodeinfo.theremaining) }} {{ " " }}
                            <span
                              class="cursor"
                              style="color: #5e89d8; font-weight: 600"
                              @click="pays"
                              >{{ $t("mymanage.pay") }}</span
                            >
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <PayRecord :param="getParam" />
  </div>
</template>
<script>
import PayRecord from "@/views/mymanage/pay/PayRecord.vue";
import * as helper from "@/utils/helper";
import utils from "@/utils/utils";
import * as api from "@/api/api";
export default {
  components: { PayRecord },
  data() {
    return {
      nodeinfo: {},
    };
  },

  created() {
    this.getrowDatas();
  },
  activated() {
    this.getrowDatas();
  },
  methods: {
    pays() {
      helper.goUrl(this, "MymanagePay", "");
    },
    getrowDatas() {
      api
        .postJson("/platform/my/outLine", {
          revenue_address: this.$store.getters.account,
        })
        .then((response) => {
          let data = response.result || {};
          this.nodeinfo = {
            revenuesaddress: data.address,
            utgbalance: `${utils.clearZero(data.balance || 0)} UTG`,
            theremaining: `${utils.clearZero(data.srt_balance || 0)} SRT`,
          };
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  computed: {
    getParam() {
      return {
        //param1: this.$store.getters.account,
        param1: this.$store.getters.account,
        txType: "Exch",
      };
    },
  },
  watch: {
    "$store.getters.account": function () {
      this.getrowDatas();
    },
  },
};
</script>
<style lang="scss" scoped>
.cursor {
  cursor: pointer;
}
</style>
