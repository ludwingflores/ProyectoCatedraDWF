package com.ucacfc.connect.service;

import com.ucacfc.connect.exception.ResourceNotFoundException;
import com.ucacfc.connect.model.Cliente;
import com.ucacfc.connect.model.EstadoPago;
import com.ucacfc.connect.model.MetodoPago;
import com.ucacfc.connect.model.Pago;
import com.ucacfc.connect.model.TipoPago;
import com.ucacfc.connect.repository.ClienteRepository;
import com.ucacfc.connect.repository.PagoRepository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class PagoService {

    private final PagoRepository repository;
    private final ClienteRepository clienteRepository;

    public PagoService(
            PagoRepository repository,
            ClienteRepository clienteRepository) {

        this.repository = repository;
        this.clienteRepository = clienteRepository;
    }

    // =========================================================
    // CONSULTAS
    // =========================================================

    @Transactional(readOnly = true)
    public List<Pago> findAll() {
        return repository.findAll();
    }

    @Transactional(readOnly = true)
    public Pago findById(Long id) {

        return repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Pago no encontrado con id: " + id
                        )
                );
    }

    // =========================================================
    // PAGINACIÓN Y FILTROS
    // =========================================================

    @Transactional(readOnly = true)
    public Page<Pago> findAllPage(Pageable pageable) {
        return repository.findAll(pageable);
    }

    @Transactional(readOnly = true)
    public Page<Pago> findByTipo(
            TipoPago tipo,
            Pageable pageable) {

        return repository.findByTipo(tipo, pageable);
    }

    @Transactional(readOnly = true)
    public Page<Pago> findByMetodo(
            MetodoPago metodo,
            Pageable pageable) {

        return repository.findByMetodo(metodo, pageable);
    }

    @Transactional(readOnly = true)
    public Page<Pago> findByEstado(
            EstadoPago estado,
            Pageable pageable) {

        return repository.findByEstado(estado, pageable);
    }

    @Transactional(readOnly = true)
    public Page<Pago> findByTipoAndEstado(
            TipoPago tipo,
            EstadoPago estado,
            Pageable pageable) {

        return repository.findByTipoAndEstado(
                tipo,
                estado,
                pageable
        );
    }

    @Transactional(readOnly = true)
    public Page<Pago> findByClienteId(
            Long clienteId,
            Pageable pageable) {

        return repository.findByClienteId(
                clienteId,
                pageable
        );
    }

    // =========================================================
    // CREAR
    // =========================================================

    public Pago save(Pago entity) {

        validarCliente(entity);

        if (entity.getEstado() == null) {
            entity.setEstado(EstadoPago.PENDIENTE);
        }

        return repository.save(entity);
    }

    // =========================================================
    // ACTUALIZAR
    // =========================================================

    public Pago update(Long id, Pago entity) {

        Pago current = findById(id);

        validarCliente(entity);

        copyFields(current, entity);

        return repository.save(current);
    }

    // =========================================================
    // ELIMINAR
    // =========================================================

    public void delete(Long id) {

        Pago current = findById(id);

        repository.delete(current);
    }

    // =========================================================
    // VALIDAR CLIENTE
    // =========================================================

    private void validarCliente(Pago pago) {

        if (pago.getCliente() == null
                || pago.getCliente().getId() == null) {

            throw new IllegalArgumentException(
                    "El cliente es obligatorio"
            );
        }

        Cliente cliente = clienteRepository
                .findById(pago.getCliente().getId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Cliente no encontrado con id: "
                                        + pago.getCliente().getId()
                        )
                );

        pago.setCliente(cliente);
    }

    // =========================================================
    // COPIAR CAMPOS
    // =========================================================

    private void copyFields(
            Pago current,
            Pago incoming) {

        current.setCliente(incoming.getCliente());
        current.setTipo(incoming.getTipo());
        current.setMonto(incoming.getMonto());
        current.setMetodo(incoming.getMetodo());
        current.setEstado(incoming.getEstado());
        current.setFecha(incoming.getFecha());
        current.setReferencia(incoming.getReferencia());
    }
}