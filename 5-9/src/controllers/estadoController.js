/**
 * Controlador de Estados
 * 
 * Maneja todas las operaciones CRUD para los estados:
 * - Crear estado
 * - Obtener todos los estados
 * - Obtener un estado por ID
 * - Actualizar estado
 * - Eliminar estado
 */

const { Estado } = require('../models');

/**
 * Obtener todos los estados
 * GET /api/estados
 */
const obtenerEstados = async (req, res, next) => {
  try {
    const estados = await Estado.findAll({
      order: [['nombre', 'ASC']] // Ordenar por nombre alfabéticamente
    });
    
    res.status(200).json({
      success: true,
      count: estados.length,
      data: estados
    });
  } catch (error) {
    next(error); // Pasar error al middleware de manejo de errores
  }
};

/**
 * Obtener un estado por ID
 * GET /api/estados/:id
 */
const obtenerEstado = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const estado = await Estado.findByPk(id);
    
    if (!estado) {
      return res.status(404).json({
        success: false,
        message: `No se encontró el estado con ID ${id}`
      });
    }
    
    res.status(200).json({
      success: true,
      data: estado
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Crear un nuevo estado
 * POST /api/estados
 */
const crearEstado = async (req, res, next) => {
  try {
    const { nombre, descripcion, color } = req.body;
    
    // Crear el estado
    const estado = await Estado.create({
      nombre,
      descripcion,
      color
    });
    
    res.status(201).json({
      success: true,
      message: 'Estado creado exitosamente',
      data: estado
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Actualizar un estado
 * PUT /api/estados/:id
 */
const actualizarEstado = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, color } = req.body;
    
    // Buscar el estado
    const estado = await Estado.findByPk(id);
    
    if (!estado) {
      return res.status(404).json({
        success: false,
        message: `No se encontró el estado con ID ${id}`
      });
    }
    
    // Actualizar el estado
    await estado.update({
      nombre: nombre || estado.nombre,
      descripcion: descripcion !== undefined ? descripcion : estado.descripcion,
      color: color || estado.color
    });
    
    res.status(200).json({
      success: true,
      message: 'Estado actualizado exitosamente',
      data: estado
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Eliminar un estado
 * DELETE /api/estados/:id
 */
const eliminarEstado = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const estado = await Estado.findByPk(id);
    
    if (!estado) {
      return res.status(404).json({
        success: false,
        message: `No se encontró el estado con ID ${id}`
      });
    }
    
    // Eliminar el estado
    await estado.destroy();
    
    res.status(200).json({
      success: true,
      message: 'Estado eliminado exitosamente'
    });
  } catch (error) {
    // Si hay error por foreign key (estados asociados), informar al usuario
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'No se puede eliminar el estado porque tiene registros asociados'
      });
    }
    next(error);
  }
};

module.exports = {
  obtenerEstados,
  obtenerEstado,
  crearEstado,
  actualizarEstado,
  eliminarEstado
};
