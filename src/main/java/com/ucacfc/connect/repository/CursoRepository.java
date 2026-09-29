package com.ucacfc.connect.repository;

import com.ucacfc.connect.model.Curso;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CursoRepository extends JpaRepository<Curso, Long> {

    Page<Curso> findByNombreContainingIgnoreCase(
            String nombre,
            Pageable pageable
    );

    List<Curso> findByActivoTrue();

    Page<Curso> findByActivoTrue(
            Pageable pageable
    );

    Page<Curso> findByActivoTrueAndNombreContainingIgnoreCase(
            String nombre,
            Pageable pageable
    );
}