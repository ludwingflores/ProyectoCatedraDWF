package com.ucacfc.connect.service;

import com.ucacfc.connect.dto.AuthResponse;
import com.ucacfc.connect.dto.LoginRequest;
import com.ucacfc.connect.model.Usuario;
import com.ucacfc.connect.repository.UsuarioRepository;
import com.ucacfc.connect.security.JwtService;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UsuarioRepository usuarioRepository;
    private final UserDetailsService userDetailsService;
    private final JwtService jwtService;

    public AuthService(
            AuthenticationManager authenticationManager,
            UsuarioRepository usuarioRepository,
            UserDetailsService userDetailsService,
            JwtService jwtService) {

        this.authenticationManager = authenticationManager;
        this.usuarioRepository = usuarioRepository;
        this.userDetailsService = userDetailsService;
        this.jwtService = jwtService;
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
}