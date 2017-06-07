<!--
Created by Orion 2017
-->

<template>
	<nav class="sideBar">
		<input type="text" class="myInput" placeholder="Corail" v-model="nodeParameters.name"/>
		<multiselect class="myInput"
				v-model="nodeParameters.alges"
				:options="algesNames"
                :multiple="true">
		</multiselect>
		<textarea class="myInput" placeholder="Description" v-model="nodeParameters.description"></textarea>
		<a class="myButton" v-on:click="submitNode"><span v-if="!charged">addNode</span><span v-else>updateNode</span></a>
        <a class="myButton" v-on:click="toggleForceAtlas">{{forceAtlasStatus}}</a>
	</nav>
</template>


<script>
import * as api from '../../lib/backendApi';
import multiselect from 'vue-multiselect'
export default {
	name: 'menu',
	components: {
	    'multiselect': multiselect
	},
    props: ['alges'],
	data (){
		return {
			forceAtlasStatus: "Start",
			nodeParameters: {},
            oldCorail: undefined,
			nodesId: 0
		}
	},
    mounted: function() {
        this.reset();
    },
    computed: {
        algesNames: function() {
            return this.alges.map((alge) => alge.name);
        },
        algesIndex: function() {
            let index = {};
            this.alges.forEach((alge) => index[alge.name] = alge);
            return index; 
        },
        charged: function() {
            return this.oldCorail !== undefined;
        }
    },
    methods: {
        reset: function() {
            this.nodeParameters = {
                name: "",
				alges: null,
				description : ""
            };
            this.oldCorail = undefined;
        },
	    toggleForceAtlas: function(){
	        this.$emit("toggleForceAtlas");
	        this.forceAtlasStatus = this.forceAtlasStatus === "Start" ? "Stop" : "Start";
        },
        submitNode: function() {
            // if is not charged, its a new node
            if(!this.charged) {
                this.addNode();
                return;
            }

            let coral = Object.assign({}, this.nodeParameters);
            if(coral.alges != null)
                coral.alges = coral.alges.map((algeName) => this.algesIndex[algeName]);
            
            let toAdd = { id: this.oldCorail.id, data: {alges: [] }};
            let toRem = { id: this.oldCorail.id, data: {alges: [] }};
            let updated = { id: this.oldCorail.id, data: coral };

            let indexer = {};
            // for each alge that we had before mark true
            this.oldCorail.data.alges.forEach((alge) => {
                indexer[alge.name] = true;
            });
            // for each node delete key if is not new, else add node
            this.nodeParameters.alges.forEach((algeName) => {
                // is old
                if(indexer[algeName] !== undefined) {
                    delete indexer[algeName];
                }
                // is new
                else {
                    toAdd.data.alges.push(this.algesIndex[algeName]);
                }
            });

            // The key in indexer now gives us the deleted alges
            Object.keys(indexer).forEach((algeName) => {
                toRem.data.alges.push(this.algesIndex[algeName]);
            });

            console.log(toAdd);
            console.log(toRem);
            this.$emit('updateNode', { new: updated, add: toAdd, rm: toRem });
            
            this.reset();
        },
        addNode: function(){

            // copy node params and assign default id
            let node = Object.assign({}, this.nodeParameters);

            node.id = this.nodesId++;
            // Get full alge object from algeName
            if(node.alges !== null && node.alges !== undefined)
                node.alges = node.alges.map((algeName) => this.algesIndex[algeName]);
            
            else
                node.alges = [];

            // emit update event
	        this.$emit("addNode", node);
            this.reset();

        },
        clickNode: function( node ){
            this.reset();
            this.oldCorail = Object.assign( {}, node );
            this.nodeParameters.name = node.data.name;
            this.nodeParameters.alges = node.data.alges.map((t) => t.name);
            this.nodeParameters.description = node.data.description;
        }
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
		background: #3997ff;
		color: white;
		padding: 1rem;
		margin: 1rem;
		display: block;
	}
	.myButton:hover{
		background: #ff951a;
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
    fieldset[disabled] .multiselect {
        pointer-events: none;
    }

    .multiselect,
    .multiselect__input,
    .multiselect__single {
        font-family: inherit;
        font-size: 12px;
        touch-action: manipulation;
    }

    .multiselect {
        box-sizing: content-box;
        display: block;
        position: relative;
        width: 85%;
        min-height: 40px;
        text-align: left;
        color: #35495E;
    }

    .multiselect * {
        box-sizing: border-box;
    }

    .multiselect:focus {
        outline: none;
    }

    .multiselect--disabled {
        pointer-events: none;
        opacity: 0.6;
    }

    .multiselect--active {
        z-index: 50;
    }

    .multiselect--active .multiselect__current,
    .multiselect--active .multiselect__input,
    .multiselect--active .multiselect__tags {
        border-radius: 7px;
    }


    .multiselect--above.multiselect--active .multiselect__current,
    .multiselect--above.multiselect--active .multiselect__input,
    .multiselect--above.multiselect--active .multiselect__tags {
        border-radius: 7px;
    }

    .multiselect__input,
    .multiselect__single {
        position: relative;
        display: inline-block;
        min-height: 20px;
        line-height: 20px;
        border: none;
        /*border-radius: 5px;*/
        background: #fff;
        padding: 1px 0 0 5px;
        width: calc(100%);
        transition: border 0.1s ease;
        box-sizing: border-box;
        margin-bottom: 8px;
    }

    .multiselect__tag ~ .multiselect__input,
    .multiselect__tag ~ .multiselect__single {
        width: auto;
    }

    .multiselect__input:hover,
    .multiselect__single:hover {
        border-color: #cfcfcf;
    }

    .multiselect__input:focus,
    .multiselect__single:focus {
        border-color: #a8a8a8;
        outline: none;
    }

    .multiselect__single {
        padding-left: 6px;
        margin-bottom: 8px;
    }

    .multiselect__tags {
        min-height: 40px;
        display: block;
        padding: 8px 8px 0 8px;
        border-radius: 7px;
        border: 1px solid #E8E8E8;
        background: #fff;
    }

    .multiselect__tag {
        position: relative;
        display: inline-block;
        padding: 4px 26px 4px 10px;
        border-radius: 7px;
        margin-right: 3px;
        color: #fff;
        line-height: 1;
        background: #3997ff;
        margin-bottom: 5px;
        white-space: nowrap;
    }

    .multiselect__tag-icon {
        cursor: pointer;
        margin-left: 7px;
        position: absolute;
        right: 0;
        top: 0;
        bottom: 0;
        font-weight: 700;
        font-style: initial;
        width: 22px;
        text-align: center;
        line-height: 22px;
        transition: all 0.2s ease;
        /*border-radius: 5px;*/
    }

    .multiselect__tag-icon:after {
        content: "×";
        color: #fffdfc;
        font-size: 14px;
    }

    .multiselect__tag-icon:focus,
    .multiselect__tag-icon:hover {
        background: #ff951a;
    }

    .multiselect__tag-icon:focus:after,
    .multiselect__tag-icon:hover:after {
        color: white;
    }

    .multiselect__current {
        line-height: 16px;
        min-height: 40px;
        box-sizing: border-box;
        display: block;
        overflow: hidden;
        padding: 8px 12px 0;
        padding-right: 30px;
        white-space: nowrap;
        margin: 0;
        text-decoration: none;
        /*border-radius: 5px;*/
        border: 1px solid #E8E8E8;
        cursor: pointer;
    }

    .multiselect__select {
        line-height: 16px;
        display: none;
        position: absolute;
        box-sizing: border-box;
        width: 40px;
        height: 38px;
        right: 1px;
        top: 1px;
        padding: 4px 8px;
        margin: 0;
        text-decoration: none;
        text-align: center;
        cursor: pointer;
        transition: transform 0.2s ease;
    }

    .multiselect__select:before {
        position: relative;
        right: 0;
        top: 65%;
        color: #999;
        margin-top: 4px;
        border-style: solid;
        border-width: 5px 5px 0 5px;
        border-color: #999999 transparent transparent transparent;
        content: "";
    }

    .multiselect__placeholder {
        color: #ADADAD;
        display: inline-block;
        margin-bottom: 10px;
        padding-top: 2px;
    }

    .multiselect--active .multiselect__placeholder {
        display: none;
    }

    .multiselect__content {
        position: absolute;
        list-style: none;
        display: block;
        background: #fff;
        width: 100%;
        max-height: 240px;
        overflow: auto;
        padding: 0;
        margin: 0;
        border: 1px solid #E8E8E8;
        border-top: none;
        /*border-bottom-left-radius: 5px;*/
        /*border-bottom-right-radius: 5px;*/
        z-index: 50;
    }

    .multiselect--above .multiselect__content {
        bottom: 100%;
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
        /*border-top-left-radius: 5px;*/
        /*border-top-right-radius: 5px;*/
        border-bottom: none;
        border-top: 1px solid #E8E8E8;
    }

    .multiselect__content::webkit-scrollbar {
        display: none;
    }

    .multiselect__element {
        display: block;
    }

    .multiselect__option {
        display: block;
        padding: 12px;
        min-height: 40px;
        line-height: 16px;
        text-decoration: none;
        text-transform: none;
        vertical-align: middle;
        position: relative;
        cursor: pointer;
        white-space: nowrap;
    }

    .multiselect__option:after {
        top: 0;
        right: 0;
        position: absolute;
        line-height: 40px;
        padding-right: 12px;
        padding-left: 20px;
    }

    .multiselect__option--highlight {
        background: #ff951a;
        outline: none;
        color: white;
    }

    .multiselect__option--highlight:after {
        content: attr(data-select);
        background: #ff951a;
        color: white;
    }

    .multiselect__option--selected {
        background: #F3F3F3;
        color: #35495E;
        font-weight: bold;
    }

    .multiselect__option--selected:after {
        content: attr(data-selected);
        color: silver;
    }

    .multiselect__option--selected.multiselect__option--highlight {
        background: #FF6A6A;
        color: #fff;
    }

    .multiselect__option--selected.multiselect__option--highlight:after {
        background: #FF6A6A;
        content: attr(data-deselect);
        color: #fff;
    }

    .multiselect--disabled {
        background: #ededed;
        pointer-events: none;
    }


</style>