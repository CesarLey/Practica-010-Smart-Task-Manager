/**
 * Rutas de Health Check
 * 
 * Endpoints para verificar el estado de la API
 */

const express = require('express');
const router = express.Router();
const { verificarSalud } = require('../controllers/healthController');

/**
 * @swagger
 * tags:
 *   name: Health
 *   description: Verificación de salud del sistema
 */

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Verificar el estado de salud de la API
 *     tags: [Health]
 *     security: []
 *     responses:
 *       200:
 *         description: API funcionando correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: API funcionando correctamente
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 uptime:
 *                   type: number
 *                   example: 12345.67
 *                 environment:
 *                   type: string
 *                   example: production
 *                 database:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: connected
 *       503:
 *         description: Servicio no disponible
 */
router.get('/', verificarSalud);

module.exports = router;