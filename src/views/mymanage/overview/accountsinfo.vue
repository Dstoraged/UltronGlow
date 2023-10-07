<template>
  <div class="card" style="margin-top: 20px">
    <div class="card-body" style="margin: 10px 4px; padding: 0px">
      <div class="col-md-4" style="margin: 0px; padding: 0px">
        <ul
          class="nav nav-pills nav-justified"
          role="tablist"
          style="font-size: 11pt; font-weight: bold; margin: 0px; padding: 0px"
        >
          <li class="nav-item waves-effect waves-light">
            <a
              class="nav-link active"
              data-toggle="tab"
              href="#lock-nodeaward"
              role="tab"
              aria-selected="true"
              @click="handleNavLink($event)"
            >
              <span class="d-none d-md-block">{{ $t("home.tran") }}</span>
              <span class="d-block d-md-none">{{ $t("home.tran") }}</span>
            </a>
          </li>
          <li class="nav-item waves-effect waves-light">
            <a
              class="nav-link"
              data-toggle="tab"
              href="#lock-nodeLock"
              role="tab"
              @click="handleNavLink($event)"
            >
              <span class="d-none d-md-block">{{
                $t("accounts.balanceHistory")
              }}</span>
              <span class="d-block d-md-none">{{
                $t("accounts.balanceHistory")
              }}</span>
            </a>
          </li>
        </ul>
      </div>
      <!-- Tab panes -->
      <div
        class="tab-content"
        style="border-top: solid 1px #f0f0f0; margin-top: 10px"
      >
        <div class="tab-pane active p-3" id="lock-nodeaward" role="tabpanel">
          <TransactionsList
            :accAddr="accAddr"
            table-id="TransactionsList_overview"
          />
        </div>
        <div class="tab-pane p-3" id="lock-nodeLock" role="tabpanel">
          <BalanceHistory
            :accAddr="accAddr"
            v-if="isLabelFlag"
            :table-id="''"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import TransactionsList from "@/views/accounts/components/TransactionsList.vue";
import BalanceHistory from "@/views/accounts/components/BalanceHistory.vue";

export default {
  name: "BlockDetail",
  components: {
    TransactionsList,
    BalanceHistory,
  },
  props: {
    setId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      accAddr: "",
      isLabelFlag: false,
    };
  },
  created() {
    this.accAddr = this.setId || this.$route.params.id;
  },
  methods: {
    handleNavLink(event) {
      $(".nav-link").removeClass("active");
      console.log(event.target.tagName);
      event.currentTarget.className = "nav-link active";
      if (event.currentTarget.hash == "#lock-nodeLock") {
        this.isLabelFlag = true;
      }
    },
  },
  watch: {
    setId: function (newVal) {
      this.accAddr = newVal || this.$route.params.id;
    },
  },
};
</script>
<style lang="scss" scoped>
.cursor {
  cursor: pointer;
}

.dialog-footer .title {
  margin: 16px 0px;
  text-align: center;
}

.dialog-footer .acc-addr {
  word-wrap: break-word;
  text-align: center;
  margin: 16px 0px;
  line-height: 24px;
}
</style>
