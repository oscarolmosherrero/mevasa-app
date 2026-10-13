import { MUNICIPIOS, OPERATORS, TARIFAS } from '../data/lines.js'

export default function Info() {
  return (
    <div className="mx-auto max-w-4xl px-5 pt-8">
      <h1 className="text-3xl font-light">Tarifas e información</h1>

      <section className="mt-10">
        <h2 className="mb-4 text-xl font-light">Tarifas</h2>
        <dl className="divide-y divide-white/15 border-y border-white/15">
          {TARIFAS.map(([t, p]) => (
            <div key={t} className="flex flex-wrap justify-between gap-2 py-3">
              <dt>{t}</dt><dd className="text-brand">{p}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-xl font-light">Tarjeta de transporte</h2>
        <ul className="max-w-prose space-y-3 text-white/80">
          <li><strong className="font-medium text-white">Perfil ordinario:</strong> para cualquier persona, sin restricciones.</li>
          <li><strong className="font-medium text-white">Perfil especial:</strong> menores de 26 años (caduca al cumplirlos), mayores de 65 y personas con discapacidad igual o superior al 33 %.</li>
          <li>Las tarjetas caducan a los 3 años. Renuévala en la oficina el mes anterior al vencimiento.</li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-xl font-light">Comprar y recargar</h2>
        <ul className="max-w-prose space-y-3 text-white/80">
          <li>Compra de tarjetas, solo en persona: Oficina de Transporte Metropolitano, Estación de Autobuses de Valladolid (calle Puente Colgante, 2). Lunes a viernes, de 10:00 a 14:00.</li>
          <li>El billete ordinario se paga en efectivo al subir.</li>
          <li>Los bonos por viaje se recargan en el autobús de 5 en 5 €. Los bonos mensuales se pagan completos al comprarlos.</li>
          <li>Contacto: <a className="text-brand underline" href="mailto:metropolitanovalladolid1@gmail.com">metropolitanovalladolid1@gmail.com</a></li>
        </ul>
      </section>

      <section className="mt-10 grid gap-10 sm:grid-cols-2">
        <div>
          <h2 className="mb-4 text-xl font-light">Operadores</h2>
          <ul className="space-y-1">
            {OPERATORS.map(([n, u]) => (
              <li key={n}><a className="hover:text-brand hover:underline" href={u} target="_blank" rel="noreferrer">{n}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="mb-4 text-xl font-light">Municipios</h2>
          <ul className="columns-2 gap-6 text-white/80">
            {MUNICIPIOS.map((m) => <li key={m}>{m}</li>)}
          </ul>
        </div>
      </section>
    </div>
  )
}
