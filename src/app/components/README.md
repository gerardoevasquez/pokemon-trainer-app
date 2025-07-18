# Componentes Reutilizables - Pokemon Trainer App

## 📁 Estructura de Carpetas

### Layout Components (4)
```
layout/
├── app-header/          # Header con logo Pokémon
├── main-header/         # Header principal con navegación
├── page-header/         # Títulos de página con flecha de regreso
└── page-container/      # Contenedores principales
```

### Form Components (5)
```
forms/
├── section-header/      # Títulos de sección con subtítulos
├── input-field/         # Campos de texto genéricos
├── date-picker-field/   # Campo de fecha
├── search-bar/          # Campo de búsqueda con lupa
└── primary-button/      # Botones principales
```

### Profile Components (3)
```
profile/
├── profile-image-uploader/  # Carga de imagen de perfil
├── trainer-profile-card/    # Card de perfil del entrenador
└── greeting-section/        # Sección de saludo
```

### Pokemon Components (4)
```
pokemon/
├── pokemon-card/        # Tarjetas de selección de Pokémon
├── pokemon-grid/        # Grid de Pokémon
├── pokemon-display-card/ # Tarjetas de visualización de Pokémon
└── pokemon-stats-bar/   # Barras de progreso de stats
```

### Loading Components (3)
```
loading/
├── loading-screen/      # Pantalla de carga completa
├── loading-spinner/     # Spinner de Poké Ball
└── loading-message/     # Mensajes de carga
```

### Action Components (2)
```
actions/
├── edit-button/         # Botones de edición con icono de lápiz
└── user-dropdown/       # Dropdown de usuario
```

## 🎯 Componentes por Página

### Trainer Profile Page
- `AppHeader`
- `PageHeader`
- `PageContainer`
- `SectionHeader`
- `InputField`
- `DatePickerField`
- `PrimaryButton`
- `ProfileImageUploader`

### Pokemon Selection Page
- `AppHeader`
- `PageHeader`
- `PageContainer`
- `SectionHeader`
- `SearchBar`
- `PokemonGrid`
- `PokemonCard`
- `PrimaryButton`
- `LoadingScreen`

### Trainer Profile View Page
- `MainHeader`
- `GreetingSection`
- `TrainerProfileCard`
- `SectionHeader`
- `PokemonDisplayCard`
- `PokemonStatsBar`
- `EditButton`
- `UserDropdown`

## 📋 Convenciones de Nomenclatura

- **Componentes**: kebab-case (ej: `profile-image-uploader`)
- **Archivos**: kebab-case (ej: `profile-image-uploader.component.ts`)
- **Clases**: PascalCase (ej: `ProfileImageUploaderComponent`)
- **Selectores**: app-prefix (ej: `app-profile-image-uploader`)

## 🚀 Próximos Pasos

1. Crear cada componente como standalone
2. Implementar interfaces de Input/Output
3. Agregar estilos SCSS siguiendo BEM
4. Implementar funcionalidades específicas
5. Agregar tests unitarios 