<!--Recif Component, a recif is a room instance of a project-->

<template>
  <div id="test">
    <sideBar ref="addIdea" id="addIdea"
             v-on:toggleForceAtlas="toggleForceAtlas"
             v-on:addNode="addNode"
    ></sideBar>
    <div v-if="connected">Project: {{ title }} <br /> {{ description }} </div>
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
            title:           this.$route.params.project,
            id:             undefined,
            description:    undefined,
            isProtected:    false,
            token:          undefined,

            isValid:        true,
            isAuth:         false
        }
    },
    watch: {
        $route: function(route) {
            let newTitle = route.params.project;
            if(newTitle !== this.title) {
                this.title = newTitle;
                this.init();
            }
        }
    },
    methods: {
        toggleForceAtlas: function() {
            this.$refs.sigma.toggleForceAtlas();
        },
        addNode: function( node ) {
            this.$refs.sigma.addNode( node )
        },
        init: async function() {
            let proj = await api.getProject(this.title);
        
            if (proj === undefined) { 
                console.log('project === undefined'); 
                this.isValid = false; return; 
            }
            console.log(proj);

            this.id = proj.id;
            this.description = proj.description;
            this.isProtected = proj.protect;

            if (this.connected)
            {
                let taggedIdeas = await api.getIdeas(this.id); 
                console.log(taggedIdeas);
                 //TODO build graph 
            }
        },
        testApplication: function(){
            let arr = this.$refs.addIdea.tagsValues;
            for(let i = 0; i < 150; ++i){
                let tags = [];
                for(let i = 0; i < Math.floor(Math.random() * 3); ++i){
                    tags.push(arr[Math.floor(Math.random()*arr.length)])
                }
                this.$refs.sigma.addNode({
                    label: 'n' + i,
                    tags: tags
                });
            }
        }
    },
    computed: {
        connected: function() {
            return (!this.isProtected || this.isAuth) && this.isValid;
        }
    },
    async mounted(){
        this.init();
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
