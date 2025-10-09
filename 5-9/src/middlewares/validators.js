/**
 * Middlewares de Validación
 * 
 * Utiliza express-validator para validar los datos de entrada
 * en las diferentes rutas de la API
 */

const { body, validationResult } = require('express-validator');

/**
 * Middleware para manejar los errores de validación
 */
const manejarErroresValidacion = (req, res, next) => {
  const errores = validationResult(req);
  
  if (!errores.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Errores de validación',
      errores: errores.array().map(err => ({
        campo: err.path,
        mensaje: err.msg
      }))
    });
  }
  
  next();
};

// ========== VALIDACIONES PARA ESTADOS ==========

const validarEstado = [
  body('nombre')
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ min: 3, max: 50 }).withMessage('El nombre debe tener entre 3 y 50 caracteres')
    .trim(),
  
  body('descripcion')
    .optional()
    .isLength({ max: 200 }).withMessage('La descripción no puede exceder los 200 caracteres')
    .trim(),
  
  body('color')
    .optional()
    .matches(/^#[0-9A-Fa-f]{6}$/).withMessage('El color debe ser un código hexadecimal válido (ej: #FF5733)'),
  
  manejarErroresValidacion
];

// ========== VALIDACIONES PARA PERFILES ==========

const validarPerfil = [
  body('nombre')
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ min: 3, max: 50 }).withMessage('El nombre debe tener entre 3 y 50 caracteres')
    .trim(),
  
  body('descripcion')
    .optional()
    .trim(),
  
  body('nivel_permiso')
    .optional()
    .isInt({ min: 1, max: 5 }).withMessage('El nivel de permiso debe estar entre 1 y 5'),
  
  manejarErroresValidacion
];

// ========== VALIDACIONES PARA CATEGORÍAS ==========

const validarCategoria = [
  body('nombre')
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ min: 3, max: 50 }).withMessage('El nombre debe tener entre 3 y 50 caracteres')
    .trim(),
  
  body('descripcion')
    .optional()
    .trim(),
  
  body('icono')
    .optional()
    .isLength({ max: 50 }).withMessage('El icono no puede exceder los 50 caracteres')
    .trim(),
  
  body('color')
    .optional()
    .matches(/^#[0-9A-Fa-f]{6}$/).withMessage('El color debe ser un código hexadecimal válido'),
  
  manejarErroresValidacion
];

// ========== VALIDACIONES PARA USUARIOS ==========

const validarUsuarioCrear = [
  body('nombre')
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ min: 3, max: 100 }).withMessage('El nombre debe tener entre 3 y 100 caracteres')
    .trim(),
  
  body('email')
    .notEmpty().withMessage('El email es obligatorio')
    .isEmail().withMessage('Debe ser un email válido')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('La contraseña es obligatoria')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  
  body('telefono')
    .optional()
    .matches(/^[\d\s\-\+\(\)]+$/).withMessage('El teléfono solo puede contener números y símbolos básicos')
    .trim(),
  
  body('avatar')
    .optional()
    .isURL().withMessage('El avatar debe ser una URL válida')
    .trim(),
  
  body('id_perfil')
    .notEmpty().withMessage('El perfil es obligatorio')
    .isInt({ min: 1 }).withMessage('El ID del perfil debe ser un número entero positivo'),
  
  body('id_estado')
    .notEmpty().withMessage('El estado es obligatorio')
    .isInt({ min: 1 }).withMessage('El ID del estado debe ser un número entero positivo'),
  
  manejarErroresValidacion
];

const validarUsuarioActualizar = [
  body('nombre')
    .optional()
    .isLength({ min: 3, max: 100 }).withMessage('El nombre debe tener entre 3 y 100 caracteres')
    .trim(),
  
  body('email')
    .optional()
    .isEmail().withMessage('Debe ser un email válido')
    .normalizeEmail(),
  
  body('password')
    .optional()
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  
  body('telefono')
    .optional()
    .matches(/^[\d\s\-\+\(\)]+$/).withMessage('El teléfono solo puede contener números y símbolos básicos')
    .trim(),
  
  body('avatar')
    .optional()
    .isURL().withMessage('El avatar debe ser una URL válida')
    .trim(),
  
  body('id_perfil')
    .optional()
    .isInt({ min: 1 }).withMessage('El ID del perfil debe ser un número entero positivo'),
  
  body('id_estado')
    .optional()
    .isInt({ min: 1 }).withMessage('El ID del estado debe ser un número entero positivo'),
  
  manejarErroresValidacion
];

// ========== VALIDACIONES PARA NOTICIAS ==========

const validarNoticiaCrear = [
  body('titulo')
    .notEmpty().withMessage('El título es obligatorio')
    .isLength({ min: 10, max: 200 }).withMessage('El título debe tener entre 10 y 200 caracteres')
    .trim(),
  
  body('resumen')
    .optional()
    .isLength({ max: 500 }).withMessage('El resumen no puede exceder los 500 caracteres')
    .trim(),
  
  body('contenido')
    .notEmpty().withMessage('El contenido es obligatorio')
    .isLength({ min: 50, max: 50000 }).withMessage('El contenido debe tener entre 50 y 50000 caracteres')
    .trim(),
  
  body('imagen')
    .optional()
    .isURL().withMessage('La imagen debe ser una URL válida')
    .trim(),
  
  body('id_categoria')
    .notEmpty().withMessage('La categoría es obligatoria')
    .isInt({ min: 1 }).withMessage('El ID de la categoría debe ser un número entero positivo'),
  
  body('id_estado')
    .notEmpty().withMessage('El estado es obligatorio')
    .isInt({ min: 1 }).withMessage('El ID del estado debe ser un número entero positivo'),
  
  manejarErroresValidacion
];

const validarNoticiaActualizar = [
  body('titulo')
    .optional()
    .isLength({ min: 10, max: 200 }).withMessage('El título debe tener entre 10 y 200 caracteres')
    .trim(),
  
  body('resumen')
    .optional()
    .isLength({ max: 500 }).withMessage('El resumen no puede exceder los 500 caracteres')
    .trim(),
  
  body('contenido')
    .optional()
    .isLength({ min: 50, max: 50000 }).withMessage('El contenido debe tener entre 50 y 50000 caracteres')
    .trim(),
  
  body('imagen')
    .optional()
    .isURL().withMessage('La imagen debe ser una URL válida')
    .trim(),
  
  body('id_categoria')
    .optional()
    .isInt({ min: 1 }).withMessage('El ID de la categoría debe ser un número entero positivo'),
  
  body('id_estado')
    .optional()
    .isInt({ min: 1 }).withMessage('El ID del estado debe ser un número entero positivo'),
  
  manejarErroresValidacion
];

// ========== VALIDACIONES PARA AUTENTICACIÓN ==========

const validarRegistro = [
  body('nombre')
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ min: 3, max: 100 }).withMessage('El nombre debe tener entre 3 y 100 caracteres')
    .trim(),
  
  body('email')
    .notEmpty().withMessage('El email es obligatorio')
    .isEmail().withMessage('Debe ser un email válido')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('La contraseña es obligatoria')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  
  body('telefono')
    .optional()
    .matches(/^[\d\s\-\+\(\)]+$/).withMessage('El teléfono solo puede contener números y símbolos básicos')
    .trim(),
  
  manejarErroresValidacion
];

const validarLogin = [
  body('email')
    .notEmpty().withMessage('El email es obligatorio')
    .isEmail().withMessage('Debe ser un email válido')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('La contraseña es obligatoria'),
  
  manejarErroresValidacion
];

module.exports = {
  // Estados
  validarEstado,
  
  // Perfiles
  validarPerfil,
  
  // Categorías
  validarCategoria,
  
  // Usuarios
  validarUsuarioCrear,
  validarUsuarioActualizar,
  
  // Noticias
  validarNoticiaCrear,
  validarNoticiaActualizar,
  
  // Autenticación
  validarRegistro,
  validarLogin
};
