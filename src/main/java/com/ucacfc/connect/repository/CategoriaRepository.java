package com.ucacfc.connect.repository;

import com.ucacfc.connect.model.Categoria;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoriaRepository
        extends JpaRepository<Categoria, Long> {

    List<Categoria> findByActivoTrue();

    Page<Categoria> findByNombreContainingIgnoreCase(
            String nombre,
            Pageable pageable
    );

    Page<Categoria> findByActivo(
            Boolean activo,
            Pageable pageable
    );

    Page<Categoria> findByActivoTrue(
            Pageable pageable
    );

    Page<Categoria> findByActivoTrueAndNombreContainingIgnoreCase(
            String nombre,
            Pageable pageable
    );
}