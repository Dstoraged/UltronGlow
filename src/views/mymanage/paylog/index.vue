<template>
  <div>
    <div class="container-fluid">
      <div class="card" style="margin-top: 40px">
        <div class="card-body">
          <div class="row">
            <div class="col-md-6">
              <view-table
                title="mymanage.rechargerecord"
                :table-heard="tableHeard"
                :datas="nodeinfo"
                @colClick="colClick"
              >
                <label
                  slot="avl_right_theremaining"
                  class="cursor"
                  style="color: #5e89d8"
                  @click="pays"
                  >{{ $t("mymanage.pay") }}</label
                >
              </view-table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <PayRecord :param="getParam" />
  </div>
</template>
<script>
import PayRecord from "@/views/mymanage/pay/PayRecord.vue";
import * as helper from "@/utils/helper";
import utils from "@/utils/utils";
import * as api from "@/api/api";
import viewTable from "@/components/modules/viewTable.vue";
export default {
  components: { PayRecord, viewTable },
  data() {
    return {
      tableHeard: [
        {
          title: "mymanageMining.revenuesaddress",
          name: "revenuesaddress",
          isClick: true,
          popover: true,
        },
        { title: "mymanage.balance", name: "utgbalance" },
        { title: "mininglog.theremaining", name: "theremaining" },
      ],

      nodeinfo: {},
    };
  },

  created() {
    this.getrowDatas();
  },
  activated() {
    this.getrowDatas();
  },
  methods: {
    colClick(data) {
      let col = data.col || {};
      let row = data.row || {};
      switch (col.name) {
        case "revenuesaddress":
          helper.goPathUrl(this, "AccountDetail", row.revenuesaddress);
          break;

        default:
          break;
      }
    },
    pays() {
      helper.goUrl(this, "MymanagePay", "");
    },
    getrowDatas() {
      api
        .postJson("/platform/my/outLine", {
          revenue_address: this.$store.getters.account,
        })
        .then((response) => {
          let data = response.result || {};
          this.nodeinfo = {
            revenuesaddress: data.address,
            utgbalance: `${utils.clearZero(data.balance || 0)} UTG`,
            theremaining: `${utils.clearZero(data.srt_balance || 0)} SRT`,
          };
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  computed: {
    getParam() {
      return {
        //param1: this.$store.getters.account,
        param1: this.$store.getters.account,
        txType: "Exch",
      };
    },
  },
  watch: {
    "$store.getters.account": function () {
      this.getrowDatas();
    },
  },
};
</script>
<style lang="scss" scoped>
.cursor {
  cursor: pointer;
}
</style>
