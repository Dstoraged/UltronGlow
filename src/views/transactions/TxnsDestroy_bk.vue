<template>
  <txns :toaddress="address" :totitle="'home.destroy'" />
</template>
<script>
import txns from "./ViewTxns.vue";
export default {
  components: { txns },
  data() {
    return {
      address: "ux0000000000000000000000000000000000000000",
    };
  },
};
</script>
