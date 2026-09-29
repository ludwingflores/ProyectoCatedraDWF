<div align="center">

# 🎓 UCA CFC CONNECT

### Sistema de Gestión del Centro de Formación Continua

**Proyecto de Cátedra · Universidad Don Bosco**

<br>

![Java](https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![React](https://img.shields.io/badge/React-Vite-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![MySQL](https://img.shields.io/badge/MySQL-Database-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![JWT](https://img.shields.io/badge/Security-JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

![Maven](https://img.shields.io/badge/Maven-Build-C71A36?style=for-the-badge&logo=apachemaven&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-OpenAPI-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)
![GitHub](https://img.shields.io/badge/GitHub-Version_Control-181717?style=for-the-badge&logo=github&logoColor=white)

<br>

> Plataforma web empresarial para la gestión integral de los procesos académicos,
> administrativos, operativos y financieros de un Centro de Formación Continua.

</div>

---

## 🏫 Información académica

**UNIVERSIDAD DON BOSCO**  
**Escuela de Ingeniería**  
**Técnico en Ingeniería en Computación**  
**Proyecto de Cátedra**

---

## 👥 Integrantes

| 👤 Estudiante | 🪪 Carné |
|---|---|
| Castellón Hernández, Emily Alessandra | `CH241613` |
| Reyes Hernandez, Carlos Isaac | `RH230274` |
| López López, Emely Mabel | `LL243203` |
| Hernández Iraheta, William Antonio | `HI220365` |
| Flores Ayala, Ludwing Wilfredo | `FA240837` |

---

## 📖 Descripción del proyecto

**UCA CFC Connect** es una aplicación web empresarial desarrollada para centralizar y automatizar la gestión de los procesos de un **Centro de Formación Continua**.

El sistema integra en una misma plataforma la administración de cursos, diplomados, clientes, inscripciones, cotizaciones, alquiler de espacios, servicios de catering, agenda institucional, pagos, usuarios y control de acceso.

La solución utiliza una arquitectura basada en **Spring Boot**, **Spring MVC** y servicios **REST**, incorporando persistencia mediante **Spring Data JPA / Hibernate**, autenticación y autorización mediante **Spring Security + JWT**, documentación interactiva con **Swagger / OpenAPI** y una interfaz web desarrollada con **React + Vite**.

---

## 🎯 Objetivo general

Diseñar e implementar una aplicación web empresarial que permita administrar de manera centralizada los procesos académicos y administrativos del Centro de Formación Continua, utilizando una arquitectura MVC, servicios REST, persistencia de datos y mecanismos modernos de autenticación y autorización.

---

# ✨ Funcionalidades principales

El sistema está organizado en diferentes módulos que permiten cubrir el flujo completo de operación del Centro de Formación Continua.

### 🎓 Gestión académica

Administración de:

- Cursos.
- Diplomados.
- Categorías.
- Modalidades.
- Docentes.
- Inscripciones de participantes.

### 👥 Gestión de clientes

Permite:

- Registrar clientes.
- Actualizar información.
- Realizar búsquedas.
- Consultar información asociada.
- Consultar el historial del cliente.

### 🧾 Cotizaciones

El sistema permite gestionar cotizaciones relacionadas con:

- Cursos empresariales.
- Diplomados.
- Alquiler de espacios.
- Catering.
- Servicios combinados.

Las cotizaciones pueden pasar por diferentes estados durante su ciclo de gestión.

### 🏢 Alquiler de espacios

Permite administrar espacios como:

- Auditorios.
- Aulas.
- Laboratorios.
- Salas de reuniones.
- Salas multimedia.

El sistema considera información como capacidad, precio, disponibilidad y equipamiento.

### ☕ Catering

Gestión de servicios de alimentación como:

- Coffee Break.
- Desayuno.
- Almuerzo.
- Cena.
- Refrigerio.

Las solicitudes permiten registrar asistentes, menú, fecha, hora y lugar.

### 📅 Agenda institucional

Centraliza las actividades programadas relacionadas con:

- Cursos.
- Diplomados.
- Eventos.
- Alquileres.
- Catering.

La lógica de negocio contempla el control de conflictos de horario para evitar reservas incompatibles.

### 💳 Pagos

Control financiero relacionado con:

- Inscripciones.
- Cotizaciones.
- Alquileres.
- Catering.

Métodos contemplados:

- 💵 Efectivo
- 💳 Tarjeta
- 🏦 Transferencia
- 🧾 Depósito

Estados de pago:

- `PENDIENTE`
- `PARCIAL`
- `PAGADO`

### 🔐 Seguridad

El sistema incorpora:

- Inicio de sesión.
- Cierre de sesión.
- Recuperación de contraseña.
- Autenticación mediante JWT.
- Autorización por roles.
- Protección de endpoints.
- Administración de usuarios.

---

# 📋 Requisitos funcionales

El proyecto implementa los requisitos funcionales definidos para el sistema:

| Código | Requisito |
|:---:|---|
| `RF01` | 🎓 Administrar cursos |
| `RF02` | 📚 Administrar diplomados |
| `RF03` | 👥 Registrar clientes |
| `RF04` | 📝 Inscribir participantes |
| `RF05` | 📄 Solicitar cotizaciones |
| `RF06` | 🧾 Generar cotizaciones |
| `RF07` | 🏢 Registrar alquileres |
| `RF08` | ☕ Registrar catering |
| `RF09` | 🗓️ Consultar disponibilidad de espacios |
| `RF10` | 💳 Registrar pagos |
| `RF11` | 👤 Administrar usuarios |
| `RF12` | 🔐 Controlar acceso mediante roles |
| `RF13` | 📅 Consultar agenda institucional |
| `RF14` | 📊 Consultar historial de clientes |
| `RF15` | 💰 Consultar estado de pagos |

---

# 🛠️ Stack tecnológico

## ⚙️ Backend

| Tecnología | Uso |
|---|---|
| ☕ **Java 21** | Lenguaje principal |
| 🍃 **Spring Boot** | Framework principal del backend |
| 🌐 **Spring MVC** | Arquitectura web y API REST |
| 🗃️ **Spring Data JPA** | Acceso y persistencia de datos |
| 🔄 **Hibernate** | ORM |
| 🔐 **Spring Security** | Seguridad y autorización |
| 🎫 **JWT** | Autenticación basada en tokens |
| 📦 **Maven** | Dependencias y construcción |
| 📚 **Springdoc OpenAPI** | Documentación de la API |
| 🧪 **JUnit 5** | Pruebas unitarias |
| 🎭 **Mockito** | Simulación de dependencias en pruebas |

## 🎨 Frontend

| Tecnología | Uso |
|---|---|
| ⚛️ **React** | Construcción de la interfaz |
| ⚡ **Vite** | Entorno de desarrollo y construcción |
| 🎨 **Tailwind CSS** | Diseño y estilos |
| 🧭 **React Router** | Navegación |
| 🔌 **Axios** | Comunicación con la API REST |
| 🎬 **Framer Motion** | Animaciones y microinteracciones |
| 📊 **Recharts** | Visualización de datos |
| ✨ **Lucide React** | Iconografía |

## 🗄️ Base de datos

![MySQL](https://img.shields.io/badge/MySQL-uca__cfc__connect-4479A1?style=flat-square&logo=mysql&logoColor=white)

El proyecto utiliza **MySQL** como sistema gestor de base de datos.

```text
uca_cfc_connect
```

---

# 🏗️ Arquitectura

El backend sigue una arquitectura por capas basada en el patrón **MVC**.

```text
┌─────────────────────────────┐
│          Frontend           │
│       React + Vite          │
└──────────────┬──────────────┘
               │ HTTP / JSON
               ▼
┌─────────────────────────────┐
│         Controller          │
│      API REST / DTOs        │
└──────────────┬──────────────┘
               ▼
┌─────────────────────────────┐
│           Service           │
│     Lógica de negocio       │
└──────────────┬──────────────┘
               ▼
┌─────────────────────────────┐
│         Repository          │
│      Spring Data JPA        │
└──────────────┬──────────────┘
               ▼
┌─────────────────────────────┐
│           MySQL             │
│      uca_cfc_connect        │
└─────────────────────────────┘
```

### Controller

Responsable de:

- Exponer los endpoints REST.
- Recibir solicitudes HTTP.
- Validar DTOs de entrada.
- Mapear respuestas.

### Service

Contiene la lógica de negocio:

- Validaciones.
- Cálculos.
- Control de disponibilidad.
- Verificación de conflictos de horarios.
- Procesamiento de operaciones.

### Repository

Responsable de la comunicación con la base de datos mediante interfaces basadas en:

```java
JpaRepository
```

---

# 🔐 Seguridad y control de acceso

La aplicación utiliza:

```text
Spring Security + JWT
```

El flujo general de autenticación es:

```text
Usuario
   │
   ▼
POST /api/auth/login
   │
   ▼
Validación de credenciales
   │
   ▼
Generación JWT
   │
   ▼
Frontend almacena el token
   │
   ▼
Authorization: Bearer <token>
   │
   ▼
Acceso a recursos protegidos
```

---

## 👤 Roles

El sistema contempla cuatro roles principales:

| Rol | Función |
|---|---|
| 👑 `ADMIN` | Administración general del sistema |
| 🖥️ `RECEPCIONISTA` | Gestión académica y operativa |
| 💰 `CONTABILIDAD` | Gestión financiera y pagos |
| 🎓 `CLIENTE` | Acceso a operaciones permitidas para clientes |

Los endpoints son protegidos de acuerdo con los permisos correspondientes a cada rol.

---

# 🗂️ Estructura general

```text
ProyectoCatedraDWF/
│
├── 📂 src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/ucacfc/connect/
│   │   │       ├── controller/
│   │   │       ├── dto/
│   │   │       ├── exception/
│   │   │       ├── model/
│   │   │       ├── repository/
│   │   │       ├── security/
│   │   │       └── service/
│   │   │
│   │   └── resources/
│   │
│   └── test/
│
├── 📂 frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── pom.xml
└── README.md
```

---

# ⚙️ Requisitos previos

Antes de ejecutar el proyecto se necesita tener instalado:

- ☕ Java 21
- 📦 Maven
- 🗄️ MySQL
- 🟢 Node.js
- 📦 npm
- 🌿 Git

Puedes comprobar las instalaciones con:

```bash
java -version
mvn -version
node -v
npm -v
git --version
```

---

# 🚀 Instalación

## 1️⃣ Clonar el repositorio

```bash
git clone https://github.com/ludwingflores/ProyectoCatedraDWF.git
```

Ingresar al proyecto:

```bash
cd ProyectoCatedraDWF
```

---

## 2️⃣ Configurar MySQL

Crear la base de datos:

```sql
CREATE DATABASE uca_cfc_connect;
```

La configuración de conexión utilizada por Spring Boot debe corresponder con el entorno MySQL local.

> ⚠️ Las credenciales privadas de base de datos y secretos JWT no deben publicarse directamente en el repositorio.

---

# ▶️ Ejecutar el backend

Desde la raíz del proyecto:

```bash
mvn spring-boot:run
```

Por defecto, la API se ejecuta en:

```text
http://localhost:8080
```

La ruta base utilizada por los servicios REST es:

```text
http://localhost:8080/api
```

---

# 💻 Ejecutar el frontend

Abrir otra terminal:

```bash
cd frontend
```

Instalar las dependencias:

```bash
npm install
```

Ejecutar Vite:

```bash
npm run dev
```

La aplicación estará disponible normalmente en:

```text
http://localhost:5173
```

---

# 🔌 Comunicación Frontend ↔ Backend

El frontend utiliza **Axios** para consumir la API.

```text
React
  │
  │ Axios
  ▼
http://localhost:8080/api
  │
  ▼
Spring Security
  │
  ▼
Controllers
  │
  ▼
Services
  │
  ▼
Repositories
  │
  ▼
MySQL
```

Las solicitudes autenticadas incorporan el JWT mediante:

```http
Authorization: Bearer <token>
```

El backend incluye configuración **CORS** para permitir la comunicación con el entorno de desarrollo del frontend.

---

# 📚 Swagger / OpenAPI

La API está documentada utilizando **Springdoc OpenAPI + Swagger UI**.

Con el backend ejecutándose, la documentación puede consultarse en:

```text
http://localhost:8080/swagger-ui/index.html
```

Swagger permite:

- 📖 Consultar los endpoints.
- 📤 Revisar parámetros y cuerpos de solicitudes.
- 📥 Visualizar respuestas.
- 🧪 Probar operaciones de la API.
- 🔐 Trabajar con endpoints protegidos.

---

# 🌐 API REST

La aplicación dispone de recursos REST para los principales módulos del sistema.

Entre ellos:

```text
/api/auth
/api/clientes
/api/cursos
/api/diplomados
/api/docentes
/api/categorias
/api/modalidades
/api/inscripciones
/api/cotizaciones
/api/alquileres
/api/catering
/api/agenda
/api/pagos
/api/usuarios
/api/roles
```

Las operaciones contemplan, según el recurso:

```http
GET
POST
PUT
DELETE
```

Además de búsquedas, filtros, paginación y ordenamiento cuando corresponde.

---

# 🔑 Autenticación

Entre las operaciones disponibles para autenticación se encuentran:

```http
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/forgot-password
POST /api/auth/reset-password
```

### Ejemplo de inicio de sesión

```json
{
  "correo": "usuario@correo.com",
  "password": "********"
}
```

Una autenticación válida devuelve un token JWT que posteriormente debe enviarse para acceder a los recursos protegidos.

---

# 🧪 Pruebas unitarias

El proyecto utiliza:

![JUnit5](https://img.shields.io/badge/JUnit_5-Tests-25A162?style=flat-square&logo=junit5&logoColor=white)
![Mockito](https://img.shields.io/badge/Mockito-Mocking-78A641?style=flat-square)

Las pruebas se enfocan en validar lógica de negocio y comportamientos del sistema.

Para ejecutar las pruebas:

```bash
mvn test
```

Esto permite verificar automáticamente la lógica cubierta por las pruebas antes de integrar nuevos cambios.

---

# ⚠️ Manejo de errores

El backend implementa manejo centralizado de excepciones mediante mecanismos de Spring como:

```java
@ControllerAdvice
@ExceptionHandler
```

Esto permite proporcionar respuestas controladas y consistentes ante errores de validación, reglas de negocio o solicitudes incorrectas.

---

# ✅ Validaciones

Los datos recibidos por la API son validados mediante Bean Validation y anotaciones como:

```java
@Valid
@NotBlank
@Email
@Size
@Pattern
@Positive
```

El objetivo es impedir que información inválida alcance la lógica de negocio o la base de datos.

---

# 🔄 Control de versiones

El proyecto utiliza **Git y GitHub** para el control de versiones.

Flujo general:

```text
main
 │
 ├── feature/...
 │      │
 │      ├── commits
 │      └── integración
 │
 └── versión estable
```

Comandos básicos:

```bash
git status
git add .
git commit -m "descripcion del cambio"
git push
```

---

# 📸 Interfaz del sistema

La interfaz utiliza un diseño moderno orientado a facilitar la navegación y visualización de información.

Actualmente contempla componentes como:

### 🔐 Login

Acceso seguro mediante correo electrónico y contraseña, integrado con autenticación JWT.

### 📊 Dashboard

Panel principal para presentar información relevante del sistema y facilitar el acceso a los diferentes módulos.

> 🖼️ Las capturas de los módulos podrán incorporarse a esta sección conforme avance la interfaz final.

---

# 📌 Estado del proyecto

![Status](https://img.shields.io/badge/Estado-En_Desarrollo-00B8D9?style=for-the-badge)
![Backend](https://img.shields.io/badge/Backend-Funcional-6DB33F?style=for-the-badge)
![Frontend](https://img.shields.io/badge/Frontend-En_Desarrollo-61DAFB?style=for-the-badge)

### Backend

- ✅ API REST
- ✅ Persistencia JPA / Hibernate
- ✅ MySQL
- ✅ Seguridad JWT
- ✅ Control de acceso por roles
- ✅ Swagger / OpenAPI
- ✅ Validaciones
- ✅ Manejo centralizado de excepciones
- ✅ Pruebas unitarias
- ✅ Configuración CORS

### Frontend

- ✅ React + Vite
- ✅ Integración con API
- ✅ Autenticación con backend
- ✅ Login
- ✅ Protección inicial de rutas
- ✅ Dashboard base
- 🚧 Desarrollo de módulos administrativos

---

# 🎓 Propósito académico

Este proyecto ha sido desarrollado como parte del **Proyecto de Cátedra** de la carrera **Técnico en Ingeniería en Computación de la Universidad Don Bosco**.

Su finalidad es aplicar de manera integrada conceptos relacionados con:

- Desarrollo de aplicaciones empresariales.
- Arquitectura MVC.
- APIs REST.
- Persistencia de datos.
- Seguridad.
- Autenticación y autorización.
- Pruebas unitarias.
- Desarrollo frontend.
- Integración frontend/backend.
- Control de versiones.

---

<div align="center">

## 💙 UCA CFC CONNECT

**Gestión académica, administrativa y operativa en una sola plataforma.**

<br>

`Java 21` · `Spring Boot` · `React` · `MySQL` · `JWT`

<br>

**Universidad Don Bosco · 2026**

</div>