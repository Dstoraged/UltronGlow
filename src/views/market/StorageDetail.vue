<template>
  <div>
    <div class="container-fluid">
      <div class="card" style="margin-top: 40px">
        <div class="card-body">
          <h4 class="mt-0 header-title" style="text-align: left">
            {{ $t("market.marketdetail") }}
          </h4>
          <div class="row">
            <div class="col-md-6">
              <div class="card" style="margin-top: 5px">
                <div class="card-body" style="text-align: left">
                  <h4 class="mt-0 header-title"></h4>
                  <div class="table-responsive">
                    <table class="table table-hover mb-0 phone-table-ie">
                      <tbody>
                        <tr>
                          <td style="min-width: 125px">
                            {{ $t("market.deviceaddress") }}
                          </td>
                          <td style="min-width: 125px">
                            <span style="color: #2ebac6; text-align: left">
                              <span class="pc_show_context">
                                {{ storageinfo.deviceAddr }}</span
                              >
                              <el-popover
                                class="phone_show_context"
                                placement="bottom"
                                trigger="hover"
                                :content="storageinfo.deviceAddr"
                              >
                                <span
                                  slot="reference"
                                  class="phone_show_context"
                                >
                                  {{ getAddrFormat(storageinfo.deviceAddr, 6) }}
                                </span>
                              </el-popover>
                            </span>
                          </td>
                        </tr>

                        <tr>
                          <td>{{ $t("storageNode.adminAddress") }}</td>
                          <td>
                            <span style="color: #2ebac6; text-align: left">
                              <span class="pc_show_context">
                                {{ storageinfo.managerAddr }}</span
                              >
                              <el-popover
                                class="phone_show_context"
                                placement="bottom"
                                trigger="hover"
                                :content="storageinfo.managerAddr"
                              >
                                <span
                                  slot="reference"
                                  class="phone_show_context"
                                >
                                  {{
                                    getAddrFormat(storageinfo.managerAddr, 6)
                                  }}
                                </span>
                              </el-popover>
                            </span>
                          </td>
                        </tr>

                        <tr>
                          <td>{{ $t("storageNode.storagePool") }}</td>
                          <td>
                            <span style="color: #2ebac6; text-align: left">
                              <span class="pc_show_context">
                                {{ storageinfo.spHash }}</span
                              >
                              <el-popover
                                class="phone_show_context"
                                placement="bottom"
                                trigger="hover"
                                :content="storageinfo.spHash"
                              >
                                <span
                                  slot="reference"
                                  class="phone_show_context"
                                >
                                  {{ getAddrFormat(storageinfo.spHash, 6) }}
                                </span>
                              </el-popover>
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td>{{ $t("storageNode.JoinBlock") }}</td>
                          <td>{{ storageinfo.spHeight }}</td>
                        </tr>
                        <tr>
                          <td>{{ $t("market.totalspace") }}</td>
                          <td>{{ storageinfo.declareSpace }}</td>
                        </tr>

                        <tr>
                          <td>
                            {{ $t("market.rentedspace") }}
                          </td>
                          <td>{{ storageinfo.rentedspace }}</td>
                        </tr>
                        <tr>
                          <td>
                            {{ $t("market.availablespace") }}
                          </td>
                          <td>{{ storageinfo.freeSpace }}</td>
                        </tr>

                        <tr>
                          <td>
                            {{ $t("market.rentalprice") }}
                          </td>
                          <td>{{ storageinfo.rentPrice }}</td>
                        </tr>

                        <tr>
                          <td>{{ $t("market.totalrevenue") }}</td>
                          <td>{{ storageinfo.totalAmount }}</td>
                        </tr>
                        <tr>
                          <td>{{ $t("market.posrrevenue") }}</td>
                          <td>{{ storageinfo.storageAmount }}</td>
                        </tr>
                        <tr>
                          <td>{{ $t("market.rentalrevenue") }}</td>
                          <td>{{ storageinfo.rentAmount }}</td>
                        </tr>

                        <tr>
                          <td>{{ $t("storagereward.totalBurnt") }}</td>
                          <td>{{ statsTotal.burntamount }}</td>
                        </tr>
                        <tr>
                          <td>{{ $t("storagereward.posrBurnt") }}</td>
                          <td>{{ statsTotal.posr_burntamount }}</td>
                        </tr>
                        <tr>
                          <td>{{ $t("storagereward.rentalBurnt") }}</td>
                          <td>{{ statsTotal.post_burntamount }}</td>
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
                    <table class="table table-hover mb-0 phone-table-ie">
                      <tbody>
                        <tr>
                          <td style="min-width: 145px">
                            {{ $t("market.pledgeaddress") }}
                          </td>
                          <td style="color: #2ebac6; text-align: left">
                            <span class="pc_show_context">
                              {{ storageinfo.pledgeAddr }}
                            </span>
                            <el-popover
                              class="phone_show_context"
                              placement="bottom"
                              trigger="hover"
                              :content="storageinfo.pledgeAddr"
                            >
                              <span slot="reference" class="phone_show_context">
                                {{ getAddrFormat(storageinfo.pledgeAddr, 6) }}
                              </span>
                            </el-popover>
                          </td>
                        </tr>
                        <tr>
                          <td>{{ $t("market.revenuesaddress") }}</td>
                          <td>
                            <span style="color: #2ebac6; text-align: left">
                              <span class="pc_show_context">
                                {{ storageinfo.revenueAddr }}
                              </span>
                              <el-popover
                                class="phone_show_context"
                                placement="bottom"
                                trigger="hover"
                                :content="storageinfo.revenueAddr"
                              >
                                <span
                                  slot="reference"
                                  class="phone_show_context"
                                >
                                  {{
                                    getAddrFormat(storageinfo.revenueAddr, 6)
                                  }}
                                </span>
                              </el-popover>
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            {{ $t("storageNode.SPrate") }}
                          </td>
                          <td>
                            {{ `${storageinfo.feeRate || 0} %` }}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            {{ $t("storageNode.SNRewardRatio") }}
                          </td>
                          <td>
                            {{ `${storageinfo.entrustRate || 0} %` }}
                          </td>
                        </tr>
                        <!--<tr>
                          <td>
                            {{ $t("market.pledgeheight") }}
                          </td>
                          <td>{{ storageinfo.pledgeNumber }}</td>
                        </tr>-->
                        <tr>
                          <td>{{ $t("market.pledgeamount") }}</td>
                          <td>
                            {{
                              `${storageinfo.havAmount || "0 UTG"} / ${
                                storageinfo.pledgeAmount
                              }`
                            }}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            {{ $t("storagemining.lockquantity") }}
                          </td>
                          <td>
                            <!--{{ nodeinfo.lockquantity }} -->
                            {{ statsTotal.lockAmount }}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            {{ $t("storagemining.releasedquantity") }}
                          </td>
                          <td>
                            <!--{{ nodeinfo.releasedquantity }} -->
                            {{ statsTotal.releaseamount }}
                          </td>
                        </tr>

                        <tr>
                          <td>
                            {{ $t("market.tenantquantity") }}
                          </td>
                          <td>{{ storageinfo.rentNum }}</td>
                        </tr>

                        <tr>
                          <td>
                            {{ $t("market.pledgestatus") }}
                          </td>
                          <td>
                            <div
                              v-html="
                                pledgeStatusSpan(storageinfo.pledgeStatus)
                              "
                            ></div>
                            <!--<span v-if="storageinfo.pledgeStatus == -1" style="color: #ff0000">
                              {{ $t(storageinfo.pledgeStatusName) }}
                            </span>
                            <span v-else-if="storageinfo.pledgeStatus == 0" style="color: #00caca">
                              {{ $t(storageinfo.pledgeStatusName) }}
                            </span>
                            <span v-else-if="storageinfo.pledgeStatus == 1" style="color: #e0e0e0">
                              {{ $t(storageinfo.pledgeStatusName) }}
                            </span>
                            <span v-else-if="storageinfo.pledgeStatus == 5" style="color: #ffff93">
                              {{ $t(storageinfo.pledgeStatusName) }}
                            </span>
                            <span v-else-if="storageinfo.pledgeStatus == 6" style="color: #ffe153">
                              {{ $t(storageinfo.pledgeStatusName) }}
                            </span>
                            <span v-else style="color: #6c6c6c">
                              {{ $t(storageinfo.pledgeStatusName) }}
                            </span>-->
                          </td>
                        </tr>

                        <tr>
                          <td>
                            {{ $t("storagepledge.pledgetime") }}
                          </td>
                          <td>{{ $t(storageinfo.instime) }}</td>
                        </tr>

                        <tr>
                          <td>
                            {{ $t("market.timespace24h") }}
                          </td>
                          <td>
                            <span
                              v-if="storageinfo.vaild24Status == 1"
                              style="color: #00caca"
                            >
                              {{ $t("storagepledge.vaild24Status1") }}
                            </span>
                            <span
                              v-else-if="storageinfo.vaild24Status == 0"
                              style="color: #ff0000"
                            >
                              {{ $t("storagepledge.vaild24Status0") }}
                            </span>
                            <span v-else></span>
                          </td>
                        </tr>

                        <tr>
                          <td>{{ $t("market.storagefactor") }}</td>
                          <td>{{ $t(storageinfo.ratio) }}</td>
                        </tr>
                        <tr v-if="false">
                          <td>{{ $t("market.bandwidthfactor") }}</td>
                          <td>{{ storageinfo.bwRatio }}</td>
                        </tr>
                        <tr>
                          <td>{{ $t("market.rewardRatio") }}</td>
                          <td>{{ storageinfo.rewardRatio }}</td>
                        </tr>
                        <tr>
                          <td>{{ $t("market.bandwidth") }}</td>
                          <td>{{ storageinfo.bwSize }} Mbps</td>
                        </tr>

                        <!--
                        <tr v-if="storageinfo.vaildStatus == 0">
                          <td style="width: 120px">{{ $t("market.vaildTime") }}</td>
                          <td>{{ $t(storageinfo.vaildTime) }}</td>
                        </tr>
                        -->
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
          <div class="col-md-12" style="margin: 0px; padding: 0px">
            <ul
              class="nav nav-pills nav-justified phone_nav_overflow-x"
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
                  href="#awards-detail"
                  role="tab"
                  aria-selected="true"
                  @click="handleNavLink($event)"
                >
                  <span class="d-none d-md-block">
                    {{ $t("rewards.RewardDetails") }}
                  </span>
                  <span class="d-block d-md-none">
                    {{ $t("rewards.RewardDetails") }}
                  </span>
                </a>
              </li>
              <li class="nav-item waves-effect waves-light">
                <a
                  class="nav-link"
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

              <li class="nav-item waves-effect waves-light" v-if="true">
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

              <li class="nav-item waves-effect waves-light">
                <a
                  class="nav-link"
                  data-toggle="tab"
                  href="#lock-rewardfreed"
                  role="tab"
                  @click="handleNavLink($event)"
                >
                  <span class="d-none d-md-block">{{
                    $t("market.storagerelease")
                  }}</span>
                  <span class="d-block d-md-none">{{
                    $t("market.storagerelease")
                  }}</span>
                </a>
              </li>

              <li class="nav-item waves-effect waves-light">
                <a
                  class="nav-link"
                  data-toggle="tab"
                  href="#lock-destroy"
                  role="tab"
                  @click="handleNavLink($event)"
                >
                  <span class="d-none d-md-block">{{
                    $t("market.burntdetail")
                  }}</span>
                  <span class="d-block d-md-none">{{
                    $t("market.burntdetail")
                  }}</span>
                </a>
              </li>

              <li class="nav-item waves-effect waves-light" v-if="false">
                <a
                  class="nav-link"
                  data-toggle="tab"
                  href="#vaild-status"
                  role="tab"
                  @click="handleNavLink($event)"
                >
                  <span class="d-none d-md-block">
                    {{ $t("home.tran") }}
                  </span>
                  <span class="d-block d-md-none">
                    {{ $t("home.tran") }}
                  </span>
                </a>
              </li>

              <li class="nav-item waves-effect waves-light">
                <a
                  class="nav-link"
                  data-toggle="tab"
                  href="#Proof-Trans"
                  role="tab"
                  @click="handleNavLink($event)"
                >
                  <span class="d-none d-md-block">
                    {{ $t("market.posrprooftran") }}
                  </span>
                  <span class="d-block d-md-none">
                    {{ $t("market.posrprooftran") }}
                  </span>
                </a>
              </li>

              <li class="nav-item waves-effect waves-light" v-if="true">
                <a
                  class="nav-link"
                  data-toggle="tab"
                  href="#lock-rentalrecord"
                  role="tab"
                  @click="handleNavLink($event)"
                >
                  <span class="d-none d-md-block">{{
                    $t("market.rentalrecord")
                  }}</span>
                  <span class="d-block d-md-none">{{
                    $t("market.rentalrecord")
                  }}</span>
                </a>
              </li>

              <li class="nav-item waves-effect waves-light" v-if="true">
                <a
                  class="nav-link"
                  data-toggle="tab"
                  href="#lock-rentalrequest"
                  role="tab"
                  @click="handleNavLink($event)"
                >
                  <span class="d-none d-md-block">{{
                    $t("storagerental.storagerequest")
                  }}</span>
                  <span class="d-block d-md-none">{{
                    $t("storagerental.storagerequest")
                  }}</span>
                </a>
              </li>

              <li class="nav-item waves-effect waves-light">
                <a
                  class="nav-link"
                  data-toggle="tab"
                  href="#pledge-record"
                  role="tab"
                  @click="handleNavLink($event)"
                >
                  <span class="d-none d-md-block">{{ $t("storageNode.pledgeRecord") }}</span>
                </a>
              </li>
              <li class="nav-item waves-effect waves-light">
                <a
                  class="nav-link"
                  data-toggle="tab"
                  href="#pledge-rewards"
                  role="tab"
                  @click="handleNavLink($event)"
                >
                  <span class="d-none d-md-block">{{ $t("storageNode.pledgeReward") }}</span>
                </a>
              </li>
            </ul>
          </div>
          <!-- Tab panes -->
          <div
            class="tab-content"
            style="border-top: solid 1px #f0f0f0; margin-top: 20px"
          >
           <div class="tab-pane active" id="awards-detail" role="tabpanel">
              <awardsDetail
                :p-params="{ nodeAddress: address, nodeType: 'SN' }"
              />
            </div>
            <div class="tab-pane" id="storage-rewards" role="tabpanel">
              <Storagespacerewards
                table-id="Storagespacerewards_node"
                :type="9"
                :revenueAddr="address"
                :devflag="1"
              />
            </div>
            <div
              class="tab-pane"
              id="lock-rentalrewards"
              role="tabpanel"
              v-if="true"
            >
              <RentalReward :address="address" table-id="RentalReward_node" />
            </div>
            <div class="tab-pane" id="lock-rewardfreed" role="tabpanel">
              <RewardRelease :address="address" table-id="RewardRelease_node" />
            </div>

            <div class="tab-pane" id="lock-destroy" role="tabpanel">
              <DestroyList :address="address" table-id="DestroyList_auto" />
            </div>

            <div
              class="tab-pane"
              id="vaild-status"
              role="tabpanel"
              v-if="false"
            >
              <TransactionsList
                :accAddr="address"
                v-if="isLabelFlag"
                table-id="TransactionsList_node"
              />
            </div>
            <div class="tab-pane" id="Proof-Trans" role="tabpanel">
              <PosrProofTrans
                :accAddr="address"
                table-id="PosrProofTrans_node"
              />
            </div>

            <div
              class="tab-pane"
              id="lock-rentalrecord"
              role="tabpanel"
              v-if="true"
            >
              <RentalRecord
                :address="address"
                table-id="RentalRecord_node"
                :rdecimal="rdecimal"
                :rent_decimal="rent_decimal"
              />
            </div>

            <div
              class="tab-pane"
              id="lock-rentalrequest"
              role="tabpanel"
              v-if="true"
            >
              <StorageRequest
                :address="address"
                table-id="StorageRequest_node"
                :rdecimal="rdecimal"
                :rent_decimal="rent_decimal"
              />
            </div>
            <div class="tab-pane" id="pledge-record" role="tabpanel">
              <pledgeRecord :address="address" table-id="StorageRequest_node" />
            </div>
             <div class="tab-pane" id="pledge-rewards" role="tabpanel">
            <pledgeRewards
              :address="address"
              table-id="StorageRequest_node"
            />
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
import RentalRecord from "./components/RentalRecord.vue";
import StorageBock from "./components/StorageBock.vue";
import Storagespacerewards from "./storagereward/Storagespacerewards.vue";
import TransactionsList from "@/views/accounts/components/TransactionsList.vue";
import PosrProofTrans from "./storagereward/PosrProofRecord.vue";
import RentalReward from "./components/RentalReward.vue";
import StorageRequest from "./components/StorageRequest.vue";
import RewardRelease from "./components/RewardRelease.vue";
import DestroyList from "./components/DestroyList.vue";
import pledgeRecord from "./components/records.vue";
import pledgeRewards from "./components/pledgeRewards.vue";
import awardsDetail from "@/views/locks/awards.vue";

export default {
  name: "StorageDetail",
  components: {
    awardsDetail,
    RentalRecord,
    Storagespacerewards,
    StorageBock,
    TransactionsList,
    PosrProofTrans,
    RentalReward,
    StorageRequest,
    RewardRelease,
    DestroyList,
    pledgeRecord,
    pledgeRewards,
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
      storageid: "-1",
      storageinfo: {
        deviceAddr: "",
        pledgeAddr: "",
        revenueAddr: "",
        pledgeStatusName: "",
        pledgeStatus: "",
        vaildStatus: "",
        vaildStatusName: "",
        vaildTime: "",
        pledgeNumber: "",
        pledgeAmount: "0 UTG",
        pensateAmount: "0 UTG",
        rentedspace: "",
        declareSpace: "",
        freeSpace: "",
        rentPrice: "",
        rentNum: "",
        totalAmount: "0 UTG",
        storageAmount: "0 UTG",
        rentAmount: "0 UTG",
        validNumber: "",
        succNumber: "",
        failCount: "",
        instime: "",
        ratio: "",
        bwRatio: "",
        bwSize: "",
        rewardRatio: "",
        succNumber: "",
        validNumber: "",
        vaildProgress: "",
        vaild24Status: "",
      },
      nodeinfo: {},
      types,
      vaildtypes,
      isLabelFlag: false,
      statsTotal: {
        totalAmount: "0 UTG",
        lockAmount: "0 UTG",
        releaseamount: "0 UTG",

        block_totalAmount: "0 UTG",
        block_lockAmount: "0 UTG",
        block_releaseamount: "0 UTG",
        storage_totalAmount: "0 UTG",
        storage_lockAmount: "0 UTG",
        storage_releaseamount: "0 UTG",
        rental_totalAmount: "0 UTG",
        rental_lockAmount: "0 UTG",
        rental_releaseamount: "0 UTG",

        burntamount: "0 UTG",
        posr_burntamount: "0 UTG",
        post_burntamount: "0 UTG",
      },
      rent_decimal: 6,
      rdecimal: 1000000,
    };
  },
  created() {
    // this.address = this.$route.params.id;
    let idL = this.$route.params.id;

    console.log("idL=" + idL);
    let ids = idL.split("_");
    if ((ids.length = 2)) {
      this.address = ids[0];
      this.storageid = ids[1];
    } else {
      this.address = ids;
    }
    this.loadData();
    // this.getStorageInfo();
    // this.getStorageRewardStat();
    //this.getMinerDetail();
    sessionStorage.setItem("MarketDetail", true);
  },

  methods: {
    pledgeStatusSpan(val) {
      return utils.getPledgeStatus(val).span;
    },
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
      if (this.storageid !== "-1") {
        param.id = this.storageid;
      }
      api
        .post("/platform/getStorageSpaceInfo", param)
        .then((response) => {
          let result = response.result || {};
          this.storageinfo.deviceAddr = result.deviceAddr;
          this.storageinfo.pledgeAddr = result.pledgeAddr;
          this.storageinfo.revenueAddr = result.revenueAddr;
          this.storageinfo.pledgeStatusName = this.types[result.pledgeStatus];
          this.storageinfo.pledgeStatus = result.pledgeStatus;
          this.storageinfo.vaildStatus = result.vaildStatus;
          this.storageinfo.vaildStatusName =
            this.vaildtypes[result.vaildStatus];
          this.storageinfo.vaildTime =
            result.vaildTime === null
              ? ""
              : helper.formatTime(result.vaildTime, 1);
          this.storageinfo.pledgeNumber = result.pledgeNumber;
          this.storageinfo.pledgeAmount =
            utils.clearZero(result.pledgeAmount) + " UTG";
          this.storageinfo.havAmount =
            utils.clearZero(result.havAmount) + " UTG";
          this.storageinfo.pensateAmount =
            utils.clearZero(result.pensateAmount) + " UTG";
          this.storageinfo.rentedspace = utils.bytesToSize(
            result.declareSpace - result.freeSpace
          );
          this.storageinfo.declareSpace = utils.bytesToSize(
            result.declareSpace || 0
          );

          //this.storageinfo.freeSpace = utils.bytesToSize(result.freeSpace || 0);
          if (result.freeSpace >= 1024 * 1024 * 1024 * 5)
            this.storageinfo.freeSpace = utils.bytesToSize(
              result.freeSpace - 1024 * 1024 * 1024 * 5 || 0
            );
          else this.storageinfo.freeSpace = utils.bytesToSize(0);

          this.storageinfo.rentPrice =
            utils.CutZero(
              helper
                .getDataFormatDecimal(
                  result.rentPrice,
                  18,
                  this.rdecimal,
                  this.rent_decimal
                )
                .toFixed(this.rent_decimal || 4)
            ) +
            " " +
            this.$t("storagerental.priceunit");
          this.storageinfo.rentNum = result.rentNum;
          this.storageinfo.totalAmount =
            utils.clearZero(result.totalAmount) + " UTG";
          this.storageinfo.storageAmount =
            utils.clearZero(result.storageAmount) + " UTG";
          this.storageinfo.rentAmount =
            utils.clearZero(result.rentAmount) + " UTG";
          this.storageinfo.validNumber = result.validNumber;
          this.storageinfo.succNumber = result.succNumber;
          this.storageinfo.failCount = result.failCount;
          this.storageinfo.instime = helper.formatTime(result.instime, 1);
          this.storageinfo.ratio = result.ratio;
          this.storageinfo.bwRatio = result.bwRatio;
          this.storageinfo.bwSize = result.bwSize;
          this.storageinfo.rewardRatio = result.rewardRatio;
          this.storageinfo.succNumber = result.succNumber;
          this.storageinfo.validNumber = result.validNumber;
          this.storageinfo.vaildProgress = result.vaildProgress;
          this.storageinfo.vaild24Status = result.vaild24Status;

          this.storageinfo.managerAddr = result.managerAddr;
          this.storageinfo.entrustRate = result.entrustRate;
          this.storageinfo.spHash = result.spHash;
          this.storageinfo.spHeight = result.spHeight;
          this.storageinfo.managerAmount = result.managerAmount;
          this.storageinfo.managerHeight = result.managerHeight;
          this.storageinfo.feeRate = result.feeRate;

          this.statsTotal.releaseamount = `${utils.clearZero(
            result.storageRelease + result.rentRelease
          )} UTG`;
          this.statsTotal.lockAmount = `${utils.clearZero(
            result.totalAmount - (result.storageRelease + result.rentRelease)
          )} UTG`;

          this.statsTotal.burntamount = `${utils.clearZero(
            result.storageBurnt + result.rentBurnt
          )} UTG`;

          this.statsTotal.rental_totalAmount = `${utils.clearZero(
            result.rentAmount
          )} UTG`;
          this.statsTotal.rental_releaseamount = `${utils.clearZero(
            result.rentRelease
          )} UTG`;
          this.statsTotal.rental_lockAmount = `${utils.clearZero(
            result.rentAmount - result.rentRelease
          )} UTG`;
          this.statsTotal.post_burntamount = `${utils.clearZero(
            result.rentBurnt
          )} UTG`;

          this.statsTotal.storage_totalAmount = `${utils.clearZero(
            result.storageAmount
          )} UTG`;
          this.statsTotal.storage_releaseamount = `${utils.clearZero(
            result.storageRelease
          )} UTG`;
          this.statsTotal.storage_lockAmount = `${utils.clearZero(
            result.storageAmount - result.storageRelease
          )} UTG`;
          this.statsTotal.posr_burntamount = `${utils.clearZero(
            result.storageBurnt
          )} UTG`;
        })
        .catch((error) => {
          console.error(error);
        });
    },

    getStorageRewardStat() {
      this.statsTotal.block_totalAmount = "0 UTG";
      this.statsTotal.block_lockAmount = "0 UTG";
      this.statsTotal.block_releaseamount = "0 UTG";
      this.statsTotal.storage_totalAmount = "0 UTG";
      this.statsTotal.storage_lockAmount = "0 UTG";
      this.statsTotal.storage_releaseamount = "0 UTG";
      this.statsTotal.rental_totalAmount = "0 UTG";
      this.statsTotal.rental_lockAmount = "0 UTG";
      this.statsTotal.rental_releaseamount = "0 UTG";
      this.statsTotal.posr_burntamount = "0 UTG";
      this.statsTotal.post_burntamount = "0 UTG";
      this.statsTotal.burntamount = "0 UTG";

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
          this.statsTotal.releaseamount = `${utils.clearZero(
            result.releaseamount
          )} UTG`;
          this.statsTotal.lockAmount = `${utils.clearZero(
            result.totalAmount - result.releaseamount
          )} UTG`;

          this.statsTotal.burntamount = `${utils.clearZero(
            result.burntamount
          )} UTG`;

          let typelist = result.typelist;
          if (typelist != null) {
            typelist.forEach((item, index) => {
              switch (item.type) {
                case 1:
                  this.statsTotal.block_totalAmount = `${utils.clearZero(
                    item.totalAmount
                  )} UTG`;
                  this.statsTotal.block_releaseamount = `${utils.clearZero(
                    item.releaseamount
                  )} UTG`;
                  this.statsTotal.block_lockAmount = `${utils.clearZero(
                    item.totalAmount - item.releaseamount
                  )} UTG`;
                  break;
                case 5:
                  this.statsTotal.rental_totalAmount = `${utils.clearZero(
                    item.totalAmount
                  )} UTG`;
                  this.statsTotal.rental_releaseamount = `${utils.clearZero(
                    item.releaseamount
                  )} UTG`;
                  this.statsTotal.rental_lockAmount = `${utils.clearZero(
                    item.totalAmount - item.releaseamount
                  )} UTG`;
                  this.statsTotal.post_burntamount = `${utils.clearZero(
                    item.burntamount
                  )} UTG`;
                  break;
                case 9:
                  this.statsTotal.storage_totalAmount = `${utils.clearZero(
                    item.totalAmount
                  )} UTG`;
                  this.statsTotal.storage_releaseamount = `${utils.clearZero(
                    item.releaseamount
                  )} UTG`;
                  this.statsTotal.storage_lockAmount = `${utils.clearZero(
                    item.totalAmount - item.releaseamount
                  )} UTG`;
                  this.statsTotal.posr_burntamount = `${utils.clearZero(
                    item.burntamount
                  )} UTG`;
                  break;
              }
            });
          }
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

    loadData() {
      api
        .postJson("/platform/getStorageBasicSet", {})
        .then((response) => {
          let result = response.result;
          this.rent_decimal = Number(result["10"] || 4);
          this.switchDecimal(this.rent_decimal);
          if (!this.loadSetOk) {
            this.loadSetOk = true;
          }

          this.getStorageInfo();
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
  },
};
</script>
<style lang="scss" scoped>
.cursor {
  cursor: pointer;
}
@media (max-width: 768px) {
.phone_nav_overflow-x {
  width: 100%;
  overflow-x: auto;
  display: grid;
  grid-template-columns: repeat(9, minmax(200px, auto));
  text-align: center;
}
}
</style>
