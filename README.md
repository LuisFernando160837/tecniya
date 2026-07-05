# TecniYA ⚡

Plataforma de Soporte Técnico a Domicilio con Triage por IA Local (Ollama)

**Huancayo, Perú** — Conecta clientes con técnicos de soporte informático/electrónico a domicilio, con diagnóstico previo asistido por inteligencia artificial 100% local.

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | React 19 + Vite + TailwindCSS v4 (PWA) |
| Backend | NestJS (Node.js + TypeScript) |
| Base de Datos | PostgreSQL 16 + PostGIS |
| IA Local | Ollama (Llama 3 8B / Mistral 7B Q4) |
| Tiempo Real | WebSockets (Socket.io) |
| Autenticación | JWT + Refresh Tokens + bcrypt |
| Documentación API | Swagger (OpenAPI) |

## Arquitectura del Proyecto

```
SistemaTecniYa/
├── backend/
│   ├── src/
│   │   ├── common/              # Guards, decorators, servicios compartidos
│   │   ├── config/              # Configuraciones
│   │   ├── database/
│   │   │   ├── migrations/      # Migraciones TypeORM
│   │   │   ├── seeds/           # Datos de prueba
│   │   │   └── ormconfig.ts     # Configuración BD
│   │   ├── modules/
│   │   │   ├── admin/           # Panel administrativo y KPIs
│   │   │   ├── auth/            # Autenticación (JWT + bcrypt)
│   │   │   ├── clients/         # Gestión de clientes
│   │   │   ├── coverage-zones/  # Zonas de cobertura
│   │   │   ├── equipment/       # CRUD de equipos
│   │   │   ├── notifications/   # Notificaciones push/WhatsApp
│   │   │   ├── payments/        # Pagos y comprobantes
│   │   │   ├── ratings/         # Calificaciones post-servicio
│   │   │   ├── scheduling/      # Citas y agendamiento
│   │   │   ├── service-requests/ # Solicitudes y máquina de estados
│   │   │   ├── technicians/     # Gestión de técnicos
│   │   │   ├── tracking/        # WebSocket de seguimiento
│   │   │   ├── triage/          # Motor de IA (Ollama)
│   │   │   └── users/           # Usuarios base
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── .env
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/           # Layout admin
│   │   │   ├── client/          # Layout cliente
│   │   │   └── technician/      # Layout técnico
│   │   ├── context/             # AuthContext
│   │   ├── pages/
│   │   │   ├── admin/           # Dashboard, técnicos, zonas
│   │   │   ├── client/          # Dashboard, solicitudes, seguimiento
│   │   │   └── technician/      # Dashboard, asignaciones
│   │   ├── services/            # API client, WebSocket
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.ts
│   └── index.html
├── package.json (raíz)
└── README.md
```

## Base de Datos — Esquema

11 tablas con UUIDs, timestamps y llaves foráneas:

- `usuarios` — Autenticación base (rol: cliente/técnico/admin)
- `clientes` — Perfiles de cliente (1:1 con usuarios)
- `tecnicos` — Perfiles de técnico (1:1 con usuarios)
- `equipos` — Dispositivos registrados por cliente
- `solicitudes_servicio` — Solicitudes con máquina de estados (6 estados)
- `diagnosticos_ia` — Resultados del triage con IA
- `citas` — Agendamiento de visitas
- `pagos` — Registro de pagos (efectivo/Yape/Plin/transferencia)
- `calificaciones` — Puntaje 1-5 post-servicio
- `zonas_cobertura` — Distritos con tarifas y geolocalización
- `notificaciones` — Notificaciones in-app y WhatsApp

## Instalación Local

### Requisitos

- Node.js >= 18
- PostgreSQL >= 14
- Ollama (para IA local)

### 1. Clonar e instalar dependencias

```bash
git clone <repo-url>
cd SistemaTecniYa

# Instalar dependencias raíz
npm install

# Instalar dependencias backend
cd backend
npm install
cd ..

# Instalar dependencias frontend
cd frontend
npm install
cd ..
```

### 2. Configurar base de datos PostgreSQL

```sql
CREATE DATABASE tecniya;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
```

Opcional con Docker:
```bash
docker run -d --name tecniya-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=tecniya -p 5432:5432 postgis/postgis:16-3.4
```

### 3. Configurar variables de entorno

Editar `backend/.env`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=tecniya
JWT_SECRET=tecniya-jwt-secret-key-change-in-production-2024
JWT_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama3:8b
PORT=3000
ENCRYPTION_KEY=tecniya-encryption-key-32-chars-long!!
```

### 4. Instalar y configurar Ollama (IA Local)

```bash
# Descargar e instalar Ollama desde https://ollama.com
# Luego, descargar el modelo:
ollama pull llama3:8b

# Verificar que el servicio esté corriendo:
curl http://localhost:11434/api/generate -d '{
  "model": "llama3:8b",
  "prompt": "Hola",
  "stream": false
}'
```

### 5. Ejecutar migraciones y seed

```bash
cd backend

# Ejecutar migraciones
npm run migration:run

# (Alternativa: generar migraciones desde entidades)
# npm run migration:generate -- src/database/migrations/InitialSchema

# Sembrar datos de prueba
npm run seed
```

### 6. Iniciar el servidor

```bash
# Desde la raíz (backend y frontend simultáneamente)
npm run dev

# O por separado:
# Terminal 1 - Backend:
cd backend && npm run start:dev

# Terminal 2 - Frontend:
cd frontend && npm run dev
```

### 7. Acceder a la aplicación

- **Frontend:** http://localhost:5173
- **API:** http://localhost:3000/api
- **Swagger Docs:** http://localhost:3000/api/docs

### Credenciales de prueba

| Rol | Email | Contraseña |
|-----|-------|-----------|
| Admin | admin@tecniya.pe | 123456 |
| Cliente | cliente1@mail.com | 123456 |
| Cliente | cliente2@mail.com | 123456 |
| Técnico | tecnico1@mail.com | 123456 |
| Técnico | tecnico2@mail.com | 123456 |

## API Endpoints Principales

### Autenticación
- `POST /api/auth/register` — Registrar usuario
- `POST /api/auth/login` — Iniciar sesión
- `POST /api/auth/refresh` — Refrescar token
- `GET /api/auth/perfil` — Perfil del usuario

### Triage IA
- `POST /api/triage/analizar` — Analizar falla con IA (envía descripción, recibe JSON estructurado)

### Solicitudes
- `GET /api/solicitudes` — Listar (con filtros)
- `POST /api/solicitudes` — Crear (dispara triage automático)
- `PUT /api/solicitudes/:id/estado` — Cambiar estado
- `PUT /api/solicitudes/:id/asignar` — Asignar técnico

### Administración
- `GET /api/admin/dashboard` — KPIs del sistema
- `GET /api/admin/tecnicos` — Gestión de técnicos
- `GET /api/admin/zonas-cobertura` — Zonas y tarifas

### WebSockets
- `ws://localhost:3000/tracking` — Seguimiento en tiempo real

## Flujo de Triage con IA

1. Cliente describe el problema → `POST /api/solicitudes`
2. Backend envía descripción a Ollama (`http://localhost:11434/api/generate`)
3. Ollama responde con JSON estructurado:
   ```json
   {
     "tipo_falla": "Batería no carga",
     "urgencia": "media",
     "tiempo_estimado_min": 45,
     "costo_estimado": 65.00,
     "confianza": 0.85,
     "recomendaciones": "Intentar con otro cargador antes de la visita"
   }
   ```
4. Diagnóstico se guarda en `diagnosticos_ia` y la solicitud pasa a `cotizado`
5. Admin asigna técnico según zona de cobertura

## Licencia

MIT - Proyecto desarrollado para uso comercial en Huancayo, Perú.
