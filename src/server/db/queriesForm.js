const db = require('./connection');
const pgp = require('pg-promise')({
  capSQL: true // if you want all generated SQL capitalized
});
const aideController = require('../controllers/aideBackEnd');

function createForm(req, res, next) {
  //chaine de test : curl --data "dateForm=20171212&oncoForm=Gougis" http://127.0.0.1:3000/api/v1/newform/
  console.log('Creating form...');
  const query = pgp.helpers.concat(aideController.traitementPrepare(req.body));
  db.task(function(t) {
    return t.one(pgp.helpers.insert(aideController.formulaireJoin(req.body),null,'formulaire') + 'RETURNING id')
    .then(function(data) {
      if (query !== '') {
        t.none(query);
      }
      return data ;
    });
  })
  .then(function (data) {
    res.status(200)
    .json({
      status: 'success',
      data: data,
      message: 'Nouveau formulaire créé'
    });
  })
  .catch(function (err) {
    return next(err);
  });
}

function updateForm(req, res, next) {
  //chaine de test : curl -X PATCH --data "organeForm=sein&diagnosticForm=2017-12-12&etatForm=tumeurlocale&radio=oui&date_naissanceForm=1977-12-12&oncoForm=Gougis&idForm=17" http://127.0.0.1:3000/api/v1/updateform/
  //chaine de test : curl -X PATCH --data "oncoForm=Gougis&idForm=83" http://127.0.0.1:3000/api/v1/updateform/
  console.log('Updating form...');
  const query = pgp.helpers.concat(aideController.traitementPrepare(req.body));
  var request;
  if (!(query === '' || Object.keys(aideController.formulaireJoin(req.body)).length === 0)) {
    request = db.tx('transaction updateForm', function(t) {
      return t.batch([
        // premier requête
        t.none(query),
        //deuxième requête
        t.none(pgp.helpers.update(aideController.formulaireJoin(req.body),null,'formulaire') + 'WHERE id=' + req.body.idForm)
      ]);
    });
  } else {
    if (query === '') {
      request = db.none(pgp.helpers.update(aideController.formulaireJoin(req.body),null,'formulaire') + 'WHERE id=' + req.body.idForm);
    } else {
      request = db.none(query);
    }
  }
  request.then(function () {
    res.status(200)
    .json({
      status: 'success',
      message: 'Formulaire mis à jour'
    });
  })
  .catch(function (err) {
    return next(err);
  });
}

function getTraitementsByType(req, res, next) {
  console.log('Getting treatments...');
  var request;
  if (req.params.type === undefined) {
    request = db.many('SELECT * FROM traitement');
  } else {
    request = db.many('SELECT * FROM traitement WHERE type_traitement_id = $1', req.params.type);
  }
  request.then(function (data) {
    res.status(200)
    .json({
      status: 'success',
      data: data,
      message: 'Traitements trouvés'
    });
  })
  .catch(function (err) {
    return next(err);
  });
}

function getCancers(req, res, next) {
  console.log('Getting cancers...');
  db.many('SELECT * FROM cancer')
  .then(function (data) {
    res.status(200)
    .json({
      status: 'success',
      data: data,
      message: 'Traitements trouvés'
    });
  })
  .catch(function (err) {
    return next(err);
  });
}

module.exports = {
  createForm:createForm,
  updateForm:updateForm,
  getTraitementsByType:getTraitementsByType,
  getCancers:getCancers
};
