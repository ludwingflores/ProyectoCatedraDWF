package com.ucacfc.connect.repository;

import com.ucacfc.connect.model.EstadoInscripcion;
import com.ucacfc.connect.model.Inscripcion;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InscripcionRepository
        extends JpaRepository<Inscripcion, Long> {

    // =========================================================
    // VALIDACIONES DE NEGOCIO
    // =========================================================

    boolean existsByClienteIdAndCursoIdAndEstadoNot(
            Long clienteId,
            Long cursoId,
            EstadoInscripcion estado
    );

    long countByCursoIdAndEstadoIn(
            Long cursoId,
            Collection<EstadoInscripcion> estados
    );

    // =========================================================
    // HISTORIAL DEL CLIENTE - RF14
    // =========================================================

    List<Inscripcion> findByClienteIdOrderByFechaDesc(
            Long clienteId
    );

    // =========================================================
    // FILTROS PAGINADOS
    // =========================================================

    Page<Inscripcion> findByClienteId(
            Long clienteId,
            Pageable pageable
    );

    Page<Inscripcion> findByCursoId(
            Long cursoId,
            Pageable pageable
    );

    Page<Inscripcion> findByEstado(
            EstadoInscripcion estado,
            Pageable pageable
    );

    Page<Inscripcion> findByFecha(
            LocalDate fecha,
            Pageable pageable
    );
}