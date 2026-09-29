package com.ucacfc.connect.controller;

import com.ucacfc.connect.model.Docente;
import com.ucacfc.connect.service.DocenteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/docentes")
@Tag(
        name = "Docentes",
        description = "Gestión del catálogo de docentes"
)
public class DocenteController {

    private final DocenteService docenteService;

    public DocenteController(DocenteService docenteService) {
        this.docenteService = docenteService;
    }

    @GetMapping
    @Operation(summary = "Listar docentes")
    public ResponseEntity<List<Docente>> listar(
            Authentication authentication
    ) {
        if (esAdmin(authentication)) {
            return ResponseEntity.ok(docenteService.findAll());
        }

        return ResponseEntity.ok(docenteService.findAllActivos());
    }

    @GetMapping("/buscar")
    @Operation(
            summary = "Buscar docentes con paginación y ordenamiento"
    )
    public ResponseEntity<Page<Docente>> buscar(
            @RequestParam(required = false) String nombre,
            @RequestParam(required = false) Boolean activo,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "nombre") String sortBy,
            @RequestParam(defaultValue = "asc") String direction,
            Authentication authentication
    ) {
        if (esAdmin(authentication)) {
            return ResponseEntity.ok(
                    docenteService.search(
                            nombre,
                            activo,
                            page,
                            size,
                            sortBy,
                            direction
                    )
            );
        }

        return ResponseEntity.ok(
                docenteService.searchActivos(
                        nombre,
                        page,
                        size,
                        sortBy,
                        direction
                )
        );
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener docente por ID")
    public ResponseEntity<Docente> obtenerPorId(
            @PathVariable Long id,
            Authentication authentication
    ) {
        if (esAdmin(authentication)) {
            return ResponseEntity.ok(docenteService.findById(id));
        }

        return ResponseEntity.ok(
                docenteService.findActivoById(id)
        );
    }

    @PostMapping
    @Operation(summary = "Crear docente")
    public ResponseEntity<Docente> crear(
            @Valid @RequestBody Docente docente
    ) {
        return ResponseEntity.ok(docenteService.save(docente));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar docente")
    public ResponseEntity<Docente> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody Docente docente
    ) {
        return ResponseEntity.ok(
                docenteService.update(id, docente)
        );
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Inactivar docente")
    public ResponseEntity<Void> eliminar(
            @PathVariable Long id
    ) {
        docenteService.delete(id);
        return ResponseEntity.noContent().build();
    }

    private boolean esAdmin(Authentication authentication) {
        if (authentication == null) {
            return false;
        }

        return authentication.getAuthorities()
                .stream()
                .anyMatch(authority ->
                        authority.getAuthority().equals("ROLE_ADMIN")
                );
    }
}