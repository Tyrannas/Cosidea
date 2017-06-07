import * as express from 'express';
import * as project from '../model/project';
import * as idea    from '../model/idea';
import * as user    from '../model/user';
import * as bcrypt  from 'bcrypt';
import * as jwt     from 'jsonwebtoken';
import * as auth    from './auth';
import * as tag     from '../model/tag';

import {ReqError, ReqSucces}   from './api';

export let router = express.Router();

/**
 * Route for Corail update
 * @param projectId
 * @param ideaId
 * @param title
 * @param desc
 */
router.use('/idea', auth.secureProject);
router.post('/idea', async (req, res) => {

    let projectId = req.query.projectId;
    let ideaId = req.query.ideaId;
    let title = req.query.title;
    let desc = req.query.desc;

    try {
        let id = await idea.update(projectId, ideaId, title, desc);
        return res.json( new ReqSucces(id) );
    }
    catch(err) {
        return res.json( new ReqError(err) );
    }

});