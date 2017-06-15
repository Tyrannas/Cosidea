import * as express from 'express';
import * as recif from '../model/recif';
import * as corail    from '../model/corail';
import * as user    from '../model/user';
import * as tag     from '../model/tag';
import * as bcrypt  from 'bcrypt';
import * as jwt     from 'jsonwebtoken';
import * as auth    from './auth';
import * as socket  from './socket';

import {ReqError, ReqSuccess}   from './api';


export let router = express.Router();

/**
 * Route remove link between Corail and Tag
 */
router.use('/link', auth.secureRecif);
router.post('/link', async (req, res) => {

    let recifId = req.query.recifId;
    let token = req.query.token;
    let corailId = req.query.corailId;
    let tagId  = req.query.tagId;

    try {
        await corail.removeTag(corailId, tagId);
        socket.send(token, recifId, 'remove link', { corailId: Number(corailId), tagId: Number(tagId) });
        res.json( new ReqSuccess('Removed link'));
    }
    catch(err) {
        new ReqError('Failed removing link');
    }

});

/**
 * Route remove Corail
 */
router.use('/corail', auth.secureRecif);
router.post('/corail', async (req, res) => {

    let token = req.query.token;
    let recifId = req.query.recifId;
    let corailId = req.query.corailId;
    
    try {
        await corail.removeCorail(recifId, corailId);
        socket.send(token, recifId, 'remove corail', { id: Number(corailId) });
        res.json( new ReqSuccess('corail deleted') );
    }
    catch(err) {
        res.json( new ReqError(err) );
    }

});

router.use('/tag', auth.secureRecif);
router.post('/tag', async (req, res) => {

    let token = req.query.token;
    let recifId = req.query.recifId;
    let tagId = req.query.tagId;

    try {
        await tag.remove(recifId, tagId);
        socket.send(token, recifId, 'remove tag', { id: Number(tagId) });
        res.json( new ReqSuccess('tag deleted') );
    }
    catch(err) {
        res.json( new ReqError(err) );
    }
})