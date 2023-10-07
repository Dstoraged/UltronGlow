import utils from "./utils";
import * as helper from "@/utils/helper";
const clearZero = function (val) {
  return utils.clearZero(val);
};
const getAddrFormat = function (val, num) {
  return helper.getAddrFormat(val, num);
};
const BytesToSize = function (val) {
  return utils.bytesToSize(val);
};
const valMap = {
  0: "additions.blockpledge",
  1: "additions.storagepledge",
};
const valdepMap = {
  6: "additions.calpledgeamount",
  7: "additions.leaserequesttime",
  8: "additions.minleaseduration",
  9: "additions.rentalbaseprice",
};
const statusMap = {
  succ: "additions.status1",
  fail: "additions.status2",
};

const rateZero = function (val) {
  return val/100 +' %';
};

const additions = {
  UTG: {
    Exch: [
      { title: "additions.fuladdr", name: "param1" },
      {
        title: "mymanage.utgnumber",
        name: "param3",
        valFun: clearZero,
        units: "UTG",
      },
      { title: "additions.fulnumber", name: "param4", valFun: clearZero },
    ],
    Bind: [
      {
        title: "additions.deviceaddress",
        name: "param1",
        ftFun: getAddrFormat,
      },
      {
        title: "mymanageMining.revenuesaddress",
        name: "param2",
        ftFun: getAddrFormat,
      },
      {
        title: "additions.revenuetype",
        name: "param3",
        isT: true,
        valMap,
      },
      //{ title: "additions.contractaddress", name: "param5" },
      // { title: "additions.multisignature", name: "param6" },
    ],
    Unbind: [
      {
        title: "additions.deviceaddress",
        name: "param1",
        ftFun: getAddrFormat,
      },
      { title: "additions.deviceatype", name: "param3", isT: true, valMap },
    ],
    Rebind: [
      {
        title: "additions.deviceaddress",
        name: "param1",
        ftFun: getAddrFormat,
      },
      {
        title: "mymanageMining.revenuesaddress",
        name: "param2",
        ftFun: getAddrFormat,
      },
      { title: "additions.revenuetype", name: "param3", isT: true, valMap },
      // { title: "additions.contractaddress", name: "param5" },
      // { title: "additions.multisignature", name: "param6" },
    ],
    CandReq: [
      { title: "absent.address", name: "param1", ftFun: getAddrFormat },
      {
        title: "additions.pledgeutg",
        name: "param4",
        valFun: clearZero,
        units: "UTG",
      },
      { title: "additions.pledgeype", name: "param3", isT: true, valMap },
    ],
    Deposit: [
      { title: "additions.deposittype", name: "param1", isT: true, valdepMap },
      { title: "additions.deviceavalue", name: "param2" },
    ],
    ExchRate: [{ title: "additions.exchratevalue", name: "param1" }],
    CndLock: [
      { title: "additions.lockduration", name: "param1" },
      { title: "additions.releaseduration", name: "param2" },
      { title: "additions.releaseinterval", name: "param3" },
    ],
    RwdLock: [
      { title: "additions.lockduration", name: "param1" },
      { title: "additions.releaseduration", name: "param2" },
      { title: "additions.releaseinterval", name: "param3" },
    ],
    Exch: [
      { title: "additions.exchaddress", name: "param1", ftFun: getAddrFormat },
      {
        title: "additions.exchutg",
        name: "param3",
        valFun: clearZero,
        units: "UTG",
      },
      { title: "additions.exchsrt", name: "param4", valFun: clearZero },
    ],
    CandExit: [
      { title: "absent.address", name: "param1", ftFun: getAddrFormat },
    ],
    CandPnsh: [
      { title: "lock.minerAddress", name: "param1", ftFun: getAddrFormat },
      { title: "node.punishRecharge", name: "param3" },
      { title: "node.recharge", name: "param4", valFun: clearZero },
    ],
    FlwReq: [
      { title: "lock.minerAddress", name: "param1", ftFun: getAddrFormat },
      { title: "mymanageMining.allege", name: "param3" },
      {
        title: "mymanageNode.pledgenum",
        name: "param4",
        valFun: clearZero,
        units: "UTG",
      },
      { title: "pledge.operator", name: "param5" },
    ],
    FlwExit: [
      { title: "mining.minerAddress", name: "param1", ftFun: getAddrFormat },
    ],

    stset: [
      { title: "additions.dstsettype", name: "param1" },
      { title: "additions.stsetvalue", name: "param2" },
    ],
    stProof: [
      { title: "additions.status", name: "param1", isT: true, statusMap },
      {
        title: "additions.deviceaddress",
        name: "param2",
        ftFun: getAddrFormat,
      },
      { title: "additions.bytes", name: "param3" },
      //{ title: "additions.rentalhash", name: "param5"},
    ],

    stReq: [
      { title: "additions.status", name: "param1", isT: true, statusMap },
      {
        title: "additions.deviceaddress",
        name: "param2",
        ftFun: getAddrFormat,
      },
      { title: "additions.storagespace", name: "param3", valFun: BytesToSize },
      { title: "additions.rentalprice", name: "param4", valFun: clearZero },
      {
        title: "additions.pledgeamount",
        name: "param6",
        valFun: clearZero,
        units: "UTG",
      },
    ],
    stExit: [
      { title: "additions.status", name: "param1", isT: true, statusMap },
      {
        title: "additions.deviceaddress",
        name: "param2",
        ftFun: getAddrFormat,
      },
    ],
    chPrice: [
      { title: "additions.status", name: "param1", isT: true, statusMap },
      {
        title: "additions.deviceaddress",
        name: "param2",
        ftFun: getAddrFormat,
      },
      { title: "additions.rentalprice", name: "param4", valFun: clearZero },
    ],
    chbw: [
      { title: "additions.status", name: "param1", isT: true, statusMap },
      {
        title: "additions.deviceaddress",
        name: "param2",
        ftFun: getAddrFormat,
      },
    ],
    stRent: [
      { title: "additions.status", name: "param1", isT: true, statusMap },
      {
        title: "additions.deviceaddress",
        name: "param2",
        ftFun: getAddrFormat,
      },
      { title: "additions.rentedspace", name: "param3", valFun: BytesToSize },
      { title: "additions.rentalprice", name: "param4", valFun: clearZero },
      { title: "additions.rentalhash", name: "param5" },
      { title: "additions.rentalduration", name: "param6" },
    ],
    stRentPg: [
      { title: "additions.status", name: "param1", isT: true, statusMap },
      {
        title: "additions.deviceaddress",
        name: "param2",
        ftFun: getAddrFormat,
      },
      { title: "additions.rentedspace", name: "param3", valFun: BytesToSize },
      { title: "additions.rentalhash", name: "param5" },
    ],
    stReNew: [
      { title: "additions.status", name: "param1", isT: true, statusMap },
      {
        title: "additions.deviceaddress",
        name: "param2",
        ftFun: getAddrFormat,
      },
      { title: "additions.rentalhash", name: "param5" },
      { title: "additions.renewalduration", name: "param6" },
    ],
    stReNewPg: [
      { title: "additions.status", name: "param1", isT: true, statusMap },
      {
        title: "additions.deviceaddress",
        name: "param2",
        ftFun: getAddrFormat,
      },
      { title: "additions.rentalhash", name: "param5" },
      { title: "additions.renewalduration", name: "param6" },
    ],
    stRescind: [
      { title: "additions.status", name: "param1", isT: true, statusMap },
      {
        title: "additions.deviceaddress",
        name: "param2",
        ftFun: getAddrFormat,
      },
      { title: "additions.rentalhash", name: "param5" },
    ],
    stReValid: [
      { title: "additions.status", name: "param1", isT: true, statusMap },
      {
        title: "additions.deviceaddress",
        name: "param2",
        ftFun: getAddrFormat,
      },
      // { title: "additions.rentalhash", name: "param5",ftFun: getAddrFormat},
    ],

    TlcChAdmin1: [
      {
        title: "Transactions.newaddrsss",
        name: "param1",
        ftFun: getAddrFormat,
      },
    ],
    TlcPickup: [
      {
        title: "Transactions.useraddrsss",
        name: "param1",
        ftFun: getAddrFormat,
      },
      {
        title: "Transactions.withdrawalamount",
        name: "param3",
        valFun: clearZero,
        units: "UTG",
      },
    ],

    TokenTransfer: [
      {
        title: "Transactions.transferamount",
        name: "param1",
        valFun: clearZero,
        units: "UTG",
      },
    ],

    stCatchUp: [
      {
        title: "additions.deviceaddress",
        name: "param2",
        ftFun: getAddrFormat,
      },
      {
        title: "additions.totalpaidpledgeamount",
        name: "param4",
        valFun: clearZero,
        valUnit: "UTG",
      },
    ],
    CandEntrust: [
      { title: "additions.nodeaddress", name: "param1", ftFun: getAddrFormat, },
      { title: "additions.pledgeamount", name: "param4", valFun: clearZero, valUnit: "UTG", },
    ],
    CandChaRate: [
      { title: "additions.nodeaddress", name: "param1", ftFun: getAddrFormat, },
      { title: "mymanageNode.chargerate", name: "param3", valFun: rateZero,},
    ],
  },
  SSC: {
    ExchRate: [
      {
        title: "additions.exchangeratio",
        name: "param1",
        valFun: (val) => {
          if (!val) {
            return val;
          }
          return val / 10000;
        },
      },
    ],
    Deposit: [
      { title: "additions.miningpledge", name: "param1", valFun: clearZero },
    ],
    CndLock: [
      { title: "additions.lockupstage", name: "param1" },
      { title: "additions.freedupstage", name: "param2" },
      { title: "additions.interval", name: "param3" },
    ],
    FlwLock: [
      { title: "additions.lockupstage", name: "param1" },
      { title: "additions.freedupstage", name: "param2" },
      { title: "additions.interval", name: "param3" },
    ],
    RwdLock: [
      { title: "additions.lockupstage", name: "param1" },
      { title: "additions.freedupstage", name: "param2" },
      { title: "additions.interval", name: "param3" },
    ],
    WdthPnsh: [
      {
        title: "additions.deviceaddress",
        name: "param1",
        ftFun: getAddrFormat,
      },
      { title: "additions.fulnumber", name: "param2" },
    ],
  },
};

export default additions;
