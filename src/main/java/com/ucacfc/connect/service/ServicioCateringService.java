package com.ucacfc.connect.service;

import com.ucacfc.connect.exception.ResourceNotFoundException;
import com.ucacfc.connect.model.ServicioCatering;
import com.ucacfc.connect.repository.ServicioCateringRepository;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ServicioCateringService {

    private final ServicioCateringRepository repository;

    public ServicioCateringService(ServicioCateringRepository repository) {
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
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Servicio de catering no encontrado con id: " + id));
    }

    @Transactional(readOnly = true)
    public ServicioCatering findActivoById(Long id) {
        ServicioCatering servicio = findById(id);

        if (!Boolean.TRUE.equals(servicio.getActivo())) {
            throw new IllegalArgumentException(
                    "El servicio de catering seleccionado no está activo");
        }

        return servicio;
    }

    public ServicioCatering save(ServicioCatering entity) {
        return repository.save(entity);
    }

    public ServicioCatering update(Long id, ServicioCatering entity) {
        ServicioCatering current = findById(id);
        copyFields(current, entity);
        return repository.save(current);
    }

    public void delete(Long id) {
    ServicioCatering current = findById(id);
    current.setActivo(false);
    repository.save(current);
}

    private void copyFields(ServicioCatering current, ServicioCatering incoming) {
        current.setNombre(incoming.getNombre());
        current.setTipo(incoming.getTipo());
        current.setPrecioPorPersona(incoming.getPrecioPorPersona());
        current.setActivo(incoming.getActivo());
    }
}