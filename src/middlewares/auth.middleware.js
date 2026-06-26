const { admin, db } = require('../config/firebase');

const verificarToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];

  try {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }
    const uid = authHeader.split(' ')[1];
    const usuarioDoc = await db.collection('usuarios').doc(uid).get();
    if (!usuarioDoc.exists) {
      return res.status(401).json({ error: 'Token inválido' });
    }
    const usuarioData = usuarioDoc.data();

    // Si la cuenta está desactivada, bloqueamos sin importar el rol
    if (usuarioData.activo === false) {
      return res.status(403).json({ error: 'Cuenta desactivada. Contacta al administrador.' });
    }

    req.usuario = usuarioData;
    next();
  } catch (error) {
    console.error('Error verificando token:', error);
    return res.status(401).json({ error: 'No autorizado' });
  }
};

module.exports = { verificarToken };