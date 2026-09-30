import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  AlertTriangle,
  ArrowLeft,
  Award,
  CalendarDays,
  Clock3,
  Eye,
  GraduationCap,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Sparkles,
  Trash2,
  Users,
  X,
} from 'lucide-react'

import api from '../services/api'

const formularioVacio = {
  nombre: '',
  categoriaId: '',
  modalidadId: '',
  docenteId: '',
  cupoMaximo: '',
  fechaInicio: '',
  fechaFin: '',
  horario: '',
  costo: '',
  activo: true,
  descripcion: '',
}

function Diplomados() {
  const navigate = useNavigate()

  const [diplomados, setDiplomados] = useState([])
  const [categorias, setCategorias] = useState([])
  const [modalidades, setModalidades] = useState([])
  const [docentes, setDocentes] = useState([])

  const [busqueda, setBusqueda] = useState('')
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  const [modalFormulario, setModalFormulario] = useState(false)
  const [diplomadoEditando, setDiplomadoEditando] = useState(null)
  const [diplomadoDetalle, setDiplomadoDetalle] = useState(null)
  const [diplomadoEliminando, setDiplomadoEliminando] = useState(null)
  const [menuAbierto, setMenuAbierto] = useState(null)

  const [formulario, setFormulario] = useState(formularioVacio)
  const [guardando, setGuardando] = useState(false)
  const [eliminando, setEliminando] = useState(false)
  const [errorFormulario, setErrorFormulario] = useState('')

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setCargando(true)
        setError('')

        const [
          respuestaDiplomados,
          respuestaCategorias,
          respuestaModalidades,
          respuestaDocentes,
        ] = await Promise.all([
          api.get('/diplomados'),
          api.get('/categorias'),
          api.get('/modalidades'),
          api.get('/docentes'),
        ])

        setDiplomados(respuestaDiplomados.data)
        setCategorias(respuestaCategorias.data)
        setModalidades(respuestaModalidades.data)
        setDocentes(respuestaDocentes.data)
      } catch (err) {
        console.error('Error al cargar diplomados:', err)
        setError('No fue posible cargar la información de diplomados.')
      } finally {
        setCargando(false)
      }
    }

    cargarDatos()
  }, [])

  const diplomadosFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase()

    if (!texto) return diplomados

    return diplomados.filter((diplomado) =>
      [
        diplomado.nombre,
        diplomado.categoria?.nombre,
        diplomado.modalidad?.nombre,
        diplomado.docente?.nombre,
        diplomado.horario,
        diplomado.descripcion,
      ].some((valor) =>
        String(valor ?? '').toLowerCase().includes(texto),
      ),
    )
  }, [diplomados, busqueda])

  const totalActivos = useMemo(
    () => diplomados.filter((diplomado) => diplomado.activo).length,
    [diplomados],
  )

  const totalInactivos = diplomados.length - totalActivos

  const actualizarCampo = (event) => {
    const { name, value, type, checked } = event.target

    setFormulario((anterior) => ({
      ...anterior,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const limpiarFormulario = () => {
    setFormulario(formularioVacio)
    setDiplomadoEditando(null)
    setErrorFormulario('')
  }

  const abrirNuevoDiplomado = () => {
    limpiarFormulario()
    setModalFormulario(true)
  }

  const cerrarFormulario = () => {
    if (guardando) return

    setModalFormulario(false)
    limpiarFormulario()
  }

  const abrirEditar = (diplomado) => {
    setMenuAbierto(null)
    setDiplomadoEditando(diplomado)

    setFormulario({
      nombre: diplomado.nombre ?? '',
      categoriaId: diplomado.categoria?.id
        ? String(diplomado.categoria.id)
        : '',
      modalidadId: diplomado.modalidad?.id
        ? String(diplomado.modalidad.id)
        : '',
      docenteId: diplomado.docente?.id
        ? String(diplomado.docente.id)
        : '',
      cupoMaximo:
        diplomado.cupoMaximo !== null &&
        diplomado.cupoMaximo !== undefined
          ? String(diplomado.cupoMaximo)
          : '',
      fechaInicio: diplomado.fechaInicio ?? '',
      fechaFin: diplomado.fechaFin ?? '',
      horario: diplomado.horario ?? '',
      costo:
        diplomado.costo !== null && diplomado.costo !== undefined
          ? String(diplomado.costo)
          : '',
      activo: Boolean(diplomado.activo),
      descripcion: diplomado.descripcion ?? '',
    })

    setErrorFormulario('')
    setModalFormulario(true)
  }

  const abrirDetalle = async (diplomado) => {
    setMenuAbierto(null)

    try {
      const response = await api.get(`/diplomados/${diplomado.id}`)
      setDiplomadoDetalle(response.data)
    } catch (err) {
      console.error('Error al obtener detalle del diplomado:', err)
      setError('No fue posible consultar el detalle del diplomado.')
    }
  }

  const construirPayload = () => {
    const categoria = categorias.find(
      (item) => String(item.id) === formulario.categoriaId,
    )

    const modalidad = modalidades.find(
      (item) => String(item.id) === formulario.modalidadId,
    )

    const docente = docentes.find(
      (item) => String(item.id) === formulario.docenteId,
    )

    return {
      nombre: formulario.nombre.trim(),
      categoria: categoria || null,
      modalidad: modalidad || null,
      docente: docente || null,
      cupoMaximo: Number(formulario.cupoMaximo),
      fechaInicio: formulario.fechaInicio || null,
      fechaFin: formulario.fechaFin || null,
      horario: formulario.horario.trim() || null,
      costo: Number(formulario.costo),
      activo: formulario.activo,
      descripcion: formulario.descripcion.trim() || null,
    }
  }

  const guardarDiplomado = async (event) => {
    event.preventDefault()

    const nombre = formulario.nombre.trim()
    const cupo = Number(formulario.cupoMaximo)
    const costo = Number(formulario.costo)

    if (!nombre) {
      setErrorFormulario('El nombre del diplomado es obligatorio.')
      return
    }

    if (
      formulario.cupoMaximo === '' ||
      !Number.isInteger(cupo) ||
      cupo < 1
    ) {
      setErrorFormulario(
        'El cupo máximo debe ser un número entero mayor o igual a 1.',
      )
      return
    }

    if (
      formulario.costo === '' ||
      Number.isNaN(costo) ||
      costo < 0
    ) {
      setErrorFormulario(
        'El costo debe ser un número mayor o igual a 0.',
      )
      return
    }

    if (
      formulario.fechaInicio &&
      formulario.fechaFin &&
      formulario.fechaFin < formulario.fechaInicio
    ) {
      setErrorFormulario(
        'La fecha de finalización no puede ser anterior a la fecha de inicio.',
      )
      return
    }

    try {
      setGuardando(true)
      setErrorFormulario('')

      const payload = construirPayload()

      if (diplomadoEditando) {
        const response = await api.put(
          `/diplomados/${diplomadoEditando.id}`,
          payload,
        )

        setDiplomados((anteriores) =>
          anteriores.map((diplomado) =>
            diplomado.id === diplomadoEditando.id
              ? response.data
              : diplomado,
          ),
        )
      } else {
        const response = await api.post('/diplomados', payload)

        setDiplomados((anteriores) => [
          ...anteriores,
          response.data,
        ])
      }

      setModalFormulario(false)
      limpiarFormulario()
    } catch (err) {
      console.error('Error al guardar diplomado:', err)

      const mensajeBackend =
        err.response?.data?.message ||
        err.response?.data?.mensaje ||
        err.response?.data?.error

      setErrorFormulario(
        mensajeBackend ||
          'No fue posible guardar el diplomado. Revisa la información ingresada.',
      )
    } finally {
      setGuardando(false)
    }
  }

  const eliminarDiplomado = async () => {
    if (!diplomadoEliminando) return

    try {
      setEliminando(true)

      await api.delete(`/diplomados/${diplomadoEliminando.id}`)

      setDiplomados((anteriores) =>
        anteriores.filter(
          (diplomado) => diplomado.id !== diplomadoEliminando.id,
        ),
      )

      setDiplomadoEliminando(null)
    } catch (err) {
      console.error('Error al eliminar diplomado:', err)

      const mensajeBackend =
        err.response?.data?.message ||
        err.response?.data?.mensaje ||
        err.response?.data?.error

      setError(
        mensajeBackend || 'No fue posible eliminar el diplomado.',
      )

      setDiplomadoEliminando(null)
    } finally {
      setEliminando(false)
    }
  }

  const formatoFecha = (fecha) => {
    if (!fecha) return 'Sin fecha'

    return new Intl.DateTimeFormat('es-SV', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(new Date(`${fecha}T00:00:00Z`))
  }

  const formatoDinero = (valor) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(Number(valor ?? 0))

  const opcionesActivas = (lista, idActual) =>
    lista.filter(
      (item) =>
        item.activo || String(item.id) === String(idActual),
    )

  return (
    <div className="min-h-screen bg-[#050b16] text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-36 -top-36 h-[450px] w-[450px] rounded-full bg-blue-500/[0.06] blur-[110px]" />
        <div className="absolute -bottom-40 left-1/4 h-[460px] w-[460px] rounded-full bg-cyan-400/[0.04] blur-[120px]" />
      </div>

      <main className="relative mx-auto max-w-[1600px] px-5 py-8 md:px-8 lg:px-10">
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center"
        >
          <div className="flex items-start gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.025] text-slate-400 transition hover:border-cyan-400/20 hover:bg-cyan-400/[0.05] hover:text-cyan-300"
            >
              <ArrowLeft size={19} />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-cyan-400" />
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-400">
                  Formación especializada
                </p>
              </div>

              <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] md:text-4xl">
                Diplomados
              </h1>

              <p className="mt-2 max-w-2xl text-sm text-slate-500">
                Gestiona programas especializados, docentes,
                modalidades, cupos y programación académica.
              </p>
            </div>
          </div>

          <motion.button
            onClick={abrirNuevoDiplomado}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 text-sm font-semibold text-[#04101c] shadow-[0_8px_30px_rgba(34,211,238,0.15)]"
          >
            <Plus size={18} />
            Nuevo diplomado
          </motion.button>
        </motion.header>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[
            {
              label: 'Total de diplomados',
              valor: diplomados.length,
              icono: Award,
              estado: 'REGISTRADOS',
            },
            {
              label: 'Diplomados activos',
              valor: totalActivos,
              icono: GraduationCap,
              estado: 'ACTIVOS',
            },
            {
              label: 'Diplomados inactivos',
              valor: totalInactivos,
              icono: Clock3,
              estado: 'INACTIVOS',
            },
          ].map((item, index) => {
            const Icono = item.icono

            return (
              <motion.article
                key={item.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
                className="rounded-[22px] border border-white/[0.07] bg-[#081321] p-5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/10 bg-cyan-400/[0.06] text-cyan-300">
                    <Icono size={20} />
                  </div>

                  <span className="rounded-full border border-cyan-400/10 bg-cyan-400/[0.05] px-2.5 py-1 text-[10px] font-medium text-cyan-400">
                    {item.estado}
                  </span>
                </div>

                <p className="mt-5 text-xs text-slate-500">
                  {item.label}
                </p>

                <p className="mt-1 text-3xl font-semibold tracking-tight">
                  {item.valor}
                </p>
              </motion.article>
            )
          })}
        </section>

        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-6 overflow-visible rounded-[24px] border border-white/[0.07] bg-[#081321]"
        >
          <div className="flex flex-col justify-between gap-4 border-b border-white/[0.06] p-5 md:flex-row md:items-center">
            <div>
              <h2 className="font-semibold">
                Oferta de diplomados
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                {diplomadosFiltrados.length} registros encontrados
              </p>
            </div>

            <div className="relative w-full md:w-[360px]">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
              />

              <input
                value={busqueda}
                onChange={(event) => setBusqueda(event.target.value)}
                placeholder="Buscar diplomado..."
                className="h-11 w-full rounded-xl border border-white/[0.07] bg-[#050d18] pl-11 pr-4 text-sm outline-none placeholder:text-slate-700 focus:border-cyan-400/30"
              />
            </div>
          </div>

          {cargando ? (
            <div className="flex min-h-[350px] items-center justify-center">
              <div className="text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-cyan-400/20 border-t-cyan-400" />
                <p className="mt-4 text-sm text-slate-500">
                  Cargando diplomados...
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="flex min-h-[350px] items-center justify-center px-6 text-center">
              <p className="text-sm text-red-300">{error}</p>
            </div>
          ) : diplomadosFiltrados.length === 0 ? (
            <div className="flex min-h-[350px] items-center justify-center">
              <div className="text-center">
                <Award
                  size={30}
                  className="mx-auto text-cyan-400"
                />
                <p className="mt-4 text-sm">
                  No encontramos diplomados
                </p>
                <p className="mt-1 text-xs text-slate-600">
                  Intenta con otra búsqueda.
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1200px] border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.055] text-left">
                    {[
                      'Diplomado',
                      'Categoría',
                      'Modalidad',
                      'Docente',
                      'Programación',
                      'Cupo',
                      'Costo',
                      'Estado',
                    ].map((titulo) => (
                      <th
                        key={titulo}
                        className="px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-600"
                      >
                        {titulo}
                      </th>
                    ))}

                    <th className="px-5 py-4 text-right text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-600">
                      Acciones
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {diplomadosFiltrados.map((diplomado, index) => (
                    <motion.tr
                      key={diplomado.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.025 }}
                      className="border-b border-white/[0.045] transition last:border-0 hover:bg-cyan-400/[0.025]"
                    >
                      <td className="px-5 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/10 bg-cyan-400/[0.06] text-cyan-300">
                            <Award size={18} />
                          </div>

                          <div>
                            <p className="max-w-[230px] truncate text-sm font-medium text-slate-200">
                              {diplomado.nombre}
                            </p>

                            <p className="mt-1 max-w-[230px] truncate text-[11px] text-slate-600">
                              {diplomado.descripcion ||
                                'Sin descripción'}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-5 text-xs text-slate-400">
                        {diplomado.categoria?.nombre || '—'}
                      </td>

                      <td className="px-5 py-5 text-xs text-slate-400">
                        {diplomado.modalidad?.nombre || '—'}
                      </td>

                      <td className="px-5 py-5 text-xs text-slate-400">
                        {diplomado.docente?.nombre || '—'}
                      </td>

                      <td className="px-5 py-5">
                        <div className="space-y-1 text-xs text-slate-500">
                          <div className="flex items-center gap-1.5">
                            <CalendarDays size={12} />
                            {formatoFecha(diplomado.fechaInicio)}
                          </div>

                          <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                            <Clock3 size={11} />
                            {diplomado.horario || 'Sin horario'}
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-5 text-xs text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <Users size={12} />
                          {diplomado.cupoMaximo}
                        </div>
                      </td>

                      <td className="px-5 py-5 text-xs font-medium text-slate-300">
                        {formatoDinero(diplomado.costo)}
                      </td>

                      <td className="px-5 py-5">
                        <span
                          className={`rounded-full border px-2.5 py-1 text-[10px] font-medium ${
                            diplomado.activo
                              ? 'border-emerald-400/10 bg-emerald-400/[0.06] text-emerald-400'
                              : 'border-slate-400/10 bg-slate-400/[0.05] text-slate-500'
                          }`}
                        >
                          {diplomado.activo ? 'ACTIVO' : 'INACTIVO'}
                        </span>
                      </td>

                      <td className="relative px-5 py-5 text-right">
                        <button
                          onClick={() =>
                            setMenuAbierto(
                              menuAbierto === diplomado.id
                                ? null
                                : diplomado.id,
                            )
                          }
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition hover:bg-white/[0.04] hover:text-cyan-300"
                        >
                          <MoreHorizontal size={18} />
                        </button>

                        {menuAbierto === diplomado.id && (
                          <motion.div
                            initial={{
                              opacity: 0,
                              scale: 0.96,
                            }}
                            animate={{
                              opacity: 1,
                              scale: 1,
                            }}
                            className="absolute right-5 top-14 z-40 w-44 rounded-xl border border-white/[0.08] bg-[#0b1726] p-1.5 text-left shadow-2xl"
                          >
                            <button
                              onClick={() =>
                                abrirDetalle(diplomado)
                              }
                              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-300 hover:bg-white/[0.05] hover:text-cyan-300"
                            >
                              <Eye size={14} />
                              Ver detalles
                            </button>

                            <button
                              onClick={() =>
                                abrirEditar(diplomado)
                              }
                              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-300 hover:bg-white/[0.05] hover:text-cyan-300"
                            >
                              <Pencil size={14} />
                              Editar
                            </button>

                            <button
                              onClick={() => {
                                setMenuAbierto(null)
                                setDiplomadoEliminando(diplomado)
                              }}
                              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-red-300 hover:bg-red-400/[0.08]"
                            >
                              <Trash2 size={14} />
                              Eliminar
                            </button>
                          </motion.div>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.section>

        <footer className="mt-8 flex flex-col justify-between gap-2 border-t border-white/[0.05] py-6 text-[11px] text-slate-600 sm:flex-row">
          <p>
            Centro de Formación Continua · Formación Especializada
          </p>
          <p>UCA · 2026</p>
        </footer>
      </main>

      {modalFormulario && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={cerrarFormulario}
            className="absolute inset-0 bg-[#02060c]/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative z-10 max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-[26px] border border-white/[0.08] bg-[#081321] shadow-2xl"
          >
            <div className="flex items-start justify-between border-b border-white/[0.06] px-6 py-5 md:px-7">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-400">
                  Formación especializada
                </p>

                <h2 className="mt-2 text-xl font-semibold">
                  {diplomadoEditando
                    ? 'Editar diplomado'
                    : 'Registrar nuevo diplomado'}
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Completa la información del programa académico.
                </p>
              </div>

              <button
                onClick={cerrarFormulario}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-white/[0.04] hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={guardarDiplomado}
              className="p-6 md:p-7"
            >
              <div className="grid gap-5 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-2 block text-xs text-slate-400">
                    Nombre del diplomado *
                  </label>

                  <input
                    name="nombre"
                    value={formulario.nombre}
                    onChange={actualizarCampo}
                    maxLength={150}
                    required
                    placeholder="Ej. Diplomado en Desarrollo de Software"
                    className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#050d18] px-4 text-sm outline-none placeholder:text-slate-700 focus:border-cyan-400/30"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs text-slate-400">
                    Categoría
                  </label>

                  <select
                    name="categoriaId"
                    value={formulario.categoriaId}
                    onChange={actualizarCampo}
                    className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#050d18] px-4 text-sm text-slate-300 outline-none focus:border-cyan-400/30"
                  >
                    <option value="">Sin categoría</option>

                    {opcionesActivas(
                      categorias,
                      formulario.categoriaId,
                    ).map((categoria) => (
                      <option
                        key={categoria.id}
                        value={categoria.id}
                      >
                        {categoria.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-xs text-slate-400">
                    Modalidad
                  </label>

                  <select
                    name="modalidadId"
                    value={formulario.modalidadId}
                    onChange={actualizarCampo}
                    className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#050d18] px-4 text-sm text-slate-300 outline-none focus:border-cyan-400/30"
                  >
                    <option value="">Sin modalidad</option>

                    {opcionesActivas(
                      modalidades,
                      formulario.modalidadId,
                    ).map((modalidad) => (
                      <option
                        key={modalidad.id}
                        value={modalidad.id}
                      >
                        {modalidad.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-xs text-slate-400">
                    Docente
                  </label>

                  <select
                    name="docenteId"
                    value={formulario.docenteId}
                    onChange={actualizarCampo}
                    className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#050d18] px-4 text-sm text-slate-300 outline-none focus:border-cyan-400/30"
                  >
                    <option value="">Sin docente</option>

                    {opcionesActivas(
                      docentes,
                      formulario.docenteId,
                    ).map((docente) => (
                      <option
                        key={docente.id}
                        value={docente.id}
                      >
                        {docente.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-xs text-slate-400">
                    Cupo máximo *
                  </label>

                  <input
                    type="number"
                    min="1"
                    step="1"
                    name="cupoMaximo"
                    value={formulario.cupoMaximo}
                    onChange={actualizarCampo}
                    required
                    className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#050d18] px-4 text-sm outline-none focus:border-cyan-400/30"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs text-slate-400">
                    Fecha de inicio
                  </label>

                  <input
                    type="date"
                    name="fechaInicio"
                    value={formulario.fechaInicio}
                    onChange={actualizarCampo}
                    className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#050d18] px-4 text-sm outline-none focus:border-cyan-400/30"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs text-slate-400">
                    Fecha de finalización
                  </label>

                  <input
                    type="date"
                    name="fechaFin"
                    value={formulario.fechaFin}
                    onChange={actualizarCampo}
                    className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#050d18] px-4 text-sm outline-none focus:border-cyan-400/30"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs text-slate-400">
                    Horario
                  </label>

                  <input
                    name="horario"
                    value={formulario.horario}
                    onChange={actualizarCampo}
                    maxLength={100}
                    placeholder="Ej. Sábados 8:00 AM - 12:00 PM"
                    className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#050d18] px-4 text-sm outline-none placeholder:text-slate-700 focus:border-cyan-400/30"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs text-slate-400">
                    Costo (USD) *
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    name="costo"
                    value={formulario.costo}
                    onChange={actualizarCampo}
                    required
                    className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#050d18] px-4 text-sm outline-none focus:border-cyan-400/30"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-xs text-slate-400">
                    Descripción
                  </label>

                  <textarea
                    name="descripcion"
                    value={formulario.descripcion}
                    onChange={actualizarCampo}
                    rows={4}
                    placeholder="Descripción general del diplomado..."
                    className="w-full resize-none rounded-xl border border-white/[0.08] bg-[#050d18] px-4 py-3 text-sm outline-none placeholder:text-slate-700 focus:border-cyan-400/30"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="flex cursor-pointer items-center justify-between rounded-xl border border-white/[0.07] bg-[#050d18] px-4 py-3">
                    <div>
                      <p className="text-sm text-slate-300">
                        Diplomado activo
                      </p>

                      <p className="mt-0.5 text-[11px] text-slate-600">
                        Define si el programa se encuentra habilitado.
                      </p>
                    </div>

                    <input
                      type="checkbox"
                      name="activo"
                      checked={formulario.activo}
                      onChange={actualizarCampo}
                      className="h-4 w-4 accent-cyan-400"
                    />
                  </label>
                </div>
              </div>

              {errorFormulario && (
                <div className="mt-5 rounded-xl border border-red-400/10 bg-red-400/[0.05] px-4 py-3 text-xs text-red-300">
                  {errorFormulario}
                </div>
              )}

              <div className="mt-7 flex flex-col-reverse gap-3 border-t border-white/[0.06] pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={cerrarFormulario}
                  disabled={guardando}
                  className="h-11 rounded-xl border border-white/[0.08] px-5 text-sm text-slate-400 hover:bg-white/[0.04] hover:text-white disabled:opacity-50"
                >
                  Cancelar
                </button>

                <motion.button
                  type="submit"
                  disabled={guardando}
                  whileTap={
                    guardando ? {} : { scale: 0.98 }
                  }
                  className="h-11 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-6 text-sm font-semibold text-[#04101c] disabled:opacity-60"
                >
                  {guardando
                    ? 'Guardando...'
                    : diplomadoEditando
                      ? 'Guardar cambios'
                      : 'Registrar diplomado'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {diplomadoDetalle && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div
            onClick={() => setDiplomadoDetalle(null)}
            className="absolute inset-0 bg-[#02060c]/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[26px] border border-white/[0.08] bg-[#081321] p-7 shadow-2xl"
          >
            <button
              onClick={() => setDiplomadoDetalle(null)}
              className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-white/[0.05] hover:text-white"
            >
              <X size={18} />
            </button>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.06] text-cyan-300">
              <Award size={23} />
            </div>

            <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-400">
              Programa especializado
            </p>

            <h2 className="mt-2 pr-10 text-2xl font-semibold">
              {diplomadoDetalle.nombre}
            </h2>

            <p className="mt-1 text-xs text-slate-600">
              Diplomado #{diplomadoDetalle.id}
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                [
                  'Categoría',
                  diplomadoDetalle.categoria?.nombre,
                ],
                [
                  'Modalidad',
                  diplomadoDetalle.modalidad?.nombre,
                ],
                [
                  'Docente',
                  diplomadoDetalle.docente?.nombre,
                ],
                [
                  'Cupo máximo',
                  diplomadoDetalle.cupoMaximo,
                ],
                [
                  'Fecha de inicio',
                  formatoFecha(diplomadoDetalle.fechaInicio),
                ],
                [
                  'Fecha de finalización',
                  formatoFecha(diplomadoDetalle.fechaFin),
                ],
                [
                  'Horario',
                  diplomadoDetalle.horario,
                ],
                [
                  'Costo',
                  formatoDinero(diplomadoDetalle.costo),
                ],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-xl border border-white/[0.06] bg-[#050d18] p-4"
                >
                  <p className="text-[10px] uppercase tracking-[0.12em] text-slate-600">
                    {label}
                  </p>

                  <p className="mt-1 text-sm text-slate-300">
                    {value || 'No registrado'}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-3 rounded-xl border border-white/[0.06] bg-[#050d18] p-4">
              <p className="text-[10px] uppercase tracking-[0.12em] text-slate-600">
                Estado
              </p>

              <span
                className={`mt-2 inline-flex rounded-full border px-2.5 py-1 text-[10px] font-medium ${
                  diplomadoDetalle.activo
                    ? 'border-emerald-400/10 bg-emerald-400/[0.06] text-emerald-400'
                    : 'border-slate-400/10 bg-slate-400/[0.05] text-slate-500'
                }`}
              >
                {diplomadoDetalle.activo ? 'ACTIVO' : 'INACTIVO'}
              </span>
            </div>

            <div className="mt-3 rounded-xl border border-white/[0.06] bg-[#050d18] p-4">
              <p className="text-[10px] uppercase tracking-[0.12em] text-slate-600">
                Descripción
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                {diplomadoDetalle.descripcion ||
                  'Sin descripción registrada.'}
              </p>
            </div>
          </motion.div>
        </div>
      )}

      {diplomadoEliminando && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div
            onClick={() =>
              !eliminando && setDiplomadoEliminando(null)
            }
            className="absolute inset-0 bg-[#02060c]/85 backdrop-blur-sm"
          />

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.95,
              y: 15,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            className="relative z-10 w-full max-w-md rounded-[26px] border border-red-400/10 bg-[#081321] p-7 text-center shadow-2xl"
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-red-400/10 bg-red-400/[0.07] text-red-300">
              <AlertTriangle size={25} />
            </div>

            <h2 className="mt-5 text-xl font-semibold">
              ¿Eliminar diplomado?
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Se eliminará{' '}
              <span className="font-medium text-slate-300">
                {diplomadoEliminando.nombre}
              </span>
              . Esta acción no se puede deshacer.
            </p>

            <div className="mt-7 flex gap-3">
              <button
                onClick={() => setDiplomadoEliminando(null)}
                disabled={eliminando}
                className="h-11 flex-1 rounded-xl border border-white/[0.08] text-sm text-slate-400 hover:bg-white/[0.04] disabled:opacity-50"
              >
                Cancelar
              </button>

              <button
                onClick={eliminarDiplomado}
                disabled={eliminando}
                className="h-11 flex-1 rounded-xl bg-red-500/90 text-sm font-semibold text-white hover:bg-red-500 disabled:opacity-50"
              >
                {eliminando ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default Diplomados