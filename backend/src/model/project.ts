import {db} from './db';
import * as table from '../config/tables';
import * as def   from '../config/default';
import * as tag   from './tag';

export type ProjectId = number;

export class Project {
    id: ProjectId;
    constructor(public title: string, public description: string, 
                public owner?: number, public isProtected?: boolean, 
                public hash?: string) {}
}


export async function addProject( title: string, description: string, ownerId?: number, 
                            isProtected?: boolean, hash?: string): Promise<ProjectId> {

    if(title == null || title.length < 1){
        return Promise.reject("No title");
    }
    if(ownerId == null) {
        isProtected = false;
        hash = undefined;
    }

    let proj = new Project(title, description, ownerId, isProtected, hash);

    let query = await db(table.project)
    .insert(proj)
    .returning('id')
    .then((arr) => arr[0]);

    def.tags.forEach( async (t) => {
        await tag.addTag(query, t);
    });

    return query;
}

export function find(id: ProjectId): Promise<Project> {

    let query = db(table.project)
    .select('*')
    .where('id', id)
    .then((arr) => arr[0]);

    return query;
}

export function findAll(): Promise<Project[]>
{
    let query = db(table.project)
    .select('*');

    return query;
}

export function findByPrefix(title: string): Promise<Project[]>
{
    let query = db(table.project)
    .select('*')
    .where('title', 'LIKE', title + '%');

    return query;
}

export function findByTitle(title: string): Promise<Project>
{
    let query = db(table.project)
    .select('*')
    .where('title', title)
    .then((list) => {
        return list[0];
    });

    return query;
}


