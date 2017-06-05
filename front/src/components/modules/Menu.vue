<!--
Sigma Menu component, allows to create nodes, modify the graph and force atlas.
Created by Orion 2017
-->

<template>
	<nav class="sideBar">
		<a class="myButton" v-on:click="toggleFA">{{forceAtlasStatus}}</a>
		<input type="text" class="myInput" placeholder="Idée" v-model="nodeParameters.label"/>
		<textarea class="myInput" placeholder="Description" v-model="nodeParameters.description"/>
		<input type="text" class="myInput" placeholder="Tags" v-model="nodeParameters.tags"/>
		<a class="myButton" v-on:click="addNode">addNode</a>
	</nav>
</template>


<script>
export default {
  	name: 'menu',
	methods : {
  	    /*
  	    toggle Force Atlas 2
  	     */
		toggleFA: function(){
		  if(this.instance.isForceAtlas2Running()){
			  this.instance.stopForceAtlas2();
			  this.forceAtlasStatus = "Start FA2"
		  }
		  else{
			  this.instance.startForceAtlas2();
			  this.forceAtlasStatus = "Stop FA2"
		  }
		},
		/*
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
				tags: this.nodeParameters.tags.toLowerCase().split(';'),
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
							   this.instance.graph.edges(id).weight *= 1.5;
						   }
						   // otherwise just create it
						   else
							   this.instance.graph.addEdge({
								   id : id,
								   source: newNode.id,
								   target: node.id,
								   label: [t],
								   size: Math.random(),
								   color: "#3997ff",
								   weight: 1
							   });
						   // a node related to others is bigger
						   console.log(this.instance.graph.nodes())
						   this.instance.graph.nodes(newNode.id).size *= 2;
						   node.size *= 2;
					   }
					});
                }
			});
            console.log(this.instance.graph.nodes())
		    this.instance.refresh();
		}
	},
	data (){
  	    return {
  	        forceAtlasStatus: "Start FA2",
			nodeParameters: {
  	            label: "",
				color : "#ff951a",
				tags: "",
				description : ""
			}
		}
	},
	/*
	sigma instance inherited from SigmaRoom
	 */
	props:['instance']
}
</script>

<style>
	.sideBar{
		height: 100vh;
	    background: rgb(36, 36, 36);
	    width: 15%;
	    float: right;
	    display: block;
		min-width: 250px;
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
		padding: 1.2rem;
		margin: 1rem 1rem;
	}
</style>