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

router.use('/link/:projectId/:ideaId/:tagId', auth.secureProject);
router.post('/link/:projectId/:ideaId/:tagId', (req, res) => {

    let ideaId = req.params.ideaId;
    let tagId  = req.params.tagId;

    idea.removeTag(ideaId, tagId)
    .then(() => res.json( new ReqSucces('Removed link')))
    .catch(() => res.json( new ReqError('Failed removing link')));
});