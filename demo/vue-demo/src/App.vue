<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld :msg="msg"/>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import configLoader from 'fe-config-loader'

export default {
  name: 'App',
  components: {
    HelloWorld
  },
  data() {
    return {
      msg: "helloword"
    }
  },
  mounted() {
    this.msg = configLoader.get("message")
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
