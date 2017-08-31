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

  module.exports = {
    getTraitementById: getTraitementById
  };
  