# RESUMEN TECNIYA - Proyecto Completo

## Enlaces
- GitHub: https://github.com/LuisFernando160837/tecniya
- Netlify (público): https://tecniya-nasturtium-8ee1e6.netlify.app
- Render (API + BD): https://tecniya.onrender.com
- WhatsApp: 907710001 (código: 51907710001)

## Estructura del proyecto
- `D:\SistemaTecniYa\frontend\` - React + Vite + Tailwind (solo landing page)
- `D:\SistemaTecniYa\backend\` - NestJS + TypeORM + PostgreSQL

## Frontend (público)
- `src/pages/HomePage.tsx` - Landing page completa con formulario
- API URL: `https://tecniya.onrender.com/api`
- El formulario envía a API + abre WhatsApp simultáneamente
- Sin autenticación, sin login, sin roles

## Backend (API)
- NestJS en Render, puerto 10000
- Endpoint público: `POST /api/public/solicitudes`
- BD: PostgreSQL en Render (auto-migraciones)
- Última migración: AddEquipoFields (tipo_equipo, marca, modelo)

## Cómo editar
1. Editar archivos en `D:\SistemaTecniYa\frontend\src\`
2. `git add . && git commit -m "mensaje" && git push`
3. Netlify + Render se actualizan solos

## To-do pendiente
- (nada por ahora)
