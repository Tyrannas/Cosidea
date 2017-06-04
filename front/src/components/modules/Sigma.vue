<template>
	<div id="graph-container">
	</div>
</template>

<script>

//import Sigma from 'Sigma'

//import Sigma from 'sigma/build/sigma.require'
//require('sigma/build/sigma.require')
//console.log(typeof(sigma))
//import 'sigma/build/plugins/sigma.layout.forceAtlas2.min'
sigma.settings.scalingMode = "outside";

let i,
    N = 50,
    E = 150,
    g = {
      nodes: [],
      edges: []
    },
    colors = [
      '#617db4',
      '#668f3c',
      '#c6583e',
      '#b956af'
    ];

for (i = 0; i < N; i++)
  g.nodes.push({
    id: 'n' + i,
    label: 'Node ' + i,
    x: Math.random(),
    y: Math.random(),
    size: Math.random(),
    color: colors[Math.floor(Math.random() * colors.length)]
  });

for (i = 0; i < E; i++)
  g.edges.push({
    id: 'e' + i,
    source: 'n' + (Math.random() * N | 0),
    target: 'n' + (Math.random() * N | 0),
    size: Math.random(),
    type: 't'
  });

let s = new sigma({
  graph: g,
});


console.log(s.graph.edges(), s.graph.nodes(), "ok")
export default {
  name: 'sigma',
  data () {
    return {
      sigmaInstance: s
    }
  },
  mounted(){
    s.addRenderer({
      type: "canvas",
      container: "graph-container"
      })
      .settings({
          'maxNodeSize':35
    });
    s.refresh();
    s.startForceAtlas2();
  }
}
</script>

<style>
  #graph-container {
  position: absolute;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  z-index: -1;
}

body{
  overflow: hidden;
}

.sigma-scene, .sigma-labels, .sigma-mouse {
    left: 0;
}
</style>