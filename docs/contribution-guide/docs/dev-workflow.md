# Dev Workflow

### From a fresh clone:
* git clone [Grasshopper Api](https://github.com/Solid-Interactive/grasshopper-api-js).
* cd `grasshopper-api-js`
* `npm install`
* the first time you do this, you will probably also want to load in some default testing data: run `demo/bin/dataLoad`
* when you are ready, run `bin/start` and this will open up a server that is listening on port [`3008`](http://localhost:3008/admin/login)
* To login to admin use username : `admin`and password : `TestPassword`

### Handle data changes.
You will probably want to use and modify the test data while you add new features and debug admin.
To load test data into your local GH instance run `demo/bin/dataLoad`
To save data from your local instance into this repo so others can use it run `demo/bin/dataSave`. You will want to commit this data change.

### Adding new Tabs:

### Adding new pages to the stage:

### Adding data to the custom page :

