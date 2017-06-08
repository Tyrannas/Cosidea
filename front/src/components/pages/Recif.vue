<!--Recif Component, a recif is a room instance of a recif-->

<template>
  <div id="test">
    <sideBar ref="addCorail" id="addCorail"
             v-on:toggleForceAtlas="toggleForceAtlas"
             v-on:addCorail="addCorail"
             v-on:updateCorail="updateCorail"
             v-on:removeCorail="removeCorail"
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
<script>
import Menu from '../modules/Menu.vue'
import Sigma from '../modules/Sigma.vue'
import * as api from 'lib/backendApi';
import * as io from 'socket.io-client';

export default {
    name: 'recif',
    data () {
        return {
            name:           this.$route.params.recif,
            id:             undefined,
            description:    '',
            isProtected:    false,
            // Connection token
            token:          undefined,
            // Existing tags in the recif
            tags: [],
            // The recif name exist
            isValid:        true,
            // Is Auth, true if recif is protected and pwd is valid
            isAuth:         false,
            // Node selected in sigma
            selectedNode:   undefined,   

            //socket:         io.connect()
        }
    },
    methods: {
        toggleForceAtlas: function() {
            this.$refs.sigma.toggleForceAtlas();
        },
        addCorail: async function( corail ){

            let newNode = this.$refs.sigma.addNode( corail );
            
            let params = {
                name: corail.name,
                description: corail.description,
                token: this.token,
                tags: ''
            };

            // tag ids to string, comma separated
            if( node.tags instanceof Array ) {
                params.tags = node.tags.map((t) => t.id).join(',');
            }
            
            // backend add
            let id = await api.addCorail(params);
            // update id with new unique id
            newNode.data.id = id;
            console.log('NEW ID IS: ' + id);

        },
        updateCorail( info ) {
            // info = { corail: Corail, toAdd: tags[], toRem: tags[] }
            let node = this.selectedNode;
            let corail = info.corail;

            // Add new tag edges
            node.data.tags = info.toAdd;
            this.$refs.sigma.addEdge( node );
            // Remove tag edges
            node.data.tags = info.toRem;
            this.$refs.sigma.removeEdge( node );

            //update node data
            node.data = corail;
            this.$refs.sigma.updateNode( node );
            
            //backend update
            api.updateCorail( this.token, corail.id, corail.name, corail.description );
            info.toAdd.forEach((tag) => api.addLink( this.token, corail.id, tag.id ));
            info.toRem.forEach((tag) => api.rmLink( this.token, corail.id, tag.id ));

            // corail is updated, unselect
            this.selectedCorail = undefined;
        },
        removeCorail( corail ) {
            // remove node in sigma
            this.$refs.sigma.removeNode(this.selectedNode);
            // remove node in backend
            api.removeCorail(this.token, corail.id);
        },
        addTag( name ){
            api.addTag(this.token, name);
        },
        clickNode: function( node ){
            this.selectedNode = node;
            this.$refs.addCorail.load(node.data);
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
            //this.socket.on('connect', () => console.log('CONNECTED SOCKET IO'));

            let recif = await api.getRecif(this.name);

            if (recif === undefined) {
                console.log('recif === undefined');
                this.isValid = false;

                return;
            }
            this.isValid = true;
            //console.log(recif);

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
