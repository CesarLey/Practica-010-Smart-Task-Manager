/**
 * Configuración de Swagger para documentación automática de la API
 * 
 * Swagger genera documentación interactiva donde puedes:
 * - Ver todos los endpoints
 * - Probar las peticiones directamente
 * - Ver los modelos de datos
 * - Exportar la especificación OpenAPI
 */

const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Configuración de Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API RESTful - Sistema de Noticias',
      version: '1.0.0',
      description: `
        API completa para gestión de noticias desarrollada con Node.js, Express y Sequelize.
        
        ## Características
        - CRUD completo para Usuarios, Perfiles, Estados, Categorías y Noticias
        - Autenticación JWT
        - Validación de datos
        - Manejo de errores
        - Relaciones entre modelos
        
        ## Autenticación
        La mayoría de los endpoints requieren autenticación JWT. 
        1. Primero, inicia sesión en \`POST /api/auth/login\`
        2. Copia el token de la respuesta
        3. Haz clic en "Authorize" arriba y pega el token
        4. Ahora puedes probar los endpoints protegidos
      `,
      contact: {
        name: 'API Support',
        email: 'support@noticias.com'
      },
      license: {
        name: 'ISC',
        url: 'https://opensource.org/licenses/ISC'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desarrollo'
      },
      {
        url: 'https://api.noticias.com',
        description: 'Servidor de producción'
      }
    ],
    // Configuración de seguridad JWT
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Ingresa el token JWT obtenido del login'
        }
      },
      // Definición de esquemas de datos
      schemas: {
        // ===== ESTADO =====
        Estado: {
          type: 'object',
          required: ['nombre'],
          properties: {
            id: {
              type: 'integer',
              description: 'ID único del estado'
            },
            nombre: {
              type: 'string',
              description: 'Nombre del estado',
              example: 'Activo'
            },
            descripcion: {
              type: 'string',
              description: 'Descripción del estado',
              example: 'Estado activo para contenido publicado'
            },
            color: {
              type: 'string',
              description: 'Color hexadecimal para UI',
              example: '#28a745'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de creación'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de última actualización'
            }
          }
        },
        
        // ===== PERFIL =====
        Perfil: {
          type: 'object',
          required: ['nombre', 'nivel_permiso'],
          properties: {
            id: {
              type: 'integer',
              description: 'ID único del perfil'
            },
            nombre: {
              type: 'string',
              description: 'Nombre del perfil/rol',
              example: 'Administrador'
            },
            descripcion: {
              type: 'string',
              description: 'Descripción del perfil',
              example: 'Usuario con acceso completo al sistema'
            },
            nivel_permiso: {
              type: 'integer',
              description: 'Nivel de permisos (1-3)',
              example: 3,
              minimum: 1,
              maximum: 3
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        
        // ===== USUARIO =====
        Usuario: {
          type: 'object',
          required: ['nombre', 'email', 'password', 'id_perfil', 'id_estado'],
          properties: {
            id: {
              type: 'integer',
              description: 'ID único del usuario'
            },
            nombre: {
              type: 'string',
              description: 'Nombre completo del usuario',
              example: 'Juan Pérez'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email único del usuario',
              example: 'juan@example.com'
            },
            password: {
              type: 'string',
              format: 'password',
              description: 'Contraseña encriptada',
              example: 'password123'
            },
            telefono: {
              type: 'string',
              description: 'Teléfono del usuario',
              example: '+1234567890'
            },
            avatar: {
              type: 'string',
              description: 'URL de la imagen de perfil',
              example: 'https://example.com/avatar.jpg'
            },
            id_perfil: {
              type: 'integer',
              description: 'ID del perfil/rol asignado',
              example: 1
            },
            id_estado: {
              type: 'integer',
              description: 'ID del estado del usuario',
              example: 1
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            },
            perfil: {
              $ref: '#/components/schemas/Perfil'
            },
            estado: {
              $ref: '#/components/schemas/Estado'
            }
          }
        },
        
        // ===== CATEGORÍA =====
        Categoria: {
          type: 'object',
          required: ['nombre'],
          properties: {
            id: {
              type: 'integer',
              description: 'ID único de la categoría'
            },
            nombre: {
              type: 'string',
              description: 'Nombre de la categoría',
              example: 'Tecnología'
            },
            descripcion: {
              type: 'string',
              description: 'Descripción de la categoría',
              example: 'Noticias sobre tecnología e innovación'
            },
            slug: {
              type: 'string',
              description: 'Slug URL-friendly',
              example: 'tecnologia'
            },
            icono: {
              type: 'string',
              description: 'Icono o emoji',
              example: '💻'
            },
            color: {
              type: 'string',
              description: 'Color hexadecimal',
              example: '#007bff'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        
        // ===== NOTICIA =====
        Noticia: {
          type: 'object',
          required: ['titulo', 'contenido', 'id_categoria', 'id_estado'],
          properties: {
            id: {
              type: 'integer',
              description: 'ID único de la noticia'
            },
            titulo: {
              type: 'string',
              description: 'Título de la noticia',
              example: 'Nueva tecnología revoluciona el mundo'
            },
            slug: {
              type: 'string',
              description: 'Slug generado automáticamente',
              example: 'nueva-tecnologia-revoluciona-mundo'
            },
            resumen: {
              type: 'string',
              description: 'Resumen breve',
              example: 'Un breve resumen de la noticia...'
            },
            contenido: {
              type: 'string',
              description: 'Contenido completo de la noticia',
              example: 'El contenido completo de la noticia con todos los detalles...'
            },
            imagen: {
              type: 'string',
              description: 'URL de la imagen principal',
              example: 'https://example.com/imagen.jpg'
            },
            vistas: {
              type: 'integer',
              description: 'Número de vistas',
              example: 0
            },
            fecha_publicacion: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de publicación'
            },
            id_usuario: {
              type: 'integer',
              description: 'ID del autor'
            },
            id_categoria: {
              type: 'integer',
              description: 'ID de la categoría',
              example: 1
            },
            id_estado: {
              type: 'integer',
              description: 'ID del estado',
              example: 1
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            },
            autor: {
              $ref: '#/components/schemas/Usuario'
            },
            categoria: {
              $ref: '#/components/schemas/Categoria'
            },
            estado: {
              $ref: '#/components/schemas/Estado'
            }
          }
        },
        
        // ===== RESPUESTAS =====
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              example: 'Error al procesar la solicitud'
            },
            errores: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  campo: {
                    type: 'string'
                  },
                  mensaje: {
                    type: 'string'
                  }
                }
              }
            }
          }
        },
        
        Success: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Operación exitosa'
            },
            data: {
              type: 'object'
            }
          }
        },
        
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'admin@noticias.com'
            },
            password: {
              type: 'string',
              format: 'password',
              example: 'admin123'
            }
          }
        },
        
        LoginResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Login exitoso'
            },
            token: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
            },
            usuario: {
              $ref: '#/components/schemas/Usuario'
            }
          }
        }
      }
    },
    // Aplicar seguridad JWT a todos los endpoints por defecto
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  // Archivos donde buscar anotaciones de Swagger
  apis: ['./src/routes/*.js', './src/controllers/*.js', './src/models/*.js']
};

// Generar especificación Swagger
const swaggerSpec = swaggerJsDoc(swaggerOptions);

// Opciones de personalización de la UI
const swaggerUiOptions = {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'API Noticias - Documentación',
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    filter: true,
    tryItOutEnabled: true
  }
};

module.exports = {
  swaggerUi,
  swaggerSpec,
  swaggerUiOptions
};