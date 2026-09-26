package com.ucacfc.connect.repository;

import com.ucacfc.connect.model.Catering;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CateringRepository extends JpaRepository<Catering, Long> {

    List<Catering> findByClienteCorreoIgnoreCase(String correo);

    Optional<Catering> findByIdAndClienteCorreoIgnoreCase(
            Long id,
            String correo
    );
}