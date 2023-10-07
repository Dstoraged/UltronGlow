<template>
  <div>
    <h4 class="mt-0 header-title" style="width: 100%; text-align: left">
      <p class="sub-title" style="width: 100%; text-align: left">
        {{ $t("home.currentBlockNumber", [total]) }}
      </p>
    </h4>
    <div class="table-responsive">
      <table class="table table-hover mb-0">
        <thead>
          <tr style="background-color: #f8fafd">
            <th scope="col" style="min-width: 80px">
              {{ $t("ftable.order") }}
            </th>
            <th scope="col" style="min-width: 100px">
              {{ $t("block.block") }}
            </th>
            <th scope="col" style="min-width: 120px">{{ $t("block.Age") }}</th>
            <th scope="col" style="min-width: 100px">{{ $t("block.Txn") }}</th>
            <!--
                                <th scope="col" style="min-width: 300px;">{{ $t("block.Miner") }}</th>
              -->
            <th scope="col" style="min-width: 100px">
              {{ $t("block.GasUsed") }}
            </th>
            <th scope="col" style="min-width: 100px">
              {{ $t("block.GasLimit") }}
            </th>
            <th scope="col" style="min-width: 100px">
              {{ $t("block.GasPrice") }}
            </th>
            <th scope="col" style="min-width: 120px">
              {{ $t("block.reward") }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in blockList" :key="index">
            <td>{{ item.ranking }}</td>
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
              <span>{{ item.blockTransactionCount }}</span>
            </td>
            <!--
                                <td>
                                    <span>{{ $t("block.UltronNode") }}</span>
                                    <span
                                        class="cursor"
                                        style="color: #2ebac6; margin-left: 5px"
                                        @click="goToUrl('AccountDetail', item.validationAddress)"
                                    >{{ getAddrFormat(item.validationAddress, 8) }}</span>
                                </td>
              -->
            <td>{{ item.gasUsed }} ({{ item.gasUsedRate }}%)</td>
            <td>{{ item.gasLimit }}</td>
            <td>{{ item.gasPrice }} Gwei</td>
            <td>{{ item.reward }}</td>
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
              @click="getBlockList(totalPages)"
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
import { showLoading, hideLoading } from "@/utils/loading";
export default {
  name: "ViewBlocks",
  components: {},
  props: {
    node_addr: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      pageSize: 10,
      page: 1,
      total: 0,
      totalPages: 0,
      blockList: [],
      loadText: this.$t("comm.clickLoad"),
      fblock: "",
      lblock: "",
      searchInput: null,
    };
  },
  mounted() {
    this.getBlockList(this.page);
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

    handleSizeChangeb() {
      var val = $("#selectPageb").val();
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
        address: this.node_addr,
      };
      api
        .postJson("/platform/getBlockList", param)
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
            let temp = {};
            data.forEach((item, index) => {
              if (index == 0) this.lblock = item.blockNumber;
              else this.fblock = item.blockNumber;
              temp = {
                ranking: index + 1 + rand,
                block: item.blockNumber,
                transition: item.blockTransactionCount,
                transitionhash: item.hash,
                validation: "",
                validationAddress: item.minerAddress,
                reward:
                  helper.getDataFormat(item.reward, 18, 10000).toFixed(4) +
                  " UTG",
                time: item.timeStamp,
                gasLimit: item.gasLimit,
                gasUsed: item.gasUsed,
                gasUsedRate:
                  Math.floor((item.gasUsed / item.gasLimit) * 10000) / 100,
                gasPrice: helper.getDataFormat(item.avgGasPrice, 9),
                blockTransactionCount: item.blockTransactionCount,
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
<style lang="scss" scoped>
.cursor {
  cursor: pointer;
}
</style>
