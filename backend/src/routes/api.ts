import * as express from 'express';
import * as auth    from './auth';
import * as create  from './create';
import * as info    from './info';

export class ReqError {
    err:boolean = true;
    constructor(public msg: string){}
}

//  Initialise API Router
let router = express.Router();

router.use('/connect', auth.router);
router.use('/create', create.router);
router.use('/info', info.router);


export let api = router;