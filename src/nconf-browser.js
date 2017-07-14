'use strict';

export default {
  get: function(name) {
    return process.env[name];
  },
};
