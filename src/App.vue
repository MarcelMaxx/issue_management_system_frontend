<template>
  <a-config-provider :locale="enUS">
    <router-view/>
  </a-config-provider>
</template>
<script setup>
import enUS from '@arco-design/web-vue/es/locale/lang/en-us';

</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
