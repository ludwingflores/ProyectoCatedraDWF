package com.ucacfc.connect.repository;

import com.ucacfc.connect.model.Alquiler;
import com.ucacfc.connect.model.EstadoAlquiler;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AlquilerRepository
        extends JpaRepository<Alquiler, Long> {

    // =========================================================
    // CONSULTAS EXISTENTES DEL CLIENTE
    // =========================================================

    List<Alquiler> findByClienteCorreoIgnoreCase(
            String correo
    );

    Optional<Alquiler> findByIdAndClienteCorreoIgnoreCase(
            Long id,
            String correo
    );

    List<Alquiler> findByEstado(
            EstadoAlquiler estado
    );

    // =========================================================
    // FILTROS GENERALES + PAGINACIÓN
    // =========================================================

    Page<Alquiler> findByClienteId(
            Long clienteId,
            Pageable pageable
    );

    Page<Alquiler> findByEspacioId(
            Long espacioId,
            Pageable pageable
    );

    Page<Alquiler> findByEstado(
            EstadoAlquiler estado,
            Pageable pageable
    );

    Page<Alquiler> findByFecha(
            LocalDate fecha,
            Pageable pageable
    );

    // =========================================================
    // FILTROS DEL CLIENTE AUTENTICADO
    // =========================================================

    Page<Alquiler> findByClienteCorreoIgnoreCase(
            String correo,
            Pageable pageable
    );

    Page<Alquiler> findByClienteCorreoIgnoreCaseAndEstado(
            String correo,
            EstadoAlquiler estado,
            Pageable pageable
    );

    Page<Alquiler> findByClienteCorreoIgnoreCaseAndFecha(
            String correo,
            LocalDate fecha,
            Pageable pageable
    );

    Page<Alquiler> findByClienteCorreoIgnoreCaseAndEspacioId(
            String correo,
            Long espacioId,
            Pageable pageable
    );

    // =========================================================
    // CONFLICTOS DE HORARIO
    // =========================================================

    @Query("""
            SELECT COUNT(a) > 0
            FROM Alquiler a
            WHERE a.espacio.id = :espacioId
              AND a.fecha = :fecha
              AND a.estado <> com.ucacfc.connect.model.EstadoAlquiler.CANCELADO
              AND a.horaInicio < :horaFin
              AND a.horaFin > :horaInicio
            """)
    boolean existeConflicto(
            @Param("espacioId") Long espacioId,
            @Param("fecha") LocalDate fecha,
            @Param("horaInicio") LocalTime horaInicio,
            @Param("horaFin") LocalTime horaFin
    );

    @Query("""
            SELECT COUNT(a) > 0
            FROM Alquiler a
            WHERE a.espacio.id = :espacioId
              AND a.fecha = :fecha
              AND a.estado <> com.ucacfc.connect.model.EstadoAlquiler.CANCELADO
              AND a.horaInicio < :horaFin
              AND a.horaFin > :horaInicio
              AND a.id <> :alquilerId
            """)
    boolean existeConflictoExcluyendoAlquiler(
            @Param("espacioId") Long espacioId,
            @Param("fecha") LocalDate fecha,
            @Param("horaInicio") LocalTime horaInicio,
            @Param("horaFin") LocalTime horaFin,
            @Param("alquilerId") Long alquilerId
    );
}