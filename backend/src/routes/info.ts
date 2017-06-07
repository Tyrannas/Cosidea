import * as express from 'express';
import * as recif from '../model/recif';
import * as corail    from '../model/corail';
import * as user    from '../model/user';
import * as bcrypt  from 'bcrypt';
import * as jwt     from 'jsonwebtoken';
import * as auth    from './auth';
import * as alge     from '../model/alge';

import {ReqError, ReqSuccess}   from './api';

export let router = express.Router();

/**
 * Route info Recif
 */
router.get('/recif', async (req, res) => {
    console.log('ask recif: ' + req.query.name)
    let name = req.query.name;

    let rec = await recif.findByName(name);

    if(rec === undefined) {
        res.json( new ReqError('Recif not found') );
        return;
    }

    // dont send hash to user
    delete rec.hash;
    res.json( new ReqSuccess(rec) );

});

/**
 * Route info all recifs
 */
router.get('/recif/all', async (req, res) => {

    let projs = await recif.findAll();

    if(projs === undefined) {
        res.json( new ReqError('No recifs found..') );
        return;
    }
    // dont send hash to user
    projs.forEach((proj) => delete proj.hash);
    res.json( new ReqSuccess(projs));
    
});

/**
 * Route info corail, is auth secure
 */
router.use('/corail', auth.secureRecif);
router.get('/corail', async (req, res) => {

    let recifId = req.query.recifId;

    let corails = await corail.findByRecif(recifId);

    if(corails === undefined) {
        res.json( new ReqError('get Idea failed') );
        return;
    }
    
    res.json( new ReqSuccess(corails));
});

/**
 * Route info alge in Recif is auth secure
 */
router.use('/alge', auth.secureRecif);
router.use('/alge', async (req, res) => {

    let recifId = req.query.recifId;

    let alges = await alge.getByRecif(recifId);

    if(alges === undefined) {
        res.json( new ReqError('get Tags failed') );
        return;
    }

    res.json( new ReqSuccess(alges) );
});