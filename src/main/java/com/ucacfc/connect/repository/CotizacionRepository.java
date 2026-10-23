package com.ucacfc.connect.repository;

import com.ucacfc.connect.model.Cotizacion;
import com.ucacfc.connect.model.EstadoCotizacion;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CotizacionRepository extends JpaRepository<Cotizacion, Long> {

    List<Cotizacion> findByClienteCorreoIgnoreCase(String correo);

    Optional<Cotizacion> findByIdAndClienteCorreoIgnoreCase(Long id, String correo);

    Page<Cotizacion> findByClienteId(Long clienteId, Pageable pageable);

    Page<Cotizacion> findByEstado(EstadoCotizacion estado, Pageable pageable);

    Page<Cotizacion> findByFecha(LocalDate fecha, Pageable pageable);

    Page<Cotizacion> findByClienteCorreoIgnoreCase(String correo, Pageable pageable);

    Page<Cotizacion> findByClienteCorreoIgnoreCaseAndEstado(String correo, EstadoCotizacion estado, Pageable pageable);

    Page<Cotizacion> findByClienteCorreoIgnoreCaseAndFecha(String correo, LocalDate fecha, Pageable pageable);
}