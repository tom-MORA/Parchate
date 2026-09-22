const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const rutaArchivo = path.join(__dirname, '../data/eventosData.json');

// Obtener todos los eventos
router.get('/', (req, res) => {
    fs.readFile(rutaArchivo, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Error al leer eventos' });
        res.json(JSON.parse(data || '[]'));
    });
});

// Crear evento completo
router.post('/', (req, res) => {
    const { titulo, comuna, categoria, fecha, hora, lugar, requiereTicket, precio, cupos, descripcion } = req.body;

    if (!titulo || !comuna || !lugar) {
        return res.status(400).json({ error: 'Título, comuna y lugar son obligatorios' });
    }

    const nuevoEvento = {
        id: Date.now(),
        titulo,
        comuna,
        categoria: categoria || "Cultura",
        fecha: fecha || "Por confirmar",
        hora: hora || "7:00 PM",
        lugar,
        requiereTicket: requiereTicket === true || requiereTicket === 'true',
        precio: requiereTicket ? (precio || "$ 0") : "Entrada Libre",
        cupos: cupos || 50,
        descripcion: descripcion || "Un gran parche para disfrutar en la comuna."
    };

    fs.readFile(rutaArchivo, 'utf8', (err, data) => {
        const eventos = JSON.parse(data || '[]');
        eventos.unshift(nuevoEvento); // Agregar al inicio

        fs.writeFile(rutaArchivo, JSON.stringify(eventos, null, 2), (errWrite) => {
            if (errWrite) return res.status(500).json({ error: 'Error al guardar evento' });
            res.status(201).json({ mensaje: 'Evento creado exitosamente', evento: nuevoEvento });
        });
    });
});

// Editar evento por ID
router.put('/:id', (req, res) => {
    const eventoId = Number(req.params.id);
    const datosNuevos = req.body;

    fs.readFile(rutaArchivo, 'utf8', (err, data) => {
        let eventos = JSON.parse(data || '[]');
        const indice = eventos.findIndex(e => e.id === eventoId);

        if (indice === -1) {
            return res.status(404).json({ error: 'Evento no encontrado' });
        }

        eventos[indice] = { ...eventos[indice], ...datosNuevos };

        fs.writeFile(rutaArchivo, JSON.stringify(eventos, null, 2), (errWrite) => {
            if (errWrite) return res.status(500).json({ error: 'Error al actualizar evento' });
            res.json({ mensaje: 'Evento actualizado correctamente', evento: eventos[indice] });
        });
    });
});

// Eliminar evento
router.delete('/:id', (req, res) => {
    const eventoId = Number(req.params.id);

    fs.readFile(rutaArchivo, 'utf8', (err, data) => {
        let eventos = JSON.parse(data || '[]');
        const eventosFiltrados = eventos.filter(e => e.id !== eventoId);

        if (eventos.length === eventosFiltrados.length) {
            return res.status(404).json({ error: 'Evento no encontrado' });
        }

        fs.writeFile(rutaArchivo, JSON.stringify(eventosFiltrados, null, 2), (errWrite) => {
            if (errWrite) return res.status(500).json({ error: 'Error al eliminar evento' });
            res.json({ mensaje: 'Evento eliminado correctamente' });
        });
    });
});

module.exports = router;