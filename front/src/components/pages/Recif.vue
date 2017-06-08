<!--Recif Component, a recif is a room instance of a recif-->

<template>
  <div id="test">
    <sideBar ref="addCorail" id="addCorail"
             v-on:toggleForceAtlas="toggleForceAtlas"
             v-on:addNode="addNode"
             v-on:updateNode="updateNode"
             v-on:removeNode="removeNode"
             v-on:addTag="addTag"
             v-bind:tags="tags"
    ></sideBar>
    <div v-if="connected">Recif: {{ name }} <br /> {{ description }} </div>
    <div v-else>Create room?
        <input type="text" v-model="description" placeholder="description" />
        <button type="submit" v-on:click="addRecif">YES!</button>
    </div>
    <sigma ref="sigma"
           v-on:clickNode="clickNode"
           v-on:clickStage="clickStage"
    ></sigma>
  </div>
</template>
<script src="/socket.io/socket.io.js"></script>
<script>
import Menu from '../modules/Menu.vue'
import Sigma from '../modules/Sigma.vue'
import * as api from 'lib/backendApi';

export default {
    name: 'recif',
    data () {
        return {
            name:           this.$route.params.recif,
            id:             undefined,
            description:    '',
            isProtected:    false,
            token:          undefined,

            tags: [],

            isValid:        true,
            isAuth:         false,

            //socket:         io()
        }
    },
    methods: {
        toggleForceAtlas: function() {
            this.$refs.sigma.toggleForceAtlas();
        },

        addNode: async function( node ){

            let newNode = this.$refs.sigma.addNode( node );
            
            let params = {
                name: node.name,
                description: node.description,
                token: this.token,
                tags: ''
            };

            if(node.tags != null) {
                params.tags = node.tags.map((t) => t.id).join(',');
            }
            
            let id = await api.addCorail(params);
            newNode.data.id = id;
            console.log('NEW ID IS: ' + id);

        },
        updateNode( info ) {
            this.$refs.sigma.addEdge( info.add );
            this.$refs.sigma.removeEdge( info.rm );

            //update node data
            this.$refs.sigma.updateNode( info.new );
            
            //backend update
            let corail = info.new.data;
            api.updateCorail( this.token, corail.id, corail.name, corail.description );
            info.add.data.tags.forEach((tag) => api.addLink( this.token, corail.id, tag.id ));
            info.rm.data.tags.forEach((tag) => api.rmLink( this.token, corail.id, tag.id ));

        },
        removeNode( node ) {
            this.$refs.sigma.removeNode(node);
            api.removeCorail(this.token, node.data.id);
        },
        addTag( name ){
            api.addTag(this.token, name);
        },
        clickNode: function( node ){
            this.$refs.addCorail.clickNode(node);
        },
        clickStage: function(){
            this.$refs.addCorail.reset();
        },
        testApplication: function(){
            let arr = this.$refs.addCorail.tagsValues;
            for(let i = 0; i < 150; ++i){
                let tags = [];
                for(let i = 0; i < Math.floor(Math.random() * 3); ++i){
                    tags.push(arr[Math.floor(Math.random()*arr.length)])
                }
                this.$refs.sigma.addNode({
                    name: 'n' + i,
                    tags: tags,
                    id: Math.random()
                });
            }
        },
        init: async function() {
            let recif = await api.getRecif(this.name);

            if (recif === undefined) {
                console.log('recif === undefined');
                this.isValid = false;

                return;
            }
            this.isValid = true;
            console.log(recif);

            this.id = recif.id;
            this.description = recif.description;
            this.isProtected = recif.isProtected;

            if(this.description == null) 
                this.description = '';

            if (!this.isProtected)
            {
                this.token = await api.getToken(this.id);
                this.buildRecif();
            }
        },
        async buildRecif() {
            let corails = await api.getCorails(this.token);
            this.tags = await api.getTags(this.token);

            this.$refs.sigma.buildGraph( corails );
        },
        addRecif: async function() {
            
            let params = {
                name: this.name,
                description: this.description,
            };

            let id = await api.addRecif(params);
            if(id === undefined) {
                alert('Error creating Recif..');
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
            let newTitle = route.params.recif;
            if(newTitle !== this.name) {
                this.clear();
                this.name = newTitle;
                this.init();
            }
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

#addCorail {
    float: right;
    z-index: 2;
}

body{
  overflow: hidden;
}


</style>
