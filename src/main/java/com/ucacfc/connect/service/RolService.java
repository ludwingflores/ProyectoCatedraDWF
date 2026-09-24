package com.ucacfc.connect.service;

import com.ucacfc.connect.exception.ResourceNotFoundException;
import com.ucacfc.connect.model.Rol;
import com.ucacfc.connect.repository.RolRepository;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@SuppressWarnings("null")
public class RolService {

    private final RolRepository repository;

    public RolService(RolRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public Page<Rol> findAll(int page, int size, String sortBy, String direction) {
        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        return repository.findAll(PageRequest.of(page, size, sort));
    }

    @Transactional(readOnly = true)
    public Rol findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Rol no encontrado con id: " + id));
    }

    public Rol save(Rol entity) {
        return repository.save(entity);
    }

    public Rol update(Long id, Rol entity) {
        Rol current = findById(id);
        copyFields(current, entity);
        return repository.save(current);
    }

    public void delete(Long id) {
        Rol current = findById(id);
        repository.delete(current);
    }

    private void copyFields(Rol current, Rol incoming) {
        current.setNombre(incoming.getNombre());
    }
}
