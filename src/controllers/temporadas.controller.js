const { db } = require('../config/firebase');

const crearTemporada = async (req, res) => {
  const { huertoId, fruta, fechaInicio, precio_bandeja, precio_granel } = req.body;
  try {
    if (!huertoId || !fruta || !fechaInicio || !precio_bandeja || !precio_granel) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios incluyendo precios' });
    }
    if (precio_bandeja <= 0 || precio_granel <= 0) {
      return res.status(400).json({ error: 'Los precios deben ser mayores a 0' });
    }
    const huertoDoc = await db.collection('huertos').doc(huertoId).get();
    if (!huertoDoc.exists) {
      return res.status(404).json({ error: 'Huerto no encontrado' });
    }
    const huertoData = huertoDoc.data();

    if (req.usuario.rol !== 'admin' && huertoData.duenoId !== req.usuario.uid) {
      return res.status(403).json({ error: 'No puedes crear temporadas en este huerto' });
    }

    const temporadaActiva = await db.collection('temporadas')
      .where('huertoId', '==', huertoId)
      .where('estado', '==', 'activa')
      .get();
    if (!temporadaActiva.empty) {
      return res.status(400).json({ error: 'El huerto ya tiene una temporada activa' });
    }
    const nuevaTemporada = {
      huertoId,
      fruta,
      fechaInicio,
      fechaFin: null,
      precio_bandeja,
      precio_granel,
      anio: new Date(fechaInicio).getFullYear(),
      estado: 'activa',
      creadoPor: req.usuario.uid,
      creadoEn: new Date().toISOString()
    };
    const temporadaRef = await db.collection('temporadas').add(nuevaTemporada);
    return res.status(201).json({
      mensaje: 'Temporada creada correctamente',
      id: temporadaRef.id
    });
  } catch (error) {
    console.error('Error al crear temporada:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const obtenerTemporadas = async (req, res) => {
  try {
    let snapshot;
    if (req.usuario.rol === 'admin') {
      snapshot = await db.collection('temporadas').get();
    } else {
      snapshot = await db.collection('temporadas')
        .where('creadoPor', '==', req.usuario.uid)
        .get();
    }
    if (snapshot.empty) {
      return res.status(200).json([]);
    }
    const temporadas = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return res.status(200).json(temporadas);
  } catch (error) {
    console.error('Error al obtener temporadas:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const obtenerTemporadaPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const temporadaDoc = await db.collection('temporadas').doc(id).get();
    if (!temporadaDoc.exists) {
      return res.status(404).json({ error: 'Temporada no encontrada' });
    }
    const temporadaData = temporadaDoc.data();

    if (req.usuario.rol !== 'admin' && temporadaData.creadoPor !== req.usuario.uid) {
      return res.status(403).json({ error: 'No tienes acceso a esta temporada' });
    }

    return res.status(200).json({
      id: temporadaDoc.id,
      ...temporadaData
    });
  } catch (error) {
    console.error('Error al obtener temporada:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const cerrarTemporada = async (req, res) => {
  const { id } = req.params;
  const { fechaFin } = req.body;
  try {
    const temporadaDoc = await db.collection('temporadas').doc(id).get();
    if (!temporadaDoc.exists) {
      return res.status(404).json({ error: 'Temporada no encontrada' });
    }
    const temporadaData = temporadaDoc.data();

    if (req.usuario.rol !== 'admin' && temporadaData.creadoPor !== req.usuario.uid) {
      return res.status(403).json({ error: 'No puedes cerrar esta temporada' });
    }

    if (temporadaData.estado !== 'activa') {
      return res.status(400).json({ error: 'La temporada ya esta cerrada' });
    }
    if (!fechaFin) {
      return res.status(400).json({ error: 'La fecha de cierre es obligatoria' });
    }
    const hoy = new Date().toISOString().split('T')[0];
    if (fechaFin > hoy) {
      return res.status(400).json({ error: 'No puedes cerrar una temporada con fecha futura' });
    }
    if (fechaFin < temporadaData.fechaInicio) {
      return res.status(400).json({
        error: 'La fecha de cierre no puede ser anterior a la fecha de inicio'
      });
    }
    await db.collection('temporadas').doc(id).update({
      estado: 'cerrada',
      fechaFin
    });
    return res.status(200).json({ mensaje: 'Temporada cerrada correctamente' });
  } catch (error) {
    console.error('Error al cerrar temporada:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const eliminarTemporada = async (req, res) => {
  const { id } = req.params;
  try {
    const temporadaDoc = await db.collection('temporadas').doc(id).get();
    if (!temporadaDoc.exists) {
      return res.status(404).json({ error: 'Temporada no encontrada' });
    }
    const temporadaData = temporadaDoc.data();

    if (req.usuario.rol !== 'admin' && temporadaData.creadoPor !== req.usuario.uid) {
      return res.status(403).json({ error: 'No puedes eliminar esta temporada' });
    }

    if (temporadaData.estado === 'activa') {
      return res.status(400).json({
        error: 'No puedes eliminar una temporada activa, ciérrala primero'
      });
    }
    await db.collection('temporadas').doc(id).delete();
    return res.status(200).json({ mensaje: 'Temporada eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar temporada:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = { crearTemporada, obtenerTemporadas, obtenerTemporadaPorId, cerrarTemporada, eliminarTemporada };