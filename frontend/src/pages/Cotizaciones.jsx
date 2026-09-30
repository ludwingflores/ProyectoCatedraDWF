import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  AlertTriangle,
  ArrowLeft,
  BadgeDollarSign,
  BookOpen,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChefHat,
  Clock3,
  Eye,
  FileText,
  GraduationCap,
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
  'EN_PROCESO',
  'APROBADA',
  'RECHAZADA',
]

const TIPOS_SERVICIO = [
  {
    value: 'CURSO',
    label: 'Curso',
  },
  {
    value: 'DIPLOMADO',
    label: 'Diplomado',
  },
  {
    value: 'ESPACIO',
    label: 'Espacio',
  },
  {
    value: 'CATERING',
    label: 'Catering',
  },
]

const formularioVacio = {
  clienteId: '',
  fecha: '',
  descripcion: '',
  estado: 'PENDIENTE',
  detalles: [],
}

const detalleVacio = () => ({
  tipoServicio: 'CURSO',
  servicioId: '',
  cantidad: 1,
})

function Cotizaciones() {
  const navigate = useNavigate()

  const [cotizaciones, setCotizaciones] = useState([])
  const [clientes, setClientes] = useState([])
  const [cursos, setCursos] = useState([])
  const [diplomados, setDiplomados] = useState([])
  const [espacios, setEspacios] = useState([])
  const [serviciosCatering, setServiciosCatering] = useState([])

  const [busqueda, setBusqueda] = useState('')
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  const [menuAbierto, setMenuAbierto] = useState(null)

  const [modalFormulario, setModalFormulario] = useState(false)
  const [cotizacionEditando, setCotizacionEditando] = useState(null)
  const [cotizacionDetalle, setCotizacionDetalle] = useState(null)
  const [cotizacionEliminando, setCotizacionEliminando] = useState(null)

  const [formulario, setFormulario] = useState(formularioVacio)

  const [guardando, setGuardando] = useState(false)
  const [eliminando, setEliminando] = useState(false)
  const [errorFormulario, setErrorFormulario] = useState('')

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    try {
      setCargando(true)
      setError('')

      const [
        respuestaCotizaciones,
        respuestaClientes,
        respuestaCursos,
        respuestaDiplomados,
        respuestaEspacios,
        respuestaCatering,
      ] = await Promise.all([
        api.get('/cotizaciones'),
        api.get('/clientes'),
        api.get('/cursos'),
        api.get('/diplomados'),
        api.get('/espacios'),
        api.get('/servicios-catering'),
      ])

      setCotizaciones(respuestaCotizaciones.data || [])
      setClientes(respuestaClientes.data || [])
      setCursos(respuestaCursos.data || [])
      setDiplomados(respuestaDiplomados.data || [])
      setEspacios(respuestaEspacios.data || [])
      setServiciosCatering(respuestaCatering.data || [])
    } catch (err) {
      console.error('Error al cargar cotizaciones:', err)

      setError(
        'No fue posible cargar la información de cotizaciones.',
      )
    } finally {
      setCargando(false)
    }
  }

  const cotizacionesFiltradas = useMemo(() => {
    const texto = busqueda.trim().toLowerCase()

    if (!texto) return cotizaciones

    return cotizaciones.filter((cotizacion) =>
      [
        cotizacion.id,
        cotizacion.cliente?.nombre,
        cotizacion.cliente?.correo,
        cotizacion.descripcion,
        cotizacion.estado,
        cotizacion.fecha,
      ].some((valor) =>
        String(valor ?? '')
          .toLowerCase()
          .includes(texto),
      ),
    )
  }, [cotizaciones, busqueda])

  const estadisticas = useMemo(() => {
    return {
      total: cotizaciones.length,

      pendientes: cotizaciones.filter(
        (item) => item.estado === 'PENDIENTE',
      ).length,

      proceso: cotizaciones.filter(
        (item) => item.estado === 'EN_PROCESO',
      ).length,

      aprobadas: cotizaciones.filter(
        (item) => item.estado === 'APROBADA',
      ).length,
    }
  }, [cotizaciones])

  const obtenerCatalogo = (tipo) => {
    switch (tipo) {
      case 'CURSO':
        return cursos.filter((item) => item.activo)

      case 'DIPLOMADO':
        return diplomados.filter((item) => item.activo)

      case 'ESPACIO':
        return espacios.filter((item) => item.disponible)

      case 'CATERING':
        return serviciosCatering.filter((item) => item.activo)

      default:
        return []
    }
  }

  const obtenerServicio = (tipo, id) => {
    const coleccion =
      tipo === 'CURSO'
        ? cursos
        : tipo === 'DIPLOMADO'
          ? diplomados
          : tipo === 'ESPACIO'
            ? espacios
            : tipo === 'CATERING'
              ? serviciosCatering
              : []

    return coleccion.find(
      (item) => String(item.id) === String(id),
    )
  }

  const obtenerPrecioServicio = (tipo, id) => {
    const servicio = obtenerServicio(tipo, id)

    if (!servicio) return 0

    switch (tipo) {
      case 'CURSO':
      case 'DIPLOMADO':
        return Number(servicio.costo || 0)

      case 'ESPACIO':
        return Number(servicio.precio || 0)

      case 'CATERING':
        return Number(servicio.precioPorPersona || 0)

      default:
        return 0
    }
  }

  const obtenerNombreServicio = (tipo, id) => {
    const servicio = obtenerServicio(tipo, id)

    return servicio?.nombre || 'Servicio no disponible'
  }

  const obtenerDescripcionServicio = (tipo, id) => {
    const servicio = obtenerServicio(tipo, id)

    if (!servicio) return ''

    switch (tipo) {
      case 'CURSO':
      case 'DIPLOMADO':
        return servicio.descripcion || servicio.nombre

      case 'ESPACIO':
        return `${servicio.nombre}${
          servicio.tipo ? ` · ${servicio.tipo}` : ''
        }`

      case 'CATERING':
        return `${servicio.nombre}${
          servicio.tipo ? ` · ${servicio.tipo}` : ''
        }`

      default:
        return servicio.nombre || ''
    }
  }

  const calcularDetalle = (detalle) => {
    const precioUnitario = obtenerPrecioServicio(
      detalle.tipoServicio,
      detalle.servicioId,
    )

    const cantidad = Math.max(
      1,
      Number(detalle.cantidad) || 1,
    )

    return {
      precioUnitario,
      subtotal: precioUnitario * cantidad,
    }
  }

  const totalFormulario = useMemo(() => {
    return formulario.detalles.reduce((total, detalle) => {
      return total + calcularDetalle(detalle).subtotal
    }, 0)
  }, [
    formulario.detalles,
    cursos,
    diplomados,
    espacios,
    serviciosCatering,
  ])

  const formatoMoneda = (valor) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(Number(valor || 0))
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

  const actualizarCampo = (event) => {
    const { name, value } = event.target

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }))
  }

  const agregarDetalle = () => {
    setFormulario((anterior) => ({
      ...anterior,
      detalles: [
        ...anterior.detalles,
        detalleVacio(),
      ],
    }))
  }

  const eliminarDetalle = (indice) => {
    setFormulario((anterior) => ({
      ...anterior,
      detalles: anterior.detalles.filter(
        (_, index) => index !== indice,
      ),
    }))
  }

  const actualizarDetalle = (indice, campo, valor) => {
    setFormulario((anterior) => ({
      ...anterior,

      detalles: anterior.detalles.map((detalle, index) => {
        if (index !== indice) return detalle

        if (campo === 'tipoServicio') {
          return {
            ...detalle,
            tipoServicio: valor,
            servicioId: '',
          }
        }

        return {
          ...detalle,
          [campo]: valor,
        }
      }),
    }))
  }

  const limpiarFormulario = () => {
    setFormulario(formularioVacio)
    setCotizacionEditando(null)
    setErrorFormulario('')
  }

  const abrirNuevaCotizacion = () => {
    setCotizacionEditando(null)

    setFormulario({
      ...formularioVacio,
      detalles: [detalleVacio()],
    })

    setErrorFormulario('')
    setModalFormulario(true)
  }

  const cerrarFormulario = () => {
    if (guardando) return

    setModalFormulario(false)
    limpiarFormulario()
  }

  const abrirEditar = async (cotizacion) => {
    setMenuAbierto(null)

    try {
      const response = await api.get(
        `/cotizaciones/${cotizacion.id}`,
      )

      const data = response.data

      setCotizacionEditando(data)

      setFormulario({
        clienteId: data.cliente?.id
          ? String(data.cliente.id)
          : '',

        fecha: data.fecha || '',

        descripcion: data.descripcion || '',

        estado: data.estado || 'PENDIENTE',

        detalles:
          data.detalles?.length > 0
            ? data.detalles.map((detalle) => ({
                id: detalle.id,
                tipoServicio:
                  detalle.tipoServicio || 'CURSO',
                servicioId: detalle.servicioId
                  ? String(detalle.servicioId)
                  : '',
                cantidad: detalle.cantidad || 1,
              }))
            : [detalleVacio()],
      })

      setErrorFormulario('')
      setModalFormulario(true)
    } catch (err) {
      console.error(
        'Error al cargar cotización:',
        err,
      )

      setError(
        'No fue posible cargar la cotización para editar.',
      )
    }
  }

  const abrirDetalle = async (cotizacion) => {
    setMenuAbierto(null)

    try {
      const response = await api.get(
        `/cotizaciones/${cotizacion.id}`,
      )

      setCotizacionDetalle(response.data)
    } catch (err) {
      console.error(
        'Error al consultar cotización:',
        err,
      )

      setError(
        'No fue posible consultar el detalle de la cotización.',
      )
    }
  }

  const construirPayload = () => {
    const cliente = clientes.find(
      (item) =>
        String(item.id) === String(formulario.clienteId),
    )

    const detalles = formulario.detalles.map((detalle) => {
      const calculo = calcularDetalle(detalle)

      return {
        ...(detalle.id ? { id: detalle.id } : {}),

        tipoServicio: detalle.tipoServicio,

        servicioId: Number(detalle.servicioId),

        descripcion: obtenerDescripcionServicio(
          detalle.tipoServicio,
          detalle.servicioId,
        ),

        cantidad: Number(detalle.cantidad),

        precioUnitario: calculo.precioUnitario,

        subtotal: calculo.subtotal,
      }
    })

    return {
      cliente: cliente || null,
      fecha: formulario.fecha,
      descripcion: formulario.descripcion.trim(),
      monto: detalles.reduce(
        (total, detalle) =>
          total + Number(detalle.subtotal || 0),
        0,
      ),
      estado: formulario.estado,
      detalles,
    }
  }

  const validarFormulario = () => {
    if (!formulario.clienteId) {
      return 'Debes seleccionar un cliente.'
    }

    if (!formulario.fecha) {
      return 'La fecha de la cotización es obligatoria.'
    }

    if (!ESTADOS.includes(formulario.estado)) {
      return 'El estado seleccionado no es válido.'
    }

    if (formulario.detalles.length === 0) {
      return 'Debes agregar al menos un servicio.'
    }

    for (let i = 0; i < formulario.detalles.length; i += 1) {
      const detalle = formulario.detalles[i]

      if (!detalle.tipoServicio) {
        return `Selecciona el tipo de servicio en la línea ${i + 1}.`
      }

      if (!detalle.servicioId) {
        return `Selecciona un servicio en la línea ${i + 1}.`
      }

      if (
        !Number.isInteger(Number(detalle.cantidad)) ||
        Number(detalle.cantidad) < 1
      ) {
        return `La cantidad de la línea ${i + 1} debe ser al menos 1.`
      }
    }

    return ''
  }

  const guardarCotizacion = async (event) => {
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

      if (cotizacionEditando) {
        const response = await api.put(
          `/cotizaciones/${cotizacionEditando.id}`,
          payload,
        )

        setCotizaciones((anteriores) =>
          anteriores.map((cotizacion) =>
            cotizacion.id === cotizacionEditando.id
              ? response.data
              : cotizacion,
          ),
        )
      } else {
        const response = await api.post(
          '/cotizaciones',
          payload,
        )

        setCotizaciones((anteriores) => [
          ...anteriores,
          response.data,
        ])
      }

      setModalFormulario(false)
      limpiarFormulario()
    } catch (err) {
      console.error(
        'Error al guardar cotización:',
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
          'No fue posible guardar la cotización. Verifica los servicios y los datos ingresados.',
      )
    } finally {
      setGuardando(false)
    }
  }

  const eliminarCotizacion = async () => {
    if (!cotizacionEliminando) return

    try {
      setEliminando(true)

      await api.delete(
        `/cotizaciones/${cotizacionEliminando.id}`,
      )

      setCotizaciones((anteriores) =>
        anteriores.filter(
          (cotizacion) =>
            cotizacion.id !== cotizacionEliminando.id,
        ),
      )

      setCotizacionEliminando(null)
    } catch (err) {
      console.error(
        'Error al eliminar cotización:',
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
          'No fue posible eliminar la cotización.',
      )

      setCotizacionEliminando(null)
    } finally {
      setEliminando(false)
    }
  }

  const obtenerClaseEstado = (estado) => {
    switch (estado) {
      case 'APROBADA':
        return 'border-emerald-400/15 bg-emerald-400/[0.07] text-emerald-300'

      case 'RECHAZADA':
        return 'border-red-400/15 bg-red-400/[0.07] text-red-300'

      case 'EN_PROCESO':
        return 'border-blue-400/15 bg-blue-400/[0.07] text-blue-300'

      default:
        return 'border-amber-400/15 bg-amber-400/[0.07] text-amber-300'
    }
  }

  const iconoTipoServicio = (tipo) => {
    switch (tipo) {
      case 'CURSO':
        return BookOpen

      case 'DIPLOMADO':
        return GraduationCap

      case 'ESPACIO':
        return Building2

      case 'CATERING':
        return ChefHat

      default:
        return FileText
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
                <FileText
                  size={15}
                  className="text-cyan-400"
                />

                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-400">
                  Gestión comercial
                </p>
              </div>

              <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] md:text-4xl">
                Cotizaciones
              </h1>

              <p className="mt-2 max-w-2xl text-sm text-slate-500">
                Construye propuestas con múltiples
                servicios y controla su proceso de
                aprobación.
              </p>
            </div>
          </div>

          <motion.button
            onClick={abrirNuevaCotizacion}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 text-sm font-semibold text-[#04101c] shadow-[0_8px_30px_rgba(34,211,238,0.15)]"
          >
            <Plus size={18} />
            Nueva cotización
          </motion.button>
        </motion.header>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: 'Total cotizaciones',
              valor: estadisticas.total,
              icono: FileText,
              texto: 'REGISTRADAS',
            },
            {
              label: 'Pendientes',
              valor: estadisticas.pendientes,
              icono: Clock3,
              texto: 'PENDIENTES',
            },
            {
              label: 'En proceso',
              valor: estadisticas.proceso,
              icono: BadgeDollarSign,
              texto: 'EN PROCESO',
            },
            {
              label: 'Aprobadas',
              valor: estadisticas.aprobadas,
              icono: CheckCircle2,
              texto: 'APROBADAS',
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
                    {item.texto}
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
                Historial de cotizaciones
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                {cotizacionesFiltradas.length} registros encontrados
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
                placeholder="Buscar cliente, estado o descripción..."
                className="h-11 w-full rounded-xl border border-white/[0.07] bg-[#050d18] pl-11 pr-4 text-sm outline-none placeholder:text-slate-700 focus:border-cyan-400/30"
              />
            </div>
          </div>

          {cargando ? (
            <div className="flex min-h-[350px] items-center justify-center">
              <div className="text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-cyan-400/20 border-t-cyan-400" />

                <p className="mt-4 text-sm text-slate-500">
                  Cargando cotizaciones...
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="flex min-h-[350px] items-center justify-center px-6 text-center">
              <p className="text-sm text-red-300">
                {error}
              </p>
            </div>
          ) : cotizacionesFiltradas.length === 0 ? (
            <div className="flex min-h-[350px] items-center justify-center">
              <div className="text-center">
                <FileText
                  size={32}
                  className="mx-auto text-cyan-400"
                />

                <p className="mt-4 text-sm">
                  No encontramos cotizaciones
                </p>

                <p className="mt-1 text-xs text-slate-600">
                  Crea una nueva propuesta o cambia tu búsqueda.
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px] border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.055] text-left">
                    {[
                      'Cotización',
                      'Cliente',
                      'Fecha',
                      'Servicios',
                      'Monto',
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
                  {cotizacionesFiltradas.map(
                    (cotizacion, index) => (
                      <motion.tr
                        key={cotizacion.id}
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
                              <FileText size={18} />
                            </div>

                            <div>
                              <p className="text-sm font-medium text-slate-200">
                                COT-
                                {String(
                                  cotizacion.id,
                                ).padStart(4, '0')}
                              </p>

                              <p className="mt-1 max-w-[210px] truncate text-[11px] text-slate-600">
                                {cotizacion.descripcion ||
                                  'Sin descripción'}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-5">
                          <p className="text-xs font-medium text-slate-300">
                            {cotizacion.cliente?.nombre ||
                              'Sin cliente'}
                          </p>

                          <p className="mt-1 text-[11px] text-slate-600">
                            {cotizacion.cliente?.correo ||
                              'Sin correo'}
                          </p>
                        </td>

                        <td className="px-5 py-5">
                          <div className="flex items-center gap-2 text-xs text-slate-400">
                            <CalendarDays size={13} />
                            {formatoFecha(cotizacion.fecha)}
                          </div>
                        </td>

                        <td className="px-5 py-5">
                          <span className="rounded-full border border-white/[0.07] bg-white/[0.025] px-2.5 py-1 text-[10px] text-slate-400">
                            {cotizacion.detalles?.length || 0}{' '}
                            servicio
                            {(cotizacion.detalles?.length || 0) === 1
                              ? ''
                              : 's'}
                          </span>
                        </td>

                        <td className="px-5 py-5">
                          <p className="text-sm font-semibold text-cyan-300">
                            {formatoMoneda(cotizacion.monto)}
                          </p>
                        </td>

                        <td className="px-5 py-5">
                          <span
                            className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-medium ${obtenerClaseEstado(
                              cotizacion.estado,
                            )}`}
                          >
                            {cotizacion.estado}
                          </span>
                        </td>

                        <td className="relative px-5 py-5 text-right">
                          <button
                            onClick={() =>
                              setMenuAbierto(
                                menuAbierto === cotizacion.id
                                  ? null
                                  : cotizacion.id,
                              )
                            }
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition hover:bg-white/[0.04] hover:text-cyan-300"
                          >
                            <MoreHorizontal size={18} />
                          </button>

                          {menuAbierto === cotizacion.id && (
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
                                  abrirDetalle(cotizacion)
                                }
                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-300 hover:bg-white/[0.05] hover:text-cyan-300"
                              >
                                <Eye size={14} />
                                Ver detalles
                              </button>

                              <button
                                onClick={() =>
                                  abrirEditar(cotizacion)
                                }
                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-300 hover:bg-white/[0.05] hover:text-cyan-300"
                              >
                                <Pencil size={14} />
                                Editar
                              </button>

                              <button
                                onClick={() => {
                                  setMenuAbierto(null)
                                  setCotizacionEliminando(
                                    cotizacion,
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

        <footer className="mt-8 flex flex-col justify-between gap-2 border-t border-white/[0.05] py-6 text-[11px] text-slate-600 sm:flex-row">
          <p>
            Centro de Formación Continua · Gestión de Cotizaciones
          </p>
          <p>UCA · 2026</p>
        </footer>
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
            className="relative z-10 max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-[28px] border border-white/[0.08] bg-[#081321] shadow-2xl"
          >
            <div className="sticky top-0 z-20 flex items-start justify-between border-b border-white/[0.06] bg-[#081321]/95 px-6 py-5 backdrop-blur-xl md:px-7">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-400">
                  Generador de propuesta
                </p>

                <h2 className="mt-2 text-xl font-semibold">
                  {cotizacionEditando
                    ? 'Editar cotización'
                    : 'Nueva cotización'}
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Agrega uno o varios servicios a la propuesta.
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
              onSubmit={guardarCotizacion}
              className="p-6 md:p-7"
            >
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs text-slate-400">
                    Cliente *
                  </label>

                  <select
                    name="clienteId"
                    value={formulario.clienteId}
                    onChange={actualizarCampo}
                    className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#050d18] px-4 text-sm text-slate-300 outline-none focus:border-cyan-400/30"
                  >
                    <option value="">
                      Selecciona un cliente
                    </option>

                    {clientes.map((cliente) => (
                      <option
                        key={cliente.id}
                        value={cliente.id}
                      >
                        {cliente.nombre}
                        {cliente.correo
                          ? ` · ${cliente.correo}`
                          : ''}
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
                    Descripción
                  </label>

                  <input
                    name="descripcion"
                    value={formulario.descripcion}
                    onChange={actualizarCampo}
                    maxLength={500}
                    placeholder="Ej. Propuesta para capacitación empresarial"
                    className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#050d18] px-4 text-sm outline-none placeholder:text-slate-700 focus:border-cyan-400/30"
                  />
                </div>
              </div>

              <div className="mt-8 flex flex-col justify-between gap-4 border-t border-white/[0.06] pt-6 sm:flex-row sm:items-center">
                <div>
                  <h3 className="text-sm font-semibold">
                    Servicios de la cotización
                  </h3>

                  <p className="mt-1 text-xs text-slate-600">
                    Cursos, diplomados, espacios o catering.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={agregarDetalle}
                  className="flex h-10 items-center justify-center gap-2 rounded-xl border border-cyan-400/15 bg-cyan-400/[0.055] px-4 text-xs font-medium text-cyan-300 hover:bg-cyan-400/[0.09]"
                >
                  <Plus size={15} />
                  Agregar servicio
                </button>
              </div>

              <div className="mt-5 space-y-4">
                {formulario.detalles.map(
                  (detalle, indice) => {
                    const calculo =
                      calcularDetalle(detalle)

                    const Icono =
                      iconoTipoServicio(
                        detalle.tipoServicio,
                      )

                    const catalogo =
                      obtenerCatalogo(
                        detalle.tipoServicio,
                      )

                    const servicioSeleccionado =
                      obtenerServicio(
                        detalle.tipoServicio,
                        detalle.servicioId,
                      )

                    if (
                      servicioSeleccionado &&
                      !catalogo.some(
                        (item) =>
                          String(item.id) ===
                          String(detalle.servicioId),
                      )
                    ) {
                      catalogo.push(
                        servicioSeleccionado,
                      )
                    }

                    return (
                      <motion.div
                        key={
                          detalle.id ||
                          `detalle-${indice}`
                        }
                        initial={{
                          opacity: 0,
                          y: 8,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        className="rounded-2xl border border-white/[0.07] bg-[#050d18] p-5"
                      >
                        <div className="mb-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-400/10 bg-cyan-400/[0.055] text-cyan-300">
                              <Icono size={17} />
                            </div>

                            <div>
                              <p className="text-xs font-medium text-slate-300">
                                Servicio{' '}
                                {indice + 1}
                              </p>

                              <p className="mt-0.5 text-[10px] text-slate-600">
                                {
                                  detalle.tipoServicio
                                }
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              eliminarDetalle(
                                indice,
                              )
                            }
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 hover:bg-red-400/[0.07] hover:text-red-300"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>

                        <div className="grid gap-4 lg:grid-cols-[1fr_1.6fr_0.65fr_0.85fr_0.9fr]">
                          <div>
                            <label className="mb-2 block text-[10px] uppercase tracking-[0.12em] text-slate-600">
                              Tipo
                            </label>

                            <select
                              value={
                                detalle.tipoServicio
                              }
                              onChange={(event) =>
                                actualizarDetalle(
                                  indice,
                                  'tipoServicio',
                                  event.target
                                    .value,
                                )
                              }
                              className="h-10 w-full rounded-lg border border-white/[0.07] bg-[#081321] px-3 text-xs text-slate-300 outline-none focus:border-cyan-400/30"
                            >
                              {TIPOS_SERVICIO.map(
                                (tipo) => (
                                  <option
                                    key={
                                      tipo.value
                                    }
                                    value={
                                      tipo.value
                                    }
                                  >
                                    {
                                      tipo.label
                                    }
                                  </option>
                                ),
                              )}
                            </select>
                          </div>

                          <div>
                            <label className="mb-2 block text-[10px] uppercase tracking-[0.12em] text-slate-600">
                              Servicio
                            </label>

                            <select
                              value={
                                detalle.servicioId
                              }
                              onChange={(event) =>
                                actualizarDetalle(
                                  indice,
                                  'servicioId',
                                  event.target
                                    .value,
                                )
                              }
                              className="h-10 w-full rounded-lg border border-white/[0.07] bg-[#081321] px-3 text-xs text-slate-300 outline-none focus:border-cyan-400/30"
                            >
                              <option value="">
                                Seleccionar
                              </option>

                              {catalogo.map(
                                (servicio) => (
                                  <option
                                    key={
                                      servicio.id
                                    }
                                    value={
                                      servicio.id
                                    }
                                  >
                                    {
                                      servicio.nombre
                                    }
                                  </option>
                                ),
                              )}
                            </select>
                          </div>

                          <div>
                            <label className="mb-2 block text-[10px] uppercase tracking-[0.12em] text-slate-600">
                              Cantidad
                            </label>

                            <input
                              type="number"
                              min="1"
                              step="1"
                              value={
                                detalle.cantidad
                              }
                              onChange={(event) =>
                                actualizarDetalle(
                                  indice,
                                  'cantidad',
                                  event.target
                                    .value,
                                )
                              }
                              className="h-10 w-full rounded-lg border border-white/[0.07] bg-[#081321] px-3 text-xs outline-none focus:border-cyan-400/30"
                            />
                          </div>

                          <div>
                            <label className="mb-2 block text-[10px] uppercase tracking-[0.12em] text-slate-600">
                              Precio
                            </label>

                            <div className="flex h-10 items-center rounded-lg border border-white/[0.05] bg-white/[0.02] px-3 text-xs text-slate-400">
                              {formatoMoneda(
                                calculo.precioUnitario,
                              )}
                            </div>
                          </div>

                          <div>
                            <label className="mb-2 block text-[10px] uppercase tracking-[0.12em] text-slate-600">
                              Subtotal
                            </label>

                            <div className="flex h-10 items-center rounded-lg border border-cyan-400/10 bg-cyan-400/[0.035] px-3 text-xs font-semibold text-cyan-300">
                              {formatoMoneda(
                                calculo.subtotal,
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )
                  },
                )}
              </div>

              <div className="mt-6 flex justify-end">
                <div className="w-full rounded-2xl border border-cyan-400/10 bg-gradient-to-br from-cyan-400/[0.055] to-blue-500/[0.025] p-5 sm:w-[340px]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      Servicios
                    </span>

                    <span className="text-xs text-slate-300">
                      {formulario.detalles.length}
                    </span>
                  </div>

                  <div className="mt-4 flex items-end justify-between border-t border-white/[0.06] pt-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.15em] text-cyan-400">
                        Total cotización
                      </p>

                      <p className="mt-1 text-xs text-slate-600">
                        Total estimado
                      </p>
                    </div>

                    <p className="text-2xl font-semibold tracking-tight text-cyan-300">
                      {formatoMoneda(
                        totalFormulario,
                      )}
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
                    guardando
                      ? {}
                      : { scale: 0.98 }
                  }
                  className="h-11 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-6 text-sm font-semibold text-[#04101c] disabled:opacity-60"
                >
                  {guardando
                    ? 'Guardando...'
                    : cotizacionEditando
                      ? 'Guardar cambios'
                      : 'Generar cotización'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {cotizacionDetalle && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div
            onClick={() =>
              setCotizacionDetalle(null)
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
                setCotizacionDetalle(null)
              }
              className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-white/[0.05] hover:text-white"
            >
              <X size={18} />
            </button>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.06] text-cyan-300">
              <FileText size={22} />
            </div>

            <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-400">
              Detalle de cotización
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-semibold">
                COT-
                {String(
                  cotizacionDetalle.id,
                ).padStart(4, '0')}
              </h2>

              <span
                className={`rounded-full border px-2.5 py-1 text-[10px] font-medium ${obtenerClaseEstado(
                  cotizacionDetalle.estado,
                )}`}
              >
                {cotizacionDetalle.estado}
              </span>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-white/[0.06] bg-[#050d18] p-4">
                <UserRound
                  size={15}
                  className="text-cyan-400"
                />

                <p className="mt-3 text-[10px] uppercase tracking-[0.12em] text-slate-600">
                  Cliente
                </p>

                <p className="mt-1 text-sm text-slate-300">
                  {cotizacionDetalle.cliente
                    ?.nombre || 'Sin cliente'}
                </p>

                <p className="mt-1 text-[11px] text-slate-600">
                  {cotizacionDetalle.cliente
                    ?.correo || ''}
                </p>
              </div>

              <div className="rounded-xl border border-white/[0.06] bg-[#050d18] p-4">
                <CalendarDays
                  size={15}
                  className="text-cyan-400"
                />

                <p className="mt-3 text-[10px] uppercase tracking-[0.12em] text-slate-600">
                  Fecha
                </p>

                <p className="mt-1 text-sm text-slate-300">
                  {formatoFecha(
                    cotizacionDetalle.fecha,
                  )}
                </p>
              </div>

              <div className="rounded-xl border border-cyan-400/10 bg-cyan-400/[0.035] p-4">
                <BadgeDollarSign
                  size={15}
                  className="text-cyan-400"
                />

                <p className="mt-3 text-[10px] uppercase tracking-[0.12em] text-slate-600">
                  Monto total
                </p>

                <p className="mt-1 text-lg font-semibold text-cyan-300">
                  {formatoMoneda(
                    cotizacionDetalle.monto,
                  )}
                </p>
              </div>
            </div>

            {cotizacionDetalle.descripcion && (
              <div className="mt-4 rounded-xl border border-white/[0.06] bg-[#050d18] p-4">
                <p className="text-[10px] uppercase tracking-[0.12em] text-slate-600">
                  Descripción
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {cotizacionDetalle.descripcion}
                </p>
              </div>
            )}

            <div className="mt-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">
                  Servicios incluidos
                </h3>

                <span className="text-xs text-slate-600">
                  {cotizacionDetalle.detalles?.length ||
                    0}{' '}
                  servicios
                </span>
              </div>

              <div className="mt-3 space-y-3">
                {cotizacionDetalle.detalles?.map(
                  (detalle, indice) => {
                    const Icono =
                      iconoTipoServicio(
                        detalle.tipoServicio,
                      )

                    return (
                      <div
                        key={
                          detalle.id ||
                          indice
                        }
                        className="flex flex-col justify-between gap-4 rounded-xl border border-white/[0.06] bg-[#050d18] p-4 sm:flex-row sm:items-center"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/[0.05] text-cyan-300">
                            <Icono size={17} />
                          </div>

                          <div>
                            <p className="text-sm font-medium text-slate-300">
                              {obtenerNombreServicio(
                                detalle.tipoServicio,
                                detalle.servicioId,
                              )}
                            </p>

                            <p className="mt-1 text-[11px] text-slate-600">
                              {
                                detalle.tipoServicio
                              }{' '}
                              · Cantidad{' '}
                              {detalle.cantidad}
                            </p>
                          </div>
                        </div>

                        <div className="text-left sm:text-right">
                          <p className="text-[10px] text-slate-600">
                            {formatoMoneda(
                              detalle.precioUnitario,
                            )}{' '}
                            c/u
                          </p>

                          <p className="mt-1 text-sm font-semibold text-cyan-300">
                            {formatoMoneda(
                              detalle.subtotal,
                            )}
                          </p>
                        </div>
                      </div>
                    )
                  },
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {cotizacionEliminando && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div
            onClick={() =>
              !eliminando &&
              setCotizacionEliminando(null)
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
              ¿Eliminar cotización?
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Se eliminará{' '}
              <span className="font-medium text-slate-300">
                COT-
                {String(
                  cotizacionEliminando.id,
                ).padStart(4, '0')}
              </span>{' '}
              y sus detalles asociados. Esta acción
              no se puede deshacer.
            </p>

            <div className="mt-7 flex gap-3">
              <button
                onClick={() =>
                  setCotizacionEliminando(null)
                }
                disabled={eliminando}
                className="h-11 flex-1 rounded-xl border border-white/[0.08] text-sm text-slate-400 hover:bg-white/[0.04] disabled:opacity-50"
              >
                Cancelar
              </button>

              <button
                onClick={eliminarCotizacion}
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

export default Cotizaciones