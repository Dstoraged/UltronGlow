<template>
  <div class="container-fluid">
    <div class="card" style="margin-top: 40px; min-height: 500px">
      <div class="card-body">
        <div>
          <img src="/static/images/no_data.png" />
        </div>
        <div>{{ $t("comm.searchNoData", [search]) }}</div>

        <div style="padding: 10px">
          <button
            class="btn btn-primary waves-effect waves-light"
            type="button"
            @click="back()"
          >
            {{ $t("comm.backToHome") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as helper from "@/utils/helper";

export default {
  name: "Search",
  data() {
    return {
      search: "",
    };
  },
  computed: {},

  watch: {
    $route(to, from) {
      this.updSearch();
    },
  },

  created() {},
  mounted() {
    this.updSearch();
  },

  methods: {
    updSearch() {
      this.search = this.$route.params.id;
    },

    back() {
      helper.goUrl(this, "Dashboard", "");
    },
  },
};
</script>

<style scoped></style>
