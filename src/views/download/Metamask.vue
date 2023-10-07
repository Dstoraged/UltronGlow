<template>
    <div>
        <div class="container-fluid">
            <div class="card" style="margin-top: 40px">
                <div class="card-body" style="min-height: 400px; text-align: left; padding-top: 30px">
                    <h4 class="mt-0 header-title" style="text-align: left">
                        Metamask Wallet
                    </h4>

                    <div style="margin-left:20px;margin-top: 30px">
                        <h5>{{ $t("download.metamask1") }}</h5>
                        <p>
                            <span style="">{{ $t("download.metamask2") }}</span>
                            <span>
                                    <a href="https://chrome.google.com/webstore?utm_source=chrome-ntp-icon"
                                        target="_blank"><span
                                            style="color:#386FE5;">https://chrome.google.com/webstore?utm_source=chrome-ntp-icon</span></a>
                                </span>
                        </p>
                        <p><img src="@/assets/metamask/image002.png"  width="552" height="261"/></p>
                    </div>
                    

                    <div style="margin-left:20px;margin-top: 30px">
                        <h5>{{ $t("download.metamask5") }}</h5>  
                        <p>{{ $t("download.metamask8") }}</p>                     
                        <p>Network Name:UTG_MAIN</p>
                        <p>New RPC URL:https://rpc.ultronglow.io</p>
                        <p>Chain ID:188</p>
                        <p>Currency Symbol:UTG</p>                     
                        
                        <p><img src="@/assets/metamask/image010.jpg"  width="554" height="389"/></p>
                    </div>
                    
                  
                </div>
            </div>
        </div>
    </div>
</template>
  <script>
export default {
    methods: {
        dowloadFile() {
            window.open("");
        },
    },
};
</script>
  <style scoped>
  .center-context {
      min-height: 400px;
      text-align: center;
      padding-top: 20px;
  }
  </style>
  