const db = require('./connection');

function getTraitementById(req, res, next) {
    var traitementId = parseInt(req.params.id);
    db.one('SELECT * FROM traitement WHERE id = $1', traitementId)
      .then(function (data) {
        res.status(200)
          .json({
            status: 'success',
            data: data,
            message: 'Traitement trouvé'
          });
      })
      .catch(function (err) {
        return next(err);
      });
  }

  function getTraitementsByType(req, res, next) {
    var request;
    if(req.params.type===undefined) {
      request = db.any('SELECT * FROM traitement');
    } else {
      request = db.any('SELECT * FROM traitement WHERE type_traitement_id = $1', req.params.type);
    }
    request.then(function (data) {
        res.status(200)
          .json({
            status: 'success',
            data: data,
            message: 'Traitements trouvées'
          });
      })
      .catch(function (err) {
        return next(err);
      });
  }

  

  module.exports = {
    getTraitementById:getTraitementById,
    getTraitementsByType:getTraitementsByType
  };
  