<template>
	<nav class="sideBar">
		<a class="myButton" v-on:click="toggleFA">{{forceAtlasStatus}}</a>
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
	  }
	},
	data (){
  	    return {
  	        forceAtlasStatus: "Start FA2"
		}
	},
	props:['instance']
}
</script>

<style>
	.sideBar{
		height: 100vh;
	    background: black;
	    width: 15%;
	    float: right;
	    display: block;
	}

	.myButton{
		background: white;
		padding: 1rem;
		margin: 1rem;
		display: block;
	}
	.myButton:hover{
		background: indianred;
		cursor: pointer
	}
</style>