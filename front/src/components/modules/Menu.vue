<!--
Sigma Menu component, allows to create nodes, modify the graph and force atlas.
Created by Orion 2017
-->

<template>
	<nav class="sideBar">
		<input type="text" class="myInput" placeholder="Idée" v-model="nodeParameters.label"/>
		<multiselect class="myInput"
				v-model="nodeParameters.tags"
				:options="tagsValues"
                :multiple="true">
		</multiselect>
		<textarea class="myInput" placeholder="Description" v-model="nodeParameters.description"></textarea>
		<a class="myButton" v-on:click="addNode">addNode</a>
        <a class="myButton" v-on:click="toggleFA">{{forceAtlasStatus}}</a>
	</nav>
</template>


<script>
import * as api from '../../lib/cosideaApi';
import multiselect from 'vue-multiselect'
export default {
	name: 'menu',
	components: {
	    'multiselect': multiselect
	},
	methods : {
		/**
		toggle Force Atlas 2
		 */
		toggleFA: function(){
		  if(this.instance.isForceAtlas2Running()){
			  this.instance.stopForceAtlas2();
			  this.forceAtlasStatus = "Start FA2"
		  }
		  else{
			  this.instance.startForceAtlas2({
                  linLogMode: true,
                  edgeWeightInfluence: 0.8,
                  scalingRatio: 1.5,
                  gravity: 1.3
              });
			  this.forceAtlasStatus = "Stop FA2"
		  }
		},
		/**
		add a Node to the graph, and create links if common tags
		 */
		addNode: function(){
			// init Node
			let newNode = {
				id : "N" + this.instance.graph.nodes().length + 1,
				label: this.nodeParameters.label,
				color: this.nodeParameters.color,
				x: Math.random(),
				y: Math.random(),
				size: 1,
				tags: this.nodeParameters.tags.map(w => w.toLowerCase()),
				description: this.nodeParameters.description
			};
			this.instance.graph.addNode(newNode);

			// create links between new Node and previously existing ones
			this.instance.graph.nodes().forEach(node => {
				// check if current node is not itself
				if(node.id !== newNode.id){
					node.tags.forEach(t => {
						// if two nodes have a tag in common
					   if(newNode.tags.includes(t)){
						   let id = "E" + newNode.id + "-" + node.id;
						   // if there is already an existing edge increase it
						   if(this.instance.graph.edges(id) !== undefined){
						       console.log('coucou')
							   //this.instance.graph.edges(id).weight *= 1.05;
						   }
						   // otherwise just create it
						   else
							   this.instance.graph.addEdge({
								   id : id,
								   source: newNode.id,
								   target: node.id,
								   label: [t],
								   size: 0.5,
								   color: "#3997ff",
								   weight: 1
							   });
						   // a node related to others is bigger
						   this.instance.graph.nodes(newNode.id).size *= 1.1;
						   node.size *= 1.1;
					   }
					});
				}
			});
			this.instance.refresh();
		}
	},
	data (){
		return {
			forceAtlasStatus: "Start FA2",
			nodeParameters: {
				label: "",
				color : "#ff951a",
				tags: null,
				description : ""
			},
			tagsValues: ['art', 'informatic', 'philosophy', 'politic', 'sociology', 'action', 'game', 'sport', 'society', 'anarchism', 'agriculture', 'education']
		}
	},
	/**
	sigma instance inherited from SigmaRoom
	 */
	props:['instance']
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