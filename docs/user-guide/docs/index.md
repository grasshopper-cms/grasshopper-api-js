# Grasshopper Developers Guide

## Introduction
Welcome to Grasshopper, the world's greatest CMS.  As a developer, when you create a project using Grasshopper you will be making use of the Grasshopper API, in conjunction with NodeJS and probably ExpressJS too.  These docs are intended to explain the basic principles and usage cases of developing a Web App using Grasshoppper.
We will take you through the following:

## Installation
Installing grasshopper is done through NPM: 
Grasshopper core handles the connection to the database and your queries.
`npm install grasshopper-core`
Grasshopper API is what developers interact with, as a wrapper for Grasshopper core. Grasshopper core is a dependency of Grasshopper API.
`npm install grasshopper-api`

## Application structure
Grasshopper uses configuration files in your application to run. Let's see how your application will look starting from scratch:

 * package.json
 * application
     * grasshopper-config.json
     * app.js
     * users.js
 * node_modules
     * {various dependencs}

## Setting up the Admin User
To start using grasshopper, you'll have to set up an admin user. Admin users are configured in the following way:
```javascript
{
    _id: ObjectID('arbitrary id string (numeric?)'),
    role: 'admin',
    enabled: true,
    firstname: 'Test',
    lastname: 'User',
    identities: {
        basic: {
            username: 'admin',
            salt: 'd41d8cd98f00b204e9800998ecf8427e',
            hash: '67a74306b06d0c01624fe0d0249a570f4d093747'
        }
    },
    displayName : 'admin',
    linkedIdentities : ['basic'],
    email: 'email@email.com'
}
```
[See this page for a breakdown on the user object.](http://solid-interactive.github.io/grasshopper-core-nodejs/documentation.html#users)

## Configuration
Configuring grasshopper is simple, just add your environment configs.

[See this page for a breakdown of each of the configuration objects.](http://solid-interactive.github.io/grasshopper-core-nodejs/documentation.html#projectconfiguration)

## Startup
The `grunt server` task will start a local express server running the API.

```javascript

```

## App authentication
## The Admin UI
## Creating Content / Content Types
## Managing Assets
## The User
## Making Queries
