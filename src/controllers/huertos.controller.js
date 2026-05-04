// Importamos db desde firebase
const { db } = require('../config/firebase');

// crear Huerto
const crearHuerto = async (req, res) => {
  // Solo necesitamos nombre y ubicacion para crear un huerto
  const { nombre, ubicacion } = req.body;

  try {
    // Validamos que vengan los datos obligatorios
    if (!nombre || !ubicacion) {
      return res.status(400).json({ error: 'Nombre y ubicacion son obligatorios' });
    }

    // Construimos el objeto del huerto
    const nuevoHuerto = {
      nombre,
      ubicacion,
      // El duenoId lo sacamos del token, no del body (mas seguro)
      duenoId: req.usuario.uid,
      // Al crear el huerto no hay trabajador asignado
      trabajadorActivoId: null,
      creadoEn: new Date().toISOString()
    };

    // Guardamos en Firestore, el id lo genera Firebase automaticamente
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

// Obtenemos todos los huertos
const obtenerHuertos = async (req, res) => {
  try {
    // Obtenemos todos los documentos de la coleccion huertos
    const snapshot = await db.collection('huertos').get();

    // Si no hay huertos retornamos un arreglo vacio
    if (snapshot.empty) {
      return res.status(200).json([]);
    }

    // Mapeamos los documentos para devolver un arreglo con los datos
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

// Buscamos el huerto por el ID
const obtenerHuertoPorId = async (req, res) => {
  // El id viene en la URL  → /huertos/:id
  const { id } = req.params;

  try {
    const huertoDoc = await db.collection('huertos').doc(id).get();

    // Verificamos que el huerto exista
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

// Modo para editar el huerto
const editarHuerto = async (req, res) => {
  const { id } = req.params;
  const { nombre, ubicacion } = req.body;

  try {
    // Verificamos que el huerto exista antes de editar
    const huertoDoc = await db.collection('huertos').doc(id).get();
    if (!huertoDoc.exists) {
      return res.status(404).json({ error: 'Huerto no encontrado' });
    }

    // Construimos solo los campos que llegaron para actualizar
    const datosActualizados = {};
    if (nombre) datosActualizados.nombre = nombre;
    if (ubicacion) datosActualizados.ubicacion = ubicacion;

    // update solo modifica los campos indicados, no borra los demas
    await db.collection('huertos').doc(id).update(datosActualizados);

    return res.status(200).json({ mensaje: 'Huerto actualizado correctamente' });

  } catch (error) {
    console.error('Error al editar huerto:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Eliminamos el huerto
const eliminarHuerto = async (req, res) => {
  const { id } = req.params;

  try {
    // Verificamos que el huerto exista antes de eliminar
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



// Asignamos un trabajor al huerto
const asignarTrabajador = async (req, res) => {
  const { id } = req.params;
  const { trabajadorId } = req.body;

  try {
    // Validamos que venga el trabajadorId
    if (!trabajadorId) {
      return res.status(400).json({ error: 'El trabajadorId es obligatorio' });
    }

    // Verificamos que el huerto exista
    const huertoDoc = await db.collection('huertos').doc(id).get();
    if (!huertoDoc.exists) {
      return res.status(404).json({ error: 'Huerto no encontrado' });
    }

    // Verificamos que el trabajador exista y sea del rol correcto
    const trabajadorDoc = await db.collection('usuarios').doc(trabajadorId).get();
    if (!trabajadorDoc.exists) {
      return res.status(404).json({ error: 'Trabajador no encontrado' });
    }

    const trabajadorData = trabajadorDoc.data();
    if (trabajadorData.rol !== 'trabajador') {
      return res.status(400).json({ error: 'El usuario no es un trabajador' });
    }

    // Verificamos que el trabajador no este asignado a otro huerto
    const huertoActivo = await db.collection('huertos')
      .where('trabajadorActivoId', '==', trabajadorId)
      .get();

    if (!huertoActivo.empty) {
      return res.status(400).json({ 
        error: 'El trabajador ya esta asignado a otro huerto' 
      });
    }

    // Verificamos que el huerto no tenga ya un trabajador asignado
    const huertoData = huertoDoc.data();
    if (huertoData.trabajadorActivoId) {
      return res.status(400).json({ 
        error: 'El huerto ya tiene un trabajador asignado' 
      });
    }

    // Asignamos el trabajador al huerto
    await db.collection('huertos').doc(id).update({
      trabajadorActivoId: trabajadorId
    });

    return res.status(200).json({ 
      mensaje: `Trabajador asignado correctamente al huerto` 
    });

  } catch (error) {
    console.error('Error al asignar trabajador:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Vamosd a asignar trabajador a un huerto
const desasignarTrabajador = async (req, res) => {
  const { id } = req.params;

  try {
    // Verificamos que el huerto exista
    const huertoDoc = await db.collection('huertos').doc(id).get();
    if (!huertoDoc.exists) {
      return res.status(404).json({ error: 'Huerto no encontrado' });
    }

    // Verificamos que el huerto tenga un trabajador asignado
    const huertoData = huertoDoc.data();
    if (!huertoData.trabajadorActivoId) {
      return res.status(400).json({ 
        error: 'El huerto no tiene un trabajador asignado' 
      });
    }

    // Desasignamos el trabajador, volvemos a null
    await db.collection('huertos').doc(id).update({
      trabajadorActivoId: null
    });

    return res.status(200).json({ 
      mensaje: 'Trabajador desasignado correctamente del huerto' 
    });

  } catch (error) {
    console.error('Error al desasignar trabajador:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

//Antes
//module.exports = { crearHuerto, obtenerHuertos, obtenerHuertoPorId, editarHuerto, eliminarHuerto };
//Despues
module.exports = { 
  crearHuerto, 
  obtenerHuertos, 
  obtenerHuertoPorId, 
  editarHuerto, 
  eliminarHuerto,
  asignarTrabajador,
  desasignarTrabajador
};