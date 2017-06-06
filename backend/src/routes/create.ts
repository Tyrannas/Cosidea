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
    .then((id) => res.json( new ReqSucces(id) ))
    .catch(() => res.json( new ReqError('Add User failed') ));

});

router.post('/project', async(req, res) => {

    let title   = req.query.title as string;
    let protect = req.query.protected == true as boolean;
    let desc    = req.query.desc as string;
    let owner   = req.query.owner as number;
    let pwd     = req.query.pwd as string;
    let hash    = '';

    if(title === undefined || protect === undefined) {
        res.json( new ReqError('title and protected params needed'));
        return;
    }

    let proj = await project.findByTitle(title);

    if(proj !== undefined) {
        res.json( new ReqError('Project name already exist') );
        return;
    }

    if(protect && owner === undefined) {
        res.json( new ReqError('Protected Project needs an Owner') );
        return;
    }

    if(protect) {
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


router.use('/idea', auth.secureProject);
router.post('/idea', async (req, res) => {

    let projId  = req.query.projectId;
    let title   = req.query.title;
    let desc    = req.query.desc;
    let tags    = req.query.tags;
    
    let insertTags: number[] = [];
    let id: number = -1;

    if(tags !== undefined && tags !== '') {
        insertTags = tags.split(',').map(Number);
    }

    try{
        id = await idea.addIdea(projId, title, desc);
        insertTags.forEach((tagId) => idea.addTag(id, tagId));
        res.json( new ReqSucces(id) );
    }
    catch(err){
        res.json( new ReqError(err) )
        if(id >= 0) {
            //TODO remove idea
        }
    }
});


router.use('/tag', auth.secureProject);
router.post('/tag', (req, res) => {

    let projId = req.query.projectId;
    let name = req.query.name;

    tag.addTag(projId, name)
    .then((id) => res.json( new ReqSucces(id) ))
    .catch((err) => res.json( new ReqError(err) ));
});


router.use('/link', auth.secureProject);
router.post('/link', (req, res) => {

    let ideaId = req.params.ideaId;
    let tagId  = req.params.tagId;

    idea.addTag(ideaId, tagId)
    .then(() => res.json( new ReqSucces('Link added') ))
    .catch(() => res.json( new ReqError('Add link failed') ));
});