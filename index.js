
const compressImageServer = require('./server.cjs');
const compressImageClient = require('./client.js');

exports.compressImageServer = compressImageServer;
exports.compressImageClient = compressImageClient;

if (typeof window === 'undefined') {
  // Server-side
  module.exports = compressImageServer;
} else {
  // Client-side
  module.exports = compressImageClient;
}