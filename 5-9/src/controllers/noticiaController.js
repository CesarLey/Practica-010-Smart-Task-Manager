/**
 * Controlador de Noticias
 * 
 * Maneja todas las operaciones CRUD para noticias
 * Incluye lógica para manejar relaciones con Usuario, Categoría y Estado
 */

const { Noticia, Usuario, Categoria, Estado, Perfil } = require('../models');
const { Op } = require('sequelize');

/**
 * Obtener todas las noticias
 * GET /api/noticias
 * 
 * Soporta filtros opcionales:
 * - categoria: ID de categoría
 * - estado: ID de estado
 * - autor: ID de usuario
 * - buscar: búsqueda en título y contenido
 */
const obtenerNoticias = async (req, res, next) => {
  try {
    // Obtener parámetros de consulta (query params)
    const { categoria, estado, autor, buscar, limite = 10, pagina = 1 } = req.query;
    
    // Construir filtros dinámicos
    const where = {};
    
    if (categoria) where.id_categoria = categoria;
    if (estado) where.id_estado = estado;
    if (autor) where.id_usuario = autor;
    
    // Búsqueda por texto en título o contenido
    if (buscar) {
      where[Op.or] = [
        { titulo: { [Op.like]: `%${buscar}%` } },
        { contenido: { [Op.like]: `%${buscar}%` } }
      ];
    }
    
    // Calcular offset para paginación
    const offset = (pagina - 1) * limite;
    
    // Obtener noticias con relaciones
    const { count, rows: noticias } = await Noticia.findAndCountAll({
      where,
      limit: parseInt(limite),
      offset: offset,
      include: [
        {
          model: Usuario,
          as: 'autor',
          attributes: ['id', 'nombre', 'email', 'avatar'],
          include: [
            {
              model: Perfil,
              as: 'perfil',
              attributes: ['nombre']
            }
          ]
        },
        {
          model: Categoria,
          as: 'categoria',
          attributes: ['id', 'nombre', 'slug', 'color', 'icono']
        },
        {
          model: Estado,
          as: 'estado',
          attributes: ['id', 'nombre', 'color']
        }
      ],
      order: [['fecha_publicacion', 'DESC'], ['createdAt', 'DESC']],
      distinct: true
    });
    
    res.status(200).json({
      success: true,
      count: count,
      pagina: parseInt(pagina),
      totalPaginas: Math.ceil(count / limite),
      data: noticias
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener una noticia por ID
 * GET /api/noticias/:id
 */
const obtenerNoticia = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const noticia = await Noticia.findByPk(id, {
      include: [
        {
          model: Usuario,
          as: 'autor',
          attributes: ['id', 'nombre', 'email', 'avatar'],
          include: [
            {
              model: Perfil,
              as: 'perfil',
              attributes: ['nombre']
            }
          ]
        },
        {
          model: Categoria,
          as: 'categoria',
          attributes: ['id', 'nombre', 'slug', 'color', 'icono', 'descripcion']
        },
        {
          model: Estado,
          as: 'estado',
          attributes: ['id', 'nombre', 'color']
        }
      ]
    });
    
    if (!noticia) {
      return res.status(404).json({
        success: false,
        message: `No se encontró la noticia con ID ${id}`
      });
    }
    
    // Incrementar contador de vistas
    await noticia.increment('vistas');
    
    res.status(200).json({
      success: true,
      data: noticia
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Crear una nueva noticia
 * POST /api/noticias
 * Requiere autenticación
 */
const crearNoticia = async (req, res, next) => {
  try {
    const { titulo, resumen, contenido, imagen, id_categoria, id_estado } = req.body;
    
    // El id_usuario viene del middleware de autenticación (req.usuario)
    const id_usuario = req.usuario.id;
    
    // Verificar que la categoría existe
    const categoria = await Categoria.findByPk(id_categoria);
    if (!categoria) {
      return res.status(400).json({
        success: false,
        message: `La categoría con ID ${id_categoria} no existe`
      });
    }
    
    // Verificar que el estado existe
    const estado = await Estado.findByPk(id_estado);
    if (!estado) {
      return res.status(400).json({
        success: false,
        message: `El estado con ID ${id_estado} no existe`
      });
    }
    
    // Crear la noticia
    const noticia = await Noticia.create({
      titulo,
      resumen,
      contenido,
      imagen,
      id_usuario,
      id_categoria,
      id_estado,
      fecha_publicacion: id_estado === 2 ? new Date() : null // Si estado es "Publicado"
    });
    
    // Obtener la noticia creada con relaciones
    const noticiaCreada = await Noticia.findByPk(noticia.id, {
      include: [
        { model: Usuario, as: 'autor', attributes: ['id', 'nombre', 'email'] },
        { model: Categoria, as: 'categoria' },
        { model: Estado, as: 'estado' }
      ]
    });
    
    res.status(201).json({
      success: true,
      message: 'Noticia creada exitosamente',
      data: noticiaCreada
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Actualizar una noticia
 * PUT /api/noticias/:id
 * Requiere autenticación
 */
const actualizarNoticia = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { titulo, resumen, contenido, imagen, id_categoria, id_estado } = req.body;
    
    const noticia = await Noticia.findByPk(id);
    
    if (!noticia) {
      return res.status(404).json({
        success: false,
        message: `No se encontró la noticia con ID ${id}`
      });
    }
    
    // Verificar que el usuario autenticado es el autor o es administrador
    const esAutor = noticia.id_usuario === req.usuario.id;
    const esAdmin = req.usuario.perfil.nivel_permiso >= 4; // Nivel 4 o superior es admin
    
    if (!esAutor && !esAdmin) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para editar esta noticia'
      });
    }
    
    // Verificar categoría si se actualiza
    if (id_categoria && id_categoria !== noticia.id_categoria) {
      const categoria = await Categoria.findByPk(id_categoria);
      if (!categoria) {
        return res.status(400).json({
          success: false,
          message: `La categoría con ID ${id_categoria} no existe`
        });
      }
    }
    
    // Verificar estado si se actualiza
    if (id_estado && id_estado !== noticia.id_estado) {
      const estado = await Estado.findByPk(id_estado);
      if (!estado) {
        return res.status(400).json({
          success: false,
          message: `El estado con ID ${id_estado} no existe`
        });
      }
    }
    
    // Actualizar noticia
    await noticia.update({
      titulo: titulo || noticia.titulo,
      resumen: resumen !== undefined ? resumen : noticia.resumen,
      contenido: contenido || noticia.contenido,
      imagen: imagen !== undefined ? imagen : noticia.imagen,
      id_categoria: id_categoria || noticia.id_categoria,
      id_estado: id_estado || noticia.id_estado,
      fecha_publicacion: id_estado === 2 && !noticia.fecha_publicacion ? new Date() : noticia.fecha_publicacion
    });
    
    // Obtener noticia actualizada con relaciones
    const noticiaActualizada = await Noticia.findByPk(id, {
      include: [
        { model: Usuario, as: 'autor', attributes: ['id', 'nombre', 'email'] },
        { model: Categoria, as: 'categoria' },
        { model: Estado, as: 'estado' }
      ]
    });
    
    res.status(200).json({
      success: true,
      message: 'Noticia actualizada exitosamente',
      data: noticiaActualizada
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Eliminar una noticia
 * DELETE /api/noticias/:id
 * Requiere autenticación
 */
const eliminarNoticia = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const noticia = await Noticia.findByPk(id);
    
    if (!noticia) {
      return res.status(404).json({
        success: false,
        message: `No se encontró la noticia con ID ${id}`
      });
    }
    
    // Verificar permisos
    const esAutor = noticia.id_usuario === req.usuario.id;
    const esAdmin = req.usuario.perfil.nivel_permiso >= 4;
    
    if (!esAutor && !esAdmin) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para eliminar esta noticia'
      });
    }
    
    await noticia.destroy();
    
    res.status(200).json({
      success: true,
      message: 'Noticia eliminada exitosamente'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener noticias del usuario autenticado
 * GET /api/noticias/mis-noticias
 * Requiere autenticación
 */
const obtenerMisNoticias = async (req, res, next) => {
  try {
    const id_usuario = req.usuario.id;
    
    const noticias = await Noticia.findAll({
      where: { id_usuario },
      include: [
        { model: Categoria, as: 'categoria' },
        { model: Estado, as: 'estado' }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    res.status(200).json({
      success: true,
      count: noticias.length,
      data: noticias
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  obtenerNoticias,
  obtenerNoticia,
  crearNoticia,
  actualizarNoticia,
  eliminarNoticia,
  obtenerMisNoticias
};
