import {db} from './db';
import * as table from '../config/tables';
import {AlgeId, Alge} from './alge';
import {RecifId} from './recif';
import * as corail_alge_rel from './corailAlgeRel';

export type CorailId = number;

export class Corail {
    id: CorailId;
    constructor(public recif_id: number, public name: string, 
                public description?: string) {}
}

export class LivingCorail extends Corail {
    alges: Alge[];
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
        //  Delete relation between corail and alges
        await db(table.corail_alge_rel).where('corail_id', corailId).del();
        //  Delete corail
        await db(table.corail).where('id', corailId).del();
        
        return true;
    }
    catch(err) {
        return err;
    }
}

/**
 *  Add Alge to Corail
 *  @param corailId
 *  @param algeId
 *  @returns CorailAlgeRel
 **/
export function addAlge(corailId: CorailId, algeId: AlgeId) {
    return corail_alge_rel.addCorailAlgeRel(corailId, algeId);
}

/**
 *  Remove Alge from Corail
 *  @param corailId
 *  @param algeId
 **/
export function removeAlge(corailId: CorailId, algeId: AlgeId) {
    return corail_alge_rel.removeCorailAlgeRel(corailId, algeId);
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
    .select('i.*', db.raw('case when count(t) = 0 then \'[]\' else json_agg(t) end as alges'))
    .leftJoin(table.corail_alge_rel + ' as r', 'i.id', 'r.corail_id')
    .leftJoin(table.alge + ' as t', 'r.alge_id', 't.id')
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