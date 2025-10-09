-- ============================================
-- Script SQL para insertar datos iniciales
-- ============================================
-- 
-- Este script inserta datos de prueba en todas las tablas
-- Ejecuta esto en phpMyAdmin después de iniciar el servidor
-- por primera vez para tener datos con los que trabajar

USE api_noticias;

-- ============================================
-- 1. INSERTAR ESTADOS
-- ============================================

INSERT INTO estados (nombre, descripcion, color, createdAt, updatedAt) VALUES
('Activo', 'Estado activo y operativo', '#28a745', NOW(), NOW()),
('Inactivo', 'Estado inactivo o deshabilitado', '#dc3545', NOW(), NOW()),
('Pendiente', 'En espera de revisión', '#ffc107', NOW(), NOW()),
('Publicado', 'Contenido publicado y visible', '#007bff', NOW(), NOW()),
('Borrador', 'Contenido en borrador', '#6c757d', NOW(), NOW());

-- ============================================
-- 2. INSERTAR PERFILES (ROLES)
-- ============================================

INSERT INTO perfiles (nombre, descripcion, nivel_permiso, createdAt, updatedAt) VALUES
('Super Administrador', 'Acceso total al sistema', 5, NOW(), NOW()),
('Administrador', 'Gestiona usuarios y contenido', 4, NOW(), NOW()),
('Editor', 'Puede crear y editar contenido', 3, NOW(), NOW()),
('Autor', 'Puede crear su propio contenido', 2, NOW(), NOW()),
('Usuario', 'Acceso básico de lectura', 1, NOW(), NOW());

-- ============================================
-- 3. INSERTAR CATEGORÍAS
-- ============================================

INSERT INTO categorias (nombre, descripcion, slug, icono, color, createdAt, updatedAt) VALUES
('Tecnología', 'Noticias sobre tecnología y gadgets', 'tecnologia', '💻', '#007bff', NOW(), NOW()),
('Deportes', 'Noticias deportivas y resultados', 'deportes', '⚽', '#28a745', NOW(), NOW()),
('Política', 'Actualidad política nacional e internacional', 'politica', '🏛️', '#dc3545', NOW(), NOW()),
('Entretenimiento', 'Cine, música y espectáculos', 'entretenimiento', '🎬', '#e83e8c', NOW(), NOW()),
('Economía', 'Noticias económicas y financieras', 'economia', '💰', '#ffc107', NOW(), NOW()),
('Salud', 'Salud, bienestar y medicina', 'salud', '🏥', '#17a2b8', NOW(), NOW()),
('Ciencia', 'Descubrimientos y avances científicos', 'ciencia', '🔬', '#6610f2', NOW(), NOW()),
('Cultura', 'Arte, literatura y eventos culturales', 'cultura', '🎨', '#fd7e14', NOW(), NOW());

-- ============================================
-- 4. INSERTAR USUARIOS
-- ============================================
-- NOTA: Las contraseñas se deben crear a través de la API
-- porque se encriptan automáticamente con bcrypt
-- Estos son solo ejemplos de estructura

-- Para crear usuarios, usa la API:
-- POST http://localhost:3000/api/auth/register
-- O la ruta POST http://localhost:3000/api/usuarios (requiere autenticación de admin)

-- ============================================
-- CONSULTAS ÚTILES PARA VERIFICAR LOS DATOS
-- ============================================

-- Ver todos los estados
SELECT * FROM estados;

-- Ver todos los perfiles
SELECT * FROM perfiles ORDER BY nivel_permiso DESC;

-- Ver todas las categorías
SELECT * FROM categorias ORDER BY nombre;

-- Ver usuarios con sus perfiles y estados
SELECT 
    u.id,
    u.nombre,
    u.email,
    p.nombre AS perfil,
    e.nombre AS estado
FROM usuarios u
INNER JOIN perfiles p ON u.id_perfil = p.id
INNER JOIN estados e ON u.id_estado = e.id;

-- Ver noticias con autor, categoría y estado
SELECT 
    n.id,
    n.titulo,
    u.nombre AS autor,
    c.nombre AS categoria,
    e.nombre AS estado,
    n.vistas,
    n.fecha_publicacion
FROM noticias n
INNER JOIN usuarios u ON n.id_usuario = u.id
INNER JOIN categorias c ON n.id_categoria = c.id
INNER JOIN estados e ON n.id_estado = e.id
ORDER BY n.fecha_publicacion DESC;

-- Contar noticias por categoría
SELECT 
    c.nombre AS categoria,
    COUNT(n.id) AS total_noticias
FROM categorias c
LEFT JOIN noticias n ON c.id = n.id_categoria
GROUP BY c.id, c.nombre
ORDER BY total_noticias DESC;

-- Ver noticias más vistas
SELECT 
    n.titulo,
    n.vistas,
    u.nombre AS autor,
    c.nombre AS categoria
FROM noticias n
INNER JOIN usuarios u ON n.id_usuario = u.id
INNER JOIN categorias c ON n.id_categoria = c.id
WHERE n.id_estado = 4  -- Publicado
ORDER BY n.vistas DESC
LIMIT 10;
