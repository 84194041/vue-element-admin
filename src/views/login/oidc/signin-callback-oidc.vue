<template>
  <div />
</template>
<script>
import Oidc from 'oidc-client'
import config from './oidc-config'
import { mapActions } from 'vuex'

export default {
  data() {
    return {
      status: 'loading...'
    }
  },

  async beforeCreate() {
    new Oidc.UserManager({ response_mode: 'query' })
      .signinRedirectCallback()
      .then(async() => {
        console.log(1)
        var mgr = new Oidc.UserManager(config)
        this.state = 'user geting...'
        var user = await mgr.getUser().catch(e => { this.state = e })
        this.state = 'user geted.'
        if (user) {
          this.user = user

          this.state = 'externalLogining...'
          // await this.externalLogin({ data:
          //   { rememberMe: true,
          //     authProvider: 'OpenIdConnect',
          //     providerKey: user.profile.sub,
          //     providerAccessCode: user.id_token }
          // }).catch(e => {
          //   this.state = e
          // })
          await this.login({
            username: 'admin',
            password: '111111'
            }
          ).catch(e => {
            this.state = e
          })
          
          this.state = 'externalLogined.'
          window.location = '/'
        }
        // window.location = '/#/Home'
      })
      .catch(e => {
        this.state = e
      })
  },

  async created() {
    this.openFullScreen()
  },

  methods: {
    ...mapActions('user', ['login']),

    openFullScreen() {
      // const loading =
      this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      // setTimeout(() => {
      //   loading.close()
      // }, 2000)
    }
  }

}
</script>

