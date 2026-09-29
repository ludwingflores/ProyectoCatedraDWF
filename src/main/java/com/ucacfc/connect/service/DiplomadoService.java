package com.ucacfc.connect.service;

import com.ucacfc.connect.exception.ResourceNotFoundException;
import com.ucacfc.connect.model.Diplomado;
import com.ucacfc.connect.repository.DiplomadoRepository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class DiplomadoService {

    private final DiplomadoRepository repository;
    private final CategoriaService categoriaService;
    private final ModalidadService modalidadService;
    private final DocenteService docenteService;

    public DiplomadoService(
            DiplomadoRepository repository,
            CategoriaService categoriaService,
            ModalidadService modalidadService,
            DocenteService docenteService) {

        this.repository = repository;
        this.categoriaService = categoriaService;
        this.modalidadService = modalidadService;
        this.docenteService = docenteService;
    }

    @Transactional(readOnly = true)
    public List<Diplomado> findAll() {
        return repository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Diplomado> findAllActivos() {
        return repository.findByActivoTrue();
    }

    @Transactional(readOnly = true)
    public Page<Diplomado> searchByNombre(
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
    public Page<Diplomado> searchActivosByNombre(
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
    public Diplomado findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Diplomado no encontrado con id: " + id
                        )
                );
    }

    @Transactional(readOnly = true)
    public Diplomado findActivoById(Long id) {

        Diplomado diplomado = findById(id);

        if (!Boolean.TRUE.equals(diplomado.getActivo())) {
            throw new ResourceNotFoundException(
                    "Diplomado no encontrado con id: " + id
            );
        }

        return diplomado;
    }

    public Diplomado save(Diplomado entity) {
        validarFechas(entity);
        validarCatalogos(entity);

        return repository.save(entity);
    }

    public Diplomado update(Long id, Diplomado entity) {
        validarFechas(entity);
        validarCatalogos(entity);

        Diplomado current = findById(id);
        copyFields(current, entity);

        return repository.save(current);
    }

    public void delete(Long id) {
        Diplomado current = findById(id);

        current.setActivo(false);

        repository.save(current);
    }

    private void validarFechas(Diplomado diplomado) {

        if (diplomado.getFechaInicio() != null
                && diplomado.getFechaFin() != null
                && diplomado.getFechaFin().isBefore(diplomado.getFechaInicio())) {

            throw new IllegalArgumentException(
                    "La fecha de fin del diplomado no puede ser anterior a la fecha de inicio"
            );
        }
    }

    private void validarCatalogos(Diplomado diplomado) {

        if (diplomado.getCategoria() != null) {

            if (diplomado.getCategoria().getId() == null) {
                throw new IllegalArgumentException(
                        "La categoría seleccionada debe tener un id"
                );
            }

            diplomado.setCategoria(
                    categoriaService.findActivaById(
                            diplomado.getCategoria().getId()
                    )
            );
        }

        if (diplomado.getModalidad() != null) {

            if (diplomado.getModalidad().getId() == null) {
                throw new IllegalArgumentException(
                        "La modalidad seleccionada debe tener un id"
                );
            }

            diplomado.setModalidad(
                    modalidadService.findActivaById(
                            diplomado.getModalidad().getId()
                    )
            );
        }

        if (diplomado.getDocente() != null) {

            if (diplomado.getDocente().getId() == null) {
                throw new IllegalArgumentException(
                        "El docente seleccionado debe tener un id"
                );
            }

            diplomado.setDocente(
                    docenteService.findActivoById(
                            diplomado.getDocente().getId()
                    )
            );
        }
    }

    private void copyFields(
            Diplomado current,
            Diplomado incoming) {

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