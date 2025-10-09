/**
 * Health Check Endpoint
 * 
 * Verifica el estado de la API y la conexión a la base de datos
 * Útil para monitoreo en producción (Render, Uptime Robot, etc.)
 */

const { sequelize } = require('../config/database');

/**
 * Verificar el estado de salud de la API
 * GET /api/health
 */
const verificarSalud = async (req, res) => {
  try {
    // Verificar conexión a la base de datos
    await sequelize.authenticate();
    
    const estado = {
      success: true,
      message: 'API funcionando correctamente',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0',
      database: {
        status: 'connected',
        host: process.env.DB_HOST,
        name: process.env.DB_NAME
      },
      memory: {
        total: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)} MB`,
        used: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB`
      }
    };
    
    res.status(200).json(estado);
  } catch (error) {
    res.status(503).json({
      success: false,
      message: 'Error en el servicio',
      error: error.message,
      database: {
        status: 'disconnected'
      }
    });
  }
};

module.exports = {
  verificarSalud
};