import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  AlertTriangle,
  ArrowLeft,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  DollarSign,
  Eye,
  MapPin,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Trash2,
  UserRound,
  X,
  XCircle,
} from 'lucide-react'

import api from '../services/api'

const ESTADOS = [
  'PENDIENTE',
  'CONFIRMADO',
  'CANCELADO',
  'FINALIZADO',
]

const formularioVacio = {
  clienteId: '',
  espacioId: '',
  fecha: '',
  horaInicio: '',
  horaFin: '',
  precio: '',
  estado: 'PENDIENTE',
}

function Alquileres() {
  const navigate = useNavigate()

  const [alquileres, setAlquileres] = useState([])
  const [clientes, setClientes] = useState([])
  const [espacios, setEspacios] = useState([])

  const [busqueda, setBusqueda] = useState('')
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  const [menuAbierto, setMenuAbierto] = useState(null)

  const [modalFormulario, setModalFormulario] =
    useState(false)

  const [alquilerEditando, setAlquilerEditando] =
    useState(null)

  const [alquilerDetalle, setAlquilerDetalle] =
    useState(null)

  const [alquilerEliminando, setAlquilerEliminando] =
    useState(null)

  const [formulario, setFormulario] =
    useState(formularioVacio)

  const [guardando, setGuardando] = useState(false)
  const [eliminando, setEliminando] = useState(false)

  const [errorFormulario, setErrorFormulario] =
    useState('')

  const [consultandoDisponibilidad, setConsultandoDisponibilidad] =
    useState(false)

  const [disponibilidad, setDisponibilidad] =
    useState(null)

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    try {
      setCargando(true)
      setError('')

      const [
        respuestaAlquileres,
        respuestaClientes,
        respuestaEspacios,
      ] = await Promise.all([
        api.get('/alquileres'),
        api.get('/clientes'),
        api.get('/espacios'),
      ])

      setAlquileres(respuestaAlquileres.data || [])
      setClientes(respuestaClientes.data || [])
      setEspacios(respuestaEspacios.data || [])
    } catch (err) {
      console.error('Error cargando alquileres:', err)

      setError(
        'No fue posible cargar la información de alquileres.',
      )
    } finally {
      setCargando(false)
    }
  }

  const alquileresFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase()

    if (!texto) return alquileres

    return alquileres.filter((alquiler) =>
      [
        alquiler.id,
        alquiler.cliente?.nombre,
        alquiler.cliente?.correo,
        alquiler.espacio?.nombre,
        alquiler.espacio?.tipo,
        alquiler.fecha,
        alquiler.estado,
      ].some((valor) =>
        String(valor ?? '')
          .toLowerCase()
          .includes(texto),
      ),
    )
  }, [alquileres, busqueda])

  const estadisticas = useMemo(() => {
    return {
      total: alquileres.length,

      pendientes: alquileres.filter(
        (item) => item.estado === 'PENDIENTE',
      ).length,

      confirmados: alquileres.filter(
        (item) => item.estado === 'CONFIRMADO',
      ).length,

      finalizados: alquileres.filter(
        (item) => item.estado === 'FINALIZADO',
      ).length,
    }
  }, [alquileres])

  const formatoMoneda = (valor) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(Number(valor || 0))

  const formatoFecha = (fecha) => {
    if (!fecha) return 'Sin fecha'

    return new Intl.DateTimeFormat('es-SV', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(new Date(`${fecha}T00:00:00Z`))
  }

  const formatoHora = (hora) => {
    if (!hora) return '--:--'

    return String(hora).slice(0, 5)
  }

  const obtenerClaseEstado = (estado) => {
    switch (estado) {
      case 'CONFIRMADO':
        return 'border-emerald-400/15 bg-emerald-400/[0.07] text-emerald-300'

      case 'CANCELADO':
        return 'border-red-400/15 bg-red-400/[0.07] text-red-300'

      case 'FINALIZADO':
        return 'border-blue-400/15 bg-blue-400/[0.07] text-blue-300'

      default:
        return 'border-amber-400/15 bg-amber-400/[0.07] text-amber-300'
    }
  }

  const obtenerEspacio = (id) =>
    espacios.find(
      (espacio) => String(espacio.id) === String(id),
    )

  const actualizarCampo = (event) => {
    const { name, value } = event.target

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }))

    if (
      [
        'espacioId',
        'fecha',
        'horaInicio',
        'horaFin',
      ].includes(name)
    ) {
      setDisponibilidad(null)
    }

    if (name === 'espacioId') {
      const espacio = obtenerEspacio(value)

      if (espacio) {
        setFormulario((anterior) => ({
          ...anterior,
          espacioId: value,
          precio: String(espacio.precio ?? ''),
        }))
      }
    }
  }

  const abrirNuevoAlquiler = () => {
    setAlquilerEditando(null)
    setFormulario(formularioVacio)
    setDisponibilidad(null)
    setErrorFormulario('')
    setModalFormulario(true)
  }

  const cerrarFormulario = () => {
    if (guardando) return

    setModalFormulario(false)
    setAlquilerEditando(null)
    setFormulario(formularioVacio)
    setDisponibilidad(null)
    setErrorFormulario('')
  }

  const comprobarDisponibilidad = async () => {
    if (
      !formulario.espacioId ||
      !formulario.fecha ||
      !formulario.horaInicio ||
      !formulario.horaFin
    ) {
      setErrorFormulario(
        'Selecciona espacio, fecha, hora de inicio y hora de fin antes de consultar.',
      )
      return
    }

    if (formulario.horaInicio >= formulario.horaFin) {
      setErrorFormulario(
        'La hora de fin debe ser posterior a la hora de inicio.',
      )
      return
    }

    try {
      setConsultandoDisponibilidad(true)
      setErrorFormulario('')
      setDisponibilidad(null)

      const response = await api.get(
        '/alquileres/disponibilidad',
        {
          params: {
            espacioId: Number(formulario.espacioId),
            fecha: formulario.fecha,
            horaInicio: formulario.horaInicio,
            horaFin: formulario.horaFin,
          },
        },
      )

      const data = response.data

      let disponible = false

      if (typeof data === 'boolean') {
        disponible = data
      } else if (
        data &&
        typeof data.disponible === 'boolean'
      ) {
        disponible = data.disponible
      } else if (data && typeof data === 'object') {
        const valores = Object.values(data)

        disponible =
          valores.length > 0 &&
          valores.every((valor) => valor === true)
      }

      setDisponibilidad(disponible)
    } catch (err) {
      console.error(
        'Error consultando disponibilidad:',
        err,
      )

      setErrorFormulario(
        'No fue posible consultar la disponibilidad del espacio.',
      )
    } finally {
      setConsultandoDisponibilidad(false)
    }
  }

  const abrirDetalle = async (alquiler) => {
    setMenuAbierto(null)

    try {
      const response = await api.get(
        `/alquileres/${alquiler.id}`,
      )

      setAlquilerDetalle(response.data)
    } catch (err) {
      console.error(err)

      setError(
        'No fue posible consultar el alquiler.',
      )
    }
  }

  const abrirEditar = async (alquiler) => {
    setMenuAbierto(null)

    try {
      const response = await api.get(
        `/alquileres/${alquiler.id}`,
      )

      const data = response.data

      setAlquilerEditando(data)

      setFormulario({
        clienteId: data.cliente?.id
          ? String(data.cliente.id)
          : '',

        espacioId: data.espacio?.id
          ? String(data.espacio.id)
          : '',

        fecha: data.fecha || '',

        horaInicio: formatoHora(data.horaInicio),

        horaFin: formatoHora(data.horaFin),

        precio:
          data.precio !== null &&
          data.precio !== undefined
            ? String(data.precio)
            : '',

        estado: data.estado || 'PENDIENTE',
      })

      setDisponibilidad(null)
      setErrorFormulario('')
      setModalFormulario(true)
    } catch (err) {
      console.error(err)

      setError(
        'No fue posible cargar el alquiler para editar.',
      )
    }
  }

  const validarFormulario = () => {
    if (!formulario.espacioId) {
      return 'Debes seleccionar un espacio.'
    }

    if (!formulario.fecha) {
      return 'La fecha es obligatoria.'
    }

    if (
      !formulario.horaInicio ||
      !formulario.horaFin
    ) {
      return 'Debes indicar el horario del alquiler.'
    }

    if (formulario.horaInicio >= formulario.horaFin) {
      return 'La hora de fin debe ser posterior a la hora de inicio.'
    }

    if (
      formulario.precio === '' ||
      Number(formulario.precio) < 0
    ) {
      return 'El precio no puede ser negativo.'
    }

    if (!ESTADOS.includes(formulario.estado)) {
      return 'El estado seleccionado no es válido.'
    }

    return ''
  }

  const construirPayload = () => {
    const cliente = clientes.find(
      (item) =>
        String(item.id) === String(formulario.clienteId),
    )

    const espacio = espacios.find(
      (item) =>
        String(item.id) === String(formulario.espacioId),
    )

    return {
      cliente: cliente || null,
      espacio,
      fecha: formulario.fecha,
      horaInicio: formulario.horaInicio,
      horaFin: formulario.horaFin,
      precio: Number(formulario.precio),
      estado: formulario.estado,
    }
  }

  const guardarAlquiler = async (event) => {
    event.preventDefault()

    const validacion = validarFormulario()

    if (validacion) {
      setErrorFormulario(validacion)
      return
    }

    /*
     * Para un registro nuevo exigimos que el horario
     * haya sido comprobado.
     *
     * En edición dejamos que el backend realice también
     * su validación para no impedir cambios de estado o
     * precio que no modifican necesariamente el horario.
     */
    if (!alquilerEditando) {
      if (disponibilidad === null) {
        setErrorFormulario(
          'Comprueba la disponibilidad del espacio antes de registrar el alquiler.',
        )
        return
      }

      if (disponibilidad === false) {
        setErrorFormulario(
          'El espacio no está disponible en el horario seleccionado.',
        )
        return
      }
    }

    try {
      setGuardando(true)
      setErrorFormulario('')

      const payload = construirPayload()

      if (alquilerEditando) {
        const response = await api.put(
          `/alquileres/${alquilerEditando.id}`,
          payload,
        )

        setAlquileres((anteriores) =>
          anteriores.map((item) =>
            item.id === alquilerEditando.id
              ? response.data
              : item,
          ),
        )
      } else {
        const response = await api.post(
          '/alquileres',
          payload,
        )

        setAlquileres((anteriores) => [
          ...anteriores,
          response.data,
        ])
      }

      setModalFormulario(false)
      setAlquilerEditando(null)
      setFormulario(formularioVacio)
      setDisponibilidad(null)
    } catch (err) {
      console.error(
        'Error guardando alquiler:',
        err,
      )

      const data = err.response?.data

      const mensaje =
        typeof data === 'string'
          ? data
          : data?.message ||
            data?.mensaje ||
            data?.error

      setErrorFormulario(
        mensaje ||
          'No fue posible guardar el alquiler. Verifica la disponibilidad y los datos ingresados.',
      )
    } finally {
      setGuardando(false)
    }
  }

  const eliminarAlquiler = async () => {
    if (!alquilerEliminando) return

    try {
      setEliminando(true)

      await api.delete(
        `/alquileres/${alquilerEliminando.id}`,
      )

      setAlquileres((anteriores) =>
        anteriores.filter(
          (item) =>
            item.id !== alquilerEliminando.id,
        ),
      )

      setAlquilerEliminando(null)
    } catch (err) {
      console.error(err)

      const data = err.response?.data

      const mensaje =
        typeof data === 'string'
          ? data
          : data?.message ||
            data?.mensaje ||
            data?.error

      setError(
        mensaje ||
          'No fue posible eliminar el alquiler.',
      )

      setAlquilerEliminando(null)
    } finally {
      setEliminando(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#050b16] text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-cyan-400/[0.055] blur-[120px]" />
        <div className="absolute -bottom-40 left-1/4 h-[500px] w-[500px] rounded-full bg-blue-500/[0.05] blur-[125px]" />
      </div>

      <main className="relative mx-auto max-w-[1650px] px-5 py-8 md:px-8 lg:px-10">
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
                <Building2
                  size={15}
                  className="text-cyan-400"
                />

                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-400">
                  Gestión de espacios
                </p>
              </div>

              <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] md:text-4xl">
                Alquileres
              </h1>

              <p className="mt-2 max-w-2xl text-sm text-slate-500">
                Administra reservas, horarios y
                disponibilidad de los espacios.
              </p>
            </div>
          </div>

          <motion.button
            onClick={abrirNuevoAlquiler}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 text-sm font-semibold text-[#04101c] shadow-[0_8px_30px_rgba(34,211,238,0.15)]"
          >
            <Plus size={18} />
            Nuevo alquiler
          </motion.button>
        </motion.header>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: 'Total alquileres',
              valor: estadisticas.total,
              icono: Building2,
              tag: 'REGISTRADOS',
            },
            {
              label: 'Pendientes',
              valor: estadisticas.pendientes,
              icono: Clock3,
              tag: 'PENDIENTES',
            },
            {
              label: 'Confirmados',
              valor: estadisticas.confirmados,
              icono: CheckCircle2,
              tag: 'CONFIRMADOS',
            },
            {
              label: 'Finalizados',
              valor: estadisticas.finalizados,
              icono: CalendarDays,
              tag: 'FINALIZADOS',
            },
          ].map((item, index) => {
            const Icono = item.icono

            return (
              <motion.article
                key={item.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-[22px] border border-white/[0.07] bg-[#081321] p-5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/10 bg-cyan-400/[0.06] text-cyan-300">
                    <Icono size={20} />
                  </div>

                  <span className="rounded-full border border-cyan-400/10 bg-cyan-400/[0.05] px-2.5 py-1 text-[9px] font-medium text-cyan-400">
                    {item.tag}
                  </span>
                </div>

                <p className="mt-5 text-xs text-slate-500">
                  {item.label}
                </p>

                <p className="mt-1 text-3xl font-semibold">
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
                Historial de alquileres
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                {alquileresFiltrados.length} registros encontrados
              </p>
            </div>

            <div className="relative w-full md:w-[390px]">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
              />

              <input
                value={busqueda}
                onChange={(event) =>
                  setBusqueda(event.target.value)
                }
                placeholder="Buscar cliente, espacio o estado..."
                className="h-11 w-full rounded-xl border border-white/[0.07] bg-[#050d18] pl-11 pr-4 text-sm outline-none placeholder:text-slate-700 focus:border-cyan-400/30"
              />
            </div>
          </div>

          {cargando ? (
            <div className="flex min-h-[350px] items-center justify-center">
              <div className="text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-cyan-400/20 border-t-cyan-400" />

                <p className="mt-4 text-sm text-slate-500">
                  Cargando alquileres...
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="flex min-h-[350px] items-center justify-center px-6 text-center">
              <p className="text-sm text-red-300">
                {error}
              </p>
            </div>
          ) : alquileresFiltrados.length === 0 ? (
            <div className="flex min-h-[350px] items-center justify-center">
              <div className="text-center">
                <Building2
                  size={34}
                  className="mx-auto text-cyan-400"
                />

                <p className="mt-4 text-sm">
                  No hay alquileres para mostrar
                </p>

                <p className="mt-1 text-xs text-slate-600">
                  Registra una nueva reserva de espacio.
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1150px]">
                <thead>
                  <tr className="border-b border-white/[0.055] text-left">
                    {[
                      'Reserva',
                      'Cliente',
                      'Espacio',
                      'Fecha',
                      'Horario',
                      'Precio',
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
                  {alquileresFiltrados.map(
                    (alquiler, index) => (
                      <motion.tr
                        key={alquiler.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{
                          delay: index * 0.025,
                        }}
                        className="border-b border-white/[0.045] transition last:border-0 hover:bg-cyan-400/[0.025]"
                      >
                        <td className="px-5 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/10 bg-cyan-400/[0.06] text-cyan-300">
                              <Building2 size={18} />
                            </div>

                            <div>
                              <p className="text-sm font-medium text-slate-200">
                                ALQ-
                                {String(
                                  alquiler.id,
                                ).padStart(4, '0')}
                              </p>

                              <p className="mt-1 text-[11px] text-slate-600">
                                Reserva de espacio
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-5">
                          <p className="text-xs font-medium text-slate-300">
                            {alquiler.cliente?.nombre ||
                              'Sin cliente'}
                          </p>

                          <p className="mt-1 text-[11px] text-slate-600">
                            {alquiler.cliente?.correo ||
                              '—'}
                          </p>
                        </td>

                        <td className="px-5 py-5">
                          <p className="text-xs font-medium text-slate-300">
                            {alquiler.espacio?.nombre ||
                              'Sin espacio'}
                          </p>

                          <p className="mt-1 text-[11px] text-slate-600">
                            {alquiler.espacio?.tipo || '—'}
                          </p>
                        </td>

                        <td className="px-5 py-5 text-xs text-slate-400">
                          {formatoFecha(alquiler.fecha)}
                        </td>

                        <td className="px-5 py-5">
                          <div className="flex items-center gap-2 text-xs text-slate-400">
                            <Clock3 size={13} />
                            {formatoHora(
                              alquiler.horaInicio,
                            )}
                            {' — '}
                            {formatoHora(
                              alquiler.horaFin,
                            )}
                          </div>
                        </td>

                        <td className="px-5 py-5">
                          <p className="text-sm font-semibold text-cyan-300">
                            {formatoMoneda(
                              alquiler.precio,
                            )}
                          </p>
                        </td>

                        <td className="px-5 py-5">
                          <span
                            className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-medium ${obtenerClaseEstado(
                              alquiler.estado,
                            )}`}
                          >
                            {alquiler.estado}
                          </span>
                        </td>

                        <td className="relative px-5 py-5 text-right">
                          <button
                            onClick={() =>
                              setMenuAbierto(
                                menuAbierto === alquiler.id
                                  ? null
                                  : alquiler.id,
                              )
                            }
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 hover:bg-white/[0.04] hover:text-cyan-300"
                          >
                            <MoreHorizontal size={18} />
                          </button>

                          {menuAbierto === alquiler.id && (
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
                                  abrirDetalle(alquiler)
                                }
                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-300 hover:bg-white/[0.05] hover:text-cyan-300"
                              >
                                <Eye size={14} />
                                Ver detalles
                              </button>

                              <button
                                onClick={() =>
                                  abrirEditar(alquiler)
                                }
                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-300 hover:bg-white/[0.05] hover:text-cyan-300"
                              >
                                <Pencil size={14} />
                                Editar
                              </button>

                              <button
                                onClick={() => {
                                  setMenuAbierto(null)
                                  setAlquilerEliminando(
                                    alquiler,
                                  )
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
                    ),
                  )}
                </tbody>
              </table>
            </div>
          )}
        </motion.section>
      </main>

      {modalFormulario && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={cerrarFormulario}
            className="absolute inset-0 bg-[#02060c]/85 backdrop-blur-sm"
          />

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.97,
              y: 20,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            className="relative z-10 max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-[28px] border border-white/[0.08] bg-[#081321] shadow-2xl"
          >
            <div className="flex items-start justify-between border-b border-white/[0.06] px-6 py-5">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-400">
                  Reserva de espacio
                </p>

                <h2 className="mt-2 text-xl font-semibold">
                  {alquilerEditando
                    ? 'Editar alquiler'
                    : 'Nuevo alquiler'}
                </h2>
              </div>

              <button
                onClick={cerrarFormulario}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-white/[0.04] hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={guardarAlquiler}
              className="p-6"
            >
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs text-slate-400">
                    Cliente
                  </label>

                  <select
                    name="clienteId"
                    value={formulario.clienteId}
                    onChange={actualizarCampo}
                    className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#050d18] px-4 text-sm text-slate-300 outline-none focus:border-cyan-400/30"
                  >
                    <option value="">
                      Sin cliente
                    </option>

                    {clientes.map((cliente) => (
                      <option
                        key={cliente.id}
                        value={cliente.id}
                      >
                        {cliente.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-xs text-slate-400">
                    Espacio *
                  </label>

                  <select
                    name="espacioId"
                    value={formulario.espacioId}
                    onChange={actualizarCampo}
                    className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#050d18] px-4 text-sm text-slate-300 outline-none focus:border-cyan-400/30"
                  >
                    <option value="">
                      Selecciona un espacio
                    </option>

                    {espacios.map((espacio) => (
                      <option
                        key={espacio.id}
                        value={espacio.id}
                      >
                        {espacio.nombre} · {espacio.tipo}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-xs text-slate-400">
                    Fecha *
                  </label>

                  <input
                    type="date"
                    name="fecha"
                    value={formulario.fecha}
                    onChange={actualizarCampo}
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
                    onChange={actualizarCampo}
                    className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#050d18] px-4 text-sm text-slate-300 outline-none focus:border-cyan-400/30"
                  >
                    {ESTADOS.map((estado) => (
                      <option
                        key={estado}
                        value={estado}
                      >
                        {estado}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-xs text-slate-400">
                    Hora de inicio *
                  </label>

                  <input
                    type="time"
                    name="horaInicio"
                    value={formulario.horaInicio}
                    onChange={actualizarCampo}
                    className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#050d18] px-4 text-sm outline-none focus:border-cyan-400/30"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs text-slate-400">
                    Hora de fin *
                  </label>

                  <input
                    type="time"
                    name="horaFin"
                    value={formulario.horaFin}
                    onChange={actualizarCampo}
                    className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#050d18] px-4 text-sm outline-none focus:border-cyan-400/30"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs text-slate-400">
                    Precio *
                  </label>

                  <div className="relative">
                    <DollarSign
                      size={15}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
                    />

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      name="precio"
                      value={formulario.precio}
                      onChange={actualizarCampo}
                      className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#050d18] pl-10 pr-4 text-sm outline-none focus:border-cyan-400/30"
                    />
                  </div>
                </div>

                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={comprobarDisponibilidad}
                    disabled={consultandoDisponibilidad}
                    className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-cyan-400/15 bg-cyan-400/[0.055] px-4 text-sm font-medium text-cyan-300 hover:bg-cyan-400/[0.09] disabled:opacity-50"
                  >
                    <Search size={16} />

                    {consultandoDisponibilidad
                      ? 'Consultando...'
                      : 'Comprobar disponibilidad'}
                  </button>
                </div>
              </div>

              {disponibilidad === true && (
                <div className="mt-5 flex items-center gap-3 rounded-xl border border-emerald-400/15 bg-emerald-400/[0.055] p-4 text-sm text-emerald-300">
                  <CheckCircle2 size={19} />
                  El espacio está disponible en este horario.
                </div>
              )}

              {disponibilidad === false && (
                <div className="mt-5 flex items-center gap-3 rounded-xl border border-red-400/15 bg-red-400/[0.055] p-4 text-sm text-red-300">
                  <XCircle size={19} />
                  El espacio no está disponible en este horario.
                </div>
              )}

              {errorFormulario && (
                <div className="mt-5 rounded-xl border border-red-400/10 bg-red-400/[0.05] px-4 py-3 text-xs leading-5 text-red-300">
                  {errorFormulario}
                </div>
              )}

              <div className="mt-7 flex flex-col-reverse gap-3 border-t border-white/[0.06] pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={cerrarFormulario}
                  disabled={guardando}
                  className="h-11 rounded-xl border border-white/[0.08] px-5 text-sm text-slate-400 hover:bg-white/[0.04]"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={guardando}
                  className="h-11 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-6 text-sm font-semibold text-[#04101c] disabled:opacity-60"
                >
                  {guardando
                    ? 'Guardando...'
                    : alquilerEditando
                      ? 'Guardar cambios'
                      : 'Registrar alquiler'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {alquilerDetalle && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div
            onClick={() =>
              setAlquilerDetalle(null)
            }
            className="absolute inset-0 bg-[#02060c]/85 backdrop-blur-sm"
          />

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.97,
              y: 15,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            className="relative z-10 w-full max-w-2xl rounded-[28px] border border-white/[0.08] bg-[#081321] p-7 shadow-2xl"
          >
            <button
              onClick={() =>
                setAlquilerDetalle(null)
              }
              className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-white/[0.05] hover:text-white"
            >
              <X size={18} />
            </button>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.06] text-cyan-300">
              <Building2 size={22} />
            </div>

            <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-400">
              Detalle del alquiler
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-semibold">
                ALQ-
                {String(
                  alquilerDetalle.id,
                ).padStart(4, '0')}
              </h2>

              <span
                className={`rounded-full border px-2.5 py-1 text-[10px] ${obtenerClaseEstado(
                  alquilerDetalle.estado,
                )}`}
              >
                {alquilerDetalle.estado}
              </span>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <DetalleCard
                icono={UserRound}
                titulo="Cliente"
                valor={
                  alquilerDetalle.cliente?.nombre ||
                  'Sin cliente'
                }
                secundario={
                  alquilerDetalle.cliente?.correo
                }
              />

              <DetalleCard
                icono={Building2}
                titulo="Espacio"
                valor={
                  alquilerDetalle.espacio?.nombre ||
                  'Sin espacio'
                }
                secundario={
                  alquilerDetalle.espacio?.tipo
                }
              />

              <DetalleCard
                icono={CalendarDays}
                titulo="Fecha"
                valor={formatoFecha(
                  alquilerDetalle.fecha,
                )}
              />

              <DetalleCard
                icono={Clock3}
                titulo="Horario"
                valor={`${formatoHora(
                  alquilerDetalle.horaInicio,
                )} — ${formatoHora(
                  alquilerDetalle.horaFin,
                )}`}
              />

              <DetalleCard
                icono={MapPin}
                titulo="Capacidad del espacio"
                valor={
                  alquilerDetalle.espacio?.capacidad
                    ? `${alquilerDetalle.espacio.capacidad} personas`
                    : 'No especificada'
                }
              />

              <DetalleCard
                icono={DollarSign}
                titulo="Precio"
                valor={formatoMoneda(
                  alquilerDetalle.precio,
                )}
                destacado
              />
            </div>
          </motion.div>
        </div>
      )}

      {alquilerEliminando && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div
            onClick={() =>
              !eliminando &&
              setAlquilerEliminando(null)
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
              ¿Eliminar alquiler?
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Se eliminará la reserva{' '}
              <span className="font-medium text-slate-300">
                ALQ-
                {String(
                  alquilerEliminando.id,
                ).padStart(4, '0')}
              </span>
              . Esta acción no se puede deshacer.
            </p>

            <div className="mt-7 flex gap-3">
              <button
                onClick={() =>
                  setAlquilerEliminando(null)
                }
                disabled={eliminando}
                className="h-11 flex-1 rounded-xl border border-white/[0.08] text-sm text-slate-400 hover:bg-white/[0.04]"
              >
                Cancelar
              </button>

              <button
                onClick={eliminarAlquiler}
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

function DetalleCard({
  icono: Icono,
  titulo,
  valor,
  secundario,
  destacado = false,
}) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        destacado
          ? 'border-cyan-400/10 bg-cyan-400/[0.035]'
          : 'border-white/[0.06] bg-[#050d18]'
      }`}
    >
      <Icono
        size={15}
        className="text-cyan-400"
      />

      <p className="mt-3 text-[10px] uppercase tracking-[0.12em] text-slate-600">
        {titulo}
      </p>

      <p
        className={`mt-1 text-sm ${
          destacado
            ? 'font-semibold text-cyan-300'
            : 'text-slate-300'
        }`}
      >
        {valor}
      </p>

      {secundario && (
        <p className="mt-1 text-[11px] text-slate-600">
          {secundario}
        </p>
      )}
    </div>
  )
}

export default Alquileres