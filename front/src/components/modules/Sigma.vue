<template>
	<div id="graph-container">
	</div>
</template>

<script>
import sigma from 'sigma'


var i,
    s,
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

var s = new sigma({
  graph: g,
});

setTimeout(function(){
  s.addRenderer({
    type: "canvas",
    container: "graph-container"
    })
    .settings({
        'maxNodeSize':35
    });
    s.refresh();
  }, 2000)


console.log(s.graph.edges(), s.graph.nodes(), "ok")
export default {
  name: 'sigma',
  data () {
    return {
      sigmaInstance: s
    }
  }
}
</script>

<style>
  #graph-container {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}
</style>