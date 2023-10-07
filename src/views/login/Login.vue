<template>
  <div class="accounts-container">
    <div class="top-container"></div>
    <div class="login-form">
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="rules"
        auto-complete="on"
        label-position="left"
      >
        <h2>{{ $t("login.welcome") }}</h2>

        <el-form-item class="login-input" prop="username">
          <el-input
            v-model="loginForm.username"
            :placeholder="$t('login.username')"
            name="username"
            type="text"
            auto-complete="on"
          />
        </el-form-item>

        <el-form-item class="login-input" prop="password">
          <el-input
            :type="pwdType"
            v-model="loginForm.password"
            :placeholder="$t('login.password')"
            name="password"
            auto-complete="on"
            @keyup.enter.native="handleLogin"
          />
        </el-form-item>

        <el-button
          type="primary"
          class="login-btn"
          @click.native.prevent="handleLogin"
          >{{ $t("login.logIn") }}</el-button
        >
        <p>
          {{ $t("login.noAccount") }}？<a
            href="javascript:void(0)"
            @click="gotoRegister"
            >{{ $t("login.goRegister") }}</a
          >
        </p>
      </el-form>
    </div>
  </div>
</template>

<script>
import * as api from "@/api/api";
import * as helper from "@/utils/helper";
// import { setToken, setUser } from '@/utils/auth'
import md5 from "@/assets/js/hrymd5";
export default {
  name: "Accounts",
  data() {
    return {
      loginForm: {
        username: "",
        password: "",
        googleCode: "",
      },
      pwdType: "password",
      showOpen: true,
    };
  },
  computed: {
    rules() {
      return {
        username: [
          {
            required: true,
            message: this.$t("validate.username"),
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: this.$t("validate.password"),
            trigger: "blur",
          },
        ],
      };
    },
  },
  methods: {
    gotoRegister() {
      this.$router.push("/register");
    },
    handleLogin() {
      this.$refs["loginForm"].validate((valid) => {
        if (valid) {
          // let that = this
          const loginForm = {
            userName: this.loginForm.username,
            password: md5.md5(this.loginForm.password),
          };
          /*
          api.postJson('/common/login', loginForm).then(response => {
            if(response.data){
              setToken(response.data)
              setUser('user',this.loginForm.username)
              that.$router.push( '/myToken' )
            }else{
              that.$message.error(response.mesg)
            }
          }).catch((error) => {
            console.error(error)
          })
          */
          this.$store
            .dispatch("user/login", loginForm)
            .then((response) => {
              this.$router.push("/myToken");
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
