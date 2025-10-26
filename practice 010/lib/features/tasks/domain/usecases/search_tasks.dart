import '../entities/task.dart';
import '../repositories/tasks_repository.dart';

class SearchTasks {
  final TasksRepository repository;

  SearchTasks(this.repository);

  Future<List<Task>> call(String query) async {
    return await repository.searchTasks(query);
  }
}