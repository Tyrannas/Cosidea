<template>
  <div id="test">
    <div v-for="proj in projects" class="messageBox">Project {{proj.name}} is
      <span v-if="!proj.isProtected" >not</span> protected
    </div>
  </div>
</template>

<script>
import * as api from 'lib/backendApi';

export default {
  name: 'test',
  data () {
    return {
      projects: []
    }
  },
  mounted() {
    api.getRecifs()
    .then((projs) => { 
        if (projs != undefined) { 
            this.projects = projs; 
        } 
    });
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
