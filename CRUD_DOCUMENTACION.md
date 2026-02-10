# CRUD de Apiarios y Colmenas - Documentación

## Resumen Ejecutivo

✅ **Estructura clara y jerárquica**:
- **Apiarios**: Contenedor principal (crear, listar, editar, eliminar)
- **Colmenas**: Pertenecen a un apiario específico (gestión dentro del detalle)
- **Vista consolidada**: Pestaña "Colmenas" muestra colmenas de todos los apiarios

## Arquitectura de Pestañas

```
┌─────────────────────────────────────────────────────────┐
│  Pestaña "Apiarios" 🏠 (nueva)                          │
├─────────────────────────────────────────────────────────┤
│  • Ver/Crear/Editar/Eliminar apiarios                  │
│  • Tap en apiario → Detalle + Colmenas                 │
│  • Desde el detalle: Gestionar colmenas                │
└─────────────────────────────────────────────────────────┘
                        ↓ (relacionadas)
┌─────────────────────────────────────────────────────────┐
│  Pestaña "Colmenas" 📋 (actualizada)                    │
├─────────────────────────────────────────────────────────┤
│  • Vista consolidada de TODAS las colmenas              │
│  • Muestra el apiario padre de cada colmena             │
│  • Botón "Ver Apiarios" para ir a gestión completa      │
│  • Tap en colmena → Va al apiario padre                 │
└─────────────────────────────────────────────────────────┘
```

### 1. **Servicios de Base de Datos** (`src/services/`)

#### `database.ts`
- Inicialización de SQLite
- Creación de tablas (apiarios y colmenas)
- Manejo de relaciones (FK con cascada)

#### `apiarioService.ts`
Métodos CRUD para apiarios:
- `createApiario()` - Crear nuevo apiario
- `getAllApiarios()` - Listar todos los apiarios
- `getApiarioById()` - Obtener un apiario específico
- `updateApiario()` - Actualizar apiario
- `deleteApiario()` - Eliminar apiario (elimina colmenas en cascada)

#### `colmenaService.ts`
Métodos CRUD para colmenas:
- `createColmena()` - Crear colmena en un apiario
- `getColmenasByApiario()` - Listar colmenas de un apiario
- `getColmenaById()` - Obtener colmena específica
- `updateColmena()` - Actualizar colmena
- `deleteColmena()` - Eliminar colmena

### 2. **Tipos** (`types/apiario.ts`)
```typescript
Apiario {
  id_apiario: number
  nombre: string
  descripcion?: string
  latitud?: number
  longitud?: number
  municipio?: string
  fecha_creacion: string
  id_usuario?: number
}

Colmena {
  id_colmena: number
  codigo_colmena: string
  estado_general?: string
  fecha_instalacion: string
  observaciones?: string
  id_apiario: number
}
```

### 3. **Pantallas Implementadas**

#### `app/(app)/apiarios.tsx` - Stack Navigator de Apiarios
- Archivo de entrada para la pestaña "Apiarios"
- Gestiona el stack de navegación para la sección

#### `app/(app)/apiarios/index.tsx` - Lista de Apiarios
- Pantalla principal de la pestaña "Apiarios"
- Muestra todos los apiarios
- Botón + para crear nuevo apiario
- Pull-to-refresh para recargar
- Botones de editar y eliminar en cada tarjeta
- Tap en tarjeta para ver detalle del apiario y sus colmenas

#### `app/(app)/page1.tsx` - Vista Consolidada de Colmenas
- Pantalla de la pestaña "Colmenas"
- Muestra **todas las colmenas** de todos los apiarios
- Información del apiario padre de cada colmena
- Botón "Ver Apiarios" para acceder a la gestión completa
- Pull-to-refresh
- Tap en colmena lleva al detalle del apiario padre

#### `app/(app)/apiarios/new.tsx` - Crear/Editar Apiario
- Formulario para crear nuevo apiario
- Formulario para editar un apiario existente
- Campos: Nombre*, Descripción, Municipio, Latitud, Longitud
- Validación de campos requeridos

#### `app/(app)/apiarios/[id].tsx` - Detalle del Apiario + Colmenas
- Información completa del apiario seleccionado
- Lista de colmenas asociadas al apiario
- Crear nueva colmena con modal
- Editar colmena (desde el modal)
- Eliminar colmena (con confirmación)
- Botón editar en header para modificar datos del apiario

#### `app/(app)/apiarios/edit/[id].tsx` - Editar Apiario Modal
- Formulario de edición (se abre como modal)

## Flujo de Navegación

```
Pestañas Bottom Tab:
├── Inicio
├── Apiarios ⭐ (NEW - Gestión de apiarios)
│   ├── Lista de apiarios
│   │   ├── Tap en apiario → Ver detalle + Colmenas
│   │   ├── Botón Editar → Editar Apiario
│   │   └── Botón Eliminar → Confirmar
│   ├── Botón + → Crear nuevo Apiario
│   ├── Detalle Apiario
│   │   ├── Información del apiario
│   │   ├── Lista de Colmenas del apiario
│   │   │   ├── Botón Editar → Modal Editar Colmena
│   │   │   └── Botón Eliminar → Confirmación
│   │   ├── Botón + Colmena → Modal Crear Colmena
│   │   └── Botón Edit Header → Editar datos del Apiario
│   └── Editar modal → Formulario de edición
│
├── Colmenas ⭐ (ACTUALIZADO - Vista consolidada)
│   ├── Vista de todas las colmenas de todos los apiarios
│   ├── Botón "Ver Apiarios" → Navega a pestaña Apiarios
│   └── Tap en colmena → Va al detalle del apiario padre
│
├── Inspecciones
└── Producción
```

## Distinción Clara de Entidades

### 📍 Pestaña "Apiarios"
- **Gestión completa de la jerarquía**
- Ver/Crear/Editar/Eliminar apiarios
- Dentro de cada apiario: gestionar sus colmenas
- Acceso total a relaciones y operaciones

### 📋 Pestaña "Colmenas"
- **Vista consolidada/resumen**
- Todas las colmenas de todos los apiarios
- Información del apiario padre de cada colmena
- Acceso rápido al apiario desde la colmena
- **No permite crear/eliminar** aquí (solo desde el apiario padre)

## Cómo Usar

### 1. **Iniciar la App**
```bash
npm run dev
```

### 2. **Crear un Apiario**
1. Ve a la pestaña **"Apiarios"** (nueva pestaña)
2. Toca el botón + en la esquina superior derecha
3. Completa los datos (nombre es obligatorio)
4. Toca "Crear"

### 3. **Ver Detalle del Apiario y Gestionar Colmenas**
1. Desde la pestaña "Apiarios", toca una tarjeta de apiario
2. Verás toda la información del apiario
3. Abajo estará la lista de colmenas asociadas
4. Toca el botón + para crear una nueva colmena

### 4. **Crear Colmena**
En el detalle del apiario:
1. Toca el botón + en "Colmenas"
2. Se abrirá un modal con el formulario
3. Completa el código y fecha de instalación (requeridos)
4. Toca "Crear"

### 5. **Ver Todas las Colmenas**
1. Ve a la pestaña **"Colmenas"**
2. Verás todas las colmenas de todos tus apiarios
3. Cada colmena muestra su apiario padre
4. Toca una colmena para ir al detalle de su apiario
5. Toca "Ver Apiarios" para ir a la gestión completa

### 6. **Editar Colmena**
1. En el detalle del apiario, toca el botón editar en la colmena
2. Modifica los datos en el modal
3. Toca "Guardar"

### 7. **Eliminar**
- Toca el botón de papelera (rojo)
- Confirma en el diálogo

## Características Implementadas

✅ **CRUD Completo**: Create, Read, Update, Delete para apiarios y colmenas
✅ **SQLite Local**: Almacenamiento persistente
✅ **Relaciones en BD**: FK con cascada (eliminar apiario = eliminar colmenas)
✅ **Validaciones**: Campos requeridos validados
✅ **UI Responsiva**: Diseño coherente con el tema existente
✅ **Navegación Stack**: Flujo intuitivo entre pantallas
✅ **Modal para Formularios**: Creación/edición de colmenas inline
✅ **Pull-to-Refresh**: Actualizar lista de apiarios
✅ **Confirmaciones**: Diálogos antes de eliminar
✅ **TypeScript**: Completamente tipado

## Próximos Pasos (Opcionales)

1. **Agregar filtros** en la lista de apiarios (por municipio, estado, etc.)
2. **Agregar búsqueda** de apiarios
3. **Estadísticas** (cantidad de colmenas, estado general, etc.)
4. **Inspecciones y Produción**: Crear CRUD similar para otras entidades
5. **Exportar datos** a CSV/PDF
6. **Sincronización** con Supabase (opcional, actualmente todo es local)
7. **Fotos** de apiarios/colmenas
8. **Ubicación GPS** automática al crear apiario

## Notas Técnicas

- **Base de datos**: `bee-smart.db` en el almacenamiento de la app
- **ORM**: No se usa (consultas SQL directas con expo-sqlite)
- **Estado**: Se gestiona con useState en cada pantalla
- **Actualización de listas**: Se recarga tras cada operación CRUD
- **Timezone**: Las fechas se guardan en ISO 8601 (UTC)
