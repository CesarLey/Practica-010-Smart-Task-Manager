/**
 * Controlador de Categorías
 * 
 * Maneja todas las operaciones CRUD para las categorías de noticias
 */

const { Categoria } = require('../models');

/**
 * Obtener todas las categorías
 * GET /api/categorias
 */
const obtenerCategorias = async (req, res, next) => {
  try {
    const categorias = await Categoria.findAll({
      order: [['nombre', 'ASC']]
    });
    
    res.status(200).json({
      success: true,
      count: categorias.length,
      data: categorias
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener una categoría por ID
 * GET /api/categorias/:id
 */
const obtenerCategoria = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const categoria = await Categoria.findByPk(id);
    
    if (!categoria) {
      return res.status(404).json({
        success: false,
        message: `No se encontró la categoría con ID ${id}`
      });
    }
    
    res.status(200).json({
      success: true,
      data: categoria
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Crear una nueva categoría
 * POST /api/categorias
 */
const crearCategoria = async (req, res, next) => {
  try {
    const { nombre, descripcion, icono, color } = req.body;
    
    const categoria = await Categoria.create({
      nombre,
      descripcion,
      icono,
      color
    });
    
    res.status(201).json({
      success: true,
      message: 'Categoría creada exitosamente',
      data: categoria
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Actualizar una categoría
 * PUT /api/categorias/:id
 */
const actualizarCategoria = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, icono, color } = req.body;
    
    const categoria = await Categoria.findByPk(id);
    
    if (!categoria) {
      return res.status(404).json({
        success: false,
        message: `No se encontró la categoría con ID ${id}`
      });
    }
    
    await categoria.update({
      nombre: nombre || categoria.nombre,
      descripcion: descripcion !== undefined ? descripcion : categoria.descripcion,
      icono: icono !== undefined ? icono : categoria.icono,
      color: color || categoria.color
    });
    
    res.status(200).json({
      success: true,
      message: 'Categoría actualizada exitosamente',
      data: categoria
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Eliminar una categoría
 * DELETE /api/categorias/:id
 */
const eliminarCategoria = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const categoria = await Categoria.findByPk(id);
    
    if (!categoria) {
      return res.status(404).json({
        success: false,
        message: `No se encontró la categoría con ID ${id}`
      });
    }
    
    await categoria.destroy();
    
    res.status(200).json({
      success: true,
      message: 'Categoría eliminada exitosamente'
    });
  } catch (error) {
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'No se puede eliminar la categoría porque tiene noticias asociadas'
      });
    }
    next(error);
  }
};

module.exports = {
  obtenerCategorias,
  obtenerCategoria,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria
};
