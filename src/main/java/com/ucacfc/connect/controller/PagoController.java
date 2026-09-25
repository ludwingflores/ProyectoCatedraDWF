package com.ucacfc.connect.controller;

import com.ucacfc.connect.model.Agenda;
import com.ucacfc.connect.model.Cliente;
import com.ucacfc.connect.model.Pago;
import com.ucacfc.connect.service.PagoService;

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
@RequestMapping("/api/pagos")
@Tag(name = "Pagos", description = "Endpoints para registro, consulta, actualización y eliminación de pagos.")
public class PagoController {

    private final PagoService service;

    public PagoController(PagoService service) {
        this.service = service;
    }

    // Endpoint que trae todos los pagos
    @Operation(summary = "Listar pagos", description = "Obtiene la lista completa de todos los pagos registrados en el sistema.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Lista de pagos obtenida exitosamente", 
                content = @Content(mediaType = "application/json", 
                array = @ArraySchema(schema = @Schema(implementation = Pago.class))))
    })
    @GetMapping
    public List<Pago> findAll(){
        return service.findAll();
    }

    // Endpoint para traer un pago por su ID
    @Operation(summary = "Obtener un pago realizado por su ID", description = "Retorna el detalle de un pago específico según su identificador único.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Pago encontrado",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = Pago.class))),
        @ApiResponse(responseCode = "404", description = "Pago no encontrado con el ID proporcionado", 
                content = @Content(mediaType = "application/json"))
    })
    @GetMapping("/{id}")
    public ResponseEntity<Pago> findById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    // Endpoint para registrar un nuevo pago
    @Operation(summary = "Registrar nuevo pago", description = "Crea un nuevo registro de pago validando sus campos obligatorios.")
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Pago realizado exitosamente",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = Pago.class))),
        @ApiResponse(responseCode = "400", description = "Datos de entrada inválidos o reglas de negocio infringidas",
                content = @Content(mediaType = "application/json"))
    })
    @PostMapping
    public ResponseEntity<Pago> create(@Valid @RequestBody Pago entity) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.save(entity));
    }

    // Endpoint para actualizar un pago existente
    @Operation(summary = "Actualizar pago", description = "Actualiza los datos de un pago existente identificado por su ID.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Pago actualizado correctamente",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = Pago.class))),
        @ApiResponse(responseCode = "400", description = "Datos enviados en el cuerpo no válidos",
                content = @Content(mediaType = "application/json")),
        @ApiResponse(responseCode = "404", description = "No existe un registro con el ID especificado",
                content = @Content(mediaType = "application/json"))
    })
    @PutMapping("/{id}")
    public ResponseEntity<Pago> update(@PathVariable Long id, @Valid @RequestBody Pago entity) {
        return ResponseEntity.ok(service.update(id, entity));
    }

    // Endpoint para eliminar un pago
    @Operation(summary = "Eliminar pago", description = "Elimina el registro de un pago del sistema mediante su ID.")
    @ApiResponses({
        @ApiResponse(responseCode = "204", description = "Pago eliminado exitosamente"),
        @ApiResponse(responseCode = "404", description = "Pago no encontrado para eliminar",
                content = @Content(mediaType = "application/json"))
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}