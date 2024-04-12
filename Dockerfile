FROM mongo:latest

# Create database and collection
RUN mongoimport --host localhost:27017 --db yams_db --collection pastries --jsonArray --type json --file /pastries.json

EXPOSE 27017

CMD ["mongod"]