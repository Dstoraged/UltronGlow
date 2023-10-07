<template>
  <div>
    <h4 class="mt-0 header-title" style="width: 100%; text-align: left">
      <p class="sub-title" style="width: 100%; text-align: left">
        {{ $t("lock.currentReleaseNumber", [totalr]) }}
      </p>
    </h4>

    <div class="table-responsive" style="min-height: 200px">
      <table class="table table-hover mb-0">
        <thead>
          <tr style="background-color: #f8fafd">
            <th scope="col" style="min-width: 80px">
              {{ $t("ftable.order") }}
            </th>
            <th scope="col" style="min-width: 200px">
              {{ $t("lock.revenuesaddress") }}
            </th>
            <th scope="col" style="min-width: 100px">
              {{ $t("lock.blockNumber") }}
            </th>
            <!--
            <th scope="col" style="min-width: 150px">
              {{ $t("lock.nodeawardAmount") }}
            </th>
            <th scope="col" style="min-width: 150px">
              {{ $t("lock.totalAmount") }}
            </th>
            -->
            <th scope="col" style="min-width: 200px">
              {{ $t("storagemining.releasedquantity") }}
            </th>
            <th scope="col" style="min-width: 200px">
              {{ $t("lock.freedTime") }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in rewardReleaseList" :key="index">
            <td>{{ item.ranking }}</td>
            <td>
              <a
                href="javascript:;"
                @click="goToUrl('AccountDetail', item.revenueaddress)"
              >
                <span style="color: #2ebac6">
                  {{ item.revenueaddress }}
                </span>
              </a>
            </td>
            <td>
              {{ item.blockNumber }}
              <!--
              <span
                style="color: #4a7bd3; cursor: pointer"
                @click="toRelease(item)"
                >{{ item.blockNumber }}</span
              >
              -->
            </td>
            <!--
            <td>{{ item.totalAmountAmount }}</td>
            <td>{{ item.totalAmount }}</td>
            -->
            <td>{{ item.releaseamount }}</td>
            <td>
              <span>{{ item.curtime }} </span>
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
              class=""
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
                v-model="pageSizer"
                style="font-size: 12px"
                @change="handleSizeChanger()"
                id="selectPager"
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
              class=""
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
              @click="getRewardReleaseList(1)"
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
              @click="getRewardReleaseList(pager - 1)"
              ><i class="mdi mdi-chevron-left"></i
            ></a>
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
                    curPage: pager,
                    totalPage: totalPager,
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
              @click="getRewardReleaseList(pager + 1)"
              ><i class="mdi mdi-chevron-right"></i
            ></a>
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
              @click="getRewardReleaseList(totalPager)"
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
  name: "RewardRelease",
  components: {},
  props: {
    node_addr: {
      type: String,
      default: "",
    },
    node_type: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      pageSizer: 10,
      pager: 1,
      totalr: 0,
      totalPager: 0,
      rewardReleaseList: [],
      loadText: this.$t("comm.clickLoad"),
      searchInput: null,
    };
  },

  created() {
    this.getRewardReleaseList(this.pager);
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

    toRelease(data) {
      if (data.address && data.type) {
        helper.goPathUrl(
          this,
          "releaseList",
          `${data.address}_${data.type + 1}_${data.blockNumber}_${
            data.revenue_address
          }`
        );
      }
    },

    handleSizeChanger() {
      var val = $("#selectPager").val();
      this.pageSizer = val;
      this.getRewardReleaseList(1);
    },

    handleCurrentChange(val) {
      this.pager = val;
      this.getRewardReleaseList(this.pager);
    },

    async getRewardReleaseList(page) {
      this.rewardReleaseList = [];
      showLoading();
      await utils.getNowHeight();
      if (page < 1 || (this.totalPager > 0 && page > this.totalPager)) {
        hideLoading();
        return;
      }
      this.totalr = 0;
      this.pager = page;
      var param = {
        current: this.pager,
        size: this.pageSizer,
        address: this.node_addr,
        type: this.node_type,
      };
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
            if (data.length < this.totalr) {
              this.loadText = this.$t("comm.bottomLine");
            }
            this.totalr = response.result.total;
            this.totalPager = response.result.pages;

            const newData = [];
            const rand = (this.pager - 1) * this.pageSizer;
            data.forEach((item, index) => {
              item.ranking = index + 1 + parseInt(rand || 0);
              item.pledge_amount = `${utils.clearZero(item.pledge_amount)} UTG`;
              item.totalAmountAmount = `${utils.clearZero(
                item.totalAmount || 0
              )} UTG`;
              item.totalAmount = `${utils.clearZero(
                (item.totalAmount || 0) - (item.releaseamount || 0)
              )} UTG`;
              item.releaseamount = `${utils.clearZero(item.releaseamount)} UTG`;
              item.lockingTime = utils.lockingTime(
                item.startTime,
                item.avgBlockTime,
                item.unLockNumber,
                item.releaseHeigth
              );
              item.curtime = helper.formatTime(item.curtime, 1);
              item.txHash = item.txHash;
              item.revenueaddress = item.revenueaddress;
              newData.push(item);
            });
            this.rewardReleaseList = newData;
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
