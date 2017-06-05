import * as express from 'express';
import * as project from '../model/project';
import * as idea    from '../model/idea';
import * as user    from '../model/user';
import * as bcrypt  from 'bcrypt';
import * as jwt     from 'jsonwebtoken';
import {ReqError}   from './api';


export let router = express.Router();

router.get('/project/:projectTitle', async (req, res) => {

    let proj = await project.findByTitle(req.params.projectTitle);

    if(proj === undefined) {
        res.json(new ReqError('Project not found'));
        return;
    }

    proj.secure();
    res.json(proj);

});

router.use('/idea/:projectId/:token?', async (req, res, next) => {

    let token   = req.params.token;
    let proj    = await project.find(req.params.projectId);
    
    if(proj === undefined) {
        res.json(new ReqError('Project not found'));
        return;
    }

    if(proj.isProtected) {
        if(token === undefined) {
            res.json(new ReqError('Project is protected, no connection token found'));
            return;
        }


        jwt.verify(token, req.app.get('secret'), (err: any, decode: any) => {

            if(err || decode.project !== proj.id) {
                res.json(new ReqError('Wrong token, please connect to the project first'));
                return;
            }
            else {
                next();
            }
        });
    }
    else {
        next();
    }
});

router.get('/idea/:projectId/:token?', async (req, res) => {

    let ideas = await idea.findByProjectId(req.params.projectId);

    if(ideas === undefined) {
        res.json(new ReqError('get Idea failed'));
        return;
    }
    
    res.json(ideas);
});