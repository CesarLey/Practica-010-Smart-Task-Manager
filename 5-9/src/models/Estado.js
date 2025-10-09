/**
 * Modelo Estado
 * 
 * Representa los diferentes estados que pueden tener
 * usuarios, noticias y otros recursos.
 * Ejemplos: Activo, Inactivo, Pendiente, Publicado, etc.
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Estado = sequelize.define('Estado', {
  // ID primario (se crea automáticamente)
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: 'Identificador único del estado'
  },
  
  // Nombre del estado
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: {
        msg: 'El nombre del estado no puede estar vacío'
      },
      len: {
        args: [3, 50],
        msg: 'El nombre debe tener entre 3 y 50 caracteres'
      }
    },
    comment: 'Nombre del estado (ej: Activo, Inactivo)'
  },
  
  // Descripción opcional del estado
  descripcion: {
    type: DataTypes.STRING(200),
    allowNull: true,
    comment: 'Descripción detallada del estado'
  },
  
  // Color para UI (opcional)
  color: {
    type: DataTypes.STRING(7),
    allowNull: true,
    defaultValue: '#6c757d',
    validate: {
      is: {
        args: /^#[0-9A-Fa-f]{6}$/,
        msg: 'El color debe ser un código hexadecimal válido (ej: #FF5733)'
      }
    },
    comment: 'Color hexadecimal para representar el estado en UI'
  }
}, {
  tableName: 'estados',
  timestamps: true, // Añade createdAt y updatedAt
  comment: 'Tabla de estados para usuarios, noticias y otros recursos'
});

module.exports = Estado;
