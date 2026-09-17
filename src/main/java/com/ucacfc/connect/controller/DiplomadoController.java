package com.ucacfc.connect.controller;

import com.ucacfc.connect.model.Diplomado;
import com.ucacfc.connect.service.DiplomadoService;
import org.springframework.data.domain.Page;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/diplomados")
public class DiplomadoController {

    private final DiplomadoService service;

    public DiplomadoController(DiplomadoService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<Page<Diplomado>> findAll(
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
    public ResponseEntity<Diplomado> findById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PostMapping
    public ResponseEntity<Diplomado> create(@RequestBody Diplomado entity) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.save(entity));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Diplomado> update(@PathVariable Long id, @RequestBody Diplomado entity) {
        return ResponseEntity.ok(service.update(id, entity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
