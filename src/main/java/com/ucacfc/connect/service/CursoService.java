package com.ucacfc.connect.service;

import com.ucacfc.connect.exception.ResourceNotFoundException;
import com.ucacfc.connect.model.Curso;
import com.ucacfc.connect.repository.CursoRepository;

import java.util.List;

import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class CursoService {

    private final CursoRepository repository;

    public CursoService(CursoRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<Curso> findAll(){
        return repository.findAll();
    }

    @Transactional(readOnly = true)
    public Page<Curso> searchByNombre(String nombre, int page, int size, String sortBy, String direction) {
        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        return repository.findByNombreContainingIgnoreCase(nombre, PageRequest.of(page, size, sort));
    }

    @Transactional(readOnly = true)
    public Curso findById(Long id) {
        return repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Curso no encontrado con id: " + id));
    }

    public Curso save(Curso entity) {
        return repository.save(entity);
    }

    public Curso update(Long id, Curso entity) {
        Curso current = findById(id);
        copyFields(current, entity);
        return repository.save(current);
    }

    public void delete(Long id) {
        Curso current = findById(id);
        repository.delete(current);
    }

    private void copyFields(Curso current, Curso incoming) {
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
