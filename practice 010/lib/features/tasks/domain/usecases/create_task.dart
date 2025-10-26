import '../entities/task.dart';
import '../repositories/tasks_repository.dart';

class CreateTask {
  final TasksRepository repository;

  CreateTask(this.repository);

  Future<Task> call(String title, String description) async {
    final task = Task(
      title: title,
      description: description,
      completed: false,
    );

    return await repository.createTask(task);
  }
}
