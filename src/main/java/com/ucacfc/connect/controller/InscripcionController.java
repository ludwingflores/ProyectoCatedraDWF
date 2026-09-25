package com.ucacfc.connect.controller;

import com.ucacfc.connect.model.Agenda;
import com.ucacfc.connect.model.Cliente;
import com.ucacfc.connect.model.Inscripcion;
import com.ucacfc.connect.service.InscripcionService;

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
@RequestMapping("/api/inscripciones")
@Tag(name = "Inscripciones", description = "Endpoints para registro, consulta, actualización y eliminación de inscripciones.")
public class InscripcionController {

    private final InscripcionService service;

    public InscripcionController(InscripcionService service) {
        this.service = service;
    }

    // Endpoint que trae todas las inscripciones
    @Operation(summary = "Listar inscripciones", description = "Obtiene la lista completa de todas las inscripciones registradas en el sistema.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Lista de inscripciones obtenida exitosamente", 
                content = @Content(mediaType = "application/json", 
                array = @ArraySchema(schema = @Schema(implementation = Inscripcion.class))))
    })
    @GetMapping
    public List<Inscripcion> findAll(){
        return service.findAll();
    }

    // Endpoint para traer una inscripcion por su ID
    @Operation(summary = "Obtener inscripcion por ID", description = "Retorna el detalle de una inscripcion en específico según su identificador único.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Inscripcion encontrada",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = Inscripcion.class))),
        @ApiResponse(responseCode = "404", description = "Inscripcion no encontrada con el ID proporcionado", 
                content = @Content(mediaType = "application/json"))
    })
    @GetMapping("/{id}")
    public ResponseEntity<Inscripcion> findById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    // Endpoint para registrar una nueva inscripcion
    @Operation(summary = "Registrar nueva inscripcion", description = "Crea una nueva inscripcion validando sus campos obligatorios.")
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Inscripcion creada exitosamente",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = Inscripcion.class))),
        @ApiResponse(responseCode = "400", description = "Datos de entrada inválidos o reglas de negocio infringidas",
                content = @Content(mediaType = "application/json"))
    })
    @PostMapping
    public ResponseEntity<Inscripcion> create(@Valid @RequestBody Inscripcion entity) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.save(entity));
    }

    // Endpoint para actualizar una inscripcion existente
    @Operation(summary = "Actualizar inscripcion", description = "Actualiza los datos de una inscripcion existente identificado por su ID.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Inscripcion actualizada correctamente",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = Inscripcion.class))),
        @ApiResponse(responseCode = "400", description = "Datos enviados en el cuerpo no válidos",
                content = @Content(mediaType = "application/json")),
        @ApiResponse(responseCode = "404", description = "No existe un registro con el ID especificado",
                content = @Content(mediaType = "application/json"))
    })
    @PutMapping("/{id}")
    public ResponseEntity<Inscripcion> update(@PathVariable Long id, @Valid @RequestBody Inscripcion entity) {
        return ResponseEntity.ok(service.update(id, entity));
    }

    // Endpoint para eliminar una inscripcion
    @Operation(summary = "Eliminar inscripcion", description = "Elimina el registro de una inscripcion del sistema mediante su ID.")
    @ApiResponses({
        @ApiResponse(responseCode = "204", description = "Inscripcion eliminada exitosamente"),
        @ApiResponse(responseCode = "404", description = "Inscripcion no encontrada para eliminar",
                content = @Content(mediaType = "application/json"))
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}