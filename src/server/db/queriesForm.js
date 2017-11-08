const db = require('./connection');

function createForm(req, res, next) {
  //chaine de test : curl --data "datetime_creation=2017-12-12" http://127.0.0.1:3000/api/v1/newform/
  console.log('createFormulaire');
  console.log(req.body);
  db.one('INSERT INTO formulaire(datetime_creation)' +
  'VALUES(${datetime_creation}) RETURNING id', req.body)
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

module.exports = {
  createForm:createForm
};
