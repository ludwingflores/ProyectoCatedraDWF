package com.ucacfc.connect.repository;

import com.ucacfc.connect.model.Alquiler;
import com.ucacfc.connect.model.EstadoAlquiler;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AlquilerRepository extends JpaRepository<Alquiler, Long> {

    List<Alquiler> findByClienteCorreoIgnoreCase(String correo);

    Optional<Alquiler> findByIdAndClienteCorreoIgnoreCase(
            Long id,
            String correo
    );

    List<Alquiler> findByEstado(EstadoAlquiler estado);

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