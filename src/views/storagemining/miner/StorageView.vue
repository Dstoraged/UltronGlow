<template>
  <div>
    <div class="container-fluid">
      <div class="card" style="margin-top: 40px">
        <div class="card-body">
          <h4 class="mt-0 header-title" style="text-align: left">
            {{ $t("storagemining.storagerewardDetails") }}
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
                          <td style="min-width: 180px">
                            {{ $t("market.deviceaddress") }}
                          </td>
                          <td>
                            <span style="color: #2ebac6; text-align: left">{{
                              storageinfo.deviceAddr
                            }}</span>
                          </td>
                        </tr>
                        <tr>
                          <td style="min-width: 180px">
                            {{ $t("market.revenuesaddress") }}
                          </td>
                          <td>
                            <span style="color: #2ebac6; text-align: left">{{
                              storageinfo.revenueAddr
                            }}</span>
                          </td>
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
                    <table class="table table-hover mb-0">
                      <tbody>
                        <tr>
                          <td style="width: 120px">
                            {{ $t("market.totalrevenue") }}
                          </td>
                          <td>{{ storageinfo.totalAmount }}</td>
                        </tr>
                        <tr>
                          <td style="min-width: 180px">
                            {{ $t("market.storagespacebenefits") }}
                          </td>
                          <td>{{ storageinfo.storageAmount }}</td>
                        </tr>
                        <tr>
                          <td style="min-width: 180px">
                            {{ $t("market.grossrentalincome") }}
                          </td>
                          <td>{{ storageinfo.rentAmount }}</td>
                        </tr>

                        <tr>
                          <td tyle="min-width: 100px;">
                            {{ $t("storagemining.lockquantity") }}
                          </td>
                          <td>
                            <!-- {{ nodeinfo.lockquantity }} -->
                            {{ statsTotal.lockAmount }}
                          </td>
                        </tr>
                        <tr>
                          <td tyle="min-width: 100px;">
                            {{ $t("storagemining.releasedquantity") }}
                          </td>
                          <td>
                            <!--{{ nodeinfo.releasedquantity }} -->
                            {{ statsTotal.releaseamount }}
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
          <div class="col-md-3" style="margin: 0px; padding: 0px">
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
              <li class="nav-item waves-effect waves-light">
                <a
                  class="nav-link active"
                  data-toggle="tab"
                  href="#storage-rewards"
                  role="tab"
                  @click="handleNavLink($event)"
                >
                  <span class="d-none d-md-block">
                    {{ $t("market.storagereward") }}
                  </span>
                  <span class="d-block d-md-none">
                    {{ $t("market.storagereward") }}
                  </span>
                </a>
              </li>

              <li class="nav-item waves-effect waves-light">
                <a
                  class="nav-link"
                  data-toggle="tab"
                  href="#lock-rentalrewards"
                  role="tab"
                  @click="handleNavLink($event)"
                >
                  <span class="d-none d-md-block">{{
                    $t("market.rentalreward")
                  }}</span>
                  <span class="d-block d-md-none">{{
                    $t("market.rentalreward")
                  }}</span>
                </a>
              </li>
            </ul>
          </div>
          <!-- Tab panes -->
          <div
            class="tab-content"
            style="border-top: solid 1px #f0f0f0; margin-top: 20px"
          >
            <div
              class="tab-pane active p-3"
              id="storage-rewards"
              role="tabpanel"
            >
              <Storagespacerewards
                :type="9"
                :revenueAddr="address"
                :devflag="1"
              />
            </div>
            <div class="tab-pane p-3" id="lock-rentalrewards" role="tabpanel">
              <RentalReward :address="address" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import utils from "@/utils/utils";
import * as api from "@/api/api";
import * as helper from "@/utils/helper";

import Storagespacerewards from "@/views/market/storagereward/Storagespacerewards.vue";
import RentalReward from "@/views/market/components/RentalReward.vue";

export default {
  name: "StorageDetail",
  components: {
    Storagespacerewards,
    RentalReward,
  },
  props: {},
  data() {
    const types = {
      "-1": "market.status-1",
      0: "market.status0",
      1: "market.status1",
      5: "market.status5",
      6: "market.status6",
    };
    const vaildtypes = {
      0: "storagepledge.vaildStatus0",
      1: "storagepledge.vaildStatus1",
      2: "storagepledge.vaildStatus2",
    };
    return {
      address: "",
      storageinfo: {},
      nodeinfo: {},
      types,
      vaildtypes,
      isLabelFlag: false,
      type: 0,
      typer: 0,
      statsTotal: {
        totalAmount: "--",
        releaseamount: "--",
        lockAmount: "--",
      },
    };
  },
  created() {
    let idL = this.$route.params.id;
    let ids = idL.split("_");
    this.address = ids[0];
    this.type = parseInt(ids[1]);
    this.typer = parseInt(ids[1]) + 1;

    this.getStorageInfo();
    // this.getMinerDetail();
    this.getStorageRewardStat();
    sessionStorage.setItem("MarketDetail", true);
  },

  methods: {
    getAddrFormat(data, number = 15) {
      return helper.getAddrFormat(data, number);
    },
    handleNavLink(event) {
      $(".nav-link").removeClass("active");
      console.log(event.target.tagName);
      event.currentTarget.className = "nav-link active";

      if (event.currentTarget.hash == "#vaild-status") {
        this.isLabelFlag = true;
      }
    },

    getStorageInfo() {
      let param = {
        device_addr: this.address,
      };
      api
        .post("/platform/getStorageSpaceInfo", param)
        .then((response) => {
          let result = response.result || {};
          (result.deviceAddr = result.deviceAddr),
            (result.pledgeAddr = result.pledgeAddr),
            (result.revenueAddr = result.revenueAddr),
            (result.pledgeStatusName = this.types[result.pledgeStatus]),
            (result.pledgeStatus = result.pledgeStatus),
            (result.vaildStatus = result.vaildStatus),
            (result.vaildStatusName = this.vaildtypes[result.vaildStatus]),
            (result.vaildTime =
              result.vaildTime === null
                ? ""
                : helper.formatTime(result.vaildTime, 1));
          (result.pledgeNumber = result.pledgeNumber),
            (result.pledgeAmount =
              helper.getDataFormat(result.pledgeAmount, 18, 10000).toFixed(4) +
              " UTG"),
            (result.pensateAmount =
              helper.getDataFormat(result.pensateAmount, 18, 10000).toFixed(4) +
              " UTG"),
            (result.declareSpace = utils.bytesToSize(result.declareSpace || 0)),
            (result.freeSpace = utils.bytesToSize(result.freeSpace || 0)),
            (result.rentPrice =
              helper.getDataFormat(result.rentPrice, 18, 10000).toFixed(0) +
              " " +
              this.$t("storagerental.priceunit")),
            (result.rentNum = result.rentNum),
            (result.totalAmount =
              helper.getDataFormat(result.totalAmount, 18, 10000).toFixed(4) +
              " UTG"),
            (result.storageAmount =
              helper.getDataFormat(result.storageAmount, 18, 10000).toFixed(4) +
              " UTG"),
            (result.rentAmount =
              helper.getDataFormat(result.rentAmount, 18, 10000).toFixed(4) +
              " UTG"),
            (result.validNumber = result.validNumber),
            (result.succNumber = result.succNumber),
            (result.failCount = result.failCount),
            (result.instime = helper.formatTime(result.instime, 1)),
            (result.ratio = result.ratio),
            (result.bwRatio = result.bwRatio),
            (result.bwSize = result.bwSize),
            (result.succNumber = result.succNumber),
            (result.validNumber = result.validNumber),
            (result.vaildProgress = result.vaildProgress),
            (result.vaild24Status = result.vaild24Status),
            (this.storageinfo = result);
        })
        .catch((error) => {
          console.error(error);
        });
    },

    getStorageRewardStat() {
      var params = {
        address: this.address,
        types: [5, 9],
      };
      api
        .postJson("/platform/getStorageRewardStat", params)
        .then((response) => {
          let result = response.result || {};
          this.statsTotal.totalAmount = `${utils.clearZero(
            result.totalAmount
          )} UTG`;
          this.statsTotal.lockAmount = `${utils.clearZero(
            result.totalAmount - result.releaseamount || 0
          )} UTG`;
          this.statsTotal.releaseamount = `${utils.clearZero(
            result.releaseamount
          )} UTG`;
        })
        .catch((error) => {
          console.error(error);
        });
    },

    getMinerDetail() {
      let param = {
        miner_addr: this.address,
      };
      api
        .postJson("/platform/my/getminerdetail", param)
        .then((response) => {
          let item = response.result || {};
          this.nodeinfo = {
            pledgequantity: utils.clearZero(item.pledge_amount, 4) + " UTG",
            miningearnings: utils.clearZero(item.revenue_amount, 4) + " UTG",
            lock_amount: utils.clearZero(item.lock_amount, 4) + " UTG",
            lockquantity:
              utils.clearZero(item.lock_amount - item.release_amount, 4) +
              " UTG",
            releasedquantity: utils.clearZero(item.release_amount, 4) + " UTG",
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
