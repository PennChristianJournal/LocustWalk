
var mongoose = require('mongoose')
var conn = mongoose.connection;
var fs = require('fs');
var Grid = require('gridfs-stream');
Grid.mongo = mongoose.mongo;
var gfs

conn.once('open', function() {
  gfs = Grid(conn.db);
})

var File = {
  // fromStream: function(stream, options, cb, replace) {
  //   var writestream = gfs.createWriteStream({
  //     filename: options.name,
  //     content_type: options.mimetype
  //   })
  //   stream.pipe(writestream)
  //   writestream.on('close', function(upload) {
  //     return cb(null, upload)
  //   })
  // },

  makeWriteStream: function(options, cb, replace) {
    new Promise((resolve, reject) => {
      if (replace) {
        gfs.exist(options, (err, found) => {
          if (err) return reject(err)
          if (found) {
            console.log('Removing existing file...')
            gfs.remove(options, (err) => {
              if (err) {
                reject(err)
              } else {
                resolve()
              }
            })
          } else {
            resolve()
          }
        })
      } else {
        resolve()
      }
    }).then(() => {
      var writestream = gfs.createWriteStream(options)
      // writestream.on('close', function(upload) {
      //   return cb(null, upload)
      // })
      return cb(null, writestream)
    })
    .catch(err => {
      return cb(err)
    })
  },

  // fromUpload: function(file, cb, replace) {
    // if (replace) {
    //   gfs.exist({})
    //   File.findOne({
    //     filename: file.name
    //   }, (err, file) => {
    //     if (err) console.log(err)
    //     if (file) {
    //       File.remove({
    //         filename: file.name
    //       }, (err) => {
    //         if (err) console.log(err)
    //       })
    //     }
    //   })
    // }

  //   var writestream = gfs.createWriteStream({
  //     filename: file.name,
  //     content_type: file.mimetype
  //   })
  //   writestream.end(file.data)
  //   writestream.on('close', function(upload) {
  //     return cb(null, upload)
  //   })
  // },

  findOne: function(options, cb) {
    gfs.findOne(options, function(err, file) {
      if (file) {
        var stream = gfs.createReadStream({
          _id: file._id
        })
      }
      cb(err, file, stream)
    })
  },

  remove: function(options, cb) {
    gfs.remove(options, function(err) {
      cb(err)
    })
  }
}

module.exports = File