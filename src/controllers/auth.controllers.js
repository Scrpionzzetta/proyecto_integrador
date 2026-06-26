const { admin, db } = require('../config/firebase');

const registro = async (req, res) => {
  const {
    nombre,
    email,
    password,
    rol,
    tipo_documento,
    numero_documento,
    fecha_nacimiento,
    telefono,
    nacionalidad,
    tipo_contrato
  } = req.body;

  try {
    if (!nombre || !email || !password || !rol || !tipo_documento || !numero_documento || !fecha_nacimiento) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }
    const rolesPermitidos = ['admin', 'dueño', 'trabajador'];
    if (!rolesPermitidos.includes(rol)) {
      return res.status(400).json({ error: 'Rol incorrecto' });
    }
    const tiposDocumento = ['rut', 'pasaporte'];
    if (!tiposDocumento.includes(tipo_documento)) {
      return res.status(400).json({ error: 'Tipo de documento no válido' });
    }
    if (rol === 'trabajador') {
      if (!nacionalidad) {
        return res.status(400).json({ error: 'La nacionalidad es obligatoria para trabajadores' });
      }
      if (!tipo_contrato) {
        return res.status(400).json({ error: 'El tipo de contrato es obligatorio para trabajadores' });
      }
      const contratosPermitidos = ['con_contrato', 'sin_contrato'];
      if (!contratosPermitidos.includes(tipo_contrato)) {
        return res.status(400).json({ error: 'Tipo de contrato no válido' });
      }
    }

    const usuarioFirebase = await admin.auth().createUser({
      email,
      password,
      displayName: nombre
    });

    const nuevoUsuario = {
      uid: usuarioFirebase.uid,
      nombre,
      email,
      rol,
      tipo_documento,
      numero_documento,
      fecha_nacimiento,
      telefono: telefono || null,
      activo: true,
      creadoEn: new Date().toISOString()
    };

    if (rol === 'trabajador') {
      nuevoUsuario.nacionalidad = nacionalidad;
      nuevoUsuario.tipo_contrato = tipo_contrato;
    }

    await db.collection('usuarios').doc(usuarioFirebase.uid).set(nuevoUsuario);

    return res.status(201).json({
      mensaje: 'Usuario creado correctamente',
      uid: usuarioFirebase.uid
    });

  } catch (error) {
    if (error.code === 'auth/email-already-exists') {
      return res.status(400).json({ error: 'El email ya esta registrado' });
    }
    if (error.code === 'auth/invalid-password') {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
    }
    console.error('Error en registro:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y password son obligatorios' });
    }

    const usuarioFirebase = await admin.auth().getUserByEmail(email);
    const usuarioDoc = await db.collection('usuarios').doc(usuarioFirebase.uid).get();

    if (!usuarioDoc.exists) {
      return res.status(404).json({ error: 'Usuario no encontrado en base de datos' });
    }

    const usuarioData = usuarioDoc.data();

    if (usuarioData.rol === 'trabajador') {
      return res.status(403).json({ error: 'Los trabajadores no tienen acceso al sistema' });
    }

    if (usuarioData.activo === false) {
      return res.status(403).json({ error: 'Cuenta desactivada. Contacta al administrador.' });
    }

    const token = await admin.auth().createCustomToken(usuarioFirebase.uid);

    return res.status(200).json({
      mensaje: 'Login exitoso',
      token,
      usuario: {
        uid: usuarioData.uid,
        nombre: usuarioData.nombre,
        email: usuarioData.email,
        rol: usuarioData.rol
      }
    });

  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    console.error('Error en login:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = { registro, login };