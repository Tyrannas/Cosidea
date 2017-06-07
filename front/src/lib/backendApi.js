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
 * add ideas, tags, create new projects and many more...
 */



/**
 * add a new Idea to a project
 * @param params : project Id, idea with title and description, optional: token
 * @returns {Promise.<*>} with created idea id
 */

export async function addIdea( params ){

    let query = { url: '/api/create/idea', qs: params };
    let body = await post(query);

    return body.id;
}


/**
 * add a new Tag to a project
 * @param vue
 * @param params : project idea, tag name, optional: token
 * @returns {Promise.<*>}
 */
export async function addTag( vue, params ){

    let request = `/api/create/tag/${params.projectId}/${params.tag}?token=${params.token}`;
    return await vue.$http.post(request);
}


/**
 * Create a new project
 * @param params: { title, description?, protected?, owner?, password?}
 * @returns {Promise.<*>}
 */
export async function addProject( params ){

    let query = { url: '/api/create/project', qs: params };
    let body = await post(query);
    
    if(body === undefined || body.err) {
        return undefined;
    }
    return body.msg;
}


/**
 * Get project
 * @param projectName
 * @returns Promise<project[]>
 */
export async function getProject(projectName) {
    
    let params = { title: projectName };
    let query = {url: '/api/info/project', qs: params };

    let body = await get(query);

    if(body.err) {
        //TODO Handle project does not exist
        return;
    }

    return body;
}

/**
 * Get connection Token for project
 * @param projectId
 * @param password
 * @returns Promise<token: string>
 */
async function getToken(projectId, password) {

    let parmas = {projectId: projectId, pwd: password};
    let query = {url: '/api/auth/project', qs: parmas };

    let body = await get(query);

    if(body === undefined || body.err) {
        //  TODO Handle wrong password
        return undefined;
    }

    return body.token;
}


/**
 * Get Ideas associated to a project
 * @param projectId
 * @param token
 * @returns Promise<ideas[]>
 */
export async function getIdeas(projectId, token) {

    let params = { projectId: projectId, token: token }
    let query = {url: '/api/info/idea', qs: params};
    
    let body = await get(query);

    if (body === undefined || body.err) {
        throw new Error('request failed');
    }
    
    return body;
}

export async function updateIdea(projectId, ideaId, title, description, token) {
    console.log('new desc: ' + description);
    let params = {
        projectId: projectId,
        ideaId: ideaId,
        token: token,
        title: title,
        desc: description
    };
    let query = { url: '/api/update/idea', qs: params };

    let body = await post(query);

    if(body === undefined || body.err) {
        throw new Error('update idea failed');
    }

    return body.msg;
}
/**
 * add link between coral and tag
 * @param projectId
 * @param ideaId
 * @param tagId
 * @param token
 */
export async function addLink( projectId, ideaId, tagId, token ) {
    console.log(projectId + ' ' + ideaId + ' ' + tagId);
    let params = {
        projectId: projectId,
        ideaId: ideaId,
        tagId: tagId,
        token: token
    };
    let query = { url: '/api/create/link', qs: params };

    let body = await post(query);

    if(body.err) {
        throw new Error(body.msg);
    }

    return body;
}
/**
 * remove link between coral and tag
 * @param projectId
 * @param ideaId
 * @param tagId
 * @param token
 */
export async function rmLink(  projectId, ideaId, tagId, token ) {

    let params = {
        projectId: projectId,
        ideaId: ideaId,
        tagId: tagId,
        token: token
    };
    let query = { url: '/api/rm/link', qs: params };

    let body = await post(query);

    return body;
}
/**
 * Get all projects
 * @returns Promise<projects[]>
 */
export async function getProjects() {
        console.log('request..');
        let query = {url: '/api/info/project/all'};
        let body = await get(query);

        return body;
}

/**
 * Get Tags from Project 
 * @param projectId
 * @returns Tags[]
 */
export async function getTags(projectId) {

    let params = { projectId: projectId };
    let query = { url: '/api/info/tag', qs: params};

    let body = await get(query).catch(() => undefined);

    if(body === undefined || body.err) {
        return undefined;
    }

    return body;
}