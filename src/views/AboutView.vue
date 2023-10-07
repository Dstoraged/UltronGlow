<template>
  <div class="about">
    <h1>{{ $t("welcomeMsg") }}</h1>
    <br />
   
  </div>
</template>
<script>
export default {
  data() {
    return {
      selectValue: "",
      
    };
  },
  created() {
    let that = this;
    console.log(localStorage.lang);
    that.selectValue =
      localStorage.lang == undefined ? "cn" : localStorage.lang;
  },
  methods: {
   
    langChange(e) {
      console.log(e);
      localStorage.setItem("lang", e);
      console.log(this.$i18n);
      this.$i18n.locale = e;
    },
  },
};
</script>
