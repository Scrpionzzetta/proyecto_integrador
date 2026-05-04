// El codigo anterior lo dejamos comentado por si se necesita mas adelante
/*
const { db } = require('../config/firebase');

const verificarRol = (...rolesPermitidos) => {
  return async (req, res, next) => {
    try {
      const uid = req.usuario.uid;
      const usuarioDoc = await db.collection('usuarios').doc(uid).get();
      if (!usuarioDoc.exists) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      const { rol } = usuarioDoc.data();
      if (!rolesPermitidos.includes(rol)) {
        return res.status(403).json({ 
          error: `Acceso denegado. Se requiere rol: ${rolesPermitidos.join(' o ')}` 
        });
      }
      req.rol = rol;
      next(); 
    } catch (error) {
      console.error('Error verificando rol:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  };
};
module.exports = { verificarRol };
*/

// Nueva version simplificada, el usuario ya viene en req.usuario desde auth.middleware
const verificarRol = (...rolesPermitidos) => {
  return async (req, res, next) => {
    try {
      // El usuario ya viene adjunto desde el middleware verificarToken
      const { rol } = req.usuario;

      // Verificar si su rol esta permitido
      if (!rolesPermitidos.includes(rol)) {
        return res.status(403).json({ 
          error: `Acceso denegado. Se requiere rol: ${rolesPermitidos.join(' o ')}` 
        });
      }

      next();

    } catch (error) {
      console.error('Error verificando rol:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  };
};

module.exports = { verificarRol };