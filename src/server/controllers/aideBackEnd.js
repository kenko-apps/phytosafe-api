/*jshint loopfunc: true */
const diacritics = require('./diacritics');

/**
 * Fonction qui vérifie toutes les entrées envoyées par la requête (body au format JSON).
 * Elle regarde le type de chaque variable et la confronte au format (REGEX) attendu.
 * @method formulaireJoin
 * @param {Object} - le body de la requête, qui est au format JSON, est passé en paramètre de la fonction.
 * @returns {Object} - Un objet JSON avec les données qui ont passées le test.
 */
function formulaireJoin(body) {
  var dataTable = {};
  for (var propertyName in body) {
    switch (propertyName){
      case 'oncoForm':
        if (typeof body.oncoForm === 'string' && /^([0-9a-zA-Zéèêëàäâùüûïîöôçÿ\u0152\u0153\- \'\(\)\.]*)$/.test(body.oncoForm)) {
          dataTable.oncologue_referent = body.oncoForm;
        }
        break;
      case 'organeForm':
        if (typeof body.organeForm === 'string' && /^([A-Z ]{0,5})$/.test(body.organeForm)) {
          dataTable.cancer_id = body.organeForm;
        }
        break;
      case 'nom_organeForm':
        if (typeof body.nom_organeForm === 'string' && /^([0-9a-zA-Zéèêëàäâùüûïîöôçÿ\u0152\u0153\- \'\(\)]*)$/.test(body.nom_organeForm)) {
          dataTable.cancer_nom = body.nom_organeForm;
        }
        break;
      case 'dateForm':
        if (typeof body.dateForm === 'string') {
          dataTable.datetime_creation = body.dateForm;
        }
        break;
      case 'etatForm':
        if (typeof body.etatForm === 'string' && /^([a-zA-Zéèêëàäâùüûïîöôçÿ\u0152\u0153 \']*)$/.test(body.etatForm)) {
          dataTable.stade_maladie = body.etatForm;
        }
        break;
      case 'radioForm':
        if (typeof body.radioForm === 'string' && /^([a-zA-Zéèêëàäâùüûïîöôçÿ\u0152\u0153 \']*)$/.test(body.radioForm)) {
          dataTable.radio = body.radioForm;
        }
        break;
      case 'chirurgieForm':
        if (typeof body.chirurgieForm === 'string' && /^([a-zA-Zéèêëàäâùüûïîöôçÿ\u0152\u0153 \']*)$/.test(body.chirurgieForm)) {
          dataTable.chirurgie = body.chirurgieForm;
        }
        break;
      case 'date_naissanceForm':
        if (typeof body.date_naissanceForm === 'string' && /^([0-9]{2,3})$/.test(body.date_naissanceForm)) {
          dataTable.age = body.date_naissanceForm;
        }
        break;
      case 'phytoForm':
        if (typeof body.phytoForm === 'boolean') {
          dataTable.phyto = body.phytoForm;
        }
        break;
      case 'boissonForm':
        if (typeof body.boissonForm === 'boolean') {
          dataTable.boisson_phyto = body.boissonForm;
        }
        break;
      case 'vitamineForm':
        if (typeof body.vitamineForm === 'boolean') {
          dataTable.complement_phyto = body.vitamineForm;
        }
        break;
      case 'homeoForm' :
        if (typeof body.homeoForm === 'boolean') {
          dataTable.homeo = body.homeoForm;
        }
        break;
      case 'aromaForm' :
        if (typeof body.aromaForm === 'boolean') {
          dataTable.aroma = body.aromaForm;
        }
        break;
      case 'autresForm' :
        if (typeof body.autresForm === 'string' && /^([0-9a-zA-Zéèêëàäâùüûïîöôçÿ\u0152\u0153\- \'\(\)]*)$/.test(body.autresForm)) {
          dataTable.autres = body.autresForm;
        }
        break;
      case 'sexeForm' :
        if (typeof body.sexeForm === 'string' && (/^(homme)$/i.test(body.sexeForm) || /^(femme)$/i.test(body.sexeForm))) {
          dataTable.sexe = body.sexeForm;
        }
        break;
      case 'tabacForm' :
        if (body.tabacForm === 'oui') {
          dataTable.tabac = true;
        } else {
          dataTable.tabac = false;
        }
        break;
      case 'frequenceForm' :
        if (typeof body.frequenceForm === 'string' && /^([0-9\-<>]*)$/.test(body.frequenceForm)) {
          dataTable.frequence_tabac = body.frequenceForm;
        }
        break;
      case 'cannabisForm' :
        if (body.cannabisForm === 'oui') {
          dataTable.cannabis = true;
        } else {
          dataTable.cannabis = false;
        }
        break;
      case 'latitudeForm' :
        if (typeof body.latitudeForm === 'number') {
          dataTable.latitude = body.latitudeForm;
        }
        break;
      case 'longitudeForm' :
        if (typeof body.longitudeForm === 'number') {
          dataTable.longitude = body.longitudeForm;
        }
        break;
      case 'accordForm':
        if (typeof body.accordForm === 'boolean') {
          dataTable.accord = body.accordForm;
        }
        break;
      case 'raisonRefusForm':
        if (typeof body.raisonRefusForm === 'string' && /^([a-zA-Zéèêëàäâùüûïîöôçÿ\u0152\u0153 \']*)$/.test(body.raisonRefusForm)) {
          dataTable.raison_refus = body.raisonRefusForm;
        }
        break;
      case 'alimentsForm':
        if (typeof body.alimentsForm === 'string' && /^([0-9a-zA-Zéèêëàäâùüûïîöôçÿ\u0152\u0153\- \'\(\)]*)$/.test(body.alimentsForm)) {
          dataTable.aliments = body.alimentsForm;
        }
        break;
      case 'fruitsForm':
        if (typeof body.fruitsForm === 'string' && /^([0-9a-zA-Zéèêëàäâùüûïîöôçÿ\u0152\u0153\- \'\(\)]*)$/.test(body.fruitsForm)) {
          dataTable.fruits = body.fruitsForm;
        }
        break;
      case 'centerForm':
        if (typeof body.centerForm === 'string' && /^([a-zA-Zéèêëàäâùüûïîöôçÿ\u0152\u0153 \']*)$/.test(body.centerForm)) {
          dataTable.centre = body.centerForm;
        }
        break;
    }
  }
  return dataTable;
}

function traitementUpdate(body) {
  var queryTable = [];
  class TraitementClass {
    constructor(formulaire_id, traitement_id, traitement_nom) {
      this.formulaire_id = formulaire_id;
      this.traitement_id = traitement_id;
      this.traitement_nom = traitement_nom;
    }
  }
  var j = 1;
  var j_nom = 'traitementnom_' + j.toString() + '_Form';
  var j_id = 'traitementid_' + j.toString() + '_Form';
  var checkPropertyJ = body.hasOwnProperty(j_nom);
  while (checkPropertyJ) {
    queryTable.push(new TraitementClass(body.idForm, body[j_id], body[j_nom]));
    j++;
    j_nom = 'traitementnom_' + j.toString() + '_Form';
    j_id = 'traitementid_' + j.toString() + '_Form';
    checkPropertyJ = body.hasOwnProperty(j_nom);
  }
  var i = 1;
  var i_nom = 'phytonom_' + i.toString() + '_Form';
  var i_id = 'phytoid_' + i.toString() + '_Form';
  var checkPropertyI = body.hasOwnProperty(i_nom);
  while (checkPropertyI) {
    queryTable.push(new TraitementClass(body.idForm, body[i_id], body[i_nom]));
    i++;
    i_nom = 'phytonom_' + i.toString() + '_Form';
    i_id = 'phytoid_' + i.toString() + '_Form';
    checkPropertyI = body.hasOwnProperty(i_nom);
  }
  return queryTable;
}

/**
 * Fonction qui, pour les traitements anti-cancéreux et phyto qui n'ont pas d'identifiants dans la table "traitement", prépare les requêtes qui vont chercher les identifiant corresponsant aux entrées "autres_ttcan" et "autres_phyto" de la table "traitement".
 * Elle créé un tableau qui prépare les requêtes.
 * @method traitementProblem
 * @param {Object} - le body de la requête, qui est au format JSON, est passé en paramètre de la fonction.
 * @returns {Array} - Un tableau avec le nom de l'entrée et la table où l'entrée devrait exister ("traitement").
 */
function traitementProblem(body) {
  var queryTable = [];
  class ProblemClass {
    constructor(alias, nom) {
      this.alias = alias;
      this.nom = nom;
    }
  }
  var j = 1;
  var j_id = 'traitementid_' + j.toString() + '_Form';
  var checkPropertyJ = body.hasOwnProperty(j_id);
  while (checkPropertyJ) {
    if (body[j_id] === 0) {
      queryTable.push(new ProblemClass(j_id, 'autres_ttcan'));
    }
    j++;
    j_id = 'traitementid_' + j.toString() + '_Form';
    checkPropertyJ = body.hasOwnProperty(j_id);
  }
  var i = 1;
  var i_id = 'phytoid_' + i.toString() + '_Form';
  var checkPropertyI = body.hasOwnProperty(i_id);
  while (checkPropertyI) {
    if (body[i_id] === 0) {
      queryTable.push(new ProblemClass(i_id, 'autres_phyto'));
    }
    i++;
    i_id = 'phytoid_' + i.toString() + '_Form';
    checkPropertyI = body.hasOwnProperty(i_id);
  }
  return queryTable;
}

/**
 * Fonction qui vérifie que les organes/traitements du formulaire envoyé ont un identifiant dans les tables "traitement" et "cancer".
 * Elle créé un tableau avec les organes/traitements du formulaire envoyé qui n'ont pas d'identifiants.
 * @method validateEntry
 * @param {Object} - le body de la requête, qui est au format JSON, est passé en paramètre de la fonction.
 * @returns {Array} - Un tableau avec le nom de l'entrée, la table où l'entrée devrait exister ("traitement" ou "cancer"), et un alias qui correspond au nom de la variable.
 */
function validateEntry(body) {
  var queryTable = [];
  //Création d'une classe avec un alias (qui correspond à la variable traitée), la table où trouver la variable (si possible) et le nom de la vairable entrée par le patient.
  class EntryClass {
    constructor(alias, table, nom) {
      this.alias = alias;
      this.table = table;
      this.nom = nom;
    }
  }
  //Vérification de l'organe
  if (body.organeForm === 'AUCUN') {
    diacritics.remplace(body.nom_organeForm).split(' ').forEach(function(element) {
      queryTable.push(new EntryClass('organeForm', 'cancer', element));
    });
    queryTable.push(new EntryClass('organeForm', 'cancer', diacritics.remplace(body.nom_organeForm)));
  }
  //Vérification du traitement anti-cancéreux
  var j = 1;
  var j_nom = 'traitementnom_' + j.toString() + '_Form';
  var j_id = 'traitementid_' + j.toString() + '_Form';
  while (body.hasOwnProperty(j_nom)) {
    if (body[j_id] === 0) {
      diacritics.remplace(body[j_nom]).split(' ').forEach(function(element) {
        queryTable.push(new EntryClass(j_id, 'traitement', element));
      });
      queryTable.push(new EntryClass(j_id, 'traitement', diacritics.remplace(body[j_nom])));
    }
    j++;
    j_nom = 'traitementnom_' + j.toString() + '_Form';
    j_id = 'traitementid_' + j.toString() + '_Form';
  }
  //Vérification du traitement phyto
  var i = 1;
  var i_nom = 'phytonom_' + i.toString() + '_Form';
  var i_id = 'phytoid_' + i.toString() + '_Form';
  while (body.hasOwnProperty(i_nom)) {
    if (body[i_id] === 0) {
      diacritics.remplace(body[i_nom]).split(' ').forEach(function(element) {
        queryTable.push(new EntryClass(i_id, 'traitement', element));
      });
      queryTable.push(new EntryClass(i_id, 'traitement', diacritics.remplace(body[i_nom])));
    }
    i++;
    i_nom = 'phytonom_' + i.toString() + '_Form';
    i_id = 'phytoid_' + i.toString() + '_Form';
  }
  return queryTable;
}

/**
 * Fonction qui met à jour la requête (body) avec les valeurs du tableau data passé à la fonction.
 * Elle vérifie que les entrées du tableau ne sont pas nulles.
 * @method formulaireJoin
 * @param {Object, Array} - le body de la requête, qui est au format JSON, ainsi que le tableau avec les variables à modifier sont passées en paramètre de la fonction.
 * @returns {} - Aucune valeur n'est retournées par la fonction.
 */
function bodyUpdate(body,data) {
  data.forEach(function(element) {
    var propertyName;
    if (element !== null) {
      propertyName = Object.getOwnPropertyNames(element)[0];
      body[propertyName] = element[propertyName];
    }
  });
}

module.exports = {
  formulaireJoin,
  traitementUpdate,
  traitementProblem,
  validateEntry,
  bodyUpdate
};
