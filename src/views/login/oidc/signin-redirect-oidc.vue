<template>
  <div />
</template>

<script>
import Oidc from 'oidc-client'
import config from './oidc-config'

var mgr = new Oidc.UserManager(config)
export default {
  created() {
    console.log(config)
    this.openFullScreen()
    mgr.signinRedirect()
  },
  methods: {
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
