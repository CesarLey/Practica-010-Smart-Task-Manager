import '../entities/task.dart';

abstract class TasksRepository {
  Future<Task> createTask(Task task);
  Future<Task> getTaskDetails(int taskId);
  Future<List<Task>> getAllTasks({bool forceRefresh = false});
  Future<List<Task>> searchTasks(String query);
  Future<void> deleteTask(int taskId);
  Future<void> deleteTaskByTask(Task task);
  Future<void> updateTask(Task task);
}
