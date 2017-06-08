import * as express from 'express';
import * as RECIF from '../model/recif';
import * as CORAIL    from '../model/corail';
import * as USER    from '../model/user';
import * as bcrypt  from 'bcrypt';
import * as jwt     from 'jsonwebtoken';
import * as bluebird from 'bluebird';

import {ReqError, ReqSuccess}   from './api';

let jwtVerify = bluebird.promisify(jwt.verify, jwt) as any;

export let router = express.Router();

/**
 * Auth Recif route
 * @param recifId
 * @param pwd
 */
router.get('/recif/', async (req, res) => {

    let id   = req.query.recifId;
    let pwd  = req.query.pwd;

    let recif = await RECIF.find(id);
    
    if(recif === undefined) {
        res.json(new ReqError('Project not found'));
        return;
    }

    // if the recif is protected, check password validity
    if(recif.isProtected) {
        // compare crypted pwd with hash
        let valid = await bcrypt.compare(pwd, recif.hash as string);
        if(!valid) {
            res.json(new ReqError('Password not valid'));
            return;
        }
    }
    // the recif is not protected or the password is valid
    let token = jwt.sign({ recif: recif.id } as any, req.app.get('secret'), { expiresIn: '24h' });

    res.json( new ReqSuccess({recifId: recif.id, token: token}));
});

/**
 * Auth user route
 * @param name
 * @param pwd
 */
router.get('/user', async (req, res) => {

    let name = req.query.name;
    let pwd = req.query.pwd;

    let usr = await USER.findByName(name);

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

    if(token === undefined) {
        res.json(new ReqError('request needs a token'));
        return;
    }

    let decoded = await verifyToken(token, req.app.get('secret'));
    if(decoded === undefined) {
        res.json( new ReqError('token not valid') );
        return;
    }
    // Token is valid
    req.query.recifId = decoded.recif;
    next();
}
 
export async function verifyToken(token: string, secret: string) {

    try {
            // verify token
            let decoded = await jwtVerify(token, secret)
            return decoded;
        }
        catch(err) {
            return undefined;
        }

}

