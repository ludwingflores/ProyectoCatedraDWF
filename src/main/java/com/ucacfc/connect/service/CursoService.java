
package com.ucacfc.connect.service;

import com.ucacfc.connect.exception.ResourceNotFoundException;
import com.ucacfc.connect.model.Curso;
import com.ucacfc.connect.repository.CursoRepository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class CursoService {

    private final CursoRepository repository;
    private final CategoriaService categoriaService;
    private final ModalidadService modalidadService;
    private final DocenteService docenteService;

    public CursoService(
            CursoRepository repository,
            CategoriaService categoriaService,
            ModalidadService modalidadService,
            DocenteService docenteService) {

        this.repository = repository;
        this.categoriaService = categoriaService;
        this.modalidadService = modalidadService;
        this.docenteService = docenteService;
    }

    @Transactional(readOnly = true)
    public List<Curso> findAll() {
        return repository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Curso> findAllActivos() {
        return repository.findByActivoTrue();
    }

    @Transactional(readOnly = true)
    public Page<Curso> searchByNombre(
            String nombre,
            int page,
            int size,
            String sortBy,
            String direction) {

        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        return repository.findByNombreContainingIgnoreCase(
                nombre,
                PageRequest.of(page, size, sort)
        );
    }

    @Transactional(readOnly = true)
    public Page<Curso> searchActivosByNombre(
            String nombre,
            int page,
            int size,
            String sortBy,
            String direction) {

        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        PageRequest pageable = PageRequest.of(
                page,
                size,
                sort
        );

        if (nombre != null && !nombre.isBlank()) {
            return repository
                    .findByActivoTrueAndNombreContainingIgnoreCase(
                            nombre,
                            pageable
                    );
        }

        return repository.findByActivoTrue(pageable);
    }

    @Transactional(readOnly = true)
    public Curso findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Curso no encontrado con id: " + id
                        )
                );
    }

    @Transactional(readOnly = true)
    public Curso findActivoById(Long id) {

        Curso curso = findById(id);

        if (!Boolean.TRUE.equals(curso.getActivo())) {
            throw new ResourceNotFoundException(
                    "Curso no encontrado con id: " + id
            );
        }

        return curso;
    }

    public Curso save(Curso entity) {
        validarFechas(entity);
        validarCatalogos(entity);

        return repository.save(entity);
    }

    public Curso update(Long id, Curso entity) {
        validarFechas(entity);
        validarCatalogos(entity);

        Curso current = findById(id);
        copyFields(current, entity);

        return repository.save(current);
    }

    public void delete(Long id) {
        Curso current = findById(id);

        current.setActivo(false);

        repository.save(current);
    }

    private void validarFechas(Curso curso) {

        if (curso.getFechaInicio() != null
                && curso.getFechaFin() != null
                && curso.getFechaFin().isBefore(curso.getFechaInicio())) {

            throw new IllegalArgumentException(
                    "La fecha de fin del curso no puede ser anterior a la fecha de inicio"
            );
        }
    }

    private void validarCatalogos(Curso curso) {

        if (curso.getCategoria() != null) {

            if (curso.getCategoria().getId() == null) {
                throw new IllegalArgumentException(
                        "La categoría seleccionada debe tener un id"
                );
            }

            curso.setCategoria(
                    categoriaService.findActivaById(
                            curso.getCategoria().getId()
                    )
            );
        }

        if (curso.getModalidad() != null) {

            if (curso.getModalidad().getId() == null) {
                throw new IllegalArgumentException(
                        "La modalidad seleccionada debe tener un id"
                );
            }

            curso.setModalidad(
                    modalidadService.findActivaById(
                            curso.getModalidad().getId()
                    )
            );
        }

        if (curso.getDocente() != null) {

            if (curso.getDocente().getId() == null) {
                throw new IllegalArgumentException(
                        "El docente seleccionado debe tener un id"
                );
            }

            curso.setDocente(
                    docenteService.findActivoById(
                            curso.getDocente().getId()
                    )
            );
        }
    }

    private void copyFields(
            Curso current,
            Curso incoming) {

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
