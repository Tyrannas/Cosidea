import {db} from './db';
import * as table from '../config/tables';
import {TagId, Tag} from './tag';
import {RecifId} from './recif';
import * as corail_tag_rel from './corailTagRel';

export type CorailId = number;

export class Corail {
    id: CorailId;
    constructor(public recif_id: number, public name: string, 
                public description?: string) {}
}

export class LivingCorail extends Corail {
    tags: Tag[];
}

/**
 * add corail to recif
 * @param recifId
 * @param name
 * @param description
 * @return CorailId
 **/
export function addCorail(recifId: number, name: string, description?: string): Promise<CorailId> {

    if(recifId === undefined) {
        return Promise.reject("Recif needed for Corail");
    }
    if(name === undefined || name.length < 1) {
        return Promise.reject("Name needed for Corail");
    }

    let corail = new Corail(recifId, name, description);

    let query = db(table.corail)
    .insert(corail)
    .returning('id')
    .then((arr) => arr[0])

    return query;
}

/**
 *  Removes Corail from Recif
 *  @param recifId
 *  @param corailId
 **/
export async function removeCorail(recifId: RecifId, corailId: CorailId): Promise<boolean>{

    if(recifId === undefined || corailId === undefined) {
        return Promise.reject("RecifId and CorailId needed for delete");
    }
    try {
        // //  Delete corail
        await db(table.corail).where({
            id: corailId,
            recif_id: recifId
        }).del();
        
        return true;
    }
    catch(err) {
        return err;
    }
}

/**
 *  Add Tag to Corail
 *  @param corailId
 *  @param tagId
 *  @returns CorailTagRel
 **/
export function addTag(corailId: CorailId, tagId: TagId) {
    return corail_tag_rel.addCorailTagRel(corailId, tagId);
}

/**
 *  Remove Tag from Corail
 *  @param corailId
 *  @param tagId
 **/
export function removeTag(corailId: CorailId, tagId: TagId) {
    return corail_tag_rel.removeCorailTagRel(corailId, tagId);
}

/**
 * Finds Corail in some Recif
 * @param recifId
 * @returns LivingCorail[]
 **/
export function findByRecif(recifId: number): Promise<LivingCorail[]> {

    if(recifId === undefined) {
        return Promise.reject("Recif name is undefined");
    }

    let corail = db(table.corail + ' as i')
    .select('i.*', db.raw('case when count(t) = 0 then \'[]\' else json_agg(t) end as tags'))
    .leftJoin(table.corail_tag_rel + ' as r', 'i.id', 'r.corail_id')
    .leftJoin(table.tag + ' as t', 'r.tag_id', 't.id')
    .where('i.recif_id', recifId)
    .groupBy('i.id');

    return corail;
}

/**
 * Update Corail name and description
 * @param recifId
 * @param corailId
 * @param name
 * @param description
 **/
export function update(recifId: RecifId, corailId: CorailId, name: string, description: string) {

    console.log(recifId + ' ' + corailId + ' ' + name + ' ' + description);
    let corail = db(table.corail)
    .where({
        id: corailId,
        recif_id: recifId
    })
    .update({
        name: name,
        description: description
    })
    .returning('id')
    .then((arr) => arr[0]);
    
    return corailId
}