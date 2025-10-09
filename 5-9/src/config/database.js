/**
 * Configuración de la conexión a la base de datos con Sequelize
 * 
 * Sequelize es un ORM (Object-Relational Mapping) que nos permite
 * trabajar con bases de datos SQL usando JavaScript, sin escribir
 * consultas SQL directamente.
 */

const { Sequelize } = require('sequelize');
require('dotenv').config();

// Crear instancia de Sequelize con la configuración de la base de datos
const sequelize = new Sequelize(
  process.env.DB_NAME,     // Nombre de la base de datos
  process.env.DB_USER,     // Usuario de MySQL
  process.env.DB_PASSWORD, // Contraseña de MySQL (vacía por defecto en XAMPP)
  {
    host: process.env.DB_HOST,   // Host de la base de datos (localhost)
    port: process.env.DB_PORT,   // Puerto de MySQL (3306 por defecto)
    dialect: 'mysql',            // Tipo de base de datos
    
    // Configuración del pool de conexiones
    pool: {
      max: 5,        // Número máximo de conexiones simultáneas
      min: 0,        // Número mínimo de conexiones
      acquire: 30000, // Tiempo máximo (ms) para obtener una conexión
      idle: 10000    // Tiempo máximo (ms) que una conexión puede estar inactiva
    },
    
    // Desactivar logging en producción para mejor rendimiento
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    
    // Configuración de zona horaria
    timezone: '-06:00', // Ajusta según tu zona horaria
    
    // Opciones adicionales
    define: {
      // Agregar timestamps automáticamente (createdAt, updatedAt)
      timestamps: true,
      // Usar snake_case en lugar de camelCase para nombres de columnas
      underscored: false,
      // No pluralizar nombres de tablas automáticamente
      freezeTableName: true
    }
  }
);

/**
 * Función para probar la conexión a la base de datos
 */
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a MySQL establecida correctamente.');
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error.message);
    console.error('\n📋 Verifica que:');
    console.error('  1. XAMPP esté corriendo');
    console.error('  2. MySQL esté iniciado en XAMPP');
    console.error('  3. Las credenciales en .env sean correctas');
    console.error('  4. La base de datos exista en phpMyAdmin\n');
    process.exit(1); // Salir si no hay conexión
  }
};

/**
 * Función para sincronizar los modelos con la base de datos
 * Esto creará las tablas automáticamente si no existen
 */
const syncDatabase = async () => {
  try {
    // alter: true actualiza las tablas sin eliminar datos
    // force: true elimina y recrea las tablas (¡CUIDADO! Borra todos los datos)
    await sequelize.sync({ alter: true });
    console.log('✅ Modelos sincronizados con la base de datos.');
  } catch (error) {
    console.error('❌ Error al sincronizar modelos:', error.message);
  }
};

module.exports = {
  sequelize,
  testConnection,
  syncDatabase
};
