#!/bin/bash

mongoimport --db='yams-db' --collection='pastries' --file='/tmp/pastries.json' --jsonArray --username='root' --password='password' --authenticationDatabase=admin

# Créer des collections supplémentaires
mongo --eval "db.createCollection('users')"
mongo --eval "db.createCollection('winners')"