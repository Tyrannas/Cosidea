import {db} from './db';
import * as table from '../config/tables';
import {AlgeId} from './alge';
import {CorailId} from './corail';

class CorailAlgeRel {
    constructor(public corail_id: CorailId, public alge_id: AlgeId) {}
}

/**
 *  add relation between a Corail and an Alge in database
 *  @param corailId
 *  @param algeId
 *  @returns CorailAlgeRel
 **/
export function addCorailAlgeRel(corailId: CorailId, algeId: AlgeId): Promise<CorailAlgeRel> {

    if(corailId === undefined || algeId === undefined) {
        return Promise.reject("No corail/alge ID");
    }

    let rel = new CorailAlgeRel(corailId, algeId);

    let query = db(table.corail_alge_rel)
    .insert(rel)
    .then(() => rel);

    return query;
}

/**
 *  remove relation between a Corail and an Alge in database
 *  @param corailId
 *  @param algeId
 **/
export function removeCorailAlgeRel(corailId: CorailId, algeId: AlgeId): Promise<any> {

    if(corailId === undefined || algeId === undefined) {
        return Promise.reject("No alge/corail ID");
    }

    let query = db(table.corail_alge_rel)
    .where({
        'corail_id': corailId,
        'alge_id': algeId
    })
    .del()
    .then(() => {});

    return query;
}