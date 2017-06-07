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
        nodesPowRatio: 1,
        autoRescale: false
    };

    _.assign(sigma.settings, sigmaSettings);
    export default {

        name: 'sigma',
        data (){
            return {
                tagCounter: {},
                sigmaInstance: new sigma({
                    g : {
                        nodes: [],
                        edges: [],
                        settings: {
                            clone: true
                        }
                    }
                }),
                config:{
                    nodeColor: "#ff951a",
                    edgeColor: "#3997ff",
                    nodeSize: 1,
                    edgeSize: 0.5,
                    edgeWeight: 1
                },
                forceAtlasParameters: {
                    linLogMode: false,
                    edgeWeightInfluence: 1,
                    scalingRatio: 10,
                    gravity: 1
                },
                nodesId: 0
            }
        },
        methods : {
            /**
             * Fast accesor for Edges
             * @param id
             * @returns edge
             * */
            edges(id) {
                if(!id) return this.sigmaInstance.graph.edges();
                return this.sigmaInstance.graph.edges(id);
            },
            /**
             * Fast accesor for dragNodes
             * @param id
             * @returns node
             * */
            nodes(id) {
                if(id === undefined) return this.sigmaInstance.graph.nodes();
                return this.sigmaInstance.graph.nodes(id);
            },
            /**
             toggle Force Atlas 2
             */
            toggleForceAtlas: function(){

                if(this.sigmaInstance.isForceAtlas2Running()){
                    this.sigmaInstance.killForceAtlas2();
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

                console.log(params);
                if(params.tags === undefined) {
                    params.tags = [];
                }

                // init Node
                let newNode = {
                    label: params.name,
                    id : this.nodesId++,
                    color: this.config.nodeColor,
                    x: Math.random(),
                    y: Math.random(),
                    size: this.config.nodeSize,
                    data: params,
                    realSize: 0
                };

                // add the node to the graph
                this.sigmaInstance.graph.addNode(newNode);
                newNode = this.nodes(newNode.id);
                // create links between new Node and previously existing ones
                this.addEdge(newNode);
                //console.log(this.sigmaInstance.graph.nodes());
                this.bindEvents();

                if(this.sigmaInstance.isForceAtlas2Running()){
                    this.sigmaInstance.killForceAtlas2();
                    this.sigmaInstance.startForceAtlas2();
                }
                // returns the newly created node
                return newNode;
            },
            /**
             * create links between a node and the rest of the graph if they share tags
             * @param newNode
             */
            addEdge: function( newNode ){
              newNode.data.tags.forEach((tag) => {
 
                    if(this.tagCounter[tag.name] == null || !this.tagCounter[tag.name].length) {
                        this.tagCounter[tag.name] = [];
                    }
                    else {

                        let nodes = this.tagCounter[tag.name];
                        nodes.forEach((node) => {

                            let id = this.createId(newNode.id, node.id);

                            // if there is already an existing edge increase it
                            if(this.edges(id) !== undefined){
                                this.resizeEdge(this.edges(id), 1);
                            }
                            // else add new edge
                            else {
                                this.sigmaInstance.graph.addEdge({
                                    id : id,
                                    source: newNode.id,
                                    target: node.id,
                                    label: [tag.name],
                                    size: this.config.edgeSize,
                                    color: "#3997ff",
                                    weight: this.config.edgeWeight,
                                    type: 'curve',
                                    realSize: 1
                                });
                            }
                            // a node related to others is bigger
                            this.resizeNode(newNode, 1);
                            this.resizeNode(node, 1);
                        });
                    }
                    // insert node into tagCounter
                    this.tagCounter[tag.name].push(newNode);
                    
                });
            },
            /**
             * Resize Node by value
             * @param node
             * @param value
             **/
            resizeNode( node, value ) {
                node.realSize += value;
                node.size = this.config.nodeSize + node.realSize * 0.2;
            },
            /**
             * Resize Edge by value
             * @param value
             * */
            resizeEdge( edge, value ) {
                edge.realSize += value;
                edge.weight = this.config.edgeWeight * Math.pow(1.05, edge.realSize);
            },
            /**
             * Remove Edges from Graph
             * @param node
             * */
            removeEdge: function( node ) {
                //for each tag to be removed look into tagCounter lower edges
                node.data.tags.forEach((tag) => {

                    let nodes = this.tagCounter[tag.name];
                    let index = -1, size = nodes.length;

                    for(let i = 0; i < size; i++) {

                        // if we found our node in the tagCounter remember index for delete
                        if(nodes[i].id === node.id) {
                            index = i;
                            continue;
                        }
                        console.log(nodes[i].data.name);
                        // if we found another node, resize existing edge
                        let id = this.createId(nodes[i].id, node.id);
                        if(this.edges(id) !== undefined) {

                            if(this.edges(id).realSize === 1)
                                this.sigmaInstance.graph.dropEdge(id);
                            else 
                                this.resizeEdge(this.edges(id), -1);
                        }
                        // also resize nodes
                        this.resizeNode(node, -1);
                        this.resizeNode(nodes[i], -1);
                    }
                    // remove node from tagCounter
                    this.tagCounter[tag.name].splice(index, 1);
                });
            },
            /**
             * update node data field
             * @param node
             * */
            updateNode( node ) {
                this.nodes(node.id).data = node.data;
                this.nodes(node.id).label = node.data.name;
            },
            /**
             * builds the graph with a array of nodes
             * @param nodesArray
             */
            buildGraph: function( nodesArray ){
                nodesArray.forEach(node => {
                    this.addNode( node );
                });
            },
            /**
             * reset the graph
             */
            resetGraph: function (){
                this.sigmaInstance.graph = {
                    nodes: [],
                    edges: []
                }
            },
            /**
             * bind the events to the graph
             */
            bindEvents: function(){
                // store this reference to access it inside the event binding
                // otherwise the event is 'this'
                let parent = this;

                // send node to menu when clicked on
                this.sigmaInstance.bind('clickNode', function( event ){
                    let node = event.data.node;
                    //console.log(parent);
                    parent.$emit('clickNode', node);
                });

                // empty menu when clicked on canvas
                this.sigmaInstance.bind('clickStage', function ( event ){
                   parent.$emit('clickStage');
                });

                // dragListener
                let dragListener = sigma.plugins.dragNodes(this.sigmaInstance, this.sigmaInstance.renderers[0]);
                this.sigmaInstance.refresh();
            },
            /**
             * Creates Unique EdgeId
             * @param nodeId1
             * @param nodeId2
             * @return id: string
             * */
            createId(nodeId1, nodeId2) {
                nodeId1 = Number(nodeId1);
                nodeId2 = Number(nodeId2);
                if(nodeId1 < nodeId2) return '' + nodeId1 + '-' + nodeId2;
                else if(nodeId2 < nodeId1) return '' + nodeId2 + '-' + nodeId1;
                throw new Error('Edge between same nodes!');
            },
        },
        props:null,
        mounted (){

            this.sigmaInstance.addRenderer({
                type: "canvas",
                container: "graph-container",
                nodeHoverColor: "default",
                defaultNodeHoverColor: this.config.edgeColor
            }).settings({
                'maxNodeSize': 30,
            });

            this.bindEvents();
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