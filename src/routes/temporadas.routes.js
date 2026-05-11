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

// Todas las rutas requieren autenticacion
router.use(verificarToken);

// POST /temporadas - crear temporada
router.post('/', verificarRol('admin', 'dueño'), crearTemporada);

// GET /temporadas - listar temporadas
router.get('/', verificarRol('admin', 'dueño'), obtenerTemporadas);

// GET /temporadas/:id - ver una temporada
router.get('/:id', verificarRol('admin', 'dueño'), obtenerTemporadaPorId);

// PUT /temporadas/:id/cerrar - cerrar temporada
router.put('/:id/cerrar', verificarRol('admin', 'dueño'), cerrarTemporada);

// DEWL /temporadas/:id - eliminar temporada cerrada
router.delete('/:id', verificarRol('admin', 'dueño'), eliminarTemporada);

module.exports = router;