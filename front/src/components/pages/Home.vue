<template>
  <div id="test">
    <div class="messageBox">{{lorem}}</div>
  </div>
</template>

<script>
export default {
  name: 'test',
  data () {
    return {
      lorem: 'Lorem ipsum sit dolor.'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
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
