import * as AUTH from './auth';
import * as express from 'express';
import {ReqError, ReqSuccess} from './api';

let subscribers: any = {};

export interface Socket extends SocketIO.Socket {
    recifId: number;
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

    /**
     * Subscribe event
     * @param token
     */
    socket.on('subscribe', async (data: any) => {

        let decode = await AUTH.verifyToken(data.token, app.get('secret'));
        if(decode === undefined) {
            socket.emit('exception', new ReqError('token not valid') );
        }
        else {
            addSubscriber(decode.recif, socket);
        }
     });

     /**
      * Disconnect event
      */
      socket.on('disconnect', () => {
          removeSubscriber(socket)
      });

}