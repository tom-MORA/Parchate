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

// Endpoint IA Personalizada Avanzada (Párchate Bot)
app.post('/api/chat-parchate', (req, res) => {
  try {
    const { mensaje } = req.body;
    const msg = (mensaje || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    const eventos = leerJSON('eventos.json');

    // 1. Conocimiento sobre la plataforma PÁRCHATE
    if (msg.includes('que es parchate') || msg.includes('quienes son') || msg.includes('de que trata')) {
      return res.json({
        respuesta: "¡PÁRCHATE es la plataforma líder para descubrir y gestionar la oferta cultural, deportiva y social en las 16 comunas urbanas de Medellín! 🚀 Aquí puedes explorar eventos por comuna, reservar tus boletas digitales con código QR y acumular puntos de fidelidad."
      });
    }

    if (msg.includes('boleta') || msg.includes('ticket') || msg.includes('qr') || msg.includes('reserva')) {
      return res.json({
        respuesta: "🎟️ ¡Reservar es súper fácil! Inicia sesión, explora el parche que te guste en el mapa o en la sección de eventos y dale clic a 'Reservar Boleta'. Luego puedes ver tus códigos QR en tu 'Perfil > Mis Boletas'."
      });
    }

    if (msg.includes('publicar') || msg.includes('crear evento') || msg.includes('organizador')) {
      return res.json({
        respuesta: "📢 Si eres organizador y quieres publicar tu parche en la app, ponte en contacto con nuestro equipo de administración desde la sección de 'Contacto' en la página principal o escríbenos a soporte."
      });
    }

    // 2. Búsqueda inteligente por comuna o título de evento
    const eventosCoincidentes = eventos.filter(e => {
      const comunaClean = (e.comuna || '').toLowerCase().replace(/_/g, ' ').normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const tituloClean = (e.titulo || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      return msg.includes(comunaClean) || msg.includes(tituloClean);
    });

    if (eventosCoincidentes.length > 0) {
      const listaText = eventosCoincidentes.map(e => `• ${e.titulo} en ${(e.comuna || '').replace(/_/g, ' ')} (${e.precio || 'Gratis'})`).join('\n');
      return res.json({
        respuesta: `¡Móntese en la película, parce! 🚀 Aquí le tengo estos parches finos coincidentes:\n\n${listaText}`
      });
    }

    // 3. Respuesta amigable por defecto o redirección a contacto si no comprende
    if (msg.includes('hola') || msg.includes('buenas') || msg.includes('que mas')) {
      return res.json({
        respuesta: "¡Qué más pues, parce! 🤖 Soy Párchate Bot. Dime qué comuna buscas (ej: Laureles, Manrique, Aranjuez, El Poblado) o pregúntame sobre cómo usar la app."
      });
    }

    // Si no reconoce la consulta:
    return res.json({
      respuesta: "¡Uy parce! Todavía no tengo esa información exacta en mi base de datos 🤔. Si necesitas ayuda directa o tienes una duda específica, escríbenos a nuestro correo de contacto: contacto@parchate.co o envíanos un mensaje desde la sección de Contacto."
    });

  } catch (error) {
    console.error("❌ Error en /api/chat-parchate:", error);
    res.status(500).json({ respuesta: "¡Uy parce! Ocurrió un problema consultando la información. Intenta de nuevo." });
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

// Endpoint para eliminar mensajes de contacto
app.delete('/api/contacto/:id', (req, res) => {
  try {
    const { id } = req.params;
    let mensajes = leerJSON('contacto.json');
    mensajes = mensajes.filter(m => String(m.id) !== String(id));
    escribirJSON('contacto.json', mensajes);
    res.json({ ok: true, mensaje: "Mensaje eliminado correctamente" });
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar el mensaje" });
  }
});