const express = require('express');
const router = express.Router();
const accountController = require('../controllers/account');

router.post('/register', accountController.register);
router.post('/login', accountController.login);
router.get('/:username', accountController.getAccount);

module.exports = router;