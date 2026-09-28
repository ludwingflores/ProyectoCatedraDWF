package com.ucacfc.connect.repository;

import com.ucacfc.connect.model.Rol;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RolRepository
        extends JpaRepository<Rol, Long> {

    Page<Rol> findByNombreContainingIgnoreCase(
            String nombre,
            Pageable pageable
    );
}