package com.ucacfc.connect.repository;

import com.ucacfc.connect.model.EstadoPago;
import com.ucacfc.connect.model.MetodoPago;
import com.ucacfc.connect.model.Pago;
import com.ucacfc.connect.model.TipoPago;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PagoRepository extends JpaRepository<Pago, Long> {

    Page<Pago> findByTipo(TipoPago tipo, Pageable pageable);

    Page<Pago> findByMetodo(MetodoPago metodo, Pageable pageable);

    Page<Pago> findByEstado(EstadoPago estado, Pageable pageable);

    Page<Pago> findByTipoAndEstado(
            TipoPago tipo,
            EstadoPago estado,
            Pageable pageable
    );

    Page<Pago> findByClienteId(
            Long clienteId,
            Pageable pageable
    );
}