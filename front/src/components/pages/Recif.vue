<!--Recif Component, a recif is a room instance of a recif-->

<template>
  <div id="test">
    <sideBar ref="addCorail" id="addCorail"
             @toggleForceAtlas="toggleForceAtlas"
             @addCorail="addCorail"
             @updateCorail="updateCorail"
             @removeCorail="removeCorail"
             @addTag="addTag"
             @removeTag="removeTag"
             v-bind:tags="tags"
    ></sideBar>

    <div v-if="connected"> Recif: {{ name }} <br> {{ description }} </div>

    <div v-else>Create room?
        <input type="text" v-model="description" placeholder="description">
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
import * as dynapi from 'lib/dynapi';
import * as io from 'socket.io-client';
import * as utils from 'lib/utils';

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
            // WebSocket for dynamic events
            socket:         io.connect(),
            // Indexer from corail.id to sigma node
            nodeIndexer: {}
        }
    },
    computed: {
        connected: function() {
            return (!this.isProtected || this.isAuth) && this.isValid;
        },
        //tags indexed by id, used for dynapi to reconstruct objects
        tagIndexer: function() {
            let idx = {};
            this.tags.forEach( (t) => idx[t.id] = t );
            return idx;
        }
    },
    async mounted(){
        this.init();
    },
    components: {
        'sideBar': Menu,
        'sigma': Sigma
    },
    methods: {
        toggleForceAtlas: function() {
            this.$refs.sigma.toggleForceAtlas();
        },
        addCorail: async function( corail ){

            let newNode = this.$refs.sigma.addNode( corail );
            this.$refs.sigma.refresh();
            
            let params = {
                name: corail.name,
                description: corail.description,
                token: this.token,
                tags: ''
            };

            // tag ids to string, comma separated
            if( corail.tags instanceof Array ) {
                params.tags = corail.tags.map((t) => t.id).join(',');
            }
            
            // backend add
            let id = await api.addCorail(params);
            // update id with new unique id
            newNode.data.id = id;
            this.nodeIndexer[id] = newNode;
            console.log('NEW ID IS: ' + id);

        },
        updateCorail( info ) {
            // info = { corail: Corail, toAdd: tags[], toRem: tags[] }
            let node = this.selectedNode;
            let corail = info.corail;

            // Add new tag edges
            this.$refs.sigma.addEdge( node.id, info.toAdd );
            // remove tag edges
            this.$refs.sigma.removeEdge( node.id, info.toRem );

            //update node data
            let changed = utils.corailChanged(node.data, corail);
            node.data = corail;
            this.$refs.sigma.updateNode( node );
            this.$refs.sigma.refresh();

            //backend update
            if(changed){
                api.updateCorail( this.token, corail.id, corail.name, corail.description );
            }
            info.toAdd.forEach((tag) => api.addLink( this.token, corail.id, tag.id ));
            info.toRem.forEach((tag) => api.rmLink( this.token, corail.id, tag.id ));

            // corail is updated, unselect
            this.selectedCorail = undefined;
        },
        removeCorail( corail ) {
            // remove node in sigma
            console.log(this.selectedNode);
            this.$refs.sigma.removeNode(this.selectedNode);
            // remove node in backend
            api.removeCorail(this.token, corail.id);
        },
        async addTag( name ){
            let tag = { id: utils.tmpId(), name }
            this.tags.push(tag);
            let id = await api.addTag(this.token, name);
            tag.id = id;
        },
        removeTag( tag ){
            // TODO not waiting for backed, make possible in local
            this.tags = this.tags.filter(t => t.id !== tag.id);
            api.removeTag(this.token, tag.id);
            this.removeTagFromCorails(tag);
        },
        clickNode: function( node ){
            this.selectedNode = node;
            this.$refs.addCorail.load(node.data);
        },
        clickStage: function(){
            this.$refs.addCorail.reset();
        },
        init: async function() {

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
                dynapi.connect( this, this.socket );

            }
        },
        async buildRecif() {
            let corails = await api.getCorails(this.token);
            this.tags = await api.getTags(this.token);
            
            let nodes = this.$refs.sigma.buildGraph( corails );
            this.$refs.sigma.refresh();
            // add corails to indexer
            nodes.forEach(node => this.nodeIndexer[node.data.id] = node);
        },
        addRecif: async function() {
            
            let params = {
                name: this.name,
                description: this.description,
                isProtected: false
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
        },
        removeTagFromCorails: function(tag) {
            // get nodes containing a corail with this tag
            let nodes = Object.keys(this.nodeIndexer)
            .map(key => this.nodeIndexer[key])
            .filter(node => node.data.tags.some(t => t.id === tag.id));
            // remove edge from sigma, and remove tag from corails
            nodes.forEach(node => this.$refs.sigma.removeEdge(node.id, [tag]));
            nodes.forEach(node => node.data.tags = node.data.tags.filter(t => t.id !== tag.id));

            // actualise sigma
            this.$refs.sigma.refresh();

            // reload selected node
            if(this.selectedNode !== undefined){
                this.$refs.addCorail.load(this.selectedNode.data);
            }
        }
    },
    watch: {
        $route: function(route) {
            console.log('route changed');
            let newTitle = route.params.recif;
            if(newTitle !== this.name) {
                this.clear();
                //this.$refs.sigma.resetGraph();
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
