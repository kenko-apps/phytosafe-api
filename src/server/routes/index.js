const express = require('express');
const router = express.Router();

const indexController = require('../controllers/index');
const queries = require('../db/queries');

router.get('/', function (req, res, next) {
  const renderObject = {};
  renderObject.title = 'Welcome to Express!';
  indexController.sum(1, 2, (error, results) => {
    if (error) return next(error);
    if (results) {
      renderObject.sum = results;
      res.render('index', renderObject);
    }
  });
});
router.get('/api/v1/traitement/:id', queries.getTraitementById);
router.get('/api/v1/traitements/:type', queries.getTraitementsByType);
router.get('/api/v1/traitements/', queries.getTraitementsByType);
router.get('/api/v1/newpatient/', queries.createPatient);
router.post('/api/v1/newformulaire/', queries.createFormulaire);

module.exports = router;
