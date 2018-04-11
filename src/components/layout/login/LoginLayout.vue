<style lang="scss" scoped>
@import "./login.scss";
</style>

<template>
  <div class="login" @keydown.enter="handleSubmit">
    <div class="login-con">
      <Card :bordered="false">
        <p slot="title">
            <Icon type="log-in"></Icon>
            欢迎登录
        </p>
        <div class="form-con">
          <Form ref="loginForm" :model="form" :rules="rules">
            <FormItem prop="username">
                <Input v-model="form.username" placeholder="请输入用户名">
                    <span slot="prepend">
                        <Icon :size="16" type="person"></Icon>
                    </span>
                </Input>
            </FormItem>
            <FormItem prop="password">
                <Input type="password" v-model="form.password" placeholder="请输入密码">
                    <span slot="prepend">
                        <Icon :size="14" type="locked"></Icon>
                    </span>
                </Input>
            </FormItem>
            <FormItem>
                <Button @click="handleSubmit" type="primary" long>登录</Button>
            </FormItem>
          </Form>
          <p class="login-tip">输入任意用户名和密码即可</p>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import { setToken } from '@/libs/auth'
import { login, getUserInfo } from '@/api/login'
export default {
  data() {
    return {
      form: {
        username: 'admin',
        password: 'admin'
      },
      rules: {
        username: [
          { required: true, message: '账号不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleSubmit() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          login(this.form)
            .then(response => {
              const data = response.data.data
              console.log('data', data)
              setToken(data.accessToken)
              getUserInfo(data.accessToken)
                .then(response => {
                  const user = response.data.data
                  console.log('user', user)
                  this.$store.commit('setUserInfo', user)
                  this.$router.push({
                    name: 'home_index'
                  })
                })
                .catch(error => {
                  console.log('error', error)
                  this.$Message.error('获取用户信息失败')
                })
            })
            .catch(error => {
              console.log('error', error)
              this.$Message.error('认证失败')
            })
        }
      })
    }
  }
}
</script>
