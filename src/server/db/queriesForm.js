const db = require('./connection');

function createForm(req, res, next) {
  //chaine de test : curl --data "dateForm=20171212" http://127.0.0.1:3000/api/v1/newform/
  console.log('Creating form...');
  console.log(req.body);
  db.one('INSERT INTO formulaire(datetime_creation)' +
  'VALUES(to_timestamp(${dateForm})) RETURNING id', req.body)
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
  //chaine de test : curl -X PATCH --data "oncoForm=Gougis&idForm=17" http://127.0.0.1:3000/api/v1/updateform/
  console.log('Updating form...');
  console.log(req.body);
  db.none('UPDATE formulaire SET cancer_id=$organeForm, date_diagnostic=$diagnosticForm, stade_maladie=$etatForm, radio=$radioForm, date_naissance=$date_naissanceForm, oncologue_referent=$oncoForm WHERE id=$idForm', req.body)
  .then(function () {
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
