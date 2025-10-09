/**
 * Rutas de Noticias
 * 
 * Define todas las rutas para el CRUD de noticias
 */

const express = require('express');
const router = express.Router();
const {
  obtenerNoticias,
  obtenerNoticia,
  crearNoticia,
  actualizarNoticia,
  eliminarNoticia,
  obtenerMisNoticias
} = require('../controllers/noticiaController');

const { validarNoticiaCrear, validarNoticiaActualizar } = require('../middlewares/validators');
const { proteger } = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: Noticias
 *   description: Gestión de noticias del sistema
 */

/**
 * @swagger
 * /api/noticias:
 *   get:
 *     summary: Obtener todas las noticias con filtros opcionales
 *     tags: [Noticias]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: categoria
 *         schema:
 *           type: integer
 *         description: Filtrar por ID de categoría
 *       - in: query
 *         name: estado
 *         schema:
 *           type: integer
 *         description: Filtrar por ID de estado
 *       - in: query
 *         name: autor
 *         schema:
 *           type: integer
 *         description: Filtrar por ID de autor
 *       - in: query
 *         name: buscar
 *         schema:
 *           type: string
 *         description: Buscar en título y contenido
 *       - in: query
 *         name: limite
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Número de resultados por página
 *       - in: query
 *         name: pagina
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página
 *     responses:
 *       200:
 *         description: Lista de noticias
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Noticia'
 *                 paginacion:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     pagina_actual:
 *                       type: integer
 *                     total_paginas:
 *                       type: integer
 *                     limite:
 *                       type: integer
 */
router.get('/', obtenerNoticias);

/**
 * @swagger
 * /api/noticias/{id}:
 *   get:
 *     summary: Obtener una noticia por ID
 *     tags: [Noticias]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la noticia
 *     responses:
 *       200:
 *         description: Noticia encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Noticia'
 *       404:
 *         description: Noticia no encontrada
 */
router.get('/:id', obtenerNoticia);

// Rutas protegidas (requieren autenticación)
router.use(proteger);

/**
 * @swagger
 * /api/noticias/usuario/mis-noticias:
 *   get:
 *     summary: Obtener las noticias del usuario autenticado
 *     tags: [Noticias]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de noticias del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Noticia'
 */
router.get('/usuario/mis-noticias', obtenerMisNoticias);

/**
 * @swagger
 * /api/noticias:
 *   post:
 *     summary: Crear una nueva noticia
 *     tags: [Noticias]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *               - contenido
 *               - id_categoria
 *               - id_estado
 *             properties:
 *               titulo:
 *                 type: string
 *                 example: Nueva tecnología revoluciona el mundo
 *               contenido:
 *                 type: string
 *                 example: El contenido completo de la noticia...
 *               resumen:
 *                 type: string
 *                 example: Un breve resumen
 *               imagen:
 *                 type: string
 *                 example: https://example.com/imagen.jpg
 *               id_categoria:
 *                 type: integer
 *                 example: 1
 *               id_estado:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Noticia creada exitosamente
 *       400:
 *         description: Datos inválidos
 */
router.post('/', validarNoticiaCrear, crearNoticia);

/**
 * @swagger
 * /api/noticias/{id}:
 *   put:
 *     summary: Actualizar una noticia existente
 *     tags: [Noticias]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               contenido:
 *                 type: string
 *               resumen:
 *                 type: string
 *               imagen:
 *                 type: string
 *               id_categoria:
 *                 type: integer
 *               id_estado:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Noticia actualizada
 *       404:
 *         description: Noticia no encontrada
 *   delete:
 *     summary: Eliminar una noticia
 *     tags: [Noticias]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Noticia eliminada
 *       404:
 *         description: Noticia no encontrada
 */
router.put('/:id', validarNoticiaActualizar, actualizarNoticia);
router.delete('/:id', eliminarNoticia);

module.exports = router;
