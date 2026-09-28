package com.ucacfc.connect.service;

import com.ucacfc.connect.exception.ResourceNotFoundException;
import com.ucacfc.connect.model.Espacio;
import com.ucacfc.connect.repository.EspacioRepository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class EspacioService {

    private final EspacioRepository repository;

    public EspacioService(EspacioRepository repository) {
        this.repository = repository;
    }

    // =========================================================
    // CONSULTAS GENERALES
    // =========================================================

    @Transactional(readOnly = true)
    public List<Espacio> findAll() {
        return repository.findAll();
    }

    @Transactional(readOnly = true)
    public Espacio findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Espacio no encontrado con id: " + id
                        )
                );
    }

    // =========================================================
    // FILTROS + PAGINACIÓN + ORDENAMIENTO
    // =========================================================

    @Transactional(readOnly = true)
    public Page<Espacio> search(
            String nombre,
            String tipo,
            Integer capacidad,
            Boolean disponible,
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

        if (capacidad != null) {
            return repository.findByCapacidadGreaterThanEqual(
                    capacidad,
                    pageable
            );
        }

        if (disponible != null) {
            return repository.findByDisponible(
                    disponible,
                    pageable
            );
        }

        return repository.findAll(pageable);
    }

    // =========================================================
    // CREAR
    // =========================================================

    public Espacio save(Espacio entity) {
        return repository.save(entity);
    }

    // =========================================================
    // ACTUALIZAR
    // =========================================================

    public Espacio update(
            Long id,
            Espacio entity) {

        Espacio current = findById(id);

        copyFields(current, entity);

        return repository.save(current);
    }

    // =========================================================
    // ELIMINAR
    // =========================================================

    public void delete(Long id) {

        Espacio current = findById(id);

        repository.delete(current);
    }

    // =========================================================
    // COPIAR CAMPOS
    // =========================================================

    private void copyFields(
            Espacio current,
            Espacio incoming) {

        current.setNombre(
                incoming.getNombre()
        );

        current.setTipo(
                incoming.getTipo()
        );

        current.setCapacidad(
                incoming.getCapacidad()
        );

        current.setPrecio(
                incoming.getPrecio()
        );

        current.setDisponible(
                incoming.getDisponible()
        );

        current.setEquipamiento(
                incoming.getEquipamiento()
        );
    }
}