import '../repositories/tasks_repository.dart';

class DeleteTask {
  final TasksRepository repository;

  DeleteTask(this.repository);

  Future<void> call(int taskId) async {
    return await repository.deleteTask(taskId);
  }
}