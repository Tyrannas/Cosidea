import {db} from './db';
import * as table from '../config/tables';
import {RecifId} from './recif';

export type TagId = number;

export class Tag {
    id: TagId;
    constructor(public recif_id: RecifId, public name: string) {}
}

/**
 * Add an Tag to a Recif
 * @param recifId
 * @param name
 * @return {Promise.<TagId>}
 */
export function addTag(recifId: RecifId, name: string): Promise<TagId> {

    if(name == undefined || name.length < 1) {
        return Promise.reject("Tag needs name");
    }

    let tag = new Tag(recifId, name);

    let query = db(table.tag)
    .insert(tag)
    .returning('id')
    .then((arr) => arr[0]);

    return query;
}

/**
 * Get all Tags in some Recif
 * @param recifId
 * @returns {Promise.<Tag[]>}
 */
export function getByRecif(recifId: RecifId): Promise<Tag[]> {

    if(recifId === undefined) {
        return Promise.reject("recif undefined");
    }

    let query = db(table.tag)
    .select('*')
    .where('recif_id', recifId);

    return query;
}

/**
 * Remove Tag from Recif
 * @param recifId
 * @param tagId
 */
export function remove(recifId: RecifId, tagId: TagId) {

    let query = db(table.tag).where({
        recif_id: recifId,
        id: tagId
    }).del();

    return query;
}
