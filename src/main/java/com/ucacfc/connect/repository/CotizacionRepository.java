package com.ucacfc.connect.repository;

import com.ucacfc.connect.model.Cotizacion;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CotizacionRepository extends JpaRepository<Cotizacion, Long> {

    List<Cotizacion> findByClienteCorreoIgnoreCase(String correo);

    Optional<Cotizacion> findByIdAndClienteCorreoIgnoreCase(
            Long id,
            String correo
    );
}