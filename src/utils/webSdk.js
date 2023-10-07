import { Message } from "element-ui";
import * as ethereumjsutil from "ethereumjs-util";
import { ethers, BigNumber } from "ethers";
import i18n from "@/locales";
import Web3 from "web3";
import utils from "@/utils/utils";
import Abis from "@/utils/Abis";
import { Decimal } from "decimal.js";
var Tx = require("ethereumjs-tx");

import {
  MAINFIX,
  getAddress as getprefixAddress,
  toAddress,
  splitAddress,
} from "@prefixConfig";

const netUrl = window.$url.netUrl;
const netId = window.$url.netId;
const webSdk = {
  ownerConfig: [
    { label: "contract.administrators", name: "owner", type: "addr" },
    {
      label: "contract.withdrawableAmount",
      name: "calReleaseFund",
      type: "bignumber",
      suffix: " UTG",
    },
    {
      label: "contract.amountWithdrawn",
      name: "withdrawAmount",
      type: "bignumber",
      suffix: " UTG",
    },
    { label: "contract.lockStart", name: "_lockupstart", type: "day" },
    { label: "additions.freedupstage", name: "_releaseperiod", type: "day" },
    { label: "additions.interval", name: "_releaseinterval", type: "day" },
    { label: "contract.releaseTimes", name: "_releasetimes", type: "day" },
  ],
  typeJson: {
    exch: { first: "UTG:1:Exch", assembly: ["first", "addr1", "value"] }, // "UTG1Exch",
    Bind: {
      first: "UTG:1:Bind",
      assembly: ["first", "addr1", "type", "contractAddr", "signaddr", "revenueAddr"],
    }, //"UTG1Bind",
    flwreq: {
      first: "UTG:1:FlwReq",
      assembly: ["first", "addr1", "operator", "mbps"],
    }, //"UTG1FlwReq",
    rebind: {
      first: "UTG:1:Rebind",
      assembly: [
        "first",
        "addr1",
        "type",
        "contractAddr",
        "signaddr",
        "revenueAddr",
      ],
    },
    flwexit: { first: "UTG:1:FlwExit", assembly: ["first", "addr1"] },
    candreq: { first: "UTG:1:CandReq", assembly: ["first", "addr1"] },
    candentrust: { first: "UTG:1:CandEntrust", assembly: ["first", "addr1", "amount"] },
    candetexit: { first: "UTG:1:CandETExit", assembly: ["first", "addr1", "hash"] },
    candpnsh: { first: "UTG:1:CandPnsh", assembly: ["first", "addr1"] },
    candexit: { first: "UTG:1:CandExit", assembly: ["first", "addr1"] },
    unbind: { first: "UTG:1:Unbind", assembly: ["first", "addr1", "type"] },
    candcharate: { first: "UTG:1:CandChaRate", assembly: ["first", "addr1", "charate"] },

    stRent: {
      first: "UTG:1:stRent",
      assembly: ["first", "addr1", "spaces", "time", "price"],
    },
    stReNew: {
      first: "UTG:1:stReNew",
      assembly: ["first", "addr1", "renthash", "time"],
    },
    stRescind: {
      first: "UTG:1:stRescind",
      assembly: ["first", "addr1", "renthash"],
    },
    stExit: {
      first: "UTG:1:stExit",
      assembly: ["first", "addr1"],
    },
    stRentPg: {
      first: "UTG:1:stRentPg",
      assembly: [
        "first",
        "addr1",
        "renthash",
        "spaces",
        "roothash",
        "rentfile",
      ],
    },
    stReNewPg: {
      first: "UTG:1:stReNewPg",
      assembly: [
        "first",
        "addr1",
        "renthash",
        "spaces",
        "roothash",
        "rentfile",
      ],
    },

    spchpg: {
      first: "UTG:1:spchpg",
      assembly: [
        "first",
        "hash",
        "bigNum"
      ],
    },
    spwtpg: {
      first: "UTG:1:spwtpg",
      assembly: [
        "first",
        "hash",
        "bigNum"
      ],
    },
    spexit: {
      first: "UTG:1:spexit",
      assembly: [
        "first",
        "hash"
      ],
    },
    spremovesn: {
      first: "UTG:1:spremovesn",
      assembly: [
        "first",
        "hash",
        "addr1"
      ],
    },

    PoSwtfd: {
      first: "UTG:1:PoSwtfd",
      assembly: [
        "first",
        "addr1",
        "type",
        "addr2"
      ],
    },
    spwtfd: {
      first: "UTG:1:spwtfd",
      assembly: [
        "first",
        "addr1",
        "type",
        "addr2"
      ],
    },
    wtfd: {
      first: "UTG:1:wtfd",
      assembly: [
        "first",
        "addr1",
        "type",
        "addr2"
      ],
    },
    stwtpg: {
      first: "UTG:1:stwtpg",
      assembly: [
        "first",
        "addr1",
        "bigNum"
      ],
    },
    stchpg: {
      first: "UTG:1:stchpg",
      assembly: [
        "first",
        "addr1",
        "bigNum"
      ],
    },
    addsp: {
      first: "UTG:1:addsp",
      assembly: [
        "first",
        "bigNum",
        "rates",
        "ratio",
        "addr1",

      ],
    },
    addspt: {
      first: "UTG:1:addsp",
      assembly: [
        "first",
        "bigNum",
        "rates",
        "ratio"

      ],
    },
    spremovesn: {
      first: "UTG:1:spremovesn",
      assembly: [
        "first",
        "hash",
        "addr1"
      ],
    },
    stwtreward: {
      first: "UTG:1:stwtreward",
      assembly: [
        "first",
        "addr1",
        "ratio"
      ],
    },
    setsp: {
      first: "UTG:1:setsp",
      assembly: [
        "first",
        "addr1",
        "hash"
      ],
    },
    editmgaddr: {
      first: "UTG:1:editmgaddr",
      assembly: [
        "first",
        "addr1",
        "addr2"
      ],
    },
    exitsp: {
      first: "UTG:1:exitsp",
      assembly: [
        "first",
        "addr1"
      ],
    },
    spfee: {
      first: "UTG:1:spfee",
      assembly: [
        "first",
        "hash",
        "ratio"
      ],
    },
    spetrate: {
      first: "UTG:1:spetrate",
      assembly: [
        "first",
        "hash",
        "ratio"
      ],
    },
    sprvebind: {
      first: "UTG:1:sprvebind",
      assembly: [
        "first",
        "hash",
        "type",
        "addr1"
      ],
    }
    ,
    sprveunbind: {
      first: "UTG:1:sprvebind",
      assembly: [
        "first",
        "hash",
        "type"
      ],
    },
    spwtexit:{
      first: "UTG:1:spwtexit",
      assembly: [
        "first",
        "addr1",
        "hash",
      ],
    },
    wtpgexit:{
      first: "UTG:1:wtpgexit",
      assembly: [
        "first",
        "addr1",
        "hash",
        
      ],
    },

  },
  sdkUtils: {
    NumberToString(val, isHex = false) {

      let valL = new Decimal(val || "0")

      if (isHex) {
        valL = valL.toHex();
        if (valL.substring(0, 2) == "0x") {
          valL = valL.slice(2);
        }
        return valL;
      } else {
        return valL.toFixed();
      }


    },
    networkChanged: function (fun) {
      if (window.ethereum) {
        window.ethereum.on("chainChanged", (networkIDstring) => {
          fun(networkIDstring);
        });
      }
    },
    netWorkOk() {
      if (!window.ethereum) {
        return false;
      }
      let netIdInt = parseInt(netId, 16);
      let netIdIntL = parseInt(window.ethereum.chainId || "0");
      return netIdInt == netIdIntL;
    },
    accountsChanged: function (fun) {
      if (window.ethereum) {
        window.ethereum.on("accountsChanged", (accounts) => {
          fun(accounts[0]);
        });
      }
    },

    async getEnable(funL) {
      if (!window.ethereum) {
        Message.error(`Please install Basemeta first`);
        return new Promise((resolve, reject) => {
          reject();
        });
      }

      /* if (!window.ethereumNX) {
         Message.error(`Please install the Basemeta wallet`);
 
         return new Promise((resolve, reject) => {
           reject();
         });
       }*/

      return new Promise((resolve, reject) => {
        let rpcUrls = [];
        rpcUrls.push(netUrl);
        if (netUrl.indexOf("https") < 0) {
          rpcUrls.push(netUrl.replace("http", "https"));
        }

        let AddEthereumChainParameter = [
          {
            chainId: netId, // A 0x-prefixed hexadecimal string
            chainName: "UTG",
            nativeCurrency: {
              name: "UTG",
              symbol: "UTG", // 2-6 characters long
              decimals: 18,
            },
            rpcUrls: rpcUrls,
          },
        ];
        let netIdInt = parseInt(netId, 16);
        window.ethereum
          .request({
            method: "eth_requestAccounts",
          })
          .then((addr) => {

            window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: netId }],
            }).then(() => {
              resolve(addr);
            }).catch((err) => {
              window.ethereum
                .request({
                  method: "wallet_addEthereumChain",
                  params: AddEthereumChainParameter,
                })
                .then((response) => {
                  resolve(response);
                })
                .catch((err) => {
                  Message.error(
                    `Add Network RPC Url：${netUrl} \n chainId：${netIdInt}`
                  );
                  reject(err);
                });
            })

          })
          .catch((err) => {
            reject(err);
          });
        resolve();
      });
    },

    async erc20Sign(json, value) {
      return new Promise((resolve, reject) => {
        let jsonL = {
          data: json.data,
          to: json.to,
          value,
        };
        this.aOri(
          "erc20Sign",
          "erc20SginResult",
          JSON.stringify(jsonL),
          (hash) => {
            resolve(hash || {});
          }
        );
      });
    },
    getAddress(addr) {
      addr = getprefixAddress(addr);

      try {
        addr = ethers.utils.getAddress(addr);
      } catch (error) { }


      return toAddress(addr);
    },
    getSelectAddress() {
      if (window.ethereum) {
        let address = "";
        if (window.ethereum.selectedAddress) {
          address = window.ethereum.selectedAddress;
        } else if (window.ethereum.address) {
          address = window.ethereum.address;
        } else if (window.web3.currentProvider.address) {
          address = window.web3.currentProvider.address;
        }

        return address;
      } else {
        return "";
      }
    },
    dataUtil(assemblyJson = {}, datas = {}) {

      let assembly = assemblyJson.assembly;
      let u = ethers.utils;
      let from = webSdk.sdkUtils.getSelectAddress();

      let first = assemblyJson.first;
      let addr1 = utils.isEmpty(datas.addr1)
        ? ""
        : this.getAddress(datas.addr1).slice(2);
      let addr2 = utils.isEmpty(datas.addr2)
        ? ""
        : this.getAddress(datas.addr2).slice(2);
      let signaddr = utils.isEmpty(datas.signaddr)
        ? ""
        : this.getAddress(datas.signaddr).slice(2);
      let contractAddr = utils.isEmpty(datas.contractAddr)
        ? ""
        : this.getAddress(datas.contractAddr).slice(2);
      let revenueAddr = utils.isEmpty(datas.revenueAddr)
        ? ""
        : this.getAddress(datas.revenueAddr).slice(2);

      let deviceaddr = utils.isEmpty(datas.deviceaddr)
        ? ""
        : this.getAddress(datas.deviceaddr).slice(2);
      let spaces = utils.isEmpty(datas.spaces)
        ? "0"
        : Number(datas.spaces || "0").toString();
      let time = utils.isEmpty(datas.time)
        ? "0"
        : Number(datas.time || "0").toString();
      let price = utils.isEmpty(datas.price)
        ? "0"
        : Number(datas.price || "0").toString();
      let ratio = utils.isEmpty(datas.ratio)
        ? "0"
        : Number(datas.ratio || "0").toString();
      let rates = utils.isEmpty(datas.rates)
        ? "0"
        : Number(datas.rates || "0").toString();


      let renthash = utils.isEmpty(datas.renthash)
        ? ""
        : this.getAddress(datas.renthash).slice(2);

      let type = datas.type;
      let value = utils.isEmpty(datas.value)
        ? "0"
        : BigNumber.from(utils.weedDecimals(datas.value || "0", 18))._hex.slice(
          2
        );

      let mbps = utils.isEmpty(datas.mbps)
        ? "0"
        : Number(datas.mbps || "0").toString(16);

      let operator = utils.isEmpty(datas.operator)
        ? "0"
        : this.NumberToString(datas.operator, true)//  Number(datas.operator || "0").toString(16);

      let amount = utils.isEmpty(datas.amount)
        ? "0"
        : this.NumberToString(datas.amount, true) //Number(datas.amount || "0").toString(16);


      let hash = utils.isEmpty(datas.hash)
        ? ""
        : this.getAddress(datas.hash).slice(2);

      let charate = utils.isEmpty(datas.charate)
        ? "0"
        : this.NumberToString(datas.charate, true) //Number(datas.charate || "0").toString(16);

      let bigNum = utils.isEmpty(datas.bigNum) ? "0" : utils.toNumber(datas.bigNum, 18)

      let dataL = {
        first,
        addr1,
        addr2,
        signaddr,
        contractAddr,
        revenueAddr,

        deviceaddr,
        renthash,
        spaces,
        time,
        price,

        amount,
        hash,
        charate,

        value,
        type,
        mbps,
        operator,
        ratio,
        rates,
        bigNum
      };
      let data = "";

      assembly.forEach((key) => {
        data += data.length > 0 ? ":" + dataL[key] : dataL[key];
      });
      // console.log("assemblyJson:"+JSON.toString(assemblyJson))
      console.log("data:", data)
      dataL = u.hexlify(u.toUtf8Bytes(data));

      return {
        from,
        to: from, //u.getAddress(bossAddr),
        value: "0", //val._hex,
        data: dataL,
      };
    },
    hashToNX(valHex, cut = false) {
      if (valHex && valHex.substring(0, 2) === "0x") {
        valHex = valHex.trim();
        if (cut) {
          valHex = valHex.slice(2);
        } else {
          valHex = toAddress(valHex);
        }
      }
      return valHex;
    },

    hashToUX(valHex, dFix = false, toLow = false) {

      let address = toAddress(valHex)
      if (dFix) {
        address = splitAddress(address).value;
      }
      if (dFix || toLow) {
        address = address ? address.toLocaleLowerCase() : address;
      }

      return address
    },

    splitAddress(addr, fix = true) {
      if (fix) {
        return getprefixAddress(addr);
      }
      return splitAddress(addr).value;
    },

    verifyAddress(addr) {
      let ckaddr = "";
      try {
        ckaddr = this.splitAddress(addr, false);
      } catch (error) {
        console.log(error);
        return false;
      }
      return ethers.utils.isAddress(ckaddr);
    },

    setDataStatus(windata, type) {
      if (!windata) return;
      switch (type) {
        case 1:
          windata.subContext = `<span style='color:orange'>${i18n.t(
            "messages.pleaseconfirm"
          )}</span>`;
          break;
        case 2:
          windata.subContext = `<span style='color:blue'>${i18n.t(
            "messages.confirmed"
          )}</span>`;
          windata.closebtnshow = windata.closebtnshow !== false;
          break;

        case 3:
          windata.subContext = "";
          break;
      }
    },
  },

  sdk: class {
    constructor(bassContract) {
      this.bassContract = bassContract;
    }

    personalSign(message, address) {
      return new Promise((resolve, reject) => {
        address = getprefixAddress(address);
        this.bassContract.signer.signMessage(message)
          /*  debugger
            console.log(signerL)
            this.bassContract.currentProvider.request({
                method: "personal_sign",
                params: [message, address],
            })*/
          .then((sign) => {
            resolve({ sign, address });
          })
          .catch((err) => {
            reject(err);
          });


      })
    }

    getBalance(address) {
      /*
      let address = webSdk.sdkUtils.getSelectAddress();
      return new Promise((resolve, reject) => {
        this.bassContract.active_WalletOrSigner.provider.getBalance(address).then(response => {
          resolve(ethers.utils.formatUnits(response));
        }).catch(err => {
          reject(err)
        })
      })
      */
      const bprovider = new ethers.providers.Web3Provider(window.ethereum)
      return new Promise((resolve, reject) => {
        bprovider.getBalance(address).then((balance) => {
          resolve(ethers.utils.formatUnits(balance));
        }).catch(err => {
          reject(err)
        })
      })
    }

    sendTransactionTo(assembly, datas, windata) {
      if (windata) {
        windata.subContext = `<span style='color:orange'>${i18n.t(
          "messages.pleaseconfirm"
        )}</span>`;
      }


      //debugger
      return new Promise((resolve, reject) => {

        let json = webSdk.sdkUtils.dataUtil(assembly, datas);

        let paramsL = {
          method: "eth_sendTransaction",
          params: [json],
        };
        let requestL = ethereum.request;
        window.ethereum.request(paramsL)
          .then((response) => {
            if (windata) {
              windata.subContext = `<span style='color:blue'>${i18n.t(
                "messages.confirmed"
              )}</span>`;
              windata.closebtnshow = windata.closebtnshow !== false;
            }

            this.waitForTransaction(response)
              .then((re) => {
                if (windata) {
                  windata.subContext = "";
                }
                resolve(re);
              })
              .catch((err) => {
                if (windata) {
                  windata.subContext = "";
                }
                reject(err);
              });
          })
          .catch((err) => {
            if (windata) {
              windata.subContext = "";
            }
            reject(err);
          });
      });
    }
    toSignStr(random, devAdd) {
      return new Promise((resolve, reject) => {
        devAdd = devAdd.toLocaleLowerCase().slice(2);
        let from = webSdk.sdkUtils.getSelectAddress();
        from = from.toLocaleLowerCase();
        let fromL = from.slice(2);
        let signStr = random + devAdd + fromL;
        let hashL = ethers.utils.toUtf8Bytes(signStr);
        let test = ethers.utils.keccak256(hashL);
        let provider = window.web3.currentProvider; // this.bassContract.active_WalletOrSigner.provider
        let web3 = new Web3(provider, null, {
          transactionConfirmationBlocks: 1,
        });
        let singObj = web3.eth.sign;
        let backFun = async (err, sign) => {
          if (err) {
            reject(err);
            return;
          }

          console.log(ethers.utils.splitSignature(sign));

          let singL = ethers.utils.splitSignature(sign);

          var item = [];
          let ethUtil = ethereumjsutil;
          item.push(ethUtil.unpadBuffer(ethUtil.toBuffer(singL.v)));
          item.push(ethUtil.unpadBuffer(ethUtil.toBuffer(singL.r)));
          item.push(ethUtil.unpadBuffer(ethUtil.toBuffer(singL.s)));
          let hexv = ethUtil.rlp.encode(item);
          let sig = "0x" + this.buf2hex(hexv);
          let reJson = { sigAdd: fromL, sig, devAdd };

          resolve(reJson);
        };

        singObj(test, from, backFun).catch((err) => {
          reject(err);
        });
      });
    }
    toPool(contractAddr, multaddr, to, windata) {
      if (windata) {
        windata.subContext = `<span style='color:blue'>${i18n.t(
          "messages.pleaseconfirm"
        )}</span>`;
      }
      return new Promise((resolve, reject) => {
        let contract = this.bassContract.createContractInstance(
          contractAddr,
          Abis.PoollErc,
          this.bassContract.active_WalletOrSigner.provider
        );

        contract
          .bindMultAddr(multaddr, to)
          .then((response) => {
            if (windata) {
              windata.subContext = `<span style='color:blue'>${i18n.t(
                "messages.confirmed"
              )}</span>`;
            }
            this.waitForTransaction(response.hash)
              .then((re) => {
                if (windata) {
                  windata.subContext = "";
                }
                resolve(re);
              })
              .catch((err) => {
                if (windata) {
                  windata.subContext = "";
                }
                reject(err);
              });
          })
          .catch((err) => {
            if (windata) {
              windata.subContext = "";
            }
            reject(err);
          });
      });
    }
    getOwnerContract(contractAddr) {
      contractAddr = getprefixAddress(contractAddr);
      return this.bassContract.createContractInstance(
        contractAddr,
        Abis.ownerManage2,
        this.bassContract.active_WalletOrSigner.provider
      );
    }

    ownerApprove(contractAddr, approveAmountBig, setData) {
      let contract = this.getOwnerContract(contractAddr);

      return new Promise((resolve, reject) => {
        webSdk.sdkUtils.setDataStatus(setData, 1);
        contract
          .approve(approveAmountBig)
          .then((response) => {
            webSdk.sdkUtils.setDataStatus(setData, 2);
            this.waitForTransaction(response.hash)
              .then((re) => {
                webSdk.sdkUtils.setDataStatus(setData, 3);
                resolve(re);
              })
              .catch((err) => {
                webSdk.sdkUtils.setDataStatus(setData, 3);
                reject(err);
              });
          })
          .catch((err) => {
            webSdk.sdkUtils.setDataStatus(setData, 3);
            reject(err);
          });
      });
    }

    transferOwner(contractAddr, addr, setData) {
      let contract = this.getOwnerContract(contractAddr);
      return new Promise((resolve, reject) => {
        addr = getprefixAddress(addr);

        webSdk.sdkUtils.setDataStatus(setData, 1);
        contract
          .transferOwner(addr)
          .then((response) => {
            this.waitForTransaction(response.hash)
              .then((re) => {
                webSdk.sdkUtils.setDataStatus(setData, 3);
                resolve(re);
              })
              .catch((err) => {
                webSdk.sdkUtils.setDataStatus(setData, 3);
                reject(err);
              });
          })
          .catch((err) => {
            reject(err);
            webSdk.sdkUtils.setDataStatus(setData, 3);
          });
      });
    }

    transferSecondOwner(contractAddr, addr, setData) {
      let contract = this.getOwnerContract(contractAddr);
      return new Promise((resolve, reject) => {
        addr = getprefixAddress(addr);

        webSdk.sdkUtils.setDataStatus(setData, 1);
        contract
          .transferSecondOwner(addr)
          .then((response) => {
            this.waitForTransaction(response.hash)
              .then((re) => {
                webSdk.sdkUtils.setDataStatus(setData, 3);
                resolve(re);
              })
              .catch((err) => {
                webSdk.sdkUtils.setDataStatus(setData, 3);
                reject(err);
              });
          })
          .catch((err) => {
            reject(err);
            webSdk.sdkUtils.setDataStatus(setData, 3);
          });
      });
    }

    grantProfit(contractAddr, addr, num, setData) {
      let contract = this.getOwnerContract(contractAddr);
      let numL = new Decimal(num || 0);
      let numBig = utils.toNumber(numL.toFixed(), 18);
      return new Promise((resolve, reject) => {
        addr = getprefixAddress(addr);

        webSdk.sdkUtils.setDataStatus(setData, 1);

        contract
          .grantProfit(addr, numBig)
          .then((response) => {
            this.waitForTransaction(response.hash)
              .then((re) => {
                webSdk.sdkUtils.setDataStatus(setData, 3);
                resolve(re);
              })
              .catch((err) => {
                webSdk.sdkUtils.setDataStatus(setData, 3);
                reject(err);
              });
          })
          .catch((err) => {
            reject(err);
            webSdk.sdkUtils.setDataStatus(setData, 3);
          });
      });
    }

    calReleaseFund(contractAddr, addr) {
      return new Promise((resolve, reject) => {
        addr = getprefixAddress(addr);
        let contract = this.getOwnerContract(contractAddr);
        contract
          .calReleaseFund(addr)
          .then((response) => {
            resolve(ethers.utils.formatUnits(response));
          })
          .catch((err) => {
            reject(err);
          });
      });
    }

    withdrawalReleaseFund(contractAddr, setData) {
      return new Promise((resolve, reject) => {
        let contract = this.getOwnerContract(contractAddr);
        webSdk.sdkUtils.setDataStatus(setData, 1);

        contract
          .withdrawalReleaseFund()
          .then((response) => {
            this.waitForTransaction(response.hash)
              .then((re) => {
                webSdk.sdkUtils.setDataStatus(setData, 3);
                resolve(re);
              })
              .catch((err) => {
                webSdk.sdkUtils.setDataStatus(setData, 3);
                reject(err);
              });
          })
          .catch((err) => {
            reject(err);
            webSdk.sdkUtils.setDataStatus(setData, 3);
          });
      });
    }

    lockupCancel(contractAddr, address, height, setData) {
      address = getprefixAddress(address);
      return new Promise((resolve, reject) => {
        height = parseInt(height);
        let contract = this.getOwnerContract(contractAddr);
        webSdk.sdkUtils.setDataStatus(setData, 1);

        contract
          .lockupCancel(address, height)
          .then((response) => {
            this.waitForTransaction(response.hash)
              .then((re) => {
                webSdk.sdkUtils.setDataStatus(setData, 3);
                resolve(re);
              })
              .catch((err) => {
                webSdk.sdkUtils.setDataStatus(setData, 3);
                reject(err);
              });
          })
          .catch((err) => {
            reject(err);
            webSdk.sdkUtils.setDataStatus(setData, 3);
          });
      });
    }

    getBalance(addr) {
      return new Promise((resolve, reject) => {
        addr = getprefixAddress(addr);
        //debugger
        ethereum
          .request({
            method: "eth_getBalance",
            params: [addr, "latest"],
          })
          .then((response) => {
            resolve(ethers.utils.formatUnits(response));
          })
          .catch((err) => {
            reject(err);
          });
      });
    }
    ownerManageData(contractAddr, datas = {}) {
      let contract = this.getOwnerContract(contractAddr);
      let setVal = function (re, item = {}) {
        switch (item.type) {
          case "addr":
            datas[item.name] = toAddress(re);
            datas[item.name] = datas[item.name]
              ? datas[item.name].toLocaleLowerCase()
              : datas[item.name];
            break;
          case "bignumber":
            datas[item.name] = re ? ethers.utils.formatUnits(re) : "0.0";
            break;
          case "day":
            datas[item.name] = re || 0;
            break;
        }
      };

      webSdk.ownerConfig.forEach((item) => {
        if (contract[item.name]) {
          contract[item.name]()
            .then((re) => {
              setVal(re, item);
            })
            .catch((err) => {
              //console.error(err)
            });
        }
      });
    }
    buf2hex(buffer) {
      return Array.prototype.map
        .call(new Uint8Array(buffer), (x) => ("00" + x.toString(16)).slice(-2))
        .join("");
    }

    async transactionSing(type, val, payAddr, toVal = true, subjoin) {
      let json = webSdk.sdkUtils.dataUtil(type, val, payAddr, toVal, subjoin);
      let provider = window.web3.currentProvider; // this.bassContract.active_WalletOrSigner.provider
      let web3 = new Web3(provider, null, { transactionConfirmationBlocks: 1 });
      const web3Private = web3; // privateChainWeb3;
      const nonce = await web3Private.eth.getTransactionCount(json.from);
      const gasPrice = web3.eth.getGasPrice();
      const gasLimit = web3.eth.estimateGas({
        to: json.to,
        data: json.data,
      });
      let netIdInt = parseInt(netId, 16);
      const rawTx = {
        nonce,
        gasPrice: web3.utils.toHex(gasPrice),
        gasLimit: web3.utils.toHex(gasLimit),
        to: json.to,
        value: json.value,
        data: json.data,
        from: json.from,
        chainId: netIdInt,
      };

      var tx = new Tx(rawTx);
      var hash = "0x" + this.buf2hex(tx.hash(false));

      web3.eth.sign(hash, json.from, async (err, sign) => {
        if (err) return console.error(err);
        var r = sign.substring(2, 66);
        var s = sign.substring(66, 66 + 64);
        var v = sign.substring(66 + 64);
        console.log("r: " + r);
        console.log("s: " + s);
        console.log("v: " + v);

        var sig = {
          r: "0x" + r,
          s: "0x" + s,
          v: parseInt(v, 16),
        };

        if (tx._chainId > 0) {
          sig.v += tx._chainId * 2 + 8;
        }
        Object.assign(tx, sig);

        var hash = "0x" + this.buf2hex(tx.hash(true));

        var serializedTx = tx.serialize();
        let hashL = "0x" + serializedTx.toString("hex");

        ethereum
          .request({
            method: "eth_sendRawTransaction",
            params: [hashL],
          })
          .then((response) => {
            //
          })
          .catch((err) => {
            reject(err);
          });
      });
    }

    sendTransaction(hash) {
      return new Promise((resolve, reject) => {
        let provider = this.bassContract.active_WalletOrSigner.provider;

        provider
          .sendTransaction(hash)
          .then((response) => {
            this.waitForTransaction(response.hash)
              .then((responset) => {
                resolve(responset);
              })
              .catch((err) => {
                reject(err);
              });
          })
          .catch((err) => {
            reject(err);
          });
      });
    }

    waitForTransaction(hash) {
      return new Promise((resolve, reject) => {
        let provider = this.bassContract.active_WalletOrSigner.provider;
        // debugger;
        provider
          .waitForTransaction(hash)
          .then((receipt) => {
            if (receipt.status == 1) {
              resolve(receipt);
            } else {
              reject(receipt);
            }
          })
          .catch((err) => {
            reject(err);
          });
      });
    }
  },
};

export default webSdk;
