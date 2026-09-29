package com.ucacfc.connect.repository;

import com.ucacfc.connect.model.Diplomado;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DiplomadoRepository extends JpaRepository<Diplomado, Long> {

    Page<Diplomado> findByNombreContainingIgnoreCase(
            String nombre,
            Pageable pageable
    );

    List<Diplomado> findByActivoTrue();

    Page<Diplomado> findByActivoTrue(
            Pageable pageable
    );

    Page<Diplomado> findByActivoTrueAndNombreContainingIgnoreCase(
            String nombre,
            Pageable pageable
    );
}