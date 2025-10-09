/**
 * Seeder para poblar la base de datos con datos iniciales
 *
 * Ejecutar con: node src/seeders/seed.js
 */

const { sequelize, Estado, Perfil, Usuario, Categoria, Noticia } = require('../models');
const bcrypt = require('bcryptjs');

const seedDatabase = async () => {
  try {
    console.log('🌱 Iniciando seeding de datos...');

    // ===== ESTADOS =====
    const estados = [
      { nombre: 'Activo', descripcion: 'Estado activo', color: '#28a745' },
      { nombre: 'Inactivo', descripcion: 'Estado inactivo', color: '#6c757d' },
      { nombre: 'Pendiente', descripcion: 'Estado pendiente', color: '#ffc107' },
      { nombre: 'Eliminado', descripcion: 'Estado eliminado', color: '#dc3545' }
    ];

    for (const estado of estados) {
      await Estado.findOrCreate({
        where: { nombre: estado.nombre },
        defaults: estado
      });
    }
    console.log('✅ Estados creados');

    // ===== PERFILES =====
    const perfiles = [
      { nombre: 'Administrador', descripcion: 'Acceso completo al sistema', nivel_permiso: 3 },
      { nombre: 'Editor', descripcion: 'Puede crear y editar contenido', nivel_permiso: 2 },
      { nombre: 'Usuario', descripcion: 'Usuario básico', nivel_permiso: 1 }
    ];

    for (const perfil of perfiles) {
      await Perfil.findOrCreate({
        where: { nombre: perfil.nombre },
        defaults: perfil
      });
    }
    console.log('✅ Perfiles creados');

    // ===== USUARIOS =====
    const usuarios = [
      {
        nombre: 'Administrador Principal',
        email: 'admin@noticias.com',
        password: 'admin123',
        telefono: '+1234567890',
        id_perfil: 1, // Administrador
        id_estado: 1  // Activo
      },
      {
        nombre: 'Juan Editor',
        email: 'juan@noticias.com',
        password: 'editor123',
        telefono: '+0987654321',
        id_perfil: 2, // Editor
        id_estado: 1  // Activo
      },
      {
        nombre: 'María Usuario',
        email: 'maria@noticias.com',
        password: 'usuario123',
        telefono: '+1122334455',
        id_perfil: 3, // Usuario
        id_estado: 1  // Activo
      }
    ];

    for (const userData of usuarios) {
      const { password, ...userWithoutPassword } = userData;
      const hashedPassword = await bcrypt.hash(password, 10);

      await Usuario.findOrCreate({
        where: { email: userData.email },
        defaults: { ...userWithoutPassword, password: hashedPassword }
      });
    }
    console.log('✅ Usuarios creados');

    // ===== CATEGORÍAS =====
    const categorias = [
      { nombre: 'Tecnología', descripcion: 'Noticias sobre tecnología e innovación' },
      { nombre: 'Deportes', descripcion: 'Cobertura deportiva' },
      { nombre: 'Política', descripcion: 'Análisis político' },
      { nombre: 'Entretenimiento', descripcion: 'Entretenimiento y cultura' },
      { nombre: 'Economía', descripcion: 'Noticias económicas' }
    ];

    for (const categoria of categorias) {
      await Categoria.findOrCreate({
        where: { nombre: categoria.nombre },
        defaults: categoria
      });
    }
    console.log('✅ Categorías creadas');

    // ===== NOTICIAS =====
    const noticias = [
      {
        titulo: 'Nueva actualización de Node.js mejora el rendimiento',
        slug: 'nueva-actualizacion-nodejs-mejora-rendimiento',
        contenido: 'La versión 20 de Node.js incluye mejoras significativas en el rendimiento y nuevas características experimentales...',
        resumen: 'Node.js 20 trae mejoras de rendimiento y nuevas APIs experimentales.',
        imagen: 'https://example.com/nodejs20.jpg',
        id_usuario: 1, // Admin
        id_categoria: 1, // Tecnología
        id_estado: 1  // Activo
      },
      {
        titulo: 'Equipo local gana campeonato nacional',
        slug: 'equipo-local-gana-campeonato-nacional',
        contenido: 'En un partido emocionante, el equipo local se coronó campeón nacional tras vencer al favorito en la final...',
        resumen: 'Victoria histórica del equipo local en el campeonato nacional.',
        imagen: 'https://example.com/campeonato.jpg',
        id_usuario: 2, // Juan Editor
        id_categoria: 2, // Deportes
        id_estado: 1  // Activo
      },
      {
        titulo: 'Nuevo paquete económico aprobado por el congreso',
        slug: 'nuevo-paquete-economico-aprobado-congreso',
        contenido: 'El congreso aprobó un nuevo paquete económico que incluye medidas para estimular el crecimiento...',
        resumen: 'Aprobación de medidas económicas para impulsar el crecimiento.',
        imagen: 'https://example.com/economia.jpg',
        id_usuario: 1, // Admin
        id_categoria: 5, // Economía
        id_estado: 1  // Activo
      }
    ];

    for (const noticia of noticias) {
      await Noticia.findOrCreate({
        where: { slug: noticia.slug },
        defaults: noticia
      });
    }
    console.log('✅ Noticias creadas');

    console.log('🎉 Seeding completado exitosamente!');
    console.log('\n📋 Credenciales de prueba:');
    console.log('Admin: admin@noticias.com / admin123');
    console.log('Editor: juan@noticias.com / editor123');
    console.log('Usuario: maria@noticias.com / usuario123');

  } catch (error) {
    console.error('❌ Error durante el seeding:', error);
  } finally {
    await sequelize.close();
  }
};

// Ejecutar seeding si se llama directamente
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;