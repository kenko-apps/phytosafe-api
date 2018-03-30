/*jshint loopfunc: true */
const diacritics = require('./diacritics');

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
        if (typeof body.etatForm === 'string' && /^([a-zA-Zéèêëàäâùüûïîöôçÿ\u0152\u0153 ]*)$/.test(body.etatForm)) {
          dataTable.stade_maladie = body.etatForm;
        }
        break;
      case 'radioForm':
        if (typeof body.radioForm === 'string' && /^([a-zA-Zéèêëàäâùüûïîöôçÿ\u0152\u0153 ]*)$/.test(body.radioForm)) {
          dataTable.radio = body.radioForm;
        }
        break;
      case 'chirurgieForm':
        if (typeof body.chirurgieForm === 'string' && /^([a-zA-Zéèêëàäâùüûïîöôçÿ\u0152\u0153 ]*)$/.test(body.chirurgieForm)) {
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

function validateEntry(body) {
  var queryTable = [];
  class EntryClass {
    constructor(alias, table, nom) {
      this.alias = alias;
      this.table = table;
      this.nom = nom;
    }
  }
  if (body.organeForm === 'AUCUN') {
    diacritics.remplace(body.nom_organeForm).split(' ').forEach(function(element) {
      queryTable.push(new EntryClass('organeForm', 'cancer', element));
    });
    queryTable.push(new EntryClass('organeForm', 'cancer', diacritics.remplace(body.nom_organeForm)));
  }
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
