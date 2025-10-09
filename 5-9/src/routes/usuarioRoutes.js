/**
 * Rutas de Usuarios
 * 
 * Define todas las rutas para el CRUD de usuarios
 */

const express = require('express');
const router = express.Router();
const {
  obtenerUsuarios,
  obtenerUsuario,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario
} = require('../controllers/usuarioController');

const { validarUsuarioCrear, validarUsuarioActualizar } = require('../middlewares/validators');
const { proteger, autorizarPorNivel } = require('../middlewares/auth');

// Todas las rutas de usuarios requieren autenticación y permisos de admin
router.use(proteger); // Proteger todas las rutas
router.use(autorizarPorNivel(4)); // Solo nivel 4 (admin) o superior

router.get('/', obtenerUsuarios);                                    // GET /api/usuarios
router.get('/:id', obtenerUsuario);                                  // GET /api/usuarios/:id
router.post('/', validarUsuarioCrear, crearUsuario);                 // POST /api/usuarios
router.put('/:id', validarUsuarioActualizar, actualizarUsuario);     // PUT /api/usuarios/:id
router.delete('/:id', eliminarUsuario);                              // DELETE /api/usuarios/:id

module.exports = router;
