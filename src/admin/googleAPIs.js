'use strict';

import google from 'googleapis';
import nconf from 'nconf';
import fs from 'fs';

const JWT = nconf.get().JWT;
fs.writeFileSync(`${__dirname}/../../jwt.json`, JSON.stringify(JWT));

export function getJWTClient(scopes) {
  return new google.auth.JWT(JWT.client_email, 'jwt.json', JWT.private_key, scopes);
}

export function getGoogleDriveClient(jwtClient, cb) {
  jwtClient.authorize((err, tokens) => {
    cb(err, google.drive({ version: 'v3', auth: jwtClient }));
  });
}