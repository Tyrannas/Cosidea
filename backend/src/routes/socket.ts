import * as AUTH from './auth';
import * as express from 'express';

let subscribers: any = {};

export interface Socket extends SocketIO.Socket {
    recifId: number,
    token: string
}

/**
 * Remember socket subscribed to Recif
 */
function addSubscriber(recifId: number, socket: Socket) {

    removeSubscriber(socket);

    if(subscribers[recifId] === undefined) {
        subscribers[recifId] = [];
    }
    subscribers[recifId].push(socket);
    socket.recifId = recifId;
}

/**
 * Remove socket form subscribers
 */
function removeSubscriber(socket: Socket) {
    // if socket didnt subscribe
    if(socket.recifId === undefined) {
        return;
    }
    // remove from subscribers
    let list = subscribers[socket.recifId];
    list = list.filter((s: Socket) => s.id === socket.id);

    delete socket.recifId;
}

/**
 * Socket io route, used for dynamic behavior on the Recif
 */
export function route( socket: Socket, app: express.Application) {
    //console.log('connected client');
    /**
     * Subscribe event
     * @param token
     */
    socket.on('subscribe', async (data: any) => {
        //console.log('subscribe ' + data.token);
        let decode = await AUTH.verifyToken(data.token, app.get('secret'));
        if(decode === undefined) {
            //console.log('failed');
            socket.emit('subscribe failed', 'token not valid' );
        }
        else {
            //console.log('success');
            socket.token = data.token;
            addSubscriber(decode.recif, socket);
            socket.emit('subscribe success');
        }
     });

     /**
      * Disconnect event
      */
      socket.on('disconnect', () => {
          removeSubscriber(socket);
      });

}

/**
 * Send function for api routes. Automatic broadcast to recif
 * @param recifId
 * @param event
 * @param data
 */
export function send( token: string, recifId: number, event: string, data: any) {

    let sockets = subscribers[recifId];
    if( sockets instanceof Array ) {
        
        sockets.forEach((socket) => {
            if(socket.token !== token)
                socket.emit( event, data );
        });
    
    }
}