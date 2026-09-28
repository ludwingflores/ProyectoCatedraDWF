package com.ucacfc.connect.repository;

import com.ucacfc.connect.model.Usuario;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioRepository
        extends JpaRepository<Usuario, Long> {

    // Utilizado por autenticación / JWT.
    Optional<Usuario> findByCorreo(String correo);

    Page<Usuario> findByNombreContainingIgnoreCase(
            String nombre,
            Pageable pageable
    );

    Page<Usuario> findByCorreoContainingIgnoreCase(
            String correo,
            Pageable pageable
    );

    Page<Usuario> findByRolId(
            Long rolId,
            Pageable pageable
    );

    Page<Usuario> findByActivo(
            Boolean activo,
            Pageable pageable
    );
}