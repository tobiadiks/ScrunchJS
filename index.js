
const compressImageServer = require('./server.cjs');
const compressImageClient = require('./client.js');


if (typeof window === 'undefined') {
  // Server-side
  module.exports = compressImageServer;
} else {
  // Client-side
  module.exports = compressImageClient;
}