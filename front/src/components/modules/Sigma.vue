<!--
Sigma Menu component, allows to create nodes, modify the graph and force atlas.
-->

<template>
    <!--Sigma container-->
    <div id="graph-container">
    </div>
</template>

<script>
    import _ from 'lodash'

    let sigmaSettings = {
        scalingMode : "outside",
        hideEdgesOnMove : true,
        zoomMin : 0,
        nodesPowRatio: 1,
        autoRescale: false
    };

    _.assign(sigma.settings, sigmaSettings);

    export default {

        name: 'sigma',
        data (){
            return {
                sigmaInstance: new sigma({
                    g : {
                        nodes: [],
                        edges: []
                    }
                }),
                defaultParameters:{
                    nodeColor: "#ff951a",
                    edgeColor: "#3997ff",
                    size: 1
                },
                forceAtlasParameters: {
                    linLogMode: false,
                    edgeWeightInfluence: 1,
                    scalingRatio: 10,
                    gravity: 1
                }
            }
        },
        methods : {
            /**
             toggle Force Atlas 2
             */
            toggleForceAtlas: function(){

                if(this.sigmaInstance.isForceAtlas2Running()){
                    this.sigmaInstance.stopForceAtlas2();
                }
                else{
                    this.sigmaInstance.startForceAtlas2( this.forceAtlasParameters );
                }
            },
            /**
             add a Node to the graph, and create links if common tags
             * @returns new node
             */
            addNode: function( params ){

                // init Node
                params.tags = params.tags.map(w => { if(typeof(w) === String) w.toLowerCase()});
                let newNode = {
                    id : "N" + this.sigmaInstance.graph.nodes().length + 1,
                    label: params.title,
                    color: this.defaultParameters.nodeColor,
                    x: Math.random(),
                    y: Math.random(),
                    size: this.defaultParameters.size,
                    data: params
                };

                // add the node to the graph
                this.sigmaInstance.graph.addNode(newNode);

                // create links between new Node and previously existing ones
                this.addEdge(newNode);
                console.log(this.sigmaInstance.graph.nodes());
                this.sigmaInstance.refresh();

                // returns the newly created node
                return this.sigmaInstance.graph.nodes(newNode.id);
            },
            /**
             * create links between a node and the rest of the graph if they share tags
             * @param newNode
             */
            addEdge: function( newNode ){

                this.sigmaInstance.graph.nodes().forEach(node => {
                    // check if current node is not itself
                    if(node.id !== newNode.id){
                        node.data.tags.forEach(t => {
                            // if two nodes have a tag in common
                            if(newNode.data.tags.includes(t)){
                                let id = "E" + newNode.id + "-" + node.id;

                                // if there is already an existing edge increase it
                                if(this.sigmaInstance.graph.edges(id) !== undefined){
                                    this.sigmaInstance.graph.edges(id).weight *= 1.05;
                                }

                                // otherwise just create it
                                else
                                    this.sigmaInstance.graph.addEdge({
                                        id : id,
                                        source: newNode.id,
                                        target: node.id,
                                        label: [t],
                                        size: 0.5,
                                        color: "#3997ff",
                                        weight: 1,
                                        type: 'curve'
                                    });
                                // a node related to others is bigger
                                this.sigmaInstance.graph.nodes(newNode.id).size += 0.2;
                                node.size += 0.5;
                            }
                        });
                    }
                });
            },
            /**
             * builds the graph with a array of nodes
             * @param nodesArray
             */
            buildGraph: function( nodesArray ){

                nodesArray.forEach(node => {
                    this.addNode( node );
                })
            },
            resetGraph: function (){
                this.sigmaInstance.graph = {
                    nodes: [],
                    edges: []
                }
            }
        },
        props:null,
        mounted (){

            this.sigmaInstance.addRenderer({
                type: "canvas",
                container: "graph-container"
            }).settings({
                'maxNodeSize': 30
            });

            this.sigmaInstance.refresh();
        }
    }
</script>

<style>

    .sigma-scene, .sigma-labels, .sigma-mouse {
        left: 0;
    }

    #graph-container {
        position: absolute;
        width: 100vw;
        height: 100vh;
        top: 0;
        left: 0;
        z-index: -1;
    }

</style>