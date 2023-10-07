<template>
  <div class="blocklist-container ieHome">
    <div class="content-container">
      <f-elrow
        title="mymanage.miningrecords"
        :titles="titles"
        :datas="rowDatas"
        :col-width="8"
        bgcolor="#fff"
        title-align="left"
      >
      </f-elrow>
    </div>
    <div class="content-container">
      <div class="content-wrapper">
        <tablem />
      </div>
    </div>
  </div>
</template>
<script>
import fTable from "@/components/modules/Ftable.vue";
import utils from "@/utils/utils";
import fElrow from "@/components/modules/Felrow.vue";
import * as api from "@/api/api";
import tablem from "./table.vue";
export default {
  components: { fTable, fElrow, tablem },
  data() {
    return {
      titles: [
        {
          titles: [
            { title: "mininglog.payearnings" },
            // { title: "mininglog.expendful" },
            { title: "mininglog.minersNumber" },
          ],
          colWidth: 12,
        },
        {
          titles: [
            // { title: "mininglog.payfulnum" },
            //{ title: "mininglog.theremaining" },
            { title: "mininglog.miningearnings" },
          ],
          colWidth: 12,
        },
      ],
      rowDatas: {},
    };
  },
  created() {
    this.getrowDatas();
  },
  activated() {
    this.getrowDatas();
  },
  methods: {
    getrowDatas() {
      api
        .postJson("/platform/my/outLine", {
          revenue_address: this.$store.getters.account,
        })
        .then((response) => {
          let data = response.result || {};
          this.rowDatas = {
            "mininglog.payearnings": data.address,
            "mininglog.expendful": utils.isEmpty(data.payful)
              ? ""
              : `${data.payful} SRT`,
            "mininglog.minersNumber": data.minerCount,
            //"mininglog.payfulnum": "xxx SRT",
            "mininglog.theremaining": utils.isEmpty(data.ful_balance)
              ? ""
              : `${data.ful_balance} SRT`,
            "mininglog.miningearnings": utils.isEmpty(data.revenue_amount)
              ? ""
              : `${utils.clearZero(data.revenue_amount)} UTG`,
          };
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  watch: {
    "$store.getters.account": function () {
      this.getrowDatas();
    },
  },
};
</script>
<style scoped>
.con {
  margin-left: 100px;
  width: -webkit-calc(100% - 100px);
  width: -moz-calc(100% - 100px);
  width: calc(100% - 100px);
}

.posi {
  position: relative;
  left: 150px;
  bottom: -23px;
}
.backg {
  background: url(/static/images/blue_line.png) left no-repeat;
  background-size: 2px 20px;
}

.blocklist-container .content-container .search .search-title {
  position: relative;
  float: right;
  z-index: 99999;
  right: 5px;
  top: -30px;
  height: 30px;
  line-height: 30px;
  color: #ccc;
  width: 30px;
  background: url(/static/images/search_i.png) center no-repeat;
  background-size: 15px 15px;
  cursor: pointer;
}
</style>
