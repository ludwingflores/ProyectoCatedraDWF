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

import java.util.List;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {
        
        private final JwtAuthenticationFilter jwtAuthenticationFilter;
        private final CustomUserDetailsService userDetailsService;

        public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter, CustomUserDetailsService userDetailsService) {
                this.jwtAuthenticationFilter = jwtAuthenticationFilter;
                this.userDetailsService = userDetailsService;
        }

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
                http.csrf(csrf -> csrf.disable()).cors(cors -> cors.configurationSource(corsConfigurationSource())).authorizeHttpRequests(auth -> auth
                        
                        // => Endpoints publicos

                        // Login
                        .requestMatchers("/api/auth/**").permitAll()

                        // Swagger / OpenAPI
                        .requestMatchers("/swagger-ui/**", "/swagger-ui.html", "/v3/api-docs/**").permitAll()

                        // Health check
                        .requestMatchers("/actuator/health").permitAll()

                        // Manejo interno de errores
                        .requestMatchers("/error").permitAll()

                        // => Administracion

                        // Usuarios: solamente ADMIN
                        .requestMatchers("/api/usuarios/**").hasRole("ADMIN")

                        // Roles: solamente ADMIN
                        .requestMatchers("/api/roles/**").hasRole("ADMIN")

                        // => Catalogos academicos
                        
                        //Todos los roles operativos pueden consultar los catalogos academicos.
                        // Los Controllers limitan a usuarios no ADMIN para que solamente puedan visualizar registros activos.
                        .requestMatchers(HttpMethod.GET, "/api/categorias/**", "/api/modalidades/**", "/api/docentes/**")
                        .hasAnyRole("ADMIN", "RECEPCIONISTA", "CONTABILIDAD", "CLIENTE")

                        // Solamente ADMIN puede crear registros en los catalogos academicos.
                        .requestMatchers(HttpMethod.POST, "/api/categorias/**", "/api/modalidades/**", "/api/docentes/**").hasRole("ADMIN")

                        // Solamente ADMIN puede modificar registros de los catalogos academicos.
                        .requestMatchers(HttpMethod.PUT, "/api/categorias/**", "/api/modalidades/**", "/api/docentes/**").hasRole("ADMIN")

                        // DELETE realiza baja logica solamente ADMIN puede ejecutarla.
                        .requestMatchers(HttpMethod.DELETE, "/api/categorias/**", "/api/modalidades/**", "/api/docentes/**").hasRole("ADMIN")

                        // => Pagos 

                        // Pagos: ADMIN y CONTABILIDAD
                        .requestMatchers("/api/pagos/**").hasAnyRole("ADMIN", "CONTABILIDAD")

                        // => Consultas operativas

                        // ADMIN, RECEPCIONISTA, CONTABILIDAD y CLIENTE pueden consultar informacion operativa.
                        // Los controladores y servicios correspondientes limitan al CLIENTE a sus propios registros cuando aplica.
                        .requestMatchers(HttpMethod.GET,
                                "/api/clientes/**",
                                "/api/agenda/**",
                                "/api/cursos/**",
                                "/api/diplomados/**",
                                "/api/espacios/**",
                                "/api/inscripciones/**",
                                "/api/catering/**",
                                "/api/alquileres/**",
                                "/api/cotizaciones/**")
                                .hasAnyRole("ADMIN", "RECEPCIONISTA", "CONTABILIDAD", "CLIENTE")

                        // => Catering

                        // ADMIN y RECEPCIONISTA pueden registrar solicitudes para clientes.
                        // CLIENTE puede crear su propia solicitud, CateringService obtiene el cliente desde el JWT.
                        .requestMatchers(HttpMethod.POST,"/api/catering/**").hasAnyRole("ADMIN", "RECEPCIONISTA", "CLIENTE")

                        // => Creacion de alquileres

                        // ADMIN y RECEPCIONISTA pueden registrar alquileres para cualquier cliente.
                        // CLIENTE puede registrar su propio alquiler, AlquilerService obtiene el cliente desde el JWT.
                        .requestMatchers(HttpMethod.POST, "/api/alquileres/**").hasAnyRole("ADMIN", "RECEPCIONISTA", "CLIENTE")

                        // => Creacion de cotizaciones

                        // ADMIN y RECEPCIONISTA pueden crear cotizaciones para cualquier cliente
                        // CLIENTE puede solicitar su propia cotización, CotizacionService obtiene el cliente desde el JWT.
                        .requestMatchers(HttpMethod.POST, "/api/cotizaciones/**").hasAnyRole("ADMIN", "RECEPCIONISTA", "CLIENTE")

                        // => Creacion de informacion operativa

                        // Creacion de informacion operativa para que lo vea solamente el ADMIN y RECEPCIONISTA.
                        .requestMatchers(HttpMethod.POST,
                                "/api/clientes/**",
                                "/api/agenda/**",
                                "/api/cursos/**",
                                "/api/diplomados/**",
                                "/api/espacios/**",
                                "/api/inscripciones/**")
                                .hasAnyRole("ADMIN", "RECEPCIONISTA")

                        // => Actualizacion de informacion operativa
                        .requestMatchers(HttpMethod.PUT,
                                "/api/clientes/**",
                                "/api/agenda/**",
                                "/api/cursos/**",
                                "/api/diplomados/**",
                                "/api/espacios/**",
                                "/api/inscripciones/**",
                                "/api/catering/**",
                                "/api/alquileres/**",
                                "/api/cotizaciones/**")
                                .hasAnyRole("ADMIN", "RECEPCIONISTA")

                        // => Eliminacion de informacion operativa

                        // Solamente ADMIN puede eliminar informacion operativa.
                        .requestMatchers(HttpMethod.DELETE,
                                "/api/clientes/**",
                                "/api/agenda/**",
                                "/api/cursos/**",
                                "/api/diplomados/**",
                                "/api/espacios/**",
                                "/api/inscripciones/**",
                                "/api/catering/**",
                                "/api/alquileres/**",
                                "/api/cotizaciones/**")
                                .hasRole("ADMIN")

                        // => Catalogo de Servicios de catering

                        // ADMIN, RECEPCIONISTA y CLIENTE pueden consultar los servicios de catering disponibles.
                        .requestMatchers(HttpMethod.GET, "/api/servicios-catering/**").hasAnyRole("ADMIN", "RECEPCIONISTA", "CLIENTE")

                        // Solamente ADMIN puede crear servicios de catering.
                        .requestMatchers(HttpMethod.POST, "/api/servicios-catering/**").hasRole("ADMIN")

                        // Solamente ADMIN puede modificar el catalogo.
                        .requestMatchers(HttpMethod.PUT, "/api/servicios-catering/**").hasRole("ADMIN")

                        // DELETE realiza borrado logico del servicio
                        // Solamente ADMIN tiene permiso.
                        .requestMatchers(HttpMethod.DELETE, "/api/servicios-catering/**").hasRole("ADMIN")

                        // => Resto de Endpoints

                        // Todo endpoint no definido anteriormente requiere autenticacion.
                        .anyRequest().authenticated())

                        // => Manejo de errores de seguridad

                        .exceptionHandling(exception -> exception

                        // Usuario no autenticado -> 401
                        .authenticationEntryPoint((request, response, authException) -> response.sendError(HttpServletResponse.SC_UNAUTHORIZED,"No autorizado"))

                        // Usuario autenticado sin permisos -> 403
                        .accessDeniedHandler((request, response, accessDeniedException) -> response.sendError(HttpServletResponse.SC_FORBIDDEN,"Acceso denegado")))

                        // => Sesion

                        .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                        // Autenticacion

                        .authenticationProvider(authenticationProvider())

                        // JWT antes del filtro de autenticacion estandar
                        .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }

        // Autentication provider
        @Bean
        public AuthenticationProvider authenticationProvider() {

                DaoAuthenticationProvider provider = new DaoAuthenticationProvider(userDetailsService);
                provider.setPasswordEncoder(passwordEncoder());
                return provider;
        }

        // Autentication manager
        @Bean
        public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
                return configuration.getAuthenticationManager();
        }

        // Password encoder
       @Bean
       public PasswordEncoder passwordEncoder(){
                return new BCryptPasswordEncoder();
        }

        // Cors
        @Bean
        public CorsConfigurationSource corsConfigurationSource() {

                CorsConfiguration configuration = new CorsConfiguration();
                
                configuration.setAllowedOrigins(List.of("http://localhost:5173", "https://cfc-connect-frontend-william.azurewebsites.net"));
                configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));

                configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));

                configuration.setExposedHeaders(List.of("Authorization"));

                configuration.setAllowCredentials(true);

                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

                source.registerCorsConfiguration("/**", configuration);
                
                return source;
        }

}