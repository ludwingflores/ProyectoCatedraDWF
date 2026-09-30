import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  AlertTriangle,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ChefHat,
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
  UsersRound,
  UtensilsCrossed,
  X,
} from 'lucide-react'

import api from '../services/api'

const formularioVacio = {
  clienteId: '',
  servicioCateringId: '',
  numeroAsistentes: '',
  menu: '',
  fecha: '',
  hora: '',
  horaFin: '',
  lugar: '',
  estado: 'PENDIENTE',
}

function Catering() {
  const navigate = useNavigate()

  const [catering, setCatering] = useState([])
  const [clientes, setClientes] = useState([])
  const [servicios, setServicios] = useState([])

  const [busqueda, setBusqueda] = useState('')
  const [filtroTipo, setFiltroTipo] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('')

  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  const [menuAbierto, setMenuAbierto] = useState(null)

  const [modalFormulario, setModalFormulario] =
    useState(false)

  const [registroEditando, setRegistroEditando] =
    useState(null)

  const [registroDetalle, setRegistroDetalle] =
    useState(null)

  const [registroEliminando, setRegistroEliminando] =
    useState(null)

  const [formulario, setFormulario] =
    useState(formularioVacio)

  const [guardando, setGuardando] = useState(false)
  const [eliminando, setEliminando] = useState(false)

  const [errorFormulario, setErrorFormulario] =
    useState('')

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    try {
      setCargando(true)
      setError('')

      const [
        respuestaCatering,
        respuestaClientes,
        respuestaServicios,
      ] = await Promise.all([
        api.get('/catering'),
        api.get('/clientes'),
        api.get('/servicios-catering'),
      ])

      setCatering(respuestaCatering.data || [])
      setClientes(respuestaClientes.data || [])
      setServicios(respuestaServicios.data || [])
    } catch (err) {
      console.error('Error cargando catering:', err)

      setError(
        'No fue posible cargar la información de catering.',
      )
    } finally {
      setCargando(false)
    }
  }

  const serviciosDisponibles = useMemo(() => {
    return servicios.filter((servicio) => {
      if (servicio.activo) return true

      return (
        registroEditando?.servicioCatering?.id ===
        servicio.id
      )
    })
  }, [servicios, registroEditando])

  const tiposDisponibles = useMemo(() => {
    return [
      ...new Set(
        servicios
          .map((servicio) => servicio.tipo)
          .filter(Boolean),
      ),
    ]
  }, [servicios])

  const estadosDisponibles = useMemo(() => {
    const estadosBackend = catering
      .map((item) => item.estado)
      .filter(Boolean)

    const estadoActual = registroEditando?.estado

    return [
      ...new Set([
        'PENDIENTE',
        ...estadosBackend,
        ...(estadoActual ? [estadoActual] : []),
      ]),
    ]
  }, [catering, registroEditando])

  const registrosFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase()

    return catering.filter((item) => {
      const coincideTexto =
        !texto ||
        [
          item.id,
          item.cliente?.nombre,
          item.cliente?.correo,
          item.servicioCatering?.nombre,
          item.servicioCatering?.tipo,
          item.tipoServicio,
          item.menu,
          item.lugar,
          item.estado,
          item.fecha,
        ].some((valor) =>
          String(valor ?? '')
            .toLowerCase()
            .includes(texto),
        )

      const tipo =
        item.servicioCatering?.tipo ||
        item.tipoServicio ||
        ''

      const coincideTipo =
        !filtroTipo || tipo === filtroTipo

      const coincideEstado =
        !filtroEstado ||
        item.estado === filtroEstado

      return (
        coincideTexto &&
        coincideTipo &&
        coincideEstado
      )
    })
  }, [
    catering,
    busqueda,
    filtroTipo,
    filtroEstado,
  ])

  const estadisticas = useMemo(() => {
    const totalAsistentes = catering.reduce(
      (acumulado, item) =>
        acumulado +
        Number(item.numeroAsistentes || 0),
      0,
    )

    const costoTotal = catering.reduce(
      (acumulado, item) =>
        acumulado + Number(item.costo || 0),
      0,
    )

    return {
      total: catering.length,

      pendientes: catering.filter(
        (item) => item.estado === 'PENDIENTE',
      ).length,

      asistentes: totalAsistentes,

      costo: costoTotal,
    }
  }, [catering])

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

  const obtenerServicio = (id) =>
    servicios.find(
      (servicio) =>
        String(servicio.id) === String(id),
    )

  const servicioSeleccionado = obtenerServicio(
    formulario.servicioCateringId,
  )

  const costoEstimado =
    servicioSeleccionado &&
    Number(formulario.numeroAsistentes) > 0
      ? Number(
          servicioSeleccionado.precioPorPersona,
        ) * Number(formulario.numeroAsistentes)
      : 0

  const actualizarCampo = (event) => {
    const { name, value } = event.target

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }))

    setErrorFormulario('')
  }

  const abrirNuevo = () => {
    setRegistroEditando(null)
    setFormulario(formularioVacio)
    setErrorFormulario('')
    setModalFormulario(true)
  }

  const cerrarFormulario = () => {
    if (guardando) return

    setModalFormulario(false)
    setRegistroEditando(null)
    setFormulario(formularioVacio)
    setErrorFormulario('')
  }

  const abrirDetalle = async (registro) => {
    setMenuAbierto(null)

    try {
      const response = await api.get(
        `/catering/${registro.id}`,
      )

      setRegistroDetalle(response.data)
    } catch (err) {
      console.error(err)

      setError(
        'No fue posible consultar la solicitud de catering.',
      )
    }
  }

  const abrirEditar = async (registro) => {
    setMenuAbierto(null)

    try {
      const response = await api.get(
        `/catering/${registro.id}`,
      )

      const data = response.data

      setRegistroEditando(data)

      setFormulario({
        clienteId: data.cliente?.id
          ? String(data.cliente.id)
          : '',

        servicioCateringId:
          data.servicioCatering?.id
            ? String(data.servicioCatering.id)
            : '',

        numeroAsistentes:
          data.numeroAsistentes !== undefined &&
          data.numeroAsistentes !== null
            ? String(data.numeroAsistentes)
            : '',

        menu: data.menu || '',
        fecha: data.fecha || '',
        hora: formatoHora(data.hora),
        horaFin: formatoHora(data.horaFin),
        lugar: data.lugar || '',
        estado: data.estado || 'PENDIENTE',
      })

      setErrorFormulario('')
      setModalFormulario(true)
    } catch (err) {
      console.error(err)

      setError(
        'No fue posible cargar el catering para editar.',
      )
    }
  }

  const validarFormulario = () => {
    if (!formulario.servicioCateringId) {
      return 'Debes seleccionar un servicio de catering.'
    }

    if (
      !formulario.numeroAsistentes ||
      Number(formulario.numeroAsistentes) < 1
    ) {
      return 'El número de asistentes debe ser mayor o igual a 1.'
    }

    if (!formulario.menu.trim()) {
      return 'El menú es obligatorio.'
    }

    if (!formulario.fecha) {
      return 'La fecha es obligatoria.'
    }

    if (!formulario.hora || !formulario.horaFin) {
      return 'Debes indicar la hora de inicio y la hora de finalización.'
    }

    if (formulario.hora >= formulario.horaFin) {
      return 'La hora de finalización debe ser posterior a la hora de inicio.'
    }

    if (!formulario.lugar.trim()) {
      return 'El lugar es obligatorio.'
    }

    return ''
  }

  const construirPayload = () => {
    const cliente = clientes.find(
      (item) =>
        String(item.id) ===
        String(formulario.clienteId),
    )

    const servicio = obtenerServicio(
      formulario.servicioCateringId,
    )

    /*
     * precioPorPersona y costo NO se calculan como
     * autoridad del frontend.
     *
     * El backend es quien calcula/recalcula el costo
     * definitivo según su lógica.
     */
    return {
      cliente: cliente || null,
      servicioCatering: servicio,
      tipoServicio: servicio?.tipo || '',
      numeroAsistentes: Number(
        formulario.numeroAsistentes,
      ),
      precioPorPersona: Number(
        servicio?.precioPorPersona || 0,
      ),
      menu: formulario.menu.trim(),
      fecha: formulario.fecha,
      hora: formulario.hora,
      horaFin: formulario.horaFin,
      lugar: formulario.lugar.trim(),
      estado: formulario.estado,
    }
  }

  const guardarRegistro = async (event) => {
    event.preventDefault()

    const validacion = validarFormulario()

    if (validacion) {
      setErrorFormulario(validacion)
      return
    }

    try {
      setGuardando(true)
      setErrorFormulario('')

      const payload = construirPayload()

      if (registroEditando) {
        const response = await api.put(
          `/catering/${registroEditando.id}`,
          payload,
        )

        setCatering((anteriores) =>
          anteriores.map((item) =>
            item.id === registroEditando.id
              ? response.data
              : item,
          ),
        )
      } else {
        const response = await api.post(
          '/catering',
          payload,
        )

        setCatering((anteriores) => [
          ...anteriores,
          response.data,
        ])
      }

      setModalFormulario(false)
      setRegistroEditando(null)
      setFormulario(formularioVacio)
    } catch (err) {
      console.error(
        'Error guardando catering:',
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
          'No fue posible guardar la solicitud de catering. Verifica los datos ingresados.',
      )
    } finally {
      setGuardando(false)
    }
  }

  const eliminarRegistro = async () => {
    if (!registroEliminando) return

    try {
      setEliminando(true)

      await api.delete(
        `/catering/${registroEliminando.id}`,
      )

      setCatering((anteriores) =>
        anteriores.filter(
          (item) =>
            item.id !== registroEliminando.id,
        ),
      )

      setRegistroEliminando(null)
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
          'No fue posible eliminar la solicitud de catering.',
      )

      setRegistroEliminando(null)
    } finally {
      setEliminando(false)
    }
  }

  const claseEstado = (estado) => {
    const valor = String(estado || '').toUpperCase()

    if (
      valor.includes('APROB') ||
      valor.includes('CONFIRM')
    ) {
      return 'border-emerald-400/15 bg-emerald-400/[0.07] text-emerald-300'
    }

    if (
      valor.includes('CANCEL') ||
      valor.includes('RECHAZ')
    ) {
      return 'border-red-400/15 bg-red-400/[0.07] text-red-300'
    }

    if (
      valor.includes('FINAL') ||
      valor.includes('COMPLET')
    ) {
      return 'border-blue-400/15 bg-blue-400/[0.07] text-blue-300'
    }

    return 'border-amber-400/15 bg-amber-400/[0.07] text-amber-300'
  }

  return (
    <div className="min-h-screen bg-[#050b16] text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-cyan-400/[0.055] blur-[125px]" />
        <div className="absolute -bottom-40 left-1/4 h-[520px] w-[520px] rounded-full bg-blue-500/[0.045] blur-[130px]" />
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
                <ChefHat
                  size={15}
                  className="text-cyan-400"
                />

                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-400">
                  Servicios gastronómicos
                </p>
              </div>

              <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] md:text-4xl">
                Catering
              </h1>

              <p className="mt-2 max-w-2xl text-sm text-slate-500">
                Administra solicitudes, menús,
                asistentes y costos de catering.
              </p>
            </div>
          </div>

          <motion.button
            onClick={abrirNuevo}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 text-sm font-semibold text-[#04101c] shadow-[0_8px_30px_rgba(34,211,238,0.15)]"
          >
            <Plus size={18} />
            Nueva solicitud
          </motion.button>
        </motion.header>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: 'Solicitudes',
              valor: estadisticas.total,
              icono: ChefHat,
              tag: 'REGISTRADAS',
            },
            {
              label: 'Pendientes',
              valor: estadisticas.pendientes,
              icono: Clock3,
              tag: 'PENDIENTES',
            },
            {
              label: 'Total asistentes',
              valor: estadisticas.asistentes,
              icono: UsersRound,
              tag: 'PERSONAS',
            },
            {
              label: 'Valor registrado',
              valor: formatoMoneda(
                estadisticas.costo,
              ),
              icono: DollarSign,
              tag: 'TOTAL',
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
          <div className="border-b border-white/[0.06] p-5">
            <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
              <div>
                <h2 className="font-semibold">
                  Solicitudes de catering
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  {registrosFiltrados.length}{' '}
                  registros encontrados
                </p>
              </div>

              <div className="flex flex-col gap-3 md:flex-row">
                <div className="relative md:w-[330px]">
                  <Search
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
                  />

                  <input
                    value={busqueda}
                    onChange={(event) =>
                      setBusqueda(event.target.value)
                    }
                    placeholder="Buscar cliente, menú o lugar..."
                    className="h-11 w-full rounded-xl border border-white/[0.07] bg-[#050d18] pl-11 pr-4 text-sm outline-none placeholder:text-slate-700 focus:border-cyan-400/30"
                  />
                </div>

                <select
                  value={filtroTipo}
                  onChange={(event) =>
                    setFiltroTipo(
                      event.target.value,
                    )
                  }
                  className="h-11 rounded-xl border border-white/[0.07] bg-[#050d18] px-4 text-xs text-slate-400 outline-none focus:border-cyan-400/30"
                >
                  <option value="">
                    Todos los tipos
                  </option>

                  {tiposDisponibles.map((tipo) => (
                    <option key={tipo} value={tipo}>
                      {tipo}
                    </option>
                  ))}
                </select>

                <select
                  value={filtroEstado}
                  onChange={(event) =>
                    setFiltroEstado(
                      event.target.value,
                    )
                  }
                  className="h-11 rounded-xl border border-white/[0.07] bg-[#050d18] px-4 text-xs text-slate-400 outline-none focus:border-cyan-400/30"
                >
                  <option value="">
                    Todos los estados
                  </option>

                  {estadosDisponibles.map(
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
          </div>

          {cargando ? (
            <div className="flex min-h-[350px] items-center justify-center">
              <div className="text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-cyan-400/20 border-t-cyan-400" />

                <p className="mt-4 text-sm text-slate-500">
                  Cargando catering...
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="flex min-h-[350px] items-center justify-center px-6 text-center">
              <p className="text-sm text-red-300">
                {error}
              </p>
            </div>
          ) : registrosFiltrados.length === 0 ? (
            <div className="flex min-h-[350px] items-center justify-center">
              <div className="text-center">
                <ChefHat
                  size={36}
                  className="mx-auto text-cyan-400"
                />

                <p className="mt-4 text-sm">
                  No hay solicitudes para mostrar
                </p>

                <p className="mt-1 text-xs text-slate-600">
                  Registra un nuevo servicio de
                  catering.
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1250px]">
                <thead>
                  <tr className="border-b border-white/[0.055] text-left">
                    {[
                      'Solicitud',
                      'Cliente',
                      'Servicio',
                      'Asistentes',
                      'Fecha / hora',
                      'Lugar',
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
                  {registrosFiltrados.map(
                    (registro, index) => (
                      <motion.tr
                        key={registro.id}
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
                              <UtensilsCrossed
                                size={17}
                              />
                            </div>

                            <div>
                              <p className="text-sm font-medium text-slate-200">
                                CAT-
                                {String(
                                  registro.id,
                                ).padStart(4, '0')}
                              </p>

                              <p className="mt-1 text-[11px] text-slate-600">
                                Servicio de catering
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-5">
                          <p className="text-xs font-medium text-slate-300">
                            {registro.cliente?.nombre ||
                              'Sin cliente'}
                          </p>

                          <p className="mt-1 text-[11px] text-slate-600">
                            {registro.cliente?.correo ||
                              '—'}
                          </p>
                        </td>

                        <td className="px-5 py-5">
                          <p className="text-xs font-medium text-slate-300">
                            {registro.servicioCatering
                              ?.nombre ||
                              registro.tipoServicio ||
                              '—'}
                          </p>

                          <p className="mt-1 text-[11px] text-cyan-400/70">
                            {registro.servicioCatering
                              ?.tipo ||
                              registro.tipoServicio ||
                              '—'}
                          </p>
                        </td>

                        <td className="px-5 py-5">
                          <div className="flex items-center gap-2 text-xs text-slate-400">
                            <UsersRound size={14} />
                            {registro.numeroAsistentes}
                          </div>
                        </td>

                        <td className="px-5 py-5">
                          <p className="text-xs text-slate-300">
                            {formatoFecha(
                              registro.fecha,
                            )}
                          </p>

                          <p className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-600">
                            <Clock3 size={12} />
                            {formatoHora(
                              registro.hora,
                            )}
                            {' — '}
                            {formatoHora(
                              registro.horaFin,
                            )}
                          </p>
                        </td>

                        <td className="px-5 py-5">
                          <p className="max-w-[180px] truncate text-xs text-slate-400">
                            {registro.lugar || '—'}
                          </p>
                        </td>

                        <td className="px-5 py-5">
                          <p className="text-sm font-semibold text-cyan-300">
                            {formatoMoneda(
                              registro.costo,
                            )}
                          </p>

                          {registro.precioPorPersona !==
                            undefined &&
                            registro.precioPorPersona !==
                              null && (
                              <p className="mt-1 text-[10px] text-slate-600">
                                {formatoMoneda(
                                  registro.precioPorPersona,
                                )}{' '}
                                / persona
                              </p>
                            )}
                        </td>

                        <td className="px-5 py-5">
                          <span
                            className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-medium ${claseEstado(
                              registro.estado,
                            )}`}
                          >
                            {registro.estado ||
                              'SIN ESTADO'}
                          </span>
                        </td>

                        <td className="relative px-5 py-5 text-right">
                          <button
                            onClick={() =>
                              setMenuAbierto(
                                menuAbierto ===
                                  registro.id
                                  ? null
                                  : registro.id,
                              )
                            }
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 hover:bg-white/[0.04] hover:text-cyan-300"
                          >
                            <MoreHorizontal
                              size={18}
                            />
                          </button>

                          {menuAbierto ===
                            registro.id && (
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
                                    registro,
                                  )
                                }
                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-300 hover:bg-white/[0.05] hover:text-cyan-300"
                              >
                                <Eye size={14} />
                                Ver detalles
                              </button>

                              <button
                                onClick={() =>
                                  abrirEditar(
                                    registro,
                                  )
                                }
                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-300 hover:bg-white/[0.05] hover:text-cyan-300"
                              >
                                <Pencil size={14} />
                                Editar
                              </button>

                              <button
                                onClick={() => {
                                  setMenuAbierto(null)
                                  setRegistroEliminando(
                                    registro,
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
            className="relative z-10 max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-[28px] border border-white/[0.08] bg-[#081321] shadow-2xl"
          >
            <div className="flex items-start justify-between border-b border-white/[0.06] px-6 py-5">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-400">
                  Servicio gastronómico
                </p>

                <h2 className="mt-2 text-xl font-semibold">
                  {registroEditando
                    ? 'Editar catering'
                    : 'Nueva solicitud de catering'}
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
              onSubmit={guardarRegistro}
              className="p-6"
            >
              <div className="grid gap-5 md:grid-cols-2">
                <CampoSelect
                  label="Cliente"
                  name="clienteId"
                  value={formulario.clienteId}
                  onChange={actualizarCampo}
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
                </CampoSelect>

                <CampoSelect
                  label="Servicio de catering *"
                  name="servicioCateringId"
                  value={
                    formulario.servicioCateringId
                  }
                  onChange={actualizarCampo}
                >
                  <option value="">
                    Selecciona un servicio
                  </option>

                  {serviciosDisponibles.map(
                    (servicio) => (
                      <option
                        key={servicio.id}
                        value={servicio.id}
                      >
                        {servicio.nombre} ·{' '}
                        {servicio.tipo} ·{' '}
                        {formatoMoneda(
                          servicio.precioPorPersona,
                        )}
                        /persona
                      </option>
                    ),
                  )}
                </CampoSelect>

                <CampoInput
                  label="Número de asistentes *"
                  type="number"
                  min="1"
                  name="numeroAsistentes"
                  value={
                    formulario.numeroAsistentes
                  }
                  onChange={actualizarCampo}
                />

                <div>
                  <label className="mb-2 block text-xs text-slate-400">
                    Precio por persona
                  </label>

                  <div className="flex h-11 items-center rounded-xl border border-white/[0.07] bg-[#050d18] px-4">
                    <DollarSign
                      size={15}
                      className="mr-2 text-cyan-400"
                    />

                    <span className="text-sm text-slate-300">
                      {servicioSeleccionado
                        ? formatoMoneda(
                            servicioSeleccionado.precioPorPersona,
                          )
                        : 'Selecciona un servicio'}
                    </span>
                  </div>
                </div>

                <CampoInput
                  label="Fecha *"
                  type="date"
                  name="fecha"
                  value={formulario.fecha}
                  onChange={actualizarCampo}
                />

                <CampoSelect
                  label="Estado"
                  name="estado"
                  value={formulario.estado}
                  onChange={actualizarCampo}
                >
                  {estadosDisponibles.map(
                    (estado) => (
                      <option
                        key={estado}
                        value={estado}
                      >
                        {estado}
                      </option>
                    ),
                  )}
                </CampoSelect>

                <CampoInput
                  label="Hora de inicio *"
                  type="time"
                  name="hora"
                  value={formulario.hora}
                  onChange={actualizarCampo}
                />

                <CampoInput
                  label="Hora de finalización *"
                  type="time"
                  name="horaFin"
                  value={formulario.horaFin}
                  onChange={actualizarCampo}
                />

                <div className="md:col-span-2">
                  <CampoInput
                    label="Lugar *"
                    name="lugar"
                    value={formulario.lugar}
                    onChange={actualizarCampo}
                    placeholder="Ej. Salón principal"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-xs text-slate-400">
                    Menú *
                  </label>

                  <textarea
                    name="menu"
                    value={formulario.menu}
                    onChange={actualizarCampo}
                    rows={4}
                    placeholder="Describe el menú solicitado..."
                    className="w-full resize-none rounded-xl border border-white/[0.08] bg-[#050d18] px-4 py-3 text-sm text-slate-300 outline-none placeholder:text-slate-700 focus:border-cyan-400/30"
                  />
                </div>
              </div>

              {servicioSeleccionado &&
                Number(
                  formulario.numeroAsistentes,
                ) > 0 && (
                  <div className="mt-5 rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.035] p-5">
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-400">
                          Referencia de costo
                        </p>

                        <p className="mt-2 text-sm text-slate-400">
                          {
                            formulario.numeroAsistentes
                          }{' '}
                          personas ×{' '}
                          {formatoMoneda(
                            servicioSeleccionado.precioPorPersona,
                          )}
                        </p>
                      </div>

                      <div className="sm:text-right">
                        <p className="text-xs text-slate-600">
                          Estimación visual
                        </p>

                        <p className="mt-1 text-2xl font-semibold text-cyan-300">
                          {formatoMoneda(
                            costoEstimado,
                          )}
                        </p>
                      </div>
                    </div>

                    <p className="mt-3 text-[10px] leading-5 text-slate-600">
                      El costo definitivo será
                      calculado por el servidor al
                      guardar la solicitud.
                    </p>
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
                    : registroEditando
                      ? 'Guardar cambios'
                      : 'Registrar catering'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {registroDetalle && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div
            onClick={() =>
              setRegistroDetalle(null)
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
            className="relative z-10 max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[28px] border border-white/[0.08] bg-[#081321] p-7 shadow-2xl"
          >
            <button
              onClick={() =>
                setRegistroDetalle(null)
              }
              className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-white/[0.05] hover:text-white"
            >
              <X size={18} />
            </button>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.06] text-cyan-300">
              <ChefHat size={22} />
            </div>

            <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-400">
              Detalle de catering
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-semibold">
                CAT-
                {String(
                  registroDetalle.id,
                ).padStart(4, '0')}
              </h2>

              <span
                className={`rounded-full border px-2.5 py-1 text-[10px] ${claseEstado(
                  registroDetalle.estado,
                )}`}
              >
                {registroDetalle.estado ||
                  'SIN ESTADO'}
              </span>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <DetalleCard
                icono={UserRound}
                titulo="Cliente"
                valor={
                  registroDetalle.cliente?.nombre ||
                  'Sin cliente'
                }
                secundario={
                  registroDetalle.cliente?.correo
                }
              />

              <DetalleCard
                icono={UtensilsCrossed}
                titulo="Servicio"
                valor={
                  registroDetalle.servicioCatering
                    ?.nombre ||
                  registroDetalle.tipoServicio ||
                  '—'
                }
                secundario={
                  registroDetalle.servicioCatering
                    ?.tipo ||
                  registroDetalle.tipoServicio
                }
              />

              <DetalleCard
                icono={UsersRound}
                titulo="Asistentes"
                valor={`${registroDetalle.numeroAsistentes || 0} personas`}
              />

              <DetalleCard
                icono={DollarSign}
                titulo="Precio por persona"
                valor={formatoMoneda(
                  registroDetalle.precioPorPersona ??
                    registroDetalle
                      .servicioCatering
                      ?.precioPorPersona,
                )}
              />

              <DetalleCard
                icono={CalendarDays}
                titulo="Fecha"
                valor={formatoFecha(
                  registroDetalle.fecha,
                )}
              />

              <DetalleCard
                icono={Clock3}
                titulo="Horario"
                valor={`${formatoHora(
                  registroDetalle.hora,
                )} — ${formatoHora(
                  registroDetalle.horaFin,
                )}`}
              />

              <DetalleCard
                icono={MapPin}
                titulo="Lugar"
                valor={
                  registroDetalle.lugar || '—'
                }
              />

              <DetalleCard
                icono={DollarSign}
                titulo="Costo total"
                valor={formatoMoneda(
                  registroDetalle.costo,
                )}
                destacado
              />
            </div>

            <div className="mt-3 rounded-xl border border-white/[0.06] bg-[#050d18] p-4">
              <UtensilsCrossed
                size={15}
                className="text-cyan-400"
              />

              <p className="mt-3 text-[10px] uppercase tracking-[0.12em] text-slate-600">
                Menú
              </p>

              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-300">
                {registroDetalle.menu || '—'}
              </p>
            </div>
          </motion.div>
        </div>
      )}

      {registroEliminando && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div
            onClick={() =>
              !eliminando &&
              setRegistroEliminando(null)
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
              ¿Eliminar catering?
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Se eliminará la solicitud{' '}
              <span className="font-medium text-slate-300">
                CAT-
                {String(
                  registroEliminando.id,
                ).padStart(4, '0')}
              </span>
              . Esta acción no se puede deshacer.
            </p>

            <div className="mt-7 flex gap-3">
              <button
                onClick={() =>
                  setRegistroEliminando(null)
                }
                disabled={eliminando}
                className="h-11 flex-1 rounded-xl border border-white/[0.08] text-sm text-slate-400 hover:bg-white/[0.04]"
              >
                Cancelar
              </button>

              <button
                onClick={eliminarRegistro}
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

function CampoInput({
  label,
  name,
  value,
  onChange,
  type = 'text',
  placeholder = '',
  min,
}) {
  return (
    <div>
      <label className="mb-2 block text-xs text-slate-400">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#050d18] px-4 text-sm text-slate-300 outline-none placeholder:text-slate-700 focus:border-cyan-400/30"
      />
    </div>
  )
}

function CampoSelect({
  label,
  name,
  value,
  onChange,
  children,
}) {
  return (
    <div>
      <label className="mb-2 block text-xs text-slate-400">
        {label}
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#050d18] px-4 text-sm text-slate-300 outline-none focus:border-cyan-400/30"
      >
        {children}
      </select>
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

export default Catering