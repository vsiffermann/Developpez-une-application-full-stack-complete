package com.openclassrooms.mdd_api.service;

import com.openclassrooms.mdd_api.dto.UpdateProfileRequest;
import com.openclassrooms.mdd_api.dto.UserResponse;
import com.openclassrooms.mdd_api.entity.User;
import com.openclassrooms.mdd_api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

/** Logique métier de gestion du profil utilisateur. */
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Retourne le profil de l'utilisateur sous forme de DTO.
     *
     * @param user utilisateur authentifié
     * @return id, email et nom d'utilisateur
     */
    public UserResponse getProfile(User user) {
        return new UserResponse(user.getId(), user.getEmail(), user.getUsername());
    }

    /**
     * Met à jour les champs renseignés du profil utilisateur (email, username, mot de passe).
     * Seuls les champs non nuls de la requête sont appliqués.
     *
     * @param user    utilisateur authentifié à modifier
     * @param request champs à mettre à jour (tous optionnels)
     * @return profil mis à jour
     * @throws org.springframework.web.server.ResponseStatusException 409 si le nouvel email ou username est déjà utilisé
     */
    public UserResponse updateProfile(User user, UpdateProfileRequest request) {
        if (request.email() != null && !request.email().equals(user.getEmail())) {
            if (userRepository.existsByEmail(request.email())) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Cet email est déjà utilisé");
            }
            user.setEmail(request.email());
        }

        if (request.username() != null && !request.username().equals(user.getUsername())) {
            if (userRepository.existsByUsername(request.username())) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Ce nom d'utilisateur est déjà utilisé");
            }
            user.setUsername(request.username());
        }

        if (request.password() != null) {
            user.setPassword(passwordEncoder.encode(request.password()));
        }

        User saved = userRepository.save(user);
        return new UserResponse(saved.getId(), saved.getEmail(), saved.getUsername());
    }
}
