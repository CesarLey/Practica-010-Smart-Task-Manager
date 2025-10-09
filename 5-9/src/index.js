#!/usr/bin/env node

/**
 * Script de verificación pre-inicio
 * 
 * Verifica que todas las variables de entorno necesarias estén configuradas
 * antes de iniciar el servidor
 */

require('dotenv').config();

const requiredEnvVars = [
  'DB_HOST',
  'DB_NAME',
  'DB_USER',
  'JWT_SECRET'
];

console.log('🔍 Verificando configuración del entorno...\n');

let hasErrors = false;

requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    console.error(`❌ Error: Variable de entorno ${envVar} no está definida`);
    hasErrors = true;
  } else {
    // No mostrar valores sensibles completos
    const value = envVar.includes('PASSWORD') || envVar.includes('SECRET') 
      ? '***' 
      : process.env[envVar];
    console.log(`✅ ${envVar}: ${value}`);
  }
});

console.log('\n📊 Configuración de la base de datos:');
console.log(`   Host: ${process.env.DB_HOST || 'NO CONFIGURADO'}`);
console.log(`   Puerto: ${process.env.DB_PORT || '3306'}`);
console.log(`   Base de datos: ${process.env.DB_NAME || 'NO CONFIGURADO'}`);
console.log(`   Usuario: ${process.env.DB_USER || 'NO CONFIGURADO'}`);

console.log('\n🔐 Configuración de autenticación:');
console.log(`   JWT Secret: ${process.env.JWT_SECRET ? '✅ Configurado' : '❌ NO CONFIGURADO'}`);
console.log(`   JWT Expira en: ${process.env.JWT_EXPIRES_IN || '24h'}`);

console.log('\n🌍 Entorno:');
console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
console.log(`   Puerto: ${process.env.PORT || 3000}`);
console.log(`   CORS Origin: ${process.env.CORS_ORIGIN || '*'}`);

if (hasErrors) {
  console.error('\n❌ Hay errores en la configuración. Por favor, revisa tu archivo .env');
  console.error('💡 Copia .env.example a .env y configura las variables necesarias\n');
  process.exit(1);
}

console.log('\n✅ Configuración verificada correctamente');
console.log('🚀 Iniciando servidor...\n');

// Si todo está bien, iniciar el servidor
require('./server.js');