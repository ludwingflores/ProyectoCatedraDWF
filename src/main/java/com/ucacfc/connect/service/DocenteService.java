package com.ucacfc.connect.service;

import com.ucacfc.connect.model.Docente;
import com.ucacfc.connect.repository.DocenteRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class DocenteService {

    private final DocenteRepository docenteRepository;

    public DocenteService(DocenteRepository docenteRepository) {
        this.docenteRepository = docenteRepository;
    }

    @Transactional(readOnly = true)
    public List<Docente> findAll() {
        return docenteRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Docente> findAllActivos() {
        return docenteRepository.findByActivoTrue();
    }

    @Transactional(readOnly = true)
    public Docente findById(Long id) {
        return docenteRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("Docente no encontrado"));
    }

    @Transactional(readOnly = true)
    public Docente findActivoById(Long id) {
        Docente docente = findById(id);

        if (!Boolean.TRUE.equals(docente.getActivo())) {
            throw new IllegalArgumentException("Docente no encontrado");
        }

        return docente;
    }

    @Transactional(readOnly = true)
    public Page<Docente> search(
            String nombre,
            Boolean activo,
            int page,
            int size,
            String sortBy,
            String direction
    ) {
        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        if (nombre != null && !nombre.isBlank()) {
            return docenteRepository
                    .findByNombreContainingIgnoreCase(nombre)
                    .stream()
                    .filter(docente ->
                            activo == null ||
                            activo.equals(docente.getActivo()))
                    .collect(
                            java.util.stream.Collectors.collectingAndThen(
                                    java.util.stream.Collectors.toList(),
                                    lista -> {
                                        int start = Math.min(
                                                (int) pageable.getOffset(),
                                                lista.size()
                                        );

                                        int end = Math.min(
                                                start + pageable.getPageSize(),
                                                lista.size()
                                        );

                                        return new org.springframework.data.domain.PageImpl<>(
                                                lista.subList(start, end),
                                                pageable,
                                                lista.size()
                                        );
                                    }
                            )
                    );
        }

        if (activo != null) {
            List<Docente> docentes =
                    docenteRepository.findByActivo(activo);

            int start = Math.min(
                    (int) pageable.getOffset(),
                    docentes.size()
            );

            int end = Math.min(
                    start + pageable.getPageSize(),
                    docentes.size()
            );

            return new org.springframework.data.domain.PageImpl<>(
                    docentes.subList(start, end),
                    pageable,
                    docentes.size()
            );
        }

        return docenteRepository.findAll(pageable);
    }

    @Transactional(readOnly = true)
    public Page<Docente> searchActivos(
            String nombre,
            int page,
            int size,
            String sortBy,
            String direction
    ) {
        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        if (nombre != null && !nombre.isBlank()) {
            return docenteRepository
                    .findByActivoTrueAndNombreContainingIgnoreCase(
                            nombre,
                            pageable
                    );
        }

        return docenteRepository.findByActivoTrue(pageable);
    }

    public Docente save(Docente docente) {
        docente.setActivo(true);
        return docenteRepository.save(docente);
    }

    public Docente update(Long id, Docente datos) {
        Docente docente = findById(id);

        docente.setNombre(datos.getNombre());

        if (datos.getActivo() != null) {
            docente.setActivo(datos.getActivo());
        }

        return docenteRepository.save(docente);
    }

    public void delete(Long id) {
        Docente docente = findById(id);
        docente.setActivo(false);
        docenteRepository.save(docente);
    }
}