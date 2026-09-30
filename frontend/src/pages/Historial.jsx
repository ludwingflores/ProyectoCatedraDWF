import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
    ArrowLeft,
    ArrowRight,
    Building2,
    History,
    Mail,
    Phone,
    Search,
    UserRound,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import api from '../services/api'

function Historial() {
    const navigate = useNavigate()

    const [clientes, setClientes] = useState([])
    const [busqueda, setBusqueda] = useState('')
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        cargarClientes()
    }, [])

    const cargarClientes = async () => {
        try {
            setCargando(true)
            setError('')

            const response = await api.get('/clientes')

            setClientes(
                Array.isArray(response.data)
                    ? response.data
                    : response.data?.content || [],
            )
        } catch (err) {
            console.error(
                'Error cargando clientes:',
                err,
            )

            setError(
                'No fue posible cargar los clientes.',
            )
        } finally {
            setCargando(false)
        }
    }

    const clientesFiltrados = clientes.filter(
        (cliente) => {
            const texto = busqueda
                .trim()
                .toLowerCase()

            if (!texto) return true

            return [
                cliente.nombre,
                cliente.empresa,
                cliente.correo,
                cliente.telefono,
                cliente.dui,
                cliente.nit,
            ].some((valor) =>
                String(valor ?? '')
                    .toLowerCase()
                    .includes(texto),
            )
        },
    )

    const abrirHistorial = (cliente) => {
        navigate(
            `/clientes/${cliente.id}/historial`,
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
                    className="flex flex-col gap-5"
                >
                    <div className="flex items-start gap-4">

                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            title="Volver al Dashboard"
                            className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.025] text-slate-400 transition hover:border-cyan-400/20 hover:bg-cyan-400/[0.05] hover:text-cyan-300"
                        >
                            <ArrowLeft size={19} />
                        </button>

                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.06] text-cyan-300">
                            <History size={23} />
                        </div>

                        <div>
                            <div className="flex items-center gap-2">
                                <History
                                    size={14}
                                    className="text-cyan-400"
                                />

                                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-400">
                                    Gestión
                                </span>
                            </div>

                            <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] md:text-4xl">
                                Historial de clientes
                            </h1>

                            <p className="mt-2 max-w-2xl text-sm text-slate-500">
                                Selecciona un cliente para
                                consultar sus inscripciones,
                                cotizaciones, alquileres,
                                solicitudes de catering y pagos.
                            </p>
                        </div>

                    </div>
                </motion.header>

                <section className="mt-7">
                    <div className="rounded-[24px] border border-white/[0.07] bg-[#081321] p-4 md:p-5">
                        <div className="relative">
                            <Search
                                size={17}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
                            />

                            <input
                                type="text"
                                value={busqueda}
                                onChange={(event) =>
                                    setBusqueda(
                                        event.target.value,
                                    )
                                }
                                placeholder="Buscar cliente por nombre, empresa, correo, DUI o NIT..."
                                className="h-12 w-full rounded-xl border border-white/[0.07] bg-[#050d18] pl-11 pr-4 text-sm text-slate-300 outline-none placeholder:text-slate-700 transition focus:border-cyan-400/30"
                            />
                        </div>
                    </div>
                </section>

                {cargando ? (
                    <EstadoCarga />
                ) : error ? (
                    <EstadoError
                        mensaje={error}
                        reintentar={cargarClientes}
                    />
                ) : clientesFiltrados.length === 0 ? (
                    <EstadoVacio busqueda={busqueda} />
                ) : (
                    <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {clientesFiltrados.map(
                            (cliente, index) => (
                                <motion.article
                                    key={cliente.id}
                                    initial={{
                                        opacity: 0,
                                        y: 12,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                    }}
                                    transition={{
                                        delay: index * 0.035,
                                    }}
                                    className="group rounded-[22px] border border-white/[0.07] bg-[#081321] p-5 transition duration-300 hover:-translate-y-0.5 hover:border-cyan-400/15 hover:bg-[#0a1726]"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex min-w-0 items-center gap-3">
                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-cyan-400/10 bg-cyan-400/[0.05] text-cyan-300">
                                                <UserRound size={20} />
                                            </div>

                                            <div className="min-w-0">
                                                <h2 className="truncate font-semibold text-slate-200">
                                                    {cliente.nombre ||
                                                        'Sin nombre'}
                                                </h2>

                                                {cliente.empresa && (
                                                    <p className="mt-0.5 truncate text-xs text-slate-600">
                                                        {cliente.empresa}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <span className="shrink-0 rounded-full border border-white/[0.06] bg-white/[0.025] px-2 py-1 text-[9px] text-slate-600">
                                            #{cliente.id}
                                        </span>
                                    </div>

                                    <div className="mt-5 space-y-2">
                                        <Dato
                                            icono={Mail}
                                            valor={
                                                cliente.correo ||
                                                'Sin correo'
                                            }
                                        />

                                        <Dato
                                            icono={Phone}
                                            valor={
                                                cliente.telefono ||
                                                'Sin teléfono'
                                            }
                                        />

                                        <Dato
                                            icono={Building2}
                                            valor={
                                                cliente.empresa ||
                                                'Persona natural'
                                            }
                                        />
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            abrirHistorial(
                                                cliente,
                                            )
                                        }
                                        className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-sm font-semibold text-[#04101c] transition hover:brightness-110"
                                    >
                                        <History size={16} />

                                        Ver historial

                                        <ArrowRight
                                            size={15}
                                            className="transition-transform group-hover:translate-x-1"
                                        />
                                    </button>
                                </motion.article>
                            ),
                        )}
                    </section>
                )}
            </main>
        </div>
    )
}

function Dato({
    icono: Icono,
    valor,
}) {
    return (
        <div className="flex min-w-0 items-center gap-2.5 rounded-xl border border-white/[0.05] bg-[#050d18] px-3 py-2.5">
            <Icono
                size={14}
                className="shrink-0 text-cyan-400/80"
            />

            <span className="truncate text-xs text-slate-500">
                {valor}
            </span>
        </div>
    )
}

function EstadoCarga() {
    return (
        <div className="mt-6 flex min-h-[350px] items-center justify-center rounded-[24px] border border-white/[0.07] bg-[#081321]">
            <div className="text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-cyan-400/20 border-t-cyan-400" />

                <p className="mt-4 text-sm text-slate-500">
                    Cargando clientes...
                </p>
            </div>
        </div>
    )
}

function EstadoError({
    mensaje,
    reintentar,
}) {
    return (
        <div className="mt-6 flex min-h-[350px] items-center justify-center rounded-[24px] border border-white/[0.07] bg-[#081321]">
            <div className="text-center">
                <p className="text-sm text-red-300">
                    {mensaje}
                </p>

                <button
                    type="button"
                    onClick={reintentar}
                    className="mt-4 rounded-xl border border-white/[0.08] px-4 py-2 text-xs text-slate-400 transition hover:bg-white/[0.04]"
                >
                    Reintentar
                </button>
            </div>
        </div>
    )
}

function EstadoVacio({
    busqueda,
}) {
    return (
        <div className="mt-6 flex min-h-[350px] items-center justify-center rounded-[24px] border border-white/[0.07] bg-[#081321]">
            <div className="text-center">
                <Search
                    size={35}
                    className="mx-auto text-slate-700"
                />

                <p className="mt-4 text-sm text-slate-400">
                    {busqueda
                        ? 'No se encontraron clientes'
                        : 'No hay clientes registrados'}
                </p>

                <p className="mt-1 text-xs text-slate-600">
                    {busqueda
                        ? 'Prueba con otro término de búsqueda.'
                        : 'Los clientes aparecerán aquí.'}
                </p>
            </div>
        </div>
    )
}

export default Historial