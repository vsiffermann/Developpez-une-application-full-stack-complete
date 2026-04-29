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

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserResponse getProfile(User user) {
        return new UserResponse(user.getId(), user.getEmail(), user.getUsername());
    }

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
