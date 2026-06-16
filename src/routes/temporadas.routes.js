const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middlewares/auth.middleware');
const { verificarRol } = require('../middlewares/roles.middleware');
const {
    crearTemporada,
    obtenerTemporadas,
    obtenerTemporadaPorId,
    cerrarTemporada,
    eliminarTemporada
} = require('../controllers/temporadas.controller');

router.use(verificarToken);
router.post('/', verificarRol('admin', 'dueño'), crearTemporada);
router.get('/', verificarRol('admin', 'dueño'), obtenerTemporadas);
router.get('/:id', verificarRol('admin', 'dueño'), obtenerTemporadaPorId);
router.put('/:id/cerrar', verificarRol('admin', 'dueño'), cerrarTemporada);
router.delete('/:id', verificarRol('admin', 'dueño'), eliminarTemporada);

module.exports = router;