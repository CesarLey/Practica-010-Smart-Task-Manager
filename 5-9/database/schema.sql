-- Esquema SQL para la base de datos `api_noticias`
-- Generado para corresponder con los modelos Sequelize del proyecto
-- Instrucciones: ejecutar esto en MySQL (phpMyAdmin o línea de comandos)

SET FOREIGN_KEY_CHECKS = 0;

CREATE DATABASE IF NOT EXISTS `db_news` CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `db_news`;

-- ==========================================
-- Tabla: perfiles
-- ==========================================
CREATE TABLE IF NOT EXISTS `perfiles` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(50) NOT NULL,
  `descripcion` TEXT NULL,
  `nivel_permiso` INT NOT NULL DEFAULT 1,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ux_perfiles_nombre` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ==========================================
-- Tabla: estados
-- ==========================================
CREATE TABLE IF NOT EXISTS `estados` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(50) NOT NULL,
  `descripcion` VARCHAR(200) NULL,
  `color` VARCHAR(7) NULL DEFAULT '#6c757d',
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ux_estados_nombre` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ==========================================
-- Tabla: usuarios
-- ==========================================
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `password` VARCHAR(100) NOT NULL,
  `telefono` VARCHAR(20) NULL,
  `avatar` VARCHAR(255) NULL,
  `id_perfil` INT NOT NULL,
  `id_estado` INT NOT NULL,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ux_usuarios_email` (`email`),
  KEY `fk_usuarios_perfil_idx` (`id_perfil`),
  KEY `fk_usuarios_estado_idx` (`id_estado`),
  CONSTRAINT `fk_usuarios_perfil` FOREIGN KEY (`id_perfil`) REFERENCES `perfiles`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT `fk_usuarios_estado` FOREIGN KEY (`id_estado`) REFERENCES `estados`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ==========================================
-- Tabla: categorias
-- ==========================================
CREATE TABLE IF NOT EXISTS `categorias` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(50) NOT NULL,
  `descripcion` TEXT NULL,
  `slug` VARCHAR(50) NULL,
  `icono` VARCHAR(50) NULL,
  `color` VARCHAR(7) NULL DEFAULT '#007bff',
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ux_categorias_nombre` (`nombre`),
  UNIQUE KEY `ux_categorias_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ==========================================
-- Tabla: noticias
-- ==========================================
CREATE TABLE IF NOT EXISTS `noticias` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `titulo` VARCHAR(200) NOT NULL,
  `slug` VARCHAR(200) NULL,
  `resumen` TEXT NULL,
  `contenido` LONGTEXT NOT NULL,
  `imagen` VARCHAR(255) NULL,
  `vistas` INT NOT NULL DEFAULT 0,
  `fecha_publicacion` DATETIME NULL,
  `id_usuario` INT NOT NULL,
  `id_categoria` INT NOT NULL,
  `id_estado` INT NOT NULL,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ux_noticias_slug` (`slug`),
  KEY `fk_noticias_usuario_idx` (`id_usuario`),
  KEY `fk_noticias_categoria_idx` (`id_categoria`),
  KEY `fk_noticias_estado_idx` (`id_estado`),
  CONSTRAINT `fk_noticias_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios`(`id`) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT `fk_noticias_categoria` FOREIGN KEY (`id_categoria`) REFERENCES `categorias`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT `fk_noticias_estado` FOREIGN KEY (`id_estado`) REFERENCES `estados`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- Fin del esquema
