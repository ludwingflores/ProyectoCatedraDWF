package com.ucacfc.connect.service;

import com.ucacfc.connect.exception.ResourceNotFoundException;
import com.ucacfc.connect.model.Catering;
import com.ucacfc.connect.repository.CateringRepository;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class CateringService {

    private final CateringRepository repository;

    public CateringService(CateringRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public Page<Catering> findAll(int page, int size, String sortBy, String direction) {
        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        return repository.findAll(PageRequest.of(page, size, sort));
    }

    @Transactional(readOnly = true)
    public Catering findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Catering no encontrado con id: " + id));
    }

    public Catering save(Catering entity) {
        return repository.save(entity);
    }

    public Catering update(Long id, Catering entity) {
        Catering current = findById(id);
        copyFields(current, entity);
        return repository.save(current);
    }

    public void delete(Long id) {
        Catering current = findById(id);
        repository.delete(current);
    }

    private void copyFields(Catering current, Catering incoming) {
        current.setCliente(incoming.getCliente());
        current.setTipoServicio(incoming.getTipoServicio());
        current.setNumeroAsistentes(incoming.getNumeroAsistentes());
        current.setMenu(incoming.getMenu());
        current.setFecha(incoming.getFecha());
        current.setHora(incoming.getHora());
        current.setLugar(incoming.getLugar());
        current.setCosto(incoming.getCosto());
        current.setEstado(incoming.getEstado());
    }
}
