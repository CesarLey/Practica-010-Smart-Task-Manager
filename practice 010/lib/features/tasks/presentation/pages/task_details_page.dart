import 'package:flutter/material.dart';
import '../../domain/entities/task.dart';
import 'edit_task_page.dart';

class TaskDetailsPage extends StatelessWidget {
  final Task task;

  const TaskDetailsPage({required this.task, super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(task.title),
        actions: [
          IconButton(
            icon: const Icon(Icons.edit),
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => EditTaskPage(task: task),
                ),
              );
            },
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              task.description,
              style: Theme.of(context).textTheme.bodyLarge,
            ),
            const SizedBox(height: 16),
            Text(
              'ID: ${task.id}',
              style: Theme.of(context).textTheme.bodySmall?.copyWith(color: Colors.grey),
            ),
          ],
        ),
      ),
    );
  }
}
