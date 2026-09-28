package com.ucacfc.connect.repository;

import com.ucacfc.connect.model.ServicioCatering;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ServicioCateringRepository
        extends JpaRepository<ServicioCatering, Long> {

    // Se conserva para el catálogo visible a usuarios no administradores.
    List<ServicioCatering> findByActivoTrue();

    Page<ServicioCatering> findByNombreContainingIgnoreCase(
            String nombre,
            Pageable pageable
    );

    Page<ServicioCatering> findByTipoContainingIgnoreCase(
            String tipo,
            Pageable pageable
    );

    Page<ServicioCatering> findByActivo(
            Boolean activo,
            Pageable pageable
    );

    // Consultas restringidas únicamente a servicios activos.
    Page<ServicioCatering> findByActivoTrue(
            Pageable pageable
    );

    Page<ServicioCatering> findByActivoTrueAndNombreContainingIgnoreCase(
            String nombre,
            Pageable pageable
    );

    Page<ServicioCatering> findByActivoTrueAndTipoContainingIgnoreCase(
            String tipo,
            Pageable pageable
    );
}