/**
 * local api to communicate with backend
 * add ideas, tags, create new projects and many more...
 */

/**
 * get Ideas associated to a project
 * @param params : project ID
 * @param vue instance of Vue
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