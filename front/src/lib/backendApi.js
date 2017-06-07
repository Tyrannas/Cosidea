import * as request from 'browser-request';

/** request.get as promise.
 * @param option
 * @returns body
 */
let get = function(option) {
    return new Promise((resolve, reject) => {
        request.get(option, (err, res, body) => {
            if(err) {
                reject(err);
            }
            else {
                try {
                    resolve(JSON.parse(body));
                }
                catch(err) {
                    reject(err);
                }
            }
        })
    })
};

/** request.post as promise.
 * @param option
 * @returns body
 */
let post = function(option) {
    return new Promise((resolve, reject) => {
        request.post(option, (err, res, body) => {
            if(err) {
                reject(err);
            }
            else {
                resolve(JSON.parse(body));
            }
        });
    });
};

/*
 * local api to communicate with backend
 * add corails, tags, create new recifs and many more...
 */



/**
 * add a new Corail to a recif
 * @param params : recif Id, corail with name and description, optional: token
 * @returns {Promise.<*>} with created corail id
 */

export async function addCorail( params ){

    let query = { url: '/api/create/corail', qs: params };
    let body = await post(query);

    return body.msg.id;
}


/**
 * add a new Tag to a recif
 * @param params : recif corail, tag name, optional: token
 * @returns {Promise.<*>}
 */
export async function addTag( params ){
    let query = {url: '/api/create/tag', qs: params};
    let body = await post(query);

    if(body === undefined || body.err) {
        return undefined;
    }
    return body.msg;
}


/**
 * Create a new recif
 * @param params: { name, description?, protected?, owner?, password?}
 * @returns {Promise.<*>}
 */
export async function addRecif( params ){

    let query = { url: '/api/create/recif', qs: params };
    let body = await post(query);
    
    if(body === undefined || body.err) {
        return undefined;
    }
    return body.msg;
}


/**
 * Get recif
 * @param recifName
 * @returns Promise<recif[]>
 */
export async function getRecif(recifName) {
    
    let params = { name: recifName };
    let query = {url: '/api/info/recif', qs: params };

    let body = await get(query);

    if(body.err) {
        //TODO Handle recif does not exist
        return;
    }

    return body.msg;
}

/**
 * Get connection Token for recif
 * @param recifId
 * @param password
 * @returns Promise<token: string>
 */
async function getToken(recifId, password) {

    let parmas = {recifId: recifId, pwd: password};
    let query = {url: '/api/auth/recif', qs: parmas };


    let body = await get(query);

    if(body === undefined || body.err) {
        //  TODO Handle wrong password
        return undefined;
    }

    return body.msg.token;
}


/**
 * Get Corails associated to a recif
 * @param recifId
 * @param token
 * @returns Promise<corails[]>
 */
export async function getCorails(recifId, token) {

    let params = { recifId: recifId, token: token }
    let query = {url: '/api/info/corail', qs: params};
    
    let body = await get(query);

    if (body === undefined || body.err) {
        throw new Error('request failed');
    }
    
    return body.msg;
}

export async function updateCorail(recifId, corailId, name, description, token) {
    console.log('corail id: ' + corailId);
    let params = {
        recifId: recifId,
        corailId: corailId,
        token: token,
        name: name,
        description: description
    };
    let query = { url: '/api/update/corail', qs: params };

    let body = await post(query);

    if(body === undefined || body.err) {
        throw new Error('update corail failed');
    }

    return body.msg;
}
/**
 * add link between coral and tag
 * @param recifId
 * @param corailId
 * @param tagId
 * @param token
 */
export async function addLink( recifId, corailId, tagId, token ) {
    console.log(recifId + ' ' + corailId + ' ' + tagId);
    let params = {
        recifId: recifId,
        corailId: corailId,
        tagId: tagId,
        token: token
    };
    let query = { url: '/api/create/link', qs: params };

    let body = await post(query);

    if(body.err) {
        throw new Error(body.msg);
    }

    return body.msg;
}
/**
 * remove link between coral and tag
 * @param recifId
 * @param corailId
 * @param tagId
 * @param token
 */
export async function rmLink(  recifId, corailId, tagId, token ) {

    let params = {
        recifId: recifId,
        corailId: corailId,
        tagId: tagId,
        token: token
    };
    let query = { url: '/api/rm/link', qs: params };

    let body = await post(query);

    return body.msg;
}
/**
 * Get all recifs
 * @returns Promise<recifs[]>
 */
export async function getRecifs() {
        console.log('request..');
        let query = {url: '/api/info/recif/all'};
        let body = await get(query);

        return body.msg;
}

/**
 * Get Tags from Recif 
 * @param recifId
 * @returns Tags[]
 */
export async function getTags(recifId) {

    let params = { recifId: recifId };
    let query = { url: '/api/info/tag', qs: params};

    let body = await get(query).catch(() => undefined);

    if(body === undefined || body.err) {
        return undefined;
    }

    return body.msg;
}