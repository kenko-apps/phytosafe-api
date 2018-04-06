const db = require('./connection');
const pgp = require('pg-promise')({
  capSQL: true // if you want all generated SQL capitalized
});
const aideController = require('../controllers/aideBackEnd');
const diacritics = require('../controllers/diacritics');

/**
 * Fonction qui permet de créer un formulaire coté serveur.
 * Elle récupère la date et l'heure du formulaire, ainsi que la géolocalisation (si possible) du patient.
 * Une fois le formulaire créé, elle renvoie un identifiant pour le formulaire (identifiant de la table formulaire).
 * @method createForm
 * @requires controllers/aideBackEnd - la fonction utilise les méthodes validateEntry, bodyUpdate, traitementUpdate, formulaireJoin, traitementProblem.
 * @param {Object} - req, res, next sont les objets à passer en paramètres de la fonction.
 * @returns {Object} - Un objet avec l'identifiant du formulaire est retourné par la fonction.
 */
function createForm(req, res, next) {
  //chaine de test : curl --data "dateForm=20171212&radioForm=oui" http://127.0.0.1:3000/api/v1/newform/
  //console.log('Creating form...');
  var request = db.task(t => {
    return t.one(pgp.helpers.insert(aideController.formulaireJoin(req.body),null,'formulaire') + 'RETURNING id').then(d => {
      req.body.idForm = d.id;
      //Création d'un tableau préparant la requête sur les organes/traitements qui n'ont pas d'identifiant
      var queryTable = aideController.validateEntry(req.body);
      if (queryTable.length > 0) {
        return t.batch(queryTable.map(q => {
          return t.oneOrNone('SELECT id AS $1:name FROM $2:name WHERE nom_simple = $3', [q.alias, q.table, q.nom]);
        })).then(data => {
          aideController.bodyUpdate(req.body,data);
          //Pour les traitements qui n'ont pas d'identifiants, une requête dans la table "traitement" est nécessaire pour aller chercher "autres_ttcan" ou "autres_phyto".
          var queryTableBis = aideController.traitementProblem(req.body);
          if (queryTableBis.length > 0) {
            return t.batch(queryTableBis.map(q => {
              return t.oneOrNone('SELECT id AS $1:name FROM traitement WHERE nom = $2', [q.alias, q.nom]);
            })).then(databis => {
              // Mise à jour du body avec les identifiants trouvés (correspondant aux entrées du patient)
              aideController.bodyUpdate(req.body,databis);
              var queryTableTer = aideController.traitementUpdate(req.body);
              var queryTableQuatro = aideController.formulaireJoin(req.body);
              queryTableTer = queryTableTer.map(q => {
                // La clause SELECT WHERE NOT EXISTS permet de gérer le cas ou le traitement est déjà ajouté dans le formulaire
                t.none('INSERT INTO formulaire_has_traitement(formulaire_id, traitement_id, traitement_nom) SELECT $1, $2, $3 WHERE NOT EXISTS(SELECT 1 FROM formulaire_has_traitement WHERE formulaire_id = $1 AND traitement_id = $2  AND traitement_nom = $3)', [q.formulaire_id, q.traitement_id, q.traitement_nom]);
              });
              if (!(Object.keys(queryTableQuatro).length === 0 && queryTableQuatro.constructor === Object)) {
                queryTableTer.push(t.none(pgp.helpers.update(queryTableQuatro,null,'formulaire') + ' WHERE id =' + req.body.idForm));
              }
              return t.batch(queryTableTer).then(() => {
                return req.body.idForm;
              });
            });
          } else {
            aideController.bodyUpdate(req.body,data);
            var queryTableTer = aideController.traitementUpdate(req.body);
            var queryTableQuatro = aideController.formulaireJoin(req.body);
            queryTableTer = queryTableTer.map(q => {
              // La clause SELECT WHERE NOT EXISTS permet de gérer le cas ou le traitement est déjà ajouté dans le formulaire
              t.none('INSERT INTO formulaire_has_traitement(formulaire_id, traitement_id, traitement_nom) SELECT $1, $2, $3 WHERE NOT EXISTS(SELECT 1 FROM formulaire_has_traitement WHERE formulaire_id = $1 AND traitement_id = $2  AND traitement_nom = $3)', [q.formulaire_id, q.traitement_id, q.traitement_nom]);
            });
            if (!(Object.keys(queryTableQuatro).length === 0 && queryTableQuatro.constructor === Object)) {
              queryTableTer.push(t.none(pgp.helpers.update(queryTableQuatro,null,'formulaire') + ' WHERE id =' + req.body.idForm));
            }
            return t.batch(queryTableTer).then(() => {
              return req.body.idForm;
            });
          }
        });
      } else {
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

function removeForm(req, res, next) {
  //console.log('Removing form...');
  var request;
  if (req.params.id !== undefined) {
    request = db.task(t => {
      return t.none('DELETE FROM formulaire_has_traitement WHERE formulaire_id = $1', req.params.id).then(() => {
        return t.none('DELETE FROM formulaire WHERE id = $1', req.params.id);
      });
    });
  }
  request.then(function () {
    res.status(200)
    .json({
      status: 'success',
      message: 'Formulaire supprimé'
    });
  })
  .catch(function (err) {
    return next(err);
  });
}

function updateForm(req, res, next) {
  //chaine de test : curl -X PATCH --data "organeForm=sein&etatForm=tumeurlocale&radioForm=oui&date_naissanceForm=1977-12-12&idForm=17" http://127.0.0.1:3000/api/v1/updateform/
  //console.log('Updating form...');
  var queryTable = aideController.validateEntry(req.body);
  var request = db.task(t => {
    if (queryTable.length > 0) {
      return t.batch(queryTable.map(q => {
        return t.oneOrNone('SELECT id AS $1:name FROM $2:name WHERE nom_simple = $3', [q.alias, q.table, q.nom]);
      })).then(data => {
        aideController.bodyUpdate(req.body,data);
        var queryTableBis = aideController.traitementProblem(req.body);
        if (queryTableBis.length > 0) {
          return t.batch(queryTableBis.map(q => {
            return t.oneOrNone('SELECT id AS $1:name FROM traitement WHERE nom = $2', [q.alias, q.nom]);
          })).then(databis => {
            aideController.bodyUpdate(req.body,databis);
            var queryTableTer = aideController.traitementUpdate(req.body);
            var queryTableQuatro = aideController.formulaireJoin(req.body);
            queryTableTer = queryTableTer.map(q => {
              // La clause SELECT WHERE NOT EXISTS permet de gérer le cas ou le traitement est déjà ajouté dans le formulaire
              t.none('INSERT INTO formulaire_has_traitement(formulaire_id, traitement_id, traitement_nom) SELECT $1, $2, $3 WHERE NOT EXISTS(SELECT 1 FROM formulaire_has_traitement WHERE formulaire_id = $1 AND traitement_id = $2  AND traitement_nom = $3)', [q.formulaire_id, q.traitement_id, q.traitement_nom]);
            });
            if (!(Object.keys(queryTableQuatro).length === 0 && queryTableQuatro.constructor === Object)) {
              queryTableTer.push(t.none(pgp.helpers.update(queryTableQuatro,null,'formulaire') + ' WHERE id =' + req.body.idForm));
            }
            return t.batch(queryTableTer);
          });
        } else {
          aideController.bodyUpdate(req.body,data);
          var queryTableTer = aideController.traitementUpdate(req.body);
          var queryTableQuatro = aideController.formulaireJoin(req.body);
          queryTableTer = queryTableTer.map(q => {
            // La clause SELECT WHERE NOT EXISTS permet de gérer le cas ou le traitement est déjà ajouté dans le formulaire
            t.none('INSERT INTO formulaire_has_traitement(formulaire_id, traitement_id, traitement_nom) SELECT $1, $2, $3 WHERE NOT EXISTS(SELECT 1 FROM formulaire_has_traitement WHERE formulaire_id = $1 AND traitement_id = $2  AND traitement_nom = $3)', [q.formulaire_id, q.traitement_id, q.traitement_nom]);
          });
          if (!(Object.keys(queryTableQuatro).length === 0 && queryTableQuatro.constructor === Object)) {
            queryTableTer.push(t.none(pgp.helpers.update(queryTableQuatro,null,'formulaire') + ' WHERE id =' + req.body.idForm));
          }
          return t.batch(queryTableTer);
        }
      });
    } else {
      var queryTableBis = aideController.traitementUpdate(req.body);
      var queryTableTer = aideController.formulaireJoin(req.body);
      queryTableBis = queryTableBis.map(q => {
        // La clause SELECT WHERE NOT EXISTS permet de gérer le cas ou le traitement est déjà ajouté dans le formulaire
        t.none('INSERT INTO formulaire_has_traitement(formulaire_id, traitement_id, traitement_nom) SELECT $1, $2, $3 WHERE NOT EXISTS(SELECT 1 FROM formulaire_has_traitement WHERE formulaire_id = $1 AND traitement_id = $2  AND traitement_nom = $3)', [q.formulaire_id, q.traitement_id, q.traitement_nom]);
      });
      if (!(Object.keys(queryTableTer).length === 0 && queryTableTer.constructor === Object)) {
        queryTableBis.push(t.none(pgp.helpers.update(queryTableTer,null,'formulaire') + ' WHERE id =' + req.body.idForm));
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

function getTraitementsByType(req, res, next) {
  //console.log('Getting treatments...');
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
  //console.log('Getting cancers...');
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
  updateForm:updateForm,
  removeForm:removeForm,
  getTraitementsByType:getTraitementsByType,
  getCancers:getCancers
};
