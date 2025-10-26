import 'package:hive/hive.dart';
import '../../domain/entities/task.dart';

class TasksLocalDataSource {
  static const String _boxName = 'tasksBox';

  Future<void> init() async {
    await Hive.openBox<Task>(_boxName);
  }

  // Obtiene todas las tareas guardadas
  Future<List<Task>> getTasks() async {
    final box = Hive.box<Task>(_boxName);
    // Ordena las tareas para que las más nuevas aparezcan primero
    return box.values.toList().reversed.toList();
  }

  // Guarda una lista completa de tareas (sobrescribe lo que había)
  Future<void> saveTasks(List<Task> tasks) async {
    final box = Hive.box<Task>(_boxName);
    await box.clear();
    for (var task in tasks) {
      await box.put(task.id, task);
    }
  }

  // Añade o actualiza una sola tarea
  Future<void> saveTask(Task task) async {
    final box = Hive.box<Task>(_boxName);
    await box.put(task.id, task);

    // 👇 AÑADE ESTAS DOS LÍNEAS 👇
    print('📦 Contenido de la caja Hive DESPUÉS de guardar: ${box.values.length} tareas');
  }

  // Elimina una tarea
  Future<void> deleteTask(int taskId) async {
    final box = Hive.box<Task>(_boxName);
    await box.delete(taskId);
  }

  Future<void> clearCache() async {
    final box = Hive.box<Task>(_boxName);
    await box.clear();
  }
}