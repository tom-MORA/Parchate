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

// Crear evento (Con o sin ticket)
router.post('/', (req, res) => {
    const { titulo, comuna, fecha, lugar, requiereTicket, precio, descripcion } = req.body;

    if (!titulo || !comuna || !lugar) {
        return res.status(400).json({ error: 'Título, comuna y lugar son obligatorios' });
    }

    const nuevoEvento = {
        id: Date.now(),
        titulo,
        comuna,
        fecha: fecha || "Por confirmar",
        lugar,
        requiereTicket: requiereTicket || false,
        precio: requiereTicket ? (precio || "$ 0") : "Entrada Libre",
        descripcion: descripcion || ""
    };

    fs.readFile(rutaArchivo, 'utf8', (err, data) => {
        const eventos = JSON.parse(data || '[]');
        eventos.push(nuevoEvento);

        fs.writeFile(rutaArchivo, JSON.stringify(eventos, null, 2), (errWrite) => {
            if (errWrite) return res.status(500).json({ error: 'Error al guardar evento' });
            res.status(201).json({ mensaje: 'Evento creado exitosamente', evento: nuevoEvento });
        });
    });
});

// Editar evento
router.put('/:id', (req, res) => {
    const eventoId = Number(req.params.id);
    const datosActualizados = req.body;

    fs.readFile(rutaArchivo, 'utf8', (err, data) => {
        let eventos = JSON.parse(data || '[]');
        const indice = eventos.findIndex(e => e.id === eventoId);

        if (indice === -1) {
            return res.status(404).json({ error: 'Evento no encontrado' });
        }

        eventos[indice] = { ...eventos[indice], ...datosActualizados };

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