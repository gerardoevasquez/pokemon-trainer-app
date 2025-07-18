# Pokemon Trainer App - Prueba Técnica Frontend

Aplicación Angular para crear y gestionar perfiles de entrenadores Pokémon, consumiendo la PokeAPI.

## 🎯 Funcionalidades

- **Perfil de Entrenador**: Configuración con foto, nombre, pasatiempo, fecha de nacimiento y documento de identidad
- **Selección de Equipo**: Lista de Pokémon de primera generación con filtros y selección de 3 Pokémon
- **Perfil del Entrenador**: Visualización de datos y equipo seleccionado
- **Edición**: Modificación de perfil y equipo Pokémon
- **Validaciones**: Formularios con validaciones específicas según edad

## 🚀 Instalación y Ejecución

### Prerrequisitos
- Node.js (versión 18 o superior)
- npm o yarn
- Angular CLI

### Instalación

1. **Clonar el repositorio**
```bash
git clone <url-del-repositorio>
cd gerardo-vasquez-prueba-tecnica
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Ejecutar en modo desarrollo**
```bash
ng serve
```

4. **Abrir en el navegador**
```
http://localhost:4200
```

### Scripts disponibles

- `npm start` - Ejecuta la aplicación en modo desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm test` - Ejecuta las pruebas unitarias
- `npm run lint` - Ejecuta el linter

## 🏗️ Estructura del Proyecto

```
src/
├── app/
│   ├── components/          # Componentes reutilizables
│   ├── pages/              # Páginas principales
│   ├── services/           # Servicios para API y lógica de negocio
│   ├── models/             # Interfaces y tipos TypeScript
│   ├── shared/             # Componentes y utilidades compartidas
│   └── utils/              # Utilidades y helpers
├── assets/                 # Imágenes, iconos y recursos estáticos
└── styles/                 # Estilos globales y variables CSS
```

## 🎨 Diseño

El diseño sigue las especificaciones del archivo Figma proporcionado:
- [Figma Design](https://www.figma.com/file/hYCiD7uLE5ICSZLxrYJqZ3/Pokemon-Trainer?node-id=0%3A1)

## 🔌 API

La aplicación consume la PokeAPI:
- **Base URL**: https://pokeapi.co/
- **Documentación**: https://pokeapi.co/docs/v2

### Endpoints principales utilizados:
- `/api/v2/pokemon/` - Lista de Pokémon
- `/api/v2/pokemon/{id}/` - Detalles de Pokémon específico

## 🧪 Testing

```bash
# Ejecutar todas las pruebas
npm test

# Ejecutar pruebas con coverage
npm run test:coverage
```

## 🐳 Docker

Para ejecutar con Docker:

```bash
# Construir imagen
docker build -t pokemon-trainer .

# Ejecutar contenedor
docker run -p 4200:4200 pokemon-trainer
```

## 📦 Despliegue

### Google Cloud Platform

1. **Configurar Google Cloud CLI**
2. **Construir para producción**
```bash
npm run build:prod
```
3. **Desplegar en Cloud Run o App Engine**

## 🔧 Tecnologías Utilizadas

- **Framework**: Angular 20
- **Lenguaje**: TypeScript
- **Estilos**: SCSS
- **Testing**: Jasmine + Karma
- **Linting**: ESLint
- **Package Manager**: npm

## 📝 Notas de Desarrollo

- Todos los comentarios y commits están en inglés
- Se sigue Git Flow para el versionamiento
- Validaciones específicas para DUI y carnet de minoridad según edad
- Implementación de virtual scroll para optimización de rendimiento
- Uso de Swiper para carruseles de Pokémon

## 👨‍💻 Autor

Gerardo Vasquez - Prueba Técnica Frontend Developer
