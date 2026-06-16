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
    req.usuario = usuarioDoc.data();
    next();
  } catch (error) {
    console.error('Error verificando token:', error);
    return res.status(401).json({ error: 'No autorizado' });
  }
};

module.exports = { verificarToken };