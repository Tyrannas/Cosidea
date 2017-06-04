import * as express from 'express';

let router = express.Router();

router.use('/connect', function(req, res, next) {
    console.log('middleware');
    next();
})

router.get('/connect', async (req, res) => {
    res.json({gg:'wp'});
});

export let api = router;