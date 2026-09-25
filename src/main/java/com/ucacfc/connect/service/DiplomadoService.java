package com.ucacfc.connect.service;

import com.ucacfc.connect.exception.ResourceNotFoundException;
import com.ucacfc.connect.model.Diplomado;
import com.ucacfc.connect.repository.DiplomadoRepository;

import java.util.List;

import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class DiplomadoService {

    private final DiplomadoRepository repository;

    public DiplomadoService(DiplomadoRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<Diplomado> findAll(){
        return repository.findAll();
    }

    @Transactional(readOnly = true)
    public Page<Diplomado> searchByNombre(String nombre, int page, int size, String sortBy, String direction) {
        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        return repository.findByNombreContainingIgnoreCase(nombre, PageRequest.of(page, size, sort));
    }

    @Transactional(readOnly = true)
    public Diplomado findById(Long id) {
        return repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Diplomado no encontrado con id: " + id));
    }

    public Diplomado save(Diplomado entity) {
        return repository.save(entity);
    }

    public Diplomado update(Long id, Diplomado entity) {
        Diplomado current = findById(id);
        copyFields(current, entity);
        return repository.save(current);
    }

    public void delete(Long id) {
        Diplomado current = findById(id);
        repository.delete(current);
    }

    private void copyFields(Diplomado current, Diplomado incoming) {
        current.setNombre(incoming.getNombre());
        current.setDescripcion(incoming.getDescripcion());
        current.setCategoria(incoming.getCategoria());
        current.setModalidad(incoming.getModalidad());
        current.setDocente(incoming.getDocente());
        current.setCupoMaximo(incoming.getCupoMaximo());
        current.setFechaInicio(incoming.getFechaInicio());
        current.setFechaFin(incoming.getFechaFin());
        current.setHorario(incoming.getHorario());
        current.setCosto(incoming.getCosto());
        current.setActivo(incoming.getActivo());
    }
}
