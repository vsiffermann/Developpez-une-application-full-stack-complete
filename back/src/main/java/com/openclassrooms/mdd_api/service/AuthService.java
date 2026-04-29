package com.openclassrooms.mdd_api.service;

import com.openclassrooms.mdd_api.dto.AuthResponse;
import com.openclassrooms.mdd_api.dto.LoginRequest;
import com.openclassrooms.mdd_api.dto.RegisterRequest;
import com.openclassrooms.mdd_api.entity.User;
import com.openclassrooms.mdd_api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Cet email est déjà utilisé");
        }
        if (userRepository.existsByUsername(request.username())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ce nom d'utilisateur est déjà utilisé");
        }

        User user = User.builder()
                .email(request.email())
                .username(request.username())
                .password(passwordEncoder.encode(request.password()))
                .build();

        user = userRepository.save(user);
        String token = jwtService.generateToken(user.getEmail());

        return new AuthResponse(token, new AuthResponse.UserInfo(user.getId(), user.getEmail(), user.getUsername()));
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.identifier())
                .or(() -> userRepository.findByUsername(request.identifier()))
                .orElseThrow(() -> new BadCredentialsException("Identifiants invalides"));

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new BadCredentialsException("Identifiants invalides");
        }

        String token = jwtService.generateToken(user.getEmail());
        return new AuthResponse(token, new AuthResponse.UserInfo(user.getId(), user.getEmail(), user.getUsername()));
    }
}
