<!--Recif Component, a recif is a room instance of a project-->

<template>
  <div id="test">
    <sideBar ref="addIdea" id="addIdea"
             v-on:toggleForceAtlas="toggleForceAtlas"
             v-on:addNode="addNode"
    ></sideBar>
    <sigma ref="sigma"></sigma>
  </div>
</template>

<script>
import Menu from '../modules/Menu.vue'
import Sigma from '../modules/Sigma.vue'
import * as api from 'lib/backendApi';

export default {
    name: 'recif',
    data () {
        return {
            project:        this.$route.params.project,
            projectId:      undefined,
            description:    undefined,
            isProtected:    false,
            token:          undefined
        }
    },
    methods: {
        toggleForceAtlas: function(){
            this.$refs.sigma.methods.toggleForceAtlas();
        },
        addNode: function( node ){
            this.$refs.sigma.methods.addNode( node )
        }
    },
    mounted(){
      let proj = this.project;
      api.initRoom(this, proj)
          .then(() => console.log(this.projectId));
    },
    components: {
        'sideBar': Menu,
        'sigma': Sigma
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

#addIdea {
    float: right;
    z-index: 2;
}

body{
  overflow: hidden;
}


</style>
