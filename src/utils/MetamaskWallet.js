import Providers from "./Providers";

export default class MetamaskWallet {
  constructor(url) {
    this.initProvider(url);
    this.signer = this.provider.getSigner();
  }

  initProvider(url) {
    if (url) {
      this.provider = this.provider = Providers.createProvider(url);
      return;
    }

    if (!Providers.isBasemetaProvider()) {
      throw Error("Please install the Basemeta  wallet");
    }
    this.provider = this.provider = Providers.createProvider();
  }
}
