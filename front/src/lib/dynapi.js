
// self is this in the vue componnent
export function connect(self, socket) {

    console.log('dynapi');
    socket.emit('subscribe', { token: self.token });
    /**
     * Connection events
     */
    socket.on('connect', () => {
        console.log('connected to socket.io');
    });

    socket.on('subscribe failed', () => { throw new Error('subscribe failed'); });
    socket.on('subscribe success', () => console.log('subscribed to recif events'));


    /**
     * Add routes
     */

    socket.on('add corail', ( corail ) => {
        // fill tags from id to tag
        corail.tags = corail.tags.map((id) => self.tagIndexer[id]);
        if (self.nodeIndexer[corail.id] === undefined) {
            // add to sigma
            let node = self.$refs.sigma.addNode(corail);
            // hold reference to node for update
            self.nodeIndexer[corail.id] = node;
        }
    });

    socket.on('add tag', ( tag ) => {
        
        if( !self.tags.some((t) => t.name === tag.name) ) {
            self.tags.push(tag);
        }
    });

    socket.on('add link', ( link ) => {
        console.log('add link event');
        link.tagId = Number(link.tagId);

        let node = self.nodeIndexer[Number(link.corailId)];
        let tag = self.tags.find( (t) => t.id === link.tagId );

        // if doesnt already contains
        if (!node.data.tags.some((t) => t.id === link.tagId)) {
            self.$refs.sigma.addEdge(node.id, [tag]);
            node.data.tags.push(tag);
        }
    });

    /**
     * Remove routes
     */
}