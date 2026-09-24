package com.ucacfc.connect.service;

import com.ucacfc.connect.exception.ResourceNotFoundException;
import com.ucacfc.connect.model.Espacio;
import com.ucacfc.connect.repository.EspacioRepository;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@SuppressWarnings("null")
public class EspacioService {

    private final EspacioRepository repository;

    public EspacioService(EspacioRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public Page<Espacio> findAll(int page, int size, String sortBy, String direction) {
        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        return repository.findAll(PageRequest.of(page, size, sort));
    }

    @Transactional(readOnly = true)
    public Espacio findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Espacio no encontrado con id: " + id));
    }

    public Espacio save(Espacio entity) {
        return repository.save(entity);
    }

    public Espacio update(Long id, Espacio entity) {
        Espacio current = findById(id);
        copyFields(current, entity);
        return repository.save(current);
    }

    public void delete(Long id) {
        Espacio current = findById(id);
        repository.delete(current);
    }

    private void copyFields(Espacio current, Espacio incoming) {
        current.setNombre(incoming.getNombre());
        current.setTipo(incoming.getTipo());
        current.setCapacidad(incoming.getCapacidad());
        current.setPrecio(incoming.getPrecio());
        current.setDisponible(incoming.getDisponible());
        current.setEquipamiento(incoming.getEquipamiento());
    }
}
