import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/tasks_provider.dart';
import '../../../../core/network/network_exceptions.dart';

class CreateTaskPage extends ConsumerStatefulWidget {
  const CreateTaskPage({super.key});

  @override
  ConsumerState<CreateTaskPage> createState() => _CreateTaskPageState();
}

class _CreateTaskPageState extends ConsumerState<CreateTaskPage> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _descriptionController = TextEditingController();
  bool _isLoading = false;

  @override
  void dispose() {
    _titleController.dispose();
    _descriptionController.dispose();
    super.dispose();
  }

  Future<void> _submitTask() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);

    try {
      await ref.read(tasksListProvider.notifier).createTask(
            _titleController.text.trim(),
            _descriptionController.text.trim(),
          );

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
          content: Text('✅ Tarea creada exitosamente'),
          backgroundColor: Colors.green,
          behavior: SnackBarBehavior.floating,
        ));
        Navigator.pop(context); // ← SIN el 'true'
      }
    } on NetworkException catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(
          content: Text('❌ ${e.message}'),
          backgroundColor: Colors.red,
          behavior: SnackBarBehavior.floating,
        ));
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
          content: Text('❌ Error al crear tarea'),
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
        title: const Text('Nueva Tarea'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Text('Crea una nueva tarea', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
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
                onPressed: _isLoading ? null : _submitTask,
                child: _isLoading ? const CircularProgressIndicator() : const Text('Crear Tarea'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
