package com.ucacfc.connect.controller;

import com.ucacfc.connect.model.Agenda;
import com.ucacfc.connect.model.Catering;
import com.ucacfc.connect.model.Cliente;
import com.ucacfc.connect.service.CateringService;

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
@RequestMapping("/api/catering")
@Tag(name = "Catering", description = "Endpoints para registro, consulta, actualización y eliminación de catering.")
public class CateringController {

    private final CateringService service;

    public CateringController(CateringService service) {
        this.service = service;
    }

    // Endpoint que trae todos los catering
    @Operation(summary = "Listar catering", description = "Obtiene la lista completa de todos los catering registrados en el sistema.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Lista de catering obtenida exitosamente", 
                content = @Content(mediaType = "application/json", 
                array = @ArraySchema(schema = @Schema(implementation = Catering.class))))
    })
    @GetMapping
    public List<Catering> findAll(){
        return service.findAll();
    }

    // Endpoint para traer un cliente por su ID
    @Operation(summary = "Obtener catering por ID", description = "Retorna el detalle de un catering específico según su identificador único.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Catering encontrado",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = Catering.class))),
        @ApiResponse(responseCode = "404", description = "Catering no encontrado con el ID proporcionado", 
                content = @Content(mediaType = "application/json"))
    })
    @GetMapping("/{id}")
    public ResponseEntity<Catering> findById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    // Endpoint para registrar un nuevo catering
    @Operation(summary = "Registrar nuevo catering", description = "Crea un nuevo registro de catering validando sus campos obligatorios.")
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Catering creado exitosamente",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = Catering.class))),
        @ApiResponse(responseCode = "400", description = "Datos de entrada inválidos o reglas de negocio infringidas",
                content = @Content(mediaType = "application/json"))
    })
    @PostMapping
    public ResponseEntity<Catering> create(@Valid @RequestBody Catering entity) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.save(entity));
    }

    // Endpoint para actualizar un catering existente
    @Operation(summary = "Actualizar catering", description = "Actualiza los datos de un catering existente identificado por su ID.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Catering actualizado correctamente",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = Catering.class))),
        @ApiResponse(responseCode = "400", description = "Datos enviados en el cuerpo no válidos",
                content = @Content(mediaType = "application/json")),
        @ApiResponse(responseCode = "404", description = "No existe un registro con el ID especificado",
                content = @Content(mediaType = "application/json"))
    })
    @PutMapping("/{id}")
    public ResponseEntity<Catering> update(@PathVariable Long id, @Valid @RequestBody Catering entity) {
        return ResponseEntity.ok(service.update(id, entity));
    }

    // Endpoint para eliminar un catering
    @Operation(summary = "Eliminar catering", description = "Elimina el registro de un catering del sistema mediante su ID.")
    @ApiResponses({
        @ApiResponse(responseCode = "204", description = "Catering eliminado exitosamente"),
        @ApiResponse(responseCode = "404", description = "Catering no encontrado para eliminar",
                content = @Content(mediaType = "application/json"))
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}