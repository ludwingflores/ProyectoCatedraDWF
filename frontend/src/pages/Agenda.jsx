import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  AlertTriangle,
  ArrowLeft,
  BookOpen,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Eye,
  GraduationCap,
  MapPin,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Trash2,
  Utensils,
  X,
} from 'lucide-react'

import api from '../services/api'

const TIPOS = [
  'CURSO',
  'DIPLOMADO',
  'EVENTO',
  'ALQUILER',
  'CATERING',
]

const formularioVacio = {
  titulo: '',
  descripcion: '',
  fecha: '',
  horaInicio: '',
  horaFin: '',
  tipo: 'EVENTO',
  espacioId: '',
}

function Agenda() {
  const navigate = useNavigate()

  const [agendas, setAgendas] = useState([])
  const [espacios, setEspacios] = useState([])

  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  const [busqueda, setBusqueda] = useState('')
  const [filtroTipo, setFiltroTipo] = useState('')
  const [filtroFecha, setFiltroFecha] = useState('')

  const [mesActual, setMesActual] = useState(() => {
    const hoy = new Date()
    return new Date(hoy.getFullYear(), hoy.getMonth(), 1)
  })

  const [menuAbierto, setMenuAbierto] = useState(null)

  const [modalFormulario, setModalFormulario] =
    useState(false)

  const [agendaEditando, setAgendaEditando] =
    useState(null)

  const [agendaDetalle, setAgendaDetalle] =
    useState(null)

  const [agendaEliminando, setAgendaEliminando] =
    useState(null)

  const [formulario, setFormulario] =
    useState(formularioVacio)

  const [errorFormulario, setErrorFormulario] =
    useState('')

  const [guardando, setGuardando] =
    useState(false)

  const [eliminando, setEliminando] =
    useState(false)

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    try {
      setCargando(true)
      setError('')

      const [
        responseAgenda,
        responseEspacios,
      ] = await Promise.all([
        api.get('/agenda'),
        api.get('/espacios'),
      ])

      setAgendas(responseAgenda.data || [])
      setEspacios(responseEspacios.data || [])
    } catch (err) {
      console.error(
        'Error cargando agenda:',
        err,
      )

      setError(
        'No fue posible cargar la agenda.',
      )
    } finally {
      setCargando(false)
    }
  }

  const agendasFiltradas = useMemo(() => {
    const texto = busqueda
      .trim()
      .toLowerCase()

    return agendas
      .filter((agenda) => {
        if (
          filtroTipo &&
          agenda.tipo !== filtroTipo
        ) {
          return false
        }

        if (
          filtroFecha &&
          agenda.fecha !== filtroFecha
        ) {
          return false
        }

        if (!texto) return true

        return [
          agenda.id,
          agenda.titulo,
          agenda.descripcion,
          agenda.tipo,
          agenda.fecha,
          agenda.espacio?.nombre,
        ].some((valor) =>
          String(valor ?? '')
            .toLowerCase()
            .includes(texto),
        )
      })
      .sort((a, b) => {
        const fechaA = crearFechaAgenda(a)
        const fechaB = crearFechaAgenda(b)

        return fechaA - fechaB
      })
  }, [
    agendas,
    busqueda,
    filtroTipo,
    filtroFecha,
  ])

  const estadisticas = useMemo(() => {
    const hoy = fechaLocalISO()

    const proximos = agendas.filter(
      (agenda) =>
        agenda.fecha &&
        agenda.fecha >= hoy,
    ).length

    const hoyCantidad = agendas.filter(
      (agenda) => agenda.fecha === hoy,
    ).length

    const espaciosUsados = new Set(
      agendas
        .map((agenda) => agenda.espacio?.id)
        .filter(Boolean),
    ).size

    return {
      total: agendas.length,
      proximos,
      hoy: hoyCantidad,
      espacios: espaciosUsados,
    }
  }, [agendas])

  const eventosMes = useMemo(() => {
    return agendas.filter((agenda) => {
      if (!agenda.fecha) return false

      const [year, month] =
        agenda.fecha.split('-').map(Number)

      return (
        year === mesActual.getFullYear() &&
        month === mesActual.getMonth() + 1
      )
    })
  }, [agendas, mesActual])

  const actualizarCampo = (event) => {
    const { name, value } = event.target

    setFormulario((actual) => ({
      ...actual,
      [name]: value,
    }))

    setErrorFormulario('')
  }

  const abrirNuevo = () => {
    setAgendaEditando(null)
    setFormulario(formularioVacio)
    setErrorFormulario('')
    setModalFormulario(true)
  }

  const cerrarFormulario = () => {
    if (guardando) return

    setModalFormulario(false)
    setAgendaEditando(null)
    setFormulario(formularioVacio)
    setErrorFormulario('')
  }

  const abrirDetalle = async (agenda) => {
    setMenuAbierto(null)

    try {
      const response = await api.get(
        `/agenda/${agenda.id}`,
      )

      setAgendaDetalle(response.data)
    } catch (err) {
      console.error(err)

      setError(
        'No fue posible consultar el registro.',
      )
    }
  }

  const abrirEditar = async (agenda) => {
    setMenuAbierto(null)

    try {
      const response = await api.get(
        `/agenda/${agenda.id}`,
      )

      const data = response.data

      setAgendaEditando(data)

      setFormulario({
        titulo: data.titulo || '',
        descripcion: data.descripcion || '',
        fecha: data.fecha || '',
        horaInicio:
          normalizarHora(data.horaInicio),
        horaFin:
          normalizarHora(data.horaFin),
        tipo: data.tipo || 'EVENTO',
        espacioId: data.espacio?.id
          ? String(data.espacio.id)
          : '',
      })

      setErrorFormulario('')
      setModalFormulario(true)
    } catch (err) {
      console.error(err)

      setError(
        'No fue posible cargar el registro para editar.',
      )
    }
  }

  const validarFormulario = () => {
    if (!formulario.titulo.trim()) {
      return 'El título es obligatorio.'
    }

    if (
      formulario.titulo.trim().length >
      150
    ) {
      return 'El título no puede superar los 150 caracteres.'
    }

    if (!formulario.tipo) {
      return 'Debes seleccionar un tipo.'
    }

    if (
      formulario.horaInicio &&
      formulario.horaFin &&
      formulario.horaFin <=
        formulario.horaInicio
    ) {
      return 'La hora de finalización debe ser posterior a la hora de inicio.'
    }

    return ''
  }

  const construirPayload = () => {
    const espacio = espacios.find(
      (item) =>
        String(item.id) ===
        String(formulario.espacioId),
    )

    return {
      titulo: formulario.titulo.trim(),
      descripcion:
        formulario.descripcion.trim() ||
        null,
      fecha: formulario.fecha || null,
      horaInicio:
        formulario.horaInicio || null,
      horaFin: formulario.horaFin || null,
      tipo: formulario.tipo,
      espacio: espacio || null,
    }
  }

  const guardarAgenda = async (event) => {
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

      const payload = construirPayload()

      if (agendaEditando) {
        await api.put(
          `/agenda/${agendaEditando.id}`,
          payload,
        )
      } else {
        await api.post(
          '/agenda',
          payload,
        )
      }

      setModalFormulario(false)
      setAgendaEditando(null)
      setFormulario(formularioVacio)

      await cargarDatos()
    } catch (err) {
      console.error(
        'Error guardando agenda:',
        err,
      )

      const data = err.response?.data

      const mensaje =
        typeof data === 'string'
          ? data
          : data?.message ||
            data?.mensaje ||
            data?.error

      if (err.response?.status === 400) {
        setErrorFormulario(
          mensaje ||
            'No fue posible guardar. Verifica los datos o posibles conflictos de horario.',
        )
      } else {
        setErrorFormulario(
          mensaje ||
            'No fue posible guardar el registro.',
        )
      }
    } finally {
      setGuardando(false)
    }
  }

  const eliminarAgenda = async () => {
    if (!agendaEliminando) return

    try {
      setEliminando(true)

      await api.delete(
        `/agenda/${agendaEliminando.id}`,
      )

      setAgendaEliminando(null)

      await cargarDatos()
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
          'No fue posible eliminar el registro.',
      )

      setAgendaEliminando(null)
    } finally {
      setEliminando(false)
    }
  }

  const cambiarMes = (cantidad) => {
    setMesActual(
      (actual) =>
        new Date(
          actual.getFullYear(),
          actual.getMonth() + cantidad,
          1,
        ),
    )
  }

  return (
    <div className="min-h-screen bg-[#050b16] text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-cyan-400/[0.055] blur-[125px]" />
        <div className="absolute -bottom-40 left-1/4 h-[520px] w-[520px] rounded-full bg-blue-500/[0.045] blur-[130px]" />
      </div>

      <main className="relative mx-auto max-w-[1650px] px-5 py-8 md:px-8 lg:px-10">
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
                <CalendarDays
                  size={15}
                  className="text-cyan-400"
                />

                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-400">
                  Gestión operativa
                </p>
              </div>

              <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] md:text-4xl">
                Agenda
              </h1>

              <p className="mt-2 max-w-2xl text-sm text-slate-500">
                Organiza cursos, diplomados,
                eventos, alquileres y servicios
                de catering en un solo lugar.
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
            Nuevo evento
          </motion.button>
        </motion.header>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Kpi
            icono={CalendarDays}
            label="Registros totales"
            valor={estadisticas.total}
            tag="AGENDA"
            delay={0}
          />

          <Kpi
            icono={Clock3}
            label="Próximos"
            valor={estadisticas.proximos}
            tag="FUTUROS"
            delay={0.05}
          />

          <Kpi
            icono={CheckCircle2}
            label="Programados hoy"
            valor={estadisticas.hoy}
            tag="HOY"
            delay={0.1}
          />

          <Kpi
            icono={MapPin}
            label="Espacios utilizados"
            valor={estadisticas.espacios}
            tag="ESPACIOS"
            delay={0.15}
          />
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[1fr_390px]">
          <motion.div
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.18,
            }}
            className="overflow-visible rounded-[24px] border border-white/[0.07] bg-[#081321]"
          >
            <div className="border-b border-white/[0.06] p-5">
              <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
                <div>
                  <h2 className="font-semibold">
                    Programación
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    {agendasFiltradas.length}{' '}
                    registros encontrados
                  </p>
                </div>

                <div className="relative lg:w-[300px]">
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
                    placeholder="Buscar..."
                    className="h-11 w-full rounded-xl border border-white/[0.07] bg-[#050d18] pl-11 pr-4 text-sm outline-none placeholder:text-slate-700 focus:border-cyan-400/30"
                  />
                </div>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
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

                  {TIPOS.map((tipo) => (
                    <option
                      key={tipo}
                      value={tipo}
                    >
                      {formatearTipo(tipo)}
                    </option>
                  ))}
                </select>

                <input
                  type="date"
                  value={filtroFecha}
                  onChange={(event) =>
                    setFiltroFecha(
                      event.target.value,
                    )
                  }
                  className="h-11 rounded-xl border border-white/[0.07] bg-[#050d18] px-4 text-xs text-slate-400 outline-none focus:border-cyan-400/30"
                />
              </div>
            </div>

            {cargando ? (
              <EstadoCarga />
            ) : error ? (
              <div className="flex min-h-[400px] items-center justify-center px-6 text-center">
                <p className="text-sm text-red-300">
                  {error}
                </p>
              </div>
            ) : agendasFiltradas.length ===
              0 ? (
              <EstadoVacio />
            ) : (
              <div className="divide-y divide-white/[0.045]">
                {agendasFiltradas.map(
                  (agenda, index) => (
                    <FilaAgenda
                      key={agenda.id}
                      agenda={agenda}
                      index={index}
                      menuAbierto={
                        menuAbierto
                      }
                      setMenuAbierto={
                        setMenuAbierto
                      }
                      abrirDetalle={
                        abrirDetalle
                      }
                      abrirEditar={
                        abrirEditar
                      }
                      eliminar={(item) => {
                        setMenuAbierto(null)
                        setAgendaEliminando(
                          item,
                        )
                      }}
                    />
                  ),
                )}
              </div>
            )}
          </motion.div>

          <motion.aside
            initial={{
              opacity: 0,
              x: 15,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              delay: 0.23,
            }}
            className="h-fit rounded-[24px] border border-white/[0.07] bg-[#081321] p-5"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-400">
                  Calendario
                </p>

                <h2 className="mt-1 font-semibold capitalize">
                  {nombreMes(mesActual)}
                </h2>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() =>
                    cambiarMes(-1)
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.07] text-slate-500 hover:bg-white/[0.04] hover:text-cyan-300"
                >
                  <ChevronLeft
                    size={16}
                  />
                </button>

                <button
                  onClick={() =>
                    cambiarMes(1)
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.07] text-slate-500 hover:bg-white/[0.04] hover:text-cyan-300"
                >
                  <ChevronRight
                    size={16}
                  />
                </button>
              </div>
            </div>

            <MiniCalendario
              mes={mesActual}
              eventos={eventosMes}
              seleccionarFecha={(fecha) => {
                setFiltroFecha(fecha)
              }}
            />

            <div className="mt-6 border-t border-white/[0.06] pt-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-600">
                Tipos de actividad
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {TIPOS.map((tipo) => (
                  <button
                    key={tipo}
                    onClick={() =>
                      setFiltroTipo(
                        filtroTipo === tipo
                          ? ''
                          : tipo,
                      )
                    }
                    className={`rounded-full border px-3 py-1.5 text-[10px] transition ${
                      filtroTipo === tipo
                        ? 'border-cyan-400/30 bg-cyan-400/[0.09] text-cyan-300'
                        : 'border-white/[0.07] bg-white/[0.025] text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {formatearTipo(tipo)}
                  </button>
                ))}
              </div>
            </div>
          </motion.aside>
        </section>
      </main>

      {modalFormulario && (
        <FormularioAgenda
          formulario={formulario}
          actualizarCampo={actualizarCampo}
          espacios={espacios}
          agendaEditando={agendaEditando}
          errorFormulario={
            errorFormulario
          }
          guardando={guardando}
          guardarAgenda={guardarAgenda}
          cerrar={cerrarFormulario}
        />
      )}

      {agendaDetalle && (
        <DetalleAgenda
          agenda={agendaDetalle}
          cerrar={() =>
            setAgendaDetalle(null)
          }
        />
      )}

      {agendaEliminando && (
        <EliminarAgenda
          agenda={agendaEliminando}
          eliminando={eliminando}
          cancelar={() =>
            setAgendaEliminando(null)
          }
          confirmar={eliminarAgenda}
        />
      )}
    </div>
  )
}

function FilaAgenda({
  agenda,
  index,
  menuAbierto,
  setMenuAbierto,
  abrirDetalle,
  abrirEditar,
  eliminar,
}) {
  const Icono = iconoTipo(agenda.tipo)

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 6,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        delay: index * 0.025,
      }}
      className="relative flex flex-col gap-4 p-5 transition hover:bg-cyan-400/[0.02] md:flex-row md:items-center"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.06] text-cyan-300">
        <Icono size={20} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="truncate text-sm font-medium text-slate-200">
            {agenda.titulo}
          </h3>

          <span className="rounded-full border border-cyan-400/10 bg-cyan-400/[0.05] px-2 py-1 text-[9px] font-medium text-cyan-400">
            {formatearTipo(
              agenda.tipo,
            )}
          </span>
        </div>

        <p className="mt-1 line-clamp-1 text-xs text-slate-600">
          {agenda.descripcion ||
            'Sin descripción'}
        </p>

        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-[11px] text-slate-500">
          <span className="flex items-center gap-1.5">
            <CalendarDays size={13} />
            {formatearFecha(
              agenda.fecha,
            )}
          </span>

          <span className="flex items-center gap-1.5">
            <Clock3 size={13} />
            {formatearHorario(
              agenda.horaInicio,
              agenda.horaFin,
            )}
          </span>

          <span className="flex items-center gap-1.5">
            <MapPin size={13} />
            {agenda.espacio?.nombre ||
              'Sin espacio'}
          </span>
        </div>
      </div>

      <div className="relative self-end md:self-auto">
        <button
          onClick={() =>
            setMenuAbierto(
              menuAbierto === agenda.id
                ? null
                : agenda.id,
            )
          }
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 hover:bg-white/[0.04] hover:text-cyan-300"
        >
          <MoreHorizontal size={18} />
        </button>

        {menuAbierto === agenda.id && (
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.96,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            className="absolute right-0 top-11 z-40 w-44 rounded-xl border border-white/[0.08] bg-[#0b1726] p-1.5 shadow-2xl"
          >
            <button
              onClick={() =>
                abrirDetalle(agenda)
              }
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-300 hover:bg-white/[0.05] hover:text-cyan-300"
            >
              <Eye size={14} />
              Ver detalles
            </button>

            <button
              onClick={() =>
                abrirEditar(agenda)
              }
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-300 hover:bg-white/[0.05] hover:text-cyan-300"
            >
              <Pencil size={14} />
              Editar
            </button>

            <button
              onClick={() =>
                eliminar(agenda)
              }
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-red-300 hover:bg-red-400/[0.08]"
            >
              <Trash2 size={14} />
              Eliminar
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

function FormularioAgenda({
  formulario,
  actualizarCampo,
  espacios,
  agendaEditando,
  errorFormulario,
  guardando,
  guardarAgenda,
  cerrar,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        onClick={cerrar}
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
              Programación
            </p>

            <h2 className="mt-2 text-xl font-semibold">
              {agendaEditando
                ? 'Editar agenda'
                : 'Nuevo registro'}
            </h2>
          </div>

          <button
            onClick={cerrar}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-white/[0.04] hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <form
          onSubmit={guardarAgenda}
          className="p-6"
        >
          <div className="grid gap-5 md:grid-cols-2">
            <CampoInput
              label="Título *"
              name="titulo"
              value={formulario.titulo}
              onChange={
                actualizarCampo
              }
              maxLength={150}
              placeholder="Título de la actividad"
            />

            <CampoSelect
              label="Tipo *"
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
                  {formatearTipo(tipo)}
                </option>
              ))}
            </CampoSelect>

            <CampoInput
              label="Fecha"
              name="fecha"
              type="date"
              value={formulario.fecha}
              onChange={
                actualizarCampo
              }
            />

            <CampoSelect
              label="Espacio"
              name="espacioId"
              value={
                formulario.espacioId
              }
              onChange={
                actualizarCampo
              }
            >
              <option value="">
                Sin espacio asignado
              </option>

              {espacios.map(
                (espacio) => (
                  <option
                    key={espacio.id}
                    value={espacio.id}
                  >
                    {espacio.nombre} ·{' '}
                    {espacio.tipo}
                    {!espacio.disponible
                      ? ' · No disponible'
                      : ''}
                  </option>
                ),
              )}
            </CampoSelect>

            <CampoInput
              label="Hora de inicio"
              name="horaInicio"
              type="time"
              value={
                formulario.horaInicio
              }
              onChange={
                actualizarCampo
              }
            />

            <CampoInput
              label="Hora de finalización"
              name="horaFin"
              type="time"
              value={formulario.horaFin}
              onChange={
                actualizarCampo
              }
            />

            <div className="md:col-span-2">
              <label className="mb-2 block text-xs text-slate-400">
                Descripción
              </label>

              <textarea
                name="descripcion"
                value={
                  formulario.descripcion
                }
                onChange={
                  actualizarCampo
                }
                rows={4}
                placeholder="Descripción de la actividad..."
                className="w-full resize-none rounded-xl border border-white/[0.08] bg-[#050d18] px-4 py-3 text-sm text-slate-300 outline-none placeholder:text-slate-700 focus:border-cyan-400/30"
              />
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-cyan-400/10 bg-cyan-400/[0.035] px-4 py-3 text-[11px] leading-5 text-slate-500">
            El sistema validará posibles
            conflictos de horario al guardar
            el registro.
          </div>

          {errorFormulario && (
            <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-400/10 bg-red-400/[0.05] px-4 py-3 text-xs leading-5 text-red-300">
              <AlertTriangle
                size={15}
                className="mt-0.5 shrink-0"
              />

              <span>
                {errorFormulario}
              </span>
            </div>
          )}

          <div className="mt-7 flex flex-col-reverse gap-3 border-t border-white/[0.06] pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={cerrar}
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
                : agendaEditando
                  ? 'Guardar cambios'
                  : 'Crear registro'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

function DetalleAgenda({
  agenda,
  cerrar,
}) {
  const Icono = iconoTipo(
    agenda.tipo,
  )

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        onClick={cerrar}
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
        className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[28px] border border-white/[0.08] bg-[#081321] p-7 shadow-2xl"
      >
        <button
          onClick={cerrar}
          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-white/[0.05] hover:text-white"
        >
          <X size={18} />
        </button>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.06] text-cyan-300">
          <Icono size={22} />
        </div>

        <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-400">
          {formatearTipo(
            agenda.tipo,
          )}
        </p>

        <h2 className="mt-2 pr-12 text-2xl font-semibold">
          {agenda.titulo}
        </h2>

        <p className="mt-1 text-xs text-slate-600">
          Registro #{agenda.id}
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <DetalleCard
            icono={CalendarDays}
            titulo="Fecha"
            valor={formatearFecha(
              agenda.fecha,
            )}
          />

          <DetalleCard
            icono={Clock3}
            titulo="Horario"
            valor={formatearHorario(
              agenda.horaInicio,
              agenda.horaFin,
            )}
          />

          <DetalleCard
            icono={MapPin}
            titulo="Espacio"
            valor={
              agenda.espacio?.nombre ||
              'Sin espacio'
            }
          />

          <DetalleCard
            icono={Building2}
            titulo="Tipo de espacio"
            valor={
              agenda.espacio?.tipo ||
              'No asignado'
            }
          />
        </div>

        <div className="mt-4 rounded-xl border border-white/[0.06] bg-[#050d18] p-4">
          <p className="text-[10px] uppercase tracking-[0.12em] text-slate-600">
            Descripción
          </p>

          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-400">
            {agenda.descripcion ||
              'Sin descripción.'}
          </p>
        </div>
      </motion.div>
    </div>
  )
}

function EliminarAgenda({
  agenda,
  eliminando,
  cancelar,
  confirmar,
}) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div
        onClick={() =>
          !eliminando && cancelar()
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
          ¿Eliminar registro?
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Se eliminará{' '}
          <span className="font-medium text-slate-300">
            {agenda.titulo}
          </span>
          . Esta acción no se puede
          deshacer.
        </p>

        <div className="mt-7 flex gap-3">
          <button
            onClick={cancelar}
            disabled={eliminando}
            className="h-11 flex-1 rounded-xl border border-white/[0.08] text-sm text-slate-400 hover:bg-white/[0.04]"
          >
            Cancelar
          </button>

          <button
            onClick={confirmar}
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
  )
}

function MiniCalendario({
  mes,
  eventos,
  seleccionarFecha,
}) {
  const year = mes.getFullYear()
  const month = mes.getMonth()

  const primerDia =
    new Date(year, month, 1).getDay()

  const diasMes =
    new Date(
      year,
      month + 1,
      0,
    ).getDate()

  const dias = []

  for (
    let i = 0;
    i < primerDia;
    i++
  ) {
    dias.push(null)
  }

  for (
    let dia = 1;
    dia <= diasMes;
    dia++
  ) {
    dias.push(dia)
  }

  const diasConEventos = new Set(
    eventos.map((evento) =>
      Number(
        evento.fecha?.split('-')[2],
      ),
    ),
  )

  const nombres = [
    'D',
    'L',
    'M',
    'M',
    'J',
    'V',
    'S',
  ]

  return (
    <div className="mt-5">
      <div className="grid grid-cols-7 gap-1">
        {nombres.map(
          (nombre, index) => (
            <div
              key={`${nombre}-${index}`}
              className="flex h-8 items-center justify-center text-[9px] font-semibold text-slate-700"
            >
              {nombre}
            </div>
          ),
        )}

        {dias.map((dia, index) => {
          if (!dia) {
            return (
              <div
                key={`empty-${index}`}
                className="h-10"
              />
            )
          }

          const tieneEvento =
            diasConEventos.has(dia)

          const fecha =
            `${year}-${String(
              month + 1,
            ).padStart(2, '0')}-${String(
              dia,
            ).padStart(2, '0')}`

          const esHoy =
            fecha === fechaLocalISO()

          return (
            <button
              key={fecha}
              onClick={() =>
                seleccionarFecha(fecha)
              }
              className={`relative flex h-10 items-center justify-center rounded-lg text-[11px] transition ${
                esHoy
                  ? 'border border-cyan-400/25 bg-cyan-400/[0.08] text-cyan-300'
                  : 'text-slate-500 hover:bg-white/[0.04] hover:text-slate-300'
              }`}
            >
              {dia}

              {tieneEvento && (
                <span className="absolute bottom-1.5 h-1 w-1 rounded-full bg-cyan-400" />
              )}
            </button>
          )
        })}
      </div>

      <button
        onClick={() =>
          seleccionarFecha('')
        }
        className="mt-4 w-full rounded-lg border border-white/[0.06] py-2 text-[10px] text-slate-600 transition hover:bg-white/[0.03] hover:text-slate-400"
      >
        Mostrar todas las fechas
      </button>
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
        maxLength={maxLength}
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
}) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#050d18] p-4">
      <Icono
        size={15}
        className="text-cyan-400"
      />

      <p className="mt-3 text-[10px] uppercase tracking-[0.12em] text-slate-600">
        {titulo}
      </p>

      <p className="mt-1 break-words text-sm text-slate-300">
        {valor}
      </p>
    </div>
  )
}

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

function EstadoCarga() {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-cyan-400/20 border-t-cyan-400" />

        <p className="mt-4 text-sm text-slate-500">
          Cargando agenda...
        </p>
      </div>
    </div>
  )
}

function EstadoVacio() {
  return (
    <div className="flex min-h-[400px] items-center justify-center text-center">
      <div>
        <CalendarDays
          size={40}
          className="mx-auto text-cyan-400"
        />

        <p className="mt-4 text-sm text-slate-300">
          No hay registros
        </p>

        <p className="mt-1 text-xs text-slate-600">
          Agrega una actividad o cambia
          los filtros.
        </p>
      </div>
    </div>
  )
}

function iconoTipo(tipo) {
  switch (tipo) {
    case 'CURSO':
      return BookOpen

    case 'DIPLOMADO':
      return GraduationCap

    case 'ALQUILER':
      return Building2

    case 'CATERING':
      return Utensils

    default:
      return CalendarDays
  }
}

function formatearTipo(tipo) {
  if (!tipo) return 'Evento'

  return (
    tipo.charAt(0) +
    tipo.slice(1).toLowerCase()
  )
}

function formatearFecha(fecha) {
  if (!fecha) return 'Sin fecha'

  const [year, month, day] =
    fecha.split('-').map(Number)

  const date = new Date(
    year,
    month - 1,
    day,
  )

  return date.toLocaleDateString(
    'es-SV',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    },
  )
}

function normalizarHora(hora) {
  if (!hora) return ''

  return String(hora).slice(0, 5)
}

function formatearHorario(
  inicio,
  fin,
) {
  if (!inicio && !fin) {
    return 'Sin horario'
  }

  if (inicio && fin) {
    return `${normalizarHora(
      inicio,
    )} - ${normalizarHora(fin)}`
  }

  return normalizarHora(
    inicio || fin,
  )
}

function crearFechaAgenda(agenda) {
  if (!agenda.fecha) {
    return new Date(9999, 0, 1)
  }

  const hora =
    normalizarHora(
      agenda.horaInicio,
    ) || '00:00'

  return new Date(
    `${agenda.fecha}T${hora}:00`,
  )
}

function fechaLocalISO() {
  const ahora = new Date()

  const year = ahora.getFullYear()
  const month = String(
    ahora.getMonth() + 1,
  ).padStart(2, '0')

  const day = String(
    ahora.getDate(),
  ).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function nombreMes(fecha) {
  return fecha.toLocaleDateString(
    'es-SV',
    {
      month: 'long',
      year: 'numeric',
    },
  )
}

export default Agenda