package com.ucacfc.connect.repository;

import com.ucacfc.connect.model.Cliente;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {

    // Busqueda por nombre
    Page<Cliente> findByNombreContainingIgnoreCase(String nombre, Pageable pageable);

    // Busqueda por dui
    Page<Cliente> findByDuiContainingIgnoreCase(String dui, Pageable pageable);

    // Busqueda por NIT
    Page<Cliente> findByNitContainingIgnoreCase(String nit, Pageable pageable);

    // Busqueda por empresa
    Page<Cliente> findByEmpresaContainingIgnoreCase(String empresa, Pageable pageable);

    // Busqueda por correo
    Page<Cliente> findByCorreoContainingIgnoreCase(String correo, Pageable pageable);

    // Se conserva porque ya es utilizado para identificar
    // al cliente autenticado y por otras funciones del sistema.
    Optional<Cliente> findByCorreoIgnoreCase(String correo);
}