<template>
   <div class="login" @keydown.enter="handleSubmit">
        <div class="login-con">


            <Card :bordered="false">
                <p slot="title">
                    <Icon type="log-in"></Icon>
                    欢迎登录
                </p>
                <div class="form-con">
                    <Form ref="loginForm" :model="editInfo" :rules="rules">
                        <FormItem prop="username">
                            <Input v-model="editInfo.username" placeholder="请输入用户名">
                                <span slot="prepend">
                                    <Icon :size="16" type="person"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem prop="password">
                            <Input type="password" v-model="editInfo.password" placeholder="请输入密码">
                                <span slot="prepend">
                                    <Icon :size="14" type="locked"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem>
                            <Button @click="handleSubmit" type="primary" long>登录</Button>
                        </FormItem>
                    </Form>

                        <Spin v-if="loading" fix  size="large">
                        <Icon type="load-c" size=18 class="spin-load"></Icon>
                        <div>登陆中...</div>
                        </Spin>
                </div>
            </Card>
        </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      editInfo: {
        username: "admin",
        password: "123456"
      },
      rules: {
        username: [
          {
            required: true,
            message: "账号不能为空",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "密码不能为空",
            trigger: "blur"
          }
        ]
      },
      loading: false
    };
  },
  methods: {
    handleSubmit() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.$http.post({
            url: "/auth",
            params: this.editInfo,
            success: res => {
              localStorage.setItem("user", this.editInfo.username);
              // localStorage.setItem("token", data.token);
              localStorage.setItem("userId", res.userId);
              this.$router.push("/");
            },
            mustCall: () => {
              this.loading = false;
            }
          });
        }
      });
    }
  }
};
</script>

<style lang="less">
.login {
  width: 100%;
  height: 100%;
  background-image: url("http://file.iviewui.com/iview-admin/login_bg.jpg");
  background-size: cover;
  background-position: center;
  position: relative;
  &-con {
    position: absolute;
    right: 160px;
    top: 50%;
    transform: translateY(-60%);
    width: 300px;
    &-header {
      font-size: 16px;
      font-weight: 300;
      text-align: center;
      padding: 30px 0;
    }
    .form-con {
      padding: 10px 0 0;
    }
    .login-tip {
      font-size: 10px;
      text-align: center;
      color: #c3c3c3;
    }
  }
}

.spin-load {
  animation: ani-demo-spin 1s linear infinite;
}
@keyframes ani-demo-spin {
  from {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.spin-col {
  height: 100px;
  position: relative;
  border: 1px solid #eee;
}
</style>
