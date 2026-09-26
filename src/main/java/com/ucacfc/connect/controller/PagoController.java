package com.ucacfc.connect.controller;

import com.ucacfc.connect.model.EstadoPago;
import com.ucacfc.connect.model.MetodoPago;
import com.ucacfc.connect.model.Pago;
import com.ucacfc.connect.model.TipoPago;
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
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pagos")
@Tag(
    name = "Pagos",
    description = "Control financiero de pagos del sistema."
)
public class PagoController {

    private final PagoService service;

    public PagoController(PagoService service) {
        this.service = service;
    }

    // =========================================================
    // LISTAR TODOS
    // =========================================================

    @Operation(
        summary = "Listar pagos",
        description = "Obtiene todos los pagos registrados."
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "200",
            description = "Lista obtenida exitosamente",
            content = @Content(
                mediaType = "application/json",
                array = @ArraySchema(
                    schema = @Schema(implementation = Pago.class)
                )
            )
        )
    })
    @GetMapping("/todos")
    public List<Pago> findAll() {
        return service.findAll();
    }

    // =========================================================
    // PAGINACIÓN Y FILTROS
    // =========================================================

    @Operation(
        summary = "Consultar pagos con filtros",
        description = """
            Consulta paginada de pagos.
            Permite filtrar por tipo, método, estado y cliente.
            También permite ordenar mediante los parámetros de Pageable.
            """
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "200",
            description = "Consulta realizada exitosamente"
        )
    })
    @GetMapping
    public Page<Pago> findPage(
            @RequestParam(required = false) TipoPago tipo,
            @RequestParam(required = false) MetodoPago metodo,
            @RequestParam(required = false) EstadoPago estado,
            @RequestParam(required = false) Long clienteId,
            @PageableDefault(size = 10, sort = "fecha")
            Pageable pageable) {

        if (tipo != null && estado != null) {
            return service.findByTipoAndEstado(
                    tipo,
                    estado,
                    pageable
            );
        }

        if (tipo != null) {
            return service.findByTipo(
                    tipo,
                    pageable
            );
        }

        if (metodo != null) {
            return service.findByMetodo(
                    metodo,
                    pageable
            );
        }

        if (estado != null) {
            return service.findByEstado(
                    estado,
                    pageable
            );
        }

        if (clienteId != null) {
            return service.findByClienteId(
                    clienteId,
                    pageable
            );
        }

        return service.findAllPage(pageable);
    }

    // =========================================================
    // BUSCAR POR ID
    // =========================================================

    @Operation(
        summary = "Obtener pago por ID",
        description = "Retorna un pago específico mediante su identificador."
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "200",
            description = "Pago encontrado",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = Pago.class)
            )
        ),
        @ApiResponse(
            responseCode = "404",
            description = "Pago no encontrado"
        )
    })
    @GetMapping("/{id}")
    public ResponseEntity<Pago> findById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                service.findById(id)
        );
    }

    // =========================================================
    // CREAR
    // =========================================================

    @Operation(
        summary = "Registrar nuevo pago",
        description = "Registra un nuevo pago validando sus datos."
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "201",
            description = "Pago registrado exitosamente",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = Pago.class)
            )
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Datos inválidos"
        )
    })
    @PostMapping
    public ResponseEntity<Pago> create(
            @Valid @RequestBody Pago entity) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(service.save(entity));
    }

    // =========================================================
    // ACTUALIZAR
    // =========================================================

    @Operation(
        summary = "Actualizar pago",
        description = "Actualiza los datos de un pago existente."
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "200",
            description = "Pago actualizado correctamente",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = Pago.class)
            )
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Datos inválidos"
        ),
        @ApiResponse(
            responseCode = "404",
            description = "Pago no encontrado"
        )
    })
    @PutMapping("/{id}")
    public ResponseEntity<Pago> update(
            @PathVariable Long id,
            @Valid @RequestBody Pago entity) {

        return ResponseEntity.ok(
                service.update(id, entity)
        );
    }

    // =========================================================
    // ELIMINAR
    // =========================================================

    @Operation(
        summary = "Eliminar pago",
        description = "Elimina un pago mediante su identificador."
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "204",
            description = "Pago eliminado exitosamente"
        ),
        @ApiResponse(
            responseCode = "404",
            description = "Pago no encontrado"
        )
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id) {

        service.delete(id);

        return ResponseEntity
                .noContent()
                .build();
    }
}