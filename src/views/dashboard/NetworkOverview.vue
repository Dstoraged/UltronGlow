<template>
  <div class="row">
    <div class="col-xl-12">
      <div class="card messages">
        <div class="card-body" style="padding: 0px">
          <div
            class="media"
            style="
              display: -webkit-flex;
              display: flex;
              -webkit-align-items: center;
              align-items: center;
              padding: 10px 20px;
              border-bottom: 1px solid #ebebeb;
            "
          >
            <img
              class="d-flex mr-3 thumb-sm"
              src="@/assets/images/icon_dq.png"
              style="width: 20px; height: 20px"
            />
            <h4 class="font-16 m-1">{{ $t("home.networkoverview") }}</h4>
          </div>
          <div class="row" style="padding: 0px; margin: 0px">
            <div class="col-md-2" style="border-right: 1px solid #e7e7e7">
              <div
                class="media"
                style="
                  display: -webkit-flex;
                  display: flex;
                  -webkit-align-items: center;
                  align-items: center;
                  -webkit-justify-content: center;
                  justify-content: center;
                  border-bottom: 1px solid #e7e7e7;
                  padding: 20px 0;
                "
              >
                <div
                  class="media-body align-self-center"
                  style="text-align: center"
                >
                  <h4 class="font-14 m-1">
                    {{ $t("home.activeultronnodes") }}
                  </h4>
                  <h4 class="font-16 m-1">
                    <span style="font-size: 16pt; color: #2ebac6">10867</span>
                  </h4>
                </div>
              </div>
            </div>
            <div class="col-md-2" style="border-right: 1px solid #e7e7e7">
              <div
                class="media"
                style="
                  display: -webkit-flex;
                  display: flex;
                  -webkit-align-items: center;
                  align-items: center;
                  -webkit-justify-content: center;
                  justify-content: center;
                  border-bottom: 1px solid #e7e7e7;
                  padding: 20px 0;
                "
              >
                <div
                  class="media-body align-self-center"
                  style="text-align: center"
                >
                  <h4 class="font-14 m-1">
                    {{ $t("home.totalnetworkstorage") }}
                  </h4>
                  <h4 class="font-16 m-1">
                    <span style="font-size: 16pt; color: #2ebac6">10867</span>
                  </h4>
                </div>
              </div>
            </div>
            <div class="col-md-2" style="border-right: 1px solid #e7e7e7">
              <div
                class="media"
                style="
                  display: -webkit-flex;
                  display: flex;
                  -webkit-align-items: center;
                  align-items: center;
                  -webkit-justify-content: center;
                  justify-content: center;
                  border-bottom: 1px solid #e7e7e7;
                  padding: 20px 0;
                "
              >
                <div
                  class="media-body align-self-center"
                  style="text-align: center"
                >
                  <h4 class="font-14 m-1">
                    {{ $t("home.totalstoragetraffic") }}
                  </h4>
                  <h4 class="font-16 m-1">
                    <span style="font-size: 16pt; color: #2ebac6">10867</span>
                  </h4>
                </div>
              </div>
            </div>
            <div class="col-md-2" style="border-right: 1px solid #e7e7e7">
              <div
                class="media"
                style="
                  display: -webkit-flex;
                  display: flex;
                  -webkit-align-items: center;
                  align-items: center;
                  -webkit-justify-content: center;
                  justify-content: center;
                  border-bottom: 1px solid #e7e7e7;
                  padding: 20px 0;
                "
              >
                <div
                  class="media-body align-self-center"
                  style="text-align: center"
                >
                  <h4 class="font-14 m-1">{{ $t("home.totalpledgedutg") }}</h4>
                  <h4 class="font-16 m-1">
                    <span style="font-size: 16pt; color: #2ebac6">10867</span>
                  </h4>
                </div>
              </div>
            </div>
            <div class="col-md-2" style="border-right: 1px solid #e7e7e7">
              <div
                class="media"
                style="
                  display: -webkit-flex;
                  display: flex;
                  -webkit-align-items: center;
                  align-items: center;
                  -webkit-justify-content: center;
                  justify-content: center;
                  border-bottom: 1px solid #e7e7e7;
                  padding: 20px 0;
                "
              >
                <div
                  class="media-body align-self-center"
                  style="text-align: center"
                >
                  <h4 class="font-14 m-1">{{ $t("home.totallockedutg") }}</h4>
                  <h4 class="font-16 m-1">
                    <span style="font-size: 16pt; color: #2ebac6">10867</span>
                  </h4>
                </div>
              </div>
            </div>
            <div class="col-md-2">
              <div
                class="media"
                style="
                  display: -webkit-flex;
                  display: flex;
                  -webkit-align-items: center;
                  align-items: center;
                  -webkit-justify-content: center;
                  justify-content: center;
                  border-bottom: 1px solid #e7e7e7;
                  padding: 20px 0;
                "
              >
                <div
                  class="media-body align-self-center"
                  style="text-align: center"
                >
                  <h4 class="font-14 m-1">{{ $t("home.totaladdresses") }}</h4>
                  <h4 class="font-16 m-1">
                    <span style="font-size: 16pt; color: #2ebac6">10867</span>
                  </h4>
                </div>
              </div>
            </div>
            <div class="col-md-2" style="border-right: 1px solid #e7e7e7">
              <div
                class="media"
                style="
                  display: -webkit-flex;
                  display: flex;
                  -webkit-align-items: center;
                  align-items: center;
                  -webkit-justify-content: center;
                  justify-content: center;
                  border-bottom: 1px solid #e7e7e7;
                  padding: 20px 0;
                "
              >
                <div
                  class="media-body align-self-center"
                  style="text-align: center"
                >
                  <h4 class="font-14 m-1">{{ $t("home.hoursposreward") }}</h4>
                  <h4 class="font-16 m-1">
                    <span style="font-size: 16pt; color: #2ebac6">10867</span>
                  </h4>
                </div>
              </div>
            </div>
            <div class="col-md-2" style="border-right: 1px solid #e7e7e7">
              <div
                class="media"
                style="
                  display: -webkit-flex;
                  display: flex;
                  -webkit-align-items: center;
                  align-items: center;
                  -webkit-justify-content: center;
                  justify-content: center;
                  border-bottom: 1px solid #e7e7e7;
                  padding: 20px 0;
                "
              >
                <div
                  class="media-body align-self-center"
                  style="text-align: center"
                >
                  <h4 class="font-14 m-1">{{ $t("home.hoursposrreward") }}</h4>
                  <h4 class="font-16 m-1">
                    <span style="font-size: 16pt; color: #2ebac6">10867</span>
                  </h4>
                </div>
              </div>
            </div>
            <div class="col-md-2" style="border-right: 1px solid #e7e7e7">
              <div
                class="media"
                style="
                  display: -webkit-flex;
                  display: flex;
                  -webkit-align-items: center;
                  align-items: center;
                  -webkit-justify-content: center;
                  justify-content: center;
                  border-bottom: 1px solid #e7e7e7;
                  padding: 20px 0;
                "
              >
                <div
                  class="media-body align-self-center"
                  style="text-align: center"
                >
                  <h4 class="font-14 m-1">{{ $t("home.hourspotsreward") }}</h4>
                  <h4 class="font-16 m-1">
                    <span style="font-size: 16pt; color: #2ebac6">10867</span>
                  </h4>
                </div>
              </div>
            </div>
            <div class="col-md-2" style="border-right: 1px solid #e7e7e7">
              <div
                class="media"
                style="
                  display: -webkit-flex;
                  display: flex;
                  -webkit-align-items: center;
                  align-items: center;
                  -webkit-justify-content: center;
                  justify-content: center;
                  border-bottom: 1px solid #e7e7e7;
                  padding: 20px 0;
                "
              >
                <div
                  class="media-body align-self-center"
                  style="text-align: center"
                >
                  <h4 class="font-14 m-1">
                    {{ $t("home.hoursutgproduction") }}
                  </h4>
                  <h4 class="font-16 m-1">
                    <span style="font-size: 16pt; color: #2ebac6">10867</span>
                  </h4>
                </div>
              </div>
            </div>
            <div class="col-md-2" style="border-right: 1px solid #e7e7e7">
              <div
                class="media"
                style="
                  display: -webkit-flex;
                  display: flex;
                  -webkit-align-items: center;
                  align-items: center;
                  -webkit-justify-content: center;
                  justify-content: center;
                  border-bottom: 1px solid #e7e7e7;
                  padding: 20px 0;
                "
              >
                <div
                  class="media-body align-self-center"
                  style="text-align: center"
                >
                  <h4 class="font-14 m-1">{{ $t("home.maxsupply") }}</h4>
                  <h4 class="font-16 m-1">
                    <span style="font-size: 16pt; color: #2ebac6">10867</span>
                  </h4>
                </div>
              </div>
            </div>
            <div class="col-md-2" style="">
              <div
                class="media"
                style="
                  display: -webkit-flex;
                  display: flex;
                  -webkit-align-items: center;
                  align-items: center;
                  -webkit-justify-content: center;
                  justify-content: center;
                  border-bottom: 1px solid #e7e7e7;
                  padding: 20px 0;
                "
              >
                <div
                  class="media-body align-self-center"
                  style="text-align: center"
                >
                  <h4 class="font-14 m-1">
                    {{ $t("home.circulatingsupply") }}
                  </h4>
                  <h4 class="font-16 m-1">
                    <span style="font-size: 16pt; color: #2ebac6">10867</span>
                  </h4>
                </div>
              </div>
            </div>
            <div class="col-md-2" style="border-right: 1px solid #e7e7e7">
              <div
                class="media"
                style="
                  display: -webkit-flex;
                  display: flex;
                  -webkit-align-items: center;
                  align-items: center;
                  -webkit-justify-content: center;
                  justify-content: center;
                  padding: 20px 0;
                "
              >
                <div
                  class="media-body align-self-center"
                  style="text-align: center"
                >
                  <h4 class="font-14 m-1">{{ $t("home.circulatingrate") }}</h4>
                  <h4 class="font-16 m-1">
                    <span style="font-size: 16pt; color: #2ebac6">10867</span>
                  </h4>
                </div>
              </div>
            </div>
            <div class="col-md-2" style="border-right: 1px solid #e7e7e7">
              <div
                class="media"
                style="
                  display: -webkit-flex;
                  display: flex;
                  -webkit-align-items: center;
                  align-items: center;
                  -webkit-justify-content: center;
                  justify-content: center;
                  padding: 20px 0;
                "
              >
                <div
                  class="media-body align-self-center"
                  style="text-align: center"
                >
                  <h4 class="font-14 m-1">
                    {{ $t("home.hourstransactions") }}
                  </h4>
                  <h4 class="font-16 m-1">
                    <span style="font-size: 16pt; color: #2ebac6">10867</span>
                  </h4>
                </div>
              </div>
            </div>
            <div class="col-md-2" style="border-right: 1px solid #e7e7e7">
              <div
                class="media"
                style="
                  display: -webkit-flex;
                  display: flex;
                  -webkit-align-items: center;
                  align-items: center;
                  -webkit-justify-content: center;
                  justify-content: center;
                  padding: 20px 0;
                "
              >
                <div
                  class="media-body align-self-center"
                  style="text-align: center"
                >
                  <h4 class="font-14 m-1">{{ $t("home.burntutg") }}</h4>
                  <h4 class="font-16 m-1">
                    <span style="font-size: 16pt; color: #2ebac6">10867</span>
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "NetworkOverview",
};
</script>
