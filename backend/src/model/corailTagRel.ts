import {db} from './db';
import * as table from '../config/tables';
import {TagId} from './tag';
import {CorailId} from './corail';

class CorailTagRel {
    constructor(public corail_id: CorailId, public tag_id: TagId) {}
}

/**
 *  add relation between a Corail and an Tag in database
 *  @param corailId
 *  @param tagId
 *  @returns CorailTagRel
 **/
export function addCorailTagRel(corailId: CorailId, tagId: TagId): Promise<CorailTagRel> {

    if(corailId === undefined || tagId === undefined) {
        return Promise.reject("No corail/tag ID");
    }

    let rel = new CorailTagRel(corailId, tagId);

    let query = db(table.corail_tag_rel)
    .insert(rel)
    .then(() => rel);

    return query;
}

/**
 *  remove relation between a Corail and an Tag in database
 *  @param corailId
 *  @param tagId
 **/
export function removeCorailTagRel(corailId: CorailId, tagId: TagId): Promise<any> {

    if(corailId === undefined || tagId === undefined) {
        return Promise.reject("No tag/corail ID");
    }

    let query = db(table.corail_tag_rel)
    .where({
        'corail_id': corailId,
        'tag_id': tagId
    })
    .del()
    .then(() => {});

    return query;
}