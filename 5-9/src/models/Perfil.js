/**
 * Modelo Perfil
 * 
 * Representa los diferentes roles o perfiles de usuario
 * en el sistema (Admin, Editor, Usuario, etc.)
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Perfil = sequelize.define('Perfil', {
  // ID primario
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: 'Identificador único del perfil'
  },
  
  // Nombre del perfil
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: {
        msg: 'El nombre del perfil no puede estar vacío'
      },
      len: {
        args: [3, 50],
        msg: 'El nombre debe tener entre 3 y 50 caracteres'
      }
    },
    comment: 'Nombre del perfil (ej: Administrador, Editor, Usuario)'
  },
  
  // Descripción del perfil
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Descripción de los permisos y responsabilidades del perfil'
  },
  
  // Nivel de permisos (1=bajo, 5=alto)
  nivel_permiso: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: {
      min: {
        args: 1,
        msg: 'El nivel mínimo de permiso es 1'
      },
      max: {
        args: 5,
        msg: 'El nivel máximo de permiso es 5'
      }
    },
    comment: 'Nivel de permisos del perfil (1=básico, 5=administrador)'
  }
}, {
  tableName: 'perfiles',
  timestamps: true,
  comment: 'Tabla de perfiles de usuario (roles)'
});

module.exports = Perfil;
