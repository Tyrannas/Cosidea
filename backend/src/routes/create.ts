import * as express from 'express';
import * as project from '../model/project';
import * as idea    from '../model/idea';
import * as user    from '../model/user';
import * as tag     from '../model/tag';
import * as bcrypt  from 'bcrypt';
import * as jwt     from 'jsonwebtoken';
import * as auth    from './auth';

import {ReqError, ReqSucces}   from './api';


export let router = express.Router();

router.post('/user/:user/:password', async (req, res) => {

    let name    = req.params.user as string;
    let pwd     = req.params.password as string;
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
    .then((id) => res.json( new ReqSucces(id) ))
    .catch(() => res.json( new ReqError('Add User failed') ));

});

router.post('/project/:title/:protected', async(req, res) => {

    let title   = req.params.title as string;
    let protect = req.params.protected == true as boolean;
    let desc    = req.query.desc as string;
    let owner   = req.query.owner as number;
    let pwd     = req.query.pwd as string;
    let hash    = '';
    let proj = await project.findByTitle(title);

    if(proj !== undefined) {
        res.json( new ReqError('Project name already exist') );
        return;
    }

    if(protect && owner === undefined) {
        res.json( new ReqError('Protected Project needs an Owner') );
        return;
    }

    if(owner !== undefined) {
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

    project.addProject(title, desc, owner, protect, hash)
    .then((id) => res.json( new ReqSucces(id) ))
    .catch(() => res.json( new ReqError('Project creation failed') ));

});


router.use('/idea/:projectId/:title', auth.secureProject);
router.post('/idea/:projectId/:title', async (req, res) => {

    let projId  = req.params.projectId;
    let title   = req.params.title;
    let desc    = req.query.desc;

    idea.addIdea(projId, title, desc)

    .then((id) => res.json( new ReqSucces(id) ))
    .catch((err) => res.json( new ReqError(err) ));
});


router.use('/tag/:projectId/:name', auth.secureProject);
router.post('/tag/:projectId/:name', (req, res) => {

    let projId = req.params.projectId;
    let name = req.params.name;

    tag.addTag(projId, name)
    .then((id) => res.json( new ReqSucces(id) ))
    .catch((err) => res.json( new ReqError(err) ));
});


router.use('/link/:projectId/:ideaId/:tagId', auth.secureProject);
router.post('/link/:projectId/:ideaId/:tagId', (req, res) => {

    let ideaId = req.params.ideaId;
    let tagId  = req.params.tagId;

    idea.addTag(ideaId, tagId)
    .then(() => res.json( new ReqSucces('Link added') ))
    .catch(() => res.json( new ReqError('Add link failed') ));
});