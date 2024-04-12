ls
mongosh --authenticationDatabase admin
sh importscript.sh
mongosh --authenticationDatabase admin
mongoimport --db ny               --collection yams_db               --authenticationDatabase admin 	      --drop               --file /pastries.json
mongoimport --db yams_db               --collection pastries               --authenticationDatabase admin 	      --drop               --file /pastries.json
mongoimport --db yams_db               --collection pastries               --authenticationDatabase admin               --file /pastries.json
mongoimport --host localhost:27017 --db yams_db --collection pastries --authenticationDatabase admin --file /pastries.json
ls
cd docker-entrypoint-initdb.d/
ls
cd ..
mongosh --authenticationDatabase admin
mongosh --authenticationDatabase admin
mongosh --authenticationDatabase admin
exit
