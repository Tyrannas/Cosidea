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
 * Route create user
 * @param name
 * @param pwd
 */
router.post('/user', async (req, res) => {

    let name    = req.query.name as string;
    let pwd     = req.query.pwd as string;
    let usr     = await user.findByName(name);

    if(usr !== undefined) {
        res.json(new ReqError('Username already exist'));
        return;
    }

    if(pwd.length < 4) {
        res.json(new ReqError('Choose a password with 4 or more characters'));
        return;
    }

    let hash = await bcrypt.hash(pwd, req.app.get('saltRounds'));
    
    user.addUser(name, hash)
    .then((id) => res.json( new ReqSuccess(id) ))
    .catch(() => res.json( new ReqError('Add User failed') ));

});

/**
 * Route create recif
 */
router.post('/recif', async(req, res) => {

    let name        = req.query.name as string;
    let isProtected = req.query.isProtected as boolean;
    let description        = req.query.description as string;
    let owner       = req.query.owner as number;
    let pwd         = req.query.pwd as string;
    let hash        = '';

    if(name === undefined || isProtected === undefined) {
        res.json( new ReqError('name and isProtecteded params needed'));
        return;
    }

    let proj = await recif.findByName(name);

    if(proj !== undefined) {
        res.json( new ReqError('Recif name already exist') );
        return;
    }

    console.log(isProtected);

    if(isProtected && owner !== undefined) {

        let usr = await user.findById(owner);

        if(usr === undefined) {
            res.json( new ReqError('Owner not found') );
            return;
        }
    }
    if(isProtected) {
        if(pwd === undefined) {
            res.json( new ReqError('Password needed if isProtected') );
            return;
        }
        hash = await bcrypt.hash(pwd, req.app.get('saltRounds'));
    }

    recif.addRecif(name, description, isProtected, hash, owner)
    .then((id) => res.json( new ReqSuccess(id) ))
    .catch(() => res.json( new ReqError('Recif creation failed') ));

});


/**
 * Route create corail
 */
router.use('/corail', auth.secureRecif);
router.post('/corail', async (req, res) => {

    let token       = req.query.token;
    let recifId     = req.query.recifId;
    let name        = req.query.name;
    let description = req.query.description;
    let tags        = req.query.tags;
    
    let id: number = -1;

    // parse TagIds
    if(tags !== undefined && tags !== '') {
        tags = tags.split(',').map(Number);
    }
    else {
        tags = []
    }

    try{
        id = await corail.addCorail(recifId, name, description);
        tags.forEach((tagId: number) => corail.addTag(id, tagId));

        socket.send(token, recifId, 'create corail', { 
            id: Number(id), 
            recifId: Number(recifId), 
            name, 
            description, 
            tags 
        });
        
        res.json( new ReqSuccess(id) );
    }
    catch(err){
        res.json( new ReqError(err) )
        if(id >= 0) {
            //TODO remove corail
        }
    }
});

/**
 * Route create tag
 */
router.use('/tag', auth.secureRecif);
router.post('/tag', async (req, res) => {

    let token = req.query.token;
    let recifId = req.query.recifId;
    let name = req.query.name;

    try{
        let id = await tag.addTag(recifId, name);
        socket.send(token, recifId, 'create tag', { name, id: Number(id) });
        res.json( new ReqSuccess(id) );
        
    }
    catch( err ) {
        res.json( new ReqError(err) );
    }
});

/**
 * Route create link between Corail and Tag
 */
router.use('/link', auth.secureRecif);
router.post('/link', async (req, res) => {

    let recifId = req.query.recifId;
    let token = req.query.token;
    let corailId = req.query.corailId;
    let tagId  = req.query.tagId;

    try {
        await corail.addTag(corailId, tagId);
        socket.send(token, recifId, 'create link', { corailId: Number(corailId), tagId: Number(tagId) });
        res.json( new ReqSuccess('Link created') );
    }
    catch (err) {
        res.json(new ReqError(err));
    }
});