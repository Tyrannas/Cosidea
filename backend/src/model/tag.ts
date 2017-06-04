import {db} from './db';
import * as table from '../config/tables';

export type TagId = number;

export class Tag {
    id: TagId;
    constructor(public name: string) {}
}

export function addTag(name: string): Promise<TagId> {

    if(name == undefined || name.length < 1) {
        return Promise.reject("Tag needs name");
    }

    let tag = new Tag(name);

    let query = db(table.tag)
    .insert(tag)
    .returning('id')
    .then((arr) => arr[0]);

    return query;
}
