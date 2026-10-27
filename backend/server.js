const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Función auxiliar para leer archivos JSON de forma segura
function leerJSON(nombreArchivo) {
  try {
    let ruta = path.join(__dirname, nombreArchivo);
    if (!fs.existsSync(ruta)) {
      ruta = path.join(__dirname, 'data', nombreArchivo);
    }
    if (!fs.existsSync(ruta)) return [];
    
    const data = fs.readFileSync(ruta, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error al leer ${nombreArchivo}:`, err);
    return [];
  }
}

// Importar rutas de la API
const comunasRoutes = require('./routes/infocomunas');
const contactoRoutes = require('./routes/contacto');
const eventosRoutes = require('./routes/eventos');
const usuariosRoutes = require('./routes/usuarios');

// Usar rutas
app.use('/api/infoComunas', comunasRoutes);
app.use('/api/contacto', contactoRoutes);
app.use('/api/eventos', eventosRoutes);
app.use('/api/usuarios', usuariosRoutes);

// Endpoint IA Personalizada (Párchate Bot)
app.post('/api/chat-parchate', (req, res) => {
  try {
    const { mensaje } = req.body;
    console.log("📩 Mensaje recibido en el Bot:", mensaje);

    const eventos = leerJSON('eventos.json');
    const mensajeLower = (mensaje || '').toLowerCase();
    
    // Buscar coincidencias con la comuna o título del evento
    const eventosCoincidentes = eventos.filter(e => {
      const comunaClean = (e.comuna || '').toLowerCase().replace(/_/g, ' ');
      const tituloClean = (e.titulo || '').toLowerCase();
      return mensajeLower.includes(comunaClean) || mensajeLower.includes(tituloClean);
    });

    if (eventosCoincidentes.length > 0) {
      const listaText = eventosCoincidentes.map(e => `• ${e.titulo} en ${(e.comuna || '').replace(/_/g, ' ')} (${e.precio || 'Gratis'})`).join('\n');
      res.json({ respuesta: `¡Móntese en la película, parce! 🚀 Aquí le tengo estos parches finos en la zona:\n\n${listaText}` });
    } else {
      res.json({ respuesta: `¡Qué más pues, parce! 🤖 Le recomiendo pegarse la rodadita por Laureles, El Poblado, Aranjuez o la Comuna 13. ¿En qué comuna busca parche hoy o qué le gustaría hacer?` });
    }
  } catch (error) {
    console.error("❌ Error en /api/chat-parchate:", error);
    res.status(500).json({ respuesta: "¡Uy parce! Ocurrió un inconveniente procesando la recomendación. Intente de nuevo." });
  }
});

// Ruta base de prueba
app.get('/', (req, res) => {
  res.send('Servidor de PÁRCHATE ejecutándose correctamente 🚀');
});

// Iniciar servidor (SIEMPRE AL FINAL)
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});