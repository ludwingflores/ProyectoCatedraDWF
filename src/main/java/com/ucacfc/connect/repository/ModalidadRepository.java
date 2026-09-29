package com.ucacfc.connect.repository;

import com.ucacfc.connect.model.Modalidad;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ModalidadRepository
        extends JpaRepository<Modalidad, Long> {

    List<Modalidad> findByActivoTrue();

    Page<Modalidad> findByNombreContainingIgnoreCase(
            String nombre,
            Pageable pageable
    );

    Page<Modalidad> findByActivo(
            Boolean activo,
            Pageable pageable
    );

    Page<Modalidad> findByActivoTrue(
            Pageable pageable
    );

    Page<Modalidad> findByActivoTrueAndNombreContainingIgnoreCase(
            String nombre,
            Pageable pageable
    );
}