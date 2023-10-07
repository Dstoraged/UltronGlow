<template>
  <div>
    <div
      class="col-md-6 col-pull-md-3"
      style="
        line-height: 80px;
        color: #ffffff;
        text-align: center;
        font-size: 12pt;
        margin: 0 auto;
        display: inline-block;
      "
    >
      The UltronGlow Blockchain Explorer
    </div>
    <div class="input-group col-md-6 col-pull-md-3" style="margin: 0 auto">
      <select
        name="cars"
        class="custom-select-md"
        style="
          border: 1px solid #23cbe0;
          border-right: 0px;
          padding: 0 20px;
          border-top-left-radius: 0.25rem;
          border-bottom-left-radius: 0.25rem;
        "
      >
        <option selected value="0">{{ $t("home.searchselect0") }}</option>
        <option value="1">{{ $t("home.searchselect1") }}</option>
        <option value="2">{{ $t("home.searchselect2") }}</option>
        <option value="3">{{ $t("home.searchselect3") }}</option>
        <option value="4">{{ $t("home.searchselect4") }}</option>
        <option value="5">{{ $t("home.searchselect5") }}</option>
      </select>
      <input
        type="text"
        class="form-control"
        v-model="searchInput"
        :placeholder="$t('home.searchplaceholder')"
        id="demo"
        style="border: 1px solid #23cbe0; border-right: 0px"
      />
      <div class="input-group-append">
        <button
          class="btn btn-primary btn-block waves-effect waves-light"
          type="submit"
        >
          Search
        </button>
      </div>
    </div>
  </div>
</template>
<script>
//import * as helper from "@/utils/helper";
export default {
  name: "GlobalView",
  data() {
    return {
      searchInput: "",
    };
  },
};
</script>
<style lang="scss" scoped></style>
