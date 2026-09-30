import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
    ArrowLeft,
    Building2,
    CalendarDays,
    CheckCircle2,
    ChevronDown,
    Clock3,
    CreditCard,
    FileText,
    GraduationCap,
    Mail,
    MapPin,
    Phone,
    Receipt,
    Search,
    Utensils,
    UserRound,
    Wallet,
    X,
} from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'

import api from '../services/api'

const SECCIONES = [
    {
        key: 'inscripciones',
        label: 'Inscripciones',
        icon: GraduationCap,
    },
    {
        key: 'cotizaciones',
        label: 'Cotizaciones',
        icon: FileText,
    },
    {
        key: 'alquileres',
        label: 'Alquileres',
        icon: Building2,
    },
    {
        key: 'catering',
        label: 'Catering',
        icon: Utensils,
    },
    {
        key: 'pagos',
        label: 'Pagos',
        icon: Wallet,
    },
]

function HistorialCliente() {
    const navigate = useNavigate()
    const { id } = useParams()

    const [historial, setHistorial] = useState(null)
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState('')

    const [busqueda, setBusqueda] = useState('')
    const [seccionActiva, setSeccionActiva] = useState('todas')

    useEffect(() => {
        cargarHistorial()
    }, [id])

    const cargarHistorial = async () => {
        if (!id) {
            setError('No se proporcionó un cliente válido.')
            setCargando(false)
            return
        }

        try {
            setCargando(true)
            setError('')

            const response = await api.get(
                `/clientes/${id}/historial`,
            )

            setHistorial(response.data)
        } catch (err) {
            console.error(
                'Error cargando historial:',
                err,
            )

            if (err.response?.status === 403) {
                setError(
                    'No tienes permiso para consultar este historial.',
                )
            } else if (err.response?.status === 404) {
                setError(
                    'El cliente no fue encontrado.',
                )
            } else {
                setError(
                    'No fue posible cargar el historial del cliente.',
                )
            }
        } finally {
            setCargando(false)
        }
    }

    const cliente = historial?.cliente

    const cantidades = useMemo(() => {
        if (!historial) {
            return {
                inscripciones: 0,
                cotizaciones: 0,
                alquileres: 0,
                catering: 0,
                pagos: 0,
            }
        }

        return {
            inscripciones:
                historial.inscripciones?.length || 0,
            cotizaciones:
                historial.cotizaciones?.length || 0,
            alquileres:
                historial.alquileres?.length || 0,
            catering:
                historial.catering?.length || 0,
            pagos:
                historial.pagos?.length || 0,
        }
    }, [historial])

    const totalPagado = useMemo(() => {
        return (historial?.pagos || []).reduce(
            (total, pago) =>
                total + Number(pago.monto || 0),
            0,
        )
    }, [historial])

    const contenido = useMemo(() => {
        if (!historial) return []

        const elementos = []

        if (
            seccionActiva === 'todas' ||
            seccionActiva === 'inscripciones'
        ) {
            ; (historial.inscripciones || []).forEach(
                (item) => {
                    elementos.push({
                        tipo: 'inscripciones',
                        fecha: item.fecha,
                        data: item,
                    })
                },
            )
        }

        if (
            seccionActiva === 'todas' ||
            seccionActiva === 'cotizaciones'
        ) {
            ; (historial.cotizaciones || []).forEach(
                (item) => {
                    elementos.push({
                        tipo: 'cotizaciones',
                        fecha: item.fecha,
                        data: item,
                    })
                },
            )
        }

        if (
            seccionActiva === 'todas' ||
            seccionActiva === 'alquileres'
        ) {
            ; (historial.alquileres || []).forEach(
                (item) => {
                    elementos.push({
                        tipo: 'alquileres',
                        fecha: item.fecha,
                        data: item,
                    })
                },
            )
        }

        if (
            seccionActiva === 'todas' ||
            seccionActiva === 'catering'
        ) {
            ; (historial.catering || []).forEach(
                (item) => {
                    elementos.push({
                        tipo: 'catering',
                        fecha: item.fecha,
                        data: item,
                    })
                },
            )
        }

        if (
            seccionActiva === 'todas' ||
            seccionActiva === 'pagos'
        ) {
            ; (historial.pagos || []).forEach(
                (item) => {
                    elementos.push({
                        tipo: 'pagos',
                        fecha: item.fecha,
                        data: item,
                    })
                },
            )
        }

        const texto =
            busqueda.trim().toLowerCase()

        return elementos
            .filter((item) => {
                if (!texto) return true

                const data = item.data

                const valores = [
                    item.tipo,
                    data.estado,
                    data.fecha,
                    data.descripcion,
                    data.menu,
                    data.lugar,
                    data.tipoServicio,
                    data.tipo,
                    data.metodo,
                    data.referencia,
                    data.curso?.nombre,
                    data.espacio?.nombre,
                    data.servicioCatering?.nombre,
                ]

                return valores.some((valor) =>
                    String(valor ?? '')
                        .toLowerCase()
                        .includes(texto),
                )
            })
            .sort(
                (a, b) =>
                    convertirFecha(b.fecha) -
                    convertirFecha(a.fecha),
            )
    }, [
        historial,
        seccionActiva,
        busqueda,
    ])

    if (cargando) {
        return (
            <PantallaCarga />
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#050b16] text-white">
                <div className="flex min-h-screen items-center justify-center p-6">
                    <div className="w-full max-w-md rounded-[26px] border border-white/[0.07] bg-[#081321] p-8 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-red-400/10 bg-red-400/[0.06] text-red-300">
                            <X size={24} />
                        </div>

                        <h2 className="mt-5 text-xl font-semibold">
                            No se pudo cargar el historial
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            {error}
                        </p>

                        <div className="mt-6 flex gap-3">
                            <button
                                onClick={() =>
                                    navigate('/clientes')
                                }
                                className="h-11 flex-1 rounded-xl border border-white/[0.08] text-sm text-slate-400 hover:bg-white/[0.04]"
                            >
                                Volver
                            </button>

                            <button
                                onClick={cargarHistorial}
                                className="h-11 flex-1 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-sm font-semibold text-[#04101c]"
                            >
                                Reintentar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#050b16] text-white">
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute -right-40 -top-40 h-[550px] w-[550px] rounded-full bg-cyan-400/[0.045] blur-[130px]" />
                <div className="absolute -bottom-40 left-1/4 h-[500px] w-[500px] rounded-full bg-blue-500/[0.04] blur-[130px]" />
            </div>

            <main className="relative mx-auto max-w-[1600px] px-5 py-8 md:px-8 lg:px-10">
                <motion.header
                    initial={{
                        opacity: 0,
                        y: -10,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center"
                >
                    <div className="flex items-start gap-4">
                        <button
                            type="button"
                            onClick={() => navigate('/clientes')}
                            title="Volver a Clientes"
                            className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.025] text-slate-400 transition hover:border-cyan-400/20 hover:bg-cyan-400/[0.05] hover:text-cyan-300"
                        >
                            <ArrowLeft size={19} />
                        </button>

                        <div>
                            <div className="flex items-center gap-2">
                                <Receipt
                                    size={15}
                                    className="text-cyan-400"
                                />

                                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-400">
                                    Clientes
                                </span>
                            </div>

                            <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] md:text-4xl">
                                Historial del cliente
                            </h1>

                            <p className="mt-2 text-sm text-slate-500">
                                Consulta consolidada de toda la
                                actividad registrada.
                            </p>
                        </div>
                    </div>
                </motion.header>

                <section className="mt-7">
                    <motion.div
                        initial={{
                            opacity: 0,
                            y: 12,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        className="relative overflow-hidden rounded-[28px] border border-white/[0.07] bg-[#081321] p-6 md:p-7"
                    >
                        <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-cyan-400/[0.035] blur-[80px]" />

                        <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                            <div className="flex items-center gap-4">
                                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.06] text-cyan-300">
                                    <UserRound size={27} />
                                </div>

                                <div>
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-400">
                                        Cliente #{cliente?.id}
                                    </p>

                                    <h2 className="mt-1 text-2xl font-semibold">
                                        {cliente?.nombre ||
                                            'Cliente'}
                                    </h2>

                                    {cliente?.empresa && (
                                        <p className="mt-1 text-sm text-slate-500">
                                            {cliente.empresa}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-2">
                                <DatoCliente
                                    icono={Mail}
                                    valor={
                                        cliente?.correo ||
                                        'Sin correo'
                                    }
                                />

                                <DatoCliente
                                    icono={Phone}
                                    valor={
                                        cliente?.telefono ||
                                        'Sin teléfono'
                                    }
                                />

                                <DatoCliente
                                    icono={MapPin}
                                    valor={
                                        cliente?.direccion ||
                                        'Sin dirección'
                                    }
                                />

                                <DatoCliente
                                    icono={CreditCard}
                                    valor={
                                        cliente?.dui ||
                                        cliente?.nit ||
                                        'Sin documento'
                                    }
                                />
                            </div>
                        </div>
                    </motion.div>
                </section>

                <section className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                    <Resumen
                        icono={GraduationCap}
                        titulo="Inscripciones"
                        valor={
                            cantidades.inscripciones
                        }
                    />

                    <Resumen
                        icono={FileText}
                        titulo="Cotizaciones"
                        valor={
                            cantidades.cotizaciones
                        }
                    />

                    <Resumen
                        icono={Building2}
                        titulo="Alquileres"
                        valor={
                            cantidades.alquileres
                        }
                    />

                    <Resumen
                        icono={Utensils}
                        titulo="Catering"
                        valor={
                            cantidades.catering
                        }
                    />

                    <Resumen
                        icono={Wallet}
                        titulo="Pagos"
                        valor={cantidades.pagos}
                        extra={`$${totalPagado.toFixed(2)}`}
                    />
                </section>

                <section className="mt-6 grid gap-6 xl:grid-cols-[280px_1fr]">
                    <aside className="h-fit rounded-[24px] border border-white/[0.07] bg-[#081321] p-4">
                        <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.17em] text-slate-600">
                            Actividad
                        </p>

                        <button
                            onClick={() =>
                                setSeccionActiva('todas')
                            }
                            className={`mt-1 flex w-full items-center justify-between rounded-xl px-3 py-3 text-sm transition ${seccionActiva === 'todas'
                                    ? 'bg-cyan-400/[0.07] text-cyan-300'
                                    : 'text-slate-500 hover:bg-white/[0.03] hover:text-slate-300'
                                }`}
                        >
                            <span>Todo el historial</span>

                            <span className="rounded-full bg-white/[0.05] px-2 py-0.5 text-[10px]">
                                {contenido.length}
                            </span>
                        </button>

                        <div className="mt-2 space-y-1">
                            {SECCIONES.map(
                                ({
                                    key,
                                    label,
                                    icon: Icono,
                                }) => (
                                    <button
                                        key={key}
                                        onClick={() =>
                                            setSeccionActiva(
                                                key,
                                            )
                                        }
                                        className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${seccionActiva === key
                                                ? 'bg-cyan-400/[0.07] text-cyan-300'
                                                : 'text-slate-500 hover:bg-white/[0.03] hover:text-slate-300'
                                            }`}
                                    >
                                        <Icono size={16} />

                                        <span className="flex-1 text-left">
                                            {label}
                                        </span>

                                        <span className="text-[10px] text-slate-700">
                                            {cantidades[key]}
                                        </span>
                                    </button>
                                ),
                            )}
                        </div>

                        <div className="mt-5 border-t border-white/[0.06] pt-4">
                            <div className="rounded-xl border border-cyan-400/10 bg-cyan-400/[0.035] p-4">
                                <p className="text-[10px] uppercase tracking-[0.13em] text-slate-600">
                                    Total pagado
                                </p>

                                <p className="mt-1 text-xl font-semibold text-cyan-300">
                                    ${totalPagado.toFixed(2)}
                                </p>

                                <p className="mt-1 text-[10px] text-slate-600">
                                    Según los pagos registrados.
                                </p>
                            </div>
                        </div>
                    </aside>

                    <div className="min-w-0 rounded-[24px] border border-white/[0.07] bg-[#081321]">
                        <div className="border-b border-white/[0.06] p-5">
                            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                                <div>
                                    <h2 className="font-semibold">
                                        Historial
                                    </h2>

                                    <p className="mt-1 text-xs text-slate-600">
                                        {contenido.length}{' '}
                                        movimientos registrados
                                    </p>
                                </div>

                                <div className="relative w-full md:w-[280px]">
                                    <Search
                                        size={15}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
                                    />

                                    <input
                                        value={busqueda}
                                        onChange={(event) =>
                                            setBusqueda(
                                                event.target.value,
                                            )
                                        }
                                        placeholder="Buscar en historial..."
                                        className="h-10 w-full rounded-xl border border-white/[0.07] bg-[#050d18] pl-10 pr-4 text-xs text-slate-300 outline-none placeholder:text-slate-700 focus:border-cyan-400/30"
                                    />
                                </div>
                            </div>
                        </div>

                        {contenido.length === 0 ? (
                            <EstadoVacio />
                        ) : (
                            <div className="divide-y divide-white/[0.045]">
                                {contenido.map(
                                    (item, index) => (
                                        <Movimiento
                                            key={`${item.tipo}-${item.data.id}-${index}`}
                                            item={item}
                                        />
                                    ),
                                )}
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    )
}

function Movimiento({ item }) {
    const {
        icono: Icono,
        titulo,
        subtitulo,
    } = informacionMovimiento(
        item.tipo,
        item.data,
    )

    return (
        <motion.article
            initial={{
                opacity: 0,
                y: 8,
            }}
            animate={{
                opacity: 1,
                y: 0,
            }}
            className="p-5 transition hover:bg-cyan-400/[0.018]"
        >
            <div className="flex gap-4">
                <div className="relative">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-400/10 bg-cyan-400/[0.05] text-cyan-300">
                        <Icono size={19} />
                    </div>
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex flex-col justify-between gap-2 md:flex-row">
                        <div>
                            <div className="flex flex-wrap items-center gap-2">
                                <h3 className="text-sm font-medium text-slate-200">
                                    {titulo}
                                </h3>

                                <span className="rounded-full border border-white/[0.07] bg-white/[0.025] px-2 py-1 text-[9px] text-slate-500">
                                    {etiquetaTipo(
                                        item.tipo,
                                    )}
                                </span>
                            </div>

                            <p className="mt-1 text-xs text-slate-600">
                                {subtitulo}
                            </p>
                        </div>

                        <div className="shrink-0 text-left md:text-right">
                            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 md:justify-end">
                                <CalendarDays size={12} />
                                {formatearFecha(
                                    item.fecha,
                                )}
                            </div>

                            <span className="mt-1 block text-[9px] text-slate-700">
                                ID #{item.data.id}
                            </span>
                        </div>
                    </div>

                    <DetalleMovimiento
                        tipo={item.tipo}
                        data={item.data}
                    />
                </div>
            </div>
        </motion.article>
    )
}

function DetalleMovimiento({
    tipo,
    data,
}) {
    if (tipo === 'inscripciones') {
        return (
            <div className="mt-4 flex flex-wrap gap-2">
                <InfoChip
                    label="Curso"
                    valor={
                        data.curso?.nombre ||
                        `Curso #${data.curso?.id || '—'}`
                    }
                />

                <Estado
                    valor={data.estado}
                />
            </div>
        )
    }

    if (tipo === 'cotizaciones') {
        return (
            <div className="mt-4 flex flex-wrap gap-2">
                <InfoChip
                    label="Monto"
                    valor={`$${numero(
                        data.monto,
                    )}`}
                />

                {data.descripcion && (
                    <InfoChip
                        label="Detalle"
                        valor={data.descripcion}
                    />
                )}

                <Estado
                    valor={data.estado}
                />
            </div>
        )
    }

    if (tipo === 'alquileres') {
        return (
            <div className="mt-4 flex flex-wrap gap-2">
                <InfoChip
                    label="Espacio"
                    valor={
                        data.espacio?.nombre ||
                        'Sin espacio'
                    }
                />

                <InfoChip
                    label="Horario"
                    valor={formatearHorario(
                        data.horaInicio,
                        data.horaFin,
                    )}
                />

                <InfoChip
                    label="Precio"
                    valor={`$${numero(
                        data.precio,
                    )}`}
                />

                <Estado
                    valor={data.estado}
                />
            </div>
        )
    }

    if (tipo === 'catering') {
        return (
            <div className="mt-4 flex flex-wrap gap-2">
                <InfoChip
                    label="Menú"
                    valor={data.menu}
                />

                <InfoChip
                    label="Asistentes"
                    valor={data.numeroAsistentes}
                />

                <InfoChip
                    label="Lugar"
                    valor={data.lugar}
                />

                <InfoChip
                    label="Costo"
                    valor={`$${numero(
                        data.costo,
                    )}`}
                />

                {data.estado && (
                    <Estado
                        valor={data.estado}
                    />
                )}
            </div>
        )
    }

    if (tipo === 'pagos') {
        return (
            <div className="mt-4 flex flex-wrap gap-2">
                <InfoChip
                    label="Monto"
                    valor={`$${numero(
                        data.monto,
                    )}`}
                />

                <InfoChip
                    label="Método"
                    valor={formatearTexto(
                        data.metodo,
                    )}
                />

                <InfoChip
                    label="Tipo"
                    valor={formatearTexto(
                        data.tipo,
                    )}
                />

                <Estado
                    valor={data.estado}
                />

                {data.referencia && (
                    <InfoChip
                        label="Referencia"
                        valor={data.referencia}
                    />
                )}
            </div>
        )
    }

    return null
}

function informacionMovimiento(
    tipo,
    data,
) {
    if (tipo === 'inscripciones') {
        return {
            icono: GraduationCap,
            titulo:
                data.curso?.nombre ||
                'Inscripción registrada',
            subtitulo:
                'Actividad académica del cliente',
        }
    }

    if (tipo === 'cotizaciones') {
        return {
            icono: FileText,
            titulo:
                data.descripcion ||
                'Cotización registrada',
            subtitulo:
                'Solicitud de cotización',
        }
    }

    if (tipo === 'alquileres') {
        return {
            icono: Building2,
            titulo:
                data.espacio?.nombre ||
                'Alquiler registrado',
            subtitulo:
                'Reserva de espacio',
        }
    }

    if (tipo === 'catering') {
        return {
            icono: Utensils,
            titulo:
                data.servicioCatering?.nombre ||
                'Solicitud de catering',
            subtitulo:
                data.tipoServicio ||
                'Servicio de catering',
        }
    }

    return {
        icono: Wallet,
        titulo: 'Pago registrado',
        subtitulo:
            data.referencia ||
            'Movimiento financiero',
    }
}

function Resumen({
    icono: Icono,
    titulo,
    valor,
    extra,
}) {
    return (
        <motion.div
            initial={{
                opacity: 0,
                y: 10,
            }}
            animate={{
                opacity: 1,
                y: 0,
            }}
            className="rounded-[20px] border border-white/[0.07] bg-[#081321] p-5"
        >
            <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/10 bg-cyan-400/[0.05] text-cyan-300">
                    <Icono size={18} />
                </div>

                {extra && (
                    <span className="text-[10px] text-cyan-400">
                        {extra}
                    </span>
                )}
            </div>

            <p className="mt-4 text-xs text-slate-500">
                {titulo}
            </p>

            <p className="mt-1 text-2xl font-semibold">
                {valor}
            </p>
        </motion.div>
    )
}

function DatoCliente({
    icono: Icono,
    valor,
}) {
    return (
        <div className="flex min-w-0 items-center gap-2 rounded-xl border border-white/[0.06] bg-[#050d18] px-3 py-2.5">
            <Icono
                size={13}
                className="shrink-0 text-cyan-400"
            />

            <span className="truncate text-[11px] text-slate-500">
                {valor}
            </span>
        </div>
    )
}

function InfoChip({
    label,
    valor,
}) {
    return (
        <div className="rounded-lg border border-white/[0.06] bg-[#050d18] px-3 py-2">
            <span className="text-[9px] uppercase tracking-[0.1em] text-slate-700">
                {label}
            </span>

            <span className="ml-2 text-[11px] text-slate-400">
                {valor}
            </span>
        </div>
    )
}

function Estado({ valor }) {
    if (!valor) return null

    return (
        <span className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-400/10 bg-cyan-400/[0.04] px-3 py-2 text-[10px] text-cyan-300">
            <CheckCircle2 size={12} />
            {formatearTexto(valor)}
        </span>
    )
}

function PantallaCarga() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-[#050b16]">
            <div className="text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-cyan-400/20 border-t-cyan-400" />

                <p className="mt-4 text-sm text-slate-500">
                    Cargando historial...
                </p>
            </div>
        </div>
    )
}

function EstadoVacio() {
    return (
        <div className="flex min-h-[350px] items-center justify-center text-center">
            <div>
                <Receipt
                    size={38}
                    className="mx-auto text-slate-700"
                />

                <p className="mt-4 text-sm text-slate-400">
                    No hay movimientos
                </p>

                <p className="mt-1 text-xs text-slate-600">
                    No se encontraron registros para
                    este filtro.
                </p>
            </div>
        </div>
    )
}

function formatearFecha(fecha) {
    if (!fecha) return 'Sin fecha'

    const partes = String(fecha)
        .split('-')
        .map(Number)

    if (partes.length !== 3) {
        return fecha
    }

    const date = new Date(
        partes[0],
        partes[1] - 1,
        partes[2],
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

function convertirFecha(fecha) {
    if (!fecha) return 0

    return new Date(
        `${fecha}T00:00:00`,
    ).getTime()
}

function formatearHorario(
    inicio,
    fin,
) {
    if (!inicio && !fin) {
        return 'Sin horario'
    }

    const i = String(
        inicio || '',
    ).slice(0, 5)

    const f = String(
        fin || '',
    ).slice(0, 5)

    if (i && f) {
        return `${i} - ${f}`
    }

    return i || f
}

function numero(valor) {
    return Number(
        valor || 0,
    ).toFixed(2)
}

function formatearTexto(valor) {
    if (!valor) return '—'

    return String(valor)
        .toLowerCase()
        .split('_')
        .map(
            (parte) =>
                parte.charAt(0).toUpperCase() +
                parte.slice(1),
        )
        .join(' ')
}

function etiquetaTipo(tipo) {
    return formatearTexto(tipo)
}

export default HistorialCliente