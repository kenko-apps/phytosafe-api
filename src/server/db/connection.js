const options = {}; // add options here
const pgp = require('pg-promise')(options);

// database connection details
const cn = {
  host: '127.0.0.1', //'51.255.38.12', // 'localhost' is the default
  port: 5432, // 5432 is the default
  password:'xxxxxx',
  password:'xxxxxx',
  password:'xxxxxx'
};

const db = pgp(cn); // database instance

module.exports = db;
