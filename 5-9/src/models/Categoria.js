/**
 * Modelo Categoria
 * 
 * Representa las categorías para clasificar noticias
 * (Deportes, Tecnología, Política, etc.)
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Categoria = sequelize.define('Categoria', {
  // ID primario
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: 'Identificador único de la categoría'
  },
  
  // Nombre de la categoría
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: {
        msg: 'El nombre de la categoría no puede estar vacío'
      },
      len: {
        args: [3, 50],
        msg: 'El nombre debe tener entre 3 y 50 caracteres'
      }
    },
    comment: 'Nombre de la categoría (ej: Deportes, Tecnología)'
  },
  
  // Descripción de la categoría
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Descripción detallada de la categoría'
  },
  
  // Slug para URLs amigables
  slug: {
    type: DataTypes.STRING(50),
    allowNull: true,
    unique: true,
    comment: 'URL amigable (ej: tecnologia, deportes)'
  },
  
  // Icono representativo
  icono: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: 'Nombre del icono o clase CSS para la categoría'
  },
  
  // Color para UI
  color: {
    type: DataTypes.STRING(7),
    allowNull: true,
    defaultValue: '#007bff',
    validate: {
      is: {
        args: /^#[0-9A-Fa-f]{6}$/,
        msg: 'El color debe ser un código hexadecimal válido'
      }
    },
    comment: 'Color hexadecimal para la categoría'
  }
}, {
  tableName: 'categorias',
  timestamps: true,
  comment: 'Tabla de categorías para clasificar noticias',
  
  // Hook para generar slug automáticamente
  hooks: {
    beforeValidate: (categoria) => {
      if (categoria.nombre && !categoria.slug) {
        // Convertir nombre a slug (minúsculas, sin espacios)
        categoria.slug = categoria.nombre
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
          .replace(/[^a-z0-9]+/g, '-')     // Reemplazar caracteres especiales
          .replace(/^-+|-+$/g, '');        // Eliminar guiones al inicio/final
      }
    }
  }
});

module.exports = Categoria;
