<template>
  <div class="container-fluid">
    <div class="card" style="margin-top: 40px">
      <div class="card-body phone_padx_zero">
        <h4 class="mt-0 header-title phone_padl_1" style="text-align: left">
          {{ $t("mymanage.overview") }}
        </h4>
        <div class="row">
          <div class="col-md-6">
            <div class="card" style="margin-top: 5px">
              <div class="card-body" style="text-align: left">
                <h4 class="mt-0 header-title"></h4>
                <div class="table-responsive">
                  <table class="table table-hover mb-0 max-table-ie">
                    <tbody>
                      <tr>
                        <td style="width: 130px">
                          {{ $t("mymanage.loginaddress") }}
                        </td>
                        <td>
                          <span style="color: #2ebac6">
                            {{
                              nodeinfo.loginaddress || $store.getters.account
                            }}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          {{ $t("mymanage.utgamount") }}
                        </td>
                        <td>{{ nodeinfo.utgamount }}</td>
                      </tr>
                      <tr>
                        <td>
                          {{ $t("mymanage.numberofminers") }}
                        </td>
                        <td>{{ nodeinfo.numberofminers }}</td>
                      </tr>
                      <tr>
                        <td s>
                          {{ $t("mymanage.blocktotalamount") }}
                        </td>
                        <td>{{ nodeinfo.blocktotalamount }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="card" style="margin-top: 5px">
              <div class="card-body" style="text-align: left">
                <h4 class="mt-0 header-title"></h4>
                <div class="table-responsive">
                  <table class="table table-hover mb-0 max-table-ie">
                    <tbody>
                      <tr>
                        <td style="width: 130px">
                          {{ $t("mymanage.nodenumber") }}
                        </td>
                        <td>{{ $t(nodeinfo.nodenumber) }}</td>
                      </tr>
                      <tr v-if="true">
                        <td>
                          {{ $t("mymanage.theremaining") }}
                        </td>
                        <td>
                          {{ nodeinfo.theremaining }} {{ "  " }}
                          <span
                            style="color: #2828ff"
                            class="cursor"
                            @click="pays"
                            >{{ $t("mymanage.pay") }}</span
                          >
                        </td>
                      </tr>

                      <tr>
                        <td>
                          {{ $t("mymanage.bdtotalamount") }}
                        </td>
                        <td>{{ nodeinfo.bdtotalamount }}</td>
                      </tr>
                      <tr>
                        <td>
                          {{ $t("mymanage.bdreleaseamount") }}
                        </td>
                        <td>{{ nodeinfo.bdreleaseamount }}</td>
                      </tr>
                      <tr>
                        <td style="min-width: 100px">
                          {{ $t("mymanage.blockreleaseamount") }}
                        </td>
                        <td>{{ nodeinfo.blockreleaseamount }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        <accountsinfo :set-id="getAccount" />
      </div>
    </div>
  </div>
</template>
<script>
import utils from "@/utils/utils";
import * as api from "@/api/api";
import * as helper from "@/utils/helper";
import accountsinfo from "./accountsinfo.vue";
export default {
  name: "Overview",
  components: {
    accountsinfo,
  },
  data() {
    return {
      revenue_address: "",
      nodeinfo: {
        loginaddress: "",
        utgamount: "",
        numberofminers: "",
        nodenumber: "",
        theremaining: "",
        bdtotalamount: "",
        bdreleaseamount: "",
        blocktotalamount: "",
        blockreleaseamount: "",
      },
    };
  },

  created() {
    this.revenue_address = this.$store.getters.account;
    this.loadData();
  },

  methods: {
    pays() {
      helper.goUrl(this, "MymanagePay", "");
    },

    loadData() {
      let param = {
        revenue_address: this.revenue_address,
      };
      api
        .postJson("/platform/my/outLine", param)
        .then((response) => {
          let result = response.result || {};
          this.nodeinfo.loginaddress = result.address;
          this.nodeinfo.utgamount = `${utils.clearZero(
            result.balance || 0
          )} UTG`;
          this.nodeinfo.numberofminers = result.minerCount;
          this.nodeinfo.nodenumber = result.nodeCount;
          this.nodeinfo.theremaining = `${utils.clearZero(
            result.srt_balance || 0
          )} SRT`; //`${utils.clearZero(result.ful_balance||0)} SRT`
          this.nodeinfo.bdtotalamount = `${utils.clearZero(
            result.bdtotalamount || 0
          )} UTG`;
          this.nodeinfo.bdreleaseamount = `${utils.clearZero(
            result.bdreleaseamount || 0
          )} UTG`;
          this.nodeinfo.blocktotalamount = `${utils.clearZero(
            result.blocktotalamount || 0 - result.blockreleaseamount || 0
          )} UTG`;
          this.nodeinfo.blockreleaseamount = `${utils.clearZero(
            result.blockreleaseamount || 0
          )} UTG`;
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },

  computed: {
    getAccount() {
      return this.$store.getters.account;
    },
  },

  watch: {
    "$store.getters.account": function () {
      this.revenue_address = this.$store.getters.account;
      this.loadData();
    },
  },
};
</script>
<style lang="scss" scoped>
.cursor {
  cursor: pointer;
}
@media (max-width: 700px) {
  .phone_padx_zero {
    padding: 1.25rem 0px !important;
  }
  .phone_padl_1 {
    padding-left: 1.25rem;
  }
  .max-table-ie tr td {
    white-space: pre-line;
    word-wrap: break-word;
    word-break: break-all;
  }
}
</style>
