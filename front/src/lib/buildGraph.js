/**
 * Created by Orion on 6/5/2017.
 */

const _ = require('lodash');
graphApi = {};

/**
 * Takes data from the db and parse it to build a graph
 * @param data
 * @returns {nodes, edges}
 */

graphApi.buildGraph = function( data ){
    let nodes = [];
    let edges = {};
    let hash = {};

    data.forEach(idea => {
        let n = {
            'id': idea.id,
            'label': idea.label,
            'size': 1,
            'color': "#ff951a",
            'tags': idea.tags
        };
        nodes.push(n);
        idea.tags.forEach(t => {
           hash[t] ? hash[t].push(idea.id) : hash[t] = [idea.id];
        });
    });

    for(let t in hash){
        for(let i=0; i < hash[t].length; ++i){
            for(let j=i+1; j < hash[t].length; ++j){
                if(edges[i + "-" + j]){
                    edges[i + "-" + j].weight *= 1.1;
                }
                else{
                    edges[edges[i + "-" + j]] = {
                        id :i + "-" + j,
                        source: hash[t][i],
                        target: hash[t][j],
                        size: 0.5,
                        color: "#3997ff",
                        weight: 1,
                        type: 'curve'
                    }
                }
            }
        }
    }
    edges = _.toArray(edges)
    return {'nodes': nodes, 'edges': edges};
};

export graphApi;