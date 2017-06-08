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
    
    if(body.err) {
        throw new Error(body.err);
    }

    return body.msg;
}


/**
 * add a new Tag to a recif
 * @param params : recif corail, tag name, optional: token
 * @returns {Promise.<*>}
 */
export async function addTag( token, name ){
    let qs = { token, name};
    let url = '/api/create/tag';

    let body = await post({ url, qs });

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
export async function getToken(recifId, password) {

    let qs = { recifId, pwd: password};
    let query = {url: '/api/auth/recif', qs };

    let body = await get(query);

    if(body === undefined || body.err) {
        //  TODO Handle wrong password
        return undefined;
    }

    return body.msg.token;
}


/**
 * Get Corails associated to a recif
 * @param token
 * @returns Promise<corails[]>
 */
export async function getCorails(token) {

    let qs = { token }
    let url = '/api/info/corail';
    
    let body = await get({ url, qs });

    if (body.err) {
        throw new Error(body.msg);
    }
    
    return body.msg;
}

/**
 * Update Corail name and description
 * @param token
 * @param corailId
 * @param name
 * @param description
 */
export async function updateCorail(token, corailId, name, description) {

    let qs = { token, corailId, name, description };    
    let url = '/api/update/corail';

    let body = await post({ url, qs });

    if(body === undefined || body.err) {
        throw new Error('update corail failed');
    }

    return body.msg;
}
/**
 * add link between coral and tag
 * @param token
 * @param corailId
 * @param tagId
 */
export async function addLink( token, corailId, tagId ) {

    let qs = { token, corailId, tagId };
    let url = '/api/create/link';

    let body = await post({ url, qs });

    if(body.err) {
        throw new Error(body.msg);
    }

    return body.msg;
}
/**
 * remove link between coral and tag
 * @param token
 * @param corailId
 * @param tagId
 */
export async function rmLink( token, corailId, tagId ) {

    let qs = { token, corailId, tagId };
    let url = '/api/rm/link';

    let body = await post({ url, qs });
    if(body.err) {
        throw new Error(body.msg);
    }

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
 * @param token
 * @returns Tags[]
 */
export async function getTags(token) {

    let qs = { token };
    let query = { url: '/api/info/tag', qs};

    let body = await get(query);

    if(body === undefined || body.err) {
        return undefined;
    }

    return body.msg;
}

/**
 * Remove Corail
 * @param token
 * @param corailId
 */
export async function removeCorail( token, corailId ) {

    let qs = { corailId, token};
    let url = '/api/rm/corail';

    let body = await post({ url, qs });

    return body.msg; 
}

/**
 * Remove Tag
 * @param token
 * @param tagId
 */
export async function removeTag( token, tagId ) {

    let qs = { corailId, token};
    let url = '/api/rm/tag';

    let body = await post({ url, qs });

    return body.msg;
}