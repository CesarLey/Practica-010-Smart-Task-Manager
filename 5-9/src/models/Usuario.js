/**
 * Modelo Usuario
 * 
 * Representa a los usuarios del sistema.
 * Incluye autenticación con contraseñas encriptadas.
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

const Usuario = sequelize.define('Usuario', {
  // ID primario
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: 'Identificador único del usuario'
  },
  
  // Nombre completo del usuario
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El nombre no puede estar vacío'
      },
      len: {
        args: [3, 100],
        msg: 'El nombre debe tener entre 3 y 100 caracteres'
      }
    },
    comment: 'Nombre completo del usuario'
  },
  
  // Email único para login
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: {
      msg: 'Este email ya está registrado'
    },
    validate: {
      notEmpty: {
        msg: 'El email no puede estar vacío'
      },
      isEmail: {
        msg: 'Debe proporcionar un email válido'
      }
    },
    comment: 'Correo electrónico único del usuario'
  },
  
  // Contraseña encriptada
  password: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'La contraseña no puede estar vacía'
      },
      len: {
        args: [6, 100],
        msg: 'La contraseña debe tener al menos 6 caracteres'
      }
    },
    comment: 'Contraseña encriptada del usuario'
  },
  
  // Teléfono opcional
  telefono: {
    type: DataTypes.STRING(20),
    allowNull: true,
    validate: {
      is: {
        args: /^[\d\s\-\+\(\)]+$/,
        msg: 'El teléfono solo puede contener números y símbolos básicos'
      }
    },
    comment: 'Número de teléfono del usuario'
  },
  
  // Avatar/foto de perfil
  avatar: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'URL o ruta de la imagen de perfil'
  },
  
  // Relación con Perfil (rol)
  id_perfil: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'perfiles',
      key: 'id'
    },
    comment: 'ID del perfil/rol del usuario'
  },
  
  // Relación con Estado
  id_estado: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'estados',
      key: 'id'
    },
    comment: 'ID del estado del usuario (activo/inactivo)'
  }
}, {
  tableName: 'usuarios',
  timestamps: true,
  comment: 'Tabla de usuarios del sistema',
  
  // Hooks (funciones que se ejecutan automáticamente)
  hooks: {
    // Antes de crear un usuario, encriptar la contraseña
    beforeCreate: async (usuario) => {
      if (usuario.password) {
        const salt = await bcrypt.genSalt(10);
        usuario.password = await bcrypt.hash(usuario.password, salt);
      }
    },
    
    // Antes de actualizar, encriptar la contraseña si cambió
    beforeUpdate: async (usuario) => {
      if (usuario.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        usuario.password = await bcrypt.hash(usuario.password, salt);
      }
    }
  }
});

/**
 * Método de instancia para comparar contraseñas
 * @param {string} passwordIngresado - Contraseña sin encriptar
 * @returns {Promise<boolean>} - true si la contraseña coincide
 */
Usuario.prototype.compararPassword = async function(passwordIngresado) {
  return await bcrypt.compare(passwordIngresado, this.password);
};

module.exports = Usuario;
