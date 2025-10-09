/**
 * Controlador de Autenticación
 * 
 * Maneja el registro de usuarios y el login con JWT
 */

const jwt = require('jsonwebtoken');
const { Usuario, Perfil, Estado } = require('../models');

/**
 * Registrar un nuevo usuario
 * POST /api/auth/register
 */
const registrar = async (req, res, next) => {
  try {
    const { nombre, email, password, telefono, id_perfil, id_estado } = req.body;
    
    // Verificar que el perfil existe
    const perfil = await Perfil.findByPk(id_perfil || 3); // Default: Usuario normal (ID 3)
    if (!perfil) {
      return res.status(400).json({
        success: false,
        message: 'El perfil especificado no existe'
      });
    }
    
    // Verificar que el estado existe
    const estado = await Estado.findByPk(id_estado || 1); // Default: Activo (ID 1)
    if (!estado) {
      return res.status(400).json({
        success: false,
        message: 'El estado especificado no existe'
      });
    }
    
    // Crear usuario (la contraseña se encripta automáticamente)
    const usuario = await Usuario.create({
      nombre,
      email,
      password,
      telefono,
      id_perfil: id_perfil || 3,
      id_estado: id_estado || 1
    });
    
    // Generar token JWT
    const token = generarToken(usuario.id);
    
    // Obtener usuario sin contraseña
    const usuarioRespuesta = await Usuario.findByPk(usuario.id, {
      attributes: { exclude: ['password'] },
      include: [
        { model: Perfil, as: 'perfil', attributes: ['id', 'nombre', 'nivel_permiso'] },
        { model: Estado, as: 'estado', attributes: ['id', 'nombre'] }
      ]
    });
    
    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      token,
      data: usuarioRespuesta
    });
  } catch (error) {
    // Manejar email duplicado
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'El email ya está registrado'
      });
    }
    next(error);
  }
};

/**
 * Iniciar sesión
 * POST /api/auth/login
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Validar que se envíen email y password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Por favor proporciona email y contraseña'
      });
    }
    
    // Buscar usuario por email
    const usuario = await Usuario.findOne({
      where: { email },
      include: [
        { model: Perfil, as: 'perfil', attributes: ['id', 'nombre', 'nivel_permiso'] },
        { model: Estado, as: 'estado', attributes: ['id', 'nombre'] }
      ]
    });
    
    // Verificar que el usuario existe
    if (!usuario) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }
    
    // Verificar que el usuario está activo
    if (usuario.estado.nombre.toLowerCase() !== 'activo') {
      return res.status(401).json({
        success: false,
        message: 'Tu cuenta está inactiva. Contacta al administrador.'
      });
    }
    
    // Comparar contraseña
    const passwordValido = await usuario.compararPassword(password);
    
    if (!passwordValido) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }
    
    // Generar token JWT
    const token = generarToken(usuario.id);
    
    // Preparar respuesta sin contraseña
    const usuarioRespuesta = {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      telefono: usuario.telefono,
      avatar: usuario.avatar,
      perfil: usuario.perfil,
      estado: usuario.estado,
      createdAt: usuario.createdAt
    };
    
    res.status(200).json({
      success: true,
      message: 'Inicio de sesión exitoso',
      token,
      data: usuarioRespuesta
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener datos del usuario autenticado
 * GET /api/auth/me
 * Requiere autenticación
 */
const obtenerPerfil = async (req, res, next) => {
  try {
    // req.usuario viene del middleware de autenticación
    const usuario = await Usuario.findByPk(req.usuario.id, {
      attributes: { exclude: ['password'] },
      include: [
        { model: Perfil, as: 'perfil' },
        { model: Estado, as: 'estado' }
      ]
    });
    
    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }
    
    res.status(200).json({
      success: true,
      data: usuario
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Función auxiliar para generar token JWT
 * @param {number} id - ID del usuario
 * @returns {string} Token JWT
 */
const generarToken = (id) => {
  return jwt.sign(
    { id }, // Payload
    process.env.JWT_SECRET, // Clave secreta
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' } // Expiración
  );
};

module.exports = {
  registrar,
  login,
  obtenerPerfil
};
