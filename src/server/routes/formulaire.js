const express = require('express');
const router = express.Router();

const queriesForm = require('../db/queriesForm');

router.post('/newform/', queriesForm.createForm);
router.patch('/updateform/', queriesForm.updateForm);
router.delete('/removeform/:id', queriesForm.removeForm);
router.get('/traitements/:type', queriesForm.getTraitementsByType);
router.get('/traitements/', queriesForm.getTraitementsByType);
router.get('/cancers/', queriesForm.getCancers);

module.exports = router;
