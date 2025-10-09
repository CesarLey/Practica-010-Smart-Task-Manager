/**
 * Controlador de Usuarios
 * 
 * Maneja todas las operaciones CRUD para usuarios
 * Incluye lógica para manejar las relaciones con Perfil y Estado
 */

const { Usuario, Perfil, Estado } = require('../models');

/**
 * Obtener todos los usuarios
 * GET /api/usuarios
 */
const obtenerUsuarios = async (req, res, next) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: { exclude: ['password'] }, // Excluir contraseña de la respuesta
      include: [
        {
          model: Perfil,
          as: 'perfil',
          attributes: ['id', 'nombre', 'nivel_permiso']
        },
        {
          model: Estado,
          as: 'estado',
          attributes: ['id', 'nombre', 'color']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    res.status(200).json({
      success: true,
      count: usuarios.length,
      data: usuarios
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener un usuario por ID
 * GET /api/usuarios/:id
 */
const obtenerUsuario = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const usuario = await Usuario.findByPk(id, {
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Perfil,
          as: 'perfil',
          attributes: ['id', 'nombre', 'nivel_permiso', 'descripcion']
        },
        {
          model: Estado,
          as: 'estado',
          attributes: ['id', 'nombre', 'color']
        }
      ]
    });
    
    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: `No se encontró el usuario con ID ${id}`
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
 * Crear un nuevo usuario
 * POST /api/usuarios
 */
const crearUsuario = async (req, res, next) => {
  try {
    const { nombre, email, password, telefono, avatar, id_perfil, id_estado } = req.body;
    
    // Verificar si el perfil existe
    const perfil = await Perfil.findByPk(id_perfil);
    if (!perfil) {
      return res.status(400).json({
        success: false,
        message: `El perfil con ID ${id_perfil} no existe`
      });
    }
    
    // Verificar si el estado existe
    const estado = await Estado.findByPk(id_estado);
    if (!estado) {
      return res.status(400).json({
        success: false,
        message: `El estado con ID ${id_estado} no existe`
      });
    }
    
    // Crear el usuario (la contraseña se encripta automáticamente por el hook)
    const usuario = await Usuario.create({
      nombre,
      email,
      password,
      telefono,
      avatar,
      id_perfil,
      id_estado
    });
    
    // Obtener el usuario creado con las relaciones
    const usuarioCreado = await Usuario.findByPk(usuario.id, {
      attributes: { exclude: ['password'] },
      include: [
        { model: Perfil, as: 'perfil' },
        { model: Estado, as: 'estado' }
      ]
    });
    
    res.status(201).json({
      success: true,
      message: 'Usuario creado exitosamente',
      data: usuarioCreado
    });
  } catch (error) {
    // Manejar error de email duplicado
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
 * Actualizar un usuario
 * PUT /api/usuarios/:id
 */
const actualizarUsuario = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre, email, password, telefono, avatar, id_perfil, id_estado } = req.body;
    
    const usuario = await Usuario.findByPk(id);
    
    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: `No se encontró el usuario con ID ${id}`
      });
    }
    
    // Si se actualiza el perfil, verificar que existe
    if (id_perfil && id_perfil !== usuario.id_perfil) {
      const perfil = await Perfil.findByPk(id_perfil);
      if (!perfil) {
        return res.status(400).json({
          success: false,
          message: `El perfil con ID ${id_perfil} no existe`
        });
      }
    }
    
    // Si se actualiza el estado, verificar que existe
    if (id_estado && id_estado !== usuario.id_estado) {
      const estado = await Estado.findByPk(id_estado);
      if (!estado) {
        return res.status(400).json({
          success: false,
          message: `El estado con ID ${id_estado} no existe`
        });
      }
    }
    
    // Actualizar usuario (la contraseña se encripta automáticamente si cambia)
    await usuario.update({
      nombre: nombre || usuario.nombre,
      email: email || usuario.email,
      password: password || usuario.password,
      telefono: telefono !== undefined ? telefono : usuario.telefono,
      avatar: avatar !== undefined ? avatar : usuario.avatar,
      id_perfil: id_perfil || usuario.id_perfil,
      id_estado: id_estado || usuario.id_estado
    });
    
    // Obtener el usuario actualizado con relaciones
    const usuarioActualizado = await Usuario.findByPk(id, {
      attributes: { exclude: ['password'] },
      include: [
        { model: Perfil, as: 'perfil' },
        { model: Estado, as: 'estado' }
      ]
    });
    
    res.status(200).json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      data: usuarioActualizado
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'El email ya está registrado por otro usuario'
      });
    }
    next(error);
  }
};

/**
 * Eliminar un usuario
 * DELETE /api/usuarios/:id
 */
const eliminarUsuario = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const usuario = await Usuario.findByPk(id);
    
    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: `No se encontró el usuario con ID ${id}`
      });
    }
    
    await usuario.destroy();
    
    res.status(200).json({
      success: true,
      message: 'Usuario eliminado exitosamente'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  obtenerUsuarios,
  obtenerUsuario,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario
};
