import * as knex from 'knex';

let db;

export function connectDb(knexConfig)
{
    db = knex(knexConfig);
}

export function getDb() {
    return db;
}