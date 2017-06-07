<!--Recif Component, a recif is a room instance of a project-->

<template>
  <div id="test">
    <sideBar ref="addIdea" id="addIdea"
             v-on:toggleForceAtlas="toggleForceAtlas"
             v-on:addNode="addNode"
             v-on:updateNode="updateNode"
             v-bind:tags="tags"
    ></sideBar>
    <div v-if="connected">Project: {{ title }} <br /> {{ description }} </div>
    <div v-else>Create room?
        <input type="text" v-model="description" placeholder="description" />
        <button type="submit" v-on:click="addProject">YES!</button>
    </div>
    <sigma ref="sigma"
           v-on:clickNode="clickNode"
           v-on:clickStage="clickStage"
    ></sigma>
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
            description:    '',
            isProtected:    false,
            token:          undefined,

            tags: [],

            isValid:        true,
            isAuth:         false
        }
    },
    methods: {
        toggleForceAtlas: function() {
            this.$refs.sigma.toggleForceAtlas();
        },

        addNode: async function( node ){
            console.log(node);
            let newNode = this.$refs.sigma.addNode( node );
            
            let params = {
                title: node.title,
                desc: node.description,
                projectId: this.id,
                tags: ''
            };

            if(node.tags != null) {
                params.tags = node.tags.map((t) => t.id).join(',');
            }

            let id = await api.addIdea(params);
            newNode.data.id = id;

        },
        updateNode(info) {
            this.$refs.sigma.addEdge( info.add );
            this.$refs.sigma.removeEdge( info.rm );
            this.$refs.sigma.updateNode( info.new );
        },
        clickNode: function( node ){
            this.$refs.addIdea.clickNode(node);
        },
        clickStage: function(){
            this.$refs.addIdea.reset();
        },
        testApplication: function(){
            let arr = this.$refs.addIdea.tagsValues;
            for(let i = 0; i < 150; ++i){
                let tags = [];
                for(let i = 0; i < Math.floor(Math.random() * 3); ++i){
                    tags.push(arr[Math.floor(Math.random()*arr.length)])
                }
                this.$refs.sigma.addNode({
                    title: 'n' + i,
                    tags: tags
                });
            }
        },
        init: async function() {
            let proj = await api.getProject(this.title);

            if (proj === undefined) {
                console.log('project === undefined');
                this.isValid = false;

                return;
            }
            this.isValid = true;
            console.log(proj);

            this.id = proj.id;
            this.description = proj.description;
            this.isProtected = proj.protect;

            if(this.description == null) 
                this.description = '';

            if (this.connected)
            {
                let taggedIdeas = await api.getIdeas(this.id);
                this.tags = await api.getTags(this.id);

                console.log(taggedIdeas);
                this.$refs.sigma.buildGraph( taggedIdeas );
            }
        },
        addProject: async function() {
            
            let params = {
                title: this.title,
                desc: this.description,
            };

            let id = await api.addProject(params);
            if(id === undefined) {
                alert('Error creating Project..');
            }
            else {
                this.init();
            }
        },
        clear: function() {
            this.description = '';
            this.isProtected = false;
            this.token = false;
            this.auth = false;
            this.isValid = true;
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
    watch: {
        $route: function(route) {
            let newTitle = route.params.project;
            if(newTitle !== this.title) {
                this.clear();
                this.title = newTitle;
                this.init();
            }
        }
    }
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
