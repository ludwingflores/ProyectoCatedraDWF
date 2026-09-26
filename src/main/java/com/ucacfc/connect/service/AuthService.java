package com.ucacfc.connect.service;

import com.ucacfc.connect.dto.AuthResponse;
import com.ucacfc.connect.dto.ForgotPasswordRequest;
import com.ucacfc.connect.dto.LoginRequest;
import com.ucacfc.connect.dto.ResetPasswordRequest;
import com.ucacfc.connect.model.Usuario;
import com.ucacfc.connect.repository.UsuarioRepository;
import com.ucacfc.connect.security.JwtService;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UsuarioRepository usuarioRepository;
    private final UserDetailsService userDetailsService;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public AuthService(
            AuthenticationManager authenticationManager,
            UsuarioRepository usuarioRepository,
            UserDetailsService userDetailsService,
            JwtService jwtService,
            PasswordEncoder passwordEncoder) {

        this.authenticationManager = authenticationManager;
        this.usuarioRepository = usuarioRepository;
        this.userDetailsService = userDetailsService;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
    }

    public AuthResponse login(LoginRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getCorreo(),
                        request.getPassword()
                )
        );

        Usuario usuario = usuarioRepository
                .findByCorreo(request.getCorreo())
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Correo o contraseña incorrectos"
                        )
                );

        UserDetails userDetails =
                userDetailsService.loadUserByUsername(usuario.getCorreo());

        String token = jwtService.generateToken(userDetails);

        return new AuthResponse(
                token,
                usuario.getId(),
                usuario.getNombre(),
                usuario.getCorreo(),
                usuario.getRol().getNombre()
        );
    }

    public String requestPasswordReset(ForgotPasswordRequest request) {

        Usuario usuario = usuarioRepository
                .findByCorreo(request.getCorreo())
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "No existe un usuario con ese correo"
                        )
                );

        String token = UUID.randomUUID().toString();

        usuario.setTokenRecuperacion(token);
        usuario.setTokenRecuperacionExpira(
                LocalDateTime.now().plusMinutes(30)
        );

        usuarioRepository.save(usuario);

        return token;
    }

    public void resetPassword(ResetPasswordRequest request) {

        Usuario usuario = usuarioRepository
                .findAll()
                .stream()
                .filter(u -> request.getToken().equals(u.getTokenRecuperacion()))
                .findFirst()
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Token de recuperación inválido"
                        )
                );

        if (usuario.getTokenRecuperacionExpira() == null
                || usuario.getTokenRecuperacionExpira().isBefore(LocalDateTime.now())) {

            throw new IllegalArgumentException(
                    "El token de recuperación ha expirado"
            );
        }

        usuario.setPassword(
                passwordEncoder.encode(request.getPassword())
        );

        usuario.setTokenRecuperacion(null);
        usuario.setTokenRecuperacionExpira(null);

        usuarioRepository.save(usuario);
    }
}