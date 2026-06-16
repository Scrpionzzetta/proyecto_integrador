const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middlewares/auth.middleware');
const { verificarRol } = require('../middlewares/roles.middleware');
const { 
  obtenerTrabajadoresLibres,
  obtenerMisTrabajadores
} = require('../controllers/trabajadores.controller');

router.use(verificarToken);
router.get('/libres', verificarRol('admin', 'dueño'), obtenerTrabajadoresLibres);
router.get('/mis-trabajadores', verificarRol('admin', 'dueño'), obtenerMisTrabajadores);

module.exports = router;