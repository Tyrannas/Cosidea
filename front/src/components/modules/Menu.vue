<template>
	<nav class="sideBar">
		<a class="myButton" v-on:click="toggleFA">{{forceAtlasStatus}}</a>
		<input type="text" class="myInput" placeholder="Idée" v-model="nodeLabel"/>
		<a class="myButton" v-on:click="addNode">addNode</a>
	</nav>
</template>


<script>
export default {
  	name: 'menu',
	methods : {
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
		addNode: function(){
		    let node = {
		        id : "N" + this.instance.graph.nodes().length + 1,
				label: this.nodeParameters.label,
				color: this.nodeParameters.color,
                x: Math.random(),
                y: Math.random(),
                size: Math.random(),
				tags: this.nodeParameters.tags
			}
			this.instance.graph.addNode(node);
		    this.instance.refresh();
		}
	},
	data (){
  	    return {
  	        forceAtlasStatus: "Start FA2",
			nodeParameters: {
  	            label: "",
				color : "red",
				tags: ['art', 'informatic']
			}
		}
	},
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
		min-width: 150px;
	}

	.myButton{
		background: #2471ff;
		color: white;
		padding: 1rem;
		margin: 1rem;
		display: block;
	}
	.myButton:hover{
		background: #cd6231;
		cursor: pointer
	}

	.myInput{
		padding: 1.2rem;
	}
</style>