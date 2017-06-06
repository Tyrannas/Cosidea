import * as express from 'express';
import * as project from '../model/project';
import * as idea    from '../model/idea';
import * as user    from '../model/user';
import * as bcrypt  from 'bcrypt';
import * as jwt     from 'jsonwebtoken';
import {ReqError}   from './api';


export let router = express.Router();


router.get('/project/', async (req, res) => {

    let id   = req.query.projectId;
    let pwd  = req.query.pwd;

    let proj = await project.find(id);
    
    if(proj === undefined) {
        res.json(new ReqError('Project not found'));
        return;
    }
    if(!proj.isProtected) {
        res.json(new ReqError('Project is not password protected'));   //  No need for token
        return;
    }

    let valid = await bcrypt.compare(pwd, proj.hash as string);

    if(!valid) {
        res.json(new ReqError('Password not valid'));
        return;
    }

    let token = jwt.sign({ project: proj.id } as any, req.app.get('secret'), { expiresIn: '24h' });

    res.json({projectId: proj.id, token: token});
 
});

router.get('/user', async (req, res) => {

    let name = req.query.name;
    let pwd = req.query.pwd;

    let usr = await user.findByName(name);

    if(usr === undefined) {
        res.json(new ReqError('User not found'));
        return;
    }

    let valid = await bcrypt.compare(pwd, usr.hash);

    if(!valid) {
        res.json(new ReqError('Password not valid'));
        return;
    }

    let token = jwt.sign({ data: usr.id } as any, req.app.get('secret'), { expiresIn: '24h' });
    
    res.json({ id: usr.id, token: token });
});


export async function secureProject(req: express.Request, res: express.Response, next: express.NextFunction) {

    //console.log('secure project');
    let token   = req.query.token;
    let id      = req.query.projectId;

    let proj = await project.find(id);

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