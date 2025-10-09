/**
 * Modelo Noticia
 * 
 * Representa las noticias publicadas en el sistema.
 * Incluye título, contenido, autor, categoría y estado.
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Noticia = sequelize.define('Noticia', {
  // ID primario
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: 'Identificador único de la noticia'
  },
  
  // Título de la noticia
  titulo: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El título no puede estar vacío'
      },
      len: {
        args: [10, 200],
        msg: 'El título debe tener entre 10 y 200 caracteres'
      }
    },
    comment: 'Título principal de la noticia'
  },
  
  // Slug para URL amigable
  slug: {
    type: DataTypes.STRING(200),
    allowNull: true,
    unique: true,
    comment: 'URL amigable generada del título'
  },
  
  // Resumen breve
  resumen: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      len: {
        args: [0, 500],
        msg: 'El resumen no puede exceder los 500 caracteres'
      }
    },
    comment: 'Resumen o extracto de la noticia'
  },
  
  // Contenido completo
  contenido: {
    type: DataTypes.TEXT('long'),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El contenido no puede estar vacío'
      },
      len: {
        args: [50, 50000],
        msg: 'El contenido debe tener entre 50 y 50000 caracteres'
      }
    },
    comment: 'Contenido completo de la noticia'
  },
  
  // Imagen destacada
  imagen: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'URL o ruta de la imagen principal'
  },
  
  // Número de vistas
  vistas: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: 'Contador de vistas de la noticia'
  },
  
  // Fecha de publicación
  fecha_publicacion: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Fecha y hora de publicación'
  },
  
  // Relación con Usuario (autor)
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'usuarios',
      key: 'id'
    },
    comment: 'ID del usuario que creó la noticia'
  },
  
  // Relación con Categoría
  id_categoria: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'categorias',
      key: 'id'
    },
    comment: 'ID de la categoría de la noticia'
  },
  
  // Relación con Estado
  id_estado: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'estados',
      key: 'id'
    },
    comment: 'ID del estado de la noticia (publicado, borrador, etc.)'
  }
}, {
  tableName: 'noticias',
  timestamps: true,
  comment: 'Tabla de noticias del sistema',
  
  // Hook para generar slug automáticamente
  hooks: {
    beforeValidate: (noticia) => {
      if (noticia.titulo && !noticia.slug) {
        // Convertir título a slug
        noticia.slug = noticia.titulo
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '')
          + '-' + Date.now(); // Agregar timestamp para unicidad
      }
    },
    
    // Establecer fecha de publicación al crear si el estado es "publicado"
    beforeCreate: (noticia) => {
      if (noticia.id_estado === 2 && !noticia.fecha_publicacion) { // Asumiendo que 2 es "Publicado"
        noticia.fecha_publicacion = new Date();
      }
    }
  }
});

module.exports = Noticia;
