const express = require('express');
const router = express.Router();
const accountController = require('../controllers/account');

router.post('/register', accountController.register);
router.post('/login', accountController.login);
router.get('/account/:username', accountController.getAccount);
router.get('/user', accountController.getAllAccount);

module.exports = router;