package com.ucacfc.connect.service;

import com.ucacfc.connect.exception.ResourceNotFoundException;
import com.ucacfc.connect.model.Agenda;
import com.ucacfc.connect.repository.AgendaRepository;

import jakarta.validation.constraints.NotNull;

import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AgendaService {

    private final AgendaRepository repository;

    public AgendaService(AgendaRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public Page<Agenda> findAll(int page, int size, String sortBy, String direction) {
        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        return repository.findAll(PageRequest.of(page, size, sort));
    }

    @Transactional(readOnly = true)
    public Agenda findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Agenda no encontrado con id: " + id));
    }

    public Agenda save(Agenda entity) {
        return repository.save(entity);
    }

    public Agenda update(Long id, Agenda entity) {
        Agenda current = findById(id);
        copyFields(current, entity);
        return repository.save(current);
    }

    public void delete(Long id) {
        Agenda current = findById(id);
        repository.delete(current);
    }

    private void copyFields(Agenda current, Agenda incoming) {
        current.setTitulo(incoming.getTitulo());
        current.setDescripcion(incoming.getDescripcion());
        current.setFecha(incoming.getFecha());
        current.setHoraInicio(incoming.getHoraInicio());
        current.setHoraFin(incoming.getHoraFin());
        current.setTipo(incoming.getTipo());
        current.setEspacio(incoming.getEspacio());
    }
}
