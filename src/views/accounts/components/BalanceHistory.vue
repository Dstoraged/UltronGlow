<template>
  <div class="container-fluid" style="padding: 5px; margin: 5px">
    <div class="row">
      <div class="col-md-4" style="padding-left: 5px">
        <div class="card" style="margin-top: 5px">
          <div
            class="card-body"
            style="text-align: left"
            ref="chartparent"
            id="chartparent"
          >
            <h4 class="mt-0 header-title">{{ $t("accounts.trendChart") }}</h4>
            <div
              id="trend_Chart"
              :style="{ width: '100%', height: '300px' }"
              ref="trend_chart_ie"
              class="chart_context"
            ></div>
          </div>
        </div>
      </div>
      <div class="col-md-8 phone_padding_zero">
        <div class="card" style="margin-top: 5px">
          <div class="card-body" style="text-align: left">
            <h4 class="mt-0 header-title">{{ $t("accounts.waterDetails") }}</h4>
            <h-tbale
              ref="htable"
              :table-id="tableId + accAddr"
              :table-heard="tableHeard"
              :table-data="tableData"
              @inint-ok="tableInit"
              @load="loadTable"
            >
            </h-tbale>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Message } from "element-ui";
import echarts from "echarts";
import * as api from "@/api/api";
import * as helper from "@/utils/helper";
import utils from "@/utils/utils";
import HTbale from "@/components/modules/HTbale.vue";
import { setPageQuery } from "@/utils/table.js";
export default {
  name: "BalanceHistory",
  components: { HTbale },
  props: {
    accAddr: {
      type: String,
      default: "",
    },
    tableId: {
      type: String,
      default: "BalanceHistory",
    },
  },

  data() {
    return {
      tableHeard: [
        {
          title: "home.block",
          name: "blockNumber",
        },
        {
          title: "comm.time",
          name: "timeStamp",
          type: "timimg",
        },
        /*
        {
          title: "accounts.variety",
          name: "amount",
          valMap(val, item) {
            let type = item.type === 1 ? "-" : "+";
            return `${type}${helper.getDataFormat(val, 18, 10000).toFixed(4)}`;
          },
        },
        */
        {
          title: "accounts.amount",
          name: "balance",
          valMap(val) {
            return utils.weedZero(helper.getDataFormat(val, 18, 10000), 8);
            // return helper.getDataFormat(val, 18, 10000).toFixed(4);
          },
        },
      ],
      tableData: [],

      trendChart: null,
      echartsOption: {},
      chartparentWidth: "350px",
    };
  },

  mounted() {
    this.getTrendChart();
    window.onresize = () => {
      if (this.trendChart) {
        this.trendChart.resize();
      }
    };
  },

  watch: {
    accAddr: {
      immediate: true,
      handler() {
        this.tableInit(null, 1);
        //this.getTrendChart();
      },
    },
  },

  methods: {
    tableInit(query, pageNum) {
      this.loadTable(query, false, pageNum);
    },
    loadTable(query, toTop = true, pageNum) {
      if (!this.accAddr) return;
      if (!query && this.$refs.htable) {
        query = this.$refs.htable.tableQuery;
      }
      if (!query) return;
      query.pageNum = pageNum || query.pageNum;

      var params = {
        current: query.pageNum,
        size: query.pageSize,
        addressHash: this.accAddr,
      };

      // query.loadingShow();
      query.loadingShow(params, pageNum);      
      api
        .postJson("/platform/selectForAddressDetail", params)
        .then((response) => {
          query.loadingHide();

          if (response.statusCode !== 0) {
            Message.error(response.message);
          }
          let re = response.result || {};
          this.tableData = re.records || [];

          setPageQuery(query, re);
          if (toTop && this.tableData.length > 0) {
            query.toTop();
          }
        })
        .catch((error) => {
          query.loadingHide(JSON.stringify(error).includes("timeout") ? 1 : 2);
        });
    },

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

    getTrendChart() {
      var params = {
        addressHash: this.accAddr,
      };
      api
        .post("/platform/getBlanceForAddressHash", params)
        .then((response) => {
          if (response.statusCode !== 0) {
            Message.error(response.res.msg);
          } else {
            if (response.result === null) {
              return;
            }
            var data = response.result;
            var blocks = [];
            var date = [];
            data.forEach((item) => {
              blocks.push(
                helper.getDataFormat(item.balance, 18, 10000).toFixed(4)
              );
              date.push(item.blockNumber);
            });

            this.trendChart = echarts.init(
              document.getElementById("trend_Chart"),
              "light"
            );

            this.trendChart.setOption({
              grid: {
                right: 10,
                bottom: 20,
                x: 35,
                y: 10,
              },

              tooltip: {
                trigger: "axis",
                textStyle: {
                  align: "left",
                },
              },
              xAxis: {
                type: "category",
                boundaryGap: false,
                data: date,
                axisTick: {
                  show: false,
                  color: "#0a0d13",
                },
                axisLine: {
                  show: true,
                  lineStyle: {
                    color: "#C8CCD9",
                  },
                },
                axisLabel: {
                  show: true,
                  textStyle: {
                    color: "#4D5161",
                  },
                },
              },
              yAxis: {
                type: "value",
                splitLine: false,
                axisTick: {
                  show: false,
                  color: "#0a0d13",
                },
                axisLine: {
                  show: true,
                  lineStyle: {
                    color: "#C8CCD9",
                  },
                },
                // min: 0,
                splitNumber: 5,
                axisLabel: {
                  show: true,
                  formatter: function (params) {
                    if (params / 1000000000 > 1) {
                      params = Math.floor(params / 1000000000) + "G";
                    } else if (params / 1000000 > 1) {
                      params = Math.floor(params / 1000000) + "M";
                    } else if (params / 1000 > 1) {
                      params = Math.floor(params / 1000) + " K";
                    }
                    return params;
                  },
                  textStyle: {
                    color: "#4D5161",
                  },
                },
              },
              series: [
                {
                  data: blocks,
                  type: "line",
                  symbol: "none",
                  smooth: true,
                  // color: '#44d7b6',
                  color: "rgba(37,93,193,0)",
                  name: this.$t("accounts.balance") + "(UTG)",
                  areaStyle: {
                    color: {
                      type: "linear",
                      x: 0,
                      y: 0,
                      x2: 0,
                      y2: 1,
                      colorStops: [
                        {
                          offset: 0,
                          color: "rgba(105, 128, 183, 1)",
                        },
                        {
                          offset: 1,
                          color: "rgba(139, 189, 255, 0)",
                        },
                      ],
                    },
                  },
                },
              ],
            });

            this.trendChart.resize();
          }
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

@media (max-width: 700px) {
  .phone_padding_zero {
    padding: 0px !important;
  }
}
</style>
