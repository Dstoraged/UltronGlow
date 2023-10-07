<template>
  <div class="container-fluid">
    <div class="card" style="margin-top: 40px">
      <div class="card-body">
        <h4 class="mt-0 header-title" style="width: 100%; text-align: left">
          {{ $t("mining.mining") }}
        </h4>
        <p class="sub-title" style="width: 100%; text-align: left">
          {{ $t("mining.currentMiningNumber", [total]) }}
        </p>
        <div class="table-responsive" style="min-height: 200px">
          <table class="table table-hover mb-0">
            <thead>
              <tr style="background-color: #f8fafd">
                <th scope="col" style="min-width: 80px">
                  {{ $t("ftable.order") }}
                </th>
                <th scope="col" style="min-width: 120px">
                  {{ $t("mining.minerAddress") }}
                </th>
                <th scope="col" style="min-width: 120px">
                  {{ $t("mining.miningNumber") }}
                </th>
                <th scope="col" style="min-width: 120px">
                  {{ $t("block.block") }}
                </th>
                <th scope="col" style="min-width: 120px">
                  {{ $t("block.Age") }}
                </th>
                <th scope="col" style="min-width: 120px">
                  {{ $t("mining.type") }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in blockList" :key="index">
                <td>{{ item.ranking }}</td>
                <td>
                  <span>{{ item.validation }}</span>
                  <span
                    class="display-pc cursor equal-width"
                    @click="goToUrl('AccountDetail', item.address)"
                    >{{ getAddrFormat(item.address, 10) }}</span
                  >
                  <span
                    class="display-pad cursor equal-width"
                    @click="goToUrl('AccountDetail', item.address)"
                    >{{ getAddrFormat(item.address, 10) }}</span
                  >
                </td>
                <td>
                  <span>{{ item.value }}</span>
                </td>
                <td>
                  <a
                    href="javascript:;"
                    @click="goToUrl('BlockDetail', item.block)"
                  >
                    <span style="color: #2ebac6">{{ item.block }}</span>
                  </a>
                </td>
                <td>{{ formatTime(item.time) }}{{ $t("comm.before") }}</td>
                <td>
                  <span v-if="item.type === '1'">{{ $t("mining.block") }}</span>
                  <span v-else>{{ $t("mining.storage") }}</span>
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
                  @click="getBlockList(1)"
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
                  @click="getBlockList(page - 1)"
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
                  @click="getBlockList(page + 1)"
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
                  @click="getBlockList(totalPages)"
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
import { showLoading, hideLoading } from "@/utils/loading";
export default {
  name: "MiningView",
  components: {},
  data() {
    return {
      pageSize: 10,
      page: 1,
      total: 0,
      totalPages: 0,
      blockList: [],
      timer: {},
      loadText: this.$t("comm.clickLoad"),
      searchInput: "",
    };
  },

  mounted() {
    this.getBlockList(this.page);
  },
  destroyed() {
    this.$parent.$parent.showfooter(true);
    if (this.timer) {
      clearInterval(this.timer);
    }
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

    handleSizeChange() {
      var val = $("#selectPage").val();
      this.pageSize = val;
      console.log(val);
      this.getBlockList(1);
    },

    handleCurrentChange(val) {
      this.page = val;
      console.log("current page:" + this.page);
      this.getBlockList(this.page);
    },

    getBlockList(page) {
      if (page < 1 || (this.totalPages > 0 && page > this.totalPages)) {
        return;
      }
      showLoading();
      this.page = page;
      var param = {
        current: this.page,
        size: this.pageSize,
        address: this.searchInput,
      };
      api
        .postJson("/platform/getMinerAndFeeUtg", param)
        .then((response) => {
          if (response.statusCode !== 0) {
            this.$message({
              type: "error",
              message: response.message,
            });
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
            let temp = {};
            data.forEach((item, index) => {
              temp = {
                ranking: index + 1 + rand,
                block: item.blockNumber,
                type: item.types,
                address: item.address,
                value:
                  helper.getDataFormat(item.value, 18, 10000).toFixed(4) +
                  "UTG",
                time: item.timeStamp,
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
