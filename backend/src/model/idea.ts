import {db} from './db';
import * as table from '../config/tables';
import {TagId, Tag} from './tag';
import {ProjectId} from './project';
import * as idea_tag_rel from './idea_tag_rel';

export type IdeaId = number;

export class Idea {
    id: IdeaId;
    constructor(public project_id: number, public title: string, 
                public description?: string) {}
}

export class TaggedIdea extends Idea {
    tags: Tag[];
}

export function addIdea(projectId: number, title: string, description?: string): Promise<IdeaId> {

    if(projectId === undefined) {
        return Promise.reject("Project needed for Idea");
    }
    if(title === undefined || title.length < 1) {
        return Promise.reject("Title needed for Idea");
    }

    let idea = new Idea(projectId, title, description);

    let query = db(table.idea)
    .insert(idea)
    .returning('id')
    .then((arr) => arr[0])

    return query;
}

export function removeIdea(projectId: ProjectId, ideaId: IdeaId): Promise<boolean>{

    if(projectId === undefined || ideaId === undefined) {
        return Promise.reject("ProjectId and IdeaId needed for delete");
    }

    let rmRel = db(table.idea_tag_rel)
    .where('idea_id', ideaId)
    .del();

    let rmIdea = db(table.idea)
    .where('id', ideaId)
    .del();
    
    let query = rmRel
    .then(() => rmIdea)
    .then(() => true);

    return query;
}

export function addTag(ideaId: IdeaId, tagId: TagId) {
    return idea_tag_rel.addIdeaTagRel(ideaId, tagId);
}

export function removeTag(ideaId: IdeaId, tagId: TagId) {
    return idea_tag_rel.removeIdeaTagRel(ideaId, tagId);
}

export function findByProjectId(projectId: number): Promise<TaggedIdea[]> {

    if(projectId === undefined) {
        return Promise.reject("Project title is undefined");
    }

    let idea = db(table.idea + ' as i')
    .select('i.*', db.raw('json_agg(t) as tags'))
    .leftJoin(table.idea_tag_rel + ' as r', 'i.id', 'r.idea_id')
    .leftJoin(table.tag + ' as t', 'r.tag_id', 't.id')
    .where('project_id', projectId)
    .groupBy('i.id');

    return idea;
}