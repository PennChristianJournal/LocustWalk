'use strict';

import fs from 'fs';
import path from 'path';

function walk(dir, action) {
  let list = fs.readdirSync(dir);
  list.forEach(function(file) {
    let path = dir + '/' + file;
    let stat = fs.statSync(path);
    if (stat && stat.isDirectory()) {
      walk(path, action);
    } else {
      action(path);
    }
  });
}

const TARGETS = {};

function registerTargets(group, prefix, dir) {
  TARGETS[group] = TARGETS[group] || {};
  walk(dir, function(file) {
    if (path.extname(file) !== '.js') {
      return;
    }
    // group = admin
    // prefix = admin
    // dir = /home/user/code/locustwalk/src/admin/frontend/views
    // file = /home/user/code/locustwalk/src/admin/frontend/views/articles/edit.js
    let relativePath = path.relative(dir, file);
    // relativePath = articles/edit.js
    let target = path.basename(relativePath.replace('/', '-'), '.js');
    // target = articles-edit
    if (prefix) {
      target = `${prefix}-${target}`;
      // target = admin-articles-edit
    }

    let basename = path.basename(relativePath, '.js');
    // basename = edit

    // /home/user/code/locustwalk/src/tmp/.admin-articles-edit.js
    var mountTarget = `${__dirname}/tmp/.${target}.js`;
    if (!fs.existsSync(`${__dirname}/tmp/`)) {
      fs.mkdirSync(`${__dirname}/tmp/`);
    }
    fs.writeFileSync(mountTarget, `
      var mount = require('${__dirname}/common/frontend/helpers/page').mount;
      var Page = require('${file}').default;
      mount(Page);
    `);

    TARGETS[group][target] = {
      mountTarget, // /home/user/code/locustwalk/src/tmp/.admin-articles-edit.js
      file, // /home/user/code/locustwalk/src/admin/frontend/views/articles/edit.js
      group, // admin
      target, // admin-articles-edit
      route: path.join('/', path.dirname(relativePath), basename === 'index' ? '' : basename), // /articles/edit
    };

  });
}

function getViews(group) {
  return TARGETS[group] || {};
}

registerTargets('common', '', path.join(__dirname, 'common/frontend/views'));
registerTargets('admin', 'admin', path.join(__dirname, 'admin/frontend/views'));

export default {
  registerTargets,
  getViews,
  TARGETS,
};
