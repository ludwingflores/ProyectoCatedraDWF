package com.ucacfc.connect.service;

import com.ucacfc.connect.exception.ResourceNotFoundException;
import com.ucacfc.connect.model.Modalidad;
import com.ucacfc.connect.repository.ModalidadRepository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ModalidadService {

    private final ModalidadRepository repository;

    public ModalidadService(ModalidadRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<Modalidad> findAll() {
        return repository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Modalidad> findAllActivas() {
        return repository.findByActivoTrue();
    }

    @Transactional(readOnly = true)
    public Modalidad findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Modalidad no encontrada con id: " + id
                        )
                );
    }

    @Transactional(readOnly = true)
    public Modalidad findActivaById(Long id) {

        Modalidad modalidad = findById(id);

        if (!Boolean.TRUE.equals(modalidad.getActivo())) {
            throw new IllegalArgumentException(
                    "La modalidad seleccionada no está activa"
            );
        }

        return modalidad;
    }

    @Transactional(readOnly = true)
    public Page<Modalidad> search(
            String nombre,
            Boolean activo,
            int page,
            int size,
            String sortBy,
            String direction) {

        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        PageRequest pageable =
                PageRequest.of(page, size, sort);

        if (nombre != null && !nombre.isBlank()) {
            return repository.findByNombreContainingIgnoreCase(
                    nombre,
                    pageable
            );
        }

        if (activo != null) {
            return repository.findByActivo(
                    activo,
                    pageable
            );
        }

        return repository.findAll(pageable);
    }

    @Transactional(readOnly = true)
    public Page<Modalidad> searchActivas(
            String nombre,
            int page,
            int size,
            String sortBy,
            String direction) {

        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        PageRequest pageable =
                PageRequest.of(page, size, sort);

        if (nombre != null && !nombre.isBlank()) {
            return repository
                    .findByActivoTrueAndNombreContainingIgnoreCase(
                            nombre,
                            pageable
                    );
        }

        return repository.findByActivoTrue(pageable);
    }

    public Modalidad save(Modalidad entity) {
        return repository.save(entity);
    }

    public Modalidad update(
            Long id,
            Modalidad entity) {

        Modalidad current = findById(id);

        current.setNombre(entity.getNombre());
        current.setActivo(entity.getActivo());

        return repository.save(current);
    }

    public void delete(Long id) {

        Modalidad current = findById(id);

        current.setActivo(false);

        repository.save(current);
    }
}