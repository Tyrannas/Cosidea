Cosidea Backend
===============

### API ###

### Create
Add User:
```/create/user/:user/:password```

Add Project:
```/create/project/:title/:description/:protected/:ownerId?/:password?```

protected can be ```0``` or ```1```. If the project is protected you have to specify ownerId and project password.

### Info
Project Info:
```/info/project/:projectTitle```

returns the fields ```title, description, id, owner, protected```

Ideas in some project:
```/info/idea/:projectId/:token?```

if the project is password protected you need to specify a token (see /auth).

### Auth
Connect to project:
```/info/project/:projectId/:password```

returns projectId and token. The token can be used to request Ideas from protected projects.


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

### Build
Typescript to js:

```
tsc
```

### Launch
```
node js/server
```


