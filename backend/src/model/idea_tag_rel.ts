import {db} from './db';
import * as table from '../config/tables';
import {TagId} from './tag';
import {IdeaId} from './idea';

class IdeaTagRel {
    constructor(public idea_id: IdeaId, public tag_id: TagId) {}
}

export function addIdeaTagRel(ideaId: IdeaId, tagId: TagId): Promise<IdeaTagRel> {

    if(ideaId === undefined || tagId === undefined) {
        return Promise.reject("No tag/idea ID");
    }

    let rel = new IdeaTagRel(ideaId, tagId);

    let query = db(table.idea_tag_rel)
    .insert(rel)
    .then(() => rel);

    return query;
}

export function removeIdeaTagRel(ideaId: IdeaId, tagId: TagId): Promise<any> {

    if(ideaId === undefined || tagId === undefined) {
        return Promise.reject("No tag/idea ID");
    }

    let query = db(table.idea_tag_rel)
    .where({
        'idea_id': ideaId,
        'tag_id': tagId
    })
    .del()
    .then(() => {});

    return query;
}