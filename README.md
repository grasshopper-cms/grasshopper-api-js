![Grasshopper Logo](https://s3.amazonaws.com/SolidInteractive/images/grasshopper/grasshopper-api-js.jpg)

---------------------------------------------------------------

### ALPHA - TO BE RELEASED OFFICIALLY EARLY 2014


### What am I?

------------------------------------------------------------------

The Grasshopper API is the foundation of the Grasshopper DMS (Data Management System). It provides all of the mechanisms necessary to create content locally or in the cloud. This repository contains our NodeJS implementation but the API can be written in any language and it can fully support any document based database (NoSQL). There is no user interface included in this project, this is on purpose so that developers have complete freedom to creatively use the DMS in whichever way they want.

![Grasshopper Ecosystem](https://s3.amazonaws.com/SolidInteractive/images/grasshopper/GrasshopperEcosystemOverview.png)


### Why would you want to use me?

------------------------------------------------------------------

Common CMS products do not cut it for real apps. When you push Word Press beyond it's intended use you are constantly at war with it.  Our CMS is different, it is simply a data management tool not a website creator. This distinction makes it very appealing when creating APIs, apps or non-traditional websites.

 
 
### How would you use me? 

------------------------------------------------------------------

All operations are performed via a rest like api. If you are developing your project locally we have provided a vagrant box that can be used to create a local API (see developer setup instructions). To use the project in production you would need to:

* Publish the code for the api to a hosting provider of your choice
* Create your NoSQL database (currently only supporting mongo) 
* Update the configuration file to match your environment settings

 
  
  
### Configuration Options

------------------------------------------------------------------

Below is an example configuration file. You should edit the parameters below to suit your needs.

Open the ```lib/config/configuration``` file

        {
            "cache": {
                "path": "./cache"
            },
            "crypto": {
                "secret_passphrase" : "{Create guid}"
            },
            "db": {
                "type": "mongodb",
                "host": "mongodb://localhost:27017/{your info here}",
                "database": "{your info here}",
                "username": "{your info here}",
                "password": "{your info here}",
                "debug": false
            },
            "assets": {
                "default" : "amazon",
                "tmpdir" : "{absolute path to your tmp folder}",
                "engines": {
                    "amazon" : {
                        "accessKeyId": "{your info here}",
                        "secretAccessKey": "{your info here}",
                        "region" : "us-east-1",
                        "bucket" : "{your info here}",
                        "urlbase" : "{your info here}"
                    },
                    "local" : {
                        "path" : "{absolute path to your local assets}",
                        "urlbase" : "{fully qualified url base to your assets}"
                    }
                }
            },
            "logger" : {
                "adapters": [{
                    "type": "file",
                    "path": "{absolute path to your log file}",
                    "application": "{name your application}",
                    "machine": "{name your machine}"
                }]
            }
        }
 
 
 
#### Configuration Definitions

------------------------------------------------------------------

* cache: Set path the cached files/data are going to live. (Default is cache directoy in root of project).
* crypto: Set a unique secret_passphrase that can be used to encrypt data.
* DB settings
    * type: mongodb (right now only backend supported)
    * host: URL to database
    * database: Name of the database
    * username: User name of the database
    * password: password for the database
    * degug: bool (do you want output into the console)
* logger: Module used to capture logs from the API/SDK 
    * type: file
    * path: Location that the file will be saved to
    * application: Name of your application
    * machine: Identifyable name of your server
* assets: Where are your file attachments going to get stored
    * default: which provider are you going to use (local or amazon)
    * tmpdir: temp file directory
    * engines: collections of engines that will be used. NOTE: all engines get files saved to them, only the default returns results

 
### Managing Grasshopper API on production

By Default we have added a `grunt server:start` command that will load a server cluster using `PM2`.


Available commands

[https://github.com/Unitech/pm2](https://github.com/Unitech/pm2)

```
$ npm install pm2 -g     # Install pm2 command line globally
$ pm2 start app.js -i 4  # Daemonize pm2 and Start 4 clustered instances of app.js
                         # You can also pass the 'max' params to start
                         # the right numbers of processes depending of CPUs
$ pm2 list               # Display all processes status
$ pm2 monit              # Monitor all processes
$ pm2 logs               # Display all processes logs in streaming
$ pm2 dump               # Dump the states of all processes
$ pm2 stop pm2_id        # Stop specific process id
$ pm2 stopAll            # Stop all processes
$ pm2 resurrect          # Put online previously dumped processes
$ pm2 reload all         # Hot Reload all processes with 0s downtime (only for HTTP)
$ pm2 restart pm2_id     # Restart specific process
$ pm2 restart all        # Hard Restart all proccesses
$ pm2 stop all           # Stop all processes
$ pm2 generate app       # Generate a JSON process configuration
$ pm2 startup            # Generate init script to keep processes alive
$ pm2 web                # Health computer API endpoint (http://localhost:9615)
```

### API Documentation

-------------------------------------------------------

For full documentation on the grasshopper API [click here](https://github.com/Solid-Interactive/grasshopper-api-js/wiki)
 


### Running Tests

-------------------------------------------------------

To run the tests:

```shell
grunt test
```

If you are working with a Vagrant box you must first `vagrant ssh`, then in Vagrant, you have to `cd /vagrant` before
running the command above.

The url used by the tests is in a module located at: `test/config/test.js`. The port should be `80` when running the
tests. The url can be quickly updated to test remove locations too.

Depending on the node version you use, pm2 might not shut down properly. If you get an error that looks like the following:

```
Running "shell:makeTest" (shell) task
Listening on port 3000...

events.js:72
        throw er; // Unhandled 'error' event
```

Get the pid of the blocking process (a pm2 satan daemon) and kill it:

```
lsof -i:3000
kill -9 [thePid]
```

### Upcoming Features

-------------------------------------------------------

* Hooks are not yet supported
* Full node permissions for search criteria
* Cascading permissions for child nodes
* Deleting content when deleting a content type
* Deleting content when deleting a node
* Registering new collections
* Tin Can API integration
* More verbose response codes
* Security enhancements
* Publish content to other environments
* Content localization
* Content history
* Document merges
* Dynamic content model validation
* Plug in custom roles for advanced proxy implementations
* Document concurrency protection
* 3rd party authentication schemes
* more more more

## License

-------------------------------------------------------

Grasshopper API JS is released under a [MIT license](https://github.com/Solid-Interactive/grasshopper-api-js/blob/master/LICENSE).

## Release Notes

* 0.7.0 - 2014-11-20 - [features](https://github.com/Solid-Interactive/grasshopper-api-js/tree/master/release_notes/0.7.0_2014-11-20.md)
* 0.7.1 - 2014-11-21 - [patches](https://github.com/Solid-Interactive/grasshopper-api-js/tree/master/release_notes/0.7.1_2014-11-21.md)
* 0.7.3 - 2014-12-15 - [patches](https://github.com/Solid-Interactive/grasshopper-api-js/tree/master/release_notes/0.7.3_2014-12-15.md)
* 0.8.0 - 2014-02-26 - [features](https://github.com/Solid-Interactive/grasshopper-api-js/tree/master/release_notes/0.8.0_2014-02-26.md)
* 0.8.1 - 2014-03-11 - [patches](https://github.com/Solid-Interactive/grasshopper-api-js/tree/master/release_notes/0.8.1_2014-03-11.md)
* 0.8.2 - 2014-03-24 - [patches](https://github.com/Solid-Interactive/grasshopper-api-js/tree/master/release_notes/0.8.2_2014-03-24.md)
* 0.9.0 - 2014-03-24 - [features](https://github.com/Solid-Interactive/grasshopper-api-js/tree/master/release_notes/0.9.0_2014-03-24.md)
* 0.9.1 - 2014-03-24 - [patches](https://github.com/Solid-Interactive/grasshopper-api-js/tree/master/release_notes/0.9.1_2014-03-24.md)
* 0.9.1 - 2014-03-28 - [initial release](https://github.com/Solid-Interactive/grasshopper-api-js/tree/master/release_notes/0.9.1_2014-03-28.md)
* 0.9.3 - 2014-03-24 - [patches](https://github.com/Solid-Interactive/grasshopper-api-js/tree/master/release_notes/0.9.3_2014-03-24.md)
* 0.10.0 - 2014-04-03 - [features](https://github.com/Solid-Interactive/grasshopper-api-js/tree/master/release_notes/0.10.0_2014-04-03.md)


## Contributors (`git shortlog -s -n`)

* Travis McHattie
* Greg Larrenaga
* Peter Ajtai
* Cooper Hilscher
* Jesse McCabe
* Eric Beringer
* root
* Main Conf Room


## Dev Notes

To create the readme, update the release notes dir and package.json.version at a minimum. If needed update README.template.md.
Then run `grunt readme`.

_Compiled file. Do not modify directly. Created: 2014-04-03 04:13:06_