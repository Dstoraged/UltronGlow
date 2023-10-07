import { ethers, BigNumber } from "ethers";
import { Decimal } from "decimal.js";
import * as api from "@/api/api";
import i18n from "@/locales/index.js"
import webSdk from "@/utils/webSdk";
const utils = {};
utils.MAINTOKEN = "UTG";
const storageTypes = ["b", "k", "m", "g", "t"];
const avgBlockTimeNum = window.$url.avgBlockTime;
var totalBlockNumber = null;
let globalDatas = {}
utils.globalDatas_get = function (name) {

  return name ? globalDatas[name] : globalDatas
}
utils.totalBlockNumber_get = function () {
  return totalBlockNumber
}

const dayOneNumber = window.$url.dayOneNumber || 8640;
const rentPercent = window.$url.rentPercent || 0.95;

const pledgeStatus = {
  '-1': { color: '#ff0000', label: "market.status-1" },
  0: { color: '#00caca', label: "market.status0" },
  1: { color: '#999', label: "market.status1" },
  /* 2: { color: '#00caca', label: "market.status2" },
   3: { color: '#00caca', label: "market.status3" },
   4: { color: '#00caca', label: "market.status4" },*/
  5: { color: '#999900', label: "market.status5" },
  6: { color: '#ffe153', label: "market.status6" },
  7: { color: 'red', label: "market.status7" },
}

 utils.Transactions = {
  common: "Transactions.common",
  stProof: "Transactions.stProof",
  Bind: "Transactions.Bind",
  Unbind: "Transactions.Unbind",
  Rebind: "Transactions.Rebind",
  Deposit: "Transactions.Deposit",
  stReq: "Transactions.stReq",
  stExit: "Transactions.stExit",
  stset: "Transactions.stset",
  stRent: "Transactions.stRent",
  stRentPg: "Transactions.stRentPg",
  stReNew: "Transactions.stReNew",
  stReNewPg: "Transactions.stReNewPg",
  stRescind: "Transactions.stRescind",
  stReValid: "Transactions.stReValid",
  chPrice: "Transactions.chPrice",
  CndLock: "Transactions.CndLock",
  RwdLock: "Transactions.RwdLock",
  ExchRate: "Transactions.ExchRate",
  Exch: "Transactions.Exch",
  CandReq: "Transactions.CandReq",
  CandExit: "Transactions.CandExit",
  CandPnsh: "Transactions.CandPnsh",
  FlwLock: "Transactions.FlwLock",
  chbw: "Transactions.chbw",
  TlcChAdmin1: "Transactions.TlcChAdmin1",
  TlcPickup: "Transactions.TlcPickup",
  ContractNew: "Transactions.ContractNew",
  TokenNew: "Transactions.TokenNew",
  TokenTransfer: "Transactions.TokenTransfer",
  stCatchUp: "Transactions.stCatchUp",
  CandEntrust: "Transactions.CandEntrust",
  CandETExit: "Transactions.CandETExit",
  CandChaRate: "Transactions.CandChaRate",
  addsp: "Transactions.addsp",
  spchpg: "Transactions.spchpg",
  spremovesn: "Transactions.spremovesn",
  spwtpg: "Transactions.spwtpg",
  spwtfd: "Transactions.spwtfd",
  spwtexit: "Transactions.spwtexit",
  spexit: "Transactions.spexit",
  spfee: "Transactions.spfee",
  spetrate: "Transactions.spetrate",
  sprvebind: "Transactions.sprvebind",
  editmgaddr: "Transactions.editmgaddr",
  stchpg: "Transactions.stchpg",
  stwtreward: "Transactions.stwtreward",
  setsp: "Transactions.setsp",
  exitsp: "Transactions.exitsp",
  stwtpg: "Transactions.stwtpg",
  wtpgexit: "Transactions.wtpgexit",
  wtfd: "Transactions.wtfd",
  PoSwtfd:"Transactions.PoSwtfd",
  streplace: "Transactions.streplace"

}




utils.getNumber = function (val, tokenA, tokenB, isOrd = true) {
  if (isOrd) {
    return utils.getNumberA(val, tokenA, tokenB);
  } else {
    return utils.getNumberB(val, tokenA, tokenB);
  }
};
/*
utils.clearZero = function (value, num = 8) {
  if (utils.isEmpty(value)) {
    return value
  }
  if (typeof value == "string") {
    value = value.trim()
  }
  value = new Decimal(value || 0).toFixed()
  try {
    value = ethers.utils.formatUnits(BigNumber.from((value || 0) + ""))
    value = utils.weedZero(value, num)
  } catch (error) {
  }
  return value
}
*/

utils.clearZero = function (value, num = 4) {
  if (utils.isEmpty(value)) {
    return "0";
  }

  if (typeof value == "string") {
    value = value.trim();
  }
  value = new Decimal(value || 0).toFixed();
  try {
    value = ethers.utils.formatUnits(BigNumber.from((value || 0) + ""));
    let minus = "";
    if (value < 0) {
      minus = "-";
    }
    value = minus + utils.weedZero(value, num);
  } catch (error) { }
  return value;
};

utils.lockingTime = function (
  startTime,
  avgBlockTime = avgBlockTimeNum,
  unlocknumber,
  releaseHeigth
) {
  avgBlockTime = avgBlockTime === null ? avgBlockTimeNum : avgBlockTime;
  //debugger;
  let lockTime = totalBlockNumber;
  /* Math.floor(
    (new Date().getTime() - startTime) / (avgBlockTime * 1000)
  );*/
  let nowNumber = unlocknumber + releaseHeigth - lockTime;
  if (nowNumber > 0) {
    return Math.ceil(nowNumber / dayOneNumber); // 8640
    //DOTO---
    // return Math.ceil(nowNumber / 120);
  }

  return 0;
};

//
utils.remainingTime = function (rentnumber, rentime) {
  let totalnum = rentnumber + rentime * dayOneNumber; //8640;
  let nowNumber = totalnum - totalBlockNumber;
  if (nowNumber > 0) {
    return Math.floor((nowNumber / dayOneNumber) * 1000) / 1000; //8640
  }
  return 0;
};

utils.rentalTime = function (rentnumber, rentime, renewtime, renewnumber) {
  if (!renewtime) {
    console.log(" renewtime is null");
    let totalnum = rentnumber + rentime * dayOneNumber; //8640;
    let rentalnum = rentnumber + rentime * dayOneNumber * rentPercent; //8640*0.95
    //console.log("lavetime=" + Math.floor(((totalnum - totalBlockNumber) / 120) * 1000) / 1000, "ddd=" + rentime * 0.5, "totalnum=" + totalnum, "rentalnum=" + rentalnum, "totalBlockNumber=" + totalBlockNumber)

    if (totalBlockNumber > rentalnum && totalBlockNumber <= totalnum) {
      return 1;
    } else {
      return 0;
    }
  } else {
    console.log("renewtime not null");

    let rentalnum = renewnumber - renewtime * dayOneNumber * rentPercent; //8640 * 0.95
    //console.log("totalBlockNumber=" + totalBlockNumber, "renewnumber=" + renewnumber, "rentalnum=" + rentalnum,)
    if (totalBlockNumber <= renewnumber && totalBlockNumber > rentalnum) {
      return 1;
    } else {
      return 0;
    }
  }
};

utils.rescindTime = function (rentnumber, rentime, renewtime, renewnumber) {
  if (!renewtime) {
    let totalnum = rentnumber + rentime * dayOneNumber; //8640;
    if (totalnum > totalBlockNumber) {
      return 1;
    } else {
      return 0;
    }
  } else {
    if (renewnumber > totalBlockNumber) {
      return 1;
    } else {
      return 0;
    }
  }
};

utils.plegdeTime = function (plegdenumber, plegtime) {
  let totalnum = plegdenumber + plegtime * dayOneNumber; //8640;
  if (totalBlockNumber > totalnum) {
    return 1;
  } else {
    return 0;
  }
}

utils.loadGlobalDatas = async function () {
  return new Promise((resolve, reject) => {
    api
      .postJson("/platform/getStorageBasicSet", {})
      .then((response) => {
        const data = response.result || {};
        globalDatas = data
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  });
}

utils.getNowHeight = async function () {
  return new Promise((resolve, reject) => {
    /*if (totalBlockNumber) {
      resolve()
      return
    }*/

    // debugger;
    api
      .postJson("/platform/getBlockNumber", "")
      .then((response) => {
        const data = response.result || {};
        totalBlockNumber = data.totalBlockNumber;

        // debugger;
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  });
};

utils.curBlockNumber = function () {
  return totalBlockNumber;
};

utils.lockingNumber = function (
  startTime,
  avgBlockTime = avgBlockTimeNum,
  unlocknumber,
  releaseHeigth,
  releaseinterval,
  totalAmount
) {
  avgBlockTime = avgBlockTime === null ? avgBlockTimeNum : avgBlockTime;
  let lockTime = totalBlockNumber; /*Math.floor(
    (new Date().getTime() - startTime) / (avgBlockTime * 1000)
  );*/

  nowNumber = lockTime - (unlocknumber + releaseHeigth);
  if (nowNumber > 0) {
    return utils.clearZero(totalAmount, 4);
  }

  let nowNumber = unlocknumber - lockTime;
  if (nowNumber >= 0) {
    return 0;
  }
  nowNumber = lockTime - unlocknumber;
  if (releaseHeigth > 0 && releaseinterval > 0 && nowNumber > 0) {
    return utils.clearZero(
      (nowNumber / releaseinterval / (releaseHeigth / releaseinterval)) *
      totalAmount,
      4
    );
  }

  return 0;
};

utils.numberF = 18;

utils.isEmpty = function (val) {
  if (val === undefined || val === null || (val + "").trim() === "") {
    return true;
  } else {
    return false;
  }
};

utils.getUrlParams = function (str) {
  let strs = str.split("&");
  let result = new Object();
  for (var i = 0; i < strs.length; i++) {
    result[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
  }
  return result;
};

utils.isInt = function (val) {
  let regPos = /^\+?[0-9][0-9]*$/;
  if (regPos.test(val)) {
    return true;
  } else {
    return false;
  }
};

utils.isNumber = function (val) {
  let regPos = /^\d+(\.\d+)?$/;
  let regNeg =
    /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/;
  if (regPos.test(val) || regNeg.test(val)) {
    return true;
  } else {
    return false;
  }
};

utils.getHashCode = function (str, caseSensitive) {
  if (!caseSensitive) {
    str = str.toLowerCase();
  }
  var hash = 1315423911,
    i,
    ch;
  for (i = str.length - 1; i >= 0; i--) {
    ch = str.charCodeAt(i);
    hash ^= (hash << 5) + ch + (hash >> 2);
  }

  return hash & 0x7fffffff;
};

utils.weedDecimals = function (val, decimals = 0) {
  if (utils.isEmpty(val)) {
    return "";
  }
  val = new Decimal(val || 0).toFixed();
  let valL = (val + "").replace(/[^\d.]/g, "").trim();
  let valArr = valL.split(".");
  let toStr = "";
  let toStrArr = (valArr.length > 1 ? valArr[1] : "").split("");
  toStrArr.forEach((item) => {
    if (toStr.length < decimals) {
      toStr += item;
    }
  });

  while (toStr.length < decimals) {
    toStr += "0";
  }

  return (valArr[0] || "") + toStr;
};

utils.weedZero = function (val, decimals = 0) {
  if (utils.isEmpty(val)) {
    return "";
  }
  if (typeof val == "string") {
    val = val.trim();
  }
  val = new Decimal(val || 0).toFixed();
  let valL = (val + "").replace(/[^\d.]/g, "").trim();
  let valArr = valL.split(".");
  let first = "";
  let toStr = "";
  let firstArr = valArr[0];
  let toStrArr = (valArr.length > 1 ? valArr[1] : "").split("");
  let zero = false;
  for (let cd = 0; cd < firstArr.length; cd++) {
    if (zero || firstArr[cd] != "0") {
      first += firstArr[cd];
      zero = true;
    }
  }
  zero = false;

  for (let cd = toStrArr.length - 1; cd >= 0; cd--) {
    if (cd < decimals) {
      if (zero || toStrArr[cd] != "0") {
        toStr = toStrArr[cd] + toStr;
        zero = true;
      }
    }
  }

  return (first || "0") + (toStr.length > 0 ? "." + toStr : "");
};

utils.toNumber = function (val, decimals = 0) {
  decimals = decimals > 0 ? decimals - 1 : 0;
  let dec = new Decimal(val);
  if (decimals > 0) {
    dec = dec.mul(Number(`10e${decimals}`));
  }
  return dec.toFixed();
};

/**
 * Storage conversion
 * @ param {*} Val value
 * @param {*} M_ D conversion rule storagetypes contains letters (separated by a '-' minus sign). For example, 'G-B' represents the conversion from GB to byte, and for example, 'B-G' represents the conversion from byte to GB
 * @returns
 */
utils.storage = function (val, type = "b-g") {
  let pypes = type.split("-");
  if (pypes.length < 2) {
    return 0;
  }
  let start = pypes[0];
  let end = pypes[1];

  if (!storageTypes.includes(start) || !storageTypes.includes(end)) {
    return 0;
  }
  let difference = storageTypes.indexOf(start) - storageTypes.indexOf(end);
  let num = Math.pow(1024, Math.abs(difference));
  if (difference >= 0) {
    // From big to small
    val = val ? val * num : 0;
  } else {
    // From small to large
    val = val ? val / num : 0;
  }

  return new Decimal(val).toFixed();
};

utils.bytesToSize = function (bytes) {
  if (bytes === null) return "";
  if (bytes === 0) return "0 B";
  var k = 1024, // or 1000
    sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
    i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(4)) + " " + sizes[i];
};

utils.bytesToSizeNoUnits = function (bytes) {
  if (bytes === null) return "0";
  if (bytes === 0) return "0";
  var k = 1024, // or 1000
    //sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
    i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(4));
};

utils.StoragebytesToSize = function (bytes) {
  if (bytes === 0) return "0.0000 MB";
  var k = 1024, // or 1000
    sizes = ["MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
    i = Math.floor(Math.log(bytes) / Math.log(k));

  return (bytes / Math.pow(k, i)).toFixed(4) + " " + sizes[i];
};

utils.NumberDiv = function (arg1, arg2, digit) {
  var t1 = 0,
    t2 = 0,
    r1,
    r2;
  try {
    t1 = arg1.toString().split(".")[1].length;
  } catch (e) { }
  try {
    t2 = arg2.toString().split(".")[1].length;
  } catch (e) { }
  r1 = Number(arg1.toString().replace(".", ""));
  r2 = Number(arg2.toString().replace(".", ""));
  var result = ((r1 / r2) * Math.pow(10, t2 - t1)).toString();
  var result2 = result.split(".")[1];
  result2 = result2.substring(
    0,
    digit > result2.length ? result2.length : digit
  );

  return result.split(".")[0] + "." + result2;
};
/**
 *
 * @param {*} datas Array
 * @param {*} xName String :"name1"
 * @param {*} yNames String: [{name:"name2",dataType:"value/key_val",getData:Function,propertys:{name: 'Email',type: 'line',stack: 'Total',}},{name:"name2"},]
 * @param {*} type String col/row
 */
utils.chartData = function (datas = [], xName, yNames = [], type = "rows") {
  let xAxisData = [];
  let series = [];
  let legendsData = [];

  let yConfigL = [];
  yNames.forEach((obj) => {
    let propertysL = obj.propertys || {};
    let itemL = { ...propertysL };
    itemL.data = [];
    if (itemL.name) {
      legendsData.push(itemL.name);
      //alert(itemL.name)
    }
    series.push(itemL);
    yConfigL.push({ yValue: itemL, config: obj });
  });

  if (type == "rows") {
    datas.forEach((item) => {
      if (xName) {
        xAxisData.push(item[xName]);
      }
      yConfigL.forEach((obj) => {
        let yValueL = obj.yValue;
        let configL = obj.config;
        let dataL = null;
        dataL =
          configL.dataType == "key_val"
            ? { name: [yValueL.name], value: item[configL.name] }
            : item[configL.name];
        dataL = configL.getData ? configL.getData(item, configL.name) : dataL;
        yValueL.data.push(dataL);
      });
    });
  } else if (type == "cols") {
    let jsonL = Array.isArray(datas)
      ? datas.length > 0
        ? datas[0]
        : null
      : datas;
    if (jsonL) {
      yConfigL.forEach((obj) => {
        let yValueL = obj.yValue;
        let configL = obj.config;
        let dataL = null;
        dataL =
          configL.dataType == "key_val"
            ? { name: [yValueL.name], value: jsonL[configL.name] }
            : jsonL[configL.name];
        dataL = configL.getData ? configL.getData(jsonL) : dataL;
        yValueL.data.push(dataL);
      });
    }
  }
  return {
    xAxisData,
    series,
    legendsData,
  };
};

/**
 * @name: handleCutZero
 * @description:
 * @param {*} num
 * @return {*}num
 */
utils.CutZero = function (old) {
  let num = old.toString();
  let newstr = num;
  //console.log(num.indexOf('.') - 1);
  let leng = num.length - num.indexOf(".") - 1;
  if (num.indexOf(".") > -1) {
    for (let i = leng; i > 0; i--) {
      if (
        newstr.lastIndexOf("0") > -1 &&
        newstr.substr(newstr.length - 1, 1) == 0
      ) {
        let k = newstr.lastIndexOf("0");
        if (newstr.charAt(k - 1) == ".") {
          return newstr.substring(0, k - 1);
        } else {
          newstr = newstr.substring(0, k);
        }
      } else {
        return newstr;
      }
    }
  }
  return num;
};

utils.isMobile = function () {
  let info = navigator.userAgent;
  let agents = [
    "Android",
    "iPhone",
    "SymbianOS",
    "Windows Phone",
    "iPod",
    "iPad",
  ];
  for (let i = 0; i < agents.length; i++) {
    if (info.indexOf(agents[i]) >= 0) return true;
  }
  /*
  let screenWidth=document.body.clientWidth;
  if(screenWidth<768){
    return true;
  }
  */
  return false;
};


utils.getPledgeStatus = function (val) {
  if (utils.isEmpty(val)) return {};
  let item = pledgeStatus[val]
  if (!item) return {};
  let copyItem = Object.assign({}, item)
  copyItem.span = `<span style='color:${copyItem.color}'>${i18n.t(copyItem.label)}</span>`
  return copyItem;
}

utils.getSuffix = function (val, aStr = "", snum = 4) {
  if (!utils.isEmpty(val)) {
    let strL = "";
    let num = 1024;
    let numL = num;
    let valL = val;


    if (valL / numL >= 1) {
      strL = "K";
      valL = val / numL;
      numL *= num;
    }
    if (valL / numL >= 1) {
      strL = "M";
      valL = val / numL;
      numL *= num;
    }
    if (valL / numL >= 1) {
      strL = "G";
      valL = val / numL;
      numL *= num;
    }
    if (val / numL >= 1) {
      strL = "T";
      valL = val / numL;
      numL *= num;
    }
    if (val / numL >= 1) {
      strL = "P";
      valL = val / numL;
      numL *= num;
    }
    if (val / numL >= 1) {
      valL = val / numL;
      strL = "E";
    }
    return utils.weedZero(valL, snum) + " " + strL + aStr;
  }
  return val;
}
utils.computeMap = {
  '+': "add",
  '-': "sub",
  '*': 'mul',
  '/': 'div'
}
utils.uumbersHandle = function (numbers = [], handles = [], num) {
  let first = numbers.length > 0 ? new Decimal(numbers[0] || 0) : null;
  let re = "";

  if (first) {
    numbers.splice(0, 1);
    numbers.forEach((nul, cd) => {
      let handle = handles[cd];
      handle = utils.computeMap[handle];
      first = first[handle](nul || 0);
    })
    re = first.toFixed();
    if (!utils.isEmpty(num)) {
      re = utils.weedZero(re, num)
    }

  }
  return re;
}
utils.getSdk = function (_this_, message = true) {
  let sdk = _this_.$store.getters.getsdk;
  if (!sdk) {
    message && _this_.$notify.error(_this_.$t(`mymanage.notconnectedwallet`));
    return null;
  }
  return sdk
}
utils.walletSelect = function (options = {}) {
  let { _this_, addr, msg = "messages.pleaseManageAddr", isMsg = true, isSDK = true } = options
  let sdk = null;
  if (isSDK) {
    sdk = utils.getSdk(_this_, isMsg);
    if (!sdk) return false;
  }


  //DOTO---
  //addr = "0x6257cE45e2a1f0660F894399DD56a28DA93E636a"

  if (!addr) {

    if (isMsg) {
      _this_.$message({
        message: _this_.$t(`messages.invalidWalletAddress`),
        type: 'error'
      });
    }

    return false;
  }
  let selectAddr = _this_.$store.getters.account;
  console.log(selectAddr)

  try {
    addr = webSdk.sdkUtils.hashToUX(addr, true);
    selectAddr = webSdk.sdkUtils.hashToUX(selectAddr, true);

  } catch (error) {

    return false
  }
  if (selectAddr != addr) {

    if (isMsg) {
      _this_.$message({
        message: `${_this_.$t(msg)}: ${addr}`,
        type: 'error'
      });
    }
    return false;
  }
  return { selectAddr, addr, sdk };
}


utils.timeDifference = function (current, previous) {
  var msPerMinute = 60 * 1000;
  var msPerSecond = 1000;
  var elapsed = current - previous;
  var seconds = Math.floor((elapsed / msPerSecond) % 60);
  var minutes = Math.floor((elapsed / msPerMinute) % 60);
  var hours = Math.floor((elapsed / (msPerMinute * 60)) %
    24);
  var days = Math.floor(elapsed / (msPerMinute * 60 *
    24));
  return {
    'days': days,
    'hours': hours,
    'minutes': minutes,
    'seconds': seconds
  };
};


utils.heightDifference = function (current, type, day = true) {

  let numL = globalDatas[type] || 0
  if (day) {
    numL *= window.$url.dayOneNumber
  }
  let maxHeight = Number(current) + Number(numL)
  console.log("current-maxHeight-totalBlockNumber", current, maxHeight, totalBlockNumber)
  return (totalBlockNumber || 0) > maxHeight
}




export default utils;
