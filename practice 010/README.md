# Smart Task Manager

Proyecto demo que implementa POST (crear) y GET (detalles/lista) usando Dio y una arquitectura feature-first / clean architecture.

## ✨ Features Completas
- ✅ **HTTP Operations**: POST para crear tareas, GET para listar y detalles
- ✅ **Retry Automático**: Reintenta requests fallidos con backoff exponencial
- ✅ **Caching Offline**: Persistencia local con Hive (network first, cache fallback)
- ✅ **Paginación Infinita**: Carga 10 tareas por página con scroll
- ✅ **Búsqueda en Tiempo Real**: Filtra tareas por título
- ✅ **Error Handling**: Mensajes user-friendly y manejo de estados
- ✅ **UI Moderna**: Navegación fluida, loading states, SnackBars
- ✅ **Arquitectura**: Clean Architecture + Riverpod + Feature-first
- ✅ **Tests**: Unitarios con Mocktail

## 🗂️ Estructura del Proyecto
```
lib/
├── core/network/          # DioClient, NetworkExceptions, RetryInterceptor
├── features/tasks/        # Feature completa
│   ├── data/              # Models, Datasources (Remote + Local), Repository
│   ├── domain/            # Entities, Repositories, UseCases
│   └── presentation/      # Providers, Pages, Widgets
└── main.dart              # App entrypoint
```

## 🚀 Primeros Pasos (Windows PowerShell)
```powershell
cd 'c:\Users\julio\Desktop\practice 010'

# Instalar dependencias
flutter pub get

# Generar código Freezed/Json/Hive
flutter pub run build_runner build --delete-conflicting-outputs

# Ejecutar tests
flutter test

# Correr la app (emulador o dispositivo)
flutter run
```

## 🧪 Tests
```powershell
flutter test --reporter=expanded  # Tests detallados
```

## 📱 Uso de la App
1. **Lista de Tareas**: Ver tareas paginadas con búsqueda
2. **Crear Tarea**: FAB → Formulario → POST a API
3. **Detalles**: Tap en tarea → GET detalles
4. **Offline**: Funciona sin internet usando cache

## 🛠️ Tecnologías
- **Flutter**: UI framework
- **Dio**: HTTP client con interceptors
- **Riverpod**: State management
- **Freezed**: Immutable models
- **Hive**: Local caching
- **Mocktail**: Testing mocks

## 📚 API Usada
- **JSONPlaceholder**: https://jsonplaceholder.typicode.com
- Endpoints: `/posts` (GET/POST), `/posts/{id}` (GET)

## 🤖 Desarrollo Proactivo
Este proyecto demuestra uso proactivo de IA (como Gemini) para aprender arquitectura Flutter avanzada, no solo copy-paste.

Notas: Si no tienes Flutter instalado, sigue https://flutter.dev/docs/get-started/install
