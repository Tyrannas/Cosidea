
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
     * Create routes
     */

    socket.on('create corail', ( corail ) => {
        // fill tags from id to tag
        corail.tags = corail.tags.map((id) => self.tagIndexer[id]);
        if (self.nodeIndexer[corail.id] === undefined) {
            // add to sigma
            let node = self.$refs.sigma.addNode(corail);
            self.$refs.sigma.refresh();
            // hold reference to node for update
            self.nodeIndexer[corail.id] = node;
        }
    });

    socket.on('create tag', ( tag ) => {
        
        if( !self.tags.some((t) => t.name === tag.name) ) {
            self.tags.push(tag);
        }
    });

    socket.on('create link', ( link ) => {
        console.log('add link event');
        link.tagId = link.tagId;

        let node = self.nodeIndexer[link.corailId];
        let tag = self.tags.find( (t) => t.id === link.tagId );

        // if doesnt already contains
        if (!node.data.tags.some((t) => t.id === link.tagId)) {
            self.$refs.sigma.addEdge(node.id, [tag]);
            self.$refs.sigma.refresh();
            node.data.tags.push(tag);
        }
    });

    /**
     * Remove routes
     */

    socket.on('remove corail', ( corail ) => {

        let node = self.nodeIndexer[corail.id];
        self.$refs.sigma.removeNode(node);

    });

    socket.on('remove tag', ( tag ) => {
        // we only recive tag id, retrive full tag
        tag = self.tags.find(t => t.id === tag.id);
        console.log(tag);
        self.tags = self.tags.filter(t => t.id !== tag.id);
        self.removeTagFromCorails(tag);

    });

    socket.on('remove link', ( link ) => {
        console.log(link);
        let node = self.nodeIndexer[link.corailId];
        let corail = node.data;
        let tag = self.tags.find(t => t.id === link.tagId);

        // remove from sigma
        self.$refs.sigma.removeEdge( node.id, [tag] );
        self.$refs.sigma.refresh();

        corail.tags = corail.tags.filter(t => t.id !== link.tagId);

    });
}