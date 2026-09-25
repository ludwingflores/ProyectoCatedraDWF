package com.ucacfc.connect.controller;

import com.ucacfc.connect.model.Agenda;
import com.ucacfc.connect.model.Cliente;
import com.ucacfc.connect.model.Cotizacion;
import com.ucacfc.connect.service.CotizacionService;

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
@RequestMapping("/api/cotizaciones")
@Tag(name = "Cotizacion", description = "Endpoints para registro, consulta, actualización y eliminación de cotizaciones.")
public class CotizacionController {

    private final CotizacionService service;

    public CotizacionController(CotizacionService service) {
        this.service = service;
    }

    // Endpoint que trae todos los cotizaciones
    @Operation(summary = "Listar cotizaciones", description = "Obtiene la lista completa de todas las cotizaciones registradas en el sistema.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Lista de cotizaciones obtenida exitosamente", 
                content = @Content(mediaType = "application/json", 
                array = @ArraySchema(schema = @Schema(implementation = Cotizacion.class))))
    })
    @GetMapping
    public List<Cotizacion> findAll(){
        return service.findAll();
    }

    // Endpoint para traer una cotizacion por su ID
    @Operation(summary = "Obtener una cotizacion por ID", description = "Retorna el detalle de una cotizacion específica según su identificador único.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Cotizacion encontrada",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = Cotizacion.class))),
        @ApiResponse(responseCode = "404", description = "Cotizacion no encontrada con el ID proporcionado", 
                content = @Content(mediaType = "application/json"))
    })
    @GetMapping("/{id}")
    public ResponseEntity<Cotizacion> findById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    // Endpoint para registrar una nueva cotizacion
    @Operation(summary = "Registrar nueva cotizacion", description = "Crea un nuevo registro de cotizacion validando sus campos obligatorios.")
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Cotizacion creada exitosamente",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = Cotizacion.class))),
        @ApiResponse(responseCode = "400", description = "Datos de entrada inválidos o reglas de negocio infringidas",
                content = @Content(mediaType = "application/json"))
    })
    @PostMapping
    public ResponseEntity<Cotizacion> create(@Valid @RequestBody Cotizacion entity) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.save(entity));
    }

    // Endpoint para actualizar una cotizacion existente
    @Operation(summary = "Actualizar cotizacion", description = "Actualiza los datos de una cotizacion existente identificado por su ID.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Cotizacion actualizada correctamente",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = Cotizacion.class))),
        @ApiResponse(responseCode = "400", description = "Datos enviados en el cuerpo no válidos",
                content = @Content(mediaType = "application/json")),
        @ApiResponse(responseCode = "404", description = "No existe un registro con el ID especificado",
                content = @Content(mediaType = "application/json"))
    })
    @PutMapping("/{id}")
    public ResponseEntity<Cotizacion> update(@PathVariable Long id, @Valid @RequestBody Cotizacion entity) {
        return ResponseEntity.ok(service.update(id, entity));
    }

    // Endpoint para eliminar una cotizacion
    @Operation(summary = "Eliminar cotizacion", description = "Elimina el registro de una cotizacion del sistema mediante su ID.")
    @ApiResponses({
        @ApiResponse(responseCode = "204", description = "Cotizacion eliminada exitosamente"),
        @ApiResponse(responseCode = "404", description = "Cotizacion no encontrada para eliminar",
                content = @Content(mediaType = "application/json"))
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}