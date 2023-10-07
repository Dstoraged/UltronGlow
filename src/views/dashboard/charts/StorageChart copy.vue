<template>
  <div class="container-fluid">
    <div class="card" style="margin-top: 40px">
      <div class="card-body">
        <div class="mt-0 header-title mb-2" style="text-align: left">
          <span style="font-size: 12pt; font-weight: bold">{{
            $t("charts.totalstoragechart")
          }}</span>
        </div>
        <div style="text-align: center">
          <el-date-picker
            v-model="dates"
            type="daterange"
            range-separator="~"
            start-placeholder="Start"
            end-placeholder="End"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </div>

        <div
          ref="chart_ie"
          class="chart_context"
          style="width: 100%; height: 300px"
        ></div>
      </div>
    </div>
  </div>
</template>
<script>
import echarts from "echarts";
import * as api from "@/api/api";
import utils from "@/utils/utils";

export default {
  name: "storageChart",
  data() {
    // const endTime = new Date().getTime();
    //const startTime = endTime - 30 * 24 * 60 * 60 * 1000;
    //const endL = helper.formatTime(endTime / 1000, "yyyy-MM-dd");
    // const startL = helper.formatTime(startTime / 1000, "yyyy-MM-dd");
    return {
      dates: [],
      chartObj: null,
      option: {
        title: {
          text: "",
        },
        tooltip: {
          trigger: "axis",
          formatter: (item) => {
            let reStr = `${item[0].axisValue}<br/>`;
            item.forEach((element) => {
              reStr += `${element.marker || ""} ${element.seriesName} : ${
                element.value || 0
              } TB <br/>`;
            });
            return reStr;
          },
        },
        legend: {
          data: [],
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        toolbox: {
          feature: {
            saveAsImage: {},
          },
        },
        xAxis: {
          type: "category",
          boundaryGap: true,
          data: [],
        },
        yAxis: {
          type: "value",
        },
        series: [],
      },
    };
  },

  mounted() {
    let endTime = new Date().getTime();
    let startTime = endTime - 30 * 24 * 60 * 60 * 1000;
    this.dates.push(new Date(endTime));
    this.dates.unshift(new Date(startTime));
    this.setChahrt();
    window.addEventListener("resize", this.eventListener);
  },
  methods: {
    setChahrt() {
      if (!this.chartObj) {
        this.chartObj = echarts.init(this.$refs.chart_ie, "light");
      }
      this.chartObj.resize();
      this.chartObj.showLoading({
        text: "Loading...",
        textStyle: { fontSize: 30, color: "#444" },
        effectOption: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
      });
      this.getDatas();
    },
    getDatas() {
      let query = {
        startTime: this.dates[0],
        endTime: this.dates[1],
      };

      /*
      if (this.dates && this.dates.length == 2) {
        query.startTime = this.dates[0];
        query.endTime = this.dates[1];
      }
      */
      api
        .postJson("/platform/getUtgNetStatics", query)
        .then((response) => {
          let arr = response.result || [];

          let dataMap = utils.chartData(arr, "ctime", this.chartConfig());
          this.option.legend.data = dataMap.legendsData;
          this.option.xAxis.data = dataMap.xAxisData;
          this.option.series = dataMap.series;

          this.chartObj.setOption(this.option, true);
          this.chartObj.hideLoading();
        })
        .catch((error) => {
          console.error(error);
        });
    },
    chartConfig() {
      return [
        {
          name: "total_bw",
          getData: (item) => {
            return item.total_bw
              ? (item.total_bw / (1024 * 1024 * 1024 * 1024)).toFixed(4)
              : item.total_bw;
          },
          propertys: {
            name: this.$t("charts.totalstorage"),
            type: "line",
            //stack: "Total"
          },
        },
        {
          name: "incre_bw",
          getData: (item) => {
            return item.incre_bw
              ? (item.incre_bw / (1024 * 1024 * 1024 * 1024)).toFixed(4)
              : item.incre_bw;
          },
          propertys: {
            name: this.$t("charts.growth"),
            type: "line",
            //stack: "Total"
          },
        },
      ];
    },

    eventListener() {
      if (this.chartObj) {
        this.chartObj.resize();
      }
    },
  },

  beforeDestroy() {
    window.removeEventListener("resize", this.eventListener);
  },

  watch: {
    "$i18n.locale": function () {
      this.setChahrt();
    },
    dates: function () {
      this.setChahrt();
    },
  },
};
</script>
<style scoped>
.chart_context {
  height: 250px;
  width: 100%;
}
</style>
