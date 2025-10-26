import '../entities/task.dart';
import '../repositories/tasks_repository.dart';

class GetTaskDetails {
  final TasksRepository repository;

  GetTaskDetails(this.repository);

  Future<Task> call(int taskId) async {
    return await repository.getTaskDetails(taskId);
  }
}
