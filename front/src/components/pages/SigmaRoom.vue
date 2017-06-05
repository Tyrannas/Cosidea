<template>
  <div id="test">
    <sideBar id="add_idea" :instance="instance"></sideBar>
    <div id="graph-container"></div>
  </div>
</template>

<script>
import Menu from '../modules/Menu.vue'
sigma.settings.scalingMode = "outside";

let i,
    N = 50,
    E = 100,
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
export default {
      name: 'sigmaRoom',
      data () {
            return {
                lorem: 'Lorem ipsum sit dolor.',
                instance: s
            }
      },
      components: {
        'sideBar': Menu
      },
      mounted(){
        s.addRenderer({
            type: "canvas",
            container: "graph-container"
        }).settings({
            'maxNodeSize': 35
        });
        s.refresh();
      }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

#add_idea {
    float: right;
    z-index: 2;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
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
