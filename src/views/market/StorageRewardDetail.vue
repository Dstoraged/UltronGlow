<template>
  <div>
    <div class="container-fluid">
      <div class="card" style="margin-top: 40px">
        <div class="card-body">
          <h4 class="mt-0 header-title" style="text-align: left">
            {{ $t("storagereward.rewardtitle") }}
          </h4>
          <div class="row">
            <div class="col-md-7">
              <div class="card viewcard" style="margin-top: 5px">
                <div class="card-body viewcardbody" style="text-align: left">
                  <VTable :table-heard="tableLeftHeard" :datas="nodeinfo" title-width="110px" id="tableLeftHeardid">
                  </VTable>
                </div>
              </div>
            </div>
            <div class="col-md-5" v-if="true">
              <div class="card viewcard" style="margin-top: 5px">
                <div class="card-body viewcardbody" style="text-align: left">
                  <VTable :table-heard="tableRightHeard" :datas="accInfo" title-width="110px" id="tableRightHeardid">
                  </VTable>
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
          <div class="col-md-10" style="margin: 0px; padding: 0px">
            <ul class="nav nav-pills nav-justified phone_nav_overflow-x" role="tablist" style="
                font-size: 11pt;
                font-weight: bold;
                margin: 0px;
                padding: 0px;
              ">
              <li class="nav-item waves-effect waves-light">
                <a class="nav-link active" data-toggle="tab" href="#storage-spaces" role="tab" @click="handleNavLink($event)">
                  <span class="d-none d-md-block">{{
                      $t("market.pledgetitle")
                  }}</span>
                  <span class="d-block d-md-none">{{
                      $t("market.pledgetitle")
                  }}</span>
                </a>
              </li>
              <li class="nav-item waves-effect waves-light">
                <a class="nav-link " data-toggle="tab" href="#storage-rewards" role="tab"
                  @click="handleNavLink($event)">
                  <span class="d-none d-md-block">
                    {{ $t("storagereward.Storagespacerewards") }}
                  </span>
                  <span class="d-block d-md-none">
                    {{ $t("storagereward.Storagespacerewards") }}
                  </span>
                </a>
              </li>

              <li class="nav-item waves-effect waves-light">
                <a class="nav-link" data-toggle="tab" href="#lease-reward" role="tab" @click="handleNavLink($event)">
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
                  href="#Posr_Burnt"
                  role="tab"
                  @click="handleNavLink($event)"
                >
                  <span class="d-none d-md-block">
                    {{ $t("storagereward.posrburntdetails") }}
                  </span>
                  <span class="d-block d-md-none">
                    {{ $t("storagereward.posrburntdetails") }}
                  </span>
                </a>
              </li>
              <li class="nav-item waves-effect waves-light">
                <a
                  class="nav-link"
                  data-toggle="tab"
                  href="#Pots_Burnt"
                  role="tab"
                  @click="handleNavLink($event)"
                >
                  <span class="d-none d-md-block">
                    {{ $t("storagereward.potsburntdetails") }}
                  </span>
                  <span class="d-block d-md-none">
                    {{ $t("storagereward.potsburntdetails") }}
                  </span>
                </a>
              </li>
            


              <!--
              <li class="nav-item waves-effect waves-light">
                <a class="nav-link" data-toggle="tab" href="#lock-nodeaward" role="tab" @click="handleNavLink($event)">
                  <span class="d-none d-md-block">{{ $t("home.tran") }}</span>
                  <span class="d-block d-md-none">{{ $t("home.tran") }}</span>
                </a>
              </li>
              -->
            </ul>
          </div>
          <!-- Tab panes -->
          <div class="tab-content" style="border-top: solid 1px #f0f0f0; margin-top: 20px">
            <div class="tab-pane active" id="storage-spaces" role="tabpanel">
              <StorageSpace :revenueAddr="revenue_addr" :devflag="0" :status="0" />
            </div>

            <div class="tab-pane" id="storage-rewards" role="tabpanel">
              <!--<Storagespacerewards :type="12" :revenueAddr="revenue_addr" :devflag="0"/> -->
              <Storagespacerewards :type="9" :revenueAddr="revenue_addr" :devflag=0 />
            </div>

            <div class="tab-pane" id="lease-reward" role="tabpanel">
              <!-- <Leasereward :type="13" :revenueAddr="revenue_addr" :devflag="0"/>  -->
              <PoTSRewards :type="5" :revenueAddr="revenue_addr" :devflag="0" />
            </div>

            
            <div class="tab-pane" id="Posr_Burnt" role="tabpanel">
              <PoSRDestroy :type="9" :revenueAddr="revenue_addr" :devflag="0"/>
            </div>
            <div class="tab-pane" id="Pots_Burnt" role="tabpanel">
               <PoTSDestroy :type="5" :revenueAddr="revenue_addr" :devflag="0"/>
            </div>
           
            <!--
            <div class="tab-pane" id="lock-nodeaward" role="tabpanel">
              <TransactionsList :accAddr="revenue_addr" :tranType="0" />
            </div>
             -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import BlockRewards from "./storagereward/BlockRewards.vue";
import Storagespacerewards from "./storagereward/Storagespacerewards.vue";
import Leasereward from "./storagereward/Leasereward.vue";
import Pledgelock from "./storagereward/Pledgelock.vue";
import Lockrelease from "./storagereward/Lockrelease.vue";
import StorageSpace from "./storagereward/StorageSpace.vue";
import PoTSRewards from "./storagereward/PoTSRewards.vue";

import PoSRDestroy from "./storagereward/PoSRDestroy.vue";
import PoTSDestroy from "./storagereward/PoTSDestroy.vue";

import TransactionsList from "@/views/accounts/components/TransactionsList.vue";
import utils from "@/utils/utils";
import * as api from "@/api/api";
import * as helper from "@/utils/helper";
import VTable from "@/components/modules/VTable.vue";
export default {
  name: "NodeDetail",
  components: {
    BlockRewards,
    Storagespacerewards,
    Leasereward,
    Pledgelock,
    Lockrelease,
    StorageSpace,
    TransactionsList,
    PoTSRewards,
    PoSRDestroy,
    PoTSDestroy,
    VTable,
  },
  data() {
    let _this_ = this;
    return {
      revenue_addr: "",
      nodeinfo: {
        revenue_addr: "",
        totalamount: "0 UTG",
        releaseamount: "0 UTG",
        lockamount: "0 UTG",
        ratio: "-",
        capacity: "-",
        declareSpace: "-",
        totalburnt: "0 UTG",

        posramount: "0 UTG",
        posrrelease: "0 UTG",
        posrlock: "0 UTG",
        posrburnt: "0 UTG",

        potsamount: "0 UTG",
        potsrelease: "0 UTG",
        potslock: "0 UTG",
        potsburnt: "0 UTG",
      },

      accInfo: {
        balance: "",
        blockNumber: 0,
        transactionCount: 0,
      },

      tableLeftHeard: [
        {
          title: "storagereward.revenuesaddress",
          name: "revenue_addr",
          popover: true,
          format: true,
          phoneFormat: true,
        },
        { title: "storagereward.reward", name: "totalamount" },
        { title: "storagereward.totalAmount", name: "lockamount" },
        { title: "storagereward.leftAmount", name: "releaseamount" },

        { title: "storagereward.posrreward", name: "posramount" },
        { title: "storagereward.rentalreward", name: "potsamount" },

        { title: "storagereward.totalBurnt", name: "totalburnt" },

        { title: "storagereward.posrBurnt", name: "posrburnt" },
        { title: "storagereward.rentalBurnt", name: "potsburnt" },

        { title: "storagereward.totalspace", name: "declareSpace" },
        { title: "storagereward.storagefactor", name: "ratio" },
      ],

      tableRightHeard: [
        {
          title: "accounts.tran",
          name: "transactionCount",
          valMap(val) {
            return `${_this_.$t("accounts.totalTran", [val])}`;
          },
        },
        {
          title: "accounts.balance",
          name: "balance",
          valMap(val) {
            return `${val} UTG`;
          },
        },
        {
          title: "accounts.block",
          name: "blockNumber",
          valMap(val) {
            return `${_this_.$t("accounts.lastUpdateBlock")} ${val}`;
          },
        },
      ],
    };
  },
  created() {
    this.revenue_addr = this.$route.params.id;
    this.loadDatas();
    this.getAccountsInfo();
    sessionStorage.setItem("RewardDetail", true);
  },
  methods: {
    handleNavLink(event) {
      $(".nav-link").removeClass("active");
      console.log(event.target.tagName);
      event.currentTarget.className = "nav-link active";
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
      let paramt = {
        revenue_addr: this.revenue_addr,      
      };
      api
        .post("/platform/getStorageRevenueInfo", paramt)
        .then((response) => {
          let datas = response.result || {};
          (this.nodeinfo.ratio = datas.ratio),
            (this.nodeinfo.capacity = utils.bytesToSize(datas.capacity)),
            (this.nodeinfo.declareSpace = utils.bytesToSize(
              datas.declareSpace
            )),
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
          this.nodeinfo.totalburnt = `${utils.clearZero(
            datas.burntamount
          )} UTG`;
          this.nodeinfo.revenue_addr = this.revenue_addr;

          (this.nodeinfo.posramount = `${utils.clearZero(
            datas.storage_amount
          )} UTG`);
          this.nodeinfo.posrrelease = `${utils.clearZero(
            datas.storage_release
          )} UTG`;
          this.nodeinfo.posrlock = `${utils.clearZero(
            (datas.storage_amount || 0) - (datas.storage_release || 0)
          )} UTG`;
          this.nodeinfo.posrburnt = `${utils.clearZero(
            datas.storage_burnt
          )} UTG`;

          (this.nodeinfo.potsamount = `${utils.clearZero(
            datas.rent_amount
          )} UTG`);
          this.nodeinfo.potsrelease = `${utils.clearZero(
            datas.rent_release
          )} UTG`;
          this.nodeinfo.potslock = `${utils.clearZero(
            (datas.rent_amount || 0) - (datas.rent_release || 0)
          )} UTG`;
          this.nodeinfo.potsburnt = `${utils.clearZero(
            datas.rent_burnt
          )} UTG`;

        })
        .catch((err) => {
          console.log(err);
        });



      /*
      let paramt = {
        revenue_addr: this.revenue_addr,
        types: "5, 9",
      };
      api
        .post("/platform/getStorageRevenueInfo", paramt)
        .then((response) => {
          let datas = response.result || {};
          (this.nodeinfo.ratio = datas.ratio),
            (this.nodeinfo.capacity = utils.bytesToSize(datas.capacity)),
            (this.nodeinfo.declareSpace = utils.bytesToSize(
              datas.declareSpace
            )),
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
          this.nodeinfo.totalburnt = `${utils.clearZero(
            datas.burntamount
          )} UTG`;
          this.nodeinfo.revenue_addr = this.revenue_addr;
        })
        .catch((err) => {
          console.log(err);
        });


      let paramst = {
        revenue_addr: this.revenue_addr,
        type: 9,
      };
      api
        .post("/platform/getStorageRevenueInfo", paramst)
        .then((response) => {
          let datas = response.result || {};
          (this.nodeinfo.posramount = `${utils.clearZero(
            datas.totalamount
          )} UTG`);
          this.nodeinfo.posrrelease = `${utils.clearZero(
            datas.releaseamount
          )} UTG`;
          this.nodeinfo.posrlock = `${utils.clearZero(
            (datas.totalamount || 0) - (datas.releaseamount || 0)
          )} UTG`;
          this.nodeinfo.posrburnt = `${utils.clearZero(
            datas.burntamount
          )} UTG`;

        })
        .catch((err) => {
          console.log(err);
        });


      let paramrent = {
        revenue_addr: this.revenue_addr,
        type: 5,
      };
      api
        .post("/platform/getStorageRevenueInfo", paramrent)
        .then((response) => {
          let datas = response.result || {};
          (this.nodeinfo.potsamount = `${utils.clearZero(
            datas.totalamount
          )} UTG`);
          this.nodeinfo.potsrelease = `${utils.clearZero(
            datas.releaseamount
          )} UTG`;
          this.nodeinfo.potslock = `${utils.clearZero(
            (datas.totalamount || 0) - (datas.releaseamount || 0)
          )} UTG`;
          this.nodeinfo.potsburnt = `${utils.clearZero(
            datas.burntamount
          )} UTG`;

        })
        .catch((err) => {
          console.log(err);
        });
        */
    },
  },
};
</script>
<style lang="scss" scoped>
.cursor {
  cursor: pointer;
}

.phone_nav_overflow-x {
  width: 100%;
  overflow-x: auto;
  display: grid;
  grid-template-columns: repeat(5, minmax(200px, auto));
  text-align: center;
}

@media (min-width: 751px) {
  .viewheader {
    text-align: left;
  }

  .viewcard {
    margin-top: 5px;
  }

  .viewcardbody {
    text-align: left;
  }
}

@media (max-width: 750px) {
  .viewheader {
    text-align: left;
    border-bottom: #dddddd solid 2px;
    line-height: 30px;
    margin-bottom: 20px;
  }

  .viewcard {
    margin-top: 5px;
    border: none;
    box-shadow: none;
  }

  .viewcardbody {
    text-align: left;
    margin: 0px;
    padding: 0px;
  }
}
</style>
