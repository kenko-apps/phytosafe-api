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
      case 'dateForm':
        dataTable.datetime_creation = body.dateForm;
        break;
      case 'diagnosticForm':
        dataTable.date_diagnostic = body.diagnosticForm;
        break;
      case 'etatForm':
        dataTable.stade_maladie = body.etatForm;
        break;
      case 'radioForm':
        dataTable.radio = body.radioForm;
        break;
      case 'date_naissanceForm':
        dataTable.date_naissance = body.date_naissanceForm;
        break;
      case 'therapiesForm' :
        dataTable.therapies = body.therapiesForm;
        break;
      case 'phytoForm':
        dataTable.phyto = body.phytoForm;
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
    }
  }
  return dataTable;
}

function traitementUpdate(body) {
  var queryTable = [];
  class TraitementClass {
    constructor(formulaire_id, traitement_id, traitement_date) {
      this.formulaire_id = formulaire_id;
      this.traitement_id = traitement_id;
      this.traitement_date = traitement_date;
    }
  }
  if (!(body.traitementForm === undefined || body.traitementForm === 0)) {
    queryTable.push(new TraitementClass(body.idForm, body.traitementForm, body.date_traitementForm));
  }
  var i = 1;
  var i_nom = 'phytonom_' + i.toString() + '_Form';
  var i_date = 'phytodate_' + i.toString() + '_Form';
  var i_id = 'phytoid_' + i.toString() + '_Form';
  var checkProperty = body.hasOwnProperty(i_nom);
  while (checkProperty) {
    if (body[i_id] !== 0) {
      queryTable.push(new TraitementClass(body.idForm, body[i_id], body[i_date]));
    }
    i++;
    i_nom = 'phytonom_' + i.toString() + '_Form';
    i_date = 'phytodate_' + i.toString() + '_Form';
    i_id = 'phytoid_' + i.toString() + '_Form';
    checkProperty = body.hasOwnProperty(i_nom);
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
  if (body.traitementForm === 0) {
    diacritics.remplace(body.nom_traitementForm).split(' ').forEach(function(element) {
      queryTable.push(new EntryClass('traitementForm', 'traitement', element));
    });
    queryTable.push(new EntryClass('traitementForm', 'traitement', diacritics.remplace(body.nom_traitementForm)));
  }
  var i = 1;
  var i_nom = 'phytonom_' + i.toString() + '_Form';
  var i_date = 'phytodate_' + i.toString() + '_Form';
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
    i_date = 'phytodate_' + i.toString() + '_Form';
    i_id = 'phytoid_' + i.toString() + '_Form';
  }
  return queryTable;
}

function validateInformation(data, test) {
  var queryTable = [];
  class InfoClass {
    constructor(alias, id) {
      this.alias = alias;
      this.id = id;
    }
  }
  if (test) {
    queryTable.push(new InfoClass('cancer_id', data[0].cancer_id));
  }
  data[1].forEach(element => {
    queryTable.push(new InfoClass('traitement_id', element.traitement_id));
  });
  return queryTable;
}

function validateEffet(data, dataEffet) {
  var queryTable = [];
  var mergedTable = [].concat.apply([], dataEffet);
  let i = 1;
  class EffetClass {
    constructor(effet1, effet2, cancer) {
      this.effet1 = effet1;
      this.effet2 = effet2;
      this.cancer = cancer;
    }
  }
  mergedTable.forEach(element => {
    queryTable.push(new EffetClass(element.effet_id, null, data[0].cancer_id));
    while (i < mergedTable.length) {
      queryTable.push(new EffetClass(element.effet_id, mergedTable[i].effet_id, null));
      i++;
    }
  });
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
  validateInformation,
  validateEffet,
  bodyUpdate
};
