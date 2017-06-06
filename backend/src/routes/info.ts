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

router.get('/project', async (req, res) => {
    
    let title = req.query.title;

    let proj = await project.findByTitle(title);

    if(proj === undefined) {
        res.json( new ReqError('Project not found') );
        return;
    }

    delete proj.hash;
    res.json(proj);

});

router.get('/project/all', async (req, res) => {

    let projs = await project.findAll();

    if(projs === undefined) {
        res.json( new ReqError('No projects found..') );
        return;
    }

    projs.forEach((proj) => delete proj.hash);
    res.json(projs);
    
});


router.use('/idea', auth.secureProject);
router.get('/idea', async (req, res) => {

    let projId = req.query.projectId;

    let ideas = await idea.findByProjectId(projId);

    if(ideas === undefined) {
        res.json( new ReqError('get Idea failed') );
        return;
    }
    
    res.json(ideas);
});

router.use('/tag', auth.secureProject);
router.use('/tag', async (req, res) => {

    let projId = req.query.projectId;

    let tags = await tag.getByProject(projId);

    if(tags === undefined) {
        res.json( new ReqError('get Tags failed') );
        return;
    }

    res.json(tags);
});