const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Importar rutas
const comunasRoutes = require('./routes/infocomunas');

// Usar rutas de la API
app.use('/api/infoComunas', comunasRoutes);

// Ruta base de prueba
app.get('/', (req, res) => {
    res.send('Servidor de PÁRCHATE ejecutándose correctamente 🚀');
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});