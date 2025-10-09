/**
 * Punto de entrada de la aplicación
 * 
 * Inicia el servidor Express y establece la conexión
 * con la base de datos MySQL
 */

const app = require('./app');
const { testConnection, syncDatabase } = require('./config/database');
require('dotenv').config();

// Puerto del servidor
const PORT = process.env.PORT || 3000;

/**
 * Función para iniciar el servidor
 */
const iniciarServidor = async () => {
  try {
    console.log('🔄 Iniciando servidor...\n');
    
    // 1. Probar conexión a la base de datos
    console.log('📊 Conectando a MySQL...');
    await testConnection();
    
    // 2. Sincronizar modelos con la base de datos
    console.log('\n📋 Sincronizando modelos con la base de datos...');
    await syncDatabase();
    
    // 3. Iniciar servidor Express
    app.listen(PORT, () => {
      console.log('\n' + '='.repeat(60));
      console.log(`✅ Servidor corriendo en el puerto ${PORT}`);
      console.log(`🌐 URL: http://localhost:${PORT}`);
      console.log(`📚 API: http://localhost:${PORT}/api`);
      console.log(`🔧 Entorno: ${process.env.NODE_ENV || 'development'}`);
      console.log('='.repeat(60) + '\n');
      
      console.log('📝 Endpoints disponibles:');
      console.log(`   • GET    http://localhost:${PORT}/api`);
      console.log(`   • POST   http://localhost:${PORT}/api/auth/register`);
      console.log(`   • POST   http://localhost:${PORT}/api/auth/login`);
      console.log(`   • GET    http://localhost:${PORT}/api/noticias`);
      console.log(`   • GET    http://localhost:${PORT}/api/categorias`);
      console.log(`   • GET    http://localhost:${PORT}/api/estados`);
      console.log(`   • GET    http://localhost:${PORT}/api/perfiles\n`);
      
      console.log('💡 Consejos:');
      console.log('   1. Abre phpMyAdmin para ver las tablas creadas');
      console.log('   2. Usa Postman para probar los endpoints');
      console.log('   3. Consulta el README.md para más información\n');
      
      console.log('⏳ Esperando peticiones...\n');
    });
    
  } catch (error) {
    console.error('\n❌ Error al iniciar el servidor:');
    console.error(error.message);
    console.error('\n🔍 Posibles soluciones:');
    console.error('   1. Verifica que XAMPP esté corriendo');
    console.error('   2. Asegúrate de que MySQL esté iniciado');
    console.error('   3. Revisa las credenciales en el archivo .env');
    console.error('   4. Crea la base de datos en phpMyAdmin\n');
    process.exit(1);
  }
};

// Manejar errores no capturados
process.on('unhandledRejection', (err) => {
  console.error('❌ Error no manejado (Promise Rejection):');
  console.error(err);
  console.log('\n⚠️  Cerrando servidor...\n');
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('❌ Error no capturado (Exception):');
  console.error(err);
  console.log('\n⚠️  Cerrando servidor...\n');
  process.exit(1);
});

// Manejar CTRL+C para cerrar el servidor limpiamente
process.on('SIGINT', () => {
  console.log('\n\n⚠️  Señal SIGINT recibida');
  console.log('🔄 Cerrando servidor gracefully...\n');
  process.exit(0);
});

// Iniciar el servidor
iniciarServidor();
