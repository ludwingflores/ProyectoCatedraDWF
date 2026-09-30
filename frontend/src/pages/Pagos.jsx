import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

import {
  AlertTriangle,
  ArrowLeft,
  Banknote,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  DollarSign,
  Eye,
  FileText,
  MoreHorizontal,
  Pencil,
  Plus,
  ReceiptText,
  Search,
  Trash2,
  UserRound,
  WalletCards,
  X,
} from 'lucide-react'

import api from '../services/api'

const TIPOS = [
  'INSCRIPCION',
  'COTIZACION',
  'ALQUILER',
  'CATERING',
]

const METODOS = [
  'EFECTIVO',
  'TARJETA',
  'TRANSFERENCIA',
  'DEPOSITO',
]

const ESTADOS = [
  'PENDIENTE',
  'PARCIAL',
  'PAGADO',
]

const formularioVacio = {
  clienteId: '',
  tipo: 'INSCRIPCION',
  monto: '',
  metodo: 'EFECTIVO',
  estado: 'PENDIENTE',
  fecha: '',
  referencia: '',
}

function Pagos() {
  const navigate = useNavigate()

  const [pagos, setPagos] = useState([])
  const [pagosGlobales, setPagosGlobales] = useState([])
  const [clientes, setClientes] = useState([])

  const [cargando, setCargando] = useState(true)
  const [cargandoEstadisticas, setCargandoEstadisticas] =
    useState(true)

  const [error, setError] = useState('')
  const [errorEstadisticas, setErrorEstadisticas] =
    useState('')

  const [busqueda, setBusqueda] = useState('')
  const [filtroTipo, setFiltroTipo] = useState('')
  const [filtroMetodo, setFiltroMetodo] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('')
  const [filtroCliente, setFiltroCliente] = useState('')

  const [pagina, setPagina] = useState(0)
  const [totalPaginas, setTotalPaginas] = useState(0)
  const [totalElementos, setTotalElementos] = useState(0)
  const tamanoPagina = 10

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
    cargarClientes()
  }, [])

  useEffect(() => {
    cargarPagos()
  }, [
    pagina,
    filtroTipo,
    filtroMetodo,
    filtroEstado,
    filtroCliente,
  ])

  useEffect(() => {
    cargarEstadisticasGlobales()
  }, [])

  const cargarClientes = async () => {
    try {
      const response = await api.get('/clientes')
      setClientes(response.data || [])
    } catch (err) {
      console.error('Error cargando clientes:', err)
    }
  }

  /*
   * =========================================================
   * PAGOS PAGINADOS
   * =========================================================
   */

  const cargarPagos = async () => {
    try {
      setCargando(true)
      setError('')

      const params = {
        page: pagina,
        size: tamanoPagina,
        sort: 'fecha,desc',
      }

      if (filtroTipo) {
        params.tipo = filtroTipo
      }

      if (filtroMetodo) {
        params.metodo = filtroMetodo
      }

      if (filtroEstado) {
        params.estado = filtroEstado
      }

      if (filtroCliente) {
        params.clienteId = filtroCliente
      }

      const response = await api.get('/pagos', {
        params,
      })

      const data = response.data || {}

      const registros = Array.isArray(data)
        ? data
        : data.content || []

      setPagos(registros)

      setTotalPaginas(
        Array.isArray(data)
          ? registros.length > 0
            ? 1
            : 0
          : data.totalPages || 0,
      )

      setTotalElementos(
        Array.isArray(data)
          ? registros.length
          : data.totalElements || 0,
      )
    } catch (err) {
      console.error('Error cargando pagos:', err)

      setError(
        'No fue posible cargar los pagos.',
      )

      setPagos([])
      setTotalPaginas(0)
      setTotalElementos(0)
    } finally {
      setCargando(false)
    }
  }

  /*
   * =========================================================
   * RF15 — ESTADÍSTICAS GLOBALES
   * =========================================================
   *
   * /api/pagos/todos devuelve todos los pagos.
   * Los KPIs se calculan sobre todos los registros,
   * no solamente sobre la página actual.
   */

  const cargarEstadisticasGlobales = async () => {
    try {
      setCargandoEstadisticas(true)
      setErrorEstadisticas('')

      const response = await api.get(
        '/pagos/todos',
      )

      const data = Array.isArray(response.data)
        ? response.data
        : []

      setPagosGlobales(data)
    } catch (err) {
      console.error(
        'Error cargando estadísticas de pagos:',
        err,
      )

      setPagosGlobales([])

      setErrorEstadisticas(
        'No fue posible calcular las estadísticas globales.',
      )
    } finally {
      setCargandoEstadisticas(false)
    }
  }

  /*
   * =========================================================
   * BÚSQUEDA LOCAL
   * =========================================================
   */

  const pagosFiltrados = useMemo(() => {
    const texto = busqueda
      .trim()
      .toLowerCase()

    if (!texto) {
      return pagos
    }

    return pagos.filter((pago) =>
      [
        pago.id,
        pago.cliente?.nombre,
        pago.cliente?.correo,
        pago.cliente?.dui,
        pago.tipo,
        pago.metodo,
        pago.estado,
        pago.fecha,
        pago.referencia,
        pago.monto,
      ].some((valor) =>
        String(valor ?? '')
          .toLowerCase()
          .includes(texto),
      ),
    )
  }, [pagos, busqueda])

  /*
   * =========================================================
   * ESTADÍSTICAS RF15
   * =========================================================
   */

  const estadisticas = useMemo(() => {
    const registros = pagosGlobales.length

    const totalMonto = pagosGlobales.reduce(
      (total, pago) =>
        total + Number(pago.monto || 0),
      0,
    )

    const totalPagado = pagosGlobales
      .filter(
        (pago) => pago.estado === 'PAGADO',
      )
      .reduce(
        (total, pago) =>
          total + Number(pago.monto || 0),
        0,
      )

    const totalParcial = pagosGlobales
      .filter(
        (pago) => pago.estado === 'PARCIAL',
      )
      .reduce(
        (total, pago) =>
          total + Number(pago.monto || 0),
        0,
      )

    const totalPendiente = pagosGlobales
      .filter(
        (pago) => pago.estado === 'PENDIENTE',
      )
      .reduce(
        (total, pago) =>
          total + Number(pago.monto || 0),
        0,
      )

    const cantidadPagados = pagosGlobales.filter(
      (pago) => pago.estado === 'PAGADO',
    ).length

    const cantidadParciales = pagosGlobales.filter(
      (pago) => pago.estado === 'PARCIAL',
    ).length

    const cantidadPendientes = pagosGlobales.filter(
      (pago) => pago.estado === 'PENDIENTE',
    ).length

    return {
      registros,
      totalMonto,
      totalPagado,
      totalParcial,
      totalPendiente,
      cantidadPagados,
      cantidadParciales,
      cantidadPendientes,
    }
  }, [pagosGlobales])

  /*
   * =========================================================
   * FORMATO
   * =========================================================
   */

  const formatoMoneda = (valor) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(Number(valor || 0))

  const formatoFecha = (fecha) => {
    if (!fecha) {
      return 'Sin fecha'
    }

    return new Intl.DateTimeFormat('es-SV', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(
      new Date(`${fecha}T00:00:00Z`),
    )
  }

  /*
   * =========================================================
   * FORMULARIO
   * =========================================================
   */

  const actualizarCampo = (event) => {
    const { name, value } = event.target

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }))

    setErrorFormulario('')
  }

  const cambiarFiltro = (
    setter,
    valor,
  ) => {
    setter(valor)
    setPagina(0)
  }

  const abrirNuevo = () => {
    setRegistroEditando(null)

    setFormulario({
      ...formularioVacio,
      fecha: new Date()
        .toISOString()
        .split('T')[0],
    })

    setErrorFormulario('')
    setModalFormulario(true)
  }

  const cerrarFormulario = () => {
    if (guardando) {
      return
    }

    setModalFormulario(false)
    setRegistroEditando(null)
    setFormulario(formularioVacio)
    setErrorFormulario('')
  }

  /*
   * =========================================================
   * DETALLE
   * =========================================================
   */

  const abrirDetalle = async (pago) => {
    setMenuAbierto(null)

    try {
      const response = await api.get(
        `/pagos/${pago.id}`,
      )

      setRegistroDetalle(response.data)
    } catch (err) {
      console.error(err)

      setError(
        'No fue posible consultar el pago.',
      )
    }
  }

  /*
   * =========================================================
   * EDITAR
   * =========================================================
   */

  const abrirEditar = async (pago) => {
    setMenuAbierto(null)

    try {
      const response = await api.get(
        `/pagos/${pago.id}`,
      )

      const data = response.data

      setRegistroEditando(data)

      setFormulario({
        clienteId: data.cliente?.id
          ? String(data.cliente.id)
          : '',
        tipo: data.tipo || 'INSCRIPCION',
        monto:
          data.monto !== null &&
          data.monto !== undefined
            ? String(data.monto)
            : '',
        metodo:
          data.metodo || 'EFECTIVO',
        estado:
          data.estado || 'PENDIENTE',
        fecha: data.fecha || '',
        referencia:
          data.referencia || '',
      })

      setErrorFormulario('')
      setModalFormulario(true)
    } catch (err) {
      console.error(err)

      setError(
        'No fue posible cargar el pago para editar.',
      )
    }
  }

  /*
   * =========================================================
   * VALIDACIÓN
   * =========================================================
   */

  const validarFormulario = () => {
    if (!formulario.clienteId) {
      return 'Debes seleccionar un cliente.'
    }

    if (!formulario.tipo) {
      return 'Debes seleccionar el tipo de pago.'
    }

    if (
      !formulario.monto ||
      Number(formulario.monto) < 0.01
    ) {
      return 'El monto debe ser mayor o igual a $0.01.'
    }

    if (!formulario.metodo) {
      return 'Debes seleccionar un método de pago.'
    }

    if (!formulario.estado) {
      return 'Debes seleccionar un estado.'
    }

    if (!formulario.fecha) {
      return 'La fecha es obligatoria.'
    }

    if (
      formulario.referencia.length > 100
    ) {
      return 'La referencia no puede superar los 100 caracteres.'
    }

    return ''
  }

  const construirPayload = () => {
    const cliente = clientes.find(
      (item) =>
        String(item.id) ===
        String(formulario.clienteId),
    )

    return {
      cliente,
      tipo: formulario.tipo,
      monto: Number(formulario.monto),
      metodo: formulario.metodo,
      estado: formulario.estado,
      fecha: formulario.fecha,
      referencia:
        formulario.referencia.trim(),
    }
  }

  /*
   * =========================================================
   * GUARDAR
   * =========================================================
   */

  const guardarPago = async (event) => {
    event.preventDefault()

    const validacion =
      validarFormulario()

    if (validacion) {
      setErrorFormulario(validacion)
      return
    }

    try {
      setGuardando(true)
      setErrorFormulario('')

      const payload =
        construirPayload()

      if (registroEditando) {
        await api.put(
          `/pagos/${registroEditando.id}`,
          payload,
        )
      } else {
        await api.post(
          '/pagos',
          payload,
        )
      }

      setModalFormulario(false)
      setRegistroEditando(null)
      setFormulario(formularioVacio)

      await Promise.all([
        cargarPagos(),
        cargarEstadisticasGlobales(),
      ])
    } catch (err) {
      console.error(
        'Error guardando pago:',
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
          'No fue posible guardar el pago. Verifica los datos ingresados.',
      )
    } finally {
      setGuardando(false)
    }
  }

  /*
   * =========================================================
   * ELIMINAR
   * =========================================================
   */

  const eliminarPago = async () => {
    if (!registroEliminando) {
      return
    }

    try {
      setEliminando(true)

      await api.delete(
        `/pagos/${registroEliminando.id}`,
      )

      setRegistroEliminando(null)

      if (
        pagos.length === 1 &&
        pagina > 0
      ) {
        setPagina(
          (anterior) =>
            anterior - 1,
        )
      } else {
        await cargarPagos()
      }

      await cargarEstadisticasGlobales()
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
          'No fue posible eliminar el pago.',
      )

      setRegistroEliminando(null)
    } finally {
      setEliminando(false)
    }
  }

  /*
   * =========================================================
   * ESTILOS DE ESTADO
   * =========================================================
   */

  const claseEstado = (estado) => {
    if (estado === 'PAGADO') {
      return 'border-emerald-400/15 bg-emerald-400/[0.07] text-emerald-300'
    }

    if (estado === 'PARCIAL') {
      return 'border-blue-400/15 bg-blue-400/[0.07] text-blue-300'
    }

    return 'border-amber-400/15 bg-amber-400/[0.07] text-amber-300'
  }

  const iconoMetodo = (metodo) => {
    if (metodo === 'EFECTIVO') {
      return Banknote
    }

    if (metodo === 'TARJETA') {
      return CreditCard
    }

    return WalletCards
  }

  return (
    <div className="min-h-screen bg-[#050b16] text-white">

      {/* Fondo decorativo */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-cyan-400/[0.055] blur-[125px]" />

        <div className="absolute -bottom-40 left-1/4 h-[520px] w-[520px] rounded-full bg-blue-500/[0.045] blur-[130px]" />
      </div>

      <main className="relative mx-auto max-w-[1650px] px-5 py-8 md:px-8 lg:px-10">

        {/* =====================================================
            HEADER
        ====================================================== */}

        <motion.header
          initial={{
            opacity: 0,
            y: -10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
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

                <ReceiptText
                  size={15}
                  className="text-cyan-400"
                />

                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-400">
                  Control financiero
                </p>

              </div>

              <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] md:text-4xl">
                Pagos
              </h1>

              <p className="mt-2 max-w-2xl text-sm text-slate-500">
                Registra, administra y consulta
                el estado de los pagos realizados
                por los clientes.
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
            Registrar pago
          </motion.button>

        </motion.header>

        {/* =====================================================
            KPIs RF15
        ====================================================== */}

        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <Kpi
            icono={ReceiptText}
            label="Pagos registrados"
            valor={
              cargandoEstadisticas
                ? '...'
                : estadisticas.registros
            }
            tag="TOTAL"
            delay={0}
          />

          <Kpi
            icono={DollarSign}
            label="Monto total registrado"
            valor={
              cargandoEstadisticas
                ? '...'
                : formatoMoneda(
                    estadisticas.totalMonto,
                  )
            }
            tag="TOTAL"
            delay={0.05}
          />

          <Kpi
            icono={Banknote}
            label="Total pagado"
            valor={
              cargandoEstadisticas
                ? '...'
                : formatoMoneda(
                    estadisticas.totalPagado,
                  )
            }
            tag={`${estadisticas.cantidadPagados} PAGADOS`}
            delay={0.1}
          />

          <Kpi
            icono={FileText}
            label="Total pendiente"
            valor={
              cargandoEstadisticas
                ? '...'
                : formatoMoneda(
                    estadisticas.totalPendiente,
                  )
            }
            tag={`${estadisticas.cantidadPendientes} PENDIENTES`}
            delay={0.15}
          />

        </section>

        {/* =====================================================
            RESUMEN DE ESTADOS
        ====================================================== */}

        <section className="mt-4 grid gap-4 md:grid-cols-3">

          <EstadoResumen
            estado="PAGADO"
            cantidad={estadisticas.cantidadPagados}
            monto={estadisticas.totalPagado}
            clase={claseEstado('PAGADO')}
          />

          <EstadoResumen
            estado="PARCIAL"
            cantidad={estadisticas.cantidadParciales}
            monto={estadisticas.totalParcial}
            clase={claseEstado('PARCIAL')}
          />

          <EstadoResumen
            estado="PENDIENTE"
            cantidad={estadisticas.cantidadPendientes}
            monto={estadisticas.totalPendiente}
            clase={claseEstado('PENDIENTE')}
          />

        </section>

        {errorEstadisticas && (
          <div className="mt-4 rounded-xl border border-amber-400/10 bg-amber-400/[0.04] px-4 py-3 text-xs text-amber-300">
            {errorEstadisticas}
          </div>
        )}

        {/* =====================================================
            TABLA
        ====================================================== */}

        <motion.section
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{ delay: 0.18 }}
          className="mt-6 overflow-visible rounded-[24px] border border-white/[0.07] bg-[#081321]"
        >

          <div className="border-b border-white/[0.06] p-5">

            <div className="flex flex-col gap-4">

              <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-end">

                <div>
                  <h2 className="font-semibold">
                    Historial de pagos
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    {totalElementos} registros
                    encontrados
                  </p>
                </div>

                <div className="relative xl:w-[340px]">

                  <Search
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
                  />

                  <input
                    value={busqueda}
                    onChange={(event) =>
                      setBusqueda(
                        event.target.value,
                      )
                    }
                    placeholder="Buscar en esta página..."
                    className="h-11 w-full rounded-xl border border-white/[0.07] bg-[#050d18] pl-11 pr-4 text-sm outline-none placeholder:text-slate-700 focus:border-cyan-400/30"
                  />

                </div>

              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

                <select
                  value={filtroTipo}
                  onChange={(event) =>
                    cambiarFiltro(
                      setFiltroTipo,
                      event.target.value,
                    )
                  }
                  className="h-11 rounded-xl border border-white/[0.07] bg-[#050d18] px-4 text-xs text-slate-400 outline-none focus:border-cyan-400/30"
                >
                  <option value="">
                    Todos los tipos
                  </option>

                  {TIPOS.map((tipo) => (
                    <option
                      key={tipo}
                      value={tipo}
                    >
                      {tipo}
                    </option>
                  ))}
                </select>

                <select
                  value={filtroMetodo}
                  onChange={(event) =>
                    cambiarFiltro(
                      setFiltroMetodo,
                      event.target.value,
                    )
                  }
                  className="h-11 rounded-xl border border-white/[0.07] bg-[#050d18] px-4 text-xs text-slate-400 outline-none focus:border-cyan-400/30"
                >
                  <option value="">
                    Todos los métodos
                  </option>

                  {METODOS.map((metodo) => (
                    <option
                      key={metodo}
                      value={metodo}
                    >
                      {metodo}
                    </option>
                  ))}
                </select>

                <select
                  value={filtroEstado}
                  onChange={(event) =>
                    cambiarFiltro(
                      setFiltroEstado,
                      event.target.value,
                    )
                  }
                  className="h-11 rounded-xl border border-white/[0.07] bg-[#050d18] px-4 text-xs text-slate-400 outline-none focus:border-cyan-400/30"
                >
                  <option value="">
                    Todos los estados
                  </option>

                  {ESTADOS.map((estado) => (
                    <option
                      key={estado}
                      value={estado}
                    >
                      {estado}
                    </option>
                  ))}
                </select>

                <select
                  value={filtroCliente}
                  onChange={(event) =>
                    cambiarFiltro(
                      setFiltroCliente,
                      event.target.value,
                    )
                  }
                  className="h-11 rounded-xl border border-white/[0.07] bg-[#050d18] px-4 text-xs text-slate-400 outline-none focus:border-cyan-400/30"
                >
                  <option value="">
                    Todos los clientes
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

            </div>

          </div>

          {/* ===================================================
              ESTADOS DE TABLA
          ==================================================== */}

          {cargando ? (

            <div className="flex min-h-[350px] items-center justify-center">

              <div className="text-center">

                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-cyan-400/20 border-t-cyan-400" />

                <p className="mt-4 text-sm text-slate-500">
                  Cargando pagos...
                </p>

              </div>

            </div>

          ) : error ? (

            <div className="flex min-h-[350px] items-center justify-center px-6 text-center">
              <p className="text-sm text-red-300">
                {error}
              </p>
            </div>

          ) : pagosFiltrados.length === 0 ? (

            <div className="flex min-h-[350px] items-center justify-center">

              <div className="text-center">

                <ReceiptText
                  size={38}
                  className="mx-auto text-cyan-400"
                />

                <p className="mt-4 text-sm">
                  No hay pagos para mostrar
                </p>

                <p className="mt-1 text-xs text-slate-600">
                  Registra un pago o cambia los
                  filtros.
                </p>

              </div>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full min-w-[1250px]">

                <thead>

                  <tr className="border-b border-white/[0.055] text-left">

                    {[
                      'Pago',
                      'Cliente',
                      'Tipo',
                      'Monto',
                      'Método',
                      'Fecha',
                      'Referencia',
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

                  {pagosFiltrados.map(
                    (pago, index) => {

                      const IconoMetodo =
                        iconoMetodo(
                          pago.metodo,
                        )

                      return (
                        <motion.tr
                          key={pago.id}
                          initial={{
                            opacity: 0,
                          }}
                          animate={{
                            opacity: 1,
                          }}
                          transition={{
                            delay:
                              index * 0.025,
                          }}
                          className="border-b border-white/[0.045] transition last:border-0 hover:bg-cyan-400/[0.025]"
                        >

                          <td className="px-5 py-5">

                            <div className="flex items-center gap-3">

                              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/10 bg-cyan-400/[0.06] text-cyan-300">
                                <ReceiptText
                                  size={17}
                                />
                              </div>

                              <div>

                                <p className="text-sm font-medium text-slate-200">
                                  PAG-
                                  {String(
                                    pago.id,
                                  ).padStart(
                                    4,
                                    '0',
                                  )}
                                </p>

                                <p className="mt-1 text-[11px] text-slate-600">
                                  Registro de pago
                                </p>

                              </div>

                            </div>

                          </td>

                          <td className="px-5 py-5">

                            <p className="text-xs font-medium text-slate-300">
                              {pago.cliente
                                ?.nombre ||
                                '—'}
                            </p>

                            <p className="mt-1 text-[11px] text-slate-600">
                              {pago.cliente
                                ?.correo ||
                                '—'}
                            </p>

                          </td>

                          <td className="px-5 py-5">

                            <span className="rounded-lg border border-cyan-400/10 bg-cyan-400/[0.045] px-2.5 py-1.5 text-[10px] text-cyan-300">
                              {pago.tipo}
                            </span>

                          </td>

                          <td className="px-5 py-5">

                            <p className="text-sm font-semibold text-cyan-300">
                              {formatoMoneda(
                                pago.monto,
                              )}
                            </p>

                          </td>

                          <td className="px-5 py-5">

                            <div className="flex items-center gap-2 text-xs text-slate-400">

                              <IconoMetodo
                                size={14}
                              />

                              {pago.metodo}

                            </div>

                          </td>

                          <td className="px-5 py-5 text-xs text-slate-400">
                            {formatoFecha(
                              pago.fecha,
                            )}
                          </td>

                          <td className="px-5 py-5">

                            <p className="max-w-[170px] truncate text-xs text-slate-500">
                              {pago.referencia ||
                                '—'}
                            </p>

                          </td>

                          <td className="px-5 py-5">

                            <span
                              className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-medium ${claseEstado(
                                pago.estado,
                              )}`}
                            >
                              {pago.estado}
                            </span>

                          </td>

                          <td className="relative px-5 py-5 text-right">

                            <button
                              onClick={() =>
                                setMenuAbierto(
                                  menuAbierto ===
                                    pago.id
                                    ? null
                                    : pago.id,
                                )
                              }
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 hover:bg-white/[0.04] hover:text-cyan-300"
                            >
                              <MoreHorizontal
                                size={18}
                              />
                            </button>

                            {menuAbierto ===
                              pago.id && (
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
                                      pago,
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
                                      pago,
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
                                    setRegistroEliminando(
                                      pago,
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
                      )
                    },
                  )}

                </tbody>

              </table>

            </div>

          )}

          {/* ===================================================
              PAGINACIÓN
          ==================================================== */}

          {!cargando &&
            !error &&
            totalPaginas > 0 && (
              <div className="flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] px-5 py-4 sm:flex-row">

                <p className="text-xs text-slate-600">
                  Página {pagina + 1} de{' '}
                  {totalPaginas} ·{' '}
                  {totalElementos} registros
                </p>

                <div className="flex items-center gap-2">

                  <button
                    onClick={() =>
                      setPagina(
                        (anterior) =>
                          Math.max(
                            anterior - 1,
                            0,
                          ),
                      )
                    }
                    disabled={pagina === 0}
                    className="flex h-9 items-center gap-1 rounded-lg border border-white/[0.07] px-3 text-xs text-slate-400 hover:bg-white/[0.04] disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <ChevronLeft
                      size={15}
                    />
                    Anterior
                  </button>

                  <div className="flex h-9 min-w-9 items-center justify-center rounded-lg border border-cyan-400/15 bg-cyan-400/[0.06] px-3 text-xs text-cyan-300">
                    {pagina + 1}
                  </div>

                  <button
                    onClick={() =>
                      setPagina(
                        (anterior) =>
                          Math.min(
                            anterior + 1,
                            totalPaginas - 1,
                          ),
                      )
                    }
                    disabled={
                      pagina >=
                      totalPaginas - 1
                    }
                    className="flex h-9 items-center gap-1 rounded-lg border border-white/[0.07] px-3 text-xs text-slate-400 hover:bg-white/[0.04] disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    Siguiente
                    <ChevronRight
                      size={15}
                    />
                  </button>

                </div>

              </div>
            )}

        </motion.section>

      </main>

      {/* =======================================================
          MODAL CREAR / EDITAR
      ======================================================== */}

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
                  Control financiero
                </p>

                <h2 className="mt-2 text-xl font-semibold">
                  {registroEditando
                    ? 'Editar pago'
                    : 'Registrar nuevo pago'}
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
              onSubmit={guardarPago}
              className="p-6"
            >

              <div className="grid gap-5 md:grid-cols-2">

                <CampoSelect
                  label="Cliente *"
                  name="clienteId"
                  value={
                    formulario.clienteId
                  }
                  onChange={
                    actualizarCampo
                  }
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
                      </option>
                    ),
                  )}

                </CampoSelect>

                <CampoSelect
                  label="Tipo de pago *"
                  name="tipo"
                  value={formulario.tipo}
                  onChange={
                    actualizarCampo
                  }
                >

                  {TIPOS.map((tipo) => (
                    <option
                      key={tipo}
                      value={tipo}
                    >
                      {tipo}
                    </option>
                  ))}

                </CampoSelect>

                <CampoInput
                  label="Monto *"
                  name="monto"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={formulario.monto}
                  onChange={
                    actualizarCampo
                  }
                  placeholder="0.00"
                />

                <CampoSelect
                  label="Método de pago *"
                  name="metodo"
                  value={formulario.metodo}
                  onChange={
                    actualizarCampo
                  }
                >

                  {METODOS.map(
                    (metodo) => (
                      <option
                        key={metodo}
                        value={metodo}
                      >
                        {metodo}
                      </option>
                    ),
                  )}

                </CampoSelect>

                <CampoSelect
                  label="Estado *"
                  name="estado"
                  value={formulario.estado}
                  onChange={
                    actualizarCampo
                  }
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

                </CampoSelect>

                <CampoInput
                  label="Fecha *"
                  name="fecha"
                  type="date"
                  value={formulario.fecha}
                  onChange={
                    actualizarCampo
                  }
                />

                <div className="md:col-span-2">

                  <CampoInput
                    label="Referencia"
                    name="referencia"
                    value={
                      formulario.referencia
                    }
                    onChange={
                      actualizarCampo
                    }
                    maxLength={100}
                    placeholder="Número de comprobante, transferencia o referencia"
                  />

                  <div className="mt-2 text-right text-[10px] text-slate-600">
                    {
                      formulario.referencia
                        .length
                    }
                    /100
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
                      : 'Registrar pago'}
                </button>

              </div>

            </form>

          </motion.div>

        </div>
      )}

      {/* =======================================================
          MODAL DETALLE
      ======================================================== */}

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
            className="relative z-10 w-full max-w-3xl rounded-[28px] border border-white/[0.08] bg-[#081321] p-7 shadow-2xl"
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
              <ReceiptText size={22} />
            </div>

            <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-400">
              Detalle del pago
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-3">

              <h2 className="text-2xl font-semibold">
                PAG-
                {String(
                  registroDetalle.id,
                ).padStart(4, '0')}
              </h2>

              <span
                className={`rounded-full border px-2.5 py-1 text-[10px] ${claseEstado(
                  registroDetalle.estado,
                )}`}
              >
                {registroDetalle.estado}
              </span>

            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">

              <DetalleCard
                icono={UserRound}
                titulo="Cliente"
                valor={
                  registroDetalle.cliente
                    ?.nombre || '—'
                }
                secundario={
                  registroDetalle.cliente
                    ?.correo
                }
              />

              <DetalleCard
                icono={FileText}
                titulo="Tipo"
                valor={
                  registroDetalle.tipo
                }
              />

              <DetalleCard
                icono={DollarSign}
                titulo="Monto"
                valor={formatoMoneda(
                  registroDetalle.monto,
                )}
                destacado
              />

              <DetalleCard
                icono={WalletCards}
                titulo="Método"
                valor={
                  registroDetalle.metodo
                }
              />

              <DetalleCard
                icono={CalendarDays}
                titulo="Fecha"
                valor={formatoFecha(
                  registroDetalle.fecha,
                )}
              />

              <DetalleCard
                icono={ReceiptText}
                titulo="Referencia"
                valor={
                  registroDetalle.referencia ||
                  'Sin referencia'
                }
              />

            </div>

          </motion.div>

        </div>
      )}

      {/* =======================================================
          MODAL ELIMINAR
      ======================================================== */}

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
              ¿Eliminar pago?
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Se eliminará el pago{' '}

              <span className="font-medium text-slate-300">
                PAG-
                {String(
                  registroEliminando.id,
                ).padStart(4, '0')}
              </span>

              . Esta acción no se puede
              deshacer.
            </p>

            <div className="mt-7 flex gap-3">

              <button
                onClick={() =>
                  setRegistroEliminando(
                    null,
                  )
                }
                disabled={eliminando}
                className="h-11 flex-1 rounded-xl border border-white/[0.08] text-sm text-slate-400 hover:bg-white/[0.04]"
              >
                Cancelar
              </button>

              <button
                onClick={eliminarPago}
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

/*
 * ============================================================
 * KPI
 * ============================================================
 */

function Kpi({
  icono: Icono,
  label,
  valor,
  tag,
  delay,
}) {
  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 12,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{ delay }}
      className="rounded-[22px] border border-white/[0.07] bg-[#081321] p-5"
    >

      <div className="flex items-center justify-between">

        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/10 bg-cyan-400/[0.06] text-cyan-300">
          <Icono size={20} />
        </div>

        <span className="rounded-full border border-cyan-400/10 bg-cyan-400/[0.05] px-2.5 py-1 text-[9px] font-medium text-cyan-400">
          {tag}
        </span>

      </div>

      <p className="mt-5 text-xs text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-3xl font-semibold">
        {valor}
      </p>

    </motion.article>
  )
}

/*
 * ============================================================
 * RESUMEN POR ESTADO
 * ============================================================
 */

function EstadoResumen({
  estado,
  cantidad,
  monto,
  clase,
}) {
  return (
    <article className="rounded-[20px] border border-white/[0.07] bg-[#081321] p-5">

      <div className="flex items-center justify-between">

        <span
          className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-medium ${clase}`}
        >
          {estado}
        </span>

        <span className="text-xs text-slate-600">
          {cantidad}{' '}
          {cantidad === 1
            ? 'registro'
            : 'registros'}
        </span>

      </div>

      <p className="mt-4 text-xs text-slate-500">
        Monto asociado
      </p>

      <p className="mt-1 text-xl font-semibold text-slate-200">
        {new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 2,
        }).format(Number(monto || 0))}
      </p>

    </article>
  )
}

/*
 * ============================================================
 * CAMPO INPUT
 * ============================================================
 */

function CampoInput({
  label,
  name,
  value,
  onChange,
  type = 'text',
  placeholder = '',
  min,
  step,
  maxLength,
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
        step={step}
        maxLength={maxLength}
        className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#050d18] px-4 text-sm text-slate-300 outline-none placeholder:text-slate-700 focus:border-cyan-400/30"
      />

    </div>
  )
}

/*
 * ============================================================
 * CAMPO SELECT
 * ============================================================
 */

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

/*
 * ============================================================
 * DETALLE CARD
 * ============================================================
 */

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
        className={`mt-1 break-words text-sm ${
          destacado
            ? 'font-semibold text-cyan-300'
            : 'text-slate-300'
        }`}
      >
        {valor}
      </p>

      {secundario && (
        <p className="mt-1 break-words text-[11px] text-slate-600">
          {secundario}
        </p>
      )}

    </div>
  )
}

export default Pagos