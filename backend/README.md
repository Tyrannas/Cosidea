Cosidea Backend
===============

### API ###

### Create

Add User:  
```
POST: /create/user
query: {
    name: <username>,
    pwd: <userPassword>
}
```  
Returns ```{ id: <newUserId> }```

Add Project:  
```
POST: /create/project
query: {
    title: <projectTitle>,
    protected: <isProtected>,   //  Optional, default: false
    desc: <description>,        //  Optional
    owner: <ownerUserId>,       //  Only if is protected
    pwd: <projectPassword>      //  Only if is protected
}
```  
Returns ```{ id: <newProjectId> }```.

Add Idea:  
```
POST: /create/idea
query: {
    projectId: <projectId>,
    title: <projectTitle>,
    tags:  <tagId1,tagId2,...>, //  Optional
    desc: <projectDescription>, //  Optional
    token: <projectToken>       //  Only if project is protected. See /auth.
}
```  
Returns ```{ id: <newIdeaId> }```.

Add Tag:  
```
POST: /create/tag
query: {
    projectId: <projectId>,
    name: <tagName>,
    token: <projectToken>   //  Only if project is protected. See /auth.
}
```  
Returns ```{ id: <newTagId> }```.

### Remove

Remove Link:  
```
POST: /rm/link
query: {
    projectId: <projectId>,
    ideaId: <ideaId>,
    tagId: <tagId>,
    token: <projectToken>   //  Only if project is protected. See /auth.
}
```  

### Info

Project Info:  
```
GET: /info/project
query: {
    title: <projectTitle>
}
```  
Returns the fields ```title, description, id, owner, protected```

Ideas in some project:  
```
GET: /info/idea/:projectId?token=<token>
query: {
    projectId: <projectId>,
    token: <projectToken>   //  Only if project is protected. See /auth.
}
```   
Returns an array of Ideas with tags


### Auth

Connect to project:  
```
GET: /auth/project
query: {
    projectId: <projectId>,
    pwd: <projectPassword>
}
```  
returns id and token. The token can be used to request Ideas from protected projects.

Connect user:  
```
GET: /auth/user
query: {
    name: <userName>,
    pwd: <userPassword>
}
```  




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


