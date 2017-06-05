import * as express from 'express';
import * as project from '../model/project';
import * as idea    from '../model/idea';
import * as user    from '../model/user';
import * as bcrypt  from 'bcrypt';
import * as jwt     from 'jsonwebtoken';
import {ReqError}   from './api';


export let router = express.Router();


router.get('/project/:projectId/:password', async (req, res) => {

    let proj = await project.find(req.params.projectId);

    if(proj === undefined) {
        res.json(new ReqError('Project not found'));
        return;
    }
    if(!proj.isProtected) {
        res.json(new ReqError('Project is not password protected'));   //  No need for token
        return;
    }

    let valid = await bcrypt.compare(req.params.password, proj.hash as string);

    if(!valid) {
        res.json(new ReqError('Password not valid'));
        return;
    }

    let token = jwt.sign({ project: proj.id }, req.app.get('secret'), { expiresIn: '24h' });

    res.json({projectId: proj.id, token: token});
 
});

router.get('/user/:user/:password', async (req, res) => {

    let usr = await user.findByName(req.params.user);

    if(usr === undefined) {
        res.json(new ReqError('User not found'));
        return;
    }

    let valid = await bcrypt.compare(req.params.password, usr.hash);

    if(!valid) {
        res.json(new ReqError('Password not valid'));
        return;
    }

    let token = jwt.sign({ data: usr.id }, req.app.get('secret'), { expiresIn: '24h' });
    
    res.json({ userId: usr.id, token: token });
});


export async function secureProject(req: express.Request, res: express.Response, next: express.NextFunction) {

    //console.log('secure project');
    let token = req.query.token;
    let proj = await project.find(req.params.projectId);

    if (proj === undefined) {
        res.json(new ReqError('Project not found'));
        return;
    }

    if (proj.isProtected) {
        if (token === undefined) {
            res.json(new ReqError('Project is protected, no connection token found'));
            return;
        }


        jwt.verify(token, req.app.get('secret'), (err: any, decode: any) => {

            if (err || decode.project !== proj.id) {
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
}