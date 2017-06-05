Cosidea Backend
===============

### Setup ###

### Database
The Cosidea Backend needs a postgresql Database. (https://www.postgresql.org/).

Use the script ```sql/createTables.sql``` to setup your tables.


Configure your Database connection in the ```config.js``` file:

```
exports.dbconf = {
  client: 'pg',
  connection: {
    host: 'your.host.ip.addr',  //  Database IP
    port: 5432,                 //  Database Port
    user: 'user',               //  Database User
    password: 'password',       //  User Password
    database: 'database_name',  //  Database Name
    ssl: true                   //  If using ssl
  }
};
```


