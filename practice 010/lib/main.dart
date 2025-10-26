import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart'; // ✅ IMPORT FOR RIVERPOD
import 'package:hive_flutter/hive_flutter.dart';

// ✅ IMPORT YOUR TASK ENTITY (TaskAdapter is generated inside this file)
import 'features/tasks/domain/entities/task.dart';

import 'app/view/app.dart'; // Your main App widget

void main() async {
  // Ensure Flutter is ready before using plugins
  WidgetsFlutterBinding.ensureInitialized();

  print('🚀 INICIANDO MAIN.DART - Inicialización de la app');

  // Initialize Hive for local storage
  await Hive.initFlutter();
  print('📦 Hive inicializado');

  // Register the adapter so Hive knows how to save/read your Task object
  Hive.registerAdapter(TaskAdapter());
  print('🔧 TaskAdapter registrado');

  // Clear old incompatible data if it exists
  if (await Hive.boxExists('tasksBox')) {
    await Hive.deleteBoxFromDisk('tasksBox');
    print('🗑️ Caja antigua eliminada');
  }

  // ✅ OPEN THE BOX so it's ready for use throughout the app
  await Hive.openBox<Task>('tasksBox');
  print('📦 Caja tasksBox abierta y lista');

  print('🎯 MAIN.DART COMPLETADO - Lanzando ProviderScope');

  // ✅ WRAP YOUR APP with ProviderScope for Riverpod to work
  runApp(
    const ProviderScope(
      child: App(),
    ),
  );
}
