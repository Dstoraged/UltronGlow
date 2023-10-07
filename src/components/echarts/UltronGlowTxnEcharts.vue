<template>
  <div class="echarts" :id="id"></div>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "UltronGlowTxnEcharts",
  data() {
    return {
      id: "UltronGlowTxn",
      chart: null,
      options: {
        tooltip: {
         
          trigger: "axis",
          backgroundColor: "#fff", 
          padding: [5, 15, 5, 15], 
          borderColor: "#DDDDDF", 
          borderWidth: 1, 
          textStyle: {
            
            color: "#6A6A6A",
            decoration: "none",
            fontFamily: "Verdana, sans-serif",
          },
          extraCssText: "text-align: left;",
          formatter: function (params) {
           
            return (
              this.$t("home.datetime") +
              ": " +
              params[0].name +
              "<br/>" +
              this.$t("home.transactions") +
              ": " +
              params[0].value
            );
          },
        },
        xAxis: {
          data: [
            "2022-02-01",
            "2022-02-02",
            "2022-02-03",
            "2022-02-04",
            "2022-02-05",
            "2022-02-06",
            "2022-02-07",
          ],
        },
        yAxis: {},
        series: [
          {
            name: "transactions",
            type: "line",
            smooth: true,
            data: [8, 15, 31, 13, 15, 22, 11],
          },
        ],
        grid: {
          left: "30px",
          right: "20px",
          bottom: "20px",
          top: "20px",
        },
      },
    };
  },

  mounted() {
    this.initEcharts();
    console.log("window:", window);
    // debugger;
    window.addEventListener("resize", this.eventListener);
  },

  methods: {
    initEcharts() {
      if (!this.chart) {
        let dom = document.getElementById(this.id);
        this.chart = echarts.init(dom);
      } else {
        return;
      }
      if (!this.options) return;
      this.chart.setOption(this.options);
    },
    eventListener() {
      if (this.chart) {
        this.chart.resize();
      }
    },
  },

  beforeDestroy() {
    window.removeEventListener("resize", this.eventListener);
  },
};
</script>

<style lang="scss" scoped>
.echarts {
  width: 100%;
  height: 100%;
}
</style>
