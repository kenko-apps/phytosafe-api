const options = {}; // add options here
const pgp = require('pg-promise')(options);

// database connection details
const cn = {
  host: '127.0.0.1', // 'localhost' is the default
  port: 5432, // 5432 is the default
  database: 'xxxxxx',
  user:'xxxxxx',
  password:'xxxxxx'
};

const db = pgp(cn); // database instance

module.exports = db;
