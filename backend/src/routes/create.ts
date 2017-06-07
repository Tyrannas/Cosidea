import * as express from 'express';
import * as recif from '../model/recif';
import * as corail    from '../model/corail';
import * as user    from '../model/user';
import * as alge     from '../model/alge';
import * as bcrypt  from 'bcrypt';
import * as jwt     from 'jsonwebtoken';
import * as auth    from './auth';

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
    let isProtected = req.query.isProtected == true as boolean;
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

    if(isProtected && owner === undefined) {
        res.json( new ReqError('Protected Recif needs an Owner') );
        return;
    }

    if(isProtected) {
        let usr = await user.findById(owner);

        if(usr === undefined) {
            res.json( new ReqError('Owner not found') );
            return;
        }
        if(pwd === undefined) {
            res.json( new ReqError('Password needed if owner is set') );
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

    let recifId  = req.query.recifId;
    let name   = req.query.name;
    let description    = req.query.description;
    let alges    = req.query.alges;
    
    let insertAlges: number[] = [];
    let id: number = -1;

    // parse AlgeIds
    if(alges !== undefined && alges !== '') {
        insertAlges = alges.split(',').map(Number);
    }

    try{
        id = await corail.addCorail(recifId, name, description);
        insertAlges.forEach((algeId) => corail.addAlge(id, algeId));
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
 * Route create alge
 */
router.use('/alge', auth.secureRecif);
router.post('/alge', (req, res) => {

    let recifId = req.query.recifId;
    let name = req.query.name;

    alge.addAlge(recifId, name)
    .then((id) => res.json( new ReqSuccess(id) ))
    .catch((err) => res.json( new ReqError(err) ));
});

/**
 * Route create link between Corail and Alge
 */
router.use('/link', auth.secureRecif);
router.post('/link', (req, res) => {

    let corailId = req.query.corailId;
    let algeId  = req.query.algeId;

    corail.addAlge(corailId, algeId)
    .then(() => res.json( new ReqSuccess('Link added') ))
    .catch((err) => res.json( new ReqError(err) ));
});