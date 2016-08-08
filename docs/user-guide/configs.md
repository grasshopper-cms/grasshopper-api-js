# Configs

When starting grasshopper api, you must call it with your configs:

```
const configs = require('./configs');
const ghApi = require('grasshopper-api');

var results = ghApi(configs);
```

The following configs can be passed to `grasshopper-api`:

* `server`
    * this can be left out altogether or passed in as an object
    * `server.proxy` if `server.proxy === true` then a router will be returned from initializing grasshopper api, and no standalone express app will be created. This is meant to be used in the case you have an express app you want to mount the grasshopper api router on.
    * `server.https` truthy if grassopper should handle SSL - this is only meant for dev envirnoments. Nginx or Apache should handle SSL on production / staging. `server.https` should be an object if it is truthy.
    * `server.https.key` relative path to ssl key from `process.cwd()`
    * `server.https.cert` relative path too ssl cert file from `process.cwd()` 
* `sessions` 
    * set to truthy if you want cookies managed sessions
    * default: `undefined` 