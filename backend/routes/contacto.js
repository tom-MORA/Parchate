const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const rutaArchivo = path.join(__dirname, '../data/mensajesContacto.json');

// Guardar un nuevo mensaje de contacto
router.post('/', (req, res) => {
    const { nombre, email, mensaje } = req.body;

    if (!nombre || !email || !mensaje) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const nuevoMensaje = {
        id: Date.now(),
        nombre,
        email,
        mensaje,
        fecha: new Date().toISOString()
    };

    // Leer mensajes existentes
    fs.readFile(rutaArchivo, 'utf8', (err, data) => {
        let mensajes = [];
        if (!err && data) {
            mensajes = JSON.parse(data);
        }

        mensajes.push(nuevoMensaje);

        // Guardar en el JSON
        fs.writeFile(rutaArchivo, JSON.stringify(mensajes, null, 2), (errWrite) => {
            if (errWrite) {
                return res.status(500).json({ error: 'Error al guardar el mensaje' });
            }
            res.status(201).json({ mensaje: '¡Mensaje recibido con éxito!', datos: nuevoMensaje });
        });
    });
});

// Obtener todos los mensajes recibidos (Exclusivo Admin)
router.get('/', (req, res) => {
    fs.readFile(rutaArchivo, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Error al leer los mensajes' });
        res.json(JSON.parse(data || '[]'));
    });
});

module.exports = router;