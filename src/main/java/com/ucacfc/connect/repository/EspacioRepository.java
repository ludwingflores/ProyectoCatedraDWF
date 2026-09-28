package com.ucacfc.connect.repository;

import com.ucacfc.connect.model.Espacio;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EspacioRepository
        extends JpaRepository<Espacio, Long> {

    // =========================================================
    // FILTROS + PAGINACIÓN
    // =========================================================

    Page<Espacio> findByNombreContainingIgnoreCase(
            String nombre,
            Pageable pageable
    );

    Page<Espacio> findByTipoContainingIgnoreCase(
            String tipo,
            Pageable pageable
    );

    Page<Espacio> findByCapacidadGreaterThanEqual(
            Integer capacidad,
            Pageable pageable
    );

    Page<Espacio> findByDisponible(
            Boolean disponible,
            Pageable pageable
    );
}