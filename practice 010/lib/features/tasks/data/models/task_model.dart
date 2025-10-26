import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:hive/hive.dart';
import '../../domain/entities/task.dart';

part 'task_model.freezed.dart';
part 'task_model.g.dart';

@freezed
@HiveType(typeId: 0)
class TaskModel with _$TaskModel {
  const TaskModel._();

  const factory TaskModel({
    @HiveField(0) int? id,
    @HiveField(1) required String title,
    @HiveField(2) required String description,
    @HiveField(3) @Default(false) bool completed,
    @HiveField(4) int? userId,
  }) = _TaskModel;

  factory TaskModel.fromJson(Map<String, dynamic> json) {
    return TaskModel(
      id: json['id'] as int?,
      title: json['title'] as String? ?? '',
      description: json['body'] as String? ?? '', // ✅ JSONPlaceholder usa 'body'
      completed: json['completed'] as bool? ?? false,
      userId: json['userId'] as int?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      if (id != null) 'id': id,
      'title': title,
      'body': description, // ✅ Envía como 'body' a la API
      'completed': completed,
      'userId': userId ?? 1,
    };
  }

  Task toEntity() {
    return Task(
      id: id,
      title: title,
      description: description,
      completed: completed,
    );
  }

  factory TaskModel.fromEntity(Task task) {
    return TaskModel(
      id: task.id,
      title: task.title,
      description: task.description,
      completed: task.completed,
      userId: 1,
    );
  }
}
