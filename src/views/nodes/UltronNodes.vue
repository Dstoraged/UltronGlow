<template>
  <div class="container-fluid">
    <div class="row" style="margin-top: 30px">
      <div class="col-xl-12">
        <div class="card">
          <div class="card-body" style="margin: 20px 4px; padding: 0px">
            <div class="col-md-6" style="margin: 0px; padding: 0px">
              <ul
                class="nav nav-pills nav-justified phone_nav_overflow-x"
                role="tablist"
                style="
                  font-size: 11pt;
                  font-weight: bold;
                  margin: 0px;
                  padding: 0px;
                "
              >
                <li class="nav-item waves-effect waves-light">
                  <a
                    class="nav-link active"
                    data-toggle="tab"
                    href="#node-candidatenode"
                    role="tab"
                    @click="handleNavLink($event)"
                    style="padding: 8px 0px"
                  >
                    <span class="d-none d-md-block">
                      {{ $t("node.candidateNode") }}
                    </span>
                    <span class="d-block d-md-none">
                      {{ $t("node.candidateNode") }}
                    </span>
                  </a>
                </li>
                <li class="nav-item waves-effect waves-light">
                  <a
                    class="nav-link"
                    data-toggle="tab"
                    href="#node-witnessnode"
                    role="tab"
                    @click="handleNavLink($event)"
                  >
                    <span class="d-none d-md-block">
                      {{ $t("node.witnessNode") }}
                    </span>
                    <span class="d-block d-md-none">
                      {{ $t("node.witnessNode") }}
                    </span>
                  </a>
                </li>
                <li class="nav-item waves-effect waves-light">
                  <a
                    class="nav-link"
                    data-toggle="tab"
                    href="#node-signoutnode"
                    role="tab"
                    @click="handleNavLink($event)"
                  >
                    <span class="d-none d-md-block">
                      {{ $t("node.signoutNode") }}
                    </span>
                    <span class="d-block d-md-none">
                      {{ $t("node.signoutNode") }}
                    </span>
                  </a>
                </li>
              </ul>
            </div>

            <!-- Tab panes -->
            <div
              class="tab-content"
              style="border-top: solid 1px #f0f0f0; margin-top: 20px"
            >
              <div
                class="tab-pane active p-3"
                id="node-candidatenode"
                role="tabpanel"
              >
                <CandidateNode />
              </div>
              <div class="tab-pane p-3" id="node-witnessnode" role="tabpanel">
                <WitnessNode />
              </div>
              <div class="tab-pane p-3" id="node-signoutnode" role="tabpanel">
                <SignoutNode />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import CandidateNode from "./components/CandidateNode.vue";
import WitnessNode from "./components/WitnessNode.vue";
import SignoutNode from "./components/SignoutNode.vue";

export default {
  name: "UltronNodes",
  components: {
    CandidateNode,
    WitnessNode,
    SignoutNode,
  },
  props: {},
  data() {
    return {};
  },
  destroyed() {
    //sessionStorage.removeItem("detail");
  },
  methods: {
    handleNavLink(event) {
      $(".nav-link").removeClass("active");
      console.log(event.target.tagName);
      event.currentTarget.className = "nav-link active";
    },
  },
};
</script>
<style lang="scss" scoped>
.cursor {
  cursor: pointer;
}
.phone_nav_overflow-x {
  width: 100%;
  overflow-x: auto;
  display: grid;
  grid-template-columns: repeat(3, minmax(150px, auto));
  text-align: center;
}
</style>
