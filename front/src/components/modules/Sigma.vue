<template>
    <div id="graph-container">
    </div>
</template>

<script>

    sigma.settings = {
        scalingMode : "outside",
        hideEdgesOnMove : true,
        zoomMin : 0
    };

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
                    edgeColor: "#3997ff"
                },
                forceAtlasParameters: {
                    linLogMode: true,
                    edgeWeightInfluence: 0.8,
                    scalingRatio: 1.5,
                    gravity: 0.2
                }
            }
        },
        methods : {
            /**
             toggle Force Atlas 2
             */
            toggleFA: function(){
                if(this.sigmaInstance.isForceAtlas2Running()){
                    this.sigmaInstance.stopForceAtlas2();
                }
                else{
                    this.sigmaInstance.startForceAtlas2( this.forceAtlasParameters );
                }
            },
            /**
             add a Node to the graph, and create links if common tags
             */
            addNode: function( params ){

                // init Node
                let newNode = {
                    id : "N" + this.sigmaInstance.graph.nodes().length + 1,
                    label: params.label,
                    color: this.defaultParameters.nodeColor,
                    x: Math.random(),
                    y: Math.random(),
                    size: 1,
                    tags: params.tags.map(w => w.toLowerCase()),
                    description: params.description
                };

                // add the node to the grph
                this.sigmaInstance.graph.addNode(newNode);

                // create links between new Node and previously existing ones
                this.addEge(newNode);

                this.sigmaInstance.refresh();
            },
            /**
             * create links between a node and the rest of the graph if they share tags
             * @param newNode
             */
            addEge: function( newNode ){

                this.sigmaInstance.graph.nodes().forEach(node => {
                    // check if current node is not itself
                    if(node.id !== newNode.id){
                        node.tags.forEach(t => {
                            // if two nodes have a tag in common
                            if(newNode.tags.includes(t)){
                                let id = "E" + newNode.id + "-" + node.id;
                                // if there is already an existing edge increase it
                                if(this.sigmaInstance.graph.edges(id) !== undefined){
                                    console.log('coucou')
                                    //this.sigmaInstance.graph.edges(id).weight *= 1.05;
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
                                        weight: 1
                                    });
                                // a node related to others is bigger
                                this.sigmaInstance.graph.nodes(newNode.id).size *= 1.1;
                                node.size *= 1.1;
                            }
                        });
                    }
                });
            }
        },
        props:null,
        mounted (){
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