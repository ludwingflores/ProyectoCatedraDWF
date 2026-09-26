package com.ucacfc.connect.security;

import jakarta.servlet.http.HttpServletResponse;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final CustomUserDetailsService userDetailsService;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter,
            CustomUserDetailsService userDetailsService) {

        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {

        http
                .csrf(csrf -> csrf.disable())

                .authorizeHttpRequests(auth -> auth

                        // =====================================================
                        // ENDPOINTS PUBLICOS
                        // =====================================================

                        // Login
                        .requestMatchers("/api/auth/**").permitAll()

                        // Swagger / OpenAPI
                        .requestMatchers(
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/v3/api-docs/**"
                        ).permitAll()

                        // Health check
                        .requestMatchers("/actuator/health").permitAll()

                        // Manejo interno de errores
                        .requestMatchers("/error").permitAll()


                        // =====================================================
                        // ADMINISTRACION
                        // =====================================================

                        // Usuarios: solamente ADMIN
                        .requestMatchers("/api/usuarios/**")
                        .hasRole("ADMIN")

                        // Roles: solamente ADMIN
                        .requestMatchers("/api/roles/**")
                        .hasRole("ADMIN")


                        // =====================================================
                        // PAGOS
                        // =====================================================

                        // Pagos: ADMIN y CONTABILIDAD
                        .requestMatchers("/api/pagos/**")
                        .hasAnyRole("ADMIN", "CONTABILIDAD")


                        // =====================================================
                        // CONSULTAS OPERATIVAS
                        // =====================================================

                        // ADMIN, RECEPCIONISTA y CONTABILIDAD
                        // pueden consultar informacion operativa.
                        //
                        // CLIENTE no se agrega aqui porque posteriormente
                        // debemos limitarlo a sus propios registros.
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/clientes/**",
                                "/api/agenda/**",
                                "/api/cursos/**",
                                "/api/diplomados/**",
                                "/api/espacios/**",
                                "/api/inscripciones/**",
                                "/api/catering/**",
                                "/api/cotizaciones/**"
                        )
                                    .hasAnyRole(
                                  "ADMIN",
                                 "RECEPCIONISTA",
                                 "CONTABILIDAD",
                                 "CLIENTE"
)


                        // =====================================================
                        // CREACION DE INFORMACION OPERATIVA
                        // =====================================================

                        // ADMIN y RECEPCIONISTA
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/clientes/**",
                                "/api/agenda/**",
                                "/api/cursos/**",
                                "/api/diplomados/**",
                                "/api/espacios/**",
                                "/api/inscripciones/**",
                                "/api/catering/**",
                                "/api/cotizaciones/**"
                        )
                        .hasAnyRole(
                                "ADMIN",
                                "RECEPCIONISTA"
                        )


                        // =====================================================
                        // ACTUALIZACION DE INFORMACION OPERATIVA
                        // =====================================================

                        // ADMIN y RECEPCIONISTA
                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/clientes/**",
                                "/api/agenda/**",
                                "/api/cursos/**",
                                "/api/diplomados/**",
                                "/api/espacios/**",
                                "/api/inscripciones/**",
                                "/api/catering/**",
                                "/api/cotizaciones/**"
                        )
                        .hasAnyRole(
                                "ADMIN",
                                "RECEPCIONISTA"
                        )


                        // =====================================================
                        // ELIMINACION
                        // =====================================================

                        // Solamente ADMIN puede eliminar informacion operativa.
                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/clientes/**",
                                "/api/agenda/**",
                                "/api/cursos/**",
                                "/api/diplomados/**",
                                "/api/espacios/**",
                                "/api/inscripciones/**",
                                "/api/catering/**",
                                "/api/cotizaciones/**"
                        )
                        .hasRole("ADMIN")


                        // =====================================================
                        // RESTO DE ENDPOINTS
                        // =====================================================

                        // Todo lo que no haya sido definido anteriormente
                        // requiere autenticacion.
                        .anyRequest().authenticated()
                )


                // =============================================================
                // MANEJO DE ERRORES DE SEGURIDAD
                // =============================================================

                .exceptionHandling(exception -> exception

                        // Usuario no autenticado -> 401
                        .authenticationEntryPoint(
                                (request, response, authException) ->
                                        response.sendError(
                                                HttpServletResponse.SC_UNAUTHORIZED,
                                                "No autorizado"
                                        )
                        )

                        // Usuario autenticado sin permisos -> 403
                        .accessDeniedHandler(
                                (request, response, accessDeniedException) ->
                                        response.sendError(
                                                HttpServletResponse.SC_FORBIDDEN,
                                                "Acceso denegado"
                                        )
                        )
                )


                // =============================================================
                // SESION
                // =============================================================

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )


                // =============================================================
                // AUTENTICACION
                // =============================================================

                .authenticationProvider(authenticationProvider())


                // JWT antes del filtro de autenticacion estandar
                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }


    // =============================================================
    // AUTHENTICATION PROVIDER
    // =============================================================

    @Bean
    public AuthenticationProvider authenticationProvider() {

        DaoAuthenticationProvider provider =
                new DaoAuthenticationProvider(userDetailsService);

        provider.setPasswordEncoder(passwordEncoder());

        return provider;
    }


    // =============================================================
    // AUTHENTICATION MANAGER
    // =============================================================

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration)
            throws Exception {

        return configuration.getAuthenticationManager();
    }


    // =============================================================
    // PASSWORD ENCODER
    // =============================================================

    @Bean
    public PasswordEncoder passwordEncoder() {

        return new BCryptPasswordEncoder();
    }
}