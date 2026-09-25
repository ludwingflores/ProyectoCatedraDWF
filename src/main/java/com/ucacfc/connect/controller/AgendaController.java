package com.ucacfc.connect.controller;

import com.ucacfc.connect.model.Agenda;
import com.ucacfc.connect.model.Cliente;
import com.ucacfc.connect.service.AgendaService;

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
@RequestMapping("/api/agenda")
@Tag(name = "Agenda", description = "Endpoints para registro, consulta, actualización y eliminación de agendas.")
public class AgendaController {

    private final AgendaService service;

    public AgendaController(AgendaService service) {
        this.service = service;
    }

    // Endpoint que trae todos las agendas
    @Operation(summary = "Listar agendas", description = "Obtiene la lista completa de todas las agendas registradas en el sistema.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Lista de agendas obtenida exitosamente", 
                content = @Content(mediaType = "application/json", 
                array = @ArraySchema(schema = @Schema(implementation = Agenda.class))))
    })
    @GetMapping
    public List<Agenda> findAll(){
        return service.findAll();
    }

    // Endpoint para traer una agenda por su ID
    @Operation(summary = "Obtener agenda por ID", description = "Retorna el detalle de una agenda específica según su identificador único.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Agenda encontrada",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = Agenda.class))),
        @ApiResponse(responseCode = "404", description = "Agenda no encontrada con el ID proporcionado", 
                content = @Content(mediaType = "application/json"))
    })
    @GetMapping("/{id}")
    public ResponseEntity<Agenda> findById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    // Endpoint para registrar una nueva agenda
    @Operation(summary = "Registrar nueva agenda", description = "Crea un nuevo registro de agenda validando sus campos obligatorios.")
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Agenda creada exitosamente",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = Agenda.class))),
        @ApiResponse(responseCode = "400", description = "Datos de entrada inválidos o reglas de negocio infringidas",
                content = @Content(mediaType = "application/json"))
    })
    @PostMapping
    public ResponseEntity<Agenda> create(@Valid @RequestBody Agenda entity) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.save(entity));
    }

    // Endpoint para actualizar un agenda existente
    @Operation(summary = "Actualizar agenda", description = "Actualiza los datos de una agenda existente identificado por su ID.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Agenda actualizada correctamente",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = Agenda.class))),
        @ApiResponse(responseCode = "400", description = "Datos enviados en el cuerpo no válidos",
                content = @Content(mediaType = "application/json")),
        @ApiResponse(responseCode = "404", description = "No existe un registro con el ID especificado",
                content = @Content(mediaType = "application/json"))
    })
    @PutMapping("/{id}")
    public ResponseEntity<Agenda> update(@PathVariable Long id, @Valid @RequestBody Agenda entity) {
        return ResponseEntity.ok(service.update(id, entity));
    }

    // Endpoint para eliminar una agenda
    @Operation(summary = "Eliminar agenda", description = "Elimina el registro de una agenda del sistema mediante su ID.")
    @ApiResponses({
        @ApiResponse(responseCode = "204", description = "Agenda eliminada exitosamente"),
        @ApiResponse(responseCode = "404", description = "Agenda no encontrada para eliminar",
                content = @Content(mediaType = "application/json"))
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}