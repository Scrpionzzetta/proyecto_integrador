const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middlewares/auth.middleware');
const { verificarRol } = require('../middlewares/roles.middleware');
const {
  calcularPago,
  registrarPago,
  obtenerPagos,
  obtenerPagosPorTrabajador
} = require('../controllers/pagos.controller');

router.use(verificarToken);
router.post('/calcular', verificarRol('admin', 'dueño'), calcularPago);
router.post('/', verificarRol('admin', 'dueño'), registrarPago);
router.get('/', verificarRol('admin', 'dueño'), obtenerPagos);
router.get('/trabajador/:trabajadorId', verificarRol('admin', 'dueño'), obtenerPagosPorTrabajador);

module.exports = router;