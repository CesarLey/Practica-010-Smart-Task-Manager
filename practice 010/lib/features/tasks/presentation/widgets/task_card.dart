import 'package:flutter/material.dart';
import '../../domain/entities/task.dart';

class TaskCard extends StatelessWidget {
  final Task task;
  final VoidCallback? onTap;

  const TaskCard({required this.task, this.onTap, super.key});

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.symmetric(vertical: 8, horizontal: 12),
      child: ListTile(
        onTap: onTap,
        title: Text(task.title),
        subtitle: Text(task.description),
        trailing: Icon(task.completed ? Icons.check_circle : Icons.radio_button_unchecked),
      ),
    );
  }
}
