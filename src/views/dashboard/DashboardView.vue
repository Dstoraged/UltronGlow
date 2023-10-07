<template>
  <div>
    <Overview />
    <!-- <HomeOverview /> -->
    <StorageChart />
    <div class="container-fluid">
      <!-- <NetworkOverview /> -->

      <div class="row">
        <LatestBlocks />
        <LatestTransactions />
      </div>
    </div>
  </div>
</template>
<script>
//import HomeOverview from "./HomeOverview.vue";
import Overview from "./Overview.vue";
//import NetworkOverview from "./NetworkOverview.vue";
import StorageChart from "./charts/StorageChart.vue";
import LatestBlocks from "./LatestBlocks.vue";
import LatestTransactions from "./LatestTransactions.vue";

export default {
  name: "AppMainTop",
  components: {
    Overview,
    //HomeOverview,
    //NetworkOverview,
    StorageChart,
    LatestBlocks,
    LatestTransactions,
  },
};
</script>
<style lang="scss" scoped></style>
