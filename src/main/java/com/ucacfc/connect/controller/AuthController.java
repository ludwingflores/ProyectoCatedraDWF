package com.ucacfc.connect.controller;

import com.ucacfc.connect.dto.AuthResponse;
import com.ucacfc.connect.dto.ForgotPasswordRequest;
import com.ucacfc.connect.dto.LoginRequest;
import com.ucacfc.connect.dto.ResetPasswordRequest;
import com.ucacfc.connect.security.TokenBlacklistService;
import com.ucacfc.connect.service.AuthService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Tag(
        name = "Autenticación",
        description = "Inicio de sesión, cierre de sesión y recuperación de contraseña mediante JWT"
)
public class AuthController {

    private final AuthService authService;
    private final TokenBlacklistService tokenBlacklistService;

    public AuthController(
            AuthService authService,
            TokenBlacklistService tokenBlacklistService) {

        this.authService = authService;
        this.tokenBlacklistService = tokenBlacklistService;
    }

    @PostMapping("/login")
    @Operation(
            summary = "Iniciar sesión",
            description = "Autentica un usuario mediante correo y contraseña y devuelve un token JWT"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Inicio de sesión exitoso"),
            @ApiResponse(responseCode = "400", description = "Datos de entrada inválidos"),
            @ApiResponse(responseCode = "401", description = "Correo o contraseña incorrectos")
    })
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request) {

        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/logout")
    @Operation(
            summary = "Cerrar sesión",
            description = "Revoca el token JWT utilizado en la petición actual"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Sesión cerrada correctamente"),
            @ApiResponse(responseCode = "401", description = "Token no proporcionado o no autorizado")
    })
    public ResponseEntity<String> logout(HttpServletRequest request) {

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401)
                    .body("Token no proporcionado");
        }

        String token = authHeader.substring(7);

        tokenBlacklistService.revokeToken(token);

        return ResponseEntity.ok("Sesión cerrada correctamente");
    }

    @PostMapping("/forgot-password")
    @Operation(
            summary = "Solicitar recuperación de contraseña",
            description = "Genera un token temporal para recuperar la contraseña de un usuario"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Token de recuperación generado"),
            @ApiResponse(responseCode = "400", description = "Correo inválido o usuario no encontrado")
    })
    public ResponseEntity<String> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request) {

        String token = authService.requestPasswordReset(request);

        return ResponseEntity.ok(token);
    }

    @PostMapping("/reset-password")
    @Operation(
            summary = "Restablecer contraseña",
            description = "Cambia la contraseña utilizando un token de recuperación válido"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Contraseña actualizada correctamente"),
            @ApiResponse(responseCode = "400", description = "Token inválido, expirado o datos incorrectos")
    })
    public ResponseEntity<String> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request) {

        authService.resetPassword(request);

        return ResponseEntity.ok("Contraseña actualizada correctamente");
    }
}