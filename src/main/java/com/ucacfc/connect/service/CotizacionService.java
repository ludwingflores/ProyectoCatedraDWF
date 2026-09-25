package com.ucacfc.connect.service;

import com.ucacfc.connect.exception.ResourceNotFoundException;
import com.ucacfc.connect.model.Cotizacion;
import com.ucacfc.connect.repository.CotizacionRepository;

import java.util.List;

import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class CotizacionService {

    private final CotizacionRepository repository;

    public CotizacionService(CotizacionRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<Cotizacion> findAll(){
        return repository.findAll();
    }

    @Transactional(readOnly = true)
    public Cotizacion findById(Long id) {
        return repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Cotizacion no encontrado con id: " + id));
    }

    public Cotizacion save(Cotizacion entity) {
        return repository.save(entity);
    }

    public Cotizacion update(Long id, Cotizacion entity) {
        Cotizacion current = findById(id);
        copyFields(current, entity);
        return repository.save(current);
    }

    public void delete(Long id) {
        Cotizacion current = findById(id);
        repository.delete(current);
    }

    private void copyFields(Cotizacion current, Cotizacion incoming) {
        current.setCliente(incoming.getCliente());
        current.setFecha(incoming.getFecha());
        current.setDescripcion(incoming.getDescripcion());
        current.setMonto(incoming.getMonto());
        current.setEstado(incoming.getEstado());
    }
}
