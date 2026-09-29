package com.ucacfc.connect.service;

import com.ucacfc.connect.exception.ResourceNotFoundException;
import com.ucacfc.connect.model.Categoria;
import com.ucacfc.connect.repository.CategoriaRepository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class CategoriaService {

    private final CategoriaRepository repository;

    public CategoriaService(CategoriaRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<Categoria> findAll() {
        return repository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Categoria> findAllActivas() {
        return repository.findByActivoTrue();
    }

    @Transactional(readOnly = true)
    public Categoria findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Categoría no encontrada con id: " + id
                        )
                );
    }

    @Transactional(readOnly = true)
    public Categoria findActivaById(Long id) {

        Categoria categoria = findById(id);

        if (!Boolean.TRUE.equals(categoria.getActivo())) {
            throw new IllegalArgumentException(
                    "La categoría seleccionada no está activa"
            );
        }

        return categoria;
    }

    @Transactional(readOnly = true)
    public Page<Categoria> search(
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
    public Page<Categoria> searchActivas(
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

    public Categoria save(Categoria entity) {
        return repository.save(entity);
    }

    public Categoria update(
            Long id,
            Categoria entity) {

        Categoria current = findById(id);

        current.setNombre(entity.getNombre());
        current.setActivo(entity.getActivo());

        return repository.save(current);
    }

    public void delete(Long id) {

        Categoria current = findById(id);

        current.setActivo(false);

        repository.save(current);
    }
}