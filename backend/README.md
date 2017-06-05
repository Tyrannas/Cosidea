Cosidea Backend
===============

### API ###

### Create

Add User:  
```POST: /create/user/:user/:password```  
Returns userId.

Add Project:  
```POST: /create/project/:title/:protected?desc=<description>&owner=<owner_user_id>&pwd=<password>```  
protected can be ```0``` or ```1```. If the project is protected you have to specify ownerId and project password.  
Returns the projectId.

Add Idea:  
```POST: /create/idea/:projectId/:title?desc=<description>&token=<token>```  
Returns the ideaId.

Add Tag:  
```POST: /create/tag/:projectId/:name?token=<token>```  
Returns the tagId.

### Remove

Remove Tag:  
```POST: /rm/link/:projectId/:ideaId/:tagId?token=<token>```  

### Info

Project Info:  
```GET: /info/project/:projectTitle```  
Returns the fields ```title, description, id, owner, protected```

Ideas in some project:  
```GET: /info/idea/:projectId?token=<token>```  
if the project is password protected you need to specify a token (see /auth).  
Returns an array of Ideas with tags
### Auth

Connect to project:  
```GET: /info/project/:projectId/:password```  
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


