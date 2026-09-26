package com.ucacfc.connect.dto;

public class AuthResponse {

    private String token;
    private String tipo;
    private Long usuarioId;
    private String nombre;
    private String correo;
    private String rol;

    public AuthResponse() {
    }

    public AuthResponse(
            String token,
            Long usuarioId,
            String nombre,
            String correo,
            String rol) {

        this.token = token;
        this.tipo = "Bearer";
        this.usuarioId = usuarioId;
        this.nombre = nombre;
        this.correo = correo;
        this.rol = rol;
    }

    public String getToken() {
        return token;
    }

    public String getTipo() {
        return tipo;
    }

    public Long getUsuarioId() {
        return usuarioId;
    }

    public String getNombre() {
        return nombre;
    }

    public String getCorreo() {
        return correo;
    }

    public String getRol() {
        return rol;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }
}