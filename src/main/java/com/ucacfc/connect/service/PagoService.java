package com.ucacfc.connect.service;

import com.ucacfc.connect.exception.ResourceNotFoundException;
import com.ucacfc.connect.model.Pago;
import com.ucacfc.connect.repository.PagoRepository;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@SuppressWarnings("null")
public class PagoService {

    private final PagoRepository repository;

    public PagoService(PagoRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public Page<Pago> findAll(int page, int size, String sortBy, String direction) {
        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        return repository.findAll(PageRequest.of(page, size, sort));
    }

    @Transactional(readOnly = true)
    public Pago findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pago no encontrado con id: " + id));
    }

    public Pago save(Pago entity) {
        return repository.save(entity);
    }

    public Pago update(Long id, Pago entity) {
        Pago current = findById(id);
        copyFields(current, entity);
        return repository.save(current);
    }

    public void delete(Long id) {
        Pago current = findById(id);
        repository.delete(current);
    }

    private void copyFields(Pago current, Pago incoming) {
        current.setCliente(incoming.getCliente());
        current.setMonto(incoming.getMonto());
        current.setMetodo(incoming.getMetodo());
        current.setEstado(incoming.getEstado());
        current.setFecha(incoming.getFecha());
        current.setReferencia(incoming.getReferencia());
    }
}
