<template>
  <div>
    <div class="container-fluid">
      <div class="card" style="margin-top: 40px">
        <div class="card-body">
          <h4 class="mt-0 header-title" style="text-align: left">
            {{ $t("lock.freedDetails") }}
          </h4>
          <div class="row">
            <div class="col-md-7">
              <div class="card viewcard">
                <div class="card-body viewcardbody">
                  <h4 class="mt-0 header-title"></h4>
                  <VTable
                    :table-heard="tableLeftHeard"
                    :datas="nodeinfo"
                    title-width="110px"
                    id="tableLeftHeardid"
                  >
                  </VTable>
                </div>
              </div>
            </div>
            <div class="col-md-5" v-if="false">
              <div class="card viewcard">
                <div class="card-body viewcardbody">
                  <h4 class="mt-0 header-title"></h4>
                  <VTable
                    :table-heard="tableRightHeard"
                    :datas="nodeinfo"
                    title-width="110px"
                    id="tableRightHeardid"
                  >
                  </VTable>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ReleaseReocrd
      :node_type="type"
      :node_addr="address"
      :blockNumber="blockNumber"
    />
  </div>
</template>
<script>
import * as api from "@/api/api";
import * as helper from "@/utils/helper";
import ReleaseReocrd from "./components/ReleaseReocrd.vue";
import VTable from "@/components/modules/VTable.vue";
export default {
  name: "ReleaseList",
  components: {
    ReleaseReocrd,
    VTable,
  },
  data() {
    const types = {
      1: "lock.nodeaward",
      2: "lock.nodeawardFreed",
      3: "lock.nodeLock",
      4: "lock.nodeFreed",
      5: "lock.storageLock",
      6: "lock.storageFreed",
      7: "lock.minerLock",
      8: "lock.minerFreed",
      9: "lock.BandwidthLock",
      10: "lock.bandwidthFreed",
    };
    return {
      tableLeftHeard: [
        {
          title: "lock.minerAddress",
          name: "minerAddress",
          popover: true,
          format: true,
          phoneFormat: true,
        },
        { title: "lock.blockNumber", name: "blockNumber" },
        { title: "lock.totalAmount", name: "lockamount" },

        { title: "lock.type", name: "type", valT: true },
        {
          title: "lock.Revenueaddress",
          name: "revenueAddress",
          popover: true,
          format: true,
          phoneFormat: true,
        },
        { title: "lock.leftAmount", name: "releaseamount" },
      ],

      tableRightHeard: [
        { title: "lock.type", name: "type", valT: true },
        {
          title: "lock.Revenueaddress",
          name: "revenueAddress",
          popover: true,
          format: true,
          phoneFormat: true,
        },
        { title: "lock.leftAmount", name: "releaseamount" },
      ],

      address: "",
      revenueaddress: "",
      type: 0,
      blockNumber: 0,
      nodeinfo: {},
      loadText: this.$t("comm.clickLoad"),
      fblock: "",
      lblock: "",
      searchInput: null,
      types,
    };
  },

  created() {
    let idL = this.$route.params.id;
    if (!idL) {
      return;
    }
    let ids = idL.split("_");
    if (ids.length != 4) {
      return;
    }
    this.address = ids[0];
    this.type = ids[1];
    this.blockNumber = ids[2];
    this.revenueaddress = ids[3] || "";

    this.getNodeInfo();
  },

  methods: {
    getAddrFormat(data, number = 15) {
      return helper.getAddrFormat(data, number);
    },

    getNodeInfo() {
      let param = {
        address: this.address,
        type: this.type - 1,
        blockNumber: this.blockNumber,
      };

      this.nodeinfo = {
        minerAddress: this.address,
        type: this.types[this.type - 1],
        blockNumber: this.blockNumber,
        revenueAddress: this.revenueaddress || "",
        lockamount: 0,
        releaseamount: 0,
      };

      api
        .postJson("/platform/getUtgMinerLockSum", param)
        .then((response) => {
          let result = response.result || {};
          this.nodeinfo.lockamount =
            helper.getDataFormat(result.lockamount, 18, 10000).toFixed(4) +
            " UTG";
          this.nodeinfo.releaseamount =
            helper.getDataFormat(result.releaseamount, 18, 10000).toFixed(4) +
            " UTG";
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.cursor {
  cursor: pointer;
}

@media (min-width: 751px) {
  .viewheader {
    text-align: left;
  }

  .viewcard {
    margin-top: 5px;
  }

  .viewcardbody {
    text-align: left;
  }
}

@media (max-width: 750px) {
  .viewheader {
    text-align: left;
    border-bottom: #dddddd solid 2px;
    line-height: 30px;
    margin-bottom: 20px;
  }

  .viewcard {
    margin-top: 5px;
    border: none;
    box-shadow: none;
  }

  .viewcardbody {
    text-align: left;
    margin: 0px;
    padding: 0px;
  }
}
</style>
