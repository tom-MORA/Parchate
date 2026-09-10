const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Importar rutas
const comunasRoutes = require('./routes/infocomunas');
const contactoRoutes = require('./routes/contacto');
const eventosRoutes = require('./routes/eventos');

// Usar rutas
app.use('/api/infoComunas', comunasRoutes);
app.use('/api/contacto', contactoRoutes);
app.use('/api/eventos', eventosRoutes);

// Ruta base de prueba
app.get('/', (req, res) => {
    res.send('Servidor de PÁRCHATE ejecutándose correctamente 🚀');
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});