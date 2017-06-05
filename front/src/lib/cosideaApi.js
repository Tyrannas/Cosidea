


export async function getIdeas(vue, projectId) {

    let ideas = await vue.$http.get('/api/info/idea/4');
    ideas = JSON.parse(ideas.bodyText);
    console.log(ideas);
}

/**
 * Initialise the Room with the given projectName
 * @param vue
 * @param projectName
 */
export async function initRoom(vue, projectName) {

    let req = await vue.$http.get('/api/info/project/' + projectName);
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

export async function getProject(projectName) {

}