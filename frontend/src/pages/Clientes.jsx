import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

import api from '../services/api'

import {
  ArrowLeft,
  Building2,
  Mail,
  MapPin,
  MoreHorizontal,
  Phone,
  Plus,
  Search,
  Users,
  Eye,
  Pencil,
  Trash2,
  X,
  AlertTriangle,
} from 'lucide-react'

function Clientes() {
  const navigate = useNavigate()

  const [clientes, setClientes] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [cargando, setCargando] = useState(true)
    const [error, setError] = useState('')
    const [modalAbierto, setModalAbierto] = useState(false)
const [guardando, setGuardando] = useState(false)
const [errorFormulario, setErrorFormulario] = useState('')

const [formulario, setFormulario] = useState({
  nombre: '',
  correo: '',
  dui: '',
  nit: '',
  empresa: '',
  telefono: '',
  direccion: '',
})

  const [menuClienteId, setMenuClienteId] = useState(null)
  const [clienteDetalle, setClienteDetalle] = useState(null)
  const [clienteEditando, setClienteEditando] = useState(null)
  const [clienteEliminando, setClienteEliminando] = useState(null)
  const [procesandoEliminar, setProcesandoEliminar] = useState(false)


  useEffect(() => {
    const cargarClientes = async () => {
      try {
        setCargando(true)
        setError('')

        const response = await api.get('/clientes')

        setClientes(response.data)
      } catch (err) {
        console.error(
          'Error al cargar clientes:',
          err,
        )

        setError(
          'No fue posible cargar los clientes.',
        )
      } finally {
        setCargando(false)
      }
    }

    cargarClientes()
  }, [])

  const clientesFiltrados = useMemo(() => {
    const texto = busqueda
      .trim()
      .toLowerCase()

    if (!texto) {
      return clientes
    }

    return clientes.filter((cliente) => {
      return [
        cliente.nombre,
        cliente.correo,
        cliente.telefono,
        cliente.dui,
        cliente.nit,
        cliente.empresa,
        cliente.direccion,
      ].some((valor) =>
        String(valor ?? '')
          .toLowerCase()
          .includes(texto),
      )
    })
  }, [clientes, busqueda])
const actualizarCampo = (event) => {
  const { name, value } = event.target

  setFormulario((anterior) => ({
    ...anterior,
    [name]: value,
  }))
}

const cerrarModal = () => {
  if (guardando) {
    return
  }

  setModalAbierto(false)
  setErrorFormulario('')

  setFormulario({
    nombre: '',
    correo: '',
    dui: '',
    nit: '',
    empresa: '',
    telefono: '',
    direccion: '',
  })
}

const guardarCliente = async (event) => {
  event.preventDefault()

  const nombre = formulario.nombre.trim()
  const correo = formulario.correo.trim()

  if (!nombre || !correo) {
    setErrorFormulario(
      'El nombre y el correo son obligatorios.',
    )
    return
  }

  try {
    setGuardando(true)
    setErrorFormulario('')

    const payload = {
      nombre,
      correo,
      dui: formulario.dui.trim() || null,
      nit: formulario.nit.trim() || null,
      empresa: formulario.empresa.trim() || null,
      telefono: formulario.telefono.trim() || null,
      direccion: formulario.direccion.trim() || null,
    }

    const response = await api.post(
      '/clientes',
      payload,
    )

  setClientes((anteriores) => [
  ...anteriores,
  response.data,
])

setModalAbierto(false)
setErrorFormulario('')

setFormulario({
  nombre: '',
  correo: '',
  dui: '',
  nit: '',
  empresa: '',
  telefono: '',
  direccion: '',
})
      
  } catch (err) {
    console.error(
      'Error al registrar cliente:',
      err,
    )

    const mensajeBackend =
      err.response?.data?.message ||
      err.response?.data?.mensaje ||
      err.response?.data?.error

    setErrorFormulario(
      mensajeBackend ||
        'No fue posible registrar el cliente. Revisa los datos ingresados.',
    )
  } finally {
    setGuardando(false)
  }
}

  const cargarFormularioCliente = (cliente) => {
    setFormulario({
      nombre: cliente.nombre ?? '',
      correo: cliente.correo ?? '',
      dui: cliente.dui ?? '',
      nit: cliente.nit ?? '',
      empresa: cliente.empresa ?? '',
      telefono: cliente.telefono ?? '',
      direccion: cliente.direccion ?? '',
    })
  }

  const abrirDetalle = async (cliente) => {
    setMenuClienteId(null)
    try {
      const response = await api.get(`/clientes/${cliente.id}`)
      setClienteDetalle(response.data)
    } catch (err) {
      console.error('Error al consultar cliente:', err)
      setError('No fue posible consultar el cliente.')
    }
  }

  const abrirEdicion = (cliente) => {
    setMenuClienteId(null)
    setClienteEditando(cliente)
    setErrorFormulario('')
    cargarFormularioCliente(cliente)
  }

  const cerrarEdicion = () => {
    if (guardando) return
    setClienteEditando(null)
    setErrorFormulario('')
    setFormulario({
      nombre: '',
      correo: '',
      dui: '',
      nit: '',
      empresa: '',
      telefono: '',
      direccion: '',
    })
  }

  const actualizarCliente = async (event) => {
    event.preventDefault()
    const nombre = formulario.nombre.trim()
    const correo = formulario.correo.trim()

    if (!nombre || !correo) {
      setErrorFormulario('El nombre y el correo son obligatorios.')
      return
    }

    try {
      setGuardando(true)
      setErrorFormulario('')

      const payload = {
        nombre,
        correo,
        dui: formulario.dui.trim() || null,
        nit: formulario.nit.trim() || null,
        empresa: formulario.empresa.trim() || null,
        telefono: formulario.telefono.trim() || null,
        direccion: formulario.direccion.trim() || null,
      }

      const response = await api.put(`/clientes/${clienteEditando.id}`, payload)

      setClientes((anteriores) =>
        anteriores.map((cliente) =>
          cliente.id === clienteEditando.id ? response.data : cliente,
        ),
      )

      setClienteEditando(null)
      setFormulario({
        nombre: '',
        correo: '',
        dui: '',
        nit: '',
        empresa: '',
        telefono: '',
        direccion: '',
      })
    } catch (err) {
      console.error('Error al actualizar cliente:', err)
      setErrorFormulario(
        err.response?.data?.message ||
          err.response?.data?.mensaje ||
          err.response?.data?.error ||
          'No fue posible actualizar el cliente.',
      )
    } finally {
      setGuardando(false)
    }
  }

  const confirmarEliminar = (cliente) => {
    setMenuClienteId(null)
    setClienteEliminando(cliente)
  }

  const eliminarCliente = async () => {
    if (!clienteEliminando) return

    try {
      setProcesandoEliminar(true)
      await api.delete(`/clientes/${clienteEliminando.id}`)
      setClientes((anteriores) =>
        anteriores.filter((cliente) => cliente.id !== clienteEliminando.id),
      )
      setClienteEliminando(null)
    } catch (err) {
      console.error('Error al eliminar cliente:', err)
      setError(
        err.response?.data?.message ||
          err.response?.data?.mensaje ||
          'No fue posible eliminar el cliente.',
      )
      setClienteEliminando(null)
    } finally {
      setProcesandoEliminar(false)
    }
  }

  const camposFormulario = (
    <div className="grid gap-5 md:grid-cols-2">
      <div>
        <label className="mb-2 block text-xs text-slate-400">Nombre completo *</label>
        <input name="nombre" value={formulario.nombre} onChange={actualizarCampo} maxLength={150} required placeholder="Nombre del cliente" className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#050d18] px-4 text-sm outline-none transition placeholder:text-slate-700 focus:border-cyan-400/30" />
      </div>
      <div>
        <label className="mb-2 block text-xs text-slate-400">Correo electrónico *</label>
        <input type="email" name="correo" value={formulario.correo} onChange={actualizarCampo} maxLength={150} required placeholder="cliente@correo.com" className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#050d18] px-4 text-sm outline-none transition placeholder:text-slate-700 focus:border-cyan-400/30" />
      </div>
      <div>
        <label className="mb-2 block text-xs text-slate-400">DUI</label>
        <input name="dui" value={formulario.dui} onChange={actualizarCampo} maxLength={20} placeholder="00000000-0" className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#050d18] px-4 text-sm outline-none transition placeholder:text-slate-700 focus:border-cyan-400/30" />
      </div>
      <div>
        <label className="mb-2 block text-xs text-slate-400">NIT</label>
        <input name="nit" value={formulario.nit} onChange={actualizarCampo} maxLength={30} placeholder="0000-000000-000-0" className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#050d18] px-4 text-sm outline-none transition placeholder:text-slate-700 focus:border-cyan-400/30" />
      </div>
      <div>
        <label className="mb-2 block text-xs text-slate-400">Empresa</label>
        <input name="empresa" value={formulario.empresa} onChange={actualizarCampo} maxLength={150} placeholder="Empresa o institución" className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#050d18] px-4 text-sm outline-none transition placeholder:text-slate-700 focus:border-cyan-400/30" />
      </div>
      <div>
        <label className="mb-2 block text-xs text-slate-400">Teléfono</label>
        <input name="telefono" value={formulario.telefono} onChange={actualizarCampo} maxLength={30} placeholder="7000-0000" className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#050d18] px-4 text-sm outline-none transition placeholder:text-slate-700 focus:border-cyan-400/30" />
      </div>
      <div className="md:col-span-2">
        <label className="mb-2 block text-xs text-slate-400">Dirección</label>
        <textarea name="direccion" value={formulario.direccion} onChange={actualizarCampo} maxLength={255} rows={3} placeholder="Dirección del cliente" className="w-full resize-none rounded-xl border border-white/[0.08] bg-[#050d18] px-4 py-3 text-sm outline-none transition placeholder:text-slate-700 focus:border-cyan-400/30" />
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#050b16] text-white">
      {/* DECORACIÓN */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-32 -top-32 h-[420px] w-[420px] rounded-full bg-cyan-400/[0.06] blur-[100px]" />

        <div className="absolute -bottom-40 left-1/4 h-[450px] w-[450px] rounded-full bg-blue-600/[0.05] blur-[110px]" />
      </div>

      <main className="relative mx-auto max-w-[1600px] px-5 py-8 md:px-8 lg:px-10">
        {/* ENCABEZADO */}

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
                <Users
                  size={15}
                  className="text-cyan-400"
                />

                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-400">
                  Gestión de clientes
                </p>
              </div>

              <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] md:text-4xl">
                Clientes
              </h1>

              <p className="mt-2 max-w-2xl text-sm text-slate-500">
                Consulta y administra los
                clientes registrados en el
                Centro de Formación
                Continua.
              </p>
            </div>
          </div>

         <motion.button
  onClick={() => setModalAbierto(true)}
  whileHover={{
    y: -2,
  }}
  whileTap={{
    scale: 0.98,
  }}
  className="flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 text-sm font-semibold text-[#04101c] shadow-[0_8px_30px_rgba(34,211,238,0.15)] transition hover:shadow-[0_10px_35px_rgba(34,211,238,0.25)]"
>
  <Plus size={18} />
  Nuevo cliente
</motion.button>
        </motion.header>

        {/* ESTADÍSTICA */}

        <section className="mt-8">
          <motion.article
            initial={{
              opacity: 0,
              y: 12,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.08,
            }}
            className="max-w-[300px] rounded-[22px] border border-white/[0.07] bg-[#081321] p-5"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/10 bg-cyan-400/[0.06] text-cyan-300">
                <Users size={20} />
              </div>

              <span className="rounded-full border border-emerald-400/10 bg-emerald-400/[0.06] px-2.5 py-1 text-[10px] font-medium text-emerald-400">
                REGISTRADOS
              </span>
            </div>

            <p className="mt-5 text-xs text-slate-500">
              Total de clientes
            </p>

            <p className="mt-1 text-3xl font-semibold tracking-tight">
              {clientes.length}
            </p>
          </motion.article>
        </section>

        {/* TABLA */}

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
          className="mt-6 overflow-hidden rounded-[24px] border border-white/[0.07] bg-[#081321]"
        >
          {/* TOOLBAR */}

          <div className="flex flex-col justify-between gap-4 border-b border-white/[0.06] p-5 md:flex-row md:items-center">
            <div>
              <h2 className="font-semibold">
                Directorio de clientes
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                {clientesFiltrados.length}{' '}
                registros encontrados
              </p>
            </div>

            <div className="relative w-full md:w-[340px]">
              <Search
                size={16}
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
                placeholder="Buscar cliente..."
                className="h-11 w-full rounded-xl border border-white/[0.07] bg-[#050d18] pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-cyan-400/30 focus:ring-2 focus:ring-cyan-400/[0.05]"
              />
            </div>
          </div>

          {/* CONTENIDO */}

          {cargando ? (
            <div className="flex min-h-[350px] items-center justify-center">
              <div className="text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-cyan-400/20 border-t-cyan-400" />

                <p className="mt-4 text-sm text-slate-500">
                  Cargando clientes...
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="flex min-h-[350px] items-center justify-center px-6 text-center">
              <div>
                <p className="text-sm font-medium text-red-300">
                  {error}
                </p>

                <p className="mt-2 text-xs text-slate-600">
                  Verifica la conexión con
                  el servidor.
                </p>
              </div>
            </div>
          ) : clientesFiltrados.length ===
            0 ? (
            <div className="flex min-h-[350px] items-center justify-center px-6">
              <div className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/[0.06] text-cyan-400">
                  <Users size={24} />
                </div>

                <p className="mt-4 text-sm font-medium">
                  No encontramos clientes
                </p>

                <p className="mt-1 text-xs text-slate-600">
                  Intenta con otra búsqueda.
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.055] text-left">
                    <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-600">
                      Cliente
                    </th>

                    <th className="px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-600">
                      Identificación
                    </th>

                    <th className="px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-600">
                      Contacto
                    </th>

                    <th className="px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-600">
                      Ubicación
                    </th>

                    <th className="px-5 py-4 text-right text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-600">
                      Acciones
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {clientesFiltrados.map(
                    (cliente, index) => (
                      <motion.tr
                        key={cliente.id}
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
                        className="group border-b border-white/[0.045] transition last:border-b-0 hover:bg-cyan-400/[0.025]"
                      >
                        {/* CLIENTE */}

                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-400/10 bg-cyan-400/[0.06] text-sm font-semibold text-cyan-300">
                              {cliente.nombre
                                ?.charAt(0)
                                ?.toUpperCase() ||
                                'C'}
                            </div>

                            <div className="min-w-0">
                              <p className="max-w-[230px] truncate text-sm font-medium text-slate-200">
                                {
                                  cliente.nombre
                                }
                              </p>

                              <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-600">
                                <Building2
                                  size={11}
                                />

                                <span className="max-w-[180px] truncate">
                                  {cliente.empresa ||
                                    'Sin empresa'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* IDENTIFICACIÓN */}

                        <td className="px-5 py-5">
                          <div className="space-y-1">
                            <p className="text-xs text-slate-400">
                              DUI:{' '}
                              <span className="text-slate-500">
                                {cliente.dui ||
                                  '—'}
                              </span>
                            </p>

                            <p className="text-[11px] text-slate-600">
                              NIT:{' '}
                              {cliente.nit ||
                                '—'}
                            </p>
                          </div>
                        </td>

                        {/* CONTACTO */}

                        <td className="px-5 py-5">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-xs text-slate-400">
                              <Mail
                                size={12}
                                className="text-slate-600"
                              />

                              <span className="max-w-[220px] truncate">
                                {cliente.correo ||
                                  'Sin correo'}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 text-[11px] text-slate-600">
                              <Phone
                                size={12}
                              />

                              {cliente.telefono ||
                                'Sin teléfono'}
                            </div>
                          </div>
                        </td>

                        {/* UBICACIÓN */}

                        <td className="px-5 py-5">
                          <div className="flex max-w-[220px] items-start gap-2 text-xs text-slate-500">
                            <MapPin
                              size={13}
                              className="mt-0.5 shrink-0 text-slate-600"
                            />

                            <span>
                              {cliente.direccion ||
                                'Sin dirección registrada'}
                            </span>
                          </div>
                        </td>

                        {/* ACCIONES */}

                        <td className="px-5 py-5 text-right">
                          <div className="relative inline-block text-left">
                            <button
                              title="Opciones"
                              onClick={() =>
                                setMenuClienteId((actual) =>
                                  actual === cliente.id ? null : cliente.id,
                                )
                              }
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-transparent text-slate-600 transition hover:border-white/[0.07] hover:bg-white/[0.035] hover:text-cyan-300"
                            >
                              <MoreHorizontal size={18} />
                            </button>

                            {menuClienteId === cliente.id && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.96, y: -4 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                className="absolute right-0 z-30 mt-2 w-44 overflow-hidden rounded-xl border border-white/[0.08] bg-[#0b1726] p-1.5 text-left shadow-2xl"
                              >
                                <button onClick={() => abrirDetalle(cliente)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-300 transition hover:bg-white/[0.05] hover:text-cyan-300">
                                  <Eye size={14} /> Ver detalles
                                </button>
                                <button onClick={() => abrirEdicion(cliente)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-300 transition hover:bg-white/[0.05] hover:text-cyan-300">
                                  <Pencil size={14} /> Editar
                                </button>
                                <button onClick={() => confirmarEliminar(cliente)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-red-300 transition hover:bg-red-400/[0.08]">
                                  <Trash2 size={14} /> Eliminar
                                </button>
                              </motion.div>
                            )}
                          </div>
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
            Gestión de Clientes
          </p>

          <p>UCA · 2026</p>
        </footer>
          </main>
          {modalAbierto && (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={cerrarModal}
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
      className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[26px] border border-white/[0.08] bg-[#081321] shadow-2xl"
    >
      <div className="border-b border-white/[0.06] px-6 py-5 md:px-7">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-400">
          Gestión de clientes
        </p>

        <h2 className="mt-2 text-xl font-semibold">
          Registrar nuevo cliente
        </h2>

        <p className="mt-1 text-xs text-slate-500">
          Ingresa la información del nuevo cliente.
        </p>
      </div>

      <form
        onSubmit={guardarCliente}
        className="p-6 md:p-7"
      >
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs text-slate-400">
              Nombre completo *
            </label>

            <input
              name="nombre"
              value={formulario.nombre}
              onChange={actualizarCampo}
              maxLength={150}
              required
              placeholder="Nombre del cliente"
              className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#050d18] px-4 text-sm outline-none transition placeholder:text-slate-700 focus:border-cyan-400/30"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs text-slate-400">
              Correo electrónico *
            </label>

            <input
              type="email"
              name="correo"
              value={formulario.correo}
              onChange={actualizarCampo}
              maxLength={150}
              required
              placeholder="cliente@correo.com"
              className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#050d18] px-4 text-sm outline-none transition placeholder:text-slate-700 focus:border-cyan-400/30"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs text-slate-400">
              DUI
            </label>

            <input
              name="dui"
              value={formulario.dui}
              onChange={actualizarCampo}
              maxLength={20}
              placeholder="00000000-0"
              className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#050d18] px-4 text-sm outline-none transition placeholder:text-slate-700 focus:border-cyan-400/30"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs text-slate-400">
              NIT
            </label>

            <input
              name="nit"
              value={formulario.nit}
              onChange={actualizarCampo}
              maxLength={30}
              placeholder="0000-000000-000-0"
              className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#050d18] px-4 text-sm outline-none transition placeholder:text-slate-700 focus:border-cyan-400/30"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs text-slate-400">
              Empresa
            </label>

            <input
              name="empresa"
              value={formulario.empresa}
              onChange={actualizarCampo}
              maxLength={150}
              placeholder="Empresa o institución"
              className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#050d18] px-4 text-sm outline-none transition placeholder:text-slate-700 focus:border-cyan-400/30"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs text-slate-400">
              Teléfono
            </label>

            <input
              name="telefono"
              value={formulario.telefono}
              onChange={actualizarCampo}
              maxLength={30}
              placeholder="7000-0000"
              className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#050d18] px-4 text-sm outline-none transition placeholder:text-slate-700 focus:border-cyan-400/30"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-xs text-slate-400">
              Dirección
            </label>

            <textarea
              name="direccion"
              value={formulario.direccion}
              onChange={actualizarCampo}
              maxLength={255}
              rows={3}
              placeholder="Dirección del cliente"
              className="w-full resize-none rounded-xl border border-white/[0.08] bg-[#050d18] px-4 py-3 text-sm outline-none transition placeholder:text-slate-700 focus:border-cyan-400/30"
            />
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
            onClick={cerrarModal}
            disabled={guardando}
            className="h-11 rounded-xl border border-white/[0.08] px-5 text-sm text-slate-400 transition hover:bg-white/[0.04] hover:text-white disabled:opacity-50"
          >
            Cancelar
          </button>

          <motion.button
            type="submit"
            disabled={guardando}
            whileHover={
              guardando ? {} : { y: -1 }
            }
            whileTap={
              guardando ? {} : { scale: 0.98 }
            }
            className="h-11 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-6 text-sm font-semibold text-[#04101c] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {guardando
              ? 'Registrando...'
              : 'Registrar cliente'}
          </motion.button>
        </div>
      </form>
    </motion.div>
  </div>
)}

      {clienteDetalle && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#02060c]/80 backdrop-blur-sm" onClick={() => setClienteDetalle(null)} />
          <motion.div initial={{ opacity: 0, scale: 0.96, y: 15 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="relative z-10 w-full max-w-xl rounded-[26px] border border-white/[0.08] bg-[#081321] p-6 shadow-2xl md:p-7">
            <button onClick={() => setClienteDetalle(null)} className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-white/[0.05] hover:text-white"><X size={18} /></button>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-400">Ficha del cliente</p>
            <h2 className="mt-2 pr-10 text-2xl font-semibold">{clienteDetalle.nombre}</h2>
            <p className="mt-1 text-xs text-slate-500">ID #{clienteDetalle.id}</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                ['Correo', clienteDetalle.correo],
                ['Teléfono', clienteDetalle.telefono],
                ['DUI', clienteDetalle.dui],
                ['NIT', clienteDetalle.nit],
                ['Empresa', clienteDetalle.empresa],
                ['Dirección', clienteDetalle.direccion],
              ].map(([etiqueta, valor]) => (
                <div key={etiqueta} className="rounded-xl border border-white/[0.06] bg-[#050d18] p-4">
                  <p className="text-[10px] uppercase tracking-[0.12em] text-slate-600">{etiqueta}</p>
                  <p className="mt-1 break-words text-sm text-slate-300">{valor || 'No registrado'}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {clienteEditando && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#02060c]/80 backdrop-blur-sm" onClick={cerrarEdicion} />
          <motion.div initial={{ opacity: 0, scale: 0.96, y: 15 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[26px] border border-white/[0.08] bg-[#081321] shadow-2xl">
            <div className="border-b border-white/[0.06] px-6 py-5 md:px-7">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-400">Gestión de clientes</p>
              <h2 className="mt-2 text-xl font-semibold">Editar cliente</h2>
              <p className="mt-1 text-xs text-slate-500">Actualiza la información registrada.</p>
            </div>
            <form onSubmit={actualizarCliente} className="p-6 md:p-7">
              {camposFormulario}
              {errorFormulario && <div className="mt-5 rounded-xl border border-red-400/10 bg-red-400/[0.05] px-4 py-3 text-xs text-red-300">{errorFormulario}</div>}
              <div className="mt-7 flex flex-col-reverse gap-3 border-t border-white/[0.06] pt-5 sm:flex-row sm:justify-end">
                <button type="button" onClick={cerrarEdicion} disabled={guardando} className="h-11 rounded-xl border border-white/[0.08] px-5 text-sm text-slate-400 transition hover:bg-white/[0.04] hover:text-white disabled:opacity-50">Cancelar</button>
                <motion.button type="submit" disabled={guardando} whileHover={guardando ? {} : { y: -1 }} whileTap={guardando ? {} : { scale: 0.98 }} className="h-11 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-6 text-sm font-semibold text-[#04101c] disabled:opacity-60">
                  {guardando ? 'Guardando...' : 'Guardar cambios'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {clienteEliminando && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#02060c]/85 backdrop-blur-sm" onClick={() => !procesandoEliminar && setClienteEliminando(null)} />
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 15 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="relative z-10 w-full max-w-md rounded-[26px] border border-red-400/10 bg-[#081321] p-7 text-center shadow-2xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-red-400/10 bg-red-400/[0.07] text-red-300"><AlertTriangle size={25} /></div>
            <h2 className="mt-5 text-xl font-semibold">¿Eliminar cliente?</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">Se eliminará a <span className="font-medium text-slate-300">{clienteEliminando.nombre}</span>. Esta acción no se puede deshacer.</p>
            <div className="mt-7 flex gap-3">
              <button onClick={() => setClienteEliminando(null)} disabled={procesandoEliminar} className="h-11 flex-1 rounded-xl border border-white/[0.08] text-sm text-slate-400 transition hover:bg-white/[0.04] disabled:opacity-50">Cancelar</button>
              <button onClick={eliminarCliente} disabled={procesandoEliminar} className="h-11 flex-1 rounded-xl bg-red-500/90 text-sm font-semibold text-white transition hover:bg-red-500 disabled:opacity-50">
                {procesandoEliminar ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  )
}

export default Clientes