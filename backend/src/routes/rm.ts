import * as express from 'express';
import * as recif from '../model/recif';
import * as corail    from '../model/corail';
import * as user    from '../model/user';
import * as Alge     from '../model/alge';
import * as bcrypt  from 'bcrypt';
import * as jwt     from 'jsonwebtoken';
import * as auth    from './auth';

import {ReqError, ReqSuccess}   from './api';


export let router = express.Router();

/**
 * Route remove link between Corail and Alge
 */
router.use('/link', auth.secureRecif);
router.post('/link', (req, res) => {

    let corailId = req.query.corailId;
    let algeId  = req.query.algeId;

    corail.removeAlge(corailId, algeId)
    .then(() => res.json( new ReqSuccess('Removed link')))
    .catch(() => res.json( new ReqError('Failed removing link')));
});