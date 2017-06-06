import {db} from './db';
import * as table from '../config/tables';
import {ProjectId} from './project';

export type TagId = number;

export class Tag {
    id: TagId;
    constructor(public project_id: ProjectId, public name: string) {}
}

export function addTag(projectId: ProjectId, name: string): Promise<TagId> {

    if(name == undefined || name.length < 1) {
        return Promise.reject("Tag needs name");
    }

    let tag = new Tag(projectId, name);

    let query = db(table.tag)
    .insert(tag)
    .returning('id')
    .then((arr) => arr[0]);

    return query;
}

export function getByProject(projectId: ProjectId): Promise<Tag[]> {

    if(projectId === undefined) {
        return Promise.reject("project undefined");
    }

    let query = db(table.tag)
    .select('*')
    .where('project_id', projectId);

    return query;
}
