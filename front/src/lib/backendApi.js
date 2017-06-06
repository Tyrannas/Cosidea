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
                resolve(JSON.parse(body));
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
 * get Ideas associated to a project
 * @param params : project ID
 * @param vue s of Vue
 * @returns {Promise.<void>}
 */

// export async function getIdeas( vue, params) {

//     let request = `/api/info/idea/${params.projectId}`
//     let ideas = await vue.$http.get(request);
//     return JSON.parse(ideas.bodyText);
// }

/**
 * add a new Idea to a project
 * @param vue
 * @param params : project Id, idea with title and description, optional: token
 * @returns {Promise.<*>} with created idea id
 */

export async function addIdea( vue, params ){

    let request = `/api/create/idea/${params.projectId}/${params.idea.title}?desc=${params.idea.description}&token=${params.token}`;
    return await vue.$http.post(request);
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
 * @param vue
 * @param params
 * @returns {Promise.<*>}
 */
export async function addProject( vue, params={ protected: false }){

    let request = `api/create/project/${params.name}/${params.protected}?desc=${params.description}&owner=${params.owner}&pwd=${params.id}`
    return await vue.$http.post(request);
}


/**
 * Initialise the Room with the given projectName
 * @param vue
 * @param projectName
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
 * @returns token
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
 * Get all Ideas in some project
 * @param projectId
 * @param token
 * @returns ideas[]
 */
export async function getIdeas(projectId, token) {

    let params = { projectId: projectId, token: token }
    let query = {url: '/api/info/idea', qs: params};

    let body = await request.get(query);

    if (body === undefined || body.err) {
        throw new Error('request failed');
    }

    return body;
}

/**
 * Get all projects
 * @returns projects[]
 */
export async function getProjects() {
        console.log('request..');
        let query = {url: '/api/info/project/all'};
        let body = await get(query);

        return body;
}