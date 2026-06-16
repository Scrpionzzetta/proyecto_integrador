require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

const authRoutes = require('./routes/auth.routes');
const huertoRoutes = require('./routes/huertos.routes');
const temporadaRoutes = require('./routes/temporadas.routes');
const usuarioRoutes = require('./routes/usuarios.routes');
const recoleccionRoutes = require('./routes/recolecciones.routes');
const pagoRoutes = require('./routes/pagos.routes');
const fichaRoutes = require('./routes/fichas.routes');
const trabajadorRoutes = require('./routes/trabajadores.routes');
const ventaRoutes = require('./routes/ventas.routes');
const compradorRoutes = require('./routes/compradores.routes');
const reporteRoutes = require('./routes/reportes.routes');

app.use(cors({
  origin: 'http://localhost:5173'
}));
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/huertos', huertoRoutes);
app.use('/temporadas', temporadaRoutes);
app.use('/usuarios', usuarioRoutes);
app.use('/recolecciones', recoleccionRoutes);
app.use('/pagos', pagoRoutes);
app.use('/fichas', fichaRoutes);
app.use('/trabajadores', trabajadorRoutes);
app.use('/ventas', ventaRoutes);
app.use('/compradores', compradorRoutes);
app.use('/reportes', reporteRoutes);


app.get('/', (req, res) => {
  res.json({ mensaje: '¡Servidor funcionando!' });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});


