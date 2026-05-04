package com.openclassrooms.mdd_api.controller;

import com.openclassrooms.mdd_api.dto.AuthResponse;
import com.openclassrooms.mdd_api.dto.LoginRequest;
import com.openclassrooms.mdd_api.dto.RegisterRequest;
import com.openclassrooms.mdd_api.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/** Endpoints publics d'authentification (inscription et connexion). */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * Inscrit un nouvel utilisateur et retourne un JWT.
     *
     * @param request données d'inscription (email, username, password)
     * @return token JWT et informations de l'utilisateur créé
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    /**
     * Authentifie un utilisateur par email ou nom d'utilisateur et retourne un JWT.
     *
     * @param request identifiant (email ou username) et mot de passe
     * @return token JWT et informations de l'utilisateur
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}
