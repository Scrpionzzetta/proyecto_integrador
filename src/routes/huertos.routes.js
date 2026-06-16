const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middlewares/auth.middleware');
const { verificarRol } = require('../middlewares/roles.middleware');
const { 
  crearHuerto, 
  obtenerHuertos, 
  obtenerHuertoPorId, 
  editarHuerto, 
  eliminarHuerto,
  asignarTrabajador,
  desasignarTrabajador
} = require('../controllers/huertos.controller');

router.use(verificarToken);
router.post('/', verificarRol('admin', 'dueño'), crearHuerto);
router.get('/', verificarRol('admin', 'dueño'), obtenerHuertos);
router.get('/:id', verificarRol('admin', 'dueño'), obtenerHuertoPorId);
router.put('/:id', verificarRol('admin', 'dueño'), editarHuerto);
router.delete('/:id', verificarRol('admin'), eliminarHuerto);
router.post('/:id/asignar', verificarRol('admin', 'dueño'), asignarTrabajador);
router.post('/:id/desasignar', verificarRol('admin', 'dueño'), desasignarTrabajador);

module.exports = router;

