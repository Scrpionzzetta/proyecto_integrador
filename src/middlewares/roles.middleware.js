
const verificarRol = (...rolesPermitidos) => {
  return async (req, res, next) => {
    try {
      const { rol } = req.usuario;
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