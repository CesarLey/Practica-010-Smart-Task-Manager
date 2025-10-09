/**
 * Middleware de Autenticación con JWT
 * 
 * Verifica que el usuario esté autenticado mediante un token JWT válido
 * y agrega la información del usuario a req.usuario
 */

const jwt = require('jsonwebtoken');
const { Usuario, Perfil, Estado } = require('../models');

/**
 * Proteger rutas - Requiere autenticación
 */
const proteger = async (req, res, next) => {
  try {
    let token;
    
    // Verificar si el token viene en el header Authorization
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      // Extraer el token: "Bearer TOKEN_AQUI"
      token = req.headers.authorization.split(' ')[1];
    }
    
    // Verificar que el token existe
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No autorizado. Token no proporcionado.'
      });
    }
    
    try {
      // Verificar y decodificar el token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Buscar el usuario por el ID que viene en el token
      const usuario = await Usuario.findByPk(decoded.id, {
        attributes: { exclude: ['password'] },
        include: [
          {
            model: Perfil,
            as: 'perfil',
            attributes: ['id', 'nombre', 'nivel_permiso']
          },
          {
            model: Estado,
            as: 'estado',
            attributes: ['id', 'nombre']
          }
        ]
      });
      
      // Verificar que el usuario existe
      if (!usuario) {
        return res.status(401).json({
          success: false,
          message: 'No autorizado. Usuario no encontrado.'
        });
      }
      
      // Verificar que el usuario está activo
      if (usuario.estado.nombre.toLowerCase() !== 'activo') {
        return res.status(401).json({
          success: false,
          message: 'Tu cuenta está inactiva.'
        });
      }
      
      // Agregar el usuario a la request para usarlo en los controladores
      req.usuario = usuario;
      
      next(); // Continuar con el siguiente middleware o controlador
      
    } catch (error) {
      // Token inválido o expirado
      return res.status(401).json({
        success: false,
        message: 'Token inválido o expirado'
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Autorizar por nivel de permiso
 * @param {number} nivelMinimo - Nivel mínimo requerido
 */
const autorizarPorNivel = (nivelMinimo) => {
  return (req, res, next) => {
    // Verificar que el usuario tenga el nivel de permiso requerido
    if (req.usuario.perfil.nivel_permiso < nivelMinimo) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos suficientes para realizar esta acción'
      });
    }
    next();
  };
};

/**
 * Autorizar por nombre de perfil
 * @param {...string} perfilesPermitidos - Nombres de perfiles permitidos
 */
const autorizarPorPerfil = (...perfilesPermitidos) => {
  return (req, res, next) => {
    const perfilUsuario = req.usuario.perfil.nombre.toLowerCase();
    const permitido = perfilesPermitidos.some(
      perfil => perfil.toLowerCase() === perfilUsuario
    );
    
    if (!permitido) {
      return res.status(403).json({
        success: false,
        message: `Solo los perfiles ${perfilesPermitidos.join(', ')} pueden realizar esta acción`
      });
    }
    next();
  };
};

module.exports = {
  proteger,
  autorizarPorNivel,
  autorizarPorPerfil
};
