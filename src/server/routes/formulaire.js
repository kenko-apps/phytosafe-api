const express = require('express');
const router = express.Router();

const queriesForm = require('../db/queriesForm');

router.post('/newform/', queriesForm.createForm);
router.patch('/updateform/', queriesForm.updateForm);
router.get('/traitements/:type', queriesForm.getTraitementsByType);
router.get('/informations/:id', queriesForm.getInfoForm);
router.get('/incompatibilites/:id', queriesForm.getIncompatibilites);
router.get('/traitements/', queriesForm.getTraitementsByType);
router.get('/cancers/', queriesForm.getCancers);
router.post('/newpatient/', queriesForm.createPatient);

module.exports = router;
