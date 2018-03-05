const db = require('./connection');
const pgp = require('pg-promise')({
  capSQL: true // if you want all generated SQL capitalized
});
const aideController = require('../controllers/aideBackEnd');
const diacritics = require('../controllers/diacritics');

function createForm(req, res, next) {
  //chaine de test : curl --data "dateForm=20171212&oncoForm=Gougis" http://127.0.0.1:3000/api/v1/newform/
  console.log('Creating form...');
  var queryTable = aideController.validateEntry(req.body);
  var request = db.task(t => {
    return t.one(pgp.helpers.insert(aideController.formulaireJoin(req.body),null,'formulaire') + 'RETURNING id').then(d => {
      req.body.idForm = d;
      if (queryTable.length > 0) {
        return t.batch(queryTable.map(q => {
          return t.oneOrNone('SELECT id AS $1:name FROM $2:name WHERE nom_simple = $3', [q.alias, q.table, q.nom]);
        })).then(data => {
          aideController.bodyUpdate(req.body,data);
          var queryTableBis = aideController.traitementUpdate(req.body);
          queryTableBis = queryTableBis.map(q => {
            // La clause SELECT WHERE NOT EXISTS permet de gérer le cas ou le traitement est déjà ajouté dans le formulaire
            t.none('INSERT INTO formulaire_has_traitement(formulaire_id, traitement_id, date_prise) SELECT $1, $2, $3 WHERE NOT EXISTS(SELECT 1 FROM formulaire_has_traitement WHERE formulaire_id = $1 AND traitement_id = $2)', [q.formulaire_id, q.traitement_id, q.traitement_date]);
          });
          queryTableBis.push(t.none(pgp.helpers.update(aideController.formulaireJoin(req.body),null,'formulaire') + 'WHERE id=' + req.body.idForm));
          return t.batch(queryTableBis).then(() => {
            return req.body.idForm;
          });
        });
      } else {
        console.log('SUPER');
        return req.body.idForm;
      }
    });
  });
  request.then(function (data) {
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

function createPatient(req, res, next) {
  //chaine de test : curl --data "emailForm=cedricallio@yahoo.fr" http://127.0.0.1:3000/api/v1/newpatient/
  console.log('Creating patient...');
  var request = db.task(t => {
    return t.oneOrNone('SELECT id AS $1:name FROM patient WHERE email = $3', ['patient_id', req.body.emailForm]).then(data => {
      if (data === null) {
        return t.one(pgp.helpers.insert({email: req.body.emailForm},null,'patient') + 'RETURNING id').then(d => {
          return t.none('INSERT INTO patient_has_formulaire(patient_id,formulaire_id) SELECT $1, $2 WHERE NOT EXISTS(SELECT 1 FROM patient_has_formulaire WHERE patient_id = $1 AND formulaire_id = $2)', [d, req.body.idForm]);
        });
      } else {
        return t.none('INSERT INTO patient_has_formulaire(patient_id,formulaire_id) SELECT $1, $2 WHERE NOT EXISTS(SELECT 1 FROM patient_has_formulaire WHERE patient_id = $1 AND formulaire_id = $2)', [data.patient_id, req.body.idForm]);
      }
    });
  });
  request.then(function () {
    res.status(200)
    .json({
      status: 'success',
      message: 'Lien patient/formulaire créé'
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
  var queryTable = aideController.validateEntry(req.body);
  var request = db.task(t => {
    if (queryTable.length > 0) {
      return t.batch(queryTable.map(q => {
        return t.oneOrNone('SELECT id AS $1:name FROM $2:name WHERE nom_simple = $3', [q.alias, q.table, q.nom]);
      })).then(data => {
        aideController.bodyUpdate(req.body,data);
        var queryTableBis = aideController.traitementUpdate(req.body);
        queryTableBis = queryTableBis.map(q => {
          // La clause SELECT WHERE NOT EXISTS permet de gérer le cas ou le traitement est déjà ajouté dans le formulaire
          t.none('INSERT INTO formulaire_has_traitement(formulaire_id, traitement_id, date_prise) SELECT $1, $2, $3 WHERE NOT EXISTS(SELECT 1 FROM formulaire_has_traitement WHERE formulaire_id = $1 AND traitement_id = $2)', [q.formulaire_id, q.traitement_id, q.traitement_date]);
        });
        queryTableBis.push(t.none(pgp.helpers.update(aideController.formulaireJoin(req.body),null,'formulaire') + 'WHERE id=' + req.body.idForm));
        return t.batch(queryTableBis);
      });
    } else {
      var queryTableBis = aideController.traitementUpdate(req.body);
      var queryTableTer = aideController.formulaireJoin(req.body);
      queryTableBis = queryTableBis.map(q => {
        // La clause SELECT WHERE NOT EXISTS permet de gérer le cas ou le traitement est déjà ajouté dans le formulaire
        t.none('INSERT INTO formulaire_has_traitement(formulaire_id, traitement_id, date_prise) SELECT $1, $2, $3 WHERE NOT EXISTS(SELECT 1 FROM formulaire_has_traitement WHERE formulaire_id = $1 AND traitement_id = $2)', [q.formulaire_id, q.traitement_id, q.traitement_date]);
      });
      if (!(Object.keys(queryTableTer).length === 0 && queryTableTer.constructor === Object)) {
        queryTableBis.push(t.none(pgp.helpers.update(queryTableTer,null,'formulaire') + 'WHERE id=' + req.body.idForm));
      }
      return t.batch(queryTableBis);
    }
  });
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

function getInfoForm(req, res, next) {
  console.log('Getting informations...');
  var request = db.task(t => {
    return t.batch([
      t.one('SELECT cancer_id FROM formulaire WHERE id=' + req.params.id),
      t.any('SELECT traitement_id FROM formulaire_has_traitement WHERE formulaire_id=' + req.params.id)]
    ).then(data => {
      var queryTable = aideController.validateInformation(data, true);
      return t.batch(queryTable.map(d => {
        if (d.alias === 'cancer_id') {
          return t.one('SELECT nom AS cancer_nom FROM cancer WHERE id = $1', [d.id]);
        } else {
          return t.one('SELECT nom AS traitement_nom, type_traitement_id AS traitement_type FROM traitement WHERE id = $1', [d.id]);
        }
      }));
    });
  });
  request.then(function (data) {
    res.status(200)
    .json({
      status: 'success',
      data: data,
      message: 'Informations récupérées'
    });
  })
  .catch(function (err) {
    return next(err);
  });
}

function getIncompatibilites(req, res, next) {
  console.log('Getting incompatibilities...');
  var request = db.task(t => {
    return t.batch([
      t.one('SELECT cancer_id FROM formulaire WHERE id=' + req.params.id),
      t.any('SELECT traitement_id FROM formulaire_has_traitement WHERE formulaire_id=' + req.params.id)]
    ).then(data => {
      var queryTable = aideController.validateInformation(data, false);
      return t.batch(queryTable.map(q => {
        if (q.alias === 'traitement_id') {
          return t.one('SELECT molecule_id FROM traitement_has_molecule WHERE traitement_id = $1', [q.id]);
        }
      })).then(dataMol => {
        return t.batch(dataMol.map(elt => {
          return t.any('SELECT effet_id FROM molecule_has_effet WHERE molecule_id = $1', [elt.molecule_id]);
        })).then(dataEffet => {
          var queryTableBis = aideController.validateEffet(data, dataEffet);
          return t.batch(queryTableBis.map(qbis => {
            console.log(qbis);
            if (qbis.effet2 === null && qbis.cancer === null) {
              console.log('juste effet 1');
              return t.oneOrNone('SELECT alerte_id FROM incompatibilite WHERE effet1_id = $1', [qbis.effet1]);
            } else if (qbis.effet2 === null) {
              console.log('juste effet 1 et effet 2');
              return t.oneOrNone('SELECT alerte_id FROM incompatibilite WHERE effet1_id = $1 AND cancer_id = $2', [qbis.effet1, qbis.cancer]);
            } else if (qbis.cancer === null) {
              console.log('juste effet 1 et cancer');
              return t.oneOrNone('SELECT alerte_id FROM incompatibilite WHERE effet1_id = $1 AND effet2_id = $2', [qbis.effet1, qbis.effet2]);
            } else {
              console.log('la totale');
              return t.oneOrNone('SELECT alerte_id FROM incompatibilite WHERE effet1_id = $1 AND effet2_id = $2 AND cancer_id = $3', [qbis.effet1, qbis.effet2, qbis.cancer]);
            }
          })).then(dataAlert => {
            return t.batch(dataAlert.map(qter => {
              console.log(qter);
              if (qter !== null) {
                return t.oneOrNone('SELECT texte, niveau_alerte_id FROM alerte WHERE id = $1', [qter.alerte_id]);
              }
            }));
          });
        });
      });
    });
  });
  request.then(function (data) {
    res.status(200)
    .json({
      status: 'success',
      data: data,
      message: 'Informations récupérées'
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
      message: 'Cancers trouvés'
    });
  })
  .catch(function (err) {
    return next(err);
  });
}

module.exports = {
  createForm:createForm,
  createPatient:createPatient,
  updateForm:updateForm,
  getInfoForm:getInfoForm,
  getIncompatibilites:getIncompatibilites,
  getTraitementsByType:getTraitementsByType,
  getCancers:getCancers
};
