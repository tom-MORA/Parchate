const express = require('express');
const router = express.Router();
const comunasData = require('../data/comunasData.json');

// Obtener todas las comunas
router.get('/', (req, res) => {
    res.json(comunasData);
});

// Obtener una comuna específica por su ID/Nombre
router.get('/:id', (req, res) => {
    const comunaId = req.params.id;
    const comuna = comunasData[comunaId];

    if (comuna) {
        res.json(comuna);
    } else {
        res.status(404).json({ error: 'Comuna no encontrada' });
    }
});

module.exports = router;