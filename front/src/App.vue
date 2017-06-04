<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
// import Menu from './components/modules/Menu.vue'
export default {
  name: 'app'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /*margin-top: 60px;*/
}

body{
  margin: 0;
  padding: 9;
}

</style>
