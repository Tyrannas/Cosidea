import * as knex from 'knex';

export let dbconf : knex.Config = {
  client: 'pg',
  connection: {
    host: '93.113.206.83',
    port: 5432,
    user: 'idee_server',
    password: 'server',
    database: 'boite_a_idee',
    ssl: true
  }
};

