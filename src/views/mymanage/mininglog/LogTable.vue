<template>
  <div class="container-fluid">
    <div class="card" style="margin-top: 40px">
      <div class="card-body">
        <h4 class="mt-0 header-title" style="width: 100%; text-align: left">
          <span>{{ $t("home.transactions") }}</span>
          <p class="sub-title" style="width: 100%; text-align: left">
            {{ $t("lock.currentLockNumber", [total]) }}
          </p>
        </h4>

        <div class="table-responsive" style="min-height: 200px">
          <table class="table table-hover mb-0">
            <thead>
              <tr style="background-color: #f8fafd">
                <th scope="col" style="min-width: 80px">
                  {{ $t("ftable.order") }}
                </th>
                <th scope="col" style="min-width: 120px">
                  {{ $t("mininglog.oreremoval") }}
                </th>
                <th scope="col" style="min-width: 120px">
                  {{ $t("mininglog.blockNumber") }}
                </th>
                <!--
                <th scope="col" style="min-width: 120px">
                  {{ $t("mininglog.bandwidth") }}
                </th>
                -->
                <th scope="col" style="min-width: 120px">
                  {{ $t("mininglog.miningearnings") }}
                </th>
                <th scope="col" style="min-width: 120px">
                  {{ $t("mininglog.locknumber") }}
                </th>
                <th scope="col" style="min-width: 120px">
                  {{ $t("mininglog.unlockedquantity") }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in nodeList" :key="index">
                <td width="80">{{ item.ranking }}</td>
                <td>{{ item.report_time }}</td>
                <td>{{ item.blocknumber }}</td>
                <!-- <td>{{ item.bandwidth }}</td> -->
                <td>{{ item.profitamount }}</td>
                <td>{{ item.lock_amount }}</td>
                <td>{{ item.release_amount }}</td>
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
                  @click="getMinerLogList(1)"
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
                  @click="getMinerLogList(page - 1)"
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
                  @click="getMinerLogList(page + 1)"
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
                  @click="getMinerLogList(totalPages)"
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
import utils from "@/utils/utils";
export default {
  name: "LogTable",
  components: {},
  props: {
    param: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      pageSize: 10,
      page: 1,
      total: 0,
      totalPages: 0,
      nodeList: [],
      loadText: this.$t("comm.clickLoad"),
      searchInput: null,
    };
  },
  mounted() {
    this.getMinerLogList(this.page);
  },
  methods: {
    handleSizeChange() {
      var val = $("#selectPage").val();
      this.pageSize = val;
      console.log(val);
      this.getMinerLogList(1);
    },

    handleCurrentChange(val) {
      this.page = val;
      console.log("current page:" + this.page);
      this.getMinerLogList(this.page);
    },

    getMinerLogList(page) {
      if (page < 1 || (this.totalPages > 0 && page > this.totalPages)) {
        return;
      }
      showLoading();
      this.total = 0;
      this.page = page;

      var param = {
        current: this.page,
        size: this.pageSize,
        revenue_address: this.$store.getters.account,
        miner_addr: this.param.miner_addr,
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

            const newData = [];
            const rand = (this.page - 1) * this.pageSize;
            data.forEach((item, index) => {
              item.ranking = index + 1 + parseInt(rand || 0);
              item.profitamount =
                utils.clearZero(item.profitamount, 4) + " UTG";
              item.lock_amount = utils.clearZero(item.lock_amount, 4) + " UTG";
              item.release_amount =
                utils.clearZero(item.release_amount, 4) + " UTG";
              item.bandwidth = utils.bytesToSize(item.bandwidth || 0);
              newData.push(item);
            });
            this.nodeList = newData;
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
