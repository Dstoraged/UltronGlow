import Vue from "vue";
import Router from "vue-router";
//import NProgress from "nprogress";
//import "nprogress/nprogress.css";
import Layout from "../layout/DefaultLayout.vue";

Vue.use(Router);








export const constantRouterMap = [
  {
    path: "/login",
    component: Layout,
    children: [
      {
        path: "",
        name: "Login",
        component: () => import("@/views/login/Login.vue"),
      },
    ],
  },
  {
    path: "/register",
    component: Layout,
    children: [
      {
        path: "",
        name: "Register",
        component: () => import("@/views/login/Register.vue"),
      },
    ],
  },

  {
    path: "/",
    component: Layout,
    children: [
      {
        path: "",
        name: "Dashboard",
        component: () => import("@/views/dashboard/DashboardView.vue"),
      },
    ],
  },

  {
    path: "/download",
    component: Layout,
    children: [
      {
        path: "",
        name: "DownloadWallte",
        component: () => import("@/views/download/wallet.vue"),
      },
    ],
  },

  {
    path: "/metamask",
    component: Layout,
    children: [
      {
        path: "",
        name: "Metamask",
        component: () => import("@/views/download/Metamask.vue"),
      },
    ],
  },

  // Blocks
  {
    path: "/viewblocks",
    component: Layout,
    children: [
      {
        path: "",
        name: "ViewBlocks",
        component: () => import("@/views/blockchain/ViewBlocks.vue"),
      },
    ],
  },
  {
    path: "/blockdetail/:id",
    component: Layout,
    children: [
      {
        path: "",
        name: "BlockDetail",
        component: () => import("@/views/blockchain/BlockDetail.vue"),
      },
    ],
  },

  {
    path: "/mining",
    component: Layout,
    children: [
      {
        path: "",
        name: "Mining",
        component: () => import("@/views/blockchain/Mining.vue"),
      },
    ],
  },

  {
    path: "/absent",
    component: Layout,
    children: [
      {
        path: "",
        name: "ViewAbsent",
        component: () => import("@/views/blockchain/ViewAbsent.vue"),
      },
    ],
  },

  // Txns
  {
    path: "/viewtxns",
    component: Layout,
    children: [
      {
        path: "",
        name: "ViewTxns",
        component: () => import("@/views/transactions/ViewTxns.vue"),
      },
    ],
  },

  {
    path: "/txnsinfo/:id",
    component: Layout,
    children: [
      {
        path: "",
        name: "TxnsInfo",
        component: () => import("@/views/transactions/TxnsInfo.vue"),
      },
    ],
  },

  {
    path: "/tx/:id",
    component: Layout,
    children: [
      {
        path: "",
        name: "tx",
        component: () => import("@/views/transactions/TxnsInfo.vue"),
      },
    ],
  },


  {
    path: "/tokenstxinfo/:id",
    component: Layout,
    children: [
      {
        path: "",
        name: "Tokenstxinfo",
        component: () => import("@/views/transactions/TokenstxInfo.vue"),
      },
    ],
  },

  {
    path: "/destroy",
    component: Layout,
    children: [
      {
        path: "",
        name: "Destroy",
        component: () => import("@/views/transactions/TxnsDestroy.vue"),
      },
    ],
  },
  {
    path: "/coins/:id",
    component: Layout,
    children: [
      {
        path: "",
        name: "Coins",
        component: () => import("@/views/coins/index.vue"),
      },
    ],
  },

  // lock
  {
    path: "/nodeaward",
    component: Layout,
    children: [
      {
        path: "",
        name: "Nodeaward",
        component: () => import("@/views/locks/NodeAward.vue"),
      },
    ],
  },
  {
    path: "/nodeLock",
    component: Layout,
    children: [
      {
        path: "",
        name: "NodeLock",
        component: () => import("@/views/locks/NodeLock.vue"),
      },
    ],
  },

  {
    path: "/entrustedpledgeLock",
    component: Layout,
    children: [
      {
        path: "",
        name: "EntrustedPledgeLock",
        component: () => import("@/views/locks/EntrustedPledgeLock.vue"),
      },
    ],
  },

  {
    path: "/bandwidthlock",
    component: Layout,
    children: [
      {
        path: "",
        name: "BandwidthLock",
        component: () => import("@/views/locks/BandWidth.vue"),
      },
    ],
  },

  {
    path: "/minerLock",
    component: Layout,
    children: [
      {
        path: "",
        name: "MinerLock",
        component: () => import("@/views/locks/MinerLock.vue"),
      },
    ],
  },

  {
    path: "/storagespacerewards",
    component: Layout,
    children: [
      {
        path: "",
        name: "StorageSpaceRewards",
        component: () => import("@/views/locks/StorageSpaceRewards.vue"),
      },
    ],
  },
  {
    path: "/leasereward",
    component: Layout,
    children: [
      {
        path: "",
        name: "LeaseReward",
        component: () => import("@/views/locks/LeaseRewardLock.vue"),
      },
    ],
  },
  {
    path: "/blockrewards",
    component: Layout,
    children: [
      {
        path: "",
        name: "BlockRewards",
        component: () => import("@/views/locks/BlockRewardLock.vue"),
      },
    ],
  },
  {
    path: "/storagepledgelock",
    component: Layout,
    children: [
      {
        path: "",
        name: "StoragePledgeLock",
        component: () => import("@/views/locks/StoragePledgeLock.vue"),
      },
    ],
  },
  {
    path: "/lockrelease",
    component: Layout,
    children: [
      {
        path: "",
        name: "LockRelease",
        component: () => import("@/views/locks/LockRelease.vue"),
      },
    ],
  },

  {
    path: "/releaseList/:id",
    component: Layout,
    children: [
      {
        path: "",
        name: "ReleaseList",
        component: () => import("@/views/locks/ReleaseList.vue"),
      },
    ],
  },

  {
    path: "/alllocks",
    component: Layout,
    children: [
      {
        path: "",
        name: "AllLocks",
        component: () => import("@/views/locks/WholeNetLocks.vue"),
      },
    ],
  },

  {
    path: "/lastoutput",
    component: Layout,
    children: [
      {
        path: "",
        name: "Lastoutput",
        component: () => import("@/views/locks/Last24thOutput.vue"),
      },
    ],
  },

  // Contract
  {
    path: "/contract",
    component: Layout,
    children: [
      {
        path: "",
        name: "Contract",
        component: () => import("@/views/contract/Contract.vue"),
      },
    ],
  },
  {
    path: "/contractinfo/:id",
    component: Layout,
    children: [
      {
        path: "",
        name: "ContractInfo",
        component: () => import("@/views/contract/ContractInfo.vue"),
      },
    ],
  },

  {
    path: "/contractdetail/:id",
    component: Layout,
    children: [
      {
        path: "",
        name: "ContractDetail",
        component: () => import("@/views/contract/ContractDetail.vue"),
      },
    ],
  },
  {
    path: "/verifycontract",
    component: Layout,
    children: [
      {
        path: "",
        name: "VerifyContract",
        component: () => import("@/views/contract/VerifyContract.vue"),
      },
    ],
  },

  {
    path: "/verifycontract/:id",
    component: Layout,
    children: [
      {
        path: "",
        name: "VerifyContract",
        component: () => import("@/views/contract/VerifyContract.vue"),
      },
    ],
  },

  // tokens
  {
    path: "/tokens",
    component: Layout,
    children: [
      {
        path: "",
        name: "Tokens",
        component: () => import("@/views/token/ViewToken.vue"),
      },
    ],
  },
  {
    path: "/tokens-nft",
    component: Layout,
    children: [
      {
        path: "",
        name: "Tokens-nft",
        component: () => import("@/views/token/ViewToken-nft.vue"),
      },
    ],
  },
  {
    path: "/tokens-nft1155",
    component: Layout,
    children: [
      {
        path: "",
        name: "Tokens-nft1155",
        component: () => import("@/views/token/ViewToken-nft1155.vue"),
      },
    ],
  },
  {
    path: "/storagePools",
    component: Layout,
    children: [
      {
        path: "",
        name: "StoragePools",
        component: () => import("@/views/storagePool/index.vue"),
      },
    ],
  },
  {
    path: "/storagePoolsAwards",
    component: Layout,
    children: [
      {
        path: "",
        name: "storagePoolsAwards",
        component: () => import("@/views/storagePool/awards.vue"),
      },
    ],
  },
  {
    path: "/storagePoolLock",
    component: Layout,
    children: [
      {
        path: "",
        name: "storagePoolLock",
        component: () => import("@/views/storagePool/storagePoolLock.vue"),
      },
    ],
  },
  {
    path: "/storagePoolRntrustAwards",
    component: Layout,
    children: [
      {
        path: "",
        name: "storagePoolRntrustAwards",
        component: () => import("@/views/storagePool/entrustAwards.vue"),
      },
    ],
  },

  {
    path: "/storagePoolDetail/:id?",
    component: Layout,
    children: [
      {
        path: "",
        name: "StoragePoolDetail",
        component: () => import("@/views/mymanage/storagePool/storagePoolDetail.vue"),
      },
    ],
  },

  /*
  {
    path: "/token",
    component: Layout,
    children: [
      {
        path: "",
        name: "token",
        component: () => import("@/views/token/TokenInfo.vue"),
      },
    ],
  },
*/
  {
    path: "/token/:id",
    component: Layout,
    children: [
      {
        path: "",
        name: "token",
        component: () => import("@/views/token/TokenInfo.vue"),
      },
    ],
  },
  {
    path: "/tokenid/:id",
    component: Layout,
    children: [
      {
        path: "",
        name: "tokenid",
        component: () => import("@/views/token/TokenIdInfo.vue"),
      },
    ],
  },

  {
    path: "/tokenDetail",
    component: Layout,
    children: [
      {
        path: "",
        name: "Tokendetail",
        component: () => import("@/views/token/TokenDetail.vue"),
      },
    ],
  },
  {
    path: "/tokentxns",
    component: Layout,
    children: [
      {
        path: "",
        name: "Tokentxns",
        component: () => import("@/views/token/TokenTransfersERC20.vue"),
      },
    ],
  },
  {
    path: "/tokentxns-nft",
    component: Layout,
    children: [
      {
        path: "",
        name: "Tokentxns-nft",
        component: () => import("@/views/token/TokenTransfersERC721.vue"),
      },
    ],
  },
  {
    path: "/tokentxns-nft1155",
    component: Layout,
    children: [
      {
        path: "",
        name: "Tokentxns-nft1155",
        component: () => import("@/views/token/TokenTransfersERC1155.vue"),
      },
    ],
  },



  // accounts
  {
    path: "/accounts",
    component: Layout,
    children: [
      {
        path: "",
        name: "Accounts",
        component: () => import("@/views/accounts/ViewAccounts.vue"),
      },
    ],
  },

  {
    path: "/accountdetail/:id",
    component: Layout,
    children: [
      {
        path: "",
        name: "AccountDetail",
        component: () => import("@/views/accounts/AccountDetail.vue"),
      },
    ],
  },

  {
    path: "/address/:id",
    component: Layout,
    children: [
      {
        path: "",
        name: "address",
        component: () => import("@/views/accounts/AccountDetail.vue"),
      },
    ],
  },




  {
    path: "/transferpath",
    component: Layout,
    children: [
      {
        path: "",
        name: "TransferPath",
        component: () => import("@/views/accounts/TransferPath.vue"),
      },
    ],
  },

  // nodes
  {
    path: "/ultronnodes",
    component: Layout,
    children: [
      {
        path: "",
        name: "UltronNodes",
        component: () => import("@/views/nodes/UltronNodes.vue"),
      },
    ],
  },
  {
    path: "/nodeView/:id",
    component: Layout,
    children: [
      {
        path: "",
        name: "NodeView",
        component: () => import("@/views/nodes/NodeDetail.vue"),
      },
    ],
  },
  {
    path: "/nodesupple/:round",
    component: Layout,
    children: [
      {
        path: "",
        name: "NodeSupple",
        component: () => import("@/views/nodes/NodeSupple.vue"),
      },
    ],
  },

  {
    path: "/nodepledge/:round",
    component: Layout,
    children: [
      {
        path: "",
        name: "NodePledge",
        component: () => import("@/views/nodes/Nodepledge.vue"),
      },
    ],
  },

  {
    path: "/pledge",
    component: Layout,
    children: [
      {
        path: "",
        name: "Pledge",
        component: () => import("@/views/locks/pledge.vue"),
      },
    ],
  },
  {
    path: "/extract",
    component: Layout,
    children: [
      {
        path: "",
        name: "Extract",
        component: () => import("@/views/locks/extract.vue"),
      },
    ],
  },
  {
    path: "/nodereward",
    component: Layout,
    children: [
      {
        path: "",
        name: "NodeReward",
        component: () => import("@/views/nodes/NodeReward.vue"),
      },
    ],
  },
  {
    path: "/allpledge",
    component: Layout,
    children: [
      {
        path: "",
        name: "Allpledge",
        component: () => import("@/views/nodes/WholeNetPledge.vue"),
      },
    ],
  },
  {
    path: "/pledgerecord/:id",
    component: Layout,
    children: [
      {
        path: "",
        name: "PledgeRecord",
        component: () => import("@/views/nodes/NodepledgeTrans.vue"),
      },
    ],
  },

  {
    path: "/search/:id",
    component: Layout,
    children: [
      {
        path: "",
        name: "Search",
        component: () => import("@/views/search/index.vue"),
      },
    ],
  },

  // miner
  {
    path: "/miner",
    component: Layout,
    children: [
      {
        path: "",
        name: "miner",
        component: () => import("@/views/storagemining/miner/index.vue"),
      },
    ],
  },
  {
    path: "/minerView/:id",
    component: Layout,
    children: [
      {
        path: "",
        name: "MinerView",
        component: () => import("@/views/storagemining/miner/MinerView.vue"),
      },
    ],
  },
  {
    path: "/StorageView/:id",
    component: Layout,
    children: [
      {
        path: "",
        name: "StorageView",
        component: () => import("@/views/storagemining/miner/StorageView.vue"),
      },
    ],
  },
  {
    path: "/storagemining",
    component: Layout,
    children: [
      {
        path: "",
        name: "storagemi",
        component: () => import("@/views/storagemining/mining/index.vue"),
      },
    ],
  },
  {
    path: "/storagemiView/:id",
    component: Layout,
    children: [
      {
        path: "",
        name: "storagemiView",
        component: () => import("@/views/storagemining/mining/view.vue"),
      },
    ],
  },

  // market
  {
    path: "/market",
    component: Layout,
    children: [
      {
        path: "",
        name: "Market",
        component: () => import("@/views/market/ViewMarket.vue"),
      },
    ],
  },
  {
    path: "/storagedetail/:id",
    component: Layout,
    children: [
      {
        path: "",
        name: "StorageDetail",
        component: () => import("@/views/market/StorageDetail.vue"),
      },
    ],
  },
  {
    path: "/storagespace",
    component: Layout,
    children: [
      {
        path: "",
        name: "StorageSpace",
        component: () => import("@/views/market/StorageSpace.vue"),
      },
    ],
  },
  {
    path: "/storagenode",
    component: Layout,
    children: [
      {
        path: "",
        name: "StorageNode",
        component: () => import("@/views/market/StorageNode.vue"),
      },
    ],
  },
  {
    path: "/storagereward",
    component: Layout,
    children: [
      {
        path: "",
        name: "StorageReward",
        component: () => import("@/views/market/StorageReward.vue"),
      },
    ],
  },

  {
    path: "/rewarddetail/:id",
    component: Layout,
    children: [
      {
        path: "",
        name: "RewardDetail",
        component: () => import("@/views/market/StorageRewardDetail.vue"),
      },
    ],
  },

  {
    path: "/posrproof/:id",
    component: Layout,
    children: [
      {
        path: "",
        name: "PosrProof",
        component: () => import("@/views/market/PosrProofTrans.vue"),
      },
    ],
  },

  {
    path: "/rentalreward",
    component: Layout,
    children: [
      {
        path: "",
        name: "RentalReward",
        component: () => import("@/views/market/StorageRentalReward.vue"),
      },
    ],
  },

  {
    path: "/storagelock",
    component: Layout,
    children: [
      {
        path: "",
        name: "StorageLock",
        component: () => import("@/views/market/StoragePledgeLock.vue"),
      },
    ],
  },
  {
    path: "/entrustAwards",
    component: Layout,
    children: [
      {
        path: "",
        name: "entrustAwards",
        component: () => import("@/views/market/entrustAwards.vue"),
      },
    ],
  },

  {
    path: "/rewards-calculator",
    component: Layout,
    children: [
      {
        path: "",
        name: "RewardsCalculator",
        component: () => import("@/views/market/RewardsCalculator.vue"),
      },
    ],
  },

  // mymanage
  {
    path: "/mymanage",
    component: Layout,
    children: [
      {
        path: "/",
        component: () => import("@/views/mymanage/MyLayout.vue"),
        children: [
          {
            path: "",
            name: "Mymanage",
            component: () => import("@/views/mymanage/overview/index.vue"),
          },
          {
            path: "pay",
            name: "MymanagePay",
            component: () => import("@/views/mymanage/pay/index.vue"),
          },
          {
            path: "mynode",
            name: "MymanageNode",
            component: () => import("@/views/mymanage/node/index.vue"),
          },
          {
            path: "producedBlock",
            name: "producedBlock",
            component: () => import("@/views/mymanage/producedBlock/index.vue"),
          },
          {
            path: "blockreward",
            name: "blockreward",
            component: () => import("@/views/mymanage/blockreward/index.vue"),
          },

          {
            path: "bandwidthReward",
            name: "bandwidthReward",
            component: () =>
              //import("@/views/mymanage/bandwidthReward/index.vue"),
              import("@/views/mymanage/storagereward/index.vue"),
          },
          {
            path: "releaseList/:id",
            name: "releaseList",
            component: () =>
              import("@/views/mymanage/blockreward/releaseList.vue"),
          },

          {
            path: "addNode",
            name: "MymanageAddNodep",
            component: () => import("@/views/mymanage/node/AddNode.vue"),
          },

          {
            path: "nodepledge/:id",
            name: "MyNodePledge",
            component: () => import("@/views/mymanage/node/NodePledge.vue"),
          },
          {
            path: "nodeBinding/:id",
            name: "NodeBinding",
            component: () => import("@/views/mymanage/node/binding.vue"),
          },
          {
            path: "nodeUpBinding/:id",
            name: "NodeUpBinding",
            component: () => import("@/views/mymanage/node/upbinding.vue"),
          },
          {
            path: "nodeBindingLift/:id",
            name: "NodeBindingLift",
            component: () => import("@/views/mymanage/node/bindinglift.vue"),
          },
          {
            path: "makegood/:id",
            name: "MymanageMakegoodp",
            component: () => import("@/views/mymanage/node/MakeGood.vue"),
          },
          {
            path: "nodeChargerate/:id",
            name: "NodeChargerate",
            component: () => import("@/views/mymanage/node/SetChargeRate.vue"),
          },

          {
            path: "pledgelist/:id",
            name: "MymanagePledge",
            component: () => import("@/views/mymanage/node/pledge.vue"),
          },
          {
            path: "punishment/:id",
            name: "MymanagePunishment",
            component: () => import("@/views/mymanage/node/punishment.vue"),
          },

          {
            path: "mining",
            name: "MymanageMining",
            component: () => import("@/views/mymanage/mining/index.vue"),
          },

          {
            path: "bindingRevenue/:id",
            name: "bindingRevenue",
            component: () =>
              import("@/views/mymanage/mining/bindingRevenue.vue"),
          },
          {
            path: "uppledge/:id",
            name: "MymanageUppledge",
            component: () => import("@/views/mymanage/mining/uppledge.vue"),
          },
          {
            path: "bandwidth/:id",
            name: "MymanageBandwidth",
            component: () => import("@/views/mymanage/mining/bandwidth.vue"),
          },
          {
            path: "join/:id",
            name: "Mymanagejoin",
            component: () => import("@/views/mymanage/mining/join.vue"),
          },
          {
            path: "binding",
            name: "Mymanagebinding",
            component: () => import("@/views/mymanage/mining/binding.vue"),
          },
          {
            path: "bindinglift/:id",
            name: "Mymanagebindinglift",
            component: () => import("@/views/mymanage/mining/bindinglift.vue"),
          },
          /*
          {
            path: 'mininglog',
            name: 'MymanageMiningLog',
            component: () => import('@/views/mymanage/mininglog/index.vue')
          },
           */
          {
            path: "paylog",
            name: "MymanagePayLog",
            component: () => import("@/views/mymanage/paylog/index.vue"),
          },

          /*
          {
            path: 'storageList/:id',
            name: 'MymanageStorageList',
            component: () => import('@/views/mymanage/mining/storageList.vue')
          },
          */
          {
            path: "minerview/:id",
            name: "Mymanageminerview",
            component: () => import("@/views/mymanage/mining/MinerView.vue"),
          },

          {
            path: "marketrental/:id",
            name: "MarketRental",
            component: () => import("@/views/market/Rental.vue"),
          },
          {
            path: "storagerental",
            name: "StorageRental",
            component: () =>
              import("@/views/mymanage/storage/StorageRental.vue"),
          },

          {
            path: "revenuerental",
            name: "RevenueRental",
            component: () =>
              import("@/views/mymanage/storage/RevenueRental.vue"),
          },
          {
            path: "renew/:id",
            name: "Renew",
            component: () => import("@/views/mymanage/storage/Renew.vue"),
          },

          {
            path: "config/:id",
            name: "Config",
            //component: () => import("@/views/mymanage/storage/RentalConfig.vue"),
            component: () => import("@/views/mymanage/storage/upload.vue"),
          },

          {
            path: "configs/:id",
            name: "Configs",
            //component: () => import("@/views/mymanage/storage/StorageConfig.vue"),
            component: () => import("@/views/mymanage/storage/StorageUpload.vue"),
          },

          {
            path: "rentdetail/:id",
            name: "RentDetail",
            component: () => import("@/views/mymanage/storage/RentDetail.vue"),
          },
          {
            path: "storagepledge",
            name: "StoragePledge",
            component: () =>
              import("@/views/mymanage/storage/StoragePledge.vue"),
          },
          {
            path: "storageServicenode",
            name: "StorageServiceNode",
            component: () => import("@/views/mymanage/storage/index.vue"),
          },

          {
            path: "storageBinding/:id",
            name: "StorageBinding",
            component: () => import("@/views/mymanage/storage/binding.vue"),
          },
          {
            path: "storageUpBinding/:id",
            name: "StorageUpBinding",
            component: () => import("@/views/mymanage/storage/upbinding.vue"),
          },
          {
            path: "storageBindingLift/:id",
            name: "StorageBindingLift",
            component: () => import("@/views/mymanage/storage/bindinglift.vue"),
          },

          {
            path: "adjustpg/:id",
            name: "adjustpg",
            component: () => import("@/views/mymanage/storage/modules/adjustpg.vue"),
          },
          {
            path: "stwtpg/:id",
            name: "stwtpg",
            component: () => import("@/views/mymanage/storage/modules/stwtpg.vue"),
          },
          {
            path: "entrustrate/:id",
            name: "entrustRate",
            component: () => import("@/views/mymanage/storage/modules/entrustRate.vue"),
          },
          {
            path: "setstoragepool/:id",
            name: "storagePool",
            component: () => import("@/views/mymanage/storage/modules/storagePool.vue"),
          },
          {
            path: "changerevenue/:id",
            name: "changeRevenue",
            component: () => import("@/views/mymanage/storage/modules/changeRevenue.vue"),
          },
          {
            path: "changemanage/:id",
            name: "changeManage",
            component: () => import("@/views/mymanage/storage/modules/changeManage.vue"),
          },


          {
            path: "contractManagement",
            name: "contractManagement",
            component: () =>
              import("@/views/mymanage/contractManagement/index.vue"),
          },
          {
            path: "extractList/:id",
            name: "extractList",
            component: () =>
              import(
                "@/views/mymanage/contractManagement/withdrawalRelease.vue"
              ),
          },

          {
            path: "delegatemanage",
            name: "DelegateManage",
            component: () =>
              import("@/views/mymanage/node/DelegateManage.vue"),
          },
          {
            path: "posmove/:id?",
            name: "PosMove",
            component: () =>
              import("@/views/mymanage/node/components/posMove.vue"),
          },
          {
            path: "snmove/:id?",
            name: "SnMove",
            component: () =>
              import("@/views/mymanage/node/components/snMove.vue"),
          },
          {
            path: "spmove/:id?",
            name: "SpMove",
            component: () =>
              import("@/views/mymanage/node/components/spMove.vue"),
          },
          {
            path: "storagePool",
            name: "StoragePool",
            component: () =>
              import("@/views/mymanage/storagePool/index.vue"),
          },
          {
            path: "storagePoolAdd",
            name: "storagePoolAdd",
            component: () =>
              import("@/views/mymanage/storagePool/add.vue"),
          },

          {
            path: "storageNodesManage/:id?",
            name: "storageNodesManage",
            component: () =>
              import("@/views/mymanage/storagePool/modules/storageNodesManage.vue"),
          },
          {
            path: "setfeerate/:id",
            name: "setFeeRate",
            component: () => import("@/views/mymanage/storagePool/setFeeRate.vue"),
          },
          {
            path: "setpoolratio/:id",
            name: "setPoolRatio",
            component: () => import("@/views/mymanage/storagePool/setPoolRatio.vue"),
          },

          {
            path: "storagePoolPledge/:id?",
            name: "StoragePoolPledge",
            component: () =>
              import("@/views/mymanage/storagePool/pledge.vue"),
          },
          {
            path: "poolChangeRevenue/:id?",
            name: "poolChangeRevenue",
            component: () =>
              import("@/views/mymanage/storagePool/changeRevenue.vue"),
          },
         
          {
            path: "storagePoolPledgeEN/:id?",
            name: "storagePoolPledgeEN",
            component: () =>
              import("@/views/mymanage/storagePool/entrustPledge.vue"),
          },

          {

            path: "storagePoolNodes/:id?",
            name: "StoragePoolNodes",
            component: () =>
              import("@/views/mymanage/storagePool/nodes.vue"),
          },




        ],
      },


    ],
  },
];



let routerPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(err => err)
}

export default new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
});


/*

// 
const originalPush = Router.prototype.push;
const originalReplace = Router.prototype.replace;

// push
Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject)
    return originalPush.call(this, location, onResolve, onReject);
  return originalPush.call(this, location).catch((err) => err);
};

// replace
Router.prototype.replace = function push(location, onResolve, onReject) {
  if (onResolve || onReject)
    return originalReplace.call(this, location, onResolve, onReject);
  return originalReplace.call(this, location).catch((err) => err);
};

export default new Router({
  mode: 'history',
  //mode: "hash",
  // base: 'cloud',
  scrollBehavior: () => ({
    y: 0,
  }),
  routes: constantRouterMap,
});
*/
