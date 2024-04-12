db = db.getSiblingDB('yams_db');

//db.createUser({
  //user: 'root',
  //pwd: 'password',
  //roles: [{ role: 'root', db: 'yams_db' }]
//});

// Import data from JSON file
data = cat('/tmp/pastries.json');
data = JSON.parse(data);
db.yams_db.insert(data);
