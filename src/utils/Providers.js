import { ethers } from "ethers";
import web3 from "web3";
export default class Providers {
  static isBasemetaProvider() {
    return Boolean(window.ethereum);
  }

  static createProvider(url) {
    if (url) {
      return new ethers.providers.Web3Provider(
        new web3.providers.HttpProvider(url)
      );
    }

    if (Providers.isBasemetaProvider()) {
      return new ethers.providers.Web3Provider(window.ethereum);
    } else {
      alert("Please install the Basemeta wallet");
    }
  }
}
