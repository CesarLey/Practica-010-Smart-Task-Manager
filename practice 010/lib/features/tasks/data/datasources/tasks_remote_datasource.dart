import '../../../../core/network/dio_client.dart';
import '../models/task_model.dart';

class TasksRemoteDataSource {
  final DioClient _dioClient;

  TasksRemoteDataSource(this._dioClient);

  Future<TaskModel> createTask(TaskModel task) async {
    final response = await _dioClient.post(
      '/posts',
      data: task.toJson(),
    );
    
    return TaskModel.fromJson(Map<String, dynamic>.from(response.data as Map));
  }

  Future<TaskModel> getTaskDetails(int taskId) async {
    final response = await _dioClient.get('/posts/$taskId');
    return TaskModel.fromJson(Map<String, dynamic>.from(response.data as Map));
  }

  Future<List<TaskModel>> getAllTasks({
    int page = 1,
    int limit = 10,
  }) async {
    final response = await _dioClient.get(
      '/posts',
      queryParams: {
        '_page': page,
        '_limit': limit,
      },
    );
    final list = response.data as List;
    return list.map((e) => TaskModel.fromJson(Map<String, dynamic>.from(e as Map))).toList();
  }

  Future<List<TaskModel>> searchTasks(String query) async {
    final response = await _dioClient.get(
      '/posts',
      queryParams: {'title_like': query},
    );
    final list = response.data as List;
    return list.map((e) => TaskModel.fromJson(Map<String, dynamic>.from(e as Map))).toList();
  }

  Future<void> deleteTask(int taskId) async {
    await _dioClient.delete('/posts/$taskId');
  }

  Future<TaskModel> updateTask(TaskModel task) async {
    final response = await _dioClient.put(
      '/posts/${task.id}',
      data: task.toJson(),
    );
    
    return TaskModel.fromJson(Map<String, dynamic>.from(response.data as Map));
  }
}
