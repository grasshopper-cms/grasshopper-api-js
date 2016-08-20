# Minimum Plugin Requirements

* `activate.js` -> Runs the activate script for the plugin. Should return a bluebird promise. This runs anytime the app is started, and when the user specifically 'activates' that plugin from the Settings tab.  You should add code that supports your plugin here, stuff like, static file directories, new routes, add / modify content in grasshopper core.  Because this runs allot, make sure you check for the existence of things before you do any real work. Like, if you were going to add a tab to the db when the plugin was activated, check if it exists before adding it because you might have already added it.

* `deactivate.js` -> Undo everything you did in the activate script you dirty beast.

* `config.js` -> Some bare minimum config values for the script, should eventually come from the `package.json` IMO.

* `package.json` -> Even if you dont use this, we need to track versions with it and we also want to maybe eventually put plugins on NPM.

