/**
 * Controlador de Perfiles
 * 
 * Maneja todas las operaciones CRUD para los perfiles (roles)
 */

const { Perfil } = require('../models');

/**
 * Obtener todos los perfiles
 * GET /api/perfiles
 */
const obtenerPerfiles = async (req, res, next) => {
  try {
    const perfiles = await Perfil.findAll({
      order: [['nivel_permiso', 'DESC']] // Ordenar por nivel de permisos
    });
    
    res.status(200).json({
      success: true,
      count: perfiles.length,
      data: perfiles
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener un perfil por ID
 * GET /api/perfiles/:id
 */
const obtenerPerfil = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const perfil = await Perfil.findByPk(id);
    
    if (!perfil) {
      return res.status(404).json({
        success: false,
        message: `No se encontró el perfil con ID ${id}`
      });
    }
    
    res.status(200).json({
      success: true,
      data: perfil
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Crear un nuevo perfil
 * POST /api/perfiles
 */
const crearPerfil = async (req, res, next) => {
  try {
    const { nombre, descripcion, nivel_permiso } = req.body;
    
    const perfil = await Perfil.create({
      nombre,
      descripcion,
      nivel_permiso
    });
    
    res.status(201).json({
      success: true,
      message: 'Perfil creado exitosamente',
      data: perfil
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Actualizar un perfil
 * PUT /api/perfiles/:id
 */
const actualizarPerfil = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, nivel_permiso } = req.body;
    
    const perfil = await Perfil.findByPk(id);
    
    if (!perfil) {
      return res.status(404).json({
        success: false,
        message: `No se encontró el perfil con ID ${id}`
      });
    }
    
    await perfil.update({
      nombre: nombre || perfil.nombre,
      descripcion: descripcion !== undefined ? descripcion : perfil.descripcion,
      nivel_permiso: nivel_permiso || perfil.nivel_permiso
    });
    
    res.status(200).json({
      success: true,
      message: 'Perfil actualizado exitosamente',
      data: perfil
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Eliminar un perfil
 * DELETE /api/perfiles/:id
 */
const eliminarPerfil = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const perfil = await Perfil.findByPk(id);
    
    if (!perfil) {
      return res.status(404).json({
        success: false,
        message: `No se encontró el perfil con ID ${id}`
      });
    }
    
    await perfil.destroy();
    
    res.status(200).json({
      success: true,
      message: 'Perfil eliminado exitosamente'
    });
  } catch (error) {
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'No se puede eliminar el perfil porque tiene usuarios asociados'
      });
    }
    next(error);
  }
};

module.exports = {
  obtenerPerfiles,
  obtenerPerfil,
  crearPerfil,
  actualizarPerfil,
  eliminarPerfil
};
