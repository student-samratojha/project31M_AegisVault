const router = require('express').Router();
const { getRegister, postRegister,getLogin, postLogin, logout } = require('../controllers/auth.controller');
const { verifyToken } = require('../middleware/auth.middleware');
router.get('/register', getRegister);
router.post('/register', postRegister);
router.get('/login', getLogin);
router.post('/login', postLogin);
router.get('/logout',verifyToken, logout);
module.exports = router;