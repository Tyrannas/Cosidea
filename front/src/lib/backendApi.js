/**
 * local api to communicate with backend
 * add ideas, tags, create new projects and many more...
 */


/**
 * get Ideas associated to a project
 * @param params : project ID
 * @param vue s of Vue
 * @returns {Promise.<void>}
 */

export async function getIdeas( vue, params) {

    let request = `/api/info/idea/${params.projectId}`
    let ideas = await vue.$http.get(request);
    return JSON.parse(ideas.bodyText);
}

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
export async function initRoom(vue, projectName) {

    let query = { title: projectName };

    let req = await vue.$http.get('/api/info/project/', {params: query});
    let body = req.body;

    if(body.err) {
        //TODO Handle project does not exist
        return;
    }

    vue.projectId   = body.id;
    vue.description = body.description;
    vue.isProtected = body.isProtected;

    if(vue.isProtected) {

    }
}

/**
 * Connect vue componenet to some password protected project
 * @param vue
 * @param projectId
 * @param password
 */
async function connect(vue, projectId, password) {

    let req = await vue.$http.get('/api/auth/' + projectId + '/' + password);
    
    if(req === undefined) {
        // TODO Handle request fail.
    }

    let body = req.body;
    if(body === undefined || body.err) {
        //  TODO Handle wrong password
    }

    vue.token = body.token;
}
