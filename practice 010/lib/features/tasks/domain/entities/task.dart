import 'package:equatable/equatable.dart';
import 'package:hive/hive.dart';

part 'task.g.dart';

@HiveType(typeId: 0)
class Task extends Equatable {
  const Task({
    this.id,
    required this.title,
    required this.description,
    this.completed = false,
  });

  @HiveField(0)
  final int? id;
  
  @HiveField(1)
  final String title;
  
  @HiveField(2)
  final String description;
  
  @HiveField(3)
  final bool completed;

  @override
  List<Object?> get props => [id, title, description, completed];
}
