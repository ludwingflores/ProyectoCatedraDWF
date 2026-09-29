package com.ucacfc.connect.repository;

import com.ucacfc.connect.model.Docente;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DocenteRepository extends JpaRepository<Docente, Long> {

    List<Docente> findByActivoTrue();

    List<Docente> findByNombreContainingIgnoreCase(String nombre);

    List<Docente> findByActivo(Boolean activo);

    Page<Docente> findByActivoTrue(Pageable pageable);

    Page<Docente> findByActivoTrueAndNombreContainingIgnoreCase(
            String nombre,
            Pageable pageable
    );
}