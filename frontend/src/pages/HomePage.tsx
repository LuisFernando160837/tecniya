import { useState } from 'react'
import { Zap, Wrench, Clock, Users, Star, Shield, ArrowRight, CheckCircle, Laptop, Smartphone, Monitor, Tv, Printer, Headphones, MapPin, Phone, Mail, Menu, X, ChevronDown, SendHorizonal } from 'lucide-react'

const services = [
  { icon: Laptop, title: 'Laptops & PCs', desc: 'Reparación de hardware, software, limpieza y mantenimiento' },
  { icon: Smartphone, title: 'Smartphones & Tablets', desc: 'Cambio de pantalla, batería, carga y más' },
  { icon: Monitor, title: 'Monitores & Pantallas', desc: 'Reparación de displays, fuentes de poder' },
  { icon: Tv, title: 'TV & Audio', desc: 'Smart TV, equipos de sonido, amplificadores' },
  { icon: Printer, title: 'Impresoras', desc: 'Mantenimiento, cambio de tóner, conexión en red' },
  { icon: Headphones, title: 'Periféricos & Consolas', desc: 'Teclados, mouse, audífonos, PlayStation, Xbox' },
]

const steps = [
  { icon: Wrench, title: 'Describe el problema', desc: 'Cuéntanos qué le pasa a tu equipo a través de nuestro formulario' },
  { icon: Zap, title: 'Te cotizamos al instante', desc: 'Recibirás el costo y tiempo estimado por WhatsApp' },
  { icon: Clock, title: 'Agendamos la visita', desc: 'Coordinamos el día y hora que mejor te quede' },
  { icon: Shield, title: 'Reparación garantizada', desc: 'Técnico especializado va a tu domicilio en Huancayo' },
]

const equipmentTypes = [
  'Laptop', 'PC de escritorio', 'Smartphone', 'Tablet',
  'Monitor / Pantalla', 'Smart TV', 'Impresora',
  'Consola (PS/Xbox)', 'Equipo de audio', 'Otro',
]

const WHATSAPP_NUMBER = '51907710001'

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [form, setForm] = useState({
    nombre: '', telefono: '', direccion: '', distrito: '',
    tipo_equipo: '', marca: '', modelo: '', descripcion: '',
  })
  const [enviado, setEnviado] = useState(false)

  const API_URL = 'https://tecniya.onrender.com/api'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const msg = encodeURIComponent(
      `Hola TecniYA, necesito soporte técnico.\n\n` +
      `*Nombre:* ${form.nombre}\n` +
      `*Teléfono:* ${form.telefono}\n` +
      `*Dirección:* ${form.direccion}\n` +
      `*Distrito:* ${form.distrito}\n` +
      `*Equipo:* ${form.tipo_equipo} - ${form.marca} ${form.modelo}\n` +
      `*Problema:* ${form.descripcion}`
    )
    try {
      await fetch(`${API_URL}/public/solicitudes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: form.nombre,
          telefono: form.telefono,
          direccion: form.direccion,
          distrito: form.distrito,
          tipo_equipo: form.tipo_equipo,
          marca: form.marca,
          modelo: form.modelo,
          descripcion_problema: form.descripcion,
        }),
      })
    } catch (err) {
      console.error('Error al guardar en BD:', err)
    }
    setEnviado(true)
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-white">
      {/* NAV */}
      <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-2">
            <Zap className="text-primary" size={28} />
            <span className="text-xl font-bold text-gray-900">Tecni<span className="text-primary">YA</span></span>
          </button>
          <div className="hidden items-center gap-8 md:flex">
            <a href="#servicios" className="text-sm font-medium text-gray-600 transition hover:text-primary">Servicios</a>
            <a href="#como-funciona" className="text-sm font-medium text-gray-600 transition hover:text-primary">Cómo funciona</a>
            <a href="#cobertura" className="text-sm font-medium text-gray-600 transition hover:text-primary">Cobertura</a>
            <a href="#contacto" className="text-sm font-medium text-gray-600 transition hover:text-primary">Contacto</a>
            <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:bg-primary-dark active:scale-95">
              <Phone size={16} /> 907 710 001
            </a>
          </div>
          <button onClick={() => setMenuOpen(!menuOpen)} className="rounded-lg p-2 transition hover:bg-gray-100 md:hidden">
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        {menuOpen && (
          <div className="border-t border-gray-100 bg-white px-4 pb-5 pt-2 md:hidden">
            <div className="flex flex-col gap-3">
              <a href="#servicios" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50">Servicios</a>
              <a href="#como-funciona" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50">Cómo funciona</a>
              <a href="#cobertura" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50">Cobertura</a>
              <a href="#contacto" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50">Contacto</a>
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white">
                <Phone size={16} /> 907 710 001
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-primary to-primary-dark">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.1)_0%,transparent_60%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24 lg:py-32">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="text-center lg:text-left">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-medium text-white/90 backdrop-blur sm:text-sm">
                <Shield size={14} /> Soporte técnico a domicilio en Huancayo
              </div>
              <h1 className="text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl xl:text-6xl">
                Reparamos tu equipo <br />
                <span className="text-yellow-300">sin salir de casa</span>
              </h1>
              <p className="mt-4 text-base leading-relaxed text-white/80 sm:text-lg lg:text-xl">
                Diagnóstico gratis, técnicos especializados y servicio a domicilio. 
                Describe tu problema y te respondemos al instante por WhatsApp.
              </p>
              <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
                <a href="#contacto"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-8 py-3.5 text-base font-bold text-primary shadow-lg transition hover:bg-gray-100 active:scale-95 sm:w-auto sm:text-lg">
                  Solicitar diagnóstico gratis <ArrowRight size={20} />
                </a>
                <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-white/30 px-8 py-3.5 text-base font-semibold text-white transition hover:bg-white/10 active:scale-95 sm:w-auto sm:text-lg">
                  <Phone size={18} /> 907 710 001
                </a>
              </div>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-white/70 lg:justify-start sm:text-sm">
                <span className="flex items-center gap-1.5"><CheckCircle size={14} /> Diagnóstico gratis</span>
                <span className="flex items-center gap-1.5"><CheckCircle size={14} /> Técnicos certificados</span>
                <span className="flex items-center gap-1.5"><CheckCircle size={14} /> Servicio a domicilio</span>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="rounded-2xl bg-white/10 p-1 backdrop-blur-sm">
                <div className="rounded-xl bg-white p-6 text-gray-800 shadow-2xl">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <Zap className="text-primary" size={16} />
                    <span>Ejemplo de diagnóstico instantáneo</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 rounded-xl bg-blue-50 p-4">
                      <Laptop size={24} className="text-primary shrink-0" />
                      <div className="text-sm">
                        <p className="font-semibold">Laptop HP Pavilion</p>
                        <p className="text-gray-500">No enciende, pantalla negra</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between rounded-xl bg-green-50 p-4 text-sm">
                      <span className="font-semibold text-green-700">Diagnóstico completado</span>
                      <span className="text-lg font-bold text-green-700">S/ 65.00</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span className="flex items-center gap-1"><Clock size={14} /> Tiempo: 45 min</span>
                      <span className="flex items-center gap-1"><Shield size={14} /> Confianza: 92%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <div className="border-b border-gray-100 bg-gray-50 py-4">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-gray-500 sm:text-sm">
            <span className="flex items-center gap-2"><Star size={16} className="fill-yellow-500 text-yellow-500" /> 4.8 calificación promedio</span>
            <span className="flex items-center gap-2"><Users size={16} className="text-primary" /> +500 servicios realizados</span>
            <span className="flex items-center gap-2"><Clock size={16} className="text-primary" /> Respuesta en minutos</span>
            <span className="flex items-center gap-2"><Shield size={16} className="text-primary" /> Servicio garantizado</span>
          </div>
        </div>
      </div>

      {/* SERVICES */}
      <section id="servicios" className="scroll-mt-16 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-10 text-center md:mb-14">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">¿Qué reparamos?</h2>
            <p className="mt-3 text-sm text-gray-500 sm:text-base md:text-lg">Todo tipo de equipos electrónicos, con diagnóstico preciso y servicio a domicilio</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <div key={s.title} className="group rounded-2xl border border-gray-100 bg-white p-5 transition hover:border-primary/20 hover:shadow-lg md:p-6">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-primary transition group-hover:bg-primary group-hover:text-white md:h-14 md:w-14">
                  <s.icon size={24} />
                </div>
                <h3 className="mb-1.5 text-base font-bold text-gray-900 md:text-lg">{s.title}</h3>
                <p className="text-sm leading-relaxed text-gray-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="como-funciona" className="scroll-mt-16 bg-gray-50 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-10 text-center md:mb-14">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">¿Cómo funciona?</h2>
            <p className="mt-3 text-sm text-gray-500 sm:text-base md:text-lg">En 4 pasos simples resolvemos el problema de tu equipo</p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <div key={i} className="relative text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/20 md:h-20 md:w-20">
                  <s.icon size={28} />
                </div>
                <div className="absolute -top-2 right-1/4 flex h-7 w-7 items-center justify-center rounded-full bg-yellow-400 text-xs font-bold text-white md:right-8">
                  {i + 1}
                </div>
                <h3 className="mb-2 text-base font-bold text-gray-900 md:text-lg">{s.title}</h3>
                <p className="text-sm text-gray-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COVERAGE */}
      <section id="cobertura" className="scroll-mt-16 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">Cobertura en Huancayo</h2>
              <p className="mt-3 text-sm text-gray-500 sm:text-base">Llegamos a los principales distritos de la provincia de Huancayo</p>
              <div className="mt-6 space-y-3 md:mt-8">
                {[
                  { name: 'Huancayo', status: 'Disponible' },
                  { name: 'El Tambo', status: 'Disponible' },
                  { name: 'Chilca', status: 'Disponible' },
                  { name: 'San Agustín de Cajas', status: 'Disponible' },
                  { name: 'Otro distrito', status: 'Consultar' },
                ].map((d) => (
                  <div key={d.name} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4">
                    <MapPin className="shrink-0 text-primary" size={20} />
                    <span className="font-medium text-gray-800">{d.name}</span>
                    <span className={`ml-auto text-xs font-medium ${d.status === 'Disponible' ? 'text-green-600' : 'text-yellow-600'}`}>
                      {d.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl bg-gray-50 p-6 text-center md:p-10">
              <MapPin size={48} className="mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-bold text-gray-900">¿No encuentras tu zona?</h3>
              <p className="mt-2 text-sm text-gray-500">Escríbenos y coordinamos una visita, llegamos a toda la provincia de Huancayo</p>
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-white transition hover:bg-primary-dark">
                <Phone size={18} /> Consultar disponibilidad
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT FORM */}
      <section id="contacto" className="scroll-mt-16 bg-gray-50 py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-4 md:px-6">
          <div className="mb-8 text-center md:mb-10">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">Solicita tu diagnóstico gratis</h2>
            <p className="mt-3 text-sm text-gray-500 sm:text-base">Completa el formulario y te responderemos al instante por WhatsApp</p>
          </div>

          {enviado ? (
            <div className="rounded-2xl border border-green-100 bg-green-50 p-8 text-center">
              <CheckCircle size={48} className="mx-auto mb-4 text-green-500" />
              <h3 className="text-xl font-bold text-green-700">¡Solicitud enviada!</h3>
              <p className="mt-2 text-sm text-green-600">
                Tu mensaje se abrió en WhatsApp. Envíalo para que te respondamos a la brevedad.
              </p>
              <button onClick={() => { setEnviado(false); setForm({ nombre: '', telefono: '', direccion: '', distrito: '', tipo_equipo: '', marca: '', modelo: '', descripcion: '' }) }}
                className="mt-6 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700 active:scale-95">
                Enviar otra solicitud
              </button>
            </div>
          ) : (
            <div className="rounded-2xl bg-white p-5 shadow-xl md:p-8">
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-gray-700">Nombre completo *</label>
                    <input type="text" required placeholder="Ej: Juan Pérez"
                      value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-gray-700">Teléfono *</label>
                    <input type="tel" required placeholder="Ej: 907 710 001"
                      value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-gray-700">Dirección *</label>
                  <input type="text" required placeholder="Ej: Av. Mariscal Castilla 1234"
                    value={form.direccion} onChange={(e) => setForm({ ...form, direccion: e.target.value })}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-gray-700">Distrito *</label>
                    <select required value={form.distrito} onChange={(e) => setForm({ ...form, distrito: e.target.value })}
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
                      <option value="">Selecciona tu distrito</option>
                      <option value="Huancayo">Huancayo</option>
                      <option value="El Tambo">El Tambo</option>
                      <option value="Chilca">Chilca</option>
                      <option value="San Agustín de Cajas">San Agustín de Cajas</option>
                      <option value="Otro">Otro</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-gray-700">Tipo de equipo *</label>
                    <select required value={form.tipo_equipo} onChange={(e) => setForm({ ...form, tipo_equipo: e.target.value })}
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
                      <option value="">Selecciona tu equipo</option>
                      {equipmentTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-gray-700">Marca</label>
                    <input type="text" placeholder="Ej: HP, Samsung, LG"
                      value={form.marca} onChange={(e) => setForm({ ...form, marca: e.target.value })}
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-gray-700">Modelo <span className="text-gray-400 font-normal">(opcional)</span></label>
                    <input type="text" placeholder="No lo sé"
                      value={form.modelo} onChange={(e) => setForm({ ...form, modelo: e.target.value })}
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-gray-700">Describe el problema *</label>
                  <textarea required placeholder="Ej: Mi laptop no enciende, la pantalla está en negro y solo se escucha el ventilador"
                    value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                    className="h-32 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>

                <button type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-base font-bold text-white shadow-lg transition hover:bg-primary-dark active:scale-95 md:py-4 md:text-lg">
                  <SendHorizonal size={20} />
                  Enviar por WhatsApp — Te respondemos al instante
                </button>

                <p className="text-center text-xs text-gray-400">
                  Al enviar, se abrirá WhatsApp con tu mensaje pre-llenado. Solo presiona enviar.
                </p>
              </form>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-primary to-primary-dark py-12 text-white md:py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-2xl font-bold md:text-4xl">¿Listo para reparar tu equipo?</h2>
          <p className="mt-3 text-sm text-white/80 md:text-lg">Más de 500 servicios realizados en Huancayo. Diagnóstico gratis al instante.</p>
          <a href="#contacto"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-base font-bold text-primary shadow-lg transition hover:bg-gray-100 active:scale-95 md:mt-8 md:px-10 md:py-4 md:text-lg">
            Solicitar diagnóstico gratis <ArrowRight size={20} />
          </a>
        </div>
      </section>

      {/* FLOATING WHATSAPP BUTTON */}
      <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-xl transition hover:bg-green-600 hover:scale-110 active:scale-95 md:bottom-8 md:right-8 md:h-16 md:w-16">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"/><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1"/></svg>
      </a>

      {/* FOOTER */}
      <footer className="bg-gray-900 py-10 text-gray-400 md:py-12">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <div className="flex items-center gap-2 text-white">
                <Zap className="text-primary" size={24} />
                <span className="text-lg font-bold">Tecni<span className="text-primary">YA</span></span>
              </div>
              <p className="mt-3 text-sm leading-relaxed">
                Soporte técnico a domicilio con diagnóstico gratis. Servicio rápido y garantizado en Huancayo, Perú.
              </p>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold text-white">Contacto</h4>
              <div className="space-y-3 text-sm">
                <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-400 transition hover:text-white">
                  <Phone size={14} /> 907 710 001
                </a>
                <p className="flex items-center gap-2"><Mail size={14} /> contacto@tecniya.pe</p>
                <p className="flex items-center gap-2"><MapPin size={14} /> Huancayo, Junín - Perú</p>
              </div>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold text-white">Horario</h4>
              <div className="space-y-2 text-sm">
                <p>Lun - Sáb: 8:00 am - 8:00 pm</p>
                <p>Domingos: Previo acuerdo</p>
                <p className="mt-3 text-xs text-gray-500">Respondemos en menos de 5 minutos por WhatsApp</p>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-800 pt-8 text-center text-xs">
            <p>TecniYA © {new Date().getFullYear()} — Huancayo, Perú. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
