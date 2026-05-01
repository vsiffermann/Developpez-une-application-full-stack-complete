package com.openclassrooms.mdd_api.service;

import com.openclassrooms.mdd_api.dto.LoginRequest;
import com.openclassrooms.mdd_api.dto.RegisterRequest;
import com.openclassrooms.mdd_api.entity.User;
import com.openclassrooms.mdd_api.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JwtService jwtService;
    @InjectMocks private AuthService authService;

    // --- register ---

    @Test
    void register_success_returnsTokenAndUserInfo() {
        // given email and username are both available, when register is called, then an AuthResponse with a token and user info is returned
    }

    @Test
    void register_emailAlreadyExists_throwsConflict() {
        // given userRepository.existsByEmail returns true, when register is called, then a ResponseStatusException with status 409 is thrown
    }

    @Test
    void register_usernameAlreadyExists_throwsConflict() {
        // given existsByEmail returns false and existsByUsername returns true, when register is called, then a ResponseStatusException with status 409 is thrown
    }

    // --- login ---

    @Test
    void login_withEmail_success() {
        // given a user is found by email and the password matches, when login is called, then an AuthResponse with a token and user info is returned
    }

    @Test
    void login_withUsername_success() {
        // given findByEmail returns empty but findByUsername returns a user with a matching password, when login is called, then an AuthResponse is returned
    }

    @Test
    void login_userNotFound_throwsBadCredentials() {
        // given findByEmail and findByUsername both return empty, when login is called, then BadCredentialsException is thrown
    }

    @Test
    void login_wrongPassword_throwsBadCredentials() {
        // given a user is found but passwordEncoder.matches returns false, when login is called, then BadCredentialsException is thrown
    }
}
