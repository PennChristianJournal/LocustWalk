/**
 * Loads config data from config.json or from environment variables
 *
 * All config variables are accessed in the format: config.category.key
 * If using environment variables, the key is set as the environment variable.
 */

"use strict";

import fs from 'fs'
import path from 'path'
import template from './config.template.json'
const jsonPath = path.join(__dirname, 'config.json');
var json = {};

const config = Object.assign({}, template);

function iterateNestedProperties(template, cb) {
    function iterate(obj, prefix = []) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                var newPrefix = prefix.slice();
                newPrefix.push(key);
                if (typeof obj[key] === 'object') {
                    iterate(obj[key], newPrefix);
                } else {
                    cb(newPrefix);
                }
            }
        }
    }
    iterate(template);
}

iterateNestedProperties(template, function(names) {
    var key = names.join('.');
    if (process.env.hasOwnProperty(key)) {
        var current = config;
        for (var i = 0; i < names.length - 1; ++i) {
            current[names[i]] |= {};
            current = current[names[i]];
        }
        current[names[names.length - 1]] = process.env[key];
    }
});

try {
    fs.accessSync(jsonPath, fs.constants.R_OK | fs.constants.W_OK);
    json = require(jsonPath);
    Object.assign(config, json);
} catch (e) {

}

export default config;

// for (var category in template) { //iterate through each config category

    /*if (!template.hasOwnProperty(category) || category == "_comment") continue;
    for (var key in template[category]) { //retrieve items in each category
        if (!template[category].hasOwnProperty(key) || key == "_comment") continue;
        if (!process.env.hasOwnProperty(key)) throw new Error('Missing environment variable ' + key);
        template[category][key] = process.env[key];
    }*/
// }

/*

if (fs.existsSync('./config.json')) {
    config = json;
    // module.exports = require('./config.json');
} else {
    for (var category in template) { //iterate through each config category
        if (!template.hasOwnProperty(category) || category == "_comment") continue;
        for (var key in template[category]) { //retrieve items in each category
            if (!template[category].hasOwnProperty(key) || key == "_comment") continue;
            if (!process.env.hasOwnProperty(key)) throw new Error('Missing environment variable ' + key);
            template[category][key] = process.env[key];
        }
    }
    // module.exports = configTemplate;
    config = template;
}

export default config;*/