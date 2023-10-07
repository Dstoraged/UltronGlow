<template>
  <!--<router-view /> -->
  <div id="app">
    <loading-sub-pan />
    <router-view :key="this.$route.path" />
  </div>
</template>
<script>
import loadingSubPan from "@/components/modules/loadingSubPan.vue";
export default {
  components: { loadingSubPan },
  name: "App",
};
</script>

<style lang="scss">
@import "@/assets/css/index.scss";
@import "~bootstrap/scss/bootstrap.scss";
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
@media (max-width: 700px) {
  .phone_form_input .el-form-item__content,
  .phone_form_input .el-form-item__label-wrap,
  .phone_form_input_label .el-form-item__content,
  .phone_form_input_label .el-form-item__label-wrap {
    margin-left: 0px !important;
  }
  .phone_form_input_label .el-form-item__label-wrap {
    width: 100%;
  }
  html,
  body {
    font-size: 14px;
  }
  .pc_show_context {
    display: none;
  }
  .phone-table-ie {
    width: 100%;
  }
  .phone-table-ie tr td:nth-child(even) {
    white-space: pre-line;
    word-wrap: break-word;
    word-break: break-all;
  }
  .phone_font_12 {
    font-size: 12px;
    font-weight: 400;
  }
}
@media (min-width: 700px) {
  html,
  body {
    font-size: 15px;
  }
  .phone_show_context {
    display: none;
  }
}
.pointer {
  cursor: pointer;
}
</style>
