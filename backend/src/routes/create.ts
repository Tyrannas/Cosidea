import * as express from 'express';
import * as project from '../model/project';
import * as idea    from '../model/idea';
import * as user    from '../model/user';
import * as bcrypt  from 'bcrypt';
import * as jwt     from 'jsonwebtoken';
import {ReqError}   from './api';


export let router = express.Router();

router.get('/user/:user/:password', async (req, res) => {

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
    .then(() => res.json({msg: 'User ' + name + ' created'}))
    .catch(() => res.json(new ReqError('Add User failed')));

});

router.get('/project/:title/:description/:protected/:owner?/:password?', async(req, res) => {

    let title   = req.params.title as string;
    let desc    = req.params.description as string;
    let protect = req.params.protected == true as boolean;
    let owner   = req.params.owner as number;
    let pwd     = req.params.password as string;
    let hash    = '';
    let proj = await project.findByTitle(title);

    if(proj !== undefined) {
        res.json(new ReqError('Project name already exist'));
        return;
    }

    if(protect && owner === undefined) {
        res.json(new ReqError('Protected Project needs an Owner'));
        return;
    }

    if(owner !== undefined) {
        let usr = await user.findById(owner);

        if(usr === undefined) {
            res.json(new ReqError('Owner not found'));
            return;
        }
        if(pwd === undefined) {
            res.json(new ReqError('Password needed if owner is set'));
            return;
        }
        
        hash = await bcrypt.hash(pwd, req.app.get('saltRounds'));
    }

    project.addProject(title, desc, owner, protect, hash)
    .then(() => res.json({ msg: 'Project ' + title + ' created' }))
    .catch(() => res.json(new ReqError('Project creation failed')));

});