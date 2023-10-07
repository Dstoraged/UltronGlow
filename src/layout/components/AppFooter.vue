<template>
  <div id="footer">
    <footer class="footer" style="
        background: url(/static/images/ftbg.png) no-repeat center;
        background-size: cover;
        height: 260px;
        color: #ffffff;
        padding: 40px 0 0px 0px;
      ">
      <div class="container-fluid">
        <div class="media" style="
            display: -webkit-flex;
            display: flex;
            -webkit-align-items: center;
            align-items: center;
            padding: 10px 20px;
            padding: 30px 0 0 0px;
          ">
          <img class="d-flex mr-3 thumb-sm" src="@/assets/images/UTG-logo_bai.png" />
          <h4 class="font-22 m-1">Powered by UltronGlow</h4>
        </div>
        <div class="col-md-4 col-sm-12" style="padding: 10px 0 0 0px; text-align: left">
          {{ $t("footer.footcontext") }}
        </div>

        <div class="col-md-4 col-sm-12" style="padding: 10px 0 0 0px; text-align: left" v-if="true">
          <el-dropdown szie="mini" class="changeLang" @command="handleCommand">
            <span style="color:#ffffff;font-weight: bold;">
             <i class="fa fa-cogs mr-1"></i> 
             {{ $t("comm.switchlanguage",[langName]) }}
             <!--
             <i class="el-icon-arrow-down el-icon--right"></i>
             -->
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="en">{{ $t("menu.langen") }}</el-dropdown-item>
              <el-dropdown-item command="zh-cn">{{ $t("menu.langzh") }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </footer>
  </div>
</template>
<script>
import { getValue, setValue } from "@/utils/auth";
export default {
  name: "AppFooter",
  data() {
    return {
      langName: "",
    }
  },
  mounted() {
    this.langName = this.getLangNames(this.$i18n.locale) || "English";
  },
  methods: {
    
    handleCommand(command) {
      localStorage.setItem('locale', command)
      this.$i18n.locale = command;
      setValue("locale", command);
      this.langName = this.getLangNames(command);
    },

    getLangNames(lang) {
      if (lang == "zh-cn") {
        return "CN";
      } else if (lang == "en") {
        return "English";
      }
    },

    getLang() {
      return getValue("locale");
    },
  }
};
</script>
<style lang="scss" scoped>
</style>
