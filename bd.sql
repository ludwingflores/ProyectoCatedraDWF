CREATE DATABASE uca_cfc_connect;
USE uca_cfc_connect;

-- 1. ROLES
CREATE TABLE rol (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

-- 2. USUARIOS
CREATE TABLE usuario (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    rol_id BIGINT NOT NULL,

    CONSTRAINT fk_usuario_rol
        FOREIGN KEY (rol_id)
        REFERENCES rol(id)
);

-- 3. CLIENTES
CREATE TABLE cliente (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    dui VARCHAR(20) UNIQUE,
    nit VARCHAR(30) UNIQUE,
    nombre VARCHAR(150) NOT NULL,
    empresa VARCHAR(150),
    correo VARCHAR(150) NOT NULL,
    telefono VARCHAR(30),
    direccion VARCHAR(255)
);

SELECT * FROM cliente;
SELECT * FROM pago;

-- 4. CURSOS
CREATE TABLE curso (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    categoria VARCHAR(100),
    modalidad VARCHAR(50),
    docente VARCHAR(150),
    cupo_maximo INT NOT NULL,
    fecha_inicio DATE,
    fecha_fin DATE,
    horario VARCHAR(100),
    costo DECIMAL(10,2) NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE
);

-- 5. DIPLOMADOS
CREATE TABLE diplomado (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    categoria VARCHAR(100),
    modalidad VARCHAR(50),
    docente VARCHAR(150),
    cupo_maximo INT NOT NULL,
    fecha_inicio DATE,
    fecha_fin DATE,
    horario VARCHAR(100),
    costo DECIMAL(10,2) NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE
);

-- 6. INSCRIPCIONES
CREATE TABLE inscripcion (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    cliente_id BIGINT NOT NULL,
    curso_id BIGINT NOT NULL,
    fecha DATE NOT NULL,
    estado VARCHAR(30) NOT NULL,

    CONSTRAINT fk_inscripcion_cliente
        FOREIGN KEY (cliente_id)
        REFERENCES cliente(id),

    CONSTRAINT fk_inscripcion_curso
        FOREIGN KEY (curso_id)
        REFERENCES curso(id)
);

-- 7. COTIZACIONES
CREATE TABLE cotizacion (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    cliente_id BIGINT NOT NULL,
    fecha DATE NOT NULL,
    descripcion TEXT,
    monto DECIMAL(10,2),
    estado VARCHAR(30) NOT NULL,

    CONSTRAINT fk_cotizacion_cliente
        FOREIGN KEY (cliente_id)
        REFERENCES cliente(id)
);

-- 7.1 DETALLE DE COTIZACIONES
CREATE TABLE detalle_cotizacion (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    cotizacion_id BIGINT NOT NULL,
    tipo_servicio VARCHAR(30) NOT NULL,
    servicio_id BIGINT NOT NULL,
    descripcion VARCHAR(255),
    cantidad INT NOT NULL DEFAULT 1,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,

    CONSTRAINT fk_detalle_cotizacion_cotizacion
        FOREIGN KEY (cotizacion_id)
        REFERENCES cotizacion(id)
        ON DELETE CASCADE
);

-- 8. ESPACIOS
CREATE TABLE espacio (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    tipo VARCHAR(100) NOT NULL,
    capacidad INT NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    disponible BOOLEAN NOT NULL DEFAULT TRUE,
    equipamiento TEXT
);

-- 9. CATERING
CREATE TABLE catering (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    cliente_id BIGINT NOT NULL,
    tipo_servicio VARCHAR(100) NOT NULL,
    numero_asistentes INT NOT NULL,
    menu TEXT,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    lugar VARCHAR(255) NOT NULL,
    costo DECIMAL(10,2),
    estado VARCHAR(30),

    CONSTRAINT fk_catering_cliente
        FOREIGN KEY (cliente_id)
        REFERENCES cliente(id)
);

-- 10. AGENDA
CREATE TABLE agenda (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    descripcion TEXT,
    fecha DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    espacio_id BIGINT,

    CONSTRAINT fk_agenda_espacio
        FOREIGN KEY (espacio_id)
        REFERENCES espacio(id)
);

-- 11. PAGOS
CREATE TABLE pago (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    cliente_id BIGINT NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    metodo VARCHAR(50) NOT NULL,
    estado VARCHAR(30) NOT NULL,
    fecha DATE NOT NULL,
    referencia VARCHAR(100),

    CONSTRAINT fk_pago_cliente
        FOREIGN KEY (cliente_id)
        REFERENCES cliente(id)
);


-- ROLES INICIALES
INSERT INTO rol (nombre) VALUES
('ADMIN'),
('RECEPCIONISTA'),
('CLIENTE'),
('CONTABILIDAD');
