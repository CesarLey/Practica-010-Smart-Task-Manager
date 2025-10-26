import 'package:dio/dio.dart';
import 'network_exceptions.dart';

class DioClient {
  late final Dio _dio;

  DioClient({String? baseUrl}) {
    _dio = Dio(
      BaseOptions(
        baseUrl: baseUrl ?? 'https://jsonplaceholder.typicode.com',
        connectTimeout: const Duration(seconds: 5),
        receiveTimeout: const Duration(seconds: 10),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      ),
    );

    _dio.interceptors.add(_createLoggingInterceptor());
    _dio.interceptors.add(RetryInterceptor(_dio));
  }

  InterceptorsWrapper _createLoggingInterceptor() {
    return InterceptorsWrapper(
      onRequest: (options, handler) {
        return handler.next(options);
      },
      onResponse: (response, handler) {
        return handler.next(response);
      },
      onError: (DioException error, handler) {
        return handler.next(error);
      },
    );
  }

  Future<Response<dynamic>> get(
    String path, {
    Map<String, dynamic>? queryParams,
  }) async {
    try {
      final response = await _dio.get(path, queryParameters: queryParams);
      return response;
    } on DioException catch (e) {
      throw NetworkException.fromDioError(e);
    }
  }

  Future<Response<dynamic>> post(
    String path, {
    required Map<String, dynamic> data,
  }) async {
    try {
      final response = await _dio.post(path, data: data);
      return response;
    } on DioException catch (e) {
      throw NetworkException.fromDioError(e);
    }
  }

  Future<Response<dynamic>> delete(String path) async {
    try {
      final response = await _dio.delete(path);
      return response;
    } on DioException catch (e) {
      throw NetworkException.fromDioError(e);
    }
  }

  Future<Response<dynamic>> put(
    String path, {
    required Map<String, dynamic> data,
  }) async {
    try {
      final response = await _dio.put(path, data: data);
      return response;
    } on DioException catch (e) {
      throw NetworkException.fromDioError(e);
    }
  }
}

class RetryInterceptor extends Interceptor {
  final Dio dio;
  static const maxRetries = 3;

  RetryInterceptor(this.dio);

  @override
  Future<void> onError(
    DioException err,
    ErrorInterceptorHandler handler,
  ) async {
    if (_shouldRetry(err)) {
      final retryCount = err.requestOptions.extra['retryCount'] ?? 0;

      if (retryCount < maxRetries) {
        err.requestOptions.extra['retryCount'] = retryCount + 1;

        // Exponential backoff
        await Future.delayed(Duration(seconds: retryCount + 1));

        try {
          final response = await dio.fetch(err.requestOptions);
          return handler.resolve(response);
        } catch (e) {
          return handler.next(err);
        }
      }
    }

    return handler.next(err);
  }

  bool _shouldRetry(DioException err) {
    return err.type == DioExceptionType.connectionTimeout ||
           err.type == DioExceptionType.receiveTimeout ||
           (err.response?.statusCode ?? 0) >= 500;
  }
}
