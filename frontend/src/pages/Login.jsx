import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  BookOpen,
  Eye,
  EyeOff,
  GraduationCap,
  LoaderCircle,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import api from '../services/api'

function Login() {
  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(false)
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()

    setError('')
    setLoading(true)

    try {
      const response = await api.post('/auth/login', {
        correo: correo.trim(),
        password,
      })

      const data = response.data

      localStorage.setItem('token', data.token)
      localStorage.setItem('usuario', JSON.stringify(data))

      navigate('/dashboard')
    } catch (err) {
      console.error('Error al iniciar sesión:', err)

      if (err.response?.status === 401) {
        setError('Correo o contraseña incorrectos.')
      } else if (err.response?.data?.message) {
        setError(err.response.data.message)
      } else if (err.request) {
        setError('No fue posible conectar con el servidor.')
      } else {
        setError('Ocurrió un error al iniciar sesión.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050b16] text-white">
      {/* Fondo decorativo */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[120px]" />

        <div className="absolute -bottom-52 right-0 h-[600px] w-[600px] rounded-full bg-blue-600/10 blur-[150px]" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)',
            backgroundSize: '42px 42px',
          }}
        />

        <motion.div
          animate={{
            opacity: [0.4, 1, 0.4],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
          }}
          className="absolute left-[8%] top-[18%] h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_25px_#22d3ee]"
        />

        <motion.div
          animate={{
            opacity: [0.3, 0.9, 0.3],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            delay: 1,
          }}
          className="absolute left-[43%] top-[76%] h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_20px_#60a5fa]"
        />

        <motion.div
          animate={{
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            delay: 0.5,
          }}
          className="absolute right-[10%] top-[15%] h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_20px_#67e8f9]"
        />
      </div>

      <div className="relative z-10 grid min-h-screen lg:grid-cols-[1.1fr_.9fr]">
        {/* PANEL IZQUIERDO */}
        <section className="relative hidden min-h-screen flex-col justify-between overflow-hidden border-r border-white/[0.06] p-12 lg:flex xl:p-16">
          {/* Marca */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 shadow-[0_0_35px_rgba(34,211,238,.08)]">
              <GraduationCap className="h-6 w-6 text-cyan-300" />
            </div>

            <div>
              <p className="text-[11px] font-semibold tracking-[0.28em] text-cyan-300">
                UCA · CFC
              </p>

              <p className="text-sm font-medium text-slate-300">
                Gestión Académica
              </p>
            </div>
          </motion.div>

          {/* Presentación */}
          <div className="relative max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.15,
              }}
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/15 bg-cyan-400/[0.06] px-4 py-2 text-xs font-medium text-cyan-200">
                <Sparkles className="h-3.5 w-3.5" />
                Plataforma institucional
              </div>

              <h1 className="max-w-xl text-5xl font-semibold leading-[1.08] tracking-[-0.04em] text-white xl:text-6xl">
                Formación que

                <span className="block bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500 bg-clip-text text-transparent">
                  transforma.
                </span>
              </h1>

              <p className="mt-7 max-w-xl text-base leading-7 text-slate-400">
                Administra cursos, diplomados, inscripciones, servicios,
                agenda y operaciones académicas desde un único espacio.
              </p>
            </motion.div>

            {/* Características */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.35,
              }}
              className="mt-10 grid max-w-xl grid-cols-2 gap-4"
            >
              <FeatureCard
                icon={<BookOpen className="h-5 w-5" />}
                title="Gestión centralizada"
                description="Información académica organizada."
              />

              <FeatureCard
                icon={<ShieldCheck className="h-5 w-5" />}
                title="Acceso seguro"
                description="Protección mediante roles y JWT."
              />
            </motion.div>
          </div>

          {/* Pie */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex items-center gap-3 text-xs text-slate-500"
          >
            <div className="h-px w-8 bg-slate-700" />
            Centro de Formación Continua · 2026
          </motion.div>
        </section>

        {/* PANEL LOGIN */}
        <section className="relative flex min-h-screen items-center justify-center px-6 py-12 sm:px-10 lg:px-14">
          <motion.div
            initial={{
              opacity: 0,
              x: 30,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.75,
              ease: 'easeOut',
            }}
            className="w-full max-w-[440px]"
          >
            {/* Logo móvil */}
            <div className="mb-10 flex items-center gap-3 lg:hidden">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10">
                <GraduationCap className="h-6 w-6 text-cyan-300" />
              </div>

              <div>
                <p className="text-xs font-semibold tracking-[0.2em] text-cyan-300">
                  UCA · CFC
                </p>

                <p className="text-sm text-slate-400">
                  Gestión Académica
                </p>
              </div>
            </div>

            {/* Encabezado */}
            <div className="mb-9">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-400">
                Acceso institucional
              </p>

              <h2 className="text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">
                Bienvenido
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                Ingresa tus credenciales para acceder a la plataforma.
              </p>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Correo */}
              <div>
                <label
                  htmlFor="correo"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Correo electrónico
                </label>

                <div className="group relative">
                  <Mail className="absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-cyan-400" />

                  <input
                    id="correo"
                    type="email"
                    placeholder="usuario@uca.edu.sv"
                    value={correo}
                    onChange={(event) => {
                      setCorreo(event.target.value)
                      setError('')
                    }}
                    required
                    autoComplete="email"
                    disabled={loading}
                    className="w-full rounded-xl border border-white/[0.08] bg-white/[0.035] py-3.5 pl-12 pr-4 text-sm text-white outline-none transition-all placeholder:text-slate-600 hover:border-white/[0.13] focus:border-cyan-400/40 focus:bg-cyan-400/[0.025] focus:ring-4 focus:ring-cyan-400/[0.05] disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>
              </div>

              {/* Contraseña */}
              <div>
                <div className="mb-2 flex items-center justify-between gap-4">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-slate-300"
                  >
                    Contraseña
                  </label>

                  <button
                    type="button"
                    className="text-xs font-medium text-cyan-400 transition-colors hover:text-cyan-300"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>

                <div className="group relative">
                  <LockKeyhole className="absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-cyan-400" />

                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value)
                      setError('')
                    }}
                    required
                    autoComplete="current-password"
                    disabled={loading}
                    className="w-full rounded-xl border border-white/[0.08] bg-white/[0.035] py-3.5 pl-12 pr-12 text-sm text-white outline-none transition-all placeholder:text-slate-600 hover:border-white/[0.13] focus:border-cyan-400/40 focus:bg-cyan-400/[0.025] focus:ring-4 focus:ring-cyan-400/[0.05] disabled:cursor-not-allowed disabled:opacity-60"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    disabled={loading}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-slate-300 disabled:cursor-not-allowed"
                    aria-label={
                      showPassword
                        ? 'Ocultar contraseña'
                        : 'Mostrar contraseña'
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-[18px] w-[18px]" />
                    ) : (
                      <Eye className="h-[18px] w-[18px]" />
                    )}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: -5,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  role="alert"
                  className="rounded-xl border border-red-400/15 bg-red-400/[0.07] px-4 py-3 text-sm text-red-300"
                >
                  {error}
                </motion.div>
              )}

              {/* Botón */}
              <motion.button
                whileHover={loading ? {} : { y: -2 }}
                whileTap={loading ? {} : { scale: 0.985 }}
                type="submit"
                disabled={loading}
                className="group relative mt-2 flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3.5 text-sm font-semibold text-white shadow-[0_12px_35px_rgba(14,165,233,.18)] transition-all hover:shadow-[0_16px_45px_rgba(14,165,233,.28)] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {!loading && (
                  <span className="absolute inset-0 translate-x-[-120%] bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-[120%]" />
                )}

                {loading && (
                  <LoaderCircle className="relative h-4 w-4 animate-spin" />
                )}

                <span className="relative">
                  {loading
                    ? 'Verificando acceso...'
                    : 'Iniciar sesión'}
                </span>

                {!loading && (
                  <ArrowRight className="relative h-4 w-4 transition-transform group-hover:translate-x-1" />
                )}
              </motion.button>
            </form>

            {/* Seguridad */}
            <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-600">
              <ShieldCheck className="h-3.5 w-3.5" />
              Acceso protegido y administrado por roles
            </div>
          </motion.div>
        </section>
      </div>
    </main>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 backdrop-blur-xl"
    >
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/10 bg-cyan-400/[0.07] text-cyan-300">
        {icon}
      </div>

      <h3 className="text-sm font-semibold text-slate-200">
        {title}
      </h3>

      <p className="mt-1.5 text-xs leading-5 text-slate-500">
        {description}
      </p>
    </motion.div>
  )
}

export default Login