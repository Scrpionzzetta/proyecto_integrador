const { admin, db } = require('../config/firebase');

const obtenerUsuarios = async (req, res) => {
  try {
    if (req.usuario.rol === 'admin') {
      const snapshot = await db.collection('usuarios').get();
      const usuarios = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return res.status(200).json(usuarios);
    }

    const huertosSnapshot = await db.collection('huertos')
      .where('duenoId', '==', req.usuario.uid)
      .get();

    const idsTrabajadores = new Set();
    huertosSnapshot.docs.forEach(doc => {
      (doc.data().trabajadoresActivos || []).forEach(uid => idsTrabajadores.add(uid));
    });

    if (idsTrabajadores.size === 0) {
      return res.status(200).json([]);
    }

    const usuarios = await Promise.all(
      Array.from(idsTrabajadores).map(async uid => {
        const doc = await db.collection('usuarios').doc(uid).get();
        return doc.exists ? { id: doc.id, ...doc.data() } : null;
      })
    );

    return res.status(200).json(usuarios.filter(Boolean));
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const obtenerUsuarioPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const usuarioDoc = await db.collection('usuarios').doc(id).get();
    if (!usuarioDoc.exists) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    const usuarioData = usuarioDoc.data();

    if (req.usuario.rol !== 'admin' && id !== req.usuario.uid) {
      if (usuarioData.rol !== 'trabajador') {
        return res.status(403).json({ error: 'No tienes acceso a este usuario' });
      }
      const huertosSnapshot = await db.collection('huertos')
        .where('duenoId', '==', req.usuario.uid)
        .get();
      const esSuyo = huertosSnapshot.docs.some(doc =>
        (doc.data().trabajadoresActivos || []).includes(id)
      );
      if (!esSuyo) {
        return res.status(403).json({ error: 'No tienes acceso a este usuario' });
      }
    }

    return res.status(200).json({
      id: usuarioDoc.id,
      ...usuarioData
    });
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const editarUsuario = async (req, res) => {
  const { id } = req.params;
  const { nombre, telefono, fecha_nacimiento, tipo_contrato, nacionalidad } = req.body;
  try {
    const usuarioDoc = await db.collection('usuarios').doc(id).get();
    if (!usuarioDoc.exists) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    const datosActualizados = {};
    if (nombre) datosActualizados.nombre = nombre;
    if (telefono) datosActualizados.telefono = telefono;
    if (fecha_nacimiento) datosActualizados.fecha_nacimiento = fecha_nacimiento;
    if (tipo_contrato) datosActualizados.tipo_contrato = tipo_contrato;
    if (nacionalidad) datosActualizados.nacionalidad = nacionalidad;
    if (Object.keys(datosActualizados).length === 0) {
      return res.status(400).json({ error: 'No hay campos para actualizar' });
    }
    await db.collection('usuarios').doc(id).update(datosActualizados);
    if (nombre) {
      await admin.auth().updateUser(id, { displayName: nombre });
    }
    return res.status(200).json({ mensaje: 'Usuario actualizado correctamente' });
  } catch (error) {
    console.error('Error al editar usuario:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const eliminarUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    if (req.usuario.rol !== 'admin') {
      return res.status(403).json({ error: 'Solo el administrador puede eliminar cuentas' });
    }
    const usuarioDoc = await db.collection('usuarios').doc(id).get();
    if (!usuarioDoc.exists) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    if (id === req.usuario.uid) {
      return res.status(400).json({ error: 'No puedes eliminarte a ti mismo' });
    }
    await admin.auth().deleteUser(id);
    await db.collection('usuarios').doc(id).delete();
    return res.status(200).json({ mensaje: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const desactivarUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    const usuarioDoc = await db.collection('usuarios').doc(id).get();
    if (!usuarioDoc.exists) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    if (id === req.usuario.uid) {
      return res.status(400).json({ error: 'No puedes desactivarte a ti mismo' });
    }
    const usuarioData = usuarioDoc.data();
    if (usuarioData.rol !== 'trabajador') {
      return res.status(400).json({ error: 'Solo se pueden desactivar trabajadores' });
    }

    if (req.usuario.rol !== 'admin') {
      const huertosSnapshot = await db.collection('huertos')
        .where('duenoId', '==', req.usuario.uid)
        .get();
      const esSuyo = huertosSnapshot.docs.some(doc =>
        (doc.data().trabajadoresActivos || []).includes(id)
      );
      if (!esSuyo) {
        return res.status(403).json({ error: 'Este trabajador no está activo en ninguno de tus huertos' });
      }
    }

    await db.collection('usuarios').doc(id).update({
      activo: false,
      desactivadoEn: new Date().toISOString()
    });
    return res.status(200).json({ mensaje: 'Trabajador desactivado correctamente' });
  } catch (error) {
    console.error('Error al desactivar usuario:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = { obtenerUsuarios, obtenerUsuarioPorId, editarUsuario, eliminarUsuario, desactivarUsuario };