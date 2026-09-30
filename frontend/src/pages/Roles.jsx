import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  Eye,
  KeyRound,
  LockKeyhole,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Shield,
  ShieldCheck,
  Trash2,
  UsersRound,
  X,
} from 'lucide-react'

import api from '../services/api'

const formularioVacio = {
  nombre: '',
}

const accesosPorRol = {
  ADMIN: {
    descripcion: 'Administración completa del sistema.',
    accesos: [
      'Usuarios y roles',
      'Pagos',
      'Catálogos académicos',
      'Clientes',
      'Agenda',
      'Cursos y diplomados',
      'Inscripciones',
      'Cotizaciones',
      'Alquileres',
      'Catering',
    ],
  },

  RECEPCIONISTA: {
    descripcion: 'Gestión de información operativa.',
    accesos: [
      'Consultas operativas',
      'Clientes',
      'Agenda',
      'Cursos y diplomados',
      'Inscripciones',
      'Cotizaciones',
      'Alquileres',
      'Catering',
    ],
  },

  CONTABILIDAD: {
    descripcion: 'Consulta operativa y gestión de pagos.',
    accesos: [
      'Pagos',
      'Consultas operativas',
      'Clientes',
      'Agenda',
      'Cursos y diplomados',
      'Inscripciones',
      'Cotizaciones',
      'Alquileres',
      'Catering',
    ],
  },

  CLIENTE: {
    descripcion: 'Acceso a operaciones permitidas para clientes.',
    accesos: [
      'Consultas operativas permitidas',
      'Cotizaciones propias',
      'Alquileres propios',
      'Catering propio',
    ],
  },
}

function Roles() {
  const navigate = useNavigate()

  const [roles, setRoles] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [busqueda, setBusqueda] = useState('')

  const [menuAbierto, setMenuAbierto] = useState(null)

  const [modalFormulario, setModalFormulario] =
    useState(false)

  const [rolEditando, setRolEditando] =
    useState(null)

  const [rolDetalle, setRolDetalle] =
    useState(null)

  const [rolEliminando, setRolEliminando] =
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
    cargarRoles()
  }, [])

  const cargarRoles = async () => {
    try {
      setCargando(true)
      setError('')

      const response = await api.get('/roles')

      setRoles(response.data || [])
    } catch (err) {
      console.error(
        'Error cargando roles:',
        err,
      )

      setError(
        'No fue posible cargar los roles.',
      )

      setRoles([])
    } finally {
      setCargando(false)
    }
  }

  const rolesFiltrados = useMemo(() => {
    const texto = busqueda
      .trim()
      .toLowerCase()

    if (!texto) return roles

    return roles.filter((rol) =>
      [
        rol.id,
        rol.nombre,
      ].some((valor) =>
        String(valor ?? '')
          .toLowerCase()
          .includes(texto),
      ),
    )
  }, [roles, busqueda])

  const rolesSistema = useMemo(
    () =>
      roles.filter((rol) =>
        Object.prototype.hasOwnProperty.call(
          accesosPorRol,
          rol.nombre?.toUpperCase(),
        ),
      ).length,
    [roles],
  )

  const abrirNuevo = () => {
    setRolEditando(null)
    setFormulario(formularioVacio)
    setErrorFormulario('')
    setModalFormulario(true)
  }

  const cerrarFormulario = () => {
    if (guardando) return

    setModalFormulario(false)
    setRolEditando(null)
    setFormulario(formularioVacio)
    setErrorFormulario('')
  }

  const actualizarCampo = (event) => {
    setFormulario({
      nombre: event.target.value,
    })

    setErrorFormulario('')
  }

  const abrirDetalle = async (rol) => {
    setMenuAbierto(null)

    try {
      const response = await api.get(
        `/roles/${rol.id}`,
      )

      setRolDetalle(response.data)
    } catch (err) {
      console.error(err)

      setError(
        'No fue posible consultar el rol.',
      )
    }
  }

  const abrirEditar = async (rol) => {
    setMenuAbierto(null)

    try {
      const response = await api.get(
        `/roles/${rol.id}`,
      )

      setRolEditando(response.data)

      setFormulario({
        nombre:
          response.data.nombre || '',
      })

      setErrorFormulario('')
      setModalFormulario(true)
    } catch (err) {
      console.error(err)

      setError(
        'No fue posible cargar el rol para editar.',
      )
    }
  }

  const validarFormulario = () => {
    const nombre =
      formulario.nombre.trim()

    if (!nombre) {
      return 'El nombre del rol es obligatorio.'
    }

    if (nombre.length > 50) {
      return 'El nombre no puede superar los 50 caracteres.'
    }

    return ''
  }

  const guardarRol = async (event) => {
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

      const payload = {
        nombre: formulario.nombre
          .trim()
          .toUpperCase(),
      }

      if (rolEditando) {
        await api.put(
          `/roles/${rolEditando.id}`,
          payload,
        )
      } else {
        await api.post(
          '/roles',
          payload,
        )
      }

      setModalFormulario(false)
      setRolEditando(null)
      setFormulario(formularioVacio)

      await cargarRoles()
    } catch (err) {
      console.error(
        'Error guardando rol:',
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
          'No fue posible guardar el rol.',
      )
    } finally {
      setGuardando(false)
    }
  }

  const eliminarRol = async () => {
    if (!rolEliminando) return

    try {
      setEliminando(true)

      await api.delete(
        `/roles/${rolEliminando.id}`,
      )

      setRolEliminando(null)

      await cargarRoles()
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
          'No fue posible eliminar el rol. Puede estar asignado a uno o más usuarios.',
      )

      setRolEliminando(null)
    } finally {
      setEliminando(false)
    }
  }

  const obtenerInformacionRol = (
    nombre,
  ) =>
    accesosPorRol[
      nombre?.toUpperCase()
    ] || {
      descripcion:
        'Rol registrado en el sistema.',
      accesos: [
        'Los permisos efectivos dependen de la configuración de seguridad del backend.',
      ],
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
                <ShieldCheck
                  size={15}
                  className="text-cyan-400"
                />

                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-400">
                  Seguridad y acceso
                </p>
              </div>

              <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] md:text-4xl">
                Roles
              </h1>

              <p className="mt-2 max-w-2xl text-sm text-slate-500">
                Administra los roles del sistema y
                consulta su alcance de acceso.
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
            Nuevo rol
          </motion.button>
        </motion.header>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <Kpi
            icono={Shield}
            label="Roles registrados"
            valor={roles.length}
            tag="TOTAL"
            delay={0}
          />

          <Kpi
            icono={ShieldCheck}
            label="Roles base reconocidos"
            valor={rolesSistema}
            tag="SEGURIDAD"
            delay={0.05}
          />

          <Kpi
            icono={LockKeyhole}
            label="Protección"
            valor="JWT"
            tag="ACTIVA"
            delay={0.1}
          />
        </section>

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
          className="mt-6 overflow-visible rounded-[24px] border border-white/[0.07] bg-[#081321]"
        >
          <div className="flex flex-col justify-between gap-4 border-b border-white/[0.06] p-5 md:flex-row md:items-end">
            <div>
              <h2 className="font-semibold">
                Roles del sistema
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                {roles.length} registros
              </p>
            </div>

            <div className="relative md:w-[340px]">
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
                placeholder="Buscar rol..."
                className="h-11 w-full rounded-xl border border-white/[0.07] bg-[#050d18] pl-11 pr-4 text-sm outline-none placeholder:text-slate-700 focus:border-cyan-400/30"
              />
            </div>
          </div>

          {cargando ? (
            <EstadoCarga />
          ) : error ? (
            <div className="flex min-h-[300px] items-center justify-center px-6 text-center">
              <p className="text-sm text-red-300">
                {error}
              </p>
            </div>
          ) : rolesFiltrados.length ===
            0 ? (
            <div className="flex min-h-[300px] items-center justify-center text-center">
              <div>
                <Shield
                  size={38}
                  className="mx-auto text-cyan-400"
                />

                <p className="mt-4 text-sm">
                  No hay roles para mostrar
                </p>

                <p className="mt-1 text-xs text-slate-600">
                  Crea un rol o cambia la
                  búsqueda.
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px]">
                <thead>
                  <tr className="border-b border-white/[0.055] text-left">
                    <th className="px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-600">
                      Rol
                    </th>

                    <th className="px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-600">
                      Descripción de acceso
                    </th>

                    <th className="px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-600">
                      Tipo
                    </th>

                    <th className="px-5 py-4 text-right text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-600">
                      Acciones
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {rolesFiltrados.map(
                    (rol, index) => {
                      const info =
                        obtenerInformacionRol(
                          rol.nombre,
                        )

                      const esBase =
                        Boolean(
                          accesosPorRol[
                            rol.nombre?.toUpperCase()
                          ],
                        )

                      return (
                        <motion.tr
                          key={rol.id}
                          initial={{
                            opacity: 0,
                          }}
                          animate={{
                            opacity: 1,
                          }}
                          transition={{
                            delay:
                              index * 0.03,
                          }}
                          className="border-b border-white/[0.045] transition last:border-0 hover:bg-cyan-400/[0.025]"
                        >
                          <td className="px-5 py-5">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/10 bg-cyan-400/[0.06] text-cyan-300">
                                <ShieldCheck
                                  size={17}
                                />
                              </div>

                              <div>
                                <p className="text-sm font-medium text-slate-200">
                                  {rol.nombre}
                                </p>

                                <p className="mt-1 text-[11px] text-slate-600">
                                  ID #{rol.id}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-5">
                            <p className="max-w-lg text-xs leading-5 text-slate-500">
                              {
                                info.descripcion
                              }
                            </p>
                          </td>

                          <td className="px-5 py-5">
                            <span
                              className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-medium ${
                                esBase
                                  ? 'border-cyan-400/15 bg-cyan-400/[0.07] text-cyan-300'
                                  : 'border-white/10 bg-white/[0.04] text-slate-400'
                              }`}
                            >
                              {esBase
                                ? 'ROL BASE'
                                : 'PERSONALIZADO'}
                            </span>
                          </td>

                          <td className="relative px-5 py-5 text-right">
                            <button
                              onClick={() =>
                                setMenuAbierto(
                                  menuAbierto ===
                                    rol.id
                                    ? null
                                    : rol.id,
                                )
                              }
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 hover:bg-white/[0.04] hover:text-cyan-300"
                            >
                              <MoreHorizontal
                                size={18}
                              />
                            </button>

                            {menuAbierto ===
                              rol.id && (
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
                                      rol,
                                    )
                                  }
                                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-300 hover:bg-white/[0.05] hover:text-cyan-300"
                                >
                                  <Eye
                                    size={14}
                                  />
                                  Ver accesos
                                </button>

                                <button
                                  onClick={() =>
                                    abrirEditar(
                                      rol,
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

                                    setRolEliminando(
                                      rol,
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
        </motion.section>

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
            delay: 0.2,
          }}
          className="mt-6 rounded-[24px] border border-white/[0.07] bg-[#081321] p-5 md:p-6"
        >
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-400/10 bg-cyan-400/[0.06] text-cyan-300">
              <KeyRound size={18} />
            </div>

            <div>
              <h2 className="font-semibold">
                Control de acceso
              </h2>

              <p className="mt-1 max-w-3xl text-xs leading-5 text-slate-500">
                Esta matriz describe los
                accesos configurados para los
                roles base. La autorización
                efectiva se aplica en el
                backend mediante Spring
                Security y JWT.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
            {Object.entries(
              accesosPorRol,
            ).map(
              ([nombre, info]) => (
                <div
                  key={nombre}
                  className="rounded-2xl border border-white/[0.06] bg-[#050d18] p-5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/10 bg-cyan-400/[0.06] text-cyan-300">
                      <Shield
                        size={17}
                      />
                    </div>

                    <span className="rounded-full border border-cyan-400/10 bg-cyan-400/[0.04] px-2 py-1 text-[9px] text-cyan-400">
                      BASE
                    </span>
                  </div>

                  <h3 className="mt-4 text-sm font-semibold">
                    {nombre}
                  </h3>

                  <p className="mt-1 min-h-[40px] text-[11px] leading-5 text-slate-600">
                    {info.descripcion}
                  </p>

                  <div className="mt-4 space-y-2">
                    {info.accesos.map(
                      (acceso) => (
                        <div
                          key={acceso}
                          className="flex items-start gap-2"
                        >
                          <Check
                            size={13}
                            className="mt-0.5 shrink-0 text-cyan-400"
                          />

                          <span className="text-[11px] leading-4 text-slate-500">
                            {acceso}
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              ),
            )}
          </div>
        </motion.section>
      </main>

      {modalFormulario && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={
              cerrarFormulario
            }
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
            className="relative z-10 w-full max-w-lg rounded-[28px] border border-white/[0.08] bg-[#081321] shadow-2xl"
          >
            <div className="flex items-start justify-between border-b border-white/[0.06] px-6 py-5">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-400">
                  Seguridad
                </p>

                <h2 className="mt-2 text-xl font-semibold">
                  {rolEditando
                    ? 'Editar rol'
                    : 'Registrar rol'}
                </h2>
              </div>

              <button
                onClick={
                  cerrarFormulario
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-white/[0.04] hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={guardarRol}
              className="p-6"
            >
              <label className="mb-2 block text-xs text-slate-400">
                Nombre del rol *
              </label>

              <input
                value={
                  formulario.nombre
                }
                onChange={
                  actualizarCampo
                }
                maxLength={50}
                placeholder="Ej. ADMIN"
                className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#050d18] px-4 text-sm uppercase text-slate-300 outline-none placeholder:normal-case placeholder:text-slate-700 focus:border-cyan-400/30"
              />

              <p className="mt-2 text-[10px] leading-4 text-slate-600">
                El nombre se guardará en
                mayúsculas.
              </p>

              {errorFormulario && (
                <div className="mt-5 rounded-xl border border-red-400/10 bg-red-400/[0.05] px-4 py-3 text-xs leading-5 text-red-300">
                  {errorFormulario}
                </div>
              )}

              <div className="mt-7 flex gap-3 border-t border-white/[0.06] pt-5">
                <button
                  type="button"
                  onClick={
                    cerrarFormulario
                  }
                  disabled={guardando}
                  className="h-11 flex-1 rounded-xl border border-white/[0.08] text-sm text-slate-400 hover:bg-white/[0.04]"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={guardando}
                  className="h-11 flex-1 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-sm font-semibold text-[#04101c] disabled:opacity-60"
                >
                  {guardando
                    ? 'Guardando...'
                    : rolEditando
                      ? 'Guardar cambios'
                      : 'Crear rol'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {rolDetalle && (
        <DetalleRol
          rol={rolDetalle}
          cerrar={() =>
            setRolDetalle(null)
          }
          info={obtenerInformacionRol(
            rolDetalle.nombre,
          )}
        />
      )}

      {rolEliminando && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div
            onClick={() =>
              !eliminando &&
              setRolEliminando(null)
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
              <AlertTriangle
                size={25}
              />
            </div>

            <h2 className="mt-5 text-xl font-semibold">
              ¿Eliminar rol?
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Se intentará eliminar el rol{' '}
              <span className="font-medium text-slate-300">
                {rolEliminando.nombre}
              </span>
              . Si está relacionado con
              usuarios, el backend puede
              impedir la operación.
            </p>

            <div className="mt-7 flex gap-3">
              <button
                onClick={() =>
                  setRolEliminando(null)
                }
                disabled={eliminando}
                className="h-11 flex-1 rounded-xl border border-white/[0.08] text-sm text-slate-400 hover:bg-white/[0.04]"
              >
                Cancelar
              </button>

              <button
                onClick={eliminarRol}
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

function DetalleRol({
  rol,
  cerrar,
  info,
}) {
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
        className="relative z-10 max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-[28px] border border-white/[0.08] bg-[#081321] p-7 shadow-2xl"
      >
        <button
          onClick={cerrar}
          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-white/[0.05] hover:text-white"
        >
          <X size={18} />
        </button>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.06] text-cyan-300">
          <ShieldCheck size={22} />
        </div>

        <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-400">
          Detalle del rol
        </p>

        <h2 className="mt-2 text-2xl font-semibold">
          {rol.nombre}
        </h2>

        <p className="mt-1 text-xs text-slate-600">
          ID #{rol.id}
        </p>

        <div className="mt-6 rounded-xl border border-white/[0.06] bg-[#050d18] p-4">
          <p className="text-xs leading-5 text-slate-500">
            {info.descripcion}
          </p>
        </div>

        <h3 className="mt-6 text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
          Alcance configurado
        </h3>

        <div className="mt-3 space-y-2">
          {info.accesos.map(
            (acceso) => (
              <div
                key={acceso}
                className="flex items-start gap-3 rounded-xl border border-white/[0.05] bg-[#050d18] px-4 py-3"
              >
                <Check
                  size={15}
                  className="mt-0.5 shrink-0 text-cyan-400"
                />

                <span className="text-xs leading-5 text-slate-400">
                  {acceso}
                </span>
              </div>
            ),
          )}
        </div>

        <div className="mt-5 rounded-xl border border-amber-400/10 bg-amber-400/[0.035] px-4 py-3 text-[11px] leading-5 text-amber-200/70">
          Esta vista es informativa. Los
          permisos efectivos se aplican en
          Spring Security.
        </div>
      </motion.div>
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
    <div className="flex min-h-[300px] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-cyan-400/20 border-t-cyan-400" />

        <p className="mt-4 text-sm text-slate-500">
          Cargando roles...
        </p>
      </div>
    </div>
  )
}

export default Roles