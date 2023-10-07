<template>
  <div style="margin-top: 40px">
    <div class="container-fluid">
      <div class="row" style="margin-top: 20px">
        <div class="col-xl-12">
          <div class="card">
            <div class="card-body" style="margin: 20px 4px; padding: 0px">
              <div class="row" style="padding: 6px; text-align: left">
                <div class="col-md-4" style="margin: 0px; padding: 10px">
                  <ul
                    class="nav nav-pills nav-justified"
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
                          {{ $t("mymanageNode.candidateNode") }}
                        </span>
                        <span class="d-block d-md-none">
                          {{ $t("mymanageNode.candidateNode") }}
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
                          {{ $t("mymanageNode.witnessNode") }}
                        </span>
                        <span class="d-block d-md-none">
                          {{ $t("mymanageNode.witnessNode") }}
                        </span>
                      </a>
                    </li>
                  </ul>
                </div>
                <div class="col-md-8">
                  <button
                    class="btn btn-info btn-mini waves-effect waves-light"
                    style="width: 130px; float: right"
                    type="button"
                    @click="add"
                  >
                    {{ $t("node.nodepledge") }}
                  </button>
                </div>
              </div>
              <!-- Tab panes -->
              <div
                class="tab-content"
                style="border-top: solid 1px #f0f0f0; margin-top: 20px"
              >
                <div
                  class="tab-pane active"
                  id="node-candidatenode"
                  role="tabpanel"
                >
                  <CandidateNode />
                </div>
                <div class="tab-pane" id="node-witnessnode" role="tabpanel">
                  <WitnessNode />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import CandidateNode from "./components/MyCandidateNode.vue";
import WitnessNode from "./components/MyWitnessNode.vue";
import * as helper from "@/utils/helper";
export default {
  name: "MyNode",
  components: {
    CandidateNode,
    WitnessNode,
  },
  props: {},
  data() {
    return {};
  },

  created() {},

  computed: {
    sdkIsok() {
      return !!this.$store.getters.account;
    },
  },

  methods: {
    handleNavLink(event) {
      $(".nav-link").removeClass("active");
      console.log(event.target.tagName);
      event.currentTarget.className = "nav-link active";
    },
    add() {
      //helper.goUrl(this, "MymanageAddNode", "");
      helper.goPathUrl(this, "mymanage/addNode", "");
    },
  },
};
</script>
<style lang="scss" scoped>
.cursor {
  cursor: pointer;
}
</style>
