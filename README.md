# MEVASA · Transporte Metropolitano de Valladolid

Web pública (React + Vite + Tailwind) con líneas, mapa y seguimiento de autobuses.
Publicada con GitHub Pages: https://oscarolmosherrero.github.io/mevasa-app/

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:5173/mevasa-app/
npm run build
```

## Publicar

1. En GitHub: **Settings → Pages → Source: GitHub Actions** (solo la primera vez).
2. `git push` a `main`: el workflow `.github/workflows/deploy.yml` construye y despliega.

## Dónde editar

- `src/data/lines.js`: líneas, colores, recorridos, tarifas, operadores. Las líneas con
  `provisional: true` están por confirmar; las coordenadas de paradas son aproximadas.
- `src/services/vehicles.js`: posición de autobuses. Hoy es una **simulación**; aquí se
  conecta el feed real (GTFS-Realtime a través de un proxy, ya que Pages es estático).

## Fuente de datos

Junta de Castilla y León, Carreteras y Transportes. Proyecto independiente, no oficial.
