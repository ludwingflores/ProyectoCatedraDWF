package com.ucacfc.connect.controller;

import com.ucacfc.connect.model.Cliente;
import com.ucacfc.connect.service.ClienteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clientes")
@Tag(name = "Módulo 2: Gestión de Clientes", description = "Endpoints para registro, consulta, actualización y eliminación de clientes (empresas y personas).")
public class ClienteController {

    private final ClienteService service;

    public ClienteController(ClienteService service) {
        this.service = service;
    }

    @Operation(summary = "Listar clientes", description = "Obtiene la lista completa de todos los clientes registrados en el sistema.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lista de clientes obtenida exitosamente",
                    content = @Content(mediaType = "application/json",
                            array = @ArraySchema(schema = @Schema(implementation = Cliente.class))))
    })
    @GetMapping
    public ResponseEntity<List<Cliente>> findAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @Operation(summary = "Obtener cliente por ID", description = "Retorna el detalle de un cliente específico según su identificador único.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Cliente encontrado",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = Cliente.class))),
            @ApiResponse(responseCode = "404", description = "Cliente no encontrado con el ID proporcionado",
                    content = @Content(mediaType = "application/json"))
    })
    @GetMapping("/{id}")
    public ResponseEntity<Cliente> findById(
            @Parameter(description = "Identificador único del cliente", example = "1", required = true)
            @PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @Operation(summary = "Registrar nuevo cliente", description = "Crea un nuevo registro de cliente (persona o empresa) validando sus campos obligatorios.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Cliente creado exitosamente",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = Cliente.class))),
            @ApiResponse(responseCode = "400", description = "Datos de entrada inválidos o reglas de negocio infringidas",
                    content = @Content(mediaType = "application/json"))
    })
    @PostMapping
    public ResponseEntity<Cliente> create(@Valid @RequestBody Cliente entity) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.save(entity));
    }

    @Operation(summary = "Actualizar cliente", description = "Actualiza los datos de un cliente existente identificado por su ID.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Cliente actualizado correctamente",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = Cliente.class))),
            @ApiResponse(responseCode = "400", description = "Datos enviados en el cuerpo no válidos",
                    content = @Content(mediaType = "application/json")),
            @ApiResponse(responseCode = "404", description = "No existe un cliente con el ID especificado",
                    content = @Content(mediaType = "application/json"))
    })
    @PutMapping("/{id}")
    public ResponseEntity<Cliente> update(
            @Parameter(description = "ID del cliente a modificar", example = "1", required = true)
            @PathVariable Long id,
            @Valid @RequestBody Cliente entity) {
        return ResponseEntity.ok(service.update(id, entity));
    }

    @Operation(summary = "Eliminar cliente", description = "Elimina físicamente el registro de un cliente del sistema mediante su ID.")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Cliente eliminado exitosamente"),
            @ApiResponse(responseCode = "404", description = "Cliente no encontrado para eliminar",
                    content = @Content(mediaType = "application/json"))
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @Parameter(description = "ID del cliente a eliminar", example = "1", required = true)
            @PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}