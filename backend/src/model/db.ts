import * as knex from 'knex';

export let db : knex;

export function connectDb(knexConfig : knex.Config)
{
    db = knex(knexConfig);
}
