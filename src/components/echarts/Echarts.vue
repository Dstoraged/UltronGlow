<template>
  <div class="echarts" :id="id"></div>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "TrendCharts",
  props: {
    options: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      id: "echarts-1",
      chart: null,
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
};
</script>

<style lang="scss" scoped>
.echarts {
  width: 100%;
  height: 100%;
}
</style>
