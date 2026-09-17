package com.ucacfc.connect.service;

import com.ucacfc.connect.exception.ResourceNotFoundException;
import com.ucacfc.connect.model.Inscripcion;
import com.ucacfc.connect.repository.InscripcionRepository;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class InscripcionService {

    private final InscripcionRepository repository;

    public InscripcionService(InscripcionRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public Page<Inscripcion> findAll(int page, int size, String sortBy, String direction) {
        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        return repository.findAll(PageRequest.of(page, size, sort));
    }

    @Transactional(readOnly = true)
    public Inscripcion findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Inscripcion no encontrado con id: " + id));
    }

    public Inscripcion save(Inscripcion entity) {
        return repository.save(entity);
    }

    public Inscripcion update(Long id, Inscripcion entity) {
        Inscripcion current = findById(id);
        copyFields(current, entity);
        return repository.save(current);
    }

    public void delete(Long id) {
        Inscripcion current = findById(id);
        repository.delete(current);
    }

    private void copyFields(Inscripcion current, Inscripcion incoming) {
        current.setCliente(incoming.getCliente());
        current.setCurso(incoming.getCurso());
        current.setFecha(incoming.getFecha());
        current.setEstado(incoming.getEstado());
    }
}
