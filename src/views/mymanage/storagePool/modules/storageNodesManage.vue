<template>
  <div class="container-fluid">
    <div class="card" style="margin-top: 40px">
      <div class="card-body">
        <storage-nodes
          ref="storageNodes"
          :manage="true"
          :address="address"
        ></storage-nodes>
      </div>
    </div>
  </div>
</template>
<script>
import storageNodes from "./sublevelStorageNodes.vue";
export default {
  components: { storageNodes },

  created() {
    this.address = this.$route.params.id;
  },
  data() {
    return { address: "" };
  },
};
</script>