import {db} from './db';
import * as table from '../config/tables';

export type UserId = number;

export class User {
    id: UserId;
    constructor(public name: string, public hash: string) {}
    secure() { delete this.hash; }
}

export function addUser(name: string, hash: string): Promise<UserId> {

    if(name === undefined || name.length < 1) {
        return Promise.reject('Name is undefined');
    }

    let user = new User(name, hash);

    let query = db(table.user)
    .insert(user)
    .returning('id')
    .then((arr) => arr[0]);

    return query;
}

export function findByName(name: string): Promise<User> {

    if(name === undefined) {
        return Promise.reject('name is undefined');
    }

    let query = db(table.user)
    .select('*')
    .where('name', name)
    .then((arr) => arr[0]);

    return query;
}

export function findById(id: number): Promise<User> {

    let query = db(table.user)
    .select('*')
    .where('id', id)
    .then((arr) => arr[0]);

    return query;
}