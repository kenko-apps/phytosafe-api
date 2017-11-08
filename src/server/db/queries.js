const db = require('./connection');

//toutes les vérification des données entrée sont à faire.
function getTraitementById(req, res, next) {
  console.log('getTraitementById');
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
  console.log('getTraitementsByType');
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

function createPatient(req, res, next) {
  console.log('createPatient');
  db.one('INSERT INTO patient(datetime_inscription)' +
    'VALUES(to_timestamp($1)) RETURNING id', (Date.now() / 1000.0))
  .then(function (data) {
    res.status(200)
    .json({
      status: 'success',
      data: data,
      message: 'Nouveau patient créé'
    });
  })
  .catch(function (err) {
    return next(err);
  });
}

function createFormulaire(req, res, next) {
  //chaine de test : curl --data "oncologue_referent=Docteur%20Gougis&patient_id=1&cancer_id=SARCO" http://127.0.0.1:3000/api/v1/newformulaire
  console.log('createFormulaire');
  //oncologue_referent et patient_id peuvent être undéfinis, les autres champs sont obligatoires
  if (req.body.oncologue_referent === undefined) {
    req.body.oncologue_referent = '';
  }
  req.body.datetime_creation = (Date.now() / 1000.0);
  var request;
  if (req.body.patient_id === undefined) {
    //Dans ce cas, un seul insert
    request = db.one('INSERT INTO formulaire(oncologue_referent, cancer_id, datetime_creation)' +
    'VALUES(${oncologue_referent}, ${cancer_id}, to_timestamp(${datetime_creation}))' +
    'RETURNING id', req.body);
  } else {
    req.body.patient_id = parseInt(req.body.patient_id);
    // On doit faire 2 inserts. On fait une transaction pour ne pas salir la base :
    // tout est inséré ou rien n'est inséré
    request = db.tx('transaction createFormulaire', function(t) {
      return t.batch([
        // premier insert
        // La clause SELECT WHERE NOT EXISTS permet de gérer le cas ou le cancer est déjà ajouté pour ce patient
        // on pourrait gérer ce cas avec 'ON CONFLICT DO NOTHING' mais on pourrait rater d'autres erreurs
        t.none('INSERT INTO patient_has_cancer(patient_id, cancer_id)' +
        'SELECT ${patient_id}, ${cancer_id} WHERE NOT EXISTS' +
        '(SELECT 1 FROM patient_has_cancer WHERE patient_id = ${patient_id}' +
        'AND cancer_id = ${cancer_id})', req.body),
        //deuxième insert
        t.one('INSERT INTO formulaire(oncologue_referent, patient_id, cancer_id, datetime_creation)' +
        'VALUES(${oncologue_referent}, ${patient_id}, ${cancer_id}, to_timestamp(${datetime_creation}))' +
        'RETURNING id', req.body)
      ]);
    });
  }
  request.then(function (data) {
    res.status(200)
    .json({
      status: 'success',
      data: data,
      message: 'Formulaire inséré et cancer du patient mis à jour'
    });
  })
  .catch(function (err) {
    return next(err);
  });
}

module.exports = {
  getTraitementById:getTraitementById,
  getTraitementsByType:getTraitementsByType,
  createPatient:createPatient,
  createFormulaire:createFormulaire
};
