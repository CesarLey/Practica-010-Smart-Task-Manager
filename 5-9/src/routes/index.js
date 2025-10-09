/**
 * Router Principal
 * 
 * Centraliza todas las rutas de la aplicación
 */

const express = require('express');
const router = express.Router();

// Importar todas las rutas
const authRoutes = require('./authRoutes');
const usuarioRoutes = require('./usuarioRoutes');
const perfilRoutes = require('./perfilRoutes');
const estadoRoutes = require('./estadoRoutes');
const categoriaRoutes = require('./categoriaRoutes');
const noticiaRoutes = require('./noticiaRoutes');
const healthRoutes = require('./healthRoutes');

// Ruta de bienvenida/health check
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🎉 ¡Bienvenido a la API de Noticias!',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      usuarios: '/api/usuarios',
      perfiles: '/api/perfiles',
      estados: '/api/estados',
      categorias: '/api/categorias',
      noticias: '/api/noticias'
    },
    documentacion: 'Consulta el README.md para ver todos los endpoints disponibles'
  });
});

// Montar las rutas
router.use('/health', healthRoutes);           // /api/health
router.use('/auth', authRoutes);               // /api/auth/*
router.use('/usuarios', usuarioRoutes);        // /api/usuarios/*
router.use('/perfiles', perfilRoutes);         // /api/perfiles/*
router.use('/estados', estadoRoutes);          // /api/estados/*
router.use('/categorias', categoriaRoutes);    // /api/categorias/*
router.use('/noticias', noticiaRoutes);        // /api/noticias/*

module.exports = router;
