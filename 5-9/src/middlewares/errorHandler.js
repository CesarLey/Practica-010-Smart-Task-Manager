/**
 * Middleware de Manejo Global de Errores
 * 
 * Captura todos los errores que ocurran en la aplicación
 * y devuelve una respuesta JSON formateada al cliente
 */

/**
 * Middleware para rutas no encontradas (404)
 */
const rutaNoEncontrada = (req, res, next) => {
  const error = new Error(`Ruta no encontrada - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * Middleware de manejo de errores
 * Este middleware debe ir al final de todos los demás
 */
const manejarErrores = (err, req, res, next) => {
  // Si no se ha establecido un status code, usar 500
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  // Preparar respuesta base
  const respuesta = {
    success: false,
    message: err.message || 'Error interno del servidor',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  };
  
  // ===== ERRORES ESPECÍFICOS DE SEQUELIZE =====
  
  // Error de validación de Sequelize
  if (err.name === 'SequelizeValidationError') {
    respuesta.message = 'Error de validación';
    respuesta.errores = err.errors.map(error => ({
      campo: error.path,
      mensaje: error.message,
      valor: error.value
    }));
    return res.status(400).json(respuesta);
  }
  
  // Error de constraint único (email, slug, etc. duplicados)
  if (err.name === 'SequelizeUniqueConstraintError') {
    respuesta.message = 'El valor ya existe en la base de datos';
    respuesta.errores = err.errors.map(error => ({
      campo: error.path,
      mensaje: `El ${error.path} ya está en uso`,
      valor: error.value
    }));
    return res.status(400).json(respuesta);
  }
  
  // Error de foreign key (relación no válida)
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    respuesta.message = 'Error de relación con otra tabla';
    respuesta.detalle = 'El registro que intentas relacionar no existe o ya tiene relaciones asociadas';
    return res.status(400).json(respuesta);
  }
  
  // Error de conexión a la base de datos
  if (err.name === 'SequelizeConnectionError') {
    respuesta.message = 'Error de conexión con la base de datos';
    respuesta.detalle = 'Verifica que MySQL esté corriendo en XAMPP';
    return res.status(503).json(respuesta);
  }
  
  // Error de timeout en la base de datos
  if (err.name === 'SequelizeConnectionTimedOutError') {
    respuesta.message = 'La conexión con la base de datos ha expirado';
    return res.status(503).json(respuesta);
  }
  
  // ===== ERRORES DE JWT =====
  
  // Token inválido
  if (err.name === 'JsonWebTokenError') {
    respuesta.message = 'Token inválido';
    return res.status(401).json(respuesta);
  }
  
  // Token expirado
  if (err.name === 'TokenExpiredError') {
    respuesta.message = 'El token ha expirado';
    return res.status(401).json(respuesta);
  }
  
  // ===== ERROR POR DEFECTO =====
  
  // Logging del error (en producción deberías usar un logger como Winston)
  console.error('❌ Error capturado:', err.message);
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }
  
  // Respuesta genérica
  res.status(statusCode).json(respuesta);
};

/**
 * Middleware para capturar errores asíncronos
 * Envuelve funciones async para que los errores sean capturados
 * 
 * Uso:
 * router.get('/ruta', asyncHandler(async (req, res) => {
 *   // código aquí
 * }));
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = {
  rutaNoEncontrada,
  manejarErrores,
  asyncHandler
};
