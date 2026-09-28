package com.ucacfc.connect.controller;

import com.ucacfc.connect.model.Alquiler;
import com.ucacfc.connect.model.EstadoAlquiler;
import com.ucacfc.connect.service.AlquilerService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.validation.Valid;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/alquileres")
@Tag(
        name = "Alquileres",
        description = "Registro de alquileres y consulta de disponibilidad de espacios."
)
public class AlquilerController {

    private final AlquilerService service;

    public AlquilerController(AlquilerService service) {
        this.service = service;
    }

    // =========================================================
    // LISTAR
    // =========================================================

    @GetMapping
    @Operation(summary = "Listar alquileres")
    public List<Alquiler> findAll(
            Authentication authentication) {

        if (esCliente(authentication)) {
            return service.findAllByClienteCorreo(
                    authentication.getName()
            );
        }

        return service.findAll();
    }

    // =========================================================
    // FILTROS + PAGINACIÓN + ORDENAMIENTO
    // =========================================================

    @GetMapping("/buscar")
    @Operation(
            summary = "Buscar alquileres",
            description = """
                    Permite consultar alquileres aplicando filtros por
                    cliente, espacio, estado o fecha, además de
                    paginación y ordenamiento.

                    Los usuarios con rol CLIENTE únicamente pueden
                    consultar sus propios alquileres.
                    """
    )
    public ResponseEntity<Page<Alquiler>> search(
            @RequestParam(required = false)
            Long clienteId,

            @RequestParam(required = false)
            Long espacioId,

            @RequestParam(required = false)
            EstadoAlquiler estado,

            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate fecha,

            @RequestParam(defaultValue = "0")
            int page,

            @RequestParam(defaultValue = "10")
            int size,

            @RequestParam(defaultValue = "fecha")
            String sortBy,

            @RequestParam(defaultValue = "desc")
            String direction,

            Authentication authentication) {

        if (esCliente(authentication)) {

            Page<Alquiler> resultado =
                    service.searchByClienteCorreo(
                            authentication.getName(),
                            espacioId,
                            estado,
                            fecha,
                            page,
                            size,
                            sortBy,
                            direction
                    );

            return ResponseEntity.ok(resultado);
        }

        Page<Alquiler> resultado =
                service.search(
                        clienteId,
                        espacioId,
                        estado,
                        fecha,
                        page,
                        size,
                        sortBy,
                        direction
                );

        return ResponseEntity.ok(resultado);
    }

    // =========================================================
    // OBTENER POR ID
    // =========================================================

    @GetMapping("/{id}")
    @Operation(summary = "Obtener alquiler por ID")
    public ResponseEntity<Alquiler> findById(
            @PathVariable Long id,
            Authentication authentication) {

        if (esCliente(authentication)) {
            return ResponseEntity.ok(
                    service.findByIdAndClienteCorreo(
                            id,
                            authentication.getName()
                    )
            );
        }

        return ResponseEntity.ok(
                service.findById(id)
        );
    }

    // =========================================================
    // CREAR
    // =========================================================

    @PostMapping
    @Operation(summary = "Registrar un alquiler")
    public ResponseEntity<Alquiler> create(
            @Valid @RequestBody Alquiler entity,
            Authentication authentication) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        service.save(
                                entity,
                                authentication
                        )
                );
    }

    // =========================================================
    // ACTUALIZAR
    // =========================================================

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar un alquiler")
    public ResponseEntity<Alquiler> update(
            @PathVariable Long id,
            @Valid @RequestBody Alquiler entity) {

        return ResponseEntity.ok(
                service.update(id, entity)
        );
    }

    // =========================================================
    // ELIMINAR
    // =========================================================

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar un alquiler")
    public ResponseEntity<Void> delete(
            @PathVariable Long id) {

        service.delete(id);

        return ResponseEntity
                .noContent()
                .build();
    }

    // =========================================================
    // DISPONIBILIDAD - RF09
    // =========================================================

    @GetMapping("/disponibilidad")
    @Operation(
            summary = "Consultar disponibilidad de un espacio",
            description = "Comprueba si un espacio está disponible en una fecha y horario determinados."
    )
    public ResponseEntity<Map<String, Boolean>> disponibilidad(
            @RequestParam Long espacioId,
            @RequestParam LocalDate fecha,
            @RequestParam LocalTime horaInicio,
            @RequestParam LocalTime horaFin) {

        boolean disponible =
                service.estaDisponible(
                        espacioId,
                        fecha,
                        horaInicio,
                        horaFin
                );

        return ResponseEntity.ok(
                Map.of(
                        "disponible",
                        disponible
                )
        );
    }

    // =========================================================
    // UTILIDAD DE SEGURIDAD
    // =========================================================

    private boolean esCliente(
            Authentication authentication) {

        return authentication != null
                && authentication
                .getAuthorities()
                .stream()
                .anyMatch(authority ->
                        authority
                                .getAuthority()
                                .equals("ROLE_CLIENTE")
                );
    }
}