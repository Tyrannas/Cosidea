<!--
Created by Orion 2017
-->

<template>
    <nav class="sideBar">
        <input type="text" class="myInput" placeholder="Corail" v-model="corailParam.name">
        <taginput
                v-model="corailParam.tags"
                :tagsValues="tagsNames"
                @menuAddTag="addTag"
                @menuDeleteTag="removeTag"
        ></taginput>
        <textarea class="myInput" placeholder="Description" v-model="corailParam.description"></textarea>
        <a class="myButton" v-on:click="addCorail" v-if="!isLoad" >Add Node</a>
        <a class="myButton" v-on:click="updateCorail" v-if="isLoad">Update Node</a>
        <a class="myButton" v-on:click="removeCorail" v-if="isLoad" >Remove Node</a>
        <!--<a class="myButton" v-on:click="toggleForceAtlas" >{{forceAtlasStatus}}</a>-->

        <div>
            <span v-for="counter in counters" :key="counter.id">
                <a> {{ counter.count }} : {{ counter.name }} </a>
                <toggle-button v-if="counter.count > 1" @change="toggleHighlight($event.value, counter.id)" :value="false" :labels="true"/>
                <br> 
            </span>
        </div>
    </nav>
</template>


<script>
import * as api from '../../lib/backendApi';
import multiselect from '../../../node_modules/vue-multiselect/src/Multiselect.vue'
import taginput from '../modules/TagInput.vue'

export default {
	name: 'menu',
	components: {
	    'multiselect': multiselect,
        'taginput': taginput,
	},
    props: ['tags', 'tagCounter'],
	data (){
		return {
			forceAtlasStatus: "Start",
			corailParam: {
                name: '',
                description: '',
                tags: []
            },
            oldCorail: undefined,
            toggleIds: []
		}
	},
    mounted: function() {
        this.reset();
    },
    computed: {
        tagsNames: function() {
            return this.tags.map((tag) => tag.name);
        },
        tagsByName: function() {
            let index = {};
            this.tags.forEach((tag) => index[tag.name] = tag);
            return index; 
        },
        tagsById: function() {
            let index = {};
            this.tags.forEach((tag) => index[tag.id] = tag);
            return index;
        },
        isLoad: function() {
            return this.oldCorail !== undefined;
        },
        counters: function() {
            return Object.keys(this.tagCounter)
            .map(id => { return { name: this.tagsById[id].name, count: this.tagCounter[id].length, id } })
            .sort((a, b) => b.count - a.count);
        }
    },
    methods: {
        reset: function() {
            this.corailParam = {
                name: "",
				tags: [],
				description : ""
            };
            this.oldCorail = undefined;
        },
	    toggleForceAtlas: function(){
	        this.$emit("toggleForceAtlas");
	        this.forceAtlasStatus = this.forceAtlasStatus === "Start" ? "Stop" : "Start";
        },
        updateCorail: function() {

            console.log('update!')

            let corail = Object.assign({}, this.corailParam);
            //corail.id = this.oldNode.data.id;

            if(corail.tags instanceof Array)
                corail.tags = corail.tags.map((tagName) => this.tagsByName[tagName]);
            
            let toAdd = [];
            let toRem = [];

            let indexer = {};
            // for each tag that we had before mark true
            this.oldCorail.tags.forEach((tag) => {
                indexer[tag.name] = true;
            });
            // for each node delete key if is not new, else add node
            this.corailParam.tags.forEach((tagName) => {
                // is old
                if(indexer[tagName] !== undefined) {
                    delete indexer[tagName];
                }
                // is new
                else {
                    toAdd.push(this.tagsByName[tagName]);
                }
            });

            // The key in indexer now gives us the deleted tags
            Object.keys(indexer).forEach((tagName) => {
                toRem.push(this.tagsByName[tagName]);
            });
            console.log('add tags: ' + toAdd.join(','));
            this.$emit('updateCorail', { corail, toAdd, toRem });
            
            this.reset();
        },
        addCorail: function(){

            // copy corail params to avoid references
            let corail = Object.assign({}, this.corailParam);

            // Get full tag object from tagName
            if(corail.tags instanceof Array) {
                corail.tags = corail.tags.map((tagName) => this.tagsByName[tagName]);
            }
            else {
                corail.tags = [];
            }

            // emit update event
	        this.$emit("addCorail", corail);
            this.reset();

        },
        removeCorail: function() {
            this.$emit('removeCorail', this.corailParam);
            this.reset();
        },
        load: function( corail ){

            this.reset();
            this.oldCorail = corail;
            this.corailParam = Object.assign({}, corail);
            //console.log(corail);
            // take tag names
            if(this.corailParam.tags instanceof Array) {
                this.corailParam.tags = this.corailParam.tags.map((tag) => tag.name);
            }
            else {
                this.corailParam.tags = [];
            }
        },
        addTag: function ( newTag ) {
            const tag = {
                name: newTag
            };

            this.$emit('addTag', newTag);
            this.corailParam.tags.push(tag.name);
        },
        removeTag: function ( oldTag ){
            this.$emit('removeTag', this.tagsByName[oldTag]);
            console.log(this.corailParam);
            this.corailParam.tags = this.corailParam.tags.filter(t => t!== oldTag.name);
        },
        toggleHighlight(isOn, id) {
            if(isOn) this.toggleIds.push(Number(id));
            else this.toggleIds = this.toggleIds.filter(i => i != id);
            
            this.$emit('toggleIds', this.toggleIds);
        }
    },
    mounted(){
	    console.log('component initialisé, values:');
	    console.log(this.tagsValues);
    }
}
</script>

<style>
    * {
        -moz-box-sizing: border-box;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
    }

	.sideBar{
		height: 100vh;
	    background: rgb(36, 36, 36);
	    width: 15%;
	    float: right;
	    display: block;
		min-width: 250px;
        padding-top: 1rem;
	}

	.myButton{
		background: #44acff;
		color: white;
		padding: 1rem;
		margin: 1rem;
		display: block;
	}
	.myButton:hover{
		background: #ff7876;
		cursor: pointer
	}

	.myInput{
        border: none;
        border-radius: 7px;
        display: block;
        width: 85%;
        padding: 1rem;
        margin: 1rem auto;
	}

    .deleteTag{
        background: indianred;
        padding: 0.5rem;
        color: white;
        float: left;
    }

</style>