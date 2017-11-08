const express = require('express');
const router = express.Router();

const queriesForm = require('../db/queriesForm');

router.post('/newform/', queriesForm.createForm);

module.exports = router;
