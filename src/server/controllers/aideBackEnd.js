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

function traitementPrepare(body) {
  var queryTable = [];
  if (!(body.traitementForm === undefined || body.traitementForm === 0)) {
    queryTable.push('INSERT INTO formulaire_has_traitement(formulaire_id, traitement_id) SELECT ' +
    body.idForm + ', ' + body.traitementForm + ' WHERE NOT EXISTS' +
    '(SELECT 1 FROM formulaire_has_traitement WHERE formulaire_id = ' + body.idForm +
    ' AND traitement_id = ' + body.traitementForm + ')');
  }
  var i = 1;
  var i_nom = 'phytonom_' + i.toString() + '_Form';
  var i_date = 'phytodate_' + i.toString() + '_Form';
  var i_id = 'phytoid_' + i.toString() + '_Form';
  var checkProperty = body.hasOwnProperty(i_nom);
  while (checkProperty) {
    if (body[i_id] !== 0) {
      // La clause SELECT WHERE NOT EXISTS permet de gérer le cas ou le traitement est déjà ajouté dans le formulaire
      queryTable.push('INSERT INTO formulaire_has_traitement(formulaire_id, traitement_id, date_prise) SELECT ' +
      body.idForm + ', ' + body[i_id] +  ', to_timestamp(' + body[i_date] + ') WHERE NOT EXISTS' +
      '(SELECT 1 FROM formulaire_has_traitement WHERE formulaire_id = ' + body.idForm +
      ' AND traitement_id = ' + body[i_id] + ')');
    }
    i++;
    i_nom = 'phytonom_' + i.toString() + '_Form';
    i_date = 'phytodate_' + i.toString() + '_Form';
    i_id = 'phytoid_' + i.toString() + '_Form';
    checkProperty = body.hasOwnProperty(i_nom);
  }
  return queryTable;
}

module.exports = {
  formulaireJoin,
  traitementPrepare
};
