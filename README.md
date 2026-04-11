# Frontend (Vite + React)

Aplicación web del proyecto Montero.

## Seguridad

- `npm audit` sin vulnerabilidades conocidas en dependencias (revisar periódicamente).
- Exportación/importación de Excel con `exceljs` en lugar del paquete `xlsx` (SheetJS Community) con avisos sin parche en npm.
- `swiper` actualizado a la línea 12.x con corrección de seguridad (prototype pollution en versiones anteriores).

## Desarrollo

```bash
npm install
npm run dev
```

Build de producción: `npm run build`
