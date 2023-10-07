<template>
  <div>
    <h4
      v-if="title"
      class="mt-0 header-title"
      style="width: 100%; text-align: left"
    >
      {{ $t(title) }}
    </h4>
    <p class="sub-title" style="width: 100%; text-align: left">
      {{ $t(totalLabel, [page.total]) }}
    </p>
    <slot name="table_top"></slot>
    <div class="table-responsive" style="min-height: 200px">
      <table class="table table-hover mb-0">
        <thead>
          <tr style="background-color: #f8fafd">
            <th scope="col" style="min-width': 70px;">
              {{ $t("ftable.order") }}
            </th>
            <th
              v-for="(item, cd) in headers"
              :key="cd"
              scope="col"
              :style="{ 'min-width': item.minWidth || '80px' }"
            >
              {{ item.notT ? item.label : $t(item.label) }}
            </th>
            <th scope="col" v-if="showRight" :style="{ width: rightWidth }">
              {{ $t("ftable.action") }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, cd) in datas" :key="cd">
            <td>{{ item.ieIndex }}</td>

            <td v-for="(itemt, cdt) in headers" :key="cdt">
              <span
                v-if="itemt.click"
                style="color: #007bff; cursor: pointer"
                @click="onclickCell(itemt, item)"
              >
                {{ itemt.valT ? $t(getVal(item, itemt)) : getVal(item, itemt) }}
              </span>
              <template v-else>
                {{ itemt.valT ? $t(getVal(item, itemt)) : getVal(item, itemt) }}
              </template>
            </td>

            <td v-if="showRight">
              <slot name="rightBtns" :data="item"> </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="row" style="margin-top: 20px">
      <div
        class="col-md-5 col-sm-12"
        style="font-size: 9pt; margin: 0px; padding-left: 10px"
      >
        <ul class="pagination" style="justify-content: left; font-size: 9pt">
          <li class="page-item">
            <a
              class
              style="
                padding: 10px;
                border: none;
                border-radius: 6px;
                display: block;
              "
              >{{ $t("pagination.show") }}</a
            >
          </li>
          <li class="page-item">
            <div class="col-sm-12" style="margin: 0px; padding: 0px">
              <select
                class="custom-select"
                v-model="page.pageSize"
                style="font-size: 12px"
                @change="getList(1)"
                id="selectPage"
              >
                <option selected="selected" value="10">10</option>
                <option value="15">15</option>
                <option value="30">30</option>
                <option value="50">50</option>
              </select>
            </div>
          </li>
          <li class="page-item">
            <a
              class
              style="
                padding: 10px;
                border: none;
                border-radius: 6px;
                display: block;
              "
              >{{ $t("pagination.redord") }}</a
            >
          </li>
        </ul>
      </div>
      <div
        class="col-md-7 col-sm-12 justify-content-end"
        style="font-size: 9pt; margin: 0px; padding-left: 10px"
      >
        <ul class="pagination fyright">
          <li class="page-item">
            <a
              class="page-link"
              href="javascript:;"
              style="
                padding: 10px;
                margin: 4px;
                border: none;
                background-color: #eaf8f9;
                border-radius: 6px;
                color: #41c0cb;
                font-size: 9pt;
              "
              @click="getList(1)"
              >{{ $t("pagination.first") }}</a
            >
          </li>
          <li class="page-item">
            <a
              class="page-link"
              href="javascript:;"
              style="
                padding: 10px;
                margin: 4px;
                border: none;
                background-color: #eaf8f9;
                border-radius: 6px;
                color: #41c0cb;
              "
              @click="getList(page.current - 1)"
            >
              <i class="mdi mdi-chevron-left"></i>
            </a>
          </li>
          <li class="page-item">
            <a
              class="page-link"
              href="javascript:;"
              style="
                padding: 10px;
                margin: 4px;
                border: none;
                background-color: #eaf8f9;
                border-radius: 6px;
                color: #757575;
              "
            >
              <span>
                {{
                  $t("pagination.pages", {
                    curPage: page.current,
                    totalPage: page.totalPages,
                  })
                }}
              </span>
            </a>
          </li>
          <li class="page-item">
            <a
              class="page-link"
              href="javascript:;"
              style="
                padding: 10px;
                margin: 4px;
                border: none;
                background-color: #eaf8f9;
                border-radius: 6px;
                color: #41c0cb;
              "
              @click="getList(page.current + 1)"
            >
              <i class="mdi mdi-chevron-right"></i>
            </a>
          </li>
          <li class="page-item">
            <a
              class="page-link"
              href="javascript:;"
              style="
                padding: 10px;
                margin: 4px;
                border: none;
                background-color: #eaf8f9;
                border-radius: 6px;
                color: #41c0cb;
              "
              @click="getList(page.totalPages)"
              >{{ $t("pagination.last") }}</a
            >
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import { createTable } from "@/utils/tableUtil.js";
import * as helper from "@/utils/helper";
export default {
  props: {
    headers: {
      type: Array,
      default() {
        return [];
      },
    },
    datas: {
      type: Array,
      default() {
        return {};
      },
    },
    showRight: {
      type: Boolean,
      default: true,
    },
    rightWidth: {
      type: String,
      default: "120px",
    },
    title: {
      type: String,
      default: "",
    },
    totalLabel: {
      type: String,
      default: "ftable.totalnumber",
    },
  },
  data() {
    let page = createTable();
    return {
      page,
      loadText: "",
    };
  },
  mounted() {
    this.$emit("load", this.page);
  },
  methods: {
    getList(current = this.page.current) {
      current = current > this.page.totalPages ? this.page.totalPages : current;
      current = current < 1 ? 1 : current;
      this.page.current = current || 1;
      this.$emit("load", this.page);
    },
    getVal(data, item) {
      let valL = data[item.name];
      if (item.valMap) {
        if (typeof item.valMap == "function") {
          valL = item.valMap(valL, data);
        } else {
          valL = item.valMap[valL];
        }
      }
      if (item.address) {
        valL = this.getAddrFormat(valL);
      }
      return valL;
    },
    onclickCell(item, data) {
      this.$emit("onclickCell", item, data);
    },
    getAddrFormat(data, number = 8) {
      return helper.getAddrFormat(data, number);
    },
  },
};
</script>
