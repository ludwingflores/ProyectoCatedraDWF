import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  AlertTriangle,
  ArrowLeft,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Eye,
  GraduationCap,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Trash2,
  UserRound,
  Users,
  X,
  XCircle,
} from 'lucide-react'

import api from '../services/api'

const ESTADOS = [
  'PENDIENTE',
  'CONFIRMADA',
  'CANCELADA',
  'FINALIZADA',
]

const formularioVacio = {
  clienteId: '',
  cursoId: '',
  fecha: '',
  estado: 'PENDIENTE',
}

function Inscripciones() {
  const navigate = useNavigate()

  const [inscripciones, setInscripciones] = useState([])
  const [clientes, setClientes] = useState([])
  const [cursos, setCursos] = useState([])

  const [busqueda, setBusqueda] = useState('')
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  const [modalFormulario, setModalFormulario] = useState(false)
  const [inscripcionEditando, setInscripcionEditando] =
    useState(null)
  const [inscripcionDetalle, setInscripcionDetalle] =
    useState(null)
  const [inscripcionEliminando, setInscripcionEliminando] =
    useState(null)

  const [menuAbierto, setMenuAbierto] = useState(null)

  const [formulario, setFormulario] =
    useState(formularioVacio)

  const [guardando, setGuardando] = useState(false)
  const [eliminando, setEliminando] = useState(false)
  const [errorFormulario, setErrorFormulario] =
    useState('')

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setCargando(true)
        setError('')

        const [
          respuestaInscripciones,
          respuestaClientes,
          respuestaCursos,
        ] = await Promise.all([
          api.get('/inscripciones'),
          api.get('/clientes'),
          api.get('/cursos'),
        ])

        setInscripciones(respuestaInscripciones.data)
        setClientes(respuestaClientes.data)
        setCursos(respuestaCursos.data)
      } catch (err) {
        console.error(
          'Error al cargar inscripciones:',
          err,
        )

        setError(
          'No fue posible cargar la información de inscripciones.',
        )
      } finally {
        setCargando(false)
      }
    }

    cargarDatos()
  }, [])

  const inscripcionesFiltradas = useMemo(() => {
    const texto = busqueda.trim().toLowerCase()

    if (!texto) return inscripciones

    return inscripciones.filter((inscripcion) =>
      [
        inscripcion.id,
        inscripcion.cliente?.nombre,
        inscripcion.cliente?.correo,
        inscripcion.cliente?.dui,
        inscripcion.curso?.nombre,
        inscripcion.estado,
        inscripcion.fecha,
      ].some((valor) =>
        String(valor ?? '')
          .toLowerCase()
          .includes(texto),
      ),
    )
  }, [inscripciones, busqueda])

  const estadisticas = useMemo(() => {
    return {
      total: inscripciones.length,

      pendientes: inscripciones.filter(
        (item) => item.estado === 'PENDIENTE',
      ).length,

      confirmadas: inscripciones.filter(
        (item) => item.estado === 'CONFIRMADA',
      ).length,

      finalizadas: inscripciones.filter(
        (item) => item.estado === 'FINALIZADA',
      ).length,
    }
  }, [inscripciones])

  const actualizarCampo = (event) => {
    const { name, value } = event.target

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }))
  }

  const limpiarFormulario = () => {
    setFormulario(formularioVacio)
    setInscripcionEditando(null)
    setErrorFormulario('')
  }

  const abrirNuevaInscripcion = () => {
    limpiarFormulario()
    setModalFormulario(true)
  }

  const cerrarFormulario = () => {
    if (guardando) return

    setModalFormulario(false)
    limpiarFormulario()
  }

  const abrirEditar = (inscripcion) => {
    setMenuAbierto(null)
    setInscripcionEditando(inscripcion)

    setFormulario({
      clienteId: inscripcion.cliente?.id
        ? String(inscripcion.cliente.id)
        : '',
      cursoId: inscripcion.curso?.id
        ? String(inscripcion.curso.id)
        : '',
      fecha: inscripcion.fecha ?? '',
      estado: inscripcion.estado ?? 'PENDIENTE',
    })

    setErrorFormulario('')
    setModalFormulario(true)
  }

  const abrirDetalle = async (inscripcion) => {
    setMenuAbierto(null)

    try {
      const response = await api.get(
        `/inscripciones/${inscripcion.id}`,
      )

      setInscripcionDetalle(response.data)
    } catch (err) {
      console.error(
        'Error al obtener detalle de inscripción:',
        err,
      )

      setError(
        'No fue posible consultar el detalle de la inscripción.',
      )
    }
  }

  const construirPayload = () => {
    const cliente = clientes.find(
      (item) =>
        String(item.id) === formulario.clienteId,
    )

    const curso = cursos.find(
      (item) =>
        String(item.id) === formulario.cursoId,
    )

    return {
      cliente: cliente || null,
      curso: curso || null,
      fecha: formulario.fecha,
      estado: formulario.estado,
    }
  }

  const guardarInscripcion = async (event) => {
    event.preventDefault()

    if (!formulario.clienteId) {
      setErrorFormulario(
        'Debes seleccionar un cliente.',
      )
      return
    }

    if (!formulario.cursoId) {
      setErrorFormulario(
        'Debes seleccionar un curso.',
      )
      return
    }

    if (!formulario.fecha) {
      setErrorFormulario(
        'La fecha de inscripción es obligatoria.',
      )
      return
    }

    if (!ESTADOS.includes(formulario.estado)) {
      setErrorFormulario(
        'El estado seleccionado no es válido.',
      )
      return
    }

    try {
      setGuardando(true)
      setErrorFormulario('')

      const payload = construirPayload()

      if (inscripcionEditando) {
        const response = await api.put(
          `/inscripciones/${inscripcionEditando.id}`,
          payload,
        )

        setInscripciones((anteriores) =>
          anteriores.map((inscripcion) =>
            inscripcion.id ===
            inscripcionEditando.id
              ? response.data
              : inscripcion,
          ),
        )
      } else {
        const response = await api.post(
          '/inscripciones',
          payload,
        )

        setInscripciones((anteriores) => [
          ...anteriores,
          response.data,
        ])
      }

      setModalFormulario(false)
      limpiarFormulario()
    } catch (err) {
      console.error(
        'Error al guardar inscripción:',
        err,
      )

      const data = err.response?.data

      const mensajeBackend =
        typeof data === 'string'
          ? data
          : data?.message ||
            data?.mensaje ||
            data?.error

      setErrorFormulario(
        mensajeBackend ||
          'No fue posible guardar la inscripción. Verifica el cupo, duplicados y los datos ingresados.',
      )
    } finally {
      setGuardando(false)
    }
  }

  const eliminarInscripcion = async () => {
    if (!inscripcionEliminando) return

    try {
      setEliminando(true)

      await api.delete(
        `/inscripciones/${inscripcionEliminando.id}`,
      )

      setInscripciones((anteriores) =>
        anteriores.filter(
          (inscripcion) =>
            inscripcion.id !==
            inscripcionEliminando.id,
        ),
      )

      setInscripcionEliminando(null)
    } catch (err) {
      console.error(
        'Error al eliminar inscripción:',
        err,
      )

      const data = err.response?.data

      const mensajeBackend =
        typeof data === 'string'
          ? data
          : data?.message ||
            data?.mensaje ||
            data?.error

      setError(
        mensajeBackend ||
          'No fue posible eliminar la inscripción.',
      )

      setInscripcionEliminando(null)
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

  const obtenerClaseEstado = (estado) => {
    switch (estado) {
      case 'CONFIRMADA':
        return 'border-emerald-400/15 bg-emerald-400/[0.07] text-emerald-400'

      case 'CANCELADA':
        return 'border-red-400/15 bg-red-400/[0.07] text-red-300'

      case 'FINALIZADA':
        return 'border-blue-400/15 bg-blue-400/[0.07] text-blue-300'

      default:
        return 'border-amber-400/15 bg-amber-400/[0.07] text-amber-300'
    }
  }

  const cursosDisponibles = (
    idCursoActual = '',
  ) =>
    cursos.filter(
      (curso) =>
        curso.activo ||
        String(curso.id) ===
          String(idCursoActual),
    )

  return (
    <div className="min-h-screen bg-[#050b16] text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-[470px] w-[470px] rounded-full bg-cyan-400/[0.055] blur-[115px]" />

        <div className="absolute -bottom-40 left-1/4 h-[470px] w-[470px] rounded-full bg-blue-500/[0.05] blur-[120px]" />
      </div>

      <main className="relative mx-auto max-w-[1600px] px-5 py-8 md:px-8 lg:px-10">
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center"
        >
          <div className="flex items-start gap-4">
            <button
              onClick={() =>
                navigate('/dashboard')
              }
              className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.025] text-slate-400 transition hover:border-cyan-400/20 hover:bg-cyan-400/[0.05] hover:text-cyan-300"
            >
              <ArrowLeft size={19} />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <ClipboardList
                  size={15}
                  className="text-cyan-400"
                />

                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-400">
                  Control académico
                </p>
              </div>

              <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] md:text-4xl">
                Inscripciones
              </h1>

              <p className="mt-2 max-w-2xl text-sm text-slate-500">
                Gestiona las inscripciones de
                clientes a la oferta académica y
                consulta su estado.
              </p>
            </div>
          </div>

          <motion.button
            onClick={abrirNuevaInscripcion}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 text-sm font-semibold text-[#04101c] shadow-[0_8px_30px_rgba(34,211,238,0.15)]"
          >
            <Plus size={18} />
            Nueva inscripción
          </motion.button>
        </motion.header>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: 'Total inscripciones',
              valor: estadisticas.total,
              icono: Users,
              estado: 'REGISTRADAS',
            },
            {
              label: 'Pendientes',
              valor: estadisticas.pendientes,
              icono: Clock3,
              estado: 'PENDIENTES',
            },
            {
              label: 'Confirmadas',
              valor: estadisticas.confirmadas,
              icono: CheckCircle2,
              estado: 'CONFIRMADAS',
            },
            {
              label: 'Finalizadas',
              valor: estadisticas.finalizadas,
              icono: GraduationCap,
              estado: 'FINALIZADAS',
            },
          ].map((item, index) => {
            const Icono = item.icono

            return (
              <motion.article
                key={item.label}
                initial={{
                  opacity: 0,
                  y: 12,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: index * 0.05,
                }}
                className="rounded-[22px] border border-white/[0.07] bg-[#081321] p-5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/10 bg-cyan-400/[0.06] text-cyan-300">
                    <Icono size={20} />
                  </div>

                  <span className="rounded-full border border-cyan-400/10 bg-cyan-400/[0.05] px-2.5 py-1 text-[9px] font-medium text-cyan-400">
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
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.15,
          }}
          className="mt-6 overflow-visible rounded-[24px] border border-white/[0.07] bg-[#081321]"
        >
          <div className="flex flex-col justify-between gap-4 border-b border-white/[0.06] p-5 md:flex-row md:items-center">
            <div>
              <h2 className="font-semibold">
                Registro de inscripciones
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                {inscripcionesFiltradas.length}{' '}
                registros encontrados
              </p>
            </div>

            <div className="relative w-full md:w-[380px]">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
              />

              <input
                value={busqueda}
                onChange={(event) =>
                  setBusqueda(event.target.value)
                }
                placeholder="Buscar cliente, curso o estado..."
                className="h-11 w-full rounded-xl border border-white/[0.07] bg-[#050d18] pl-11 pr-4 text-sm outline-none placeholder:text-slate-700 focus:border-cyan-400/30"
              />
            </div>
          </div>

          {cargando ? (
            <div className="flex min-h-[350px] items-center justify-center">
              <div className="text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-cyan-400/20 border-t-cyan-400" />

                <p className="mt-4 text-sm text-slate-500">
                  Cargando inscripciones...
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="flex min-h-[350px] items-center justify-center px-6 text-center">
              <p className="text-sm text-red-300">
                {error}
              </p>
            </div>
          ) : inscripcionesFiltradas.length ===
            0 ? (
            <div className="flex min-h-[350px] items-center justify-center">
              <div className="text-center">
                <ClipboardList
                  size={30}
                  className="mx-auto text-cyan-400"
                />

                <p className="mt-4 text-sm">
                  No encontramos inscripciones
                </p>

                <p className="mt-1 text-xs text-slate-600">
                  Intenta con otra búsqueda o
                  registra una nueva.
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px] border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.055] text-left">
                    {[
                      'Inscripción',
                      'Cliente',
                      'Curso',
                      'Fecha',
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
                  {inscripcionesFiltradas.map(
                    (inscripcion, index) => (
                      <motion.tr
                        key={inscripcion.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{
                          delay:
                            index * 0.025,
                        }}
                        className="border-b border-white/[0.045] transition last:border-0 hover:bg-cyan-400/[0.025]"
                      >
                        <td className="px-5 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/10 bg-cyan-400/[0.06] text-cyan-300">
                              <ClipboardList
                                size={18}
                              />
                            </div>

                            <div>
                              <p className="text-sm font-medium text-slate-200">
                                INS-
                                {String(
                                  inscripcion.id,
                                ).padStart(
                                  4,
                                  '0',
                                )}
                              </p>

                              <p className="mt-1 text-[11px] text-slate-600">
                                Registro académico
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-5">
                          <div>
                            <p className="text-xs font-medium text-slate-300">
                              {inscripcion
                                .cliente
                                ?.nombre ||
                                'Sin cliente'}
                            </p>

                            <p className="mt-1 text-[11px] text-slate-600">
                              {inscripcion
                                .cliente
                                ?.correo ||
                                'Sin correo'}
                            </p>
                          </div>
                        </td>

                        <td className="px-5 py-5">
                          <div className="flex items-center gap-2">
                            <BookOpen
                              size={13}
                              className="text-cyan-500"
                            />

                            <span className="max-w-[260px] truncate text-xs text-slate-400">
                              {inscripcion
                                .curso
                                ?.nombre ||
                                'Sin curso'}
                            </span>
                          </div>
                        </td>

                        <td className="px-5 py-5">
                          <div className="flex items-center gap-2 text-xs text-slate-400">
                            <CalendarDays
                              size={13}
                            />

                            {formatoFecha(
                              inscripcion.fecha,
                            )}
                          </div>
                        </td>

                        <td className="px-5 py-5">
                          <span
                            className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-medium ${obtenerClaseEstado(
                              inscripcion.estado,
                            )}`}
                          >
                            {inscripcion.estado}
                          </span>
                        </td>

                        <td className="relative px-5 py-5 text-right">
                          <button
                            onClick={() =>
                              setMenuAbierto(
                                menuAbierto ===
                                  inscripcion.id
                                  ? null
                                  : inscripcion.id,
                              )
                            }
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition hover:bg-white/[0.04] hover:text-cyan-300"
                          >
                            <MoreHorizontal
                              size={18}
                            />
                          </button>

                          {menuAbierto ===
                            inscripcion.id && (
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
                                  abrirDetalle(
                                    inscripcion,
                                  )
                                }
                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-300 hover:bg-white/[0.05] hover:text-cyan-300"
                              >
                                <Eye
                                  size={14}
                                />
                                Ver detalles
                              </button>

                              <button
                                onClick={() =>
                                  abrirEditar(
                                    inscripcion,
                                  )
                                }
                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-300 hover:bg-white/[0.05] hover:text-cyan-300"
                              >
                                <Pencil
                                  size={14}
                                />
                                Editar
                              </button>

                              <button
                                onClick={() => {
                                  setMenuAbierto(
                                    null,
                                  )

                                  setInscripcionEliminando(
                                    inscripcion,
                                  )
                                }}
                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-red-300 hover:bg-red-400/[0.08]"
                              >
                                <Trash2
                                  size={14}
                                />
                                Eliminar
                              </button>
                            </motion.div>
                          )}
                        </td>
                      </motion.tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          )}
        </motion.section>

        <footer className="mt-8 flex flex-col justify-between gap-2 border-t border-white/[0.05] py-6 text-[11px] text-slate-600 sm:flex-row">
          <p>
            Centro de Formación Continua ·
            Control de Inscripciones
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
            initial={{
              opacity: 0,
              scale: 0.96,
              y: 20,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            className="relative z-10 w-full max-w-2xl rounded-[26px] border border-white/[0.08] bg-[#081321] shadow-2xl"
          >
            <div className="flex items-start justify-between border-b border-white/[0.06] px-6 py-5 md:px-7">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-400">
                  Control académico
                </p>

                <h2 className="mt-2 text-xl font-semibold">
                  {inscripcionEditando
                    ? 'Editar inscripción'
                    : 'Nueva inscripción'}
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Asigna un cliente a un curso y
                  define el estado del registro.
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
              onSubmit={guardarInscripcion}
              className="p-6 md:p-7"
            >
              <div className="grid gap-5 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-2 block text-xs text-slate-400">
                    Cliente *
                  </label>

                  <select
                    name="clienteId"
                    value={
                      formulario.clienteId
                    }
                    onChange={
                      actualizarCampo
                    }
                    required
                    className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#050d18] px-4 text-sm text-slate-300 outline-none focus:border-cyan-400/30"
                  >
                    <option value="">
                      Selecciona un cliente
                    </option>

                    {clientes.map(
                      (cliente) => (
                        <option
                          key={cliente.id}
                          value={cliente.id}
                        >
                          {cliente.nombre}
                          {cliente.correo
                            ? ` · ${cliente.correo}`
                            : ''}
                        </option>
                      ),
                    )}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-xs text-slate-400">
                    Curso *
                  </label>

                  <select
                    name="cursoId"
                    value={
                      formulario.cursoId
                    }
                    onChange={
                      actualizarCampo
                    }
                    required
                    className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#050d18] px-4 text-sm text-slate-300 outline-none focus:border-cyan-400/30"
                  >
                    <option value="">
                      Selecciona un curso
                    </option>

                    {cursosDisponibles(
                      formulario.cursoId,
                    ).map((curso) => (
                      <option
                        key={curso.id}
                        value={curso.id}
                      >
                        {curso.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-xs text-slate-400">
                    Fecha de inscripción *
                  </label>

                  <input
                    type="date"
                    name="fecha"
                    value={formulario.fecha}
                    onChange={
                      actualizarCampo
                    }
                    required
                    className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#050d18] px-4 text-sm outline-none focus:border-cyan-400/30"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs text-slate-400">
                    Estado *
                  </label>

                  <select
                    name="estado"
                    value={formulario.estado}
                    onChange={
                      actualizarCampo
                    }
                    required
                    className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#050d18] px-4 text-sm text-slate-300 outline-none focus:border-cyan-400/30"
                  >
                    {ESTADOS.map(
                      (estado) => (
                        <option
                          key={estado}
                          value={estado}
                        >
                          {estado}
                        </option>
                      ),
                    )}
                  </select>
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-cyan-400/10 bg-cyan-400/[0.035] p-4">
                <div className="flex gap-3">
                  <Users
                    size={17}
                    className="mt-0.5 shrink-0 text-cyan-400"
                  />

                  <div>
                    <p className="text-xs font-medium text-slate-300">
                      Control de disponibilidad
                    </p>

                    <p className="mt-1 text-[11px] leading-5 text-slate-600">
                      El sistema validará la
                      disponibilidad de cupo y
                      evitará inscripciones
                      duplicadas al guardar.
                    </p>
                  </div>
                </div>
              </div>

              {errorFormulario && (
                <div className="mt-5 rounded-xl border border-red-400/10 bg-red-400/[0.05] px-4 py-3 text-xs leading-5 text-red-300">
                  {errorFormulario}
                </div>
              )}

              <div className="mt-7 flex flex-col-reverse gap-3 border-t border-white/[0.06] pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={
                    cerrarFormulario
                  }
                  disabled={guardando}
                  className="h-11 rounded-xl border border-white/[0.08] px-5 text-sm text-slate-400 hover:bg-white/[0.04] hover:text-white disabled:opacity-50"
                >
                  Cancelar
                </button>

                <motion.button
                  type="submit"
                  disabled={guardando}
                  whileTap={
                    guardando
                      ? {}
                      : {
                          scale: 0.98,
                        }
                  }
                  className="h-11 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-6 text-sm font-semibold text-[#04101c] disabled:opacity-60"
                >
                  {guardando
                    ? 'Guardando...'
                    : inscripcionEditando
                      ? 'Guardar cambios'
                      : 'Registrar inscripción'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {inscripcionDetalle && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div
            onClick={() =>
              setInscripcionDetalle(
                null,
              )
            }
            className="absolute inset-0 bg-[#02060c]/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.96,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            className="relative z-10 w-full max-w-2xl rounded-[26px] border border-white/[0.08] bg-[#081321] p-7 shadow-2xl"
          >
            <button
              onClick={() =>
                setInscripcionDetalle(
                  null,
                )
              }
              className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-white/[0.05] hover:text-white"
            >
              <X size={18} />
            </button>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.06] text-cyan-300">
              <ClipboardList
                size={22}
              />
            </div>

            <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-400">
              Detalle de inscripción
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-semibold">
                INS-
                {String(
                  inscripcionDetalle.id,
                ).padStart(4, '0')}
              </h2>

              <span
                className={`rounded-full border px-2.5 py-1 text-[10px] font-medium ${obtenerClaseEstado(
                  inscripcionDetalle.estado,
                )}`}
              >
                {inscripcionDetalle.estado}
              </span>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-white/[0.06] bg-[#050d18] p-4">
                <div className="flex items-center gap-2 text-cyan-400">
                  <UserRound size={15} />
                  <p className="text-[10px] uppercase tracking-[0.12em]">
                    Cliente
                  </p>
                </div>

                <p className="mt-3 text-sm font-medium text-slate-300">
                  {inscripcionDetalle
                    .cliente?.nombre ||
                    'No registrado'}
                </p>

                <p className="mt-1 text-xs text-slate-600">
                  {inscripcionDetalle
                    .cliente?.correo ||
                    'Sin correo'}
                </p>

                {inscripcionDetalle
                  .cliente?.dui && (
                  <p className="mt-1 text-xs text-slate-600">
                    DUI:{' '}
                    {
                      inscripcionDetalle
                        .cliente.dui
                    }
                  </p>
                )}
              </div>

              <div className="rounded-xl border border-white/[0.06] bg-[#050d18] p-4">
                <div className="flex items-center gap-2 text-cyan-400">
                  <BookOpen size={15} />

                  <p className="text-[10px] uppercase tracking-[0.12em]">
                    Curso
                  </p>
                </div>

                <p className="mt-3 text-sm font-medium text-slate-300">
                  {inscripcionDetalle
                    .curso?.nombre ||
                    'No registrado'}
                </p>

                <p className="mt-1 text-xs text-slate-600">
                  {inscripcionDetalle
                    .curso?.modalidad
                    ?.nombre ||
                    'Sin modalidad'}
                </p>
              </div>

              <div className="rounded-xl border border-white/[0.06] bg-[#050d18] p-4">
                <div className="flex items-center gap-2 text-cyan-400">
                  <CalendarDays
                    size={15}
                  />

                  <p className="text-[10px] uppercase tracking-[0.12em]">
                    Fecha
                  </p>
                </div>

                <p className="mt-3 text-sm text-slate-300">
                  {formatoFecha(
                    inscripcionDetalle.fecha,
                  )}
                </p>
              </div>

              <div className="rounded-xl border border-white/[0.06] bg-[#050d18] p-4">
                <div className="flex items-center gap-2 text-cyan-400">
                  {inscripcionDetalle.estado ===
                  'CANCELADA' ? (
                    <XCircle size={15} />
                  ) : (
                    <CheckCircle2
                      size={15}
                    />
                  )}

                  <p className="text-[10px] uppercase tracking-[0.12em]">
                    Estado
                  </p>
                </div>

                <p className="mt-3 text-sm text-slate-300">
                  {
                    inscripcionDetalle.estado
                  }
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {inscripcionEliminando && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div
            onClick={() =>
              !eliminando &&
              setInscripcionEliminando(
                null,
              )
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
              <AlertTriangle
                size={25}
              />
            </div>

            <h2 className="mt-5 text-xl font-semibold">
              ¿Eliminar inscripción?
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Se eliminará la
              inscripción de{' '}
              <span className="font-medium text-slate-300">
                {inscripcionEliminando
                  .cliente?.nombre ||
                  `registro #${inscripcionEliminando.id}`}
              </span>
              . Esta acción no se puede
              deshacer.
            </p>

            <div className="mt-7 flex gap-3">
              <button
                onClick={() =>
                  setInscripcionEliminando(
                    null,
                  )
                }
                disabled={eliminando}
                className="h-11 flex-1 rounded-xl border border-white/[0.08] text-sm text-slate-400 hover:bg-white/[0.04] disabled:opacity-50"
              >
                Cancelar
              </button>

              <button
                onClick={
                  eliminarInscripcion
                }
                disabled={eliminando}
                className="h-11 flex-1 rounded-xl bg-red-500/90 text-sm font-semibold text-white hover:bg-red-500 disabled:opacity-50"
              >
                {eliminando
                  ? 'Eliminando...'
                  : 'Eliminar'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default Inscripciones