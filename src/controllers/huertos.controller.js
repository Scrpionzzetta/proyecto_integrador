const { db } = require('../config/firebase');
const crearHuerto = async (req, res) => {
  const { nombre, ubicacion } = req.body;
  try {
    if (!nombre || !ubicacion) {
      return res.status(400).json({ error: 'Nombre y ubicacion son obligatorios' });
    }
    const nuevoHuerto = {
      nombre,
      ubicacion,
      duenoId: req.usuario.uid,
      trabajadorActivoId: null,
      creadoEn: new Date().toISOString()
    };
    const huertoRef = await db.collection('huertos').add(nuevoHuerto);
    return res.status(201).json({
      mensaje: 'Huerto creado correctamente',
      id: huertoRef.id
    });
  } catch (error) {
    console.error('Error al crear huerto:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};
const obtenerHuertos = async (req, res) => {
  try {
    let snapshot;
    if (req.usuario.rol === 'admin') {
      snapshot = await db.collection('huertos').get();
    } else {
      snapshot = await db.collection('huertos')
        .where('duenoId', '==', req.usuario.uid)
        .get();
    }
    console.log('Huertos encontrados:', snapshot.size);
    if (snapshot.empty) {
      return res.status(200).json([]);
    }
    const huertos = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return res.status(200).json(huertos);

  } catch (error) {
    console.error('Error al obtener huertos:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};
const obtenerHuertoPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const huertoDoc = await db.collection('huertos').doc(id).get();
    if (!huertoDoc.exists) {
      return res.status(404).json({ error: 'Huerto no encontrado' });
    }
    return res.status(200).json({
      id: huertoDoc.id,
      ...huertoDoc.data()
    });
  } catch (error) {
    console.error('Error al obtener huerto:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};
const editarHuerto = async (req, res) => {
  const { id } = req.params;
  const { nombre, ubicacion } = req.body;
  try {
    const huertoDoc = await db.collection('huertos').doc(id).get();
    if (!huertoDoc.exists) {
      return res.status(404).json({ error: 'Huerto no encontrado' });
    }
    const datosActualizados = {};
    if (nombre) datosActualizados.nombre = nombre;
    if (ubicacion) datosActualizados.ubicacion = ubicacion;
    await db.collection('huertos').doc(id).update(datosActualizados);
    return res.status(200).json({ mensaje: 'Huerto actualizado correctamente' });
  } catch (error) {
    console.error('Error al editar huerto:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};
const eliminarHuerto = async (req, res) => {
  const { id } = req.params;

  try {
    const huertoDoc = await db.collection('huertos').doc(id).get();
    if (!huertoDoc.exists) {
      return res.status(404).json({ error: 'Huerto no encontrado' });
    }
    await db.collection('huertos').doc(id).delete();
    return res.status(200).json({ mensaje: 'Huerto eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar huerto:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};
const asignarTrabajador = async (req, res) => {
  const { id } = req.params;
  const { trabajadorId } = req.body;
  try {
    if (!trabajadorId) {
      return res.status(400).json({ error: 'El trabajadorId es obligatorio' });
    }
    const huertoDoc = await db.collection('huertos').doc(id).get();
    if (!huertoDoc.exists) {
      return res.status(404).json({ error: 'Huerto no encontrado' });
    }
    const trabajadorDoc = await db.collection('usuarios').doc(trabajadorId).get();
    if (!trabajadorDoc.exists || trabajadorDoc.data().rol !== 'trabajador') {
      return res.status(404).json({ error: 'Trabajador no encontrado' });
    }
    const huertoData = huertoDoc.data();
    const trabajadoresActivos = huertoData.trabajadoresActivos || [];
    if (trabajadoresActivos.includes(trabajadorId)) {
      return res.status(400).json({ error: 'El trabajador ya está asignado a este huerto' });
    }
    const huertosSnapshot = await db.collection('huertos').get();
    const huertoDeOtroDueno = huertosSnapshot.docs.find(doc => {
      const data = doc.data();
      const activos = data.trabajadoresActivos || [];
      return activos.includes(trabajadorId) && data.duenoId !== huertoData.duenoId;
    });
    if (huertoDeOtroDueno) {
      return res.status(400).json({
        error: 'El trabajador está asignado a un huerto de otro dueño'
      });
    }
    await db.collection('huertos').doc(id).update({
      trabajadoresActivos: [...trabajadoresActivos, trabajadorId]
    });
    return res.status(200).json({ mensaje: 'Trabajador asignado correctamente' });
  } catch (error) {
    console.error('Error al asignar trabajador:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const desasignarTrabajador = async (req, res) => {
  const { id } = req.params;
  const { trabajadorId } = req.body;
  try {
    if (!trabajadorId) {
      return res.status(400).json({ error: 'El trabajadorId es obligatorio' });
    }
    const huertoDoc = await db.collection('huertos').doc(id).get();
    if (!huertoDoc.exists) {
      return res.status(404).json({ error: 'Huerto no encontrado' });
    }
    const huertoData = huertoDoc.data();
    const trabajadoresActivos = huertoData.trabajadoresActivos || [];
    if (!trabajadoresActivos.includes(trabajadorId)) {
      return res.status(400).json({ error: 'El trabajador no está asignado a este huerto' });
    }
    await db.collection('huertos').doc(id).update({
      trabajadoresActivos: trabajadoresActivos.filter(uid => uid !== trabajadorId)
    });
    return res.status(200).json({ mensaje: 'Trabajador desasignado correctamente' });
  } catch (error) {
    console.error('Error al desasignar trabajador:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};
module.exports = {
  crearHuerto,
  obtenerHuertos,
  obtenerHuertoPorId,
  editarHuerto,
  eliminarHuerto,
  asignarTrabajador,
  desasignarTrabajador
};