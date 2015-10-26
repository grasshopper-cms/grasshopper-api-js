#!/bin/bash
mongoimport -v --drop --db test --collection content --file data/content.json --jsonArray
mongoimport -v --drop --db test --collection contenttypes --file data/contenttypes.json --jsonArray
mongoimport -v --drop --db test --collection hookevents --file data/hookevents.json --jsonArray
mongoimport -v --drop --db test --collection nodes --file data/nodes.json --jsonArray
mongoimport -v --drop --db test --collection users --file data/users.json --jsonArray
