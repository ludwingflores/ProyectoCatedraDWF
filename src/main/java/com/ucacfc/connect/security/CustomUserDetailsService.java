package com.ucacfc.connect.security;

import com.ucacfc.connect.model.Usuario;
import com.ucacfc.connect.repository.UsuarioRepository;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

// Clase que sirve como puente para la Base de datos y Spring Security, con esta clase traemos los datos del usuario
// y los guardamos en una clase de UserDetails, luego los datos dentro de esa clase los comparamos con los que vienen en el front
@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;

    public CustomUserDetailsService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String correo) throws UsernameNotFoundException {

        // Traemos el usuario por su correo, si no lo encuentra manda una excepcion
        Usuario usuario = usuarioRepository.findByCorreo(correo).orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado con correo: " + correo));

        // Guardamos el rol y el nombre del usuario en una variable
        String rol = usuario.getRol().getNombre();

        // Con el .builder() guardamos esos datos del usuario en una clase UserDetails
        return User.builder().username(usuario.getCorreo()).password(usuario.getPassword()).authorities(List.of(
                new SimpleGrantedAuthority("ROLE_" + rol.toUpperCase())))
                .disabled(!usuario.getActivo())
                .build();
    }
}