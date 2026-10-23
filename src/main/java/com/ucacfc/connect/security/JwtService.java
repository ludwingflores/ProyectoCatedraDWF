package com.ucacfc.connect.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

// Clase que sirve para validad y leer JWT
@Service
public class JwtService {

    // Estas anotaciones leen valores de la configuración de Spring Boot desde application.properties
    // jwt.secret es la clave secreta utilizada para firmar y verificar los tokens
    @Value("${jwt.secret}")
    private String secretKey;

    // jwt.expiration es el tiempo de vida del token en milisegundos
    @Value("${jwt.expiration}")
    private long jwtExpiration;

    public String extractUsername(String token) {
        // Para obtener el usuario
        return extractClaim(token, Claims::getSubject); 
    }

    // Extrae informacion del token
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails);
    }

    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        // .builder() Inicia la construcción del JWT.
        // .claims agrega informacion al token, el usuario, el tiempo de expiracion y la firma
        return Jwts.builder() 
        .claims(extraClaims).subject(userDetails.getUsername())
        .issuedAt(new Date(System.currentTimeMillis())).expiration(new Date(System.currentTimeMillis() + jwtExpiration))
        .signWith(getSignInKey()).compact();
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {

        final String username = extractUsername(token);
        // Devuelve true si el usuario es igual al nombre proporcionado y si el token no ha expirado
        return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    // Jwts.parser(): crea el analizador del JWT.
    // parseSignedClaims(token): analiza el token firmado y comprueba su validez criptográfica.
    // getPayload(): devuelve los datos contenidos en el token
    private Claims extractAllClaims(String token) {
        return Jwts.parser().verifyWith(getSignInKey()).build().parseSignedClaims(token).getPayload();
    }

    // Aqui se transforma la clave secreta en una clave criptográfica que la biblioteca JJWT puede usar
    // crea la clave para firmar y verificar el JWT mediante el algoritmo HMAC
    private SecretKey getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}