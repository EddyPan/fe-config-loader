<template>
  <div class="hello">
    <h1>fe-config-loader</h1>
    <p>
      VUE应用动态加载配置使用<br>
      插件地址：
      <a href="https://www.npmjs.com/package/fe-config-loader" target="_blank" rel="noopener">fe-config-loader</a>.
    </p>
    <h3>{{msg}}</h3>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
