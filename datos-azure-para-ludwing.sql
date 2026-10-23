-- MySQL dump 10.13  Distrib 9.1.0, for Win64 (x86_64)
--
-- Host: cfc-connect-db.mysql.database.azure.com    Database: uca_cfc_connect
-- ------------------------------------------------------
-- Server version	8.4.9-azure

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Dumping data for table `agenda`
--

LOCK TABLES `agenda` WRITE;
/*!40000 ALTER TABLE `agenda` DISABLE KEYS */;
INSERT INTO `agenda` (`id`, `titulo`, `descripcion`, `fecha`, `hora_inicio`, `hora_fin`, `tipo`, `espacio_id`) VALUES (1,'Evento de prueba','Agenda de prueba de Validaciones','2026-09-19','09:00:00','11:00:00','EVENTO',NULL),(2,'Prueba disponibilidad','Prueba de control de horarios','2026-10-05','10:00:00','12:00:00','EVENTO',1),(3,'Prueba horario consecutivo','Debe permitirse porque inicia cuando termina la reserva anterior','2026-10-05','12:00:00','14:00:00','EVENTO',1),(6,'Alquiler - Sala de capacitación','Alquiler registrado para Cliente Actualizado','2026-12-12','13:00:00','15:00:00','ALQUILER',1),(7,'Catering - Coffee Break','Servicio de catering para 25 asistentes. Lugar: Salón principal','2026-09-20','13:00:00','14:00:00','CATERING',NULL);
/*!40000 ALTER TABLE `agenda` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `alquiler`
--

LOCK TABLES `alquiler` WRITE;
/*!40000 ALTER TABLE `alquiler` DISABLE KEYS */;
INSERT INTO `alquiler` (`id`, `cliente_id`, `espacio_id`, `fecha`, `hora_inicio`, `hora_fin`, `precio`, `estado`, `agenda_id`) VALUES (2,1,1,'2026-12-12','13:00:00','15:00:00',150.00,'CONFIRMADO',6);
/*!40000 ALTER TABLE `alquiler` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `categoria`
--

LOCK TABLES `categoria` WRITE;
/*!40000 ALTER TABLE `categoria` DISABLE KEYS */;
INSERT INTO `categoria` (`id`, `nombre`, `activo`) VALUES (1,'Tecnología',1);
/*!40000 ALTER TABLE `categoria` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `catering`
--

LOCK TABLES `catering` WRITE;
/*!40000 ALTER TABLE `catering` DISABLE KEYS */;
INSERT INTO `catering` (`id`, `cliente_id`, `servicio_catering_id`, `tipo_servicio`, `numero_asistentes`, `precio_por_persona`, `menu`, `fecha`, `hora`, `hora_fin`, `lugar`, `agenda_id`, `costo`, `estado`) VALUES (1,1,1,'Coffee Break',25,10.00,'Menú de prueba','2026-09-20','13:00:00','14:00:00','Salón principal',7,250.00,'APROBADO'),(2,3,NULL,'Almuerzo',10,15.00,'Pollo, arroz y ensalada','2026-10-15','12:30:00','00:00:00','Salón principal',NULL,150.00,'PENDIENTE'),(3,3,NULL,'Refrigerio',5,10.00,'Sándwich y bebida','2026-10-20','15:00:00','00:00:00','Salón principal',NULL,50.00,'PENDIENTE'),(4,3,NULL,'Coffee Break',5,10.00,'Café y bocadillos','2026-10-21','10:00:00','00:00:00','Salón principal',NULL,50.00,'APROBADO'),(5,3,NULL,'Coffee Break',5,10.00,'Café y bocadillos','2026-10-22','10:00:00','00:00:00','Salón principal',NULL,50.00,'PENDIENTE'),(6,3,NULL,'Cena',8,12.50,'Pollo, vegetales y bebida','2026-10-25','18:30:00','00:00:00','Salón principal',NULL,100.00,'PENDIENTE'),(7,3,1,'Coffee Break',10,10.00,'Café, bocadillos y bebida','2026-10-30','09:00:00','00:00:00','Salón principal',NULL,100.00,'PENDIENTE');
/*!40000 ALTER TABLE `catering` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `cliente`
--

LOCK TABLES `cliente` WRITE;
/*!40000 ALTER TABLE `cliente` DISABLE KEYS */;
INSERT INTO `cliente` (`id`, `dui`, `nit`, `nombre`, `empresa`, `correo`, `telefono`, `direccion`) VALUES (1,NULL,NULL,'Cliente Actualizado',NULL,'actualizado@example.com','7777-1234',NULL),(2,'00000000000','00000000000000000000000','Prueba Telefono Valido','uca','telefono30@example.com','777777777777777777777777777777','UCA'),(3,'00000000-0','0000-000000-000-0','Cliente Prueba','UCA CFC Connect','cliente.prueba@uca.edu.sv','7000-0000','San Salvador'),(4,'39988987','1234-3214','Ludwing Admin Prueba','Empresa 1','ludprueba@gmail.com','1234','Direccion 1');
/*!40000 ALTER TABLE `cliente` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `cotizacion`
--

LOCK TABLES `cotizacion` WRITE;
/*!40000 ALTER TABLE `cotizacion` DISABLE KEYS */;
INSERT INTO `cotizacion` (`id`, `cliente_id`, `fecha`, `descripcion`, `monto`, `estado`) VALUES (1,1,'2026-09-19','Cotización de prueba',50.00,'APROBADA'),(2,3,'2026-09-26','Cotizacion actualizada de prueba',250.00,'APROBADA'),(3,3,'2026-09-26','Prueba calculo automatico',250.00,'PENDIENTE');
/*!40000 ALTER TABLE `cotizacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `curso`
--

LOCK TABLES `curso` WRITE;
/*!40000 ALTER TABLE `curso` DISABLE KEYS */;
INSERT INTO `curso` (`id`, `nombre`, `descripcion`, `categoria_id`, `modalidad_id`, `docente_id`, `cupo_maximo`, `fecha_inicio`, `fecha_fin`, `horario`, `costo`, `activo`) VALUES (1,'Curso de prueba de validaciones',NULL,NULL,NULL,NULL,20,NULL,NULL,NULL,50.00,1),(2,'Prueba de control de cupos',NULL,NULL,NULL,NULL,1,NULL,NULL,NULL,0.00,1),(3,'Desarrollo Web Full Stack','Curso práctico de desarrollo web Full Stack',1,1,1,25,'2026-10-05','2026-11-30','Lunes y miércoles 6:00 PM - 8:00 PM',150.00,1),(4,'Curso de Prueba Frontend','Curso creado desde el módulo de gestión académica.',1,1,1,25,'2026-10-15','2026-11-15','Lunes y miércoles 6:00 PM - 8:00 PM',75.00,1);
/*!40000 ALTER TABLE `curso` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `detalle_cotizacion`
--

LOCK TABLES `detalle_cotizacion` WRITE;
/*!40000 ALTER TABLE `detalle_cotizacion` DISABLE KEYS */;
INSERT INTO `detalle_cotizacion` (`id`, `cotizacion_id`, `tipo_servicio`, `servicio_id`, `descripcion`, `cantidad`, `precio_unitario`, `subtotal`) VALUES (4,2,'DIPLOMADO',1,'Diplomado: Diplomado de prueba de validaciones',1,100.00,100.00),(5,2,'ESPACIO',1,'Espacio: Sala de capacitación',1,150.00,150.00),(6,3,'CURSO',1,'Curso: Curso de prueba de validaciones',2,50.00,100.00),(7,3,'ESPACIO',1,'Espacio: Sala de capacitación',1,150.00,150.00),(8,1,'CURSO',1,'Curso: Curso de prueba de validaciones',1,50.00,50.00);
/*!40000 ALTER TABLE `detalle_cotizacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `diplomado`
--

LOCK TABLES `diplomado` WRITE;
/*!40000 ALTER TABLE `diplomado` DISABLE KEYS */;
INSERT INTO `diplomado` (`id`, `nombre`, `descripcion`, `categoria_id`, `modalidad_id`, `docente_id`, `cupo_maximo`, `fecha_inicio`, `fecha_fin`, `horario`, `costo`, `activo`) VALUES (1,'Diplomado de prueba de validaciones',NULL,1,1,1,25,'2026-12-10','2026-12-11','Sábados 8:00 AM - 12:00 PM',100.00,1),(2,'Diplomado en Desarrollo de Software','Diplomado especializado en desarrollo de software',1,1,1,30,'2026-10-10','2027-02-20','Sábados 8:00 AM - 12:00 PM',300.00,1),(3,'Diplomado Frontend Prueba','Diplomado creado desde el frontend.',1,1,1,30,'2026-10-20','2026-12-20','Sábados 8:00 AM - 12:00 PM',150.00,1);
/*!40000 ALTER TABLE `diplomado` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `docente`
--

LOCK TABLES `docente` WRITE;
/*!40000 ALTER TABLE `docente` DISABLE KEYS */;
INSERT INTO `docente` (`id`, `nombre`, `activo`) VALUES (1,'Carlos Martínez',1);
/*!40000 ALTER TABLE `docente` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `espacio`
--

LOCK TABLES `espacio` WRITE;
/*!40000 ALTER TABLE `espacio` DISABLE KEYS */;
INSERT INTO `espacio` (`id`, `nombre`, `tipo`, `capacidad`, `precio`, `disponible`, `equipamiento`) VALUES (1,'Sala de capacitación','Salón',30,150.00,1,'Proyector y aire acondicionado');
/*!40000 ALTER TABLE `espacio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `inscripcion`
--

LOCK TABLES `inscripcion` WRITE;
/*!40000 ALTER TABLE `inscripcion` DISABLE KEYS */;
INSERT INTO `inscripcion` (`id`, `cliente_id`, `curso_id`, `fecha`, `estado`) VALUES (1,1,1,'2026-09-19','CONFIRMADA'),(2,2,1,'2026-09-21','CANCELADA'),(3,2,1,'2026-09-21','PENDIENTE'),(4,1,2,'2026-09-21','CANCELADA'),(5,2,2,'2026-09-21','PENDIENTE');
/*!40000 ALTER TABLE `inscripcion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `modalidad`
--

LOCK TABLES `modalidad` WRITE;
/*!40000 ALTER TABLE `modalidad` DISABLE KEYS */;
INSERT INTO `modalidad` (`id`, `nombre`, `activo`) VALUES (1,'Presencial',1);
/*!40000 ALTER TABLE `modalidad` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `pago`
--

LOCK TABLES `pago` WRITE;
/*!40000 ALTER TABLE `pago` DISABLE KEYS */;
INSERT INTO `pago` (`id`, `cliente_id`, `tipo`, `monto`, `metodo`, `estado`, `fecha`, `referencia`) VALUES (5,2,'INSCRIPCION',250.00,'EFECTIVO','PAGADO','2026-10-22','010120123552');
/*!40000 ALTER TABLE `pago` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `rol`
--

LOCK TABLES `rol` WRITE;
/*!40000 ALTER TABLE `rol` DISABLE KEYS */;
INSERT INTO `rol` (`id`, `nombre`) VALUES (1,'ADMIN'),(3,'CLIENTE'),(4,'CONTABILIDAD'),(2,'RECEPCIONISTA');
/*!40000 ALTER TABLE `rol` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `servicio_catering`
--

LOCK TABLES `servicio_catering` WRITE;
/*!40000 ALTER TABLE `servicio_catering` DISABLE KEYS */;
INSERT INTO `servicio_catering` (`id`, `nombre`, `tipo`, `precio_por_persona`, `activo`) VALUES (1,'Coffee Break de prueba','Coffee Break',10.00,1);
/*!40000 ALTER TABLE `servicio_catering` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` (`id`, `nombre`, `correo`, `password`, `activo`, `rol_id`, `token_recuperacion`, `token_recuperacion_expira`) VALUES (1,'Administrador','admin@uca.edu.sv','$2a$10$8uT9Nmv9jzyp6qAvhcBA4.lhYzl8r5Fw8kJcmTCFwaMdhK55t1ANG',1,1,NULL,NULL),(2,'Recepcionista Prueba','recepcion@uca.edu.sv','$2a$10$Bth6ak.CXSjKdyGExnRgpOrh45F.2sRXfV54jLwV3XeASQW5RhlK.',1,2,NULL,NULL),(3,'Contabilidad Prueba','contabilidad@uca.edu.sv','$2a$10$6Viss.53glNDuhOZCXvXjuskzS8r8CeOjc8EyZtuyg0tUuBYaUQ0G',1,4,NULL,NULL),(4,'Cliente Prueba','cliente.prueba@uca.edu.sv','$2a$10$d2eTN9wFFIUqoHQOKM2O9.qu8qv3yKJatlM1AV36DS/dLseaNwP9e',1,3,NULL,NULL),(6,'Ludwing Flores','flores@uca.edu.sv','$2a$10$HqS7y9vxjqj0tnqSwV2HgO0DintFcz1hkJc5HcQkTQlQcCV4NMBBy',1,3,NULL,NULL);
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-23 13:31:14
