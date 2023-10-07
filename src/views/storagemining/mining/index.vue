<template>
  <div class="container-fluid">
    <div class="card" style="margin-top: 40px">
      <div class="card-body">
        <div class="row" style="padding: 6px; text-align: left">
          <div class="col-md-4">
            <h4 class="mt-0 header-title" style="width: 100%; text-align: left">
              {{ $t("storagemining.storagemining") }}
            </h4>
            <p class="sub-title" style="width: 100%; text-align: left">
              {{ $t("storagemining.currentlystoragemining", [total]) }}
            </p>
          </div>
          <div class="col-md-4">
            <div class="input-group" style="margin: 0 auto">
              <input
                type="text"
                class="form-control"
                :placeholder="$t('storagemining.storageminingsearch')"
                id="demo"
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
                <th scope="col" style="min-width: 80px">
                  {{ $t("ftable.order") }}
                </th>
                <th scope="col" style="min-width: 150px">
                  {{ $t("storagemining.en_address") }}
                </th>
                <th scope="col" style="min-width: 150px">
                  {{ $t("storagemining.revenueaddress") }}
                </th>
                <th scope="col" style="min-width: 150px">
                  {{ $t("storagemining.trans_hash") }}
                </th>
                <th scope="col" style="min-width: 120px">
                  {{ $t("storagemining.bandwidth") }}
                </th>
                <th scope="col" style="min-width: 160px">
                  {{ $t("storagemining.report_time") }}
                </th>
                <th scope="col" style="min-width: 120px">
                  {{ $t("storagemining.storage_value") }}
                </th>
                <th scope="col" style="min-width: 120px">
                  {{ $t("storagemining.fulnum") }}
                </th>
                <th scope="col" style="min-width: 150px">
                  {{ $t("storagemining.profitamount") }}
                </th>
                <th scope="col" style="min-width: 160px">
                  {{ $t("storagemining.instime") }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in blockList" :key="index">
                <td>{{ item.ranking }}</td>
                <td>{{ item.en_address }}</td>
                <td>{{ item.revenue_address }}</td>
                <td>{{ item.trans_hash }}</td>
                <td>{{ item.bandwidth }}</td>
                <td>{{ item.report_time }}</td>
                <td>
                  {{ item.storage_value }}
                  <span v-if="item.storage_value">MB</span>
                </td>
                <td>
                  {{ clearZero(item.fulnum) }}
                  <span v-if="item.fulnum">SRT</span>
                </td>
                <td>
                  {{ clearZero(item.profitamount, 4) }}
                  <span v-if="item.profitamount">UTG</span>
                </td>
                <td>{{ item.instime }}</td>
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
                  @click="pageUtgCltList(1)"
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
                  @click="pageUtgCltList(page - 1)"
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
                        curPage: page,
                        totalPage: totalPages,
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
                  @click="pageUtgCltList(page + 1)"
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
                  @click="pageUtgCltList(totalPages)"
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
import { showLoading, hideLoading } from "@/utils/loading";
import * as api from "@/api/api";
import * as helper from "@/utils/helper";
import utils from "@/utils/utils";
export default {
  name: "MiningView",
  components: {},
  props: {},
  data() {
    return {
      pageSize: 10,
      page: 1,
      total: 0,
      totalPages: 0,
      blockList: [],
      timer: {},
      loadText: this.$t("comm.clickLoad"),
      searchInput: null,
    };
  },

  created() {
    this.searchInput = this.$route.params.id || "";
    this.pageUtgCltList(this.page);
  },

  methods: {
    clearZero(val, num = 4) {
      return utils.clearZero(val, num);
    },
    formatTime(time) {
      return helper.formatTimimg(time);
    },
    getAddrFormat(data, number) {
      return helper.getAddrFormat(data, number);
    },
    goToUrl(name, params) {
      helper.goPathUrl(this, name, params);
    },

    handleSizeChange() {
      var val = $("#selectPage").val();
      this.pageSize = val;
      console.log(val);
      this.pageUtgCltList(1);
    },

    handleCurrentChange(val) {
      this.page = val;
      console.log("current page:" + this.page);
      this.pageUtgCltList(this.page);
    },

    seachData() {
      this.extractList = [];
      this.pageUtgCltList(1);
    },

    pageUtgCltList(page) {
      if (page < 1 || (this.totalPages > 0 && page > this.totalPages)) {
        return;
      }
      showLoading();
      this.total = 0;
      this.page = page;
      var param = {
        current: this.page,
        size: this.pageSize,
        miner_addr: this.searchInput,
      };
      api
        .postJson("/platform/storage/pageUtgCltList", param)
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
            this.totalPages = response.result.pages;
            const rand = (this.page - 1) * this.pageSize;
            const newData = [];
            var temp = {};
            data.forEach((item, index) => {
              let bandwidth = item.bandwidth || 0;
              bandwidth = utils.bytesToSize(bandwidth);
              temp = {
                ranking: index + 1 + rand,
                trans_hash: item.trans_hash,
                bandwidth,
                report_time: item.report_time,
                storage_value: item.storage_value,
                fulnum: item.fulnum,
                profitamount: item.profitamount,
                instime: item.instime,
                en_address: item.en_address,
                revenue_address: item.revenue_address,
              };
              newData.push(temp);
            });
            this.blockList = newData;
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
