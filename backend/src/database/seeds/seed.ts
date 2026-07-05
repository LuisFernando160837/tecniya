import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Usuario, UserRole } from '../../modules/users/usuario.entity';
import { Cliente } from '../../modules/clients/cliente.entity';
import { Tecnico, TecnicoEstado } from '../../modules/technicians/tecnico.entity';
import { ZonaCobertura } from '../../modules/coverage-zones/zona-cobertura.entity';
import { dataSourceOptions } from '../ormconfig';

async function seed() {
  const ds = new DataSource(dataSourceOptions);
  await ds.initialize();
  console.log('Conectado a BD. Sembrando datos...');

  const queryRunner = ds.createQueryRunner();
  await queryRunner.startTransaction();

  try {
    const password_hash = await bcrypt.hash('123456', 12);

    // Admin
    const admin = queryRunner.manager.create(Usuario, {
      email: 'admin@tecniya.pe',
      password_hash,
      nombre_completo: 'Admin TecniYA',
      telefono: '999000000',
      rol: UserRole.ADMIN,
    });
    await queryRunner.manager.save(admin);

    // Clientes
    const clientesData = [
      { email: 'cliente1@mail.com', nombre: 'Carlos López', telefono: '999111111', direccion: 'Av. Real 123', distrito: 'Huancayo' },
      { email: 'cliente2@mail.com', nombre: 'María García', telefono: '999222222', direccion: 'Jr. Puno 456', distrito: 'El Tambo' },
      { email: 'cliente3@mail.com', nombre: 'José Pérez', telefono: '999333333', direccion: 'Av. Ferrocarril 789', distrito: 'Chilca' },
    ];

    for (const c of clientesData) {
      const usuario = queryRunner.manager.create(Usuario, {
        email: c.email,
        password_hash,
        nombre_completo: c.nombre,
        telefono: c.telefono,
        rol: UserRole.CLIENTE,
      });
      await queryRunner.manager.save(usuario);

      const cliente = queryRunner.manager.create(Cliente, {
        usuario_id: usuario.id,
        direccion: c.direccion,
        distrito: c.distrito,
      });
      await queryRunner.manager.save(cliente);
    }

    // Técnicos
    const tecnicosData = [
      { email: 'tecnico1@mail.com', nombre: 'Luis Torres', telefono: '999444444', especialidad: 'Laptops y PCs', zona: 'Huancayo', doc: '12345678' },
      { email: 'tecnico2@mail.com', nombre: 'Ana Huamán', telefono: '999555555', especialidad: 'Celulares y Tablets', zona: 'El Tambo', doc: '87654321' },
      { email: 'tecnico3@mail.com', nombre: 'Miguel Rojas', telefono: '999666666', especialidad: 'Electrónica General', zona: 'Chilca', doc: '11223344' },
    ];

    for (const t of tecnicosData) {
      const usuario = queryRunner.manager.create(Usuario, {
        email: t.email,
        password_hash,
        nombre_completo: t.nombre,
        telefono: t.telefono,
        rol: UserRole.TECNICO,
      });
      await queryRunner.manager.save(usuario);

      const tecnico = queryRunner.manager.create(Tecnico, {
        usuario_id: usuario.id,
        especialidad: t.especialidad,
        zona_cobertura: t.zona,
        estado: TecnicoEstado.DISPONIBLE,
        documento_identidad: t.doc,
        calificacion_promedio: 5.0,
      });
      await queryRunner.manager.save(tecnico);
    }

    // Zonas de cobertura
    const zonasData = [
      { nombre: 'Huancayo Centro', distrito: 'Huancayo', provincia: 'Huancayo', lat: -12.0654, lng: -75.2049, radio: 5, tarifa: 30, desplazamiento: 10 },
      { nombre: 'El Tambo', distrito: 'El Tambo', provincia: 'Huancayo', lat: -12.0710, lng: -75.2120, radio: 4, tarifa: 25, desplazamiento: 8 },
      { nombre: 'Chilca', distrito: 'Chilca', provincia: 'Huancayo', lat: -12.0780, lng: -75.1900, radio: 3, tarifa: 25, desplazamiento: 8 },
    ];

    for (const z of zonasData) {
      const zona = queryRunner.manager.create(ZonaCobertura, {
        nombre: z.nombre,
        distrito: z.distrito,
        provincia: z.provincia,
        departamento: 'Junín',
        latitud_centro: z.lat,
        longitud_centro: z.lng,
        radio_km: z.radio,
        tarifa_base: z.tarifa,
        costo_desplazamiento: z.desplazamiento,
        activo: true,
      });
      await queryRunner.manager.save(zona);
    }

    await queryRunner.commitTransaction();
    console.log('✅ Datos iniciales insertados correctamente');
    console.log('   Admin:  admin@tecniya.pe / 123456');
    console.log('   Técnicos: tecnico1@mail.com, tecnico2@mail.com, tecnico3@mail.com / 123456');
    console.log('   Clientes: cliente1@mail.com, cliente2@mail.com, cliente3@mail.com / 123456');
  } catch (error) {
    await queryRunner.rollbackTransaction();
    console.error('Error en seed:', error);
  } finally {
    await queryRunner.release();
    await ds.destroy();
  }
}

seed();
