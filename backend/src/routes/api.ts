import * as express     from 'express';
import * as auth        from './auth';
import * as create      from './create';
import * as info        from './info';
import * as rm          from './rm';
import * as update      from './update';

//  Default message for request errors
export class ReqError {
    err:boolean = true;
    constructor( public msg: any ) {}
}

//  Default message for request success
export class ReqSuccess {
    succes: boolean = true;
    constructor( public msg: any ) {}
}

//  Initialise API Router
let router = express.Router();


router.use('/auth', auth.router);
router.use('/create', create.router);
router.use('/info', info.router);
router.use('/rm', rm.router);
router.use('/update', update.router);


export let api = router;