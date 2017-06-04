<template>
  <div id="test">
    <sideBar id="add_idea"></sideBar>
    <sigmaInstance></sigmaInstance>
  </div>
</template>

<script>
import Menu from '../modules/Menu.vue'
import Sigma from '../modules/Sigma.vue'
export default {
  name: 'test',
  data () {
    return {
      lorem: 'Lorem ipsum sit dolor.'
    }
  },
  components: {
    'sideBar': Menu,
    'sigmaInstance': Sigma
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

#add_idea {
  float: right;
}

h1, h2 {
  font-weight: normal;
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
