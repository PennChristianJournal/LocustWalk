var mongoose = require('mongoose')
var conn = mongoose.connection;
var fs = require('fs');
var Grid = require('gridfs-stream');
Grid.mongo = mongoose.mongo;
var gfs

conn.once('open', function() {
  gfs = Grid(conn.db);
})

module.exports = {
  fromUpload: function(file, cb) {
    var writestream = gfs.createWriteStream({
      filename: file.name,
      content_type: file.mimetype
    })
    writestream.end(file.data)
    writestream.on('close', function(upload) {
      return cb(null, upload)
    })
  },

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