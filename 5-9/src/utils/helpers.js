/**
 * Funciones Auxiliares
 * 
 * Utilidades comunes para usar en toda la aplicación
 */

/**
 * Generar slug desde un texto
 * @param {string} texto - Texto a convertir en slug
 * @returns {string} - Slug generado
 */
const generarSlug = (texto) => {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
    .replace(/[^a-z0-9]+/g, '-')     // Reemplazar caracteres especiales con guiones
    .replace(/^-+|-+$/g, '');        // Eliminar guiones al inicio y final
};

/**
 * Formatear fecha a formato local
 * @param {Date} fecha - Fecha a formatear
 * @returns {string} - Fecha formateada
 */
const formatearFecha = (fecha) => {
  return new Date(fecha).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Validar si un ID es válido
 * @param {*} id - ID a validar
 * @returns {boolean} - true si es válido
 */
const esIdValido = (id) => {
  return Number.isInteger(Number(id)) && Number(id) > 0;
};

/**
 * Crear respuesta de éxito
 * @param {object} data - Datos a retornar
 * @param {string} message - Mensaje opcional
 * @returns {object} - Objeto de respuesta
 */
const respuestaExito = (data, message = null) => {
  const respuesta = {
    success: true,
    data
  };
  
  if (message) {
    respuesta.message = message;
  }
  
  return respuesta;
};

/**
 * Crear respuesta de error
 * @param {string} message - Mensaje de error
 * @param {number} statusCode - Código de estado HTTP
 * @returns {object} - Objeto de respuesta
 */
const respuestaError = (message, statusCode = 400) => {
  return {
    success: false,
    message,
    statusCode
  };
};

/**
 * Truncar texto
 * @param {string} texto - Texto a truncar
 * @param {number} longitud - Longitud máxima
 * @returns {string} - Texto truncado
 */
const truncarTexto = (texto, longitud = 100) => {
  if (!texto) return '';
  return texto.length > longitud 
    ? texto.substring(0, longitud) + '...' 
    : texto;
};

module.exports = {
  generarSlug,
  formatearFecha,
  esIdValido,
  respuestaExito,
  respuestaError,
  truncarTexto
};
