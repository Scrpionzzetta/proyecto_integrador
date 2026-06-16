const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middlewares/auth.middleware');
const { verificarRol } = require('../middlewares/roles.middleware');
const { obtenerFicha, obtenerFichas } = require('../controllers/fichas.controller');

router.use(verificarToken);
router.get('/', verificarRol('admin', 'dueño'), obtenerFichas);
router.get('/:trabajadorId', verificarRol('admin', 'dueño'), obtenerFicha);

module.exports = router;