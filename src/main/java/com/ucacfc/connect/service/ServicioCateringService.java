package com.ucacfc.connect.service;

import com.ucacfc.connect.exception.ResourceNotFoundException;
import com.ucacfc.connect.model.ServicioCatering;
import com.ucacfc.connect.repository.ServicioCateringRepository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ServicioCateringService {

    private final ServicioCateringRepository repository;

    public ServicioCateringService(
            ServicioCateringRepository repository) {

        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<ServicioCatering> findAll() {
        return repository.findAll();
    }

    @Transactional(readOnly = true)
    public List<ServicioCatering> findAllActivos() {
        return repository.findByActivoTrue();
    }

    @Transactional(readOnly = true)
    public ServicioCatering findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Servicio de catering no encontrado con id: " + id
                        )
                );
    }

    @Transactional(readOnly = true)
    public ServicioCatering findActivoById(Long id) {

        ServicioCatering servicio = findById(id);

        if (!Boolean.TRUE.equals(servicio.getActivo())) {
            throw new IllegalArgumentException(
                    "El servicio de catering seleccionado no está activo"
            );
        }

        return servicio;
    }

    /*
     * Búsqueda para ADMIN.
     * Puede consultar servicios activos e inactivos.
     */
    @Transactional(readOnly = true)
    public Page<ServicioCatering> search(
            String nombre,
            String tipo,
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

        if (tipo != null && !tipo.isBlank()) {
            return repository.findByTipoContainingIgnoreCase(
                    tipo,
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

    /*
     * Búsqueda para usuarios que no son ADMIN.
     * Siempre limita los resultados a servicios activos.
     */
    @Transactional(readOnly = true)
    public Page<ServicioCatering> searchActivos(
            String nombre,
            String tipo,
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

        if (tipo != null && !tipo.isBlank()) {
            return repository
                    .findByActivoTrueAndTipoContainingIgnoreCase(
                            tipo,
                            pageable
                    );
        }

        return repository.findByActivoTrue(pageable);
    }

    public ServicioCatering save(
            ServicioCatering entity) {

        return repository.save(entity);
    }

    public ServicioCatering update(
            Long id,
            ServicioCatering entity) {

        ServicioCatering current = findById(id);

        copyFields(current, entity);

        return repository.save(current);
    }

    public void delete(Long id) {

        ServicioCatering current = findById(id);

        current.setActivo(false);

        repository.save(current);
    }

    private void copyFields(
            ServicioCatering current,
            ServicioCatering incoming) {

        current.setNombre(incoming.getNombre());
        current.setTipo(incoming.getTipo());
        current.setPrecioPorPersona(
                incoming.getPrecioPorPersona()
        );
        current.setActivo(incoming.getActivo());
    }
}