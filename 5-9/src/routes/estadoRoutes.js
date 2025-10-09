/**
 * Rutas de Estados
 * 
 * Define todas las rutas para el CRUD de estados
 */

const express = require('express');
const router = express.Router();
const {
  obtenerEstados,
  obtenerEstado,
  crearEstado,
  actualizarEstado,
  eliminarEstado
} = require('../controllers/estadoController');

const { validarEstado } = require('../middlewares/validators');
const { proteger, autorizarPorNivel } = require('../middlewares/auth');

// Rutas públicas (sin autenticación)
router.get('/', obtenerEstados);           // GET /api/estados
router.get('/:id', obtenerEstado);         // GET /api/estados/:id

// Rutas protegidas (requieren autenticación y nivel de admin)
router.post('/', proteger, autorizarPorNivel(4), validarEstado, crearEstado);        // POST /api/estados
router.put('/:id', proteger, autorizarPorNivel(4), validarEstado, actualizarEstado); // PUT /api/estados/:id
router.delete('/:id', proteger, autorizarPorNivel(4), eliminarEstado);               // DELETE /api/estados/:id

module.exports = router;
