const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middlewares/auth.middleware');
const { verificarRol } = require('../middlewares/roles.middleware');
const { 
  obtenerTrabajadoresLibres,
  obtenerMisTrabajadores
} = require('../controllers/trabajadores.controller');

router.use(verificarToken);

// GET /trabajadores/libres → trabajadores sin huerto asignado
router.get('/libres', verificarRol('admin', 'dueño'), obtenerTrabajadoresLibres);

// GET /trabajadores/mis-trabajadores → trabajadores de mis huertos
router.get('/mis-trabajadores', verificarRol('admin', 'dueño'), obtenerMisTrabajadores);

module.exports = router;