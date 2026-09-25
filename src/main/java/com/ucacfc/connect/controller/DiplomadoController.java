package com.ucacfc.connect.controller;

import com.ucacfc.connect.model.Agenda;
import com.ucacfc.connect.model.Cliente;
import com.ucacfc.connect.model.Diplomado;
import com.ucacfc.connect.service.DiplomadoService;

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
@RequestMapping("/api/diplomados")
@Tag(name = "Diplomados", description = "Endpoints para registro, consulta, actualización y eliminación de diplomados.")
public class DiplomadoController {

    private final DiplomadoService service;

    public DiplomadoController(DiplomadoService service) {
        this.service = service;
    }

    // Endpoint que trae todos los diplomados
    @Operation(summary = "Listar diplomados", description = "Obtiene la lista completa de todos los diplomados registrados en el sistema.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Lista de diplomados obtenida exitosamente", 
                content = @Content(mediaType = "application/json", 
                array = @ArraySchema(schema = @Schema(implementation = Diplomado.class))))
    })
    @GetMapping
    public List<Diplomado> findAll(){
        return service.findAll();
    }

    // Endpoint para traer un diplomado por su ID
    @Operation(summary = "Obtener diplomado por ID", description = "Retorna el detalle de un diplomado específico según su identificador único.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Diplomado encontrado",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = Diplomado.class))),
        @ApiResponse(responseCode = "404", description = "Diplomado no encontrado con el ID proporcionado", 
                content = @Content(mediaType = "application/json"))
    })
    @GetMapping("/{id}")
    public ResponseEntity<Diplomado> findById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    // Endpoint para registrar un nuevo diplomado
    @Operation(summary = "Registrar nuevo diplomado", description = "Crea un nuevo registro de diplomado validando sus campos obligatorios.")
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Diplomado creado exitosamente",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = Diplomado.class))),
        @ApiResponse(responseCode = "400", description = "Datos de entrada inválidos o reglas de negocio infringidas",
                content = @Content(mediaType = "application/json"))
    })
    @PostMapping
    public ResponseEntity<Diplomado> create(@Valid @RequestBody Diplomado entity) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.save(entity));
    }

    // Endpoint para actualizar un diplomado existente
    @Operation(summary = "Actualizar diplomado", description = "Actualiza los datos de un diplomado existente identificado por su ID.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Diplomado actualizado correctamente",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = Diplomado.class))),
        @ApiResponse(responseCode = "400", description = "Datos enviados en el cuerpo no válidos",
                content = @Content(mediaType = "application/json")),
        @ApiResponse(responseCode = "404", description = "No existe un registro con el ID especificado",
                content = @Content(mediaType = "application/json"))
    })
    @PutMapping("/{id}")
    public ResponseEntity<Diplomado> update(@PathVariable Long id, @Valid @RequestBody Diplomado entity) {
        return ResponseEntity.ok(service.update(id, entity));
    }

    // Endpoint para eliminar un diplomado
    @Operation(summary = "Eliminar diplomado", description = "Elimina el registro de un diplomado del sistema mediante su ID.")
    @ApiResponses({
        @ApiResponse(responseCode = "204", description = "Diplomado eliminado exitosamente"),
        @ApiResponse(responseCode = "404", description = "Diplomado no encontrado para eliminar",
                content = @Content(mediaType = "application/json"))
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}