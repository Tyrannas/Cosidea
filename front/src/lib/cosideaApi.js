

export async function getIdeas(vue, projectId) {

    let ideas = await vue.$http.get('/api/info/idea/4');
    ideas = JSON.parse(ideas.bodyText);
    console.log(ideas);
}