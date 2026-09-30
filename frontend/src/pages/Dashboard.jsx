import { useEffect, useState } from 'react'

import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

import api from '../services/api'

import {
  Bell,
  BookOpen,
  CalendarDays,
  ChevronRight,
  ClipboardList,
  FileText,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  Settings,
  Sparkles,
  Users,
  WalletCards,
  Building2,
  ChefHat,
  UsersRound,
  ShieldCheck,
  History,
} from 'lucide-react'

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const baseStats = [
  {
    title: 'Clientes registrados',
    value: '0',
    change: 'Registrados en el sistema',
    icon: Users,
  },
  {
    title: 'Cursos activos',
    value: '0',
    change: 'Disponibles actualmente',
    icon: BookOpen,
  },
  {
    title: 'Inscripciones',
    value: '0',
    change: 'Registradas en el sistema',
    icon: ClipboardList,
  },
  {
    title: 'Ingresos registrados',
    value: '$0.00',
    change: 'Pagos completados',
    icon: WalletCards,
  },
]

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, active: true },
  { label: 'Clientes', icon: Users },
  { label: 'Cursos', icon: BookOpen },
  { label: 'Diplomados', icon: GraduationCap },
  { label: 'Inscripciones', icon: ClipboardList },
  { label: 'Cotizaciones', icon: FileText },
  { label: 'Alquileres', icon: Building2, },
  { label: 'Catering', icon: ChefHat, },
  { label: 'Usuarios', icon: UsersRound, },
  { label: 'Roles', icon: ShieldCheck, },
  { label: 'Agenda', icon: CalendarDays },
  { label: 'Pagos', icon: WalletCards },
  {label: 'Historial',path: '/historial',icon: History,},

]

function Dashboard() {
  const navigate = useNavigate()

  const usuario = JSON.parse(
    localStorage.getItem('usuario') || '{}',
  )

  const [totalClientes, setTotalClientes] = useState(0)
  const [totalCursosActivos, setTotalCursosActivos] = useState(0)
  const [totalInscripciones, setTotalInscripciones] = useState(0)
  const [totalIngresos, setTotalIngresos] = useState(0)

  const [activityData, setActivityData] = useState([])
  const [events, setEvents] = useState([])

  useEffect(() => {
    const cargarDatosDashboard = async () => {
      try {
        // =====================================================
        // CLIENTES
        // =====================================================

        const clientesResponse = await api.get('/clientes')

        setTotalClientes(
          clientesResponse.data.length,
        )

        // =====================================================
        // CURSOS ACTIVOS
        // =====================================================

        const cursosResponse = await api.get('/cursos')

        const cursosActivos =
          cursosResponse.data.filter(
            (curso) => curso.activo === true,
          ).length

        setTotalCursosActivos(cursosActivos)

        // =====================================================
        // INSCRIPCIONES
        // =====================================================

        const inscripcionesResponse =
          await api.get('/inscripciones')

        const inscripciones =
          inscripcionesResponse.data

        setTotalInscripciones(
          inscripciones.length,
        )

        // =====================================================
        // GRÁFICA DE INSCRIPCIONES
        // ÚLTIMOS 6 MESES
        // =====================================================

        const meses = [
          'Ene',
          'Feb',
          'Mar',
          'Abr',
          'May',
          'Jun',
          'Jul',
          'Ago',
          'Sep',
          'Oct',
          'Nov',
          'Dic',
        ]

        const inscripcionesPorMes =
          Array.from(
            { length: 6 },
            (_, index) => {
              const fecha = new Date()

              fecha.setMonth(
                fecha.getMonth() -
                (5 - index),
              )

              const mes =
                fecha.getMonth()

              const anio =
                fecha.getFullYear()

              const cantidad =
                inscripciones.filter(
                  (inscripcion) => {
                    if (
                      !inscripcion.fecha
                    ) {
                      return false
                    }

                    const [
                      inscripcionAnio,
                      inscripcionMes,
                    ] =
                      inscripcion.fecha
                        .split('-')
                        .map(Number)

                    return (
                      inscripcionAnio ===
                      anio &&
                      inscripcionMes - 1 ===
                      mes
                    )
                  },
                ).length

              return {
                month: meses[mes],
                value: cantidad,
              }
            },
          )

        setActivityData(
          inscripcionesPorMes,
        )

        // =====================================================
        // PAGOS / INGRESOS
        // =====================================================

        const pagosResponse =
          await api.get('/pagos')

        const pagos =
          pagosResponse.data.content ?? []

        const ingresosPagados = pagos
          .filter(
            (pago) =>
              pago.estado === 'PAGADO',
          )
          .reduce(
            (total, pago) =>
              total +
              Number(pago.monto ?? 0),
            0,
          )

        setTotalIngresos(
          ingresosPagados,
        )

        // =====================================================
        // AGENDA
        // =====================================================

        const agendaResponse =
          await api.get('/agenda')

        const hoy = new Date()

        hoy.setHours(0, 0, 0, 0)

        const proximasActividades =
          agendaResponse.data
            .filter((actividad) => {
              if (!actividad.fecha) {
                return false
              }

              const [
                anio,
                mes,
                dia,
              ] = actividad.fecha
                .split('-')
                .map(Number)

              const fechaActividad =
                new Date(
                  anio,
                  mes - 1,
                  dia,
                )

              return (
                fechaActividad >= hoy
              )
            })
            .sort((a, b) => {
              const fechaA =
                new Date(
                  `${a.fecha}T${a.horaInicio}`,
                )

              const fechaB =
                new Date(
                  `${b.fecha}T${b.horaInicio}`,
                )

              return fechaA - fechaB
            })
            .slice(0, 3)
            .map((actividad) => {
              const [
                anio,
                mes,
                dia,
              ] = actividad.fecha
                .split('-')
                .map(Number)

              const fecha = new Date(
                anio,
                mes - 1,
                dia,
              )

              const month = fecha
                .toLocaleDateString(
                  'es-SV',
                  {
                    month: 'short',
                  },
                )
                .replace('.', '')
                .toUpperCase()

              const time =
                new Date(
                  `${actividad.fecha}T${actividad.horaInicio}`,
                ).toLocaleTimeString(
                  'en-US',
                  {
                    hour: 'numeric',
                    minute: '2-digit',
                  },
                )

              return {
                id: actividad.id,

                day: String(
                  dia,
                ).padStart(2, '0'),

                month,

                title:
                  actividad.titulo,

                description:
                  actividad.espacio
                    ?.nombre ||
                  actividad.descripcion ||
                  actividad.tipo,

                time,
              }
            })

        setEvents(
          proximasActividades,
        )
      } catch (error) {
        console.error(
          'Error al cargar datos del Dashboard:',
          error,
        )
      }
    }

    cargarDatosDashboard()
  }, [])

  // =========================================================
  // KPI
  // =========================================================

  const stats = baseStats.map(
    (stat) => {
      if (
        stat.title ===
        'Clientes registrados'
      ) {
        return {
          ...stat,
          value:
            totalClientes.toString(),
          change:
            'Registrados en el sistema',
        }
      }

      if (
        stat.title ===
        'Cursos activos'
      ) {
        return {
          ...stat,
          value:
            totalCursosActivos.toString(),
          change:
            'Disponibles actualmente',
        }
      }

      if (
        stat.title ===
        'Inscripciones'
      ) {
        return {
          ...stat,
          value:
            totalInscripciones.toString(),
          change:
            'Registradas en el sistema',
        }
      }

      if (
        stat.title ===
        'Ingresos registrados'
      ) {
        return {
          ...stat,

          value:
            totalIngresos.toLocaleString(
              'en-US',
              {
                style: 'currency',
                currency: 'USD',
              },
            ),

          change:
            'Pagos completados',
        }
      }

      return stat
    },
  )

  // =========================================================
  // LOGOUT
  // =========================================================

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')

    window.location.href = '/login'
  }

  return (
    <div className="min-h-screen bg-[#050b16] text-white">
      <div className="flex min-h-screen">
        {/* =================================================
            SIDEBAR
        ================================================= */}

        <aside className="fixed inset-y-0 left-0 z-30 hidden w-[270px] border-r border-white/[0.07] bg-[#07101d]/95 backdrop-blur-xl lg:flex lg:flex-col">
          <div className="flex h-[92px] items-center border-b border-white/[0.06] px-7">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-[0_0_30px_rgba(34,211,238,0.2)]">
                <GraduationCap
                  size={23}
                />
              </div>

              <div>
                <p className="text-[10px] font-semibold tracking-[0.24em] text-cyan-400">
                  UCA · CFC
                </p>

                <h1 className="mt-1 text-sm font-semibold text-white">
                  Gestión Académica
                </h1>
              </div>
            </div>
          </div>

          <div className="px-5 pt-7">
            <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-600">
              Navegación
            </p>
          </div>

          <nav className="mt-3 flex-1 space-y-1 px-4">
            {navItems.map(
              (item) => {
                const Icon =
                  item.icon

                return (
                  <motion.button
                    key={item.label}
                    whileHover={{ x: 3 }}
                    onClick={() => {
                      if (item.label === 'Dashboard') {
                        navigate('/dashboard')
                      }

                      if (item.label === 'Clientes') {
                        navigate('/clientes')
                      }
                      if (item.label === 'Cursos') {
                        navigate('/cursos')
                      }
                      if (item.label === 'Diplomados') {
                        navigate('/diplomados')
                      }
                      if (item.label === 'Inscripciones') {
                        navigate('/inscripciones')
                      }
                      if (item.label === 'Cotizaciones') {
                        navigate('/cotizaciones')
                      }
                      if (item.label === 'Alquileres') {
                        navigate('/alquileres')
                      }
                      if (item.label === 'Catering') {
                        navigate('/catering')
                      }
                      if (item.label === 'Pagos') {
                        navigate('/pagos')
                      }
                      if (item.label === 'Usuarios') {
                        navigate('/usuarios')
                      }
                      if (item.label === 'Roles') {
                        navigate('/roles')
                      }
                      if (item.label === 'Agenda') {
                        navigate('/agenda')
                      }
                      if (item.label === 'Historial') {
                        navigate('/historial')
                      }
                    }}
                    className={`group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm transition ${item.active
                      ? 'border border-cyan-400/15 bg-cyan-400/[0.08] text-cyan-300'
                      : 'border border-transparent text-slate-400 hover:bg-white/[0.035] hover:text-white'
                      }`}
                  >
                    <Icon
                      size={18}
                    />

                    <span className="flex-1">
                      {item.label}
                    </span>

                    {item.active && (
                      <div className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]" />
                    )}
                  </motion.button>
                )
              },
            )}
          </nav>

          <div className="border-t border-white/[0.06] p-4">
            <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-400 transition hover:bg-white/[0.04] hover:text-white">
              <Settings size={18} />
              Configuración
            </button>

            <button
              onClick={logout}
              className="mt-1 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-400 transition hover:bg-red-500/[0.08] hover:text-red-300"
            >
              <LogOut size={18} />
              Cerrar sesión
            </button>
          </div>
        </aside>

        {/* =================================================
            CONTENT
        ================================================= */}

        <main className="min-w-0 flex-1 lg:ml-[270px]">
          {/* TOP BAR */}

          <header className="sticky top-0 z-20 flex h-[92px] items-center justify-between border-b border-white/[0.06] bg-[#050b16]/80 px-5 backdrop-blur-xl md:px-8 lg:px-10">
            <div className="flex items-center gap-4">
              <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] text-slate-400 lg:hidden">
                <Menu size={19} />
              </button>

              <div>
                <p className="text-xs text-slate-500">
                  Centro de Formación
                  Continua
                </p>

                <h2 className="mt-1 font-semibold text-white">
                  Panel administrativo
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="hidden h-10 items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 text-sm text-slate-400 transition hover:border-cyan-400/20 hover:text-white md:flex">
                <Search size={16} />
                Buscar
              </button>

              <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.025] text-slate-400">
                <Bell size={17} />

                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-cyan-400" />
              </button>

              <div className="ml-1 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 text-sm font-bold">
                  {usuario?.nombre?.charAt(
                    0,
                  ) || 'A'}
                </div>

                <div className="hidden sm:block">
                  <p className="text-sm font-medium">
                    {usuario?.nombre ||
                      'Administrador'}
                  </p>

                  <p className="text-[11px] uppercase tracking-wider text-cyan-400">
                    {usuario?.rol ||
                      'ADMIN'}
                  </p>
                </div>
              </div>
            </div>
          </header>

          {/* =================================================
              DASHBOARD BODY
          ================================================= */}

          <div className="mx-auto max-w-[1600px] px-5 py-7 md:px-8 lg:px-10 lg:py-9">
            {/* HERO */}

            <motion.section
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#091525] px-7 py-8 md:px-9 md:py-10"
            >
              <div className="absolute -right-24 -top-36 h-[380px] w-[380px] rounded-full bg-cyan-400/[0.08] blur-[90px]" />

              <div className="absolute right-40 top-16 h-[180px] w-[180px] rounded-full bg-blue-600/[0.09] blur-[70px]" />

              <div className="absolute inset-0 opacity-[0.08]">
                <div className="h-full w-full bg-[linear-gradient(rgba(255,255,255,.15)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.15)_1px,transparent_1px)] bg-[size:45px_45px]" />
              </div>

              <div className="relative z-10 flex flex-col justify-between gap-8 xl:flex-row xl:items-end">
                <div>
                  <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/15 bg-cyan-400/[0.06] px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-cyan-300">
                    <Sparkles
                      size={13}
                    />
                    Panel de control
                  </div>

                  <h1 className="max-w-3xl text-3xl font-semibold tracking-[-0.04em] md:text-4xl">
                    Bienvenido,
                    <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
                      {' '}
                      {usuario?.nombre ||
                        'Administrador'}
                    </span>
                  </h1>

                  <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400 md:text-base">
                    Visualiza la actividad
                    académica,
                    administrativa y
                    financiera del Centro de
                    Formación Continua desde
                    un solo lugar.
                  </p>
                </div>
              </div>
            </motion.section>

            {/* =================================================
                KPI CARDS
            ================================================= */}

            <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map(
                (stat, index) => {
                  const Icon =
                    stat.icon

                  return (
                    <motion.article
                      key={
                        stat.title
                      }
                      initial={{
                        opacity: 0,
                        y: 18,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        delay:
                          0.07 *
                          index,
                      }}
                      whileHover={{
                        y: -4,
                      }}
                      className="group rounded-[22px] border border-white/[0.07] bg-[#081321] p-5 transition hover:border-cyan-400/20"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/10 bg-cyan-400/[0.06] text-cyan-300">
                          <Icon
                            size={
                              20
                            }
                          />
                        </div>

                        <ChevronRight
                          size={17}
                          className="text-slate-700 transition group-hover:text-cyan-400"
                        />
                      </div>

                      <p className="mt-6 text-xs text-slate-500">
                        {
                          stat.title
                        }
                      </p>

                      <div className="mt-2 flex items-end justify-between gap-3">
                        <p className="text-2xl font-semibold tracking-tight">
                          {
                            stat.value
                          }
                        </p>

                        <p className="text-[11px] text-emerald-400">
                          {
                            stat.change
                          }
                        </p>
                      </div>
                    </motion.article>
                  )
                },
              )}
            </section>

            {/* =================================================
                CHART + AGENDA
            ================================================= */}

            <section className="mt-6 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
              {/* CHART */}

              <motion.article
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                transition={{
                  delay: 0.25,
                }}
                className="rounded-[24px] border border-white/[0.07] bg-[#081321] p-6"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-cyan-400">
                      Actividad
                    </p>

                    <h3 className="mt-2 text-lg font-semibold">
                      Crecimiento de
                      inscripciones
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      Actividad registrada
                      durante los últimos
                      meses
                    </p>
                  </div>

                  <button className="rounded-xl border border-white/[0.07] px-3 py-2 text-xs text-slate-400 transition hover:border-cyan-400/20 hover:text-white">
                    6 meses
                  </button>
                </div>

                <div className="mt-7 h-[300px]">
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <AreaChart
                      data={
                        activityData
                      }
                    >
                      <defs>
                        <linearGradient
                          id="dashboardGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#22d3ee"
                            stopOpacity={
                              0.3
                            }
                          />

                          <stop
                            offset="95%"
                            stopColor="#22d3ee"
                            stopOpacity={
                              0
                            }
                          />
                        </linearGradient>
                      </defs>

                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={
                          false
                        }
                        stroke="rgba(255,255,255,0.05)"
                      />

                      <XAxis
                        dataKey="month"
                        axisLine={
                          false
                        }
                        tickLine={
                          false
                        }
                        tick={{
                          fill: '#64748b',
                          fontSize: 11,
                        }}
                      />

                      <YAxis
                        axisLine={
                          false
                        }
                        tickLine={
                          false
                        }
                        tick={{
                          fill: '#64748b',
                          fontSize: 11,
                        }}
                      />

                      <Tooltip
                        contentStyle={{
                          background:
                            '#0b1726',
                          border:
                            '1px solid rgba(255,255,255,.08)',
                          borderRadius:
                            '12px',
                        }}
                      />

                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#22d3ee"
                        strokeWidth={
                          2
                        }
                        fill="url(#dashboardGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </motion.article>

              {/* =================================================
                  AGENDA
              ================================================= */}

              <motion.article
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                transition={{
                  delay: 0.3,
                }}
                className="rounded-[24px] border border-white/[0.07] bg-[#081321] p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-cyan-400">
                      Agenda
                    </p>

                    <h3 className="mt-2 text-lg font-semibold">
                      Próximas actividades
                    </h3>
                  </div>

                  <CalendarDays
                    size={20}
                    className="text-slate-600"
                  />
                </div>

                <div className="mt-6 space-y-3">
                  {events.length >
                    0 ? (
                    events.map(
                      (event) => (
                        <motion.div
                          key={
                            event.id
                          }
                          whileHover={{
                            x: 3,
                          }}
                          className="flex gap-4 rounded-2xl border border-white/[0.055] bg-white/[0.018] p-4 transition hover:border-cyan-400/15"
                        >
                          <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-cyan-400/[0.07]">
                            <span className="text-sm font-semibold text-cyan-300">
                              {
                                event.day
                              }
                            </span>

                            <span className="text-[8px] font-semibold tracking-wider text-slate-500">
                              {
                                event.month
                              }
                            </span>
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">
                              {
                                event.title
                              }
                            </p>

                            <p className="mt-1 text-[11px] text-slate-500">
                              {
                                event.description
                              }
                            </p>

                            <p className="mt-2 text-[10px] font-medium text-cyan-400">
                              {
                                event.time
                              }
                            </p>
                          </div>
                        </motion.div>
                      ),
                    )
                  ) : (
                    <div className="rounded-2xl border border-white/[0.055] bg-white/[0.018] px-4 py-8 text-center">
                      <CalendarDays
                        size={24}
                        className="mx-auto text-slate-600"
                      />

                      <p className="mt-3 text-sm text-slate-400">
                        No hay próximas
                        actividades
                      </p>
                    </div>
                  )}
                </div>

                <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.07] py-3 text-xs text-slate-400 transition hover:border-cyan-400/20 hover:bg-cyan-400/[0.04] hover:text-cyan-300">
                  Ver agenda completa
                  <ChevronRight
                    size={14}
                  />
                </button>
              </motion.article>
            </section>

            {/* FOOTER */}

            <footer className="mt-8 flex flex-col justify-between gap-2 border-t border-white/[0.05] py-6 text-[11px] text-slate-600 sm:flex-row">
              <p>
                Centro de Formación
                Continua · Sistema de
                Gestión Académica
              </p>

              <p>UCA · 2026</p>
            </footer>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Dashboard