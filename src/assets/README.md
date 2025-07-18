# Assets - Recursos Estáticos

Esta carpeta contiene todos los recursos estáticos de la aplicación.

## Estructura de Carpetas

```
assets/
├── images/
│   ├── logos/           # Logos de la aplicación
│   │   ├── pokemon-logo.png
│   │   ├── pokemon-logo.svg
│   │   └── pokemon-logo@2x.png
│   ├── icons/           # Iconos personalizados
│   ├── backgrounds/     # Imágenes de fondo
│   └── pokemon/         # Imágenes relacionadas con Pokémon
├── fonts/               # Fuentes personalizadas
└── data/                # Datos estáticos (JSON, etc.)
```

## Convenciones de Nomenclatura

### Imágenes
- **Logos**: `{nombre}-logo.{extensión}` (ej: `pokemon-logo.png`)
- **Iconos**: `icon-{nombre}.{extensión}` (ej: `icon-search.svg`)
- **Fondos**: `bg-{nombre}.{extensión}` (ej: `bg-pokemon-pattern.png`)
- **Pokémon**: `pokemon-{id}.{extensión}` (ej: `pokemon-001.png`)

### Formatos Soportados
- **PNG**: Para imágenes con transparencia
- **SVG**: Para iconos y logos vectoriales
- **WebP**: Para optimización de rendimiento
- **JPG/JPEG**: Para fotografías

### Versiones de Densidad
- **1x**: `pokemon-logo.png` (densidad normal)
- **2x**: `pokemon-logo@2x.png` (alta densidad)
- **3x**: `pokemon-logo@3x.png` (muy alta densidad)

## Buenas Prácticas

### 1. Optimización
- Comprimir todas las imágenes antes de agregarlas
- Usar formatos apropiados (SVG para iconos, WebP para fotos)
- Proporcionar múltiples densidades para pantallas de alta resolución

### 2. Tamaños Recomendados
- **Logos**: Máximo 200px de ancho
- **Iconos**: 24x24px, 32x32px, 48x48px
- **Fondos**: Optimizados para 1440px de ancho
- **Pokémon**: 96x96px, 128x128px

### 3. Nomenclatura
- Usar kebab-case para nombres de archivos
- Ser descriptivo pero conciso
- Incluir dimensiones en el nombre si es necesario

### 4. Organización
- Mantener una estructura lógica de carpetas
- Agrupar recursos por tipo y función
- Documentar cualquier convención especial

## Uso en Angular

### Importación en Componentes
```typescript
// En el componente
logoPath = 'assets/images/logos/pokemon-logo.png';
```

### Uso en Templates
```html
<img [src]="logoPath" alt="Pokémon Logo" class="logo">
```

### Uso en CSS/SCSS
```scss
.logo {
  background-image: url('/assets/images/logos/pokemon-logo.png');
  background-size: contain;
  background-repeat: no-repeat;
}
```

## Herramientas Recomendadas

### Optimización de Imágenes
- **TinyPNG**: Compresión de PNG/JPG
- **SVGO**: Optimización de SVG
- **ImageOptim**: Optimización general

### Conversión de Formatos
- **Squoosh**: Conversión a WebP
- **Convertio**: Conversión entre formatos

## Notas Importantes

- Todos los assets deben ser versionados en Git
- Mantener un registro de cambios en este README
- Revisar regularmente el tamaño total de assets
- Considerar lazy loading para imágenes grandes 