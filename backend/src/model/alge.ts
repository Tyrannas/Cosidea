import {db} from './db';
import * as table from '../config/tables';
import {RecifId} from './recif';

export type AlgeId = number;

export class Alge {
    id: AlgeId;
    constructor(public recif_id: RecifId, public name: string) {}
}

/**
 * Add an Alge to a Recif
 * @param recifId
 * @param name
 * @return {Promise.<AlgeId>}
 */
export function addAlge(recifId: RecifId, name: string): Promise<AlgeId> {

    if(name == undefined || name.length < 1) {
        return Promise.reject("Alge needs name");
    }

    let alge = new Alge(recifId, name);

    let query = db(table.alge)
    .insert(alge)
    .returning('id')
    .then((arr) => arr[0]);

    return query;
}

/**
 * Get all Alges in some Recif
 * @param recifId
 * @returns {Promise.<Alge[]>}
 */
export function getByRecif(recifId: RecifId): Promise<Alge[]> {

    if(recifId === undefined) {
        return Promise.reject("recif undefined");
    }

    let query = db(table.alge)
    .select('*')
    .where('recif_id', recifId);

    return query;
}
