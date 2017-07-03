'use strict'

const nconf = require('nconf');
const path = require('path');
const MongoClient = require('mongodb').MongoClient;
const async = require('async');

nconf.argv().env().file({file: path.join(__dirname, '../config.json')});

nconf.defaults({
  PORT: 3000,
  REDIS_URL: 'redis://127.0.0.1:6379',
  NODE_ENV: 'development',
  MONGODB_URI: 'mongodb://localhost:27017/locustwalk',
});

const REMOTE_URI = process.argv[2];
const MONGODB_URI = nconf.get('MONGODB_URI');

(function() {
  if (!REMOTE_URI) {
    console.error("No remote URI provided!");
    return;
  }

  console.log("Copying from", REMOTE_URI, "to", MONGODB_URI);

  MongoClient.connect(MONGODB_URI, function(err, localDB) {
    if (err) throw err;
    console.log("Connected to local", localDB.databaseName);
    MongoClient.connect(REMOTE_URI, function(err, remoteDB) {
      if (err) throw err;
      console.log("Connected to remote", remoteDB.databaseName);

      remoteDB.collections(function(err, collections) {
        if (err) throw err;

        async.parallel(
          collections.map(function(collection) {
            if (collection.s.name === "system.indexes") {
              return function(cb) {
                cb();
              }
            }
            console.log("Collection:", collection.s.name);
            var localCollection = localDB.collection(collection.s.name);

            return function(cb) {
              localCollection.drop(function(err) {
                localDB.createCollection(collection.s.name, function(err, localCollection) {
                  if (err) return cb(err);
                  console.log("Created new collection", collection.s.name);
                  collection.count({}, function(err, total) {
                    if (err) return cb(err);
                    console.log(collection.s.name, "has", total, "items");
                    collection.find({}, function(err, cursor) {
                      if (err) return cb(err);

                      var count = 0;
                      (function next() {
                        cursor.hasNext(function(err, r) {
                          if (err) return cb(err);
                          if (r) {
                            cursor.next(function(err, item) {
                              if (err) return cb(err);
                              localCollection.insertOne(item, function(err, inserted) {
                                if (err) return cb(err);
                                console.log(collection.s.name, ++count, "/", total);
                                return next();
                              });
                            });
                          } else {
                            return cb();
                          }
                        });
                      })();

                    });
                  });
                });
              });
            }
          }),
          function(err, results) {
            if (err) throw err;
            remoteDB.close();
            localDB.close();
          }
        );
      });

    });
  });
})();
