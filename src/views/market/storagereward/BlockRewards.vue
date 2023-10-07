<template>
  <div>
    <h4 class="mt-0 header-title" style="width: 100%; text-align: left">
      <p class="sub-title" style="width: 100%; text-align: left">
        {{ $t("storagereward.totalnumber", [totalb]) }}
      </p>
    </h4>
    <div class="table-responsive" style="min-height: 200px">
      <table class="table table-hover mb-0">
        <thead>
          <tr style="background-color: #f8fafd">
            <th scope="col" style="min-width: 80px" type="expand">
              {{ $t("ftable.order") }}
            </th>
            <th v-if="devflag === 0" scope="col" style="min-width: 150px">
              {{ $t("storagereward.deviceaddress") }}
            </th>
            <th v-if="devflag === 1" scope="col" style="min-width: 150px">
              {{ $t("storagereward.revenuesaddress") }}
            </th>
            <th scope="col" style="min-width: 120px">
              {{ $t("storagereward.blockNumber") }}
            </th>
            <th scope="col" style="min-width: 120px">
              {{ $t("storagereward.reward") }}
            </th>
            <th scope="col" style="min-width: 120px">
              {{ $t("storagereward.totalAmount") }}
            </th>
            <th scope="col" style="min-width: 120px">
              {{ $t("storagereward.leftAmount") }}
            </th>
            <th scope="col" style="min-width: 120px">
              {{ $t("storagereward.unlocktime") }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in BlockRewardsList" :key="index">
            <td>{{ item.ranking }}</td>
            <td v-if="devflag === 0">
              <span style="color: #2ebac6">{{ item.address }}</span>
            </td>
            <td v-if="devflag === 1">
              <span style="color: #2ebac6">{{ item.revenue_address }}</span>
            </td>
            <td>{{ item.blockNumber }}</td>
            <td>{{ item.totalAmount }}</td>
            <td>{{ item.LockAmount }}</td>
            <td>{{ item.leftAmount }}</td>
            <td>
              <span>{{ item.lockingTime }} {{ $t("lock.day") }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="row" style="margin-top: 20px">
      <div
        class="col-md-5 col-sm-12"
        style="font-size: 9pt; margin: 0px; padding-left: 10px"
      >
        <ul class="pagination" style="justify-content: left; font-size: 9pt">
          <li class="page-item">
            <a
              class
              style="
                padding: 10px;
                border: none;
                border-radius: 6px;
                display: block;
              "
              >{{ $t("pagination.show") }}</a
            >
          </li>
          <li class="page-item">
            <div class="col-sm-12" style="margin: 0px; padding: 0px">
              <select
                class="custom-select"
                v-model="pageSizeb"
                style="font-size: 12px"
                @change="handleSizeChangeb()"
                id="selectPageb"
              >
                <option selected="selected" value="10">10</option>
                <option value="15">15</option>
                <option value="30">30</option>
                <option value="50">50</option>
              </select>
            </div>
          </li>
          <li class="page-item">
            <a
              class
              style="
                padding: 10px;
                border: none;
                border-radius: 6px;
                display: block;
              "
              >{{ $t("pagination.redord") }}</a
            >
          </li>
        </ul>
      </div>
      <div
        class="col-md-7 col-sm-12 justify-content-end"
        style="font-size: 9pt; margin: 0px; padding-left: 10px"
      >
        <ul class="pagination fyright">
          <li class="page-item">
            <a
              class="page-link"
              href="javascript:;"
              style="
                padding: 10px;
                margin: 4px;
                border: none;
                background-color: #eaf8f9;
                border-radius: 6px;
                color: #41c0cb;
                font-size: 9pt;
              "
              @click="getBlockRewardsList(1)"
              >{{ $t("pagination.first") }}</a
            >
          </li>
          <li class="page-item">
            <a
              class="page-link"
              href="javascript:;"
              style="
                padding: 10px;
                margin: 4px;
                border: none;
                background-color: #eaf8f9;
                border-radius: 6px;
                color: #41c0cb;
              "
              @click="getBlockRewardsList(pageb - 1)"
            >
              <i class="mdi mdi-chevron-left"></i>
            </a>
          </li>
          <li class="page-item">
            <a
              class="page-link"
              href="javascript:;"
              style="
                padding: 10px;
                margin: 4px;
                border: none;
                background-color: #eaf8f9;
                border-radius: 6px;
                color: #757575;
              "
            >
              <span>
                {{
                  $t("pagination.pages", {
                    curPage: pageb,
                    totalPage: totalPageb,
                  })
                }}
              </span>
            </a>
          </li>
          <li class="page-item">
            <a
              class="page-link"
              href="javascript:;"
              style="
                padding: 10px;
                margin: 4px;
                border: none;
                background-color: #eaf8f9;
                border-radius: 6px;
                color: #41c0cb;
              "
              @click="getBlockRewardsList(pageb + 1)"
            >
              <i class="mdi mdi-chevron-right"></i>
            </a>
          </li>
          <li class="page-item">
            <a
              class="page-link"
              href="javascript:;"
              style="
                padding: 10px;
                margin: 4px;
                border: none;
                background-color: #eaf8f9;
                border-radius: 6px;
                color: #41c0cb;
              "
              @click="getBlockRewardsList(totalPageb)"
              >{{ $t("pagination.last") }}</a
            >
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import { Message } from "element-ui";
import * as api from "@/api/api";
import * as helper from "@/utils/helper";
import utils from "@/utils/utils";
import { showLoading, hideLoading } from "@/utils/loading";
export default {
  name: "BlockRewards",
  components: {},
  props: {
    revenueAddr: {
      type: [String],
      default: "",
    },
    type: {
      type: Number,
      default: 0,
    },
    devflag: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      pageSizeb: 10,
      pageb: 1,
      totalb: 0,
      totalPageb: 0,
      BlockRewardsList: [],
      loadText: this.$t("comm.clickLoad"),
      searchInput: null,
    };
  },

  created() {
    if (sessionStorage.getItem("detail")) {
      if (typeof sessionStorage.getItem("currentPageb") !== "undefined") {
        this.pageb = Number(sessionStorage.getItem("currentPageb") || 1);
      }
      if (typeof sessionStorage.getItem("pageSizeb") !== "undefined") {
        this.pageSizeb = Number(sessionStorage.getItem("pageSizeb") || 10);
      }
      sessionStorage.removeItem("detail");
    }

    this.getBlockRewardsList(this.pageb);
  },
  methods: {
    formatTime(time) {
      return helper.formatTimimg(time);
    },
    getAddrFormat(data, number) {
      return helper.getAddrFormat(data, number);
    },
    goToUrl(name, params) {
      helper.goPathUrl(this, name, params);
    },

    toMinerView(data) {
      if (data.address) {
        helper.goPathUrl(this, "MinerView", `${data.address}`);
      }
    },

    handleSizeChangeb() {
      var val = $("#selectPageb").val();
      this.pageSizeb = val;
      this.getBlockRewardsList(1);
      sessionStorage.setItem("pageSizeb", val);
    },

    handleCurrentChangeb(val) {
      this.pageb = val;
      this.getBlockRewardsList(this.pageb);
      sessionStorage.setItem("currentPageb", val);
    },

    seachData() {
      this.BlockRewardsList = [];
      this.getBlockRewardsList(1);
    },

    async getBlockRewardsList(page) {
      showLoading();
      
      if (page < 1 || (this.totalPageb > 0 && page > this.totalPageb)) {
        hideLoading();
        return;
      }

      this.pageb = page;
      sessionStorage.setItem("currentPageb", page);
      let param = {
        current: this.pageb,
        size: this.pageSizeb,
        revenueAddress: null,
        address: null,
        type: this.type,
      };
      if (this.devflag === 0) {
        param.revenueAddress = this.revenueAddr;
      } else {
        param.address = this.revenueAddr;
      }

      await utils.getNowHeight();
      
      api
        .postJson("/platform/lockUtgMinerInfo", param)
        .then((response) => {
          if (response.statusCode !== 0) {
            Message.error(response.message);
            hideLoading();
          } else {
            if (response.result === null || response.result.total === 0) {
              this.loadText = "";
              hideLoading();
              return;
            }
            var data = response.result.records;
            if (data.length < this.totalb) {
              this.loadText = this.$t("comm.bottomLine");
            }
            this.totalb = response.result.total;
            this.totalPageb = response.result.pages;

            const rand = (this.pageb - 1) * this.pageSizeb;
            const newData = [];
            var temp = {};
            data.forEach((item, index) => {
              temp = {
                ranking: index + 1 + parseInt(rand),
                type: item.type,
                address: item.address,
                revenue_address: item.revenue_address,
                ntype: item.ntype,
                blockNumber: item.blockNumber,
                pledge_amount:
                  helper
                    .getDataFormat(item.pledge_amount, 18, 10000)
                    .toFixed(4) + " UTG",
                LockAmount: `${utils.clearZero(
                  (item.totalAmount || 0) - (item.releaseamount || 0)
                )} UTG`,
                lockNumber: item.lockNumber,
                leftAmount: `${utils.clearZero(item.releaseamount)} UTG`,
                totalAmount: `${utils.clearZero(item.totalAmount)} UTG`,
                lockingTime: utils.lockingTime(
                  item.startTime,
                  item.avgBlockTime,
                  item.unLockNumber,
                  item.releaseHeigth
                ),
              };
              newData.push(temp);
            });
            this.BlockRewardsList = newData;
            hideLoading();
          }
        })
        .catch((error) => {
          console.error(error);
          Message.error(error.ErrMsg);
          hideLoading();
        });
    },
  },
};
</script>
<style lang="scss" scoped></style>
