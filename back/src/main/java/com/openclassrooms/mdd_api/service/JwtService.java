package com.openclassrooms.mdd_api.service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Date;

/** Génération et validation des tokens JWT (algorithme HMAC256). */
@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expiration;

    /**
     * Génère un token JWT signé dont le sujet est l'email de l'utilisateur.
     *
     * @param email adresse e-mail utilisée comme sujet du token
     * @return token JWT signé, valide pour la durée configurée dans {@code jwt.expiration}
     */
    public String generateToken(String email) {
        return JWT.create()
                .withSubject(email)
                .withIssuedAt(new Date())
                .withExpiresAt(new Date(System.currentTimeMillis() + expiration))
                .sign(Algorithm.HMAC256(secret));
    }

    /**
     * Valide la signature et l'expiration du token, puis retourne son sujet (email).
     *
     * @param token token JWT à vérifier
     * @return email extrait du sujet du token
     * @throws com.auth0.jwt.exceptions.JWTVerificationException si le token est invalide ou expiré
     */
    public String validateTokenAndGetSubject(String token) {
        return JWT.require(Algorithm.HMAC256(secret))
                .build()
                .verify(token)
                .getSubject();
    }
}
