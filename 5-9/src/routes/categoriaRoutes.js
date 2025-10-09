/**
 * Rutas de Categorías
 * 
 * Define todas las rutas para el CRUD de categorías
 */

const express = require('express');
const router = express.Router();
const {
  obtenerCategorias,
  obtenerCategoria,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria
} = require('../controllers/categoriaController');

const { validarCategoria } = require('../middlewares/validators');
const { proteger, autorizarPorNivel } = require('../middlewares/auth');

// Rutas públicas
router.get('/', obtenerCategorias);        // GET /api/categorias
router.get('/:id', obtenerCategoria);      // GET /api/categorias/:id

// Rutas protegidas (editores y administradores)
router.post('/', proteger, autorizarPorNivel(3), validarCategoria, crearCategoria);        // POST /api/categorias
router.put('/:id', proteger, autorizarPorNivel(3), validarCategoria, actualizarCategoria); // PUT /api/categorias/:id
router.delete('/:id', proteger, autorizarPorNivel(4), eliminarCategoria);                  // DELETE /api/categorias/:id

module.exports = router;
