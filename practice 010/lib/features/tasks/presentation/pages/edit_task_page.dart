import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../domain/entities/task.dart';
import '../providers/tasks_provider.dart';

class EditTaskPage extends ConsumerStatefulWidget {
  final Task task;

  const EditTaskPage({required this.task, super.key});

  @override
  ConsumerState<EditTaskPage> createState() => _EditTaskPageState();
}

class _EditTaskPageState extends ConsumerState<EditTaskPage> {
  final _formKey = GlobalKey<FormState>();
  late final _titleController = TextEditingController(text: widget.task.title);
  late final _descriptionController = TextEditingController(text: widget.task.description);
  bool _isLoading = false;

  @override
  void dispose() {
    _titleController.dispose();
    _descriptionController.dispose();
    super.dispose();
  }

  Future<void> _updateTask() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);

    try {
      final updatedTask = Task(
        id: widget.task.id,
        title: _titleController.text.trim(),
        description: _descriptionController.text.trim(),
        completed: widget.task.completed,
      );

      await ref.read(tasksListProvider.notifier).updateTask(updatedTask);

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
          content: Text('✅ Tarea actualizada exitosamente'),
          backgroundColor: Colors.green,
          behavior: SnackBarBehavior.floating,
        ));
        Navigator.pop(context);
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(
          content: Text('❌ Error al actualizar tarea: $e'),
          backgroundColor: Colors.red,
          behavior: SnackBarBehavior.floating,
        ));
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Editar Tarea'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Text('Edita los detalles de la tarea', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
              const SizedBox(height: 16),
              TextFormField(
                controller: _titleController,
                decoration: const InputDecoration(labelText: 'Título'),
                validator: (value) {
                  if (value == null || value.trim().isEmpty) return 'Por favor ingresa un título';
                  return null;
                },
              ),
              const SizedBox(height: 12),
              TextFormField(
                controller: _descriptionController,
                decoration: const InputDecoration(labelText: 'Descripción'),
                maxLines: 5,
                validator: (value) {
                  if (value == null || value.trim().isEmpty) return 'Por favor ingresa una descripción';
                  return null;
                },
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: _isLoading ? null : _updateTask,
                child: _isLoading ? const CircularProgressIndicator() : const Text('Actualizar Tarea'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}