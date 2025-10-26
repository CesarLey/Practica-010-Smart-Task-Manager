import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/tasks_provider.dart';
import '../widgets/task_card.dart';
import 'create_task_page.dart';
import 'task_details_page.dart';
import '../../domain/entities/task.dart';

class TasksListPage extends ConsumerStatefulWidget {
  const TasksListPage({super.key});

  @override
  ConsumerState<TasksListPage> createState() => _TasksListPageState();
}

class _TasksListPageState extends ConsumerState<TasksListPage> {
  final ScrollController _scrollController = ScrollController();
  final TextEditingController _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _scrollController.addListener(_onScroll);
  }

  @override
  void dispose() {
    _scrollController.dispose();
    _searchController.dispose();
    super.dispose();
  }

  void _onScroll() {
    if (_scrollController.position.pixels >=
        _scrollController.position.maxScrollExtent * 0.9) {
      ref.read(tasksListProvider.notifier).loadMore();
    }
  }

  Future<void> _refreshTasks() async {
    await ref.read(tasksListProvider.notifier).refreshTasks();
  }

  void _navigateToCreateTask() async {
    await Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => const CreateTaskPage()),
    );

    // COMENTAR ESTO: No hacer refresh automático porque borra las tareas creadas
    // if (result == true) {
    //   _refreshTasks();
    // }
  }

  void _navigateToTaskDetails(Task task) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => TaskDetailsPage(task: task),
      ),
    );
  }

  void _onSearchChanged(String query) {
    ref.read(tasksListProvider.notifier).search(query);
  }

  @override
  Widget build(BuildContext context) {
    final tasksAsync = ref.watch(tasksListProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Smart Task Manager'),
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(60),
          child: Padding(
            padding: const EdgeInsets.all(8.0),
            child: TextField(
              controller: _searchController,
              decoration: InputDecoration(
                hintText: 'Buscar tareas...',
                prefixIcon: const Icon(Icons.search),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
                filled: true,
                fillColor: Colors.white,
              ),
              onChanged: _onSearchChanged,
            ),
          ),
        ),
      ),
      body: RefreshIndicator(
        onRefresh: () => ref.read(tasksListProvider.notifier).refreshTasks(),
        child: tasksAsync.when(
          data: (tasks) {
            if (tasks.isEmpty) {
              return const Center(child: Text('No tasks found'));
            }

            return ListView.builder(
              controller: _scrollController,
              padding: const EdgeInsets.all(16),
              itemCount: tasks.length,
              itemBuilder: (context, index) {
                final task = tasks[index];
                return Dismissible(
                  key: Key('task_${task.id}'),
                  direction: DismissDirection.endToStart,
                  background: Container(
                    alignment: Alignment.centerRight,
                    padding: const EdgeInsets.only(right: 20),
                    color: Colors.red,
                    child: const Icon(
                      Icons.delete,
                      color: Colors.white,
                    ),
                  ),
                  confirmDismiss: (direction) async {
                    return await showDialog(
                      context: context,
                      builder: (BuildContext context) {
                        return AlertDialog(
                          title: const Text('Eliminar Tarea'),
                          content: Text('¿Estás seguro de que quieres eliminar "${task.title}"?'),
                          actions: <Widget>[
                            TextButton(
                              onPressed: () => Navigator.of(context).pop(false),
                              child: const Text('Cancelar'),
                            ),
                            TextButton(
                              onPressed: () => Navigator.of(context).pop(true),
                              child: const Text('Eliminar'),
                            ),
                          ],
                        );
                      },
                    );
                  },
                  onDismissed: (direction) {
                    ref.read(tasksListProvider.notifier).deleteTask(task.id!);
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text('Tarea "${task.title}" eliminada')),
                    );
                  },
                  child: TaskCard(
                    task: task,
                    onTap: () => _navigateToTaskDetails(task),
                  ),
                );
              },
            );
          },
          loading: () => const Center(child: CircularProgressIndicator()),
          error: (e, _) => Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(e.toString()),
                ElevatedButton(
                  onPressed: _refreshTasks,
                  child: const Text('Reintentar'),
                ),
              ],
            ),
          ),
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _navigateToCreateTask,
        icon: const Icon(Icons.add),
        label: const Text('Nueva Tarea'),
      ),
    );
  }
}
