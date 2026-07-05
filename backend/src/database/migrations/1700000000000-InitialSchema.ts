import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1700000000000 implements MigrationInterface {
  name = 'InitialSchema1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);

    await queryRunner.query(`
      CREATE TYPE "public"."usuarios_rol_enum" AS ENUM('cliente', 'tecnico', 'admin')
    `);
    await queryRunner.query(`
      CREATE TYPE "public"."tecnicos_estado_enum" AS ENUM('disponible', 'ocupado', 'desconectado')
    `);
    await queryRunner.query(`
      CREATE TYPE "public"."solicitudes_servicio_estado_enum" AS ENUM('pendiente', 'cotizado', 'agendado', 'en_proceso', 'finalizado', 'cancelado')
    `);
    await queryRunner.query(`
      CREATE TYPE "public"."diagnosticos_ia_urgencia_enum" AS ENUM('baja', 'media', 'alta')
    `);
    await queryRunner.query(`
      CREATE TYPE "public"."pagos_estado_enum" AS ENUM('pendiente', 'completado', 'rechazado', 'reembolsado')
    `);
    await queryRunner.query(`
      CREATE TYPE "public"."pagos_metodo_enum" AS ENUM('efectivo', 'yape', 'plin', 'transferencia')
    `);
    await queryRunner.query(`
      CREATE TYPE "public"."citas_estado_enum" AS ENUM('pendiente', 'confirmada', 'en_camino', 'en_progreso', 'completada', 'cancelada')
    `);
    await queryRunner.query(`
      CREATE TYPE "public"."notificaciones_canal_enum" AS ENUM('app', 'whatsapp', 'email')
    `);

    await queryRunner.query(`
      CREATE TABLE "usuarios" (
        "id" uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
        "email" varchar(100) NOT NULL UNIQUE,
        "password_hash" varchar(255) NOT NULL,
        "nombre_completo" varchar(100) NOT NULL,
        "telefono" varchar(20),
        "rol" "public"."usuarios_rol_enum" NOT NULL DEFAULT 'cliente',
        "activo" boolean NOT NULL DEFAULT true,
        "refresh_token_hash" varchar(255),
        "ultimo_acceso" TIMESTAMP,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now()
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "clientes" (
        "id" uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
        "usuario_id" uuid NOT NULL UNIQUE,
        "direccion" varchar(255) NOT NULL,
        "distrito" varchar(100),
        "latitud" decimal(10,7),
        "longitud" decimal(10,7),
        "referencia_direccion" varchar(50),
        "puntos_fidelidad" integer NOT NULL DEFAULT 0,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "FK_cliente_usuario" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "tecnicos" (
        "id" uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
        "usuario_id" uuid NOT NULL UNIQUE,
        "especialidad" varchar(50) NOT NULL,
        "zona_cobertura" varchar(100) NOT NULL,
        "estado" "public"."tecnicos_estado_enum" NOT NULL DEFAULT 'desconectado',
        "calificacion_promedio" decimal(4,2) NOT NULL DEFAULT 5.0,
        "total_servicios" integer NOT NULL DEFAULT 0,
        "ubicacion_lat" decimal(10,7),
        "ubicacion_lng" decimal(10,7),
        "ultima_ubicacion_actualizada" TIMESTAMP,
        "documento_identidad" varchar(20),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "FK_tecnico_usuario" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "equipos" (
        "id" uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
        "cliente_id" uuid NOT NULL,
        "tipo" varchar(100) NOT NULL,
        "marca" varchar(100) NOT NULL,
        "modelo" varchar(200) NOT NULL,
        "numero_serie" varchar(100),
        "especificaciones" text,
        "foto_url" varchar(255),
        "foto_encrypted" varchar(255),
        "observaciones" text,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "FK_equipo_cliente" FOREIGN KEY ("cliente_id") REFERENCES "clientes"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "solicitudes_servicio" (
        "id" uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
        "cliente_id" uuid NOT NULL,
        "tecnico_id" uuid,
        "descripcion_problema" text NOT NULL,
        "foto_problema_url" varchar(255),
        "estado" "public"."solicitudes_servicio_estado_enum" NOT NULL DEFAULT 'pendiente',
        "tipo_falla" varchar(100),
        "urgencia" varchar(10),
        "tiempo_estimado_min" integer,
        "costo_estimado" decimal(10,2),
        "costo_final" decimal(10,2),
        "confianza_diagnostico" decimal(4,2),
        "fecha_agendada" TIMESTAMP,
        "fecha_inicio" TIMESTAMP,
        "fecha_fin" TIMESTAMP,
        "motivo_cancelacion" varchar(255),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "FK_solicitud_cliente" FOREIGN KEY ("cliente_id") REFERENCES "clientes"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_solicitud_tecnico" FOREIGN KEY ("tecnico_id") REFERENCES "tecnicos"("id") ON DELETE SET NULL
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "diagnosticos_ia" (
        "id" uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
        "solicitud_id" uuid NOT NULL UNIQUE,
        "tipo_falla" varchar(100) NOT NULL,
        "urgencia" "public"."diagnosticos_ia_urgencia_enum" NOT NULL,
        "tiempo_estimado_min" integer NOT NULL,
        "costo_estimado" decimal(10,2) NOT NULL,
        "confianza" decimal(4,2) NOT NULL,
        "recomendaciones" text,
        "raw_response" jsonb,
        "modelo_ia" varchar(100) NOT NULL,
        "latencia_ms" integer,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "FK_diagnostico_solicitud" FOREIGN KEY ("solicitud_id") REFERENCES "solicitudes_servicio"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "citas" (
        "id" uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
        "solicitud_id" uuid NOT NULL,
        "fecha_hora" TIMESTAMP NOT NULL,
        "duracion_estimada_min" integer NOT NULL,
        "estado" "public"."citas_estado_enum" NOT NULL DEFAULT 'pendiente',
        "direccion_visita" varchar(255),
        "ubicacion_lat" decimal(10,7),
        "ubicacion_lng" decimal(10,7),
        "notas" text,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "FK_cita_solicitud" FOREIGN KEY ("solicitud_id") REFERENCES "solicitudes_servicio"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "pagos" (
        "id" uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
        "solicitud_id" uuid NOT NULL UNIQUE,
        "monto" decimal(10,2) NOT NULL,
        "estado" "public"."pagos_estado_enum" NOT NULL DEFAULT 'pendiente',
        "metodo" "public"."pagos_metodo_enum" NOT NULL,
        "referencia_pago" varchar(255),
        "comprobante_url" varchar(255),
        "fecha_pago" TIMESTAMP,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "FK_pago_solicitud" FOREIGN KEY ("solicitud_id") REFERENCES "solicitudes_servicio"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "calificaciones" (
        "id" uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
        "cliente_id" uuid NOT NULL,
        "solicitud_id" uuid NOT NULL UNIQUE,
        "tecnico_id" uuid NOT NULL,
        "puntaje" integer NOT NULL CHECK (puntaje >= 1 AND puntaje <= 5),
        "comentario" text,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "FK_calificacion_cliente" FOREIGN KEY ("cliente_id") REFERENCES "clientes"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_calificacion_solicitud" FOREIGN KEY ("solicitud_id") REFERENCES "solicitudes_servicio"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_calificacion_tecnico" FOREIGN KEY ("tecnico_id") REFERENCES "tecnicos"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "zonas_cobertura" (
        "id" uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
        "nombre" varchar(100) NOT NULL,
        "distrito" varchar(100) NOT NULL,
        "provincia" varchar(100),
        "departamento" varchar(100),
        "latitud_centro" decimal(10,7),
        "longitud_centro" decimal(10,7),
        "radio_km" integer,
        "poligono_geo" jsonb,
        "activo" boolean NOT NULL DEFAULT true,
        "tarifa_base" decimal(10,2),
        "costo_desplazamiento" decimal(10,2),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now()
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "notificaciones" (
        "id" uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
        "usuario_id" uuid NOT NULL,
        "titulo" varchar(200) NOT NULL,
        "mensaje" text NOT NULL,
        "leida" boolean NOT NULL DEFAULT false,
        "fecha_lectura" TIMESTAMP,
        "canal" "public"."notificaciones_canal_enum" NOT NULL DEFAULT 'app',
        "referencia_tipo" varchar(50),
        "referencia_id" varchar(50),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "FK_notificacion_usuario" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_usuarios_email" ON "usuarios"("email")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_solicitudes_estado" ON "solicitudes_servicio"("estado")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_solicitudes_cliente" ON "solicitudes_servicio"("cliente_id")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_notificaciones_usuario" ON "notificaciones"("usuario_id")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_equipos_cliente" ON "equipos"("cliente_id")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "notificaciones" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "calificaciones" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "pagos" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "citas" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "diagnosticos_ia" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "solicitudes_servicio" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "equipos" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "tecnicos" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "clientes" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "zonas_cobertura" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "usuarios" CASCADE`);

    await queryRunner.query(`DROP TYPE IF EXISTS "public"."notificaciones_canal_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."citas_estado_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."pagos_metodo_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."pagos_estado_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."diagnosticos_ia_urgencia_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."solicitudes_servicio_estado_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."tecnicos_estado_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."usuarios_rol_enum"`);
  }
}
