# Logos

Esta carpeta contiene los logos oficiales de la aplicación.

## Logo Principal

### Archivos Requeridos
- `pokemon-logo.svg` - **Logo principal** (recomendado - escalable)
- `pokemon-logo.png` - Versión raster como fallback
- `pokemon-logo@2x.png` - Versión de alta densidad (400px de ancho)

### Especificaciones Técnicas

#### SVG (Recomendado)
- **Formato**: SVG vectorial
- **Tamaño**: Escalable sin pérdida de calidad
- **Optimización**: Usar SVGO para reducir tamaño
- **Colores**: Seguir la paleta oficial de Pokémon
- **Fondo**: Transparente

#### PNG (Fallback)
- **Formato**: PNG con transparencia
- **Tamaño máximo**: 200px de ancho
- **Resolución**: 72 DPI para web
- **Color**: Seguir la paleta oficial de Pokémon
- **Fondo**: Transparente

### Colores Oficiales Pokémon
- **Amarillo**: #FFCB05
- **Azul**: #3D7DCA
- **Rojo**: #DC0A2D

## Instrucciones para Agregar el Logo

1. **Preparar el archivo**:
   - Optimizar la imagen (máximo 100KB)
   - Verificar que tenga fondo transparente
   - Asegurar que las dimensiones sean apropiadas

2. **Nomenclatura**:
   - **SVG principal**: `pokemon-logo.svg` (recomendado)
   - **PNG fallback**: `pokemon-logo.png`
   - Para versiones de alta densidad: `pokemon-logo@2x.png`

3. **Ubicación**:
   - Colocar en esta carpeta: `src/assets/images/logos/`

4. **Verificación**:
   - Probar que se muestre correctamente en el header
   - Verificar en diferentes tamaños de pantalla
   - Comprobar que funcione en modo oscuro/claro

## Uso en el Código

El logo se utiliza en el componente `AppHeaderComponent`:

```typescript
// En app-header.component.ts
logoPath = 'assets/images/logos/pokemon-logo.svg'; // SVG recomendado
```

```html
<!-- En app-header.component.html -->
<img [src]="logoPath" alt="Pokémon Logo" class="app-header__logo-img">
<!-- El componente automáticamente usa SVG como principal -->
```

## Herramientas para Optimizar SVG

### SVGO (Recomendado)
```bash
npm install -g svgo
svgo pokemon-logo.svg --output pokemon-logo-optimized.svg
```

### Online Tools
- **SVGOMG**: https://jakearchibald.github.io/svgomg/
- **TinyPNG SVG**: https://tinypng.com/svg
- **SVG Optimizer**: https://www.svgviewer.dev/

## Notas Importantes

- **SVG es la mejor opción** para logos vectoriales como Pokémon
- Mantener la consistencia visual con la marca Pokémon
- Asegurar que el logo sea legible en fondos claros y oscuros
- Probar la accesibilidad (contraste adecuado)
- Verificar que funcione correctamente en dispositivos móviles
- **Optimizar SVG** antes de agregarlo al proyecto 