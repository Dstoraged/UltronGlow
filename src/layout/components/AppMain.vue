<template>
  <div class="content-wrapper">
    <div
      class
      style="
        background: url(/static/images/banner.png) top center no-repeat;
        background-size: 100% 260px;
        width: 100%;
        height: auto;
      "
    >
      <div>
        <div
          class=""
          style="
            width: 90%;
            line-height: 40px;
            color: #ffffff;
            text-align: center;
            font-size: 14pt;
            margin: 0 auto;
            display: inline-block;
            margin-top: 20px;
          "
        >
          <span>{{ $t("menu.CurrentNetwork") }}</span>
        </div>

        <div
          class="col-md-6 col-pull-md-3"
          style="
            line-height: 60px;
            color: #ffffff;
            text-align: center;
            font-size: 12pt;
            margin: 0 auto;
            display: inline-block;
          ">
          {{ $t("appname") }}
        </div>
        <div class="input-group col-md-6 col-pull-md-3" style="margin: 0 auto">
          <!--
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
          -->
          <input
            type="text"
            class="form-control"
            v-model="searchInput"
            :placeholder="$t('comm.searchTips')"
            id="demo"
            @keyup.enter="seachData()"
            style="border: 1px solid #23cbe0; border-right: 0px"
          />
          <div class="input-group-append">
            <button
              class="btn btn-primary btn-block waves-effect waves-light"
              type="button"
              @click="seachData()"
            >
              Search
            </button>
          </div>
        </div>
      </div>
      <transition name="el-fade-in" mode="out-in">
        <router-view />
      </transition>
    </div>
  </div>
</template>
<script>
import * as api from "@/api/api";
import * as helper from "@/utils/helper";
export default {
  name: "AppMain",
  data() {
    return {
      searchInput: "",
    };
  },
  methods: {
    seachData() {
      var that = this;
      this.searchInput = this.searchInput.trim();
      //console.log(this.searchInput);
      if (this.searchInput === "" || this.searchInput === null) {
        return "";
      }

      api
        .postJson("/platform/searchByParam", { param: this.searchInput })
        .then((response) => {
          if (response.statusCode !== 0) {
            that.$message({
              type: "error",
              message: response.message,
            });
          } else {
            const type = response.result.type;
            let home = "Search";
            switch (type) {
              case 1:
                home = "BlockDetail";
                break;
              case 2:
                home = "TxnsInfo";
                break;
              case 3:
                home = "AccountDetail";
                break;
              case 4:
                home = "token";
                break;
            }

            helper.goPathUrl(that, home, that.searchInput);
          }
        })
        .catch((error) => {
          this.$message.error(error.message);
          this.dialogVisible = true;
          console.error(error);
        });
    },
  },
};
</script>
<style lang="scss" scoped></style>
