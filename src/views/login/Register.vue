<template>
  <div class="accounts-container">
    <div class="top-container"></div>
    <div class="login-form">
      <el-form
        ref="registerForm"
        :model="registerForm"
        :rules="loginRules"
        auto-complete="on"
        label-position="left"
      >
        <h2>{{ $t("register.welcome") }}</h2>

        <el-form-item class="login-input" prop="username">
          <el-input
            v-model="registerForm.username"
            :placeholder="$t('register.phone')"
            name="username"
            type="text"
            auto-complete="on"
          />
        </el-form-item>
        <el-form-item class="login-input" prop="captcha">
          <el-input
            v-model="registerForm.captcha"
            :placeholder="$t('register.imgCode')"
            name="imgCode"
            type="text"
            auto-complete="on"
          />
          <img :src="imgCode" alt="" class="login-code" @click="refreshCode" />
        </el-form-item>
        <el-form-item class="login-input" prop="emailCode">
          <el-input
            v-model="registerForm.emailCode"
            :placeholder="$t('register.emailCode')"
            name="emailCode"
            type="text"
            auto-complete="on"
          />
          <span v-show="!isdisabled" class="get-code" @click="getEmailCode">{{
            $t("register.getCode")
          }}</span>
          <span v-show="isdisabled" class="get-code">{{
            $t("register.getEmailCode", [time])
          }}</span>
        </el-form-item>
        <el-form-item class="login-input" prop="password">
          <el-input
            :type="pwdType"
            v-model="registerForm.password"
            :placeholder="$t('register.password')"
            name="password"
            auto-complete="on"
            :minlength="minlength"
            :maxlength="maxlength"
          />
        </el-form-item>
        <el-form-item class="login-input" prop="confirmPassword">
          <el-input
            :type="pwdType"
            v-model="registerForm.confirmPassword"
            :placeholder="$t('register.confirmPassword')"
            name="password"
            auto-complete="on"
          />
        </el-form-item>
        <el-button
          type="primary"
          class="login-btn"
          @click.native.prevent="handleRegister"
          >{{ $t("register.reg") }}</el-button
        >
        <p>
          {{ $t("register.hasAccount") }}？<a
            href="javascript:void(0)"
            @click="gotoLogin"
            >{{ $t("register.goLogin") }}</a
          >
        </p>
      </el-form>
    </div>
  </div>
</template>

<script>
import * as api from "@/api/api";
import * as helper from "@/utils/helper";
import md5 from "@/assets/js/hrymd5.js";
export default {
  name: "Accounts",
  data() {
    return {
      registerForm: {
        username: "",
        captcha: "",
        emailCode: "",
        password: "",
        confirmPassword: "",
      },
      pwdType: "password",
      showOpen: true,
      imgCode:
        window.$url.USER_URL + `/common/getCaptcha?t=${new Date().getTime()}`,
      isdisabled: false,
      time: 60,
      maxlength: 20,
      minlength: 6,
    };
  },
  computed: {
    loginRules() {
      const validatePassword = (rule, value, callback) => {
        if (value.length < 6) {
          callback(new Error(this.$t("validate.password")));
        } else {
          callback();
        }
      };
      return {
        username: [
          {
            required: true,
            message: this.$t("validate.email"),
            trigger: "blur",
          },
        ],
        captcha: [
          {
            required: true,
            message: this.$t("validate.captcha"),
            trigger: "blur",
          },
        ],
        emailCode: [
          {
            required: true,
            message: this.$t("validate.emailCode"),
            trigger: "blur",
          },
        ],
        // password: [{ required: true, message: this.$t('validate.password'), trigger: 'blur' }],
        password: [
          { required: true, validator: validatePassword, trigger: "blur" },
        ],
        confirmPassword: [
          {
            required: true,
            message: this.$t("validate.confirmPassword"),
            trigger: "blur",
          },
        ],
      };
    },
  },
  methods: {
    gotoLogin() {
      this.$router.push("/login");
    },
    getEmailCode() {
      let that = this;
      const param = {
        captcha: this.registerForm.captcha,
        email: this.registerForm.username,
        emailType: 1,
      };
      that.isdisabled = true;
      window.clearInterval(pageTimer);
      var pageTimer = window.setInterval(function () {
        that.time = that.time - 1;
        if (that.time === 0) {
          that.isdisabled = false;
          window.clearInterval(pageTimer);
        } else {
          that.isdisabled = true;
        }
      }, 1000);
      if (this.registerForm.captcha && this.registerForm.username) {
        api
          .userPostJson("/common/sendEmailVerificationCode", param)
          .then((response) => {
            if (response.data) {
            } else {
              this.refreshCode();
              that.isdisabled = false;
              window.clearInterval(pageTimer);
              this.$message.error(response.mesg);
            }
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        this.$message.error(this.$t("register.sendCodeError"));
      }
    },
    refreshCode() {
      this.imgCode =
        window.$url.USER_URL + `/common/getCaptcha?t=${new Date().getTime()}`;
    },
    handleRegister() {
      this.$refs["registerForm"].validate((valid) => {
        if (valid) {
          let that = this;
          const param = {
            email: this.registerForm.username,
            captcha: this.registerForm.captcha,
            emailVerificationCode: this.registerForm.emailCode,
            password: md5.md5(this.registerForm.password),
            confirmPassword: md5.md5(this.registerForm.confirmPassword),
          };
          api
            .userPostJson("/common/register", param)
            .then((response) => {
              if (response.data) {
                this.$message.success(that.$t("register.success"));
                this.$router.push("/login");
              } else {
                this.refreshCode();
                this.$message.error(response.mesg);
              }
            })
            .catch((error) => {
              console.error(error);
            });
        }
      });
    },
  },
};
</script>
