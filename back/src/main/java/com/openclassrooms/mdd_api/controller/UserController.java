package com.openclassrooms.mdd_api.controller;

import com.openclassrooms.mdd_api.dto.UpdateProfileRequest;
import com.openclassrooms.mdd_api.dto.UserResponse;
import com.openclassrooms.mdd_api.entity.User;
import com.openclassrooms.mdd_api.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/** Endpoints de gestion du profil de l'utilisateur connecté. */
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /**
     * Retourne le profil de l'utilisateur authentifié.
     *
     * @param user utilisateur authentifié
     * @return id, email et nom d'utilisateur
     */
    @GetMapping("/me")
    public ResponseEntity<UserResponse> getProfile(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(userService.getProfile(user));
    }

    /**
     * Met à jour les informations du profil (email, username et/ou mot de passe).
     * Seuls les champs renseignés sont modifiés.
     *
     * @param user    utilisateur authentifié
     * @param request champs à mettre à jour (tous optionnels)
     * @return profil mis à jour
     */
    @PutMapping("/me")
    public ResponseEntity<UserResponse> updateProfile(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(userService.updateProfile(user, request));
    }
}
