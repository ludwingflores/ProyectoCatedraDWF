package com.ucacfc.connect.controller;

import com.ucacfc.connect.model.Agenda;
import com.ucacfc.connect.model.Cliente;
import com.ucacfc.connect.model.Usuario;
import com.ucacfc.connect.service.UsuarioService;

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
@RequestMapping("/api/usuarios")
@Tag(name = "Usuarios", description = "Endpoints para registro, consulta, actualización y eliminación de usuarios.")
public class UsuarioController {

    private final UsuarioService service;

    public UsuarioController(UsuarioService service) {
        this.service = service;
    }

    // Endpoint que trae todos los usuarios
    @Operation(summary = "Listar usuarios", description = "Obtiene la lista completa de todos los usuarios registrados en el sistema.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Lista de usuarios obtenida exitosamente", 
                content = @Content(mediaType = "application/json", 
                array = @ArraySchema(schema = @Schema(implementation = Usuario.class))))
    })
    @GetMapping
    public List<Usuario> findAll(){
        return service.findAll();
    }

    // Endpoint para traer un usuario por su ID
    @Operation(summary = "Obtener usuario por ID", description = "Retorna el detalle de un usuario específico según su identificador único.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Usuario encontrado",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = Usuario.class))),
        @ApiResponse(responseCode = "404", description = "Usuario no encontrado con el ID proporcionado", 
                content = @Content(mediaType = "application/json"))
    })
    @GetMapping("/{id}")
    public ResponseEntity<Usuario> findById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    // Endpoint para registrar un nuevo usuario
    @Operation(summary = "Registrar nuevo usuario", description = "Crea un nuevo registro de usuario validando sus campos obligatorios.")
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Usuario creado exitosamente",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = Usuario.class))),
        @ApiResponse(responseCode = "400", description = "Datos de entrada inválidos o reglas de negocio infringidas",
                content = @Content(mediaType = "application/json"))
    })
    @PostMapping
    public ResponseEntity<Usuario> create(@Valid @RequestBody Usuario entity) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.save(entity));
    }

    // Endpoint para actualizar un usuario existente
    @Operation(summary = "Actualizar usuario", description = "Actualiza los datos de un usuario existente identificado por su ID.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Usuario actualizado correctamente",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = Usuario.class))),
        @ApiResponse(responseCode = "400", description = "Datos enviados en el cuerpo no válidos",
                content = @Content(mediaType = "application/json")),
        @ApiResponse(responseCode = "404", description = "No existe un registro con el ID especificado",
                content = @Content(mediaType = "application/json"))
    })
    @PutMapping("/{id}")
    public ResponseEntity<Usuario> update(@PathVariable Long id, @Valid @RequestBody Usuario entity) {
        return ResponseEntity.ok(service.update(id, entity));
    }

    // Endpoint para eliminar un usuario
    @Operation(summary = "Eliminar usuario", description = "Elimina el registro de un usuario del sistema mediante su ID.")
    @ApiResponses({
        @ApiResponse(responseCode = "204", description = "Usuario eliminado exitosamente"),
        @ApiResponse(responseCode = "404", description = "Usuario no encontrado para eliminar",
                content = @Content(mediaType = "application/json"))
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}