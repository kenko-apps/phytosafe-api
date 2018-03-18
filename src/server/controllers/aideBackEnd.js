/*jshint loopfunc: true */
const diacritics = require('./diacritics');

function formulaireJoin(body) {
  var dataTable = {};
  for (var propertyName in body) {
    switch (propertyName){
      case 'oncoForm':
        dataTable.oncologue_referent = body.oncoForm;
        break;
      case 'organeForm':
        dataTable.cancer_id = body.organeForm;
        break;
      case 'nom_organeForm':
        dataTable.cancer_nom = body.nom_organeForm;
        break;
      case 'dateForm':
        dataTable.datetime_creation = body.dateForm;
        break;
      case 'etatForm':
        dataTable.stade_maladie = body.etatForm;
        break;
      case 'radioForm':
        dataTable.radio = body.radioForm;
        break;
      case 'chirurgieForm':
        dataTable.chirurgie = body.chirurgieForm;
        break;
      case 'date_naissanceForm':
        dataTable.date_naissance = body.date_naissanceForm;
        break;
      case 'phytoForm':
        dataTable.phyto = body.phytoForm;
        break;
      case 'boissonForm':
        dataTable.boisson_phyto = body.boissonForm;
        break;
      case 'vitamineForm':
        dataTable.complement_phyto = body.vitamineForm;
        break;
      case 'homeoForm' :
        dataTable.homeo = body.homeoForm;
        break;
      case 'aromaForm' :
        dataTable.aroma = body.aromaForm;
        break;
      case 'autresForm' :
        dataTable.autres = body.autresForm;
        break;
      case 'sexeForm' :
        dataTable.sexe = body.sexeForm;
        break;
      case 'tabacForm' :
        if (body.tabacForm === 'oui') {
          dataTable.tabac = true;
        } else {
          dataTable.tabac = false;
        }
        break;
      case 'frequenceForm' :
        dataTable.frequence_tabac = body.frequenceForm;
        break;
      case 'latitudeForm' :
        dataTable.latitude = body.latitudeForm;
        break;
      case 'longitudeForm' :
        dataTable.longitude = body.longitudeForm;
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
  validateEntry,
  bodyUpdate
};
