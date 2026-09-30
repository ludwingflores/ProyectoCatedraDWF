import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  KeyRound,
  Mail,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  UserCheck,
  UserRound,
  UsersRound,
  UserX,
  X,
} from 'lucide-react'

import api from '../services/api'

const formularioVacio = {
  nombre: '',
  correo: '',
  password: '',
  rolId: '',
  activo: true,
}

function Usuarios() {
  const navigate = useNavigate()

  const [usuarios, setUsuarios] = useState([])
  const [roles, setRoles] = useState([])

  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  const [busqueda, setBusqueda] = useState('')
  const [filtroRol, setFiltroRol] = useState('')
  const [filtroActivo, setFiltroActivo] = useState('')

  const [pagina, setPagina] = useState(0)
  const [totalPaginas, setTotalPaginas] = useState(0)
  const [totalElementos, setTotalElementos] = useState(0)
  const [tamanoPagina] = useState(10)

  const [menuAbierto, setMenuAbierto] = useState(null)

  const [modalFormulario, setModalFormulario] = useState(false)
  const [usuarioEditando, setUsuarioEditando] = useState(null)
  const [usuarioDetalle, setUsuarioDetalle] = useState(null)
  const [usuarioEliminando, setUsuarioEliminando] = useState(null)

  const [formulario, setFormulario] = useState(formularioVacio)

  const [mostrarPassword, setMostrarPassword] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [eliminando, setEliminando] = useState(false)
  const [errorFormulario, setErrorFormulario] = useState('')

  useEffect(() => {
    cargarRoles()
  }, [])

  useEffect(() => {
    cargarUsuarios()
  }, [pagina, filtroRol, filtroActivo])

  const cargarRoles = async () => {
    try {
      const response = await api.get('/roles')
      setRoles(response.data || [])
    } catch (err) {
      console.error('Error cargando roles:', err)
    }
  }

  const cargarUsuarios = async () => {
    try {
      setCargando(true)
      setError('')

      const params = {
        page: pagina,
        size: tamanoPagina,
        sortBy: 'nombre',
        direction: 'asc',
      }

      if (filtroRol) {
        params.rolId = filtroRol
      }

      if (filtroActivo !== '') {
        params.activo = filtroActivo === 'true'
      }

      const response = await api.get('/usuarios/buscar', {
        params,
      })

      const data = response.data || {}

      setUsuarios(data.content || [])
      setTotalPaginas(data.totalPages || 0)
      setTotalElementos(data.totalElements || 0)
    } catch (err) {
      console.error('Error cargando usuarios:', err)
      setError('No fue posible cargar los usuarios.')
      setUsuarios([])
    } finally {
      setCargando(false)
    }
  }

  const usuariosFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase()

    if (!texto) return usuarios

    return usuarios.filter((usuario) =>
      [
        usuario.id,
        usuario.nombre,
        usuario.correo,
        usuario.rol?.nombre,
        usuario.activo ? 'activo' : 'inactivo',
      ].some((valor) =>
        String(valor ?? '')
          .toLowerCase()
          .includes(texto),
      ),
    )
  }, [usuarios, busqueda])

  const estadisticas = useMemo(() => {
    const activos = usuarios.filter(
      (usuario) => usuario.activo,
    ).length

    const inactivos = usuarios.filter(
      (usuario) => !usuario.activo,
    ).length

    const rolesPagina = new Set(
      usuarios
        .map((usuario) => usuario.rol?.id)
        .filter(Boolean),
    ).size

    return {
      total: totalElementos,
      activos,
      inactivos,
      rolesPagina,
    }
  }, [usuarios, totalElementos])

  const actualizarCampo = (event) => {
    const { name, value, type, checked } = event.target

    setFormulario((anterior) => ({
      ...anterior,
      [name]: type === 'checkbox' ? checked : value,
    }))

    setErrorFormulario('')
  }

  const cambiarFiltro = (setter, valor) => {
    setter(valor)
    setPagina(0)
  }

  const abrirNuevo = () => {
    setUsuarioEditando(null)

    setFormulario({
      ...formularioVacio,
      rolId: roles.length ? String(roles[0].id) : '',
    })

    setMostrarPassword(false)
    setErrorFormulario('')
    setModalFormulario(true)
  }

  const cerrarFormulario = () => {
    if (guardando) return

    setModalFormulario(false)
    setUsuarioEditando(null)
    setFormulario(formularioVacio)
    setMostrarPassword(false)
    setErrorFormulario('')
  }

  const abrirDetalle = async (usuario) => {
    setMenuAbierto(null)

    try {
      const response = await api.get(
        `/usuarios/${usuario.id}`,
      )

      setUsuarioDetalle(response.data)
    } catch (err) {
      console.error(err)
      setError('No fue posible consultar el usuario.')
    }
  }

  const abrirEditar = async (usuario) => {
    setMenuAbierto(null)

    try {
      const response = await api.get(
        `/usuarios/${usuario.id}`,
      )

      const data = response.data

      setUsuarioEditando(data)

      setFormulario({
        nombre: data.nombre || '',
        correo: data.correo || '',
        password: '',
        rolId: data.rol?.id ? String(data.rol.id) : '',
        activo: Boolean(data.activo),
      })

      setMostrarPassword(false)
      setErrorFormulario('')
      setModalFormulario(true)
    } catch (err) {
      console.error(err)

      setError(
        'No fue posible cargar el usuario para editar.',
      )
    }
  }

  const validarFormulario = () => {
    if (!formulario.nombre.trim()) {
      return 'El nombre es obligatorio.'
    }

    if (formulario.nombre.trim().length > 100) {
      return 'El nombre no puede superar los 100 caracteres.'
    }

    if (!formulario.correo.trim()) {
      return 'El correo es obligatorio.'
    }

    if (formulario.correo.trim().length > 150) {
      return 'El correo no puede superar los 150 caracteres.'
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formulario.correo.trim(),
      )
    ) {
      return 'Ingresa un correo electrónico válido.'
    }

    if (!formulario.password) {
      return usuarioEditando
        ? 'Debes ingresar la contraseña que tendrá el usuario después de guardar los cambios.'
        : 'La contraseña es obligatoria.'
    }

    if (formulario.password.length > 255) {
      return 'La contraseña no puede superar los 255 caracteres.'
    }

    if (!formulario.rolId) {
      return 'Debes seleccionar un rol.'
    }

    return ''
  }

  const construirPayload = () => {
    const rol = roles.find(
      (item) =>
        String(item.id) === String(formulario.rolId),
    )

    return {
      nombre: formulario.nombre.trim(),
      correo: formulario.correo.trim(),
      password: formulario.password,
      activo: formulario.activo,
      rol,
    }
  }

  const guardarUsuario = async (event) => {
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

      if (usuarioEditando) {
        await api.put(
          `/usuarios/${usuarioEditando.id}`,
          payload,
        )
      } else {
        await api.post('/usuarios', payload)
      }

      setModalFormulario(false)
      setUsuarioEditando(null)
      setFormulario(formularioVacio)

      await cargarUsuarios()
    } catch (err) {
      console.error('Error guardando usuario:', err)

      const data = err.response?.data

      const mensaje =
        typeof data === 'string'
          ? data
          : data?.message ||
            data?.mensaje ||
            data?.error

      setErrorFormulario(
        mensaje ||
          'No fue posible guardar el usuario. Verifica los datos ingresados.',
      )
    } finally {
      setGuardando(false)
    }
  }

  const eliminarUsuario = async () => {
    if (!usuarioEliminando) return

    try {
      setEliminando(true)

      await api.delete(
        `/usuarios/${usuarioEliminando.id}`,
      )

      setUsuarioEliminando(null)

      if (usuarios.length === 1 && pagina > 0) {
        setPagina((anterior) => anterior - 1)
      } else {
        await cargarUsuarios()
      }
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
        mensaje || 'No fue posible eliminar el usuario.',
      )

      setUsuarioEliminando(null)
    } finally {
      setEliminando(false)
    }
  }

  const claseRol = (rol) => {
    switch (rol?.toUpperCase()) {
      case 'ADMIN':
        return 'border-cyan-400/15 bg-cyan-400/[0.07] text-cyan-300'
      case 'RECEPCIONISTA':
        return 'border-blue-400/15 bg-blue-400/[0.07] text-blue-300'
      case 'CONTABILIDAD':
        return 'border-violet-400/15 bg-violet-400/[0.07] text-violet-300'
      case 'CLIENTE':
        return 'border-emerald-400/15 bg-emerald-400/[0.07] text-emerald-300'
      default:
        return 'border-white/10 bg-white/[0.04] text-slate-300'
    }
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
                <ShieldCheck
                  size={15}
                  className="text-cyan-400"
                />

                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-400">
                  Administración del sistema
                </p>
              </div>

              <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] md:text-4xl">
                Usuarios
              </h1>

              <p className="mt-2 max-w-2xl text-sm text-slate-500">
                Administra las cuentas, roles y estados de
                acceso de los usuarios del sistema.
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
            Nuevo usuario
          </motion.button>
        </motion.header>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Kpi
            icono={UsersRound}
            label="Usuarios registrados"
            valor={estadisticas.total}
            tag="TOTAL"
            delay={0}
          />

          <Kpi
            icono={UserCheck}
            label="Activos en esta página"
            valor={estadisticas.activos}
            tag="ACTIVOS"
            delay={0.05}
          />

          <Kpi
            icono={UserX}
            label="Inactivos en esta página"
            valor={estadisticas.inactivos}
            tag="INACTIVOS"
            delay={0.1}
          />

          <Kpi
            icono={ShieldCheck}
            label="Roles en esta página"
            valor={estadisticas.rolesPagina}
            tag="ROLES"
            delay={0.15}
          />
        </section>

        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          className="mt-6 overflow-visible rounded-[24px] border border-white/[0.07] bg-[#081321]"
        >
          <div className="border-b border-white/[0.06] p-5">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
                <div>
                  <h2 className="font-semibold">
                    Directorio de usuarios
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    {totalElementos} usuarios encontrados
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
                      setBusqueda(event.target.value)
                    }
                    placeholder="Buscar en esta página..."
                    className="h-11 w-full rounded-xl border border-white/[0.07] bg-[#050d18] pl-11 pr-4 text-sm outline-none placeholder:text-slate-700 focus:border-cyan-400/30"
                  />
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <select
                  value={filtroRol}
                  onChange={(event) =>
                    cambiarFiltro(
                      setFiltroRol,
                      event.target.value,
                    )
                  }
                  className="h-11 rounded-xl border border-white/[0.07] bg-[#050d18] px-4 text-xs text-slate-400 outline-none focus:border-cyan-400/30"
                >
                  <option value="">
                    Todos los roles
                  </option>

                  {roles.map((rol) => (
                    <option key={rol.id} value={rol.id}>
                      {rol.nombre}
                    </option>
                  ))}
                </select>

                <select
                  value={filtroActivo}
                  onChange={(event) =>
                    cambiarFiltro(
                      setFiltroActivo,
                      event.target.value,
                    )
                  }
                  className="h-11 rounded-xl border border-white/[0.07] bg-[#050d18] px-4 text-xs text-slate-400 outline-none focus:border-cyan-400/30"
                >
                  <option value="">
                    Todos los estados
                  </option>
                  <option value="true">Activos</option>
                  <option value="false">Inactivos</option>
                </select>
              </div>
            </div>
          </div>

          {cargando ? (
            <EstadoCarga texto="Cargando usuarios..." />
          ) : error ? (
            <div className="flex min-h-[350px] items-center justify-center px-6 text-center">
              <p className="text-sm text-red-300">
                {error}
              </p>
            </div>
          ) : usuariosFiltrados.length === 0 ? (
            <div className="flex min-h-[350px] items-center justify-center text-center">
              <div>
                <UsersRound
                  size={38}
                  className="mx-auto text-cyan-400"
                />
                <p className="mt-4 text-sm">
                  No hay usuarios para mostrar
                </p>
                <p className="mt-1 text-xs text-slate-600">
                  Crea un usuario o cambia los filtros.
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px]">
                <thead>
                  <tr className="border-b border-white/[0.055] text-left">
                    {[
                      'Usuario',
                      'Correo',
                      'Rol',
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
                  {usuariosFiltrados.map(
                    (usuario, index) => (
                      <motion.tr
                        key={usuario.id}
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
                              <UserRound size={17} />
                            </div>

                            <div>
                              <p className="text-sm font-medium text-slate-200">
                                {usuario.nombre}
                              </p>
                              <p className="mt-1 text-[11px] text-slate-600">
                                ID #{usuario.id}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-5">
                          <div className="flex items-center gap-2 text-xs text-slate-400">
                            <Mail size={14} />
                            {usuario.correo}
                          </div>
                        </td>

                        <td className="px-5 py-5">
                          <span
                            className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-medium ${claseRol(
                              usuario.rol?.nombre,
                            )}`}
                          >
                            {usuario.rol?.nombre || 'SIN ROL'}
                          </span>
                        </td>

                        <td className="px-5 py-5">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-medium ${
                              usuario.activo
                                ? 'border-emerald-400/15 bg-emerald-400/[0.07] text-emerald-300'
                                : 'border-red-400/15 bg-red-400/[0.07] text-red-300'
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                usuario.activo
                                  ? 'bg-emerald-400'
                                  : 'bg-red-400'
                              }`}
                            />
                            {usuario.activo
                              ? 'ACTIVO'
                              : 'INACTIVO'}
                          </span>
                        </td>

                        <td className="relative px-5 py-5 text-right">
                          <button
                            onClick={() =>
                              setMenuAbierto(
                                menuAbierto === usuario.id
                                  ? null
                                  : usuario.id,
                              )
                            }
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 hover:bg-white/[0.04] hover:text-cyan-300"
                          >
                            <MoreHorizontal size={18} />
                          </button>

                          {menuAbierto === usuario.id && (
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
                                  abrirDetalle(usuario)
                                }
                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-300 hover:bg-white/[0.05] hover:text-cyan-300"
                              >
                                <Eye size={14} />
                                Ver detalles
                              </button>

                              <button
                                onClick={() =>
                                  abrirEditar(usuario)
                                }
                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-300 hover:bg-white/[0.05] hover:text-cyan-300"
                              >
                                <Pencil size={14} />
                                Editar
                              </button>

                              <button
                                onClick={() => {
                                  setMenuAbierto(null)
                                  setUsuarioEliminando(
                                    usuario,
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

          {!cargando &&
            !error &&
            totalPaginas > 0 && (
              <div className="flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] px-5 py-4 sm:flex-row">
                <p className="text-xs text-slate-600">
                  Página {pagina + 1} de {totalPaginas} ·{' '}
                  {totalElementos} usuarios
                </p>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setPagina((actual) =>
                        Math.max(actual - 1, 0),
                      )
                    }
                    disabled={pagina === 0}
                    className="flex h-9 items-center gap-1 rounded-lg border border-white/[0.07] px-3 text-xs text-slate-400 hover:bg-white/[0.04] disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <ChevronLeft size={15} />
                    Anterior
                  </button>

                  <div className="flex h-9 min-w-9 items-center justify-center rounded-lg border border-cyan-400/15 bg-cyan-400/[0.06] px-3 text-xs text-cyan-300">
                    {pagina + 1}
                  </div>

                  <button
                    onClick={() =>
                      setPagina((actual) =>
                        Math.min(
                          actual + 1,
                          totalPaginas - 1,
                        ),
                      )
                    }
                    disabled={
                      pagina >= totalPaginas - 1
                    }
                    className="flex h-9 items-center gap-1 rounded-lg border border-white/[0.07] px-3 text-xs text-slate-400 hover:bg-white/[0.04] disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    Siguiente
                    <ChevronRight size={15} />
                  </button>
                </div>
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
                  Administración
                </p>

                <h2 className="mt-2 text-xl font-semibold">
                  {usuarioEditando
                    ? 'Editar usuario'
                    : 'Registrar usuario'}
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
              onSubmit={guardarUsuario}
              className="p-6"
            >
              {usuarioEditando && (
                <div className="mb-5 rounded-xl border border-amber-400/10 bg-amber-400/[0.04] px-4 py-3 text-xs leading-5 text-amber-200/80">
                  Al editar este usuario debes ingresar la
                  contraseña que tendrá después de guardar los
                  cambios.
                </div>
              )}

              <div className="grid gap-5 md:grid-cols-2">
                <CampoInput
                  label="Nombre *"
                  name="nombre"
                  value={formulario.nombre}
                  onChange={actualizarCampo}
                  maxLength={100}
                  placeholder="Nombre completo"
                />

                <CampoInput
                  label="Correo electrónico *"
                  name="correo"
                  type="email"
                  value={formulario.correo}
                  onChange={actualizarCampo}
                  maxLength={150}
                  placeholder="usuario@correo.com"
                />

                <div>
                  <label className="mb-2 block text-xs text-slate-400">
                    {usuarioEditando
                      ? 'Nueva contraseña *'
                      : 'Contraseña *'}
                  </label>

                  <div className="relative">
                    <KeyRound
                      size={15}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
                    />

                    <input
                      type={
                        mostrarPassword
                          ? 'text'
                          : 'password'
                      }
                      name="password"
                      value={formulario.password}
                      onChange={actualizarCampo}
                      maxLength={255}
                      autoComplete="new-password"
                      placeholder={
                        usuarioEditando
                          ? 'Ingresa la contraseña que tendrá'
                          : 'Ingresa una contraseña'
                      }
                      className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#050d18] pl-11 pr-11 text-sm text-slate-300 outline-none placeholder:text-slate-700 focus:border-cyan-400/30"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setMostrarPassword(
                          (actual) => !actual,
                        )
                      }
                      className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-600 hover:text-cyan-300"
                    >
                      {mostrarPassword ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  </div>
                </div>

                <CampoSelect
                  label="Rol *"
                  name="rolId"
                  value={formulario.rolId}
                  onChange={actualizarCampo}
                >
                  <option value="">
                    Selecciona un rol
                  </option>

                  {roles.map((rol) => (
                    <option key={rol.id} value={rol.id}>
                      {rol.nombre}
                    </option>
                  ))}
                </CampoSelect>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-xs text-slate-400">
                    Estado de la cuenta
                  </label>

                  <label className="flex cursor-pointer items-center justify-between rounded-xl border border-white/[0.08] bg-[#050d18] px-4 py-4">
                    <div>
                      <p className="text-sm text-slate-300">
                        Usuario activo
                      </p>

                      <p className="mt-1 text-[11px] text-slate-600">
                        Define si la cuenta permanece habilitada
                        en el sistema.
                      </p>
                    </div>

                    <input
                      type="checkbox"
                      name="activo"
                      checked={formulario.activo}
                      onChange={actualizarCampo}
                      className="h-4 w-4 accent-cyan-400"
                    />
                  </label>
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
                    : usuarioEditando
                      ? 'Guardar cambios'
                      : 'Crear usuario'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {usuarioDetalle && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div
            onClick={() => setUsuarioDetalle(null)}
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
              onClick={() => setUsuarioDetalle(null)}
              className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-white/[0.05] hover:text-white"
            >
              <X size={18} />
            </button>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.06] text-cyan-300">
              <UserRound size={22} />
            </div>

            <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-400">
              Perfil del usuario
            </p>

            <h2 className="mt-2 text-2xl font-semibold">
              {usuarioDetalle.nombre}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              ID #{usuarioDetalle.id}
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <DetalleCard
                icono={Mail}
                titulo="Correo"
                valor={usuarioDetalle.correo}
              />

              <DetalleCard
                icono={ShieldCheck}
                titulo="Rol"
                valor={
                  usuarioDetalle.rol?.nombre ||
                  'Sin rol'
                }
              />

              <DetalleCard
                icono={
                  usuarioDetalle.activo
                    ? CheckCircle2
                    : UserX
                }
                titulo="Estado"
                valor={
                  usuarioDetalle.activo
                    ? 'Activo'
                    : 'Inactivo'
                }
              />

              <DetalleCard
                icono={KeyRound}
                titulo="Seguridad"
                valor="Contraseña protegida"
              />
            </div>
          </motion.div>
        </div>
      )}

      {usuarioEliminando && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div
            onClick={() =>
              !eliminando &&
              setUsuarioEliminando(null)
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
              ¿Eliminar usuario?
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Se eliminará la cuenta de{' '}
              <span className="font-medium text-slate-300">
                {usuarioEliminando.nombre}
              </span>
              . Esta acción no se puede deshacer.
            </p>

            <div className="mt-7 flex gap-3">
              <button
                onClick={() =>
                  setUsuarioEliminando(null)
                }
                disabled={eliminando}
                className="h-11 flex-1 rounded-xl border border-white/[0.08] text-sm text-slate-400 hover:bg-white/[0.04]"
              >
                Cancelar
              </button>

              <button
                onClick={eliminarUsuario}
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

function Kpi({
  icono: Icono,
  label,
  valor,
  tag,
  delay,
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
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

function EstadoCarga({ texto }) {
  return (
    <div className="flex min-h-[350px] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-cyan-400/20 border-t-cyan-400" />

        <p className="mt-4 text-sm text-slate-500">
          {texto}
        </p>
      </div>
    </div>
  )
}

export default Usuarios