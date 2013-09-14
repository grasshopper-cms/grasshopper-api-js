![Grasshopper Logo](https://s3.amazonaws.com/SolidInteractive/images/grasshopper/grasshopper-api-js.jpg)

---------------------------------------------------------------

## What am I?

------------------------------------------------------------------

The Grasshopper API is the foundation of the Grasshopper CMS. It provides all of the mechanisms necessary to create content in the cloud. The API can be written in any language and it can fully support any document based database (NoSQL). Their is no user interface supplied in this project, this is on purpose so that developers have complete freedom to creatively use the CMS in whichever way they want.

![Grasshopper Ecosystem](https://s3.amazonaws.com/SolidInteractive/images/grasshopper/GrasshopperEcosystemOverview.png)


## Why would you want to use me?

------------------------------------------------------------------

Common CMS products do not cut it for real apps. When you push Word Press beyond it's intended use you are constantly at war with it.  Our CMS is different, it is simply a data management tool not a website creator. This distinction makes it very appealing when creating APIs, apps or non-traditional websites.

 
 
## How would you use me? 

------------------------------------------------------------------

All operations of the API are done via a rest like api. This project has no user interface, anyone could create an interface and put it on top of the APIs. For deployment, you have a couple options. We have supplied a vagrant box to get you up and running with little/no configuration required. Or you can deploy the code to a server and use the configuration options to customize your experience. 

Our default box uses node js 10.x and Mongo for a databse.

 
  
### Developer Setup

-----------------------------------------------------------------------------

[Click here](https://git.thinksolid.com/opensource/grasshopper-api-js/wikis/development-environment) to read how to get setup as a developer. 
 
 
  
  
### Configuration Options

------------------------------------------------------------------

If you are deploying on a server then you will want to customize the available options. 

Open the ```lib/config/configuration``` file

        {
            "cache": {
                "path": "./cache"
            },
            "crypto": {
                "secret_passphrase" : ""
            },
            "db": {
                "type": "mongodb",
                "host": "mongodb://{dbuser}:{dbpassword}@localhost:27017/grasshopper",
                "database": "grasshopper",
                "username": "",
                "password": ""
            },
            "logger": {
                "adapters": [{
                    "type": "file",
                    "path": "./log/grasshopper.log",
                    "application": "grasshopper-api",
                    "machine": "dev-server"
                }]
            }
        }
 
 
 
#### Configuration Definitions

------------------------------------------------------------------

* cache: Set path the cached files/data are going to live. (Default is cache directoy in root of project).
* crypto: Set a unique secret_passphrase that can be used to encrypt data.
* DB settings
    * type: mongodb/couch
    * host: URL to database
    * database: Name of the database
    * username: User name of the database
    * password: password for the database
* logger: Module used to capture logs from the API/SDK 
    * type: file
    * path: Location that the file will be saved to
    * application: Name of your application
    * machine: Identifyable name of your server
 
 
 
# API Specs

-------------------------------------------------------

For full documentation on the grasshopper API [click here](api)
 
 
  
# Running Tests

-------------------------------------------------------

There are a couple of ways to run our unit tests.

* $: make test
* $: npm test
 
 
 
# License

-------------------------------------------------------

Grasshopper API JS is released under a [MIT license](../blob/master/LICENSE).