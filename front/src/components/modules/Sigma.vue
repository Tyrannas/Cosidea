<!--
Sigma Menu component, allows to create nodes, modify the graph and force atlas.
-->

<template>
    <!--Sigma container-->
    <div id="graph-container">
    </div>
</template>

<script>
    import _ from 'lodash';
    import * as config from 'config/sigma';

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
                corailIndex: {},
                highlightedTags : [],
                sigmaInstance: new sigma({
                    g : {
                        nodes: [],
                        edges: [],
                        settings: {
                            clone: true
                        }
                    }
                }),
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

                //console.log(params);
                if(!(params.tags instanceof Array)) {
                    params.tags = [];
                }

                // init Node
                let newNode = {
                    label: params.name,
                    id : this.nodesId++,
                    color: config.node.color,
                    x: Math.random(),
                    y: Math.random(),
                    size: config.node.size,
                    data: params,
                    edges: []
                };

                // add the node to the graph
                this.sigmaInstance.graph.addNode(newNode);
                newNode = this.nodes(newNode.id);
                // create links between new Node and previously existing ones
                this.addEdge(newNode.id, params.tags);
                //console.log(this.sigmaInstance.graph.nodes());

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
            addEdge: function( nodeId, tags ){
                // get the newNode
                let newNode = this.nodes(nodeId);

                tags.forEach((tag) => {
 
                    if(this.tagCounter[tag.id] == null || !this.tagCounter[tag.id].length) {
                        this.tagCounter[tag.id] = [];
                    }
                    else {

                        let nodes = this.tagCounter[tag.id];
                        nodes.forEach((node) => {

                            let id = this.createId(newNode.id, node.id);

                            // if there is already an existing edge increase it
                            if(this.edges(id) !== undefined){
                                this.edges(id).tags.push(tag.id);
                                this.updateEdgeProps(this.edges(id));
                            }
                            // else add new edge
                            else {
                                this.sigmaInstance.graph.addEdge({
                                    id : id,
                                    source: newNode.id,
                                    target: node.id,
                                    label: [tag.name],
                                    size: config.edge.size,
                                    color: "#3997ff",
                                    weight: 0,
                                    type: 'curve',
                                    tags: [tag.id]
                                });
                                // update edge weight
                                this.updateEdgeProps(this.edges(id));
                                // add edge to node
                                newNode.edges.push(this.edges(id));
                                node.edges.push(this.edges(id));
                                this.resizeNode(newNode);
                                this.resizeNode(node);
                            }

                        });
                    }
                    // insert node into tagCounter
                    this.tagCounter[tag.id].push(newNode);
                });
                this.$emit('tagCounter', this.tagCounter);
            },
            /**
             * Resize Node
             * @param node
             * @param value
             **/
            resizeNode( node ) {
                let size = node.edges.length;
                node.size = config.node.size + size*0.2;
            },
            /**
             * Update Edge size / weight / color depending on its internal values
             * @param value
             * */
            updateEdgeProps( edge ) {
                let size = edge.tags.length;
                edge.weight = config.edge.weight * Math.pow(1.05, size);

                if(_.intersection(edge.tags, this.highlightedTags).length !== 0) {
                    edge.color = config.edge.highlightColor;
                }
                else {
                    edge.color = config.edge.color;
                }
            },
            /**
             * Remove Node
             * @param node
             * */
            removeNode: function( node ) {

                this.removeEdge( node.id, node.data.tags );

                this.sigmaInstance.graph.dropNode(node.id);
                this.sigmaInstance.refresh();
            },
            /**
             * Remove Edges from Graph
             * @param node
             * */
            removeEdge: function( nodeId, tags ) {
                // the node we want to update
                let node = this.nodes(nodeId);

                //for each tag to be removed look into tagCounter lower edges
                tags.forEach((tag) => {

                    let nodes = this.tagCounter[tag.id];
                    let index = -1, size = nodes.length;

                    for(let i = 0; i < size; i++) {

                        // if we found our node in the tagCounter remember index for delete
                        if(nodes[i].id === nodeId) {
                            index = i;
                            continue;
                        }
                        
                        // if we found another node, resize existing edge
                        let id = this.createId(nodes[i].id, nodeId);
                        let edge = this.edges(id);
                        if(edge !== undefined) {

                            if(edge.tags.length === 1) {
                                this.sigmaInstance.graph.dropEdge(id);
                                // notify node that edges dropped
                                node.edges = node.edges.filter(e => e.id != id);
                                nodes[i].edges = nodes[i].edges.filter(e => e.id != id);
                                this.resizeNode(node);
                                this.resizeNode(nodes[i]);
                            }
                            else {
                                edge.tags = edge.tags.filter(t => t != tag.id);
                                this.updateEdgeProps(edge);
                            }
                        }
                    }
                    // remove node from tagCounter
                    this.tagCounter[tag.id].splice(index, 1);
                });
                this.$emit('tagCounter', this.tagCounter);
            },
            /**
             * update node data field
             * @param node
             * */
            updateNode( node ) {
                this.nodes(node.id).data = node.data;
                this.nodes(node.id).label = node.data.name;
                this.sigmaInstance.refresh();
            },
            /**
             * builds the graph with a array of nodes
             * @param nodesArray
             */
            buildGraph: function( nodesArray ){
                let nodes = [];
                
                nodesArray.forEach(node => {
                    nodes.push(this.addNode( node ));
                });

                return nodes;
            },
            /**
             * reset the graph
             */
            resetGraph: function (){
                this.sigmaInstance.graph.clear();
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
                    //console.log(node.id);
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
            /**
             * refresh sigma instance and toggle fast Force atlas for reordering
             **/
            refresh() { 
                this.sigmaInstance.refresh();
                this.toggleForceAtlas(); 
                setTimeout(() => this.toggleForceAtlas(), 200); 
            },
            /**
             * Highlight edges
             * */
            highlightTags( tagIds ) {
                this.highlightedTags = tagIds;

                let hEdges = []; // edges to highlight
                let dEdges = []; // edges to stay default mode
                let hNodes = new Set();
                let dNodes = new Set();

                this.edges().forEach((e) => {
                    if(_.intersection(e.tags, tagIds).length !== 0) {
                        hEdges.push(e);
                        hNodes.add(e.source);
                        hNodes.add(e.target);
                    }
                    else {
                        dEdges.push(e);
                        dNodes.add(e.source);
                        dNodes.add(e.target);
                    }
                });

                hEdges.forEach(e => {
                    e.color = config.edge.highlightColor;
                    e.size = config.edge.highlightSize;
                });
                dEdges.forEach(e => {
                    e.color = config.edge.color;
                    e.size = config.edge.size;
                });

                for(let nId of dNodes)this.sigmaInstance.graph.nodes(nId).color = config.node.color;
                for(let nId of hNodes)this.sigmaInstance.graph.nodes(nId).color = config.node.highlightColor;

                this.sigmaInstance.refresh();
            }
        },
        props:null,
        mounted (){

            this.sigmaInstance.addRenderer({
                type: "canvas",
                container: "graph-container",
                nodeHoverColor: "default",
                defaultNodeHoverColor: config.edge.color
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