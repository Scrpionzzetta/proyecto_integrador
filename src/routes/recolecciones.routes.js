const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middlewares/auth.middleware');
const { verificarRol } = require('../middlewares/roles.middleware');
const {
  registrarRecoleccion,
  obtenerRecolecciones,
  obtenerRecoleccionesPorTrabajador,
  obtenerRecoleccionesPorTemporada
} = require('../controllers/recolecciones.controller');

router.use(verificarToken);
router.post('/', verificarRol('admin', 'dueño'), registrarRecoleccion);
router.get('/', verificarRol('admin', 'dueño'), obtenerRecolecciones);
router.get('/trabajador/:trabajadorId', verificarRol('admin', 'dueño'), obtenerRecoleccionesPorTrabajador);
router.get('/temporada/:temporadaId', verificarRol('admin', 'dueño'), obtenerRecoleccionesPorTemporada);

module.exports = router;