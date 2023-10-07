<template>
  <div>
    <div class="container-fluid">
      <div class="card" style="margin-top: 40px">
        <div class="card-body">
          <h4 class="mt-0 header-title" style="text-align: left">
            {{ $t("storagereward.title") }}
          </h4>
          <div class="row">
            <div class="col-md-7">
              <div class="card" style="margin-top: 5px">
                <div class="card-body" style="text-align: left">
                  <div class="table-responsive">
                    <table class="table table-hover mb-0 phone-table-ie">
                      <tbody>
                        <tr>
                          <td style="min-width: 100px">
                            {{ $t("storagereward.revenuesaddress") }}
                          </td>
                          <td style="text-align: left">
                            <span
                              class="pointer"
                              style="color: #2ebac6"
                              @click="goToUrl('AccountDetail', revenue_addr)"
                              >{{ revenue_addr }}</span
                            >
                          </td>
                        </tr>
                        <tr>
                          <td style="min-width: 100px">
                            {{ $t("storagereward.reward") }}
                          </td>
                          <td style="text-align: left">
                            {{ nodeinfo.totalamount }}
                          </td>
                        </tr>
                        <tr>
                          <td style="min-width: 100px">
                            {{ $t("storagereward.totalAmount") }}
                          </td>
                          <td style="text-align: left">
                            {{ nodeinfo.lockamount }}
                          </td>
                        </tr>
                        <tr>
                          <td style="min-width: 100px">
                            {{ $t("storagereward.leftAmount") }}
                          </td>
                          <td style="text-align: left">
                            {{ nodeinfo.releaseamount }}
                          </td>
                        </tr>
                        <tr>
                          <td style="min-width: 100px">
                            {{ $t("storagereward.totalspace") }}
                          </td>
                          <td style="text-align: left">
                            {{ nodeinfo.capacity }}
                          </td>
                        </tr>
                        <tr>
                          <td style="min-width: 100px">
                            {{ $t("storagereward.storagefactor") }}
                          </td>
                          <td style="text-align: left">{{ nodeinfo.ratio }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-5" v-if="true">
              <div class="card" style="margin-top: 5px">
                <div class="card-body" style="text-align: left">
                  <h4 class="mt-0 header-title"></h4>
                  <div class="table-responsive">
                    <table class="table table-hover mb-0">
                      <tbody>
                        <tr>
                          <td style="min-width: 100px">
                            {{ $t("accounts.tran") }}:
                          </td>
                          <td>
                            {{
                              $t("accounts.totalTran", [
                                accInfo.transactionCount,
                              ])
                            }}
                          </td>
                        </tr>
                        <tr>
                          <td style="min-width: 100px">
                            {{ $t("accounts.balance") }}:
                          </td>
                          <td>{{ accInfo.balance }} UTG</td>
                        </tr>
                        <tr>
                          <td style="min-width: 100px">
                            {{ $t("accounts.block") }}:
                          </td>
                          <td>
                            {{ $t("accounts.lastUpdateBlock") }}
                            <span style="color: #25838b">
                              {{ accInfo.blockNumber }}
                            </span>
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

    <div class="container-fluid">
      <div class="card" style="margin-top: 40px">
        <div class="card-body" style="margin: 20px 4px; padding: 0px">
          <div class="col-md-4" style="margin: 0px; padding: 0px">
            <ul
              class="nav nav-pills nav-justified"
              role="tablist"
              style="
                font-size: 11pt;
                font-weight: bold;
                margin: 0px;
                padding: 0px;
              "
            >
              <!-- new
              <li class="nav-item waves-effect waves-light">
                <a
                  class="nav-link active"
                  data-toggle="tab"
                  href="#block-rewards"
                  role="tab"
                  aria-selected="true"
                  @click="handleNavLink($event)"
                >
                  <span class="d-none d-md-block">
                    {{ $t("storagereward.BlockRewards") }}
                  </span>
                  <span class="d-block d-md-none">
                    {{ $t("storagereward.BlockRewards") }}
                  </span>
                </a>
              </li>    
              -->
              <li class="nav-item waves-effect waves-light">
                <a
                  class="nav-link active"
                  data-toggle="tab"
                  href="#storage-rewards"
                  role="tab"
                  @click="handleNavLink($event)"
                >
                  <span class="d-none d-md-block">
                    {{ $t("storagereward.Storagespacerewards") }}
                  </span>
                  <span class="d-block d-md-none">
                    {{ $t("storagereward.Storagespacerewards") }}
                  </span>
                </a>
              </li>

              <!-- new
              <li class="nav-item waves-effect waves-light">
                <a
                  class="nav-link"
                  data-toggle="tab"
                  href="#lease-reward"
                  role="tab"
                  @click="handleNavLink($event)"
                >
                  <span class="d-none d-md-block">
                    {{ $t("storagereward.Leasereward") }}
                  </span>
                  <span class="d-block d-md-none">
                    {{ $t("storagereward.Leasereward") }}
                  </span>
                </a>
              </li>
              <li class="nav-item waves-effect waves-light">
                <a
                  class="nav-link"
                  data-toggle="tab"
                  href="#pledge-lock"
                  role="tab"
                  @click="handleNavLink($event)"
                >
                  <span class="d-none d-md-block">
                    {{ $t("storagereward.storagepledgelock") }}
                  </span>
                  <span class="d-block d-md-none">
                    {{ $t("storagereward.storagepledgelock") }}
                  </span>
                </a>
              </li>
              <li class="nav-item waves-effect waves-light">
                <a
                  class="nav-link"
                  data-toggle="tab"
                  href="#lock-release"
                  role="tab"
                  @click="handleNavLink($event)"
                >
                  <span class="d-none d-md-block">
                    {{ $t("storagereward.Lockrelease") }}
                  </span>
                  <span class="d-block d-md-none">
                    {{ $t("storagereward.Lockrelease") }}
                  </span>
                </a>
              </li>
              -->

              <li class="nav-item waves-effect waves-light">
                <a
                  class="nav-link"
                  data-toggle="tab"
                  href="#lock-tran"
                  role="tab"
                  @click="handleNavLink($event)"
                >
                  <span class="d-none d-md-block">{{ $t("home.tran") }}</span>
                  <span class="d-block d-md-none">{{ $t("home.tran") }}</span>
                </a>
              </li>
            </ul>
          </div>
          <!-- Tab panes -->
          <div
            class="tab-content"
            style="border-top: solid 1px #f0f0f0; margin-top: 20px"
          >
            <!-- new
            <div
              class="tab-pane active p-3"
              id="block-rewards"
              role="tabpanel"
            >
           
             <BlockRewards :type="1" :revenueAddr="revenue_addr" :devflag="0"/>
            </div>
             -->
            <div
              class="tab-pane tab-pane active p-3 p-3"
              id="storage-rewards"
              role="tabpanel"
            >
              <!-- new
              <Storagespacerewards :type="12" :revenueAddr="revenue_addr" :devflag="0"/>
              -->
              <Storagespacerewards
                table-id="Storagespacerewards_reward"
                :type="9"
                :revenueAddr="revenue_addr"
                :devflag="0"
                ref="refStoragespacerewards"
              />
            </div>
            <!-- new
            <div class="tab-pane p-3" id="lease-reward" role="tabpanel">
              <Leasereward :type="13" :revenueAddr="revenue_addr" :devflag="0"/>
            </div>
            <div class="tab-pane p-3" id="pledge-lock" role="tabpanel">
              <Pledgelock :type="14" :revenueAddr="revenue_addr" :devflag="0"/>
            </div>
            <div class="tab-pane p-3" id="lock-release" role="tabpanel">
               <Lockrelease :type="15" :revenueAddr="revenue_addr" :devflag="0"/>
            </div>
            -->

            <div class="tab-pane p-3" id="lock-tran" role="tabpanel">
              <TransactionsList
                table-id="TransactionsList_reward"
                :accAddr="revenue_addr"
                :tranType="0"
                ref="refTransactionsList"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import BlockRewards from "@/views/market/storagereward/BlockRewards.vue";
import Storagespacerewards from "@/views/market/storagereward/Storagespacerewards.vue";
import Leasereward from "@/views/market/storagereward/Leasereward.vue";
import Pledgelock from "@/views/market/storagereward/Pledgelock.vue";
import Lockrelease from "@/views/market/storagereward/Lockrelease.vue";
import TransactionsList from "@/views/accounts/components/TransactionsList.vue";
import utils from "@/utils/utils";
import * as api from "@/api/api";
import * as helper from "@/utils/helper";
export default {
  name: "NodeDetail",
  components: {
    BlockRewards,
    Storagespacerewards,
    Leasereward,
    Pledgelock,
    Lockrelease,
    TransactionsList,
  },
  data() {
    return {
      revenue_addr: "",
      nodeinfo: {
        totalamount: "0 UTG",
        releaseamount: "0 UTG",
        lockamount: "0 UTG",
        ratio: "-",
        capacity: "-",
      },

      accInfo: {
        balance: "",
        blockNumber: 0,
        transactionCount: 0,
      },

      isLabelTran: false,
    };
  },
  created() {
    this.revenue_addr = this.$store.getters.account;
    this.loadDatas();
    this.getAccountsInfo();

    console.log(" this.revenue_addr =" + this.revenue_addr);
  },
  methods: {
    goToUrl(name, params) {
      helper.goPathUrl(this, name, params);
    },
    handleNavLink(event) {
      $(".nav-link").removeClass("active");
      event.currentTarget.className = "nav-link active";
      console.log(event.currentTarget.hash);
      if (event.currentTarget.hash == "#lock-tran") {
        this.isLabelTran = true;
      }
    },

    getAccountsInfo() {
      var param = {
        addressHash: this.revenue_addr,
      };
      api
        .postJson("/platform/getAddressInfoByAddressHash", param)
        .then((response) => {
          let data = response.result.records[0];
          this.accInfo.balance =
            data.balance === null
              ? 0
              : helper.getDataFormat(data.balance, 18, 10000).toFixed(4);
          this.accInfo.blockNumber = data.blockNumber;
          this.accInfo.transactionCount = data.transactionCount;
        })
        .catch((error) => {
          console.error(error);
        });
    },

    loadDatas() {
      let param = {
        revenue_addr: this.revenue_addr,
        type: "9",
      };
      api
        .post("/platform/getStorageRevenueInfo", param)
        .then((response) => {
          let datas = response.result || {};
          (this.nodeinfo.ratio = datas.ratio),
            (this.nodeinfo.capacity = utils.bytesToSize(datas.capacity || 0)),
            (this.nodeinfo.updatetime = datas.updatetime),
            (this.nodeinfo.totalamount = `${utils.clearZero(
              datas.totalamount
            )} UTG`);
          this.nodeinfo.releaseamount = `${utils.clearZero(
            datas.releaseamount
          )} UTG`;
          this.nodeinfo.lockamount = `${utils.clearZero(
            (datas.totalamount || 0) - (datas.releaseamount || 0)
          )} UTG`;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },

  watch: {
    "$store.getters.account": function () {
      this.revenue_addr = this.$store.getters.account;
      this.loadDatas();
      this.getAccountsInfo();
      this.$refs.refStoragespacerewards.tableInit(null, 1);
      //this.$refs.refTransactionsList.getTranList(1);
    },
  },
};
</script>
<style lang="scss" scoped>
.cursor {
  cursor: pointer;
}
</style>
