/**
 * Rutas de Perfiles
 * 
 * Define todas las rutas para el CRUD de perfiles (roles)
 */

const express = require('express');
const router = express.Router();
const {
  obtenerPerfiles,
  obtenerPerfil,
  crearPerfil,
  actualizarPerfil,
  eliminarPerfil
} = require('../controllers/perfilController');

const { validarPerfil } = require('../middlewares/validators');
const { proteger, autorizarPorNivel } = require('../middlewares/auth');

// Rutas públicas
router.get('/', obtenerPerfiles);          // GET /api/perfiles
router.get('/:id', obtenerPerfil);         // GET /api/perfiles/:id

// Rutas protegidas (solo administradores nivel 5)
router.post('/', proteger, autorizarPorNivel(5), validarPerfil, crearPerfil);        // POST /api/perfiles
router.put('/:id', proteger, autorizarPorNivel(5), validarPerfil, actualizarPerfil); // PUT /api/perfiles/:id
router.delete('/:id', proteger, autorizarPorNivel(5), eliminarPerfil);               // DELETE /api/perfiles/:id

module.exports = router;
