package com.ucacfc.connect.controller;

import com.ucacfc.connect.model.Agenda;
import com.ucacfc.connect.model.Cliente;
import com.ucacfc.connect.model.Espacio;
import com.ucacfc.connect.service.EspacioService;

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
@RequestMapping("/api/espacios")
@Tag(name = "Espacios", description = "Endpoints para registro, consulta, actualización y eliminación de espacios.")
public class EspacioController {

    private final EspacioService service;

    public EspacioController(EspacioService service) {
        this.service = service;
    }

    // Endpoint que trae todos los clientes
    @Operation(summary = "Listar espacios", description = "Obtiene la lista completa de todos los espacios registrados en el sistema.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Lista de espacios obtenida exitosamente", 
                content = @Content(mediaType = "application/json", 
                array = @ArraySchema(schema = @Schema(implementation = Espacio.class))))
    })
    @GetMapping
    public List<Espacio> findAll(){
        return service.findAll();
    }

    // Endpoint para traer un espacio por su ID
    @Operation(summary = "Obtener espacio por ID", description = "Retorna el detalle de un espacio específico según su identificador único.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Espacio encontrado",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = Espacio.class))),
        @ApiResponse(responseCode = "404", description = "Espacio no encontrado con el ID proporcionado", 
                content = @Content(mediaType = "application/json"))
    })
    @GetMapping("/{id}")
    public ResponseEntity<Espacio> findById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    // Endpoint para registrar un nuevo espacio
    @Operation(summary = "Registrar nuevo espacio", description = "Crea un nuevo registro de espacio validando sus campos obligatorios.")
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Espacio creado exitosamente",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = Espacio.class))),
        @ApiResponse(responseCode = "400", description = "Datos de entrada inválidos o reglas de negocio infringidas",
                content = @Content(mediaType = "application/json"))
    })
    @PostMapping
    public ResponseEntity<Espacio> create(@Valid @RequestBody Espacio entity) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.save(entity));
    }

    // Endpoint para actualizar un espacio existente
    @Operation(summary = "Actualizar espacio", description = "Actualiza los datos de un espacio existente identificado por su ID.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Espacio actualizado correctamente",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = Espacio.class))),
        @ApiResponse(responseCode = "400", description = "Datos enviados en el cuerpo no válidos",
                content = @Content(mediaType = "application/json")),
        @ApiResponse(responseCode = "404", description = "No existe un registro con el ID especificado",
                content = @Content(mediaType = "application/json"))
    })
    @PutMapping("/{id}")
    public ResponseEntity<Espacio> update(@PathVariable Long id, @Valid @RequestBody Espacio entity) {
        return ResponseEntity.ok(service.update(id, entity));
    }

    // Endpoint para eliminar un espacio
    @Operation(summary = "Eliminar espacio", description = "Elimina el registro de un espacio del sistema mediante su ID.")
    @ApiResponses({
        @ApiResponse(responseCode = "204", description = "Espacio eliminado exitosamente"),
        @ApiResponse(responseCode = "404", description = "Espacio no encontrado para eliminar",
                content = @Content(mediaType = "application/json"))
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}