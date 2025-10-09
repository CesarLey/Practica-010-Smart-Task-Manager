/**
 * Archivo índice de modelos
 * 
 * Importa todos los modelos y establece las relaciones entre ellos.
 * Este archivo centraliza la configuración de las asociaciones de Sequelize.
 */

const { sequelize } = require('../config/database');

// Importar todos los modelos
const Estado = require('./Estado');
const Perfil = require('./Perfil');
const Usuario = require('./Usuario');
const Categoria = require('./Categoria');
const Noticia = require('./Noticia');

/**
 * DEFINICIÓN DE RELACIONES ENTRE MODELOS
 * 
 * Sequelize soporta 4 tipos de asociaciones:
 * - belongsTo: Pertenece a (Many-to-One)
 * - hasOne: Tiene uno (One-to-One)
 * - hasMany: Tiene muchos (One-to-Many)
 * - belongsToMany: Pertenece a muchos (Many-to-Many)
 */

// ===== RELACIONES DE USUARIO =====

// Un Usuario pertenece a un Perfil (rol)
Usuario.belongsTo(Perfil, {
  foreignKey: 'id_perfil',
  as: 'perfil', // Alias para usar en las consultas: usuario.perfil
  onDelete: 'RESTRICT', // No permitir eliminar perfil si tiene usuarios
  onUpdate: 'CASCADE'    // Actualizar en cascada
});

// Un Perfil puede tener muchos Usuarios
Perfil.hasMany(Usuario, {
  foreignKey: 'id_perfil',
  as: 'usuarios',
  onDelete: 'RESTRICT'
});

// Un Usuario pertenece a un Estado
Usuario.belongsTo(Estado, {
  foreignKey: 'id_estado',
  as: 'estado',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
});

// Un Estado puede tener muchos Usuarios
Estado.hasMany(Usuario, {
  foreignKey: 'id_estado',
  as: 'usuarios',
  onDelete: 'RESTRICT'
});

// ===== RELACIONES DE NOTICIA =====

// Una Noticia pertenece a un Usuario (autor)
Noticia.belongsTo(Usuario, {
  foreignKey: 'id_usuario',
  as: 'autor', // Alias: noticia.autor
  onDelete: 'CASCADE', // Si se elimina el usuario, eliminar sus noticias
  onUpdate: 'CASCADE'
});

// Un Usuario puede tener muchas Noticias
Usuario.hasMany(Noticia, {
  foreignKey: 'id_usuario',
  as: 'noticias',
  onDelete: 'CASCADE'
});

// Una Noticia pertenece a una Categoría
Noticia.belongsTo(Categoria, {
  foreignKey: 'id_categoria',
  as: 'categoria',
  onDelete: 'RESTRICT', // No permitir eliminar categoría si tiene noticias
  onUpdate: 'CASCADE'
});

// Una Categoría puede tener muchas Noticias
Categoria.hasMany(Noticia, {
  foreignKey: 'id_categoria',
  as: 'noticias',
  onDelete: 'RESTRICT'
});

// Una Noticia pertenece a un Estado
Noticia.belongsTo(Estado, {
  foreignKey: 'id_estado',
  as: 'estado',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
});

// Un Estado puede tener muchas Noticias
Estado.hasMany(Noticia, {
  foreignKey: 'id_estado',
  as: 'noticias',
  onDelete: 'RESTRICT'
});

/**
 * Exportar todos los modelos y la instancia de sequelize
 * Esto permite importar cualquier modelo desde un solo lugar
 * 
 * Ejemplo de uso:
 * const { Usuario, Noticia, sequelize } = require('./models');
 */
module.exports = {
  sequelize,
  Estado,
  Perfil,
  Usuario,
  Categoria,
  Noticia
};
