package com.ucacfc.connect.repository;

import com.ucacfc.connect.model.Catering;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CateringRepository extends JpaRepository<Catering, Long> {

    // =========================================================
    // CONSULTAS EXISTENTES
    // =========================================================

    List<Catering> findByClienteCorreoIgnoreCase(String correo);

    Optional<Catering> findByIdAndClienteCorreoIgnoreCase(
            Long id,
            String correo
    );

    // =========================================================
    // FILTROS GENERALES + PAGINACIÓN
    // =========================================================

    Page<Catering> findByClienteId(
            Long clienteId,
            Pageable pageable
    );

    Page<Catering> findByServicioCateringId(
            Long servicioCateringId,
            Pageable pageable
    );

    Page<Catering> findByTipoServicioContainingIgnoreCase(
            String tipoServicio,
            Pageable pageable
    );

    Page<Catering> findByEstadoIgnoreCase(
            String estado,
            Pageable pageable
    );

    Page<Catering> findByFecha(
            LocalDate fecha,
            Pageable pageable
    );

    // =========================================================
    // FILTROS DEL CLIENTE AUTENTICADO
    // =========================================================

    Page<Catering> findByClienteCorreoIgnoreCase(
            String correo,
            Pageable pageable
    );

    Page<Catering> findByClienteCorreoIgnoreCaseAndServicioCateringId(
            String correo,
            Long servicioCateringId,
            Pageable pageable
    );

    Page<Catering> findByClienteCorreoIgnoreCaseAndTipoServicioContainingIgnoreCase(
            String correo,
            String tipoServicio,
            Pageable pageable
    );

    Page<Catering> findByClienteCorreoIgnoreCaseAndEstadoIgnoreCase(
            String correo,
            String estado,
            Pageable pageable
    );

    Page<Catering> findByClienteCorreoIgnoreCaseAndFecha(
            String correo,
            LocalDate fecha,
            Pageable pageable
    );
}