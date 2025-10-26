import 'package:dio/dio.dart';

class NetworkException implements Exception {
  final String message;

  NetworkException(this.message);

  factory NetworkException.fromDioError(DioException dioError) {
    switch (dioError.type) {
      case DioExceptionType.connectionTimeout:
      case DioExceptionType.sendTimeout:
      case DioExceptionType.receiveTimeout:
        return NetworkException('La solicitud está tardando mucho. ¿Intentar de nuevo?');
      case DioExceptionType.badResponse:
        return NetworkException._handleStatusCode(dioError.response?.statusCode);
      case DioExceptionType.cancel:
        return NetworkException('Solicitud cancelada');
      case DioExceptionType.connectionError:
        return NetworkException('Sin conexión a internet. Verifica tu red.');
      default:
        return NetworkException('Error inesperado. Intenta más tarde.');
    }
  }

  factory NetworkException._handleStatusCode(int? statusCode) {
    switch (statusCode) {
      case 400:
        return NetworkException('Solicitud inválida. Revisa tus datos.');
      case 401:
        return NetworkException('No autorizado. Inicia sesión de nuevo.');
      case 404:
        return NetworkException('Recurso no encontrado.');
      case 500:
        return NetworkException('Error del servidor. Intenta más tarde.');
      default:
        return NetworkException('Error HTTP: $statusCode');
    }
  }

  @override
  String toString() => message;
}
