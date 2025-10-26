import '../../domain/entities/task.dart';
import '../../domain/repositories/tasks_repository.dart';
import '../datasources/tasks_remote_datasource.dart';
import '../datasources/tasks_local_datasource.dart';
import '../models/task_model.dart';
import '../../../../core/network/network_exceptions.dart';

class TasksRepositoryImpl implements TasksRepository {
  final TasksRemoteDataSource _remoteDataSource;
  final TasksLocalDataSource _localDataSource;

  TasksRepositoryImpl(this._remoteDataSource, this._localDataSource);

  @override
  Future<List<Task>> getAllTasks({bool forceRefresh = false}) async {
    print('--- INICIANDO getAllTasks (forceRefresh: $forceRefresh) ---'); // <-- AÑADE ESTO

    if (!forceRefresh) {
      print('1️⃣ Chequeando la base de datos local...'); // <-- AÑADE ESTO
      final localTasks = await _localDataSource.getTasks();
      print('2️⃣ Tareas encontradas en Hive: ${localTasks.length}'); // <-- AÑADE ESTO

      if (localTasks.isNotEmpty) {
        print('✅ Devolviendo ${localTasks.length} tareas desde el caché local.'); // <-- AÑADE ESTO
        return localTasks;
      } else {
        print('⚠️ Caché local vacío, forzando carga desde API');
      }
    } else {
      print('🔄 Forzando refresco desde API (ignorando caché)');
    }

    // Si forzamos refresco o el caché está vacío, vamos a la API.
    try {
      print('🌐 Cargando desde la API...');
      final remoteTasks = await _remoteDataSource.getAllTasks();
      final remoteTaskEntities = remoteTasks.map((m) => m.toEntity()).toList();

      // 🔥 LÓGICA DE FUSIÓN INTELIGENTE 🔥
      // 1. Obtenemos las tareas que solo existen localmente (las que creamos nosotros).
      //    Las identificamos porque sus IDs son altos (la API solo tiene 100 posts).
      final existingLocalOnlyTasks = (await _localDataSource.getTasks())
          .where((task) => task.id != null && task.id! > 100)
          .toList();

      // 2. Creamos una lista combinada y sin duplicados.
      final allTasks = <Task>[
        ...remoteTaskEntities,
        ...existingLocalOnlyTasks,
      ];

      // 3. Guardamos la lista fusionada en la base de datos local.
      await _localDataSource.saveTasks(allTasks);

      return await _localDataSource.getTasks(); // Devolvemos la lista ordenada desde la fuente final.

    } on NetworkException {
      // Si la red falla, SIEMPRE devolvemos lo que tengamos en local.
      print('⚠️ Red no disponible, cargando desde caché local.');
      return await _localDataSource.getTasks();
    }
  }

  @override
  Future<Task> createTask(Task task) async {
    try {
      final taskModel = TaskModel.fromEntity(task);
      final createdModel = await _remoteDataSource.createTask(taskModel);
      final createdTask = createdModel.toEntity();

      await _localDataSource.saveTask(createdTask);
      print('✅ Tarea "${createdTask.title}" guardada persistentemente en Hive.');

      return createdTask;
    } on NetworkException {
      rethrow;
    } catch (e) {
      throw NetworkException('Error al crear tarea: $e');
    }
  }

  @override
  Future<Task> getTaskDetails(int taskId) async {
    try {
      final taskModel = await _remoteDataSource.getTaskDetails(taskId);
      return taskModel.toEntity();
    } on NetworkException {
      rethrow;
    } catch (e) {
      throw NetworkException('Error al obtener tarea: $e');
    }
  }

  @override
  Future<List<Task>> searchTasks(String query) async {
    try {
      final taskModels = await _remoteDataSource.searchTasks(query);
      return taskModels.map((m) => m.toEntity()).toList();
    } on NetworkException {
      rethrow;
    } catch (e) {
      throw NetworkException('Error al buscar tareas: $e');
    }
  }

  @override
  Future<void> deleteTask(int taskId) async {
    try {
      // Delete from API
      await _remoteDataSource.deleteTask(taskId);

      // Delete from local storage
      await _localDataSource.deleteTask(taskId);
      print('✅ Tarea $taskId eliminada de API y almacenamiento local.');
    } on NetworkException {
      rethrow;
    } catch (e) {
      throw NetworkException('Error al eliminar tarea: $e');
    }
  }

  @override
  Future<void> deleteTaskByTask(Task task) async {
    try {
      // Elimina de ambas fuentes
      await _localDataSource.deleteTask(task.id!);
      // La API de prueba no lo borra de verdad, pero en una real sí lo haría.
      await _remoteDataSource.deleteTask(task.id!);
      print('🗑️ Tarea con ID ${task.id} eliminada de la base de datos local.');
    } on NetworkException {
      rethrow;
    } catch (e) {
      throw NetworkException('Error al eliminar tarea: $e');
    }
  }

  @override
  Future<void> updateTask(Task task) async {
    try {
      final taskModel = TaskModel.fromEntity(task);
      // Actualiza en ambas fuentes
      await _localDataSource.saveTask(task);
      // La API de prueba no lo actualiza de verdad.
      await _remoteDataSource.updateTask(taskModel);
      print('✏️ Tarea con ID ${task.id} actualizada en la base de datos local.');
    } on NetworkException {
      rethrow;
    } catch (e) {
      throw NetworkException('Error al actualizar tarea: $e');
    }
  }
}
