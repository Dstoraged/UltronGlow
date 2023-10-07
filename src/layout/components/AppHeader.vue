<template>
  <div class="header-bg">
    <!-- Navigation Bar-->
    <header id="topnav">
      <div class="topbar-main">
        <div class="container-fluid">
          <div style="float: left; padding-right: 10px">
            <a
              href="javascript:void(0);"
              class="logo"
              @click="handleSelect('', 'Dashboard')"
              v-show="phoneShow('Dashboard')"
            >
              <img
                src="@/assets/images/logo-dark.png"
                class="logo-lg"
                alt
                height="40"
              />
            </a>
          </div>

          <div id="navigation" style="float: right; padding: 10px">
            <ul
              class="navigation-menu"
              style="width: 100%"
              id="menu_navigation"
            >
              <li class="has-submenu" v-show="phoneShow('Dashboard')">
                <a
                  href="javascript:void(0);"
                  @click="handleSelect('', 'Dashboard')"
                  >{{ $t("menu.Home") }}</a
                >
              </li>
              <li class="has-submenu" v-show="phoneShow('Blockchain')">
                <a
                  href="javascript:void(0);"
                  @click="handleMenu($event)"
                  name="Blockchain"
                >
                  {{ $t("menu.Blockchain") }}
                  <i class="on ion-ios-arrow-down"></i>
                </a>
                <ul class="submenu">
                  <li v-show="phoneShow('ViewBlocks')">
                    <a
                      href="javascript:void(0);"
                      @click="handleSelect('ViewBlocks', '')"
                      >{{ $t("menu.block") }}</a
                    >
                  </li>
                  <li v-show="phoneShow('ViewTxns')">
                    <a
                      href="javascript:void(0);"
                      @click="handleSelect('ViewTxns', '')"
                      >{{ $t("menu.tran") }}</a
                    >
                  </li>
                  <li v-show="phoneShow('Accounts')">
                    <a
                      href="javascript:void(0);"
                      @click="handleSelect('Accounts', '')"
                      >{{ $t("menu.accounts") }}</a
                    >
                  </li>
                  <li v-show="phoneShow('Contract')">
                    <a
                      href="javascript:void(0);"
                      @click="handleSelect('Contract', '')"
                      >{{ $t("menu.contract") }}</a
                    >
                  </li>
                  <li class="dropdown-divider"></li>
                  <li v-show="phoneShow('UltronNodes')">
                    <a
                      href="javascript:void(0);"
                      @click="handleSelect('UltronNodes', '')"
                      >{{ $t("menu.ultronnode") }}</a
                    >
                  </li>
                  <li v-show="phoneShow('storagePools')">
                    <a
                      href="javascript:void(0);"
                      @click="handleSelect('StoragePools', '')"
                      >{{ $t("menu.storagePool") }}</a
                    >
                  </li>
                  <li v-show="phoneShow('StorageNode')">
                    <a
                      href="javascript:void(0);"
                      @click="handleSelect('StorageNode', '')"
                      >{{ $t("menu.storagenode") }}</a
                    >
                  </li>

                  <li class="dropdown-divider"></li>
                  <li v-show="phoneShow('ViewAbsent')">
                    <a
                      href="javascript:void(0);"
                      @click="handleSelect('ViewAbsent', '')"
                      >{{ $t("menu.absent") }}</a
                    >
                  </li>
                  
                </ul>
              </li>

              <li class="has-submenu" v-show="phoneShow('MenuToken')">
                <a
                  href="javascript:void(0);"
                  @click="handleMenu($event)"
                  name="MenuToken"
                >
                  {{ $t("menu.token") }}
                  <i class="on ion-ios-arrow-down"></i>
                </a>
                <ul class="submenu">
                  <li v-show="phoneShow('ViewToken')">
                    <a
                      href="javascript:void(0);"
                      @click="handleSelect('Tokens', '')"
                      >{{ $t("menu.tokenUrc20") }}</a
                    >
                  </li>

                  <li v-show="phoneShow('ViewToken')">
                    <a
                      href="javascript:void(0);"
                      @click="handleSelect('Tokentxns', '')"
                      >{{ $t("menu.erc20transfers") }}</a
                    >
                  </li>
                  <li class="dropdown-divider"></li>
                  <li v-show="phoneShow('ViewToken')">
                    <a
                      href="javascript:void(0);"
                      @click="handleSelect('Tokens-nft', '')"
                      >{{ $t("menu.tokenUrc721") }}</a
                    >
                  </li>
                  <li v-show="phoneShow('ViewToken')">
                    <a
                      href="javascript:void(0);"
                      @click="handleSelect('Tokentxns-nft', '')"
                      >{{ $t("menu.erc721transfers") }}</a
                    >
                  </li>
                  <li class="dropdown-divider"></li>
                  <li v-show="phoneShow('ViewToken')">
                    <a
                      href="javascript:void(0);"
                      @click="handleSelect('Tokens-nft1155', '')"
                      >{{ $t("menu.tokenUrc1155") }}</a
                    >
                  </li>
                  <li v-show="phoneShow('ViewToken')">
                    <a
                      href="javascript:void(0);"
                      @click="handleSelect('Tokentxns-nft1155', '')"
                      >{{ $t("menu.erc1155transfers") }}</a
                    >
                  </li>
                </ul>
              </li>

              <li
                class="has-submenu last-elements"
                v-show="phoneShow('MenuReward')"
                id="menu-reward"
              >
                <a
                  href="javascript:void(0);"
                  @click="handleMenu($event)"
                  name="MenuReward"
                >
                  {{ $t("menu.reward") }}
                  <i class="on ion-ios-arrow-down"></i>
                </a>
                <ul class="submenu megamenu">
                  <li>
                    <ul>
                      <li v-show="phoneShow('blockreward')">
                        <span
                          style="
                            padding-left: 24px;
                            font-size: 16px;
                            font-weight: bold;
                          "
                        >
                          {{ $t("menu.blockreward") }}
                        </span>
                      </li>
                      <li v-show="phoneShow('NodeReward')">
                        <a
                          href="javascript:void(0);"
                          @click="handleSelect('NodeReward', '')"
                          >{{ $t("menu.ultronnodereward") }}</a
                        >
                      </li>
                      <li v-show="phoneShow('Nodeaward')">
                        <a
                          href="javascript:void(0);"
                          @click="handleSelect('Nodeaward', '')"
                          >{{ $t("menu.nodeawarddetails") }}</a
                        >
                      </li>
                      <li v-show="phoneShow('NodeLock')">
                        <a
                          href="javascript:void(0);"
                          @click="handleSelect('NodeLock', '')"
                          >{{ $t("menu.exitpledgelock") }}</a
                        >
                      </li>
                      <li v-show="phoneShow('EntrustedPledgeLock')">
                        <a
                          href="javascript:void(0);"
                          @click="handleSelect('EntrustedPledgeLock', '')"
                          >{{ $t("menu.entrustpledgeexitlock") }}</a
                        >
                      </li>
                    </ul>
                  </li>
                  <li>
                    <ul>
                      <li v-show="phoneShow('storagereward')">
                        <span
                          style="
                            padding-left: 24px;
                            font-size: 16px;
                            font-weight: bold;
                          "
                        >
                          {{ $t("menu.storagereward") }}
                        </span>
                      </li>
                      <li v-show="phoneShow('StorageReward')">
                        <a
                          href="javascript:void(0);"
                          @click="handleSelect('StorageReward', '')"
                          >{{ $t("menu.storagenodereward") }}</a
                        >
                      </li>
                      <li v-show="phoneShow('BandwidthLock')">
                        <a
                          href="javascript:void(0);"
                          @click="handleSelect('BandwidthLock', '')"
                          >{{ $t("menu.storagerewarddetails") }}</a
                        >
                      </li>
                      <li v-show="phoneShow('RentalReward')" v-if="false">
                        <a
                          href="javascript:void(0);"
                          @click="handleSelect('RentalReward', '')"
                          >{{ $t("menu.rentalrewarddetails") }}</a
                        >
                      </li>
                      <li v-show="phoneShow('StorageLock')">
                        <a
                          href="javascript:void(0);"
                          @click="handleSelect('StorageLock', '')"
                        >
                          <!-- {{ $t("menu.exitpledgelock") }} -->
                          {{ $t("menu.pledgereturnlock") }}
                        </a>
                      </li>
                      <li v-show="phoneShow('entrustAwards')">
                        <a
                          href="javascript:void(0);"
                          @click="handleSelect('entrustAwards', '')"
                        >
                          <!-- {{ $t("menu.exitpledgelock") }} -->
                          {{ $t("menu.entrustRewardLock") }}
                        </a>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <ul>
                      <li v-show="phoneShow('storagePoolReward')">
                        <span
                          style="
                            padding-left: 24px;
                            font-size: 16px;
                            font-weight: bold;
                          "
                        >
                          {{ $t("menu.storagePoolReward") }}
                        </span>
                      </li>
                      <li v-show="phoneShow('storagePoolReward')">
                        <a
                          href="javascript:void(0);"
                          @click="handleSelect('storagePoolsAwards', '')"
                          >{{ $t("menu.storagePoolReward") }}</a
                        >
                      </li>
                      <li v-show="phoneShow('storagePoolLock')">
                        <a
                          href="javascript:void(0);"
                          @click="handleSelect('storagePoolLock', '')"
                          >{{ $t("menu.pledgereturnlock") }}</a
                        >
                      </li>
                      <li v-show="phoneShow('storagePoolRntrustAwards')">
                        <a
                          href="javascript:void(0);"
                          @click="handleSelect('storagePoolRntrustAwards', '')"
                          >{{ $t("menu.entrustRewardLock") }}</a
                        >
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>

              <li class="has-submenu  last-elements" v-show="phoneShow('MenuMarket')">
                <a
                  href="javascript:void(0);"
                  @click="handleMenu($event)"
                  name="MenuMarket"
                >
                  {{ $t("menu.Resources") }}
                  <i class="on ion-ios-arrow-down"></i>
                </a>
                <ul class="submenu">
                  <li v-show="phoneShow('Market')">
                    <a
                      href="javascript:void(0);"
                      @click="handleSelect('Market', '')"
                      >{{ $t("menu.storagemarket") }}</a
                    >
                  </li>
                </ul>
              </li>

              <li class="has-submenu last-elements" v-show="phoneShow('MenuTool')">
                <a
                  href="javascript:void(0);"
                  @click="handleMenu($event)"
                  name="MenuTool"
                >
                  {{ $t("menu.tools") }}
                  <i class="on ion-ios-arrow-down"></i>
                </a>
                <ul class="submenu ">
                  <li v-show="phoneShow('MymanageNode')">
                    <a
                      href="javascript:void(0);"
                      @click="handleSelect('MymanageNode', '')"
                      >{{ $t("menu.ultronnodemanagement") }}</a
                    >
                  </li>

                  <li class="dropdown-divider"></li>
                  <li v-show="phoneShow('handleDevice')">
                    <a href="javascript:void(0);" @click="handleDevice">{{
                      $t("menu.storagenodemanagement")
                    }}</a>
                  </li>

                  <li class="dropdown-divider"></li>
                  <li v-show="phoneShow('handleDocumentation')" v-if="true">
                    <a href="javascript:void(0);" @click="handleDocumentation">
                      {{ $t("menu.APIDocumentation") }}
                    </a>
                  </li>

                  <li class="dropdown-divider"></li>
                  <li v-show="phoneShow('DownloadWallte')">
                    <a
                      href="javascript:void(0);"
                      @click="handleSelect('DownloadWallte', '')"
                    >
                      {{ $t("menu.wallet") }}(BaseMeta)
                    </a>
                  </li>
                  <li v-show="phoneShow('Metamask')">
                    <a
                      href="javascript:void(0);"
                      @click="handleSelect('Metamask', '')"
                    >
                      {{ $t("menu.wallet") }}(MetaMask)
                    </a>
                  </li>

                  <li class="dropdown-divider"></li>
                  <li v-show="phoneShow('handleContractIDE')">
                    <a href="javascript:void(0);" @click="handleContractIDE">{{
                      $t("menu.contractdep")
                    }}</a>
                  </li>

                  <li v-show="phoneShow('VerifyContract')">
                    <a
                      href="javascript:void(0);"
                      @click="handleSelect('VerifyContract', '')"
                    >
                      {{ $t("menu.VerifyContract") }}
                    </a>
                  </li>

                  <!--
                  <li v-show="phoneShow('testUrl')">
                    <a href="javascript:void(0);" @click="handleTesturl">{{
                      $t("menu.testurl")
                    }}</a>
                  </li>
                  -->
                  <li class="dropdown-divider"></li>
                  <li v-show="phoneShow('RewardsCalculator')">
                    <a
                      href="javascript:void(0);"
                      @click="handleSelect('RewardsCalculator', '')"
                    >
                      {{ $t("menu.rewardscalculator") }}
                    </a>
                  </li>

                  <li class="dropdown-divider" v-if="showTranPath"></li>
                  <li v-show="phoneShow('TransferPath')" v-if="showTranPath">
                    <a
                      href="javascript:void(0);"
                      @click="handleSelect('TransferPath', '')"
                      >{{ $t("menu.transferpath") }}</a
                    >
                  </li>

                  <!-- 
                                 
                  <li v-for="item in deviceList" :key="item.id">
                    <ul>
                      <li v-for="val in item.childlist" :key="val.id">
                        <a href="javascript:void(0);" @click="handleSingleDevice(val)">{{ val.name }}</a>
                      </li>
                    </ul>
                  </li>
                  -->
                </ul>
              </li>

              <li
                class="has-submenu last-elements"
                v-show="phoneShow('mymanage')"
              >
                <a
                  href="javascript:void(0);"
                  @click="handleMenu($event)"
                  name="mymanage"
                >
                  {{ $t("menu.my") }}
                  <i class="on ion-ios-arrow-down"></i>
                </a>
                <ul class="submenu megamenu">
                  <li v-show="phoneShow('Mymanage')">
                    <ul>
                      <li>
                        <span
                          style="
                            padding-left: 24px;
                            font-size: 16px;
                            font-weight: bold;
                          "
                        >
                          {{ $t("mymanage.my") }}
                        </span>
                      </li>
                      <li v-show="phoneShow('overview')">
                        <a
                          href="javascript:void(0);"
                          @click="handleSelect('Mymanage', '')"
                          >{{ $t("mymanage.overview") }}</a
                        >
                      </li>
                      <li v-show="phoneShow('MymanagePayLog')">
                        <a
                          href="javascript:void(0);"
                          @click="handleSelect('MymanagePayLog', '')"
                          >{{ $t("mymanage.rechargerecord") }}</a
                        >
                      </li>

                      <li v-show="phoneShow('DelegateManage')" v-if="true">
                        <a
                          href="javascript:void(0);"
                          @click="handleSelect('DelegateManage', '')"
                          >{{ $t("node.delegatemanage") }}</a
                        >
                      </li>
                    </ul>
                  </li>

                  <li v-show="phoneShow('BlockMiner')">
                    <ul>
                      <li>
                        <span
                          style="
                            padding-left: 24px;
                            font-size: 16px;
                            font-weight: bold;
                          "
                        >
                          {{ $t("mymanage.BlockMiner") }}
                        </span>
                      </li>
                      <li v-show="phoneShow('MymanageNode')">
                        <a
                          href="javascript:void(0);"
                          @click="handleSelect('MymanageNode', '')"
                          >{{ $t("mymanage.nodemanagement") }}</a
                        >
                      </li>
                      <li v-show="phoneShow('producedBlock')">
                        <a
                          href="javascript:void(0);"
                          @click="handleSelect('producedBlock', '')"
                          >{{ $t("mymanage.producedBlock") }}</a
                        >
                      </li>
                      <li v-show="phoneShow('blockreward')">
                        <a
                          href="javascript:void(0);"
                          @click="handleSelect('blockreward', '')"
                          >{{ $t("mymanage.blockreward") }}</a
                        >
                      </li>
                    </ul>
                  </li>

                  <li v-show="phoneShow('storagemanage')">
                    <ul>
                      <li>
                        <span
                          style="
                            padding-left: 24px;
                            font-size: 16px;
                            font-weight: bold;
                          "
                        >
                          {{ $t("mymanage.storagemanage") }}
                        </span>
                      </li>
                      <li v-show="phoneShow('StorageServiceNode')">
                        <a
                          href="javascript:void(0);"
                          @click="handleSelect('StorageServiceNode', '')"
                          >{{ $t("menu.storagenode") }}</a
                        >
                      </li>
                      <li v-show="phoneShow('bandwidthReward')">
                        <a
                          href="javascript:void(0);"
                          @click="handleSelect('bandwidthReward', '')"
                          >{{ $t("mymanage.BandwidthReward") }}</a
                        >
                      </li>
                      <li v-show="phoneShow('StorageRental')">
                        <a
                          href="javascript:void(0);"
                          @click="handleSelect('StorageRental', '')"
                          >{{ $t("menu.storagerental") }}</a
                        >
                      </li>
                      <li v-show="phoneShow('RevenueRental')">
                        <a
                          href="javascript:void(0);"
                          @click="handleSelect('RevenueRental', '')"
                          >{{ $t("menu.revenuerental") }}</a
                        >
                      </li>
                      <li v-show="phoneShow('StoragePledge')">
                        <a
                          href="javascript:void(0);"
                          @click="handleSelect('StoragePledge', '')"
                          >{{ $t("menu.storagepledge") }}</a
                        >
                      </li>
                      <li v-show="phoneShow('storagePool')">
                        <a
                          href="javascript:void(0);"
                          @click="handleSelect('StoragePool', '')"
                          >{{ $t("menu.storagePool") }}</a
                        >
                      </li>
                    </ul>
                  </li>

                  <li v-if="false">
                    <ul>
                      <li>
                        <span
                          style="
                            padding-left: 24px;
                            font-size: 16px;
                            font-weight: bold;
                          "
                        >
                          {{ $t("contract.contract") }}
                        </span>
                      </li>
                      <li>
                        <a
                          href="javascript:void(0);"
                          @click="handleSelect('contractManagement', '')"
                          >{{ $t("contract.mycontract") }}</a
                        >
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>

              <li
                class="has-submenu"
                style="background-color: #ff0004; float: right"
              ></li>

              <li class="has-submenu" style="padding: 0 6px" v-if="false">
                <span style="padding-left: 10px; padding-right: 10px">{{
                  $t("menu.CurrentNetwork")
                }}</span>
              </li>

              <li class="has-submenu" v-if="false">
                <ul class="navigation-menu">
                  <li class="has-submenu">
                    <a
                      href="javascript:void(0);"
                      @click="handleMenu($event)"
                      name="LangName"
                    >
                      {{ langName }}
                      <i class="on ion-ios-arrow-down"></i>
                    </a>
                    <ul class="submenu">
                      <li>
                        <a
                          href="javascript:void(0);"
                          @click="setLanguages('zh-cn')"
                          >{{ $t("menu.langzh") }}</a
                        >
                      </li>
                      <li>
                        <a
                          href="javascript:void(0);"
                          @click="setLanguages('en')"
                          >{{ $t("menu.langen") }}</a
                        >
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>

              <li class="has-submenu" style="padding: 0 0px" v-if="false">
                <a
                  href="javascript:void(0);"
                  @click="handleSelect('', 'Login')"
                >
                  <i class="fa fa-user-circle mr-1"></i>
                  {{ $t("menu.singin") }}
                </a>
              </li>

              <li class="has-submenu last-elements" style="padding: 0 0px">
                <ul class="navigation-menu">
                  <li class="has-submenu">
                    <a
                      href="javascript:void(0);"
                      @click="handleMenu($event)"
                      name="UrlLink"
                    >
                      <img
                        src="@/assets/images/utg_inter11.png"
                        width="20"
                        height="15"
                        style="margin-top: -3px"
                      />
                    </a>
                    <ul class="submenu">
                      <li>
                        <a
                          href="javascript:void(0);"
                          @click="handleMainurl"
                          style="color: #2ebac6"
                          >{{ $t("menu.mainurl") }}</a
                        >
                      </li>

                      <li class="dropdown-divider"></li>
                      <li>
                        <a href="javascript:void(0);" @click="handleTesturl">{{
                          $t("menu.testurl")
                        }}</a>
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
            </ul>
          </div>

          <ul class="navbar-right ml-auto list-inline float-right mb-0">
            <li
              class="menu-item dropdown notification-list list-inline-item"
              style="padding: 20px 10px"
            >
              <a class="navbar-toggle nav-link" @click="handleNavLink($event)">
                <div class="lines">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </a>
            </li>
          </ul>
          <!-- end menu-extras -->
          <div class="clearfix"></div>
        </div>
        <!-- end container -->
      </div>
    </header>
  </div>
</template>
<script>
import * as helper from "@/utils/helper";
import { getValue, setValue } from "@/utils/auth";
import utils from "@/utils/utils";
/*$(document).ready(function () {
  $(function () {
    
    $(".navbar-toggle").on("click", function (event) {
      $(this).toggleClass("open");
      $("#navigation").slideToggle(400);
      console.log(event);
    });

    $(".navigation-menu>li").slice(-1).addClass("last-elements");

    $('.navigation-menu li.has-submenu a[href="#"]').on("click", function (e) {
      if ($(window).width() < 1450) {
        e.preventDefault();
        $(this)
          .parent("li")
          .toggleClass("open")
          .find(".submenu:first")
          .toggleClass("open");
      }
    });

    $(".navigation-menu a").each(function () {
      var pageUrl = window.location.href.split(/[?#]/)[0];
      if (this.href == pageUrl) {
        $(this).parent().addClass("active"); // add active to li of the current link
        $(this).parent().parent().parent().addClass("active"); // add active class to an anchor
        $(this).parent().parent().parent().parent().parent().addClass("active"); // add active class to an anchor
      }
    });
  });
});*/

export default {
  name: "AppHeader",
  props: {},

  data() {
    const PHONE_SHOW_MENUS = window.$url.PHONE_SHOW_MENUS || [];
    return {
      PHONE_SHOW_MENUS,
      langName: "",
      navIndex: "",
      NISWAP_URL: window.$url.UNISWAP_URL,
      deviceUrl: window.$url.deviceUrl,
      navTab: true,
      oldScrollTop: 0,
      scrollTop: 0,
      deviceList: [],
      remixUrl: window.$url.remixUrl,
      testWebUrl: window.$url.testWebUrl,
      mainWebUrl: window.$url.mainWebUrl || "https://www.ultronscan.io/",
      showTranPath: window.$url.showTranPath || false,
    };
  },
  created() {
    this.deviceList = [];
    window.addEventListener("scroll", this.handleScroll);

    window.addEventListener("setItemEvent", (e) => {
      console.log(e.key, e.value);
      this.getLocalDevice();
    });

    this.getLocalDevice();
  },
  mounted() {
    this.handleScroll();
    this.langName = this.getLangNames(this.$i18n.locale) || "English";

    window.onresize = () => {
      if ($(window).width() >= 1024) {
        let oDiv = document.getElementById("navigation");
        oDiv && (oDiv.style.cssText = "float: right; padding: 10px;");
      }
    };
  },

  beforeDestroy() {
    window.removeEventListener("scroll", this.handleScroll);
  },

  methods: {
    phoneShow(name) {
      if (!this.isMobile()) return true;
      if (this.PHONE_SHOW_MENUS.length == 0) return true;
      return this.PHONE_SHOW_MENUS.includes(name);
    },
    handleNavLink(event) {
      $(".navbar-toggle").toggleClass("open");
      $("#navigation").slideToggle(400);
    },

    handleMenu(event) {
      //console.log("event.currentTarge:"+event.currentTarget.name)
      let domName = event.currentTarget.name;
      if ($(window).width() <= 1024) {
        event.preventDefault();
        $('a[name="' + domName + '"]')
          .parent("li")
          .toggleClass("open")
          .find(".submenu:first")
          .toggleClass("open");

        let mNavigation = document.getElementById("navigation");
        mNavigation.scrollTop = mNavigation.scrollHeight;
      }
    },

    setLanguages(lang) {
      //localStorage.setItem("lang", lang);
      this.$i18n.locale = lang;
      setValue("locale", lang);
      this.langName = this.getLangNames(lang);
      //location.reload();
    },

    getLangNames(lang) {
      if (lang == "zh-cn") {
        return "CN";
      } else if (lang == "en") {
        return "English";
      }
    },

    getLang() {
      return getValue("locale");
    },

    handleSelect(key, keyPath) {
      if (key == "") {
        key = keyPath;
      }
      this.navIndex = keyPath[0];
      console.log("handleSelect=" + key);
      helper.goUrl(this, key, "");
    },

    handleLogin() {
      helper.goUrl(this, "Login", "");
    },

    handleDevice() {
      console.log(window.$url.deviceUrl, window.$url.netUrl);
      window.open(this.deviceUrl, "_blank");
    },

    handleDocumentation() {
      let docUrl = window.$url.apiDocZhUrl;

      if (this.$i18n.locale === "en") docUrl = window.$url.apiDocEnUrl;
      else docUrl = window.$url.apiDocZhUrl;

      window.open(docUrl, "_blank");
    },

    handleContractIDE() {
      window.open(this.remixUrl, "_blank");
    },

    handleTesturl() {
      window.open(this.testWebUrl, "_blank");
    },

    handleMainurl() {
      window.open(this.mainWebUrl, "_blank");
    },

    handleSingleDevice(item) {
      console.log(window.$url.deviceUrl + item.id);
      window.open(this.deviceUrl + item.id, "_blank");
    },
    getLocalDevice() {
      //let localdevice = eval("(" + window.localStorage.getItem("traffic_To_list") + ")");
      let localdevice = JSON.parse(
        window.localStorage.getItem("traffic_To_list") || "[]"
      );
      this.deviceList = [];
      let jsonDevice = {};
      for (var i in localdevice) {
        if (i % 4 == 0) {
          jsonDevice = {
            id: "dev" + i,
            childlist: [],
          };
          this.deviceList.push(jsonDevice);
        }

        console.log(localdevice[i].name);
        let prod = {};
        prod.id = localdevice[i].random;
        prod.name = localdevice[i].name;
        prod.url = localdevice[i].url;
        prod.random = localdevice[i].random;
        jsonDevice.childlist.push(prod);
      }
    },

    getHsonLength(json) {
      var jsonLength = 0;
      for (var i in json) {
        jsonLength++;
      }
      return jsonLength;
    },

    handleScroll() {
      window.addEventListener("scroll", () => {
        this.scrollTop =
          document.documentElement.scrollTop ||
          document.body.scrollTop ||
          window.pageYOffset;
      });
    },
  },
  computed: {
    isMobile() {
      return utils.isMobile;
    },
  },
  watch: {
    scrollTop(newValue, oldValue) {
      setTimeout(() => {
        if (newValue === window.scrollY) {
          if (this.oldScrollTop > newValue || newValue < 100) {
            this.navTab = true;
          } else {
            // } else if (this.isPhone) {
            this.navTab = false;
          }
          this.oldScrollTop = newValue;
        }
      }, 15);
    },
  },
};
</script>
<style lang="scss" scoped>
</style>
