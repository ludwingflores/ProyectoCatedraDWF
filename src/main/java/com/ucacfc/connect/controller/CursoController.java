package com.ucacfc.connect.controller;

import com.ucacfc.connect.model.Curso;
import com.ucacfc.connect.service.CursoService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cursos")
public class CursoController {

    private final CursoService service;

    public CursoController(CursoService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<Page<Curso>> findAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction,
            @RequestParam(required = false) String nombre) {
        if (nombre != null && !nombre.isBlank()) {
            return ResponseEntity.ok(service.searchByNombre(nombre, page, size, sortBy, direction));
        }
        return ResponseEntity.ok(service.findAll(page, size, sortBy, direction));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Curso> findById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PostMapping
    public ResponseEntity<Curso> create(@Valid @RequestBody Curso entity) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.save(entity));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Curso> update(@PathVariable Long id, @Valid @RequestBody Curso entity) {
        return ResponseEntity.ok(service.update(id, entity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}