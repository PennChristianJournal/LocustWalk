import {Router} from 'express';
import {getJWTClient, getGoogleDriveClient} from './googleAPIs';
import cheerio from 'cheerio';

const router = new Router();
const driveClient = getJWTClient(['https://www.googleapis.com/auth/drive']);

router.get('/search', (req, res) => {
  getGoogleDriveClient(driveClient, function(err, drive) {
    if (err) {
      console.error(err);
    }

    var files = [];

    function fetchPage(pageToken, cb) {
      drive.files.list({
        q: `name contains '${req.query.name}'`,
        fields: 'nextPageToken, files(id, name)',
        spaces: 'drive',
        pageToken: pageToken,
      }, function(err, res) {
        if (err) {
          return cb(err);
        }

        res.files.forEach(file => files.push(file));
        if (res.nextPageToken) {
          // more results...
        }
        return cb(null);
      });
    }

    fetchPage(null, function() {
      res.send(files);
    });
  });
});

router.get('/fetch/:id', (req, res) => {
  getGoogleDriveClient(driveClient, function(err, drive) {
    drive.files.export({
      auth: driveClient,
      fileId: req.params.id,
      mimeType: 'text/html',
    }, (err, response) => {
      if (err) {
        return res.send(err);
      }

      var $ = cheerio.load(response);
      $('p').each(function() {
        $(this).removeAttr('style');
      });
      return res.send($('body').html());
    });
  });
});

export default router;
