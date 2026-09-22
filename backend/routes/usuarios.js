const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const rutaArchivo = path.join(__dirname, '../data/usuarios.json');

// Registro de nuevos usuarios (Rol por defecto: "usuario")
router.post('/registro', (req, res) => {
    const { nombre, email, usuario, password, comunaPref, telefono } = req.body;

    if (!usuario || !password) {
        return res.status(400).json({ error: 'Usuario/Email y contraseña son requeridos' });
    }

    fs.readFile(rutaArchivo, 'utf8', (err, data) => {
        let usuarios = JSON.parse(data || '[]');

        // Verificar si el usuario o correo ya existe
        const existe = usuarios.some(u => u.usuario === usuario || u.email === email);
        if (existe) {
            return res.status(400).json({ error: 'El usuario o correo ya está registrado' });
        }

        const nuevoUsuario = {
            id: Date.now(),
            nombre: nombre || usuario,
            email: email || `${usuario}@parchate.com`,
            usuario: usuario,
            password: password,
            rol: "usuario", // Por defecto es tipo usuario
            comunaPref: comunaPref || "",
            telefono: telefono || ""
        };

        usuarios.push(nuevoUsuario);

        fs.writeFile(rutaArchivo, JSON.stringify(usuarios, null, 2), (errWrite) => {
            if (errWrite) return res.status(500).json({ error: 'Error al registrar usuario' });
            res.status(201).json({ mensaje: 'Usuario creado exitosamente', usuario: nuevoUsuario });
        });
    });
});

// Login con verificación de Rol
router.post('/login', (req, res) => {
    const { identificador, password } = req.body;

    fs.readFile(rutaArchivo, 'utf8', (err, data) => {
        const usuarios = JSON.parse(data || '[]');
        const usuarioEncontrado = usuarios.find(u => 
            (u.usuario === identificador || u.email === identificador) && u.password === password
        );

        if (!usuarioEncontrado) {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        res.json({
            mensaje: 'Inicio de sesión exitoso',
            usuario: {
                id: usuarioEncontrado.id,
                nombre: usuarioEncontrado.nombre,
                rol: usuarioEncontrado.rol,
                comunaPref: usuarioEncontrado.comunaPref
            }
        });
    });
});

module.exports = router;