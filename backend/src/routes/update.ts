import * as express from 'express';
import * as project from '../model/recif';
import * as idea    from '../model/corail';
import * as user    from '../model/user';
import * as bcrypt  from 'bcrypt';
import * as jwt     from 'jsonwebtoken';
import * as auth    from './auth';
import * as tag     from '../model/alge';

import {ReqError, ReqSuccess}   from './api';

export let router = express.Router();

/**
 * Route for Corail update
 * @param projectId
 * @param ideaId
 * @param name
 * @param desc
 */
router.use('/corail', auth.secureRecif);
router.post('/corail', async (req, res) => {

    let projectId = req.query.projectId;
    let ideaId = req.query.ideaId;
    let name = req.query.name;
    let description = req.query.description;

    try {
        let id = await idea.update(projectId, ideaId, name, description);
        return res.json( new ReqSuccess(id) );
    }
    catch(err) {
        return res.json( new ReqError(err) );
    }

});