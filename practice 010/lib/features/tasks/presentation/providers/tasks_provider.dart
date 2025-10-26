import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../domain/entities/task.dart';
import '../../domain/usecases/create_task.dart';
import '../../domain/usecases/get_task_details.dart';
import '../../domain/usecases/search_tasks.dart';
import '../../domain/usecases/delete_task.dart';
import '../../data/repositories/tasks_repository_impl.dart';
import '../../data/datasources/tasks_remote_datasource.dart';
import '../../data/datasources/tasks_local_datasource.dart';
import '../../../../core/network/dio_client.dart';

final dioClientProvider = Provider<DioClient>((ref) => DioClient());

final tasksRemoteDataSourceProvider = Provider<TasksRemoteDataSource>((ref) {
  final dioClient = ref.watch(dioClientProvider);
  return TasksRemoteDataSource(dioClient);
});

final tasksLocalDataSourceProvider = Provider<TasksLocalDataSource>((ref) {
  final localDataSource = TasksLocalDataSource();
  // Initialize Hive box
  localDataSource.init();
  return localDataSource;
});

final tasksRepositoryProvider = Provider<TasksRepositoryImpl>((ref) {
  final remoteDataSource = ref.watch(tasksRemoteDataSourceProvider);
  final localDataSource = ref.watch(tasksLocalDataSourceProvider);
  return TasksRepositoryImpl(remoteDataSource, localDataSource);
});

final createTaskUseCaseProvider = Provider<CreateTask>((ref) {
  final repository = ref.watch(tasksRepositoryProvider);
  return CreateTask(repository);
});

final getTaskDetailsUseCaseProvider = Provider<GetTaskDetails>((ref) {
  final repository = ref.watch(tasksRepositoryProvider);
  return GetTaskDetails(repository);
});

final searchTasksUseCaseProvider = Provider<SearchTasks>((ref) {
  final repository = ref.watch(tasksRepositoryProvider);
  return SearchTasks(repository);
});

final deleteTaskUseCaseProvider = Provider<DeleteTask>((ref) {
  final repository = ref.watch(tasksRepositoryProvider);
  return DeleteTask(repository);
});

final tasksListProvider = StateNotifierProvider<TasksNotifier, AsyncValue<List<Task>>>(
  (ref) => TasksNotifier(ref),
);

class TasksNotifier extends StateNotifier<AsyncValue<List<Task>>> {
  final Ref _ref;
  List<Task> _masterTaskList = [];
  
  bool _hasMore = true;

  TasksNotifier(this._ref) : super(const AsyncValue.loading()) {
    print('🏗️ TasksNotifier CONSTRUCTOR - Creando instancia');
    // Llama al método de carga inicial
    loadInitialTasks();
  }

  // ✅ MÉTODO 1: Para la carga inicial (Usa el caché)
  Future<void> loadInitialTasks() async {
    print('⏳ loadInitialTasks INICIADO - Esperando 2 segundos para estabilizar conexión...');
    await Future.delayed(const Duration(seconds: 2)); // Dar tiempo a la conexión de debug
    print('✅ Conexión estabilizada, procediendo con carga inicial');

    state = const AsyncValue.loading();
    try {
      final repository = _ref.read(tasksRepositoryProvider);
      print('📞 Llamando a repository.getAllTasks() SIN forceRefresh');
      // Llama a getAllTasks SIN forzar el refresco
      final tasks = await repository.getAllTasks();
      _masterTaskList = tasks;
      state = AsyncValue.data(_masterTaskList);
      print('🎉 loadInitialTasks COMPLETADO - ${tasks.length} tareas cargadas');
    } catch (e, stack) {
      state = AsyncValue.error(e, stack);
      print('❌ ERROR en loadInitialTasks: $e');
    }
  }

  // ✅ MÉTODO 2: Para el pull-to-refresh (Fuerza la llamada a la API)
  Future<void> refreshTasks() async {
    print('🔄 REFRESH TASKS LLAMADO - Forzando refresco desde API');
    try {
      final repository = _ref.read(tasksRepositoryProvider);
      // Llama a getAllTasks CON el refresco forzado
      final tasks = await repository.getAllTasks(forceRefresh: true);
      _masterTaskList = tasks;
      state = AsyncValue.data(_masterTaskList);
    } catch (e) {
      // Si el refresco falla, no mostramos un error de pantalla completa,
      // simplemente lo dejamos como estaba.
      print('❌ Falló el refresco: $e');
    }
  }

  Future<void> createTask(String title, String description) async {
    try {
      final useCase = _ref.read(createTaskUseCaseProvider);
      final newTask = await useCase(title, description);

      // 🔥 2. Actualiza AMBAS listas.
      _masterTaskList = [newTask, ..._masterTaskList];
      state = AsyncValue.data(_masterTaskList);

    } catch (e, stack) {
      state = AsyncValue.error(e, stack);
      rethrow;
    }
  }

  Future<void> loadMore() async {
    print('📜 LOAD MORE LLAMADO - Verificando si hay más tareas para cargar');
    if (!_hasMore) return;

    try {
      final repository = _ref.read(tasksRepositoryProvider);
      // Con la nueva lógica de fusión inteligente, cargamos todo de una vez
      // Por ahora, simplemente recargamos con forceRefresh
      print('📜 LOAD MORE: Llamando a getAllTasks(forceRefresh: true)');
      final allTasks = await repository.getAllTasks(forceRefresh: true);
      _masterTaskList = allTasks;
      state = AsyncValue.data(_masterTaskList);
      _hasMore = false; // Por ahora no tenemos paginación real
      print('📜 LOAD MORE COMPLETADO');
    } catch (e, stack) {
      state = AsyncValue.error(e, stack);
    }
  }

  Future<void> search(String query) async {
    // 🔥 4. La búsqueda SIEMPRE se hace sobre la lista maestra.
    final previousTasks = _masterTaskList;

    if (query.isEmpty) {
      state = AsyncValue.data(_masterTaskList);
      return;
    }

    state = const AsyncValue.loading();
    try {
      final localMatches = previousTasks.where((task) =>
        task.title.toLowerCase().contains(query.toLowerCase()) ||
        task.description.toLowerCase().contains(query.toLowerCase())
      ).toList();

      print('🔍 Search: Query="$query", Master tasks: ${previousTasks.length}, Local matches: ${localMatches.length}');

      // Buscar en API
      final useCase = _ref.read(searchTasksUseCaseProvider);
      final apiTasks = await useCase(query);
      
      // Combinar resultados, evitando duplicados
      final allResults = [...localMatches, ...apiTasks.where((apiTask) => !localMatches.any((local) => local.id == apiTask.id))];
      print('🔍 Search: API results: ${apiTasks.length}, Total results: ${allResults.length}');
      state = AsyncValue.data(allResults);
    } catch (e, stack) {
      print('❌ Search error: $e');
      state = AsyncValue.error(e, stack);
    }
  }

  Future<void> deleteTask(int taskId) async {
    try {
      final useCase = _ref.read(deleteTaskUseCaseProvider);
      await useCase(taskId);

      // Remove from master list
      _masterTaskList.removeWhere((task) => task.id == taskId);
      state = AsyncValue.data(_masterTaskList);
    } catch (e, stack) {
      state = AsyncValue.error(e, stack);
      rethrow;
    }
  }

  Future<void> updateTask(Task updatedTask) async {
    try {
      // Update in local storage
      final localDataSource = _ref.read(tasksLocalDataSourceProvider);
      await localDataSource.saveTask(updatedTask);

      // Update master list
      _masterTaskList = _masterTaskList.map((task) {
        return task.id == updatedTask.id ? updatedTask : task;
      }).toList();
      state = AsyncValue.data(_masterTaskList);
    } catch (e, stack) {
      state = AsyncValue.error(e, stack);
      rethrow;
    }
  }
}
