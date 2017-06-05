import * as express from 'express';
import * as project from '../model/project';
import * as idea    from '../model/idea';
import * as user    from '../model/user';
import * as bcrypt  from 'bcrypt';
import * as jwt     from 'jsonwebtoken';
import * as auth    from './auth';

import {ReqError}   from './api';

export let router = express.Router();

router.get('/project/:projectTitle', async (req, res) => {

    let proj = await project.findByTitle(req.params.projectTitle);

    if(proj === undefined) {
        res.json( new ReqError('Project not found') );
        return;
    }

    proj.secure();
    res.json(proj);

});


router.use('/idea/:projectId', auth.secureProject);
router.get('/idea/:projectId', async (req, res) => {

    let ideas = await idea.findByProjectId(req.params.projectId);

    if(ideas === undefined) {
        res.json( new ReqError('get Idea failed') );
        return;
    }
    
    res.json(ideas);
});