<template>
  <div>
    <div class="container-fluid">
      <div class="card" style="margin-top: 40px">
        <div
          class="card-body"
          style="min-height: 400px; text-align: center; padding-top: 30px"
        >
          <h4 class="mt-0 header-title" style="text-align: left">
            {{ $t("download.title") }}
          </h4>
          <div class="row">
            <div class="col-md-6">
              <img
                src="@/assets/images/downbg.png"
                style="width: 100%; max-width: 377px; max-height: 345px"
              />
            </div>
            <div class="col-md-6">
              <div
                style="
                  width: 100%;
                  text-align: left;
                  padding-bottom: 20px;
                  padding-top: 100px;
                "
              >
                <li style="list-style: none; font-weight: bold">
                  {{ $t("download.desc1") }}
                </li>
                <li
                  style="padding-top: 20px; list-style: none; font-weight: bold"
                >
                  {{ $t("download.desc2") }}
                </li>
                <li
                  style="
                    padding-top: 20px;
                    padding-bottom: 20px;
                    list-style: none;
                    font-weight: bold;
                  "
                >
                  {{ $t("download.desc3") }}
                </li>
                <a href="/static/plugins/Basemeta.zip">
                  <el-button type="primary">{{
                    $t("download.btname")
                  }}</el-button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    dowloadFile() {
      window.open("");
    },
  },
};
</script>
<style scoped>
.center-context {
  min-height: 400px;
  text-align: center;
  padding-top: 20px;
}
</style>
