<template>
  <div
    class="table-responsive"
    style="height: 300px; padding: 1px 1px; display: flex"
  >
    <textarea wrap="off" :id="leftNum_id" class="leftNum" disabled></textarea>
    <textarea
      @input="handleTextareaInput"
      v-model="areaText"
      :id="code_id"
      readonly
      v-on:scroll="handleScroll($event)"
      spellcheck="false"
      ref="textareaRef"
      class="area-content"
    ></textarea>
  </div>
</template>
<script>
export default {
  name: "ContractTextarea",
  components: {},
  props: {
    areaText: {
      type: String,
      default: "",
    },
    ids: {
      type: Number,
      default: "",
    },
  },
  data() {
    return {
      //num: "",
      leftNum_id: "",
      code_id: "",
    };
  },

  created() {
    this.leftNum_id = "leftNum" + this.ids;
    this.code_id = "code" + this.ids;
  },

  mounted() {
    //console.log(this.areaText)
    this.handleTextarea(this.areaText);
  },

  methods: {
    handleScroll(event) {
      const target = event.target;
      console.log(target.scrollHeight, target.scrollTop);
      document.getElementById(this.leftNum_id).scrollTop = target.scrollTop;
    },

    handleTextareaInput(e) {
      document.getElementById(this.leftNum_id).scrollTop =
        document.getElementById(this.code_id).scrollTop;
      let str = e.target.value;
      str = str.replace(/\r/gi, "");
      str = str.split("\n");
      let n = str.length;
      let num = "";
      // let lineobj = document.getElementById(this.leftNum_id);
      for (let i = 1; i <= n; i++) {
        if (document.all) {
          num += i + "\r\n";
        } else {
          num += i + "\n";
        }
      }
      document.getElementById(this.leftNum_id).value = num;
      num = "";
    },

    handleTextarea(str) {
      document.getElementById(this.leftNum_id).scrollTop =
        document.getElementById(this.code_id).scrollTop;
      str = str.replace(/\r/gi, "");
      str = str.split("\n");
      let num = "";
      let n = str.length;
      //let lineobj = document.getElementById(this.leftNum_id);
      for (let i = 1; i <= n; i++) {
        if (document.all) {
          num += i + "\r\n";
        } else {
          num += i + "\n";
        }
      }

      console.log(this.leftNum_id);
      document.getElementById(this.leftNum_id).value = num;
      num = "";
    },
  },
};
</script>
<style lang="scss" scoped>
.cursor {
  cursor: pointer;
}

.edit-container {
  height: 300px;
  padding: 1px 1px;
}

.edit {
  display: flex;
  height: 300px;
}

.leftBox {
  width: 40px;
  height: 100%;
  text-align: left;
}

@media (min-width: 769px) {
  .area-content {
    border: 1px solid #eaeaea;
    outline: none;
    float: left;
    width: 97%;
    height: 100%;
    resize: none;
    background: rgb(250, 250, 250);
    line-height: 20px;
    font-size: 12px;
    padding: 10px 8px;
    font-family: inherit;
  }

  .leftNum {
    float: left;
    width: 3%;
    height: 100%;
    outline: none;
    resize: none;
    overflow-y: hidden;
    overflow-x: hidden;
    border: 0;
    background: rgb(240, 240, 240);
    color: #999;
    text-align: right;
    padding: 12px 4px;
    line-height: 20px;
    font-size: 12px;
    font-weight: bold;
  }
}

@media (max-width: 768px) {
  .area-content {
    border: 1px solid #eaeaea;
    outline: none;
    float: left;
    width: 94%;
    height: 100%;
    resize: none;
    background: rgb(250, 250, 250);
    line-height: 20px;
    font-size: 9px;
    padding: 10px 8px;
    font-family: inherit;
  }

  .leftNum {
    float: left;
    width: 6%;
    height: 100%;
    outline: none;
    resize: none;
    overflow-y: hidden;
    overflow-x: hidden;
    border: 0;
    background: rgb(240, 240, 240);
    color: #999;
    text-align: right;
    padding: 12px 4px;
    line-height: 20px;
    font-size: 9px;
    font-weight: normal;
  }
}
</style>
