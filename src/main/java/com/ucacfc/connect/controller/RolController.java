package com.ucacfc.connect.controller;

import com.ucacfc.connect.model.Cliente;
import com.ucacfc.connect.model.Rol;
import com.ucacfc.connect.service.RolService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/roles")
@Tag(name = "Roles", description = "Endpoints para registro, consulta, actualización y eliminación de roles.")
public class RolController {

    private final RolService service;

    public RolController(RolService service) {
        this.service = service;
    }

    // Endpoint que trae todos los roles
    @Operation(summary = "Listar roles", description = "Obtiene la lista completa de todos los roles disponibles.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Lista de roles obtenida exitosamente", 
                content = @Content(mediaType = "application/json", 
                array = @ArraySchema(schema = @Schema(implementation = Rol.class))))
    })
    @GetMapping
    public List<Rol> findAll(){
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Rol> findById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PostMapping
    public ResponseEntity<Rol> create(@Valid @RequestBody Rol entity) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.save(entity));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Rol> update(@PathVariable Long id, @Valid @RequestBody Rol entity) {
        return ResponseEntity.ok(service.update(id, entity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}