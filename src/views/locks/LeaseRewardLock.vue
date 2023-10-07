<template>
  <div class="container-fluid">
    <div class="card" style="margin-top: 40px">
      <div class="card-body">
        <div class="row" style="padding: 6px; text-align: left">
          <div class="col-md-4">
            <h4 class="mt-0 header-title" style="width: 100%; text-align: left">
              {{ $t("storagereward.Leasereward") }}
            </h4>
            <p class="sub-title" style="width: 100%; text-align: left">
              {{ $t("storagereward.totalnumber", [total]) }}
            </p>
          </div>
          <div class="col-md-5">
            <div class="input-group" style="margin: 0 auto">
              <input
                type="text"
                class="form-control"
                :placeholder="$t('storagereward.deviceaddressSearch')"
                id="searchinput"
                v-model="searchInput"
                @keyup.enter="seachData(1)"
                style="border-right: 0px; width: 60%"
              />
              <div class="input-group-append">
                <button
                  class="btn btn-block waves-effect waves-light"
                  type="button"
                  @click="seachData(1)"
                  style="background-color: #d4d4d4"
                >
                  {{ $t("comm.search") }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="table-responsive" style="min-height: 200px">
          <table class="table table-hover mb-0">
            <thead>
              <tr style="background-color: #f8fafd">
                <th scope="col" style="min-width: 80px" type="expand">
                  {{ $t("ftable.order") }}
                </th>
                <th scope="col" style="min-width: 150px">
                  {{ $t("storagereward.deviceaddress") }}
                </th>
                <th scope="col" style="min-width: 150px">
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
              <tr v-for="(item, index) in StoragerewardList" :key="index">
                <td>{{ item.ranking }}</td>
                <td>
                  <a
                    href="javascript:;"
                    @click="goToUrlDetail('MarketDetail', item)"
                  >
                    <span style="color: #2ebac6">{{ item.address }}</span>
                  </a>
                </td>
                <td>
                  <span>{{ getAddrFormat(item.revenue_address, 12) }}</span>
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
            <ul
              class="pagination"
              style="justify-content: left; font-size: 9pt"
            >
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
                    v-model="pageSize"
                    style="font-size: 12px"
                    @change="handleSizeChange()"
                    id="selectPage"
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
                  @click="getStorageRewardList(1)"
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
                  @click="getStorageRewardList(page - 1)"
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
                        curPage: page,
                        totalPage: totalPage,
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
                  @click="getStorageRewardList(page + 1)"
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
                  @click="getStorageRewardList(totalPage)"
                  >{{ $t("pagination.last") }}</a
                >
              </li>
            </ul>
          </div>
        </div>
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
  name: "LeaseRewardLock",
  components: {},
  props: {},
  data() {
    return {
      pageSize: 10,
      page: 1,
      total: 0,
      totalPage: 0,
      StoragerewardList: [],
      loadText: this.$t("comm.clickLoad"),
      searchInput: null,
    };
  },

  created() {
    if (sessionStorage.getItem("detail")) {
      if (typeof sessionStorage.getItem("currentPage") !== "undefined") {
        this.page = Number(sessionStorage.getItem("currentPage") || 1);
      }
      if (typeof sessionStorage.getItem("pageSize") !== "undefined") {
        this.pageSize = Number(sessionStorage.getItem("pageSize") || 10);
      }
      sessionStorage.removeItem("detail");
    }
    this.getStorageRewardList(this.page);
  },

  methods: {
    formatTime(time) {
      return helper.formatTimimg(time);
    },
    getAddrFormat(data, number) {
      return helper.getAddrFormat(data, number);
    },
    goToUrl(name, params) {
      console.log("params=" + params);
      helper.goPathUrl(this, name, params);
    },

    goToUrlDetail(name, data) {
      if (data.address) {
        helper.goPathUrl(this, name, `${data.address}`);
      }
    },

    toMinerView(data) {
      if (data.address) {
        helper.goPathUrl(this, "MinerView", `${data.address}`);
      }
    },

    handleSizeChange() {
      var val = $("#selectPage").val();
      this.pageSize = val;
      this.getStorageRewardList(1);
      sessionStorage.setItem("pageSize", val);
    },

    handleCurrentChange(val) {
      this.page = val;
      this.getStorageRewardList(this.page);
      sessionStorage.setItem("currentPage", val);
    },

    seachData() {
      this.StoragerewardList = [];
      this.getStorageRewardList(1);
    },

    async getStorageRewardList(page) {
      showLoading();

      await utils.getNowHeight();
      if (page < 1 || (this.totalPage > 0 && page > this.totalPage)) {
        hideLoading();
        return;
      }
      this.total = 0;
      this.page = page;
      sessionStorage.setItem("currentPage", page);
      let param = {
        current: this.page,
        size: this.pageSize,
        address: this.searchInput,
        type: 13,
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
            if (data.length < this.total) {
              this.loadText = this.$t("comm.bottomLine");
            }
            this.total = response.result.total;
            this.totalPage = response.result.pages;

            const rand = (this.page - 1) * this.pageSize;
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
            this.StoragerewardList = newData;
            hideLoading();
          }
        })
        .catch((error) => {
          Message.error(error.ErrMsg);
          hideLoading();
        });
    },
  },
};
</script>
<style lang="scss" scoped></style>
