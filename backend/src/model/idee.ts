import {db} from './db';
import * as table from '../config/tables';

type IdeeId = number;

export class Idee {
    id: IdeeId;
    constructor(public project_id: number, public title: string, 
                public description?: string) {}
}

export class TaggedIdee extends Idee {
    tags: string[];
}

export function addIdee(project_id: number, title: string, description?: string): Promise<IdeeId> {

    if(project_id == undefined) {
        return Promise.reject("Project needed for Idee");
    }
    if(title == undefined || title.length < 1) {
        return Promise.reject("Title needed for Idee");
    }

    let idee = new Idee(project_id, title, description);

    let query = db(table.idee)
    .insert(idee)
    .returning('id')
    .then((arr) => arr[0])

    return query;
}

export function getIdeeByProjectId(projectId: number): Promise<TaggedIdee[]> {

    if(projectId == undefined) {
        return Promise.reject("Project title is undefined");
    }

    let idee = db(table.idee)
    .select('*')
    .where('project_id', projectId)
    .as('i');

    let rel = db(table.idee_tag_rel)
    .select('*')
    .join(idee, 'i.id', 'idee_id')
    .as('r');

    let query = db
    .select('idee.id', 'idee.title', 'idee.description', db.raw('json_agg(' + rel + ') as tags'))
    return query;
}