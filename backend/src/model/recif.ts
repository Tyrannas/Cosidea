import {db}             from './db';
import * as table       from '../config/tables';
import * as defaults    from '../config/default';
import * as tag         from './tag';

export type RecifId = number;

export class Recif {
    id: RecifId;
    constructor(public name: string, public description: string, 
                public owner?: number, public isProtected?: boolean, 
                public hash?: string) {}
}

/**
 * Add a Recif
 * @param name
 * @param description
 * @param [isProtected]
 * @param [hash]
 * @param [ownerId]
 * @returns {RecifId} recifId
 */
export async function addRecif( name: string, description: string, isProtected?: boolean,
                                hash?: string, ownerId?: number): Promise<RecifId> {
    // Recif needs a name
    if(name == null || name.length < 1){
        return Promise.reject("No name");
    }
    // if is not protected cant have an owner or hash
    if(!isProtected) {
        hash = undefined;
        ownerId = undefined;
        isProtected = false;
    }
    
    let proj = new Recif(name, description, ownerId, isProtected, hash);
    // insert Recif
    let query = await db(table.recif)
    .insert(proj)
    .returning('id')
    .then((arr) => arr[0]);

    // Add default Tags to Recif
    defaults.tags.forEach( async (a:string) => {
        await tag.addTag(query, a);
    });

    return query;
}

/**
 * Find Recif by RecifId
 * @param {RecifId} recifId
 * @returns {Promise.<Recif>}
 */
export function find(id: RecifId): Promise<Recif> {

    let query = db(table.recif)
    .select('*')
    .where('id', id)
    .then((arr) => arr[0]);

    return query;
}

/**
 * Find all Recif
 * @returns {Promise.<Recif[]>} 
 */
export function findAll(): Promise<Recif[]>
{
    let query = db(table.recif)
    .select('*');

    return query;
}

/**
 * Find Recif by prefix
 * @param prefix
 * @returns {Promise.<Recif[]>} 
 */
export function findByPrefix(name: string): Promise<Recif[]>
{
    let query = db(table.recif)
    .select('*')
    .where('name', 'LIKE', name + '%');

    return query;
}

/**
 * Find Recif by name
 * @param name
 * @return {Promise.<Refif>}
 */
export function findByName(name: string): Promise<Recif>
{
    let query = db(table.recif)
    .select('*')
    .where('name', name)
    .then((list) => {
        return list[0];
    });

    return query;
}


