import * as express from 'express';
import * as recif from '../model/recif';
import * as corail    from '../model/corail';
import * as user    from '../model/user';
import * as bcrypt  from 'bcrypt';
import * as jwt     from 'jsonwebtoken';
import {ReqError, ReqSuccess}   from './api';


export let router = express.Router();

/**
 * Auth Recif route
 * @param recifId
 * @param pwd
 */
router.get('/recif/', async (req, res) => {

    let id   = req.query.recifId;
    let pwd  = req.query.pwd;

    let proj = await recif.find(id);
    
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

    let token = jwt.sign({ recif: proj.id } as any, req.app.get('secret'), { expiresIn: '24h' });

    res.json( new ReqSuccess({recifId: proj.id, token: token}));
 
});

/**
 * Auth user route
 * @param name
 * @param pwd
 */
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
    
    res.json( new ReqSuccess({ id: usr.id, token: token }) );
});

/**
 * middleware for route auth by recifId and token
 */
export async function secureRecif(req: express.Request, res: express.Response, next: express.NextFunction) {

    //console.log('secure recif');
    let token   = req.query.token;
    let id      = req.query.recifId;

    if(id === undefined) {
        res.json(new ReqError('Needs recifId'));
        return;
    }

    let rec = await recif.find(id);
    
    //  if recif doesn't exist
    if (rec === undefined) {
        res.json(new ReqError('Project not found'));
        return;
    }

    // if Recif is protected
    if (rec.isProtected) {
        if (token === undefined) {
            res.json(new ReqError('Project is protected, no connection token found'));
            return;
        }

        // verify token
        jwt.verify(token, req.app.get('secret'), (err: any, decode: any) => {

            if (err || decode.recif !== rec.id) {
                res.json(new ReqError('Wrong token, please connect to the recif first'));
                return;
            }
            // token is ok, we can go to route
            else {
                next();
            }
        });
    }
    // Recif is not protected, we can go to route
    else {
        next();
    }
}