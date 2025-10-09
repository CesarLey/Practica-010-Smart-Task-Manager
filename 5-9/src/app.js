/**
 * Configuración de la aplicación Express
 * 
 * Aquí se configura Express con todos sus middlewares,
 * rutas y manejo de errores
 */

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const routes = require('./routes');
const { rutaNoEncontrada, manejarErrores } = require('./middlewares/errorHandler');
const { swaggerUi, swaggerSpec, swaggerUiOptions } = require('./config/swagger');

// Crear aplicación Express
const app = express();

// ===== MIDDLEWARES GLOBALES =====

// CORS - Permitir peticiones desde otros dominios
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*', // En producción, especifica el dominio permitido
  credentials: true
}));

// Morgan - Logger de peticiones HTTP (solo en desarrollo)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // Formato: :method :url :status :response-time ms
}

// Body Parser - Parsear JSON en el body de las peticiones
app.use(express.json({ limit: '10mb' }));

// Body Parser - Parsear URL-encoded data
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware para agregar headers de seguridad básicos
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// ===== RUTAS =====

// Documentación Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));

// Ruta para obtener el JSON de Swagger
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Montar todas las rutas bajo /api
app.use('/api', routes);

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🚀 API de Noticias - Express + Sequelize',
    version: '1.0.0',
    documentacion: {
      swagger: '/api-docs',
      postman: '/docs/postman_collection.json'
    },
    endpoints: {
      auth: '/api/auth',
      usuarios: '/api/usuarios',
      perfiles: '/api/perfiles',
      estados: '/api/estados',
      categorias: '/api/categorias',
      noticias: '/api/noticias'
    },
    estado: 'Funcionando correctamente ✅'
  });
});

// ===== MANEJO DE ERRORES =====

// Ruta no encontrada (404) - debe ir después de todas las rutas
app.use(rutaNoEncontrada);

// Middleware de manejo de errores - debe ser el último
app.use(manejarErrores);

module.exports = app;
