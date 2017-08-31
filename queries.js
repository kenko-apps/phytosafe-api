var promise = require('bluebird');

var options = {
  // Initialization Options
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
var connectionString = 'postgres://postgres:galanim@localhost:5432/phytosafe';
var db = pgp(connectionString);

// add query functions

module.exports = {
  getTraitementById: getTraitementById,
  
    

  getSinglePuppy: getSinglePuppy,
  createPuppy: createPuppy,
  updatePuppy: updatePuppy,
  removePuppy: removePuppy
};